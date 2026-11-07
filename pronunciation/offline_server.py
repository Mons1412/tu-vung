"""VocaMini local-only static server with offline Vosk word recognition.

Run from the project directory: python pronunciation/offline_server.py
Binds to 127.0.0.1:5500 only; never uploads audio to a cloud service.
"""

from __future__ import annotations

import io
import math
import json
import re
import sys
import urllib.parse
import wave
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from vosk import KaldiRecognizer, Model, SetLogLevel
from audio_diagnostics import analyze_wav

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "vosk-model-small-en-us-0.15"
MAX_BODY_BYTES = 1024 * 1024
SetLogLevel(-1)

def normalize(value: str) -> str:
    return " ".join(re.findall(r"[a-z]+(?:'[a-z]+)?", value.lower()))

def valid_word_intervals(results: list[dict], duration_s: float) -> list[dict]:
    """Keep only plausible Vosk WORD timings; never manufacture phoneme timing."""
    output = []
    for result in results:
        for item in result.get("result", []):
            if not isinstance(item, dict):
                continue
            word = normalize(str(item.get("word", "")))
            try:
                start = float(item.get("start"))
                end = float(item.get("end"))
            except (ValueError, TypeError):
                continue
            if (not word or " " in word or not all(map(math.isfinite, [start, end]))
                    or start < 0 or end <= start or start > duration_s + 0.15
                    or end > duration_s + 0.15):
                continue
            # Vosk can be a few milliseconds past the file boundary.
            start = min(start, duration_s)
            end = min(end, duration_s)
            if end <= start:
                continue
            output.append({"word": word, "start_s": round(start, 3), "end_s": round(end, 3)})
    # Vosk results are sequential. Reject overlapping or out-of-order items rather than guessing.
    clean = []
    for item in output:
        if not clean or item["start_s"] >= clean[-1]["end_s"] - 0.02:
            clean.append(item)
    return clean[:80]


def expected_word_span(intervals: list[dict], expected: str) -> dict | None:
    words = normalize(expected).split()
    if not words:
        return None
    for idx in range(len(intervals) - len(words) + 1):
        if [item["word"] for item in intervals[idx:idx + len(words)]] == words:
            return {"start_s": intervals[idx]["start_s"],
                    "end_s": intervals[idx + len(words) - 1]["end_s"]}
    return None


def recognize_with_word_timing(model: Model, wav_bytes: bytes, expected: str) -> tuple[str, dict]:
    with wave.open(io.BytesIO(wav_bytes), "rb") as audio:
        if audio.getnchannels() != 1 or audio.getsampwidth() != 2 or audio.getframerate() != 16000:
            raise ValueError("Yêu cầu WAV PCM 16-bit, mono, 16000 Hz.")
        frames = audio.getnframes()
        if frames < 1600 or frames > 16 * 16000:
            raise ValueError("Bản ghi phải dài 0,1–16 giây.")
        duration_s = frames / 16000
        rec = KaldiRecognizer(model, 16000)
        rec.SetWords(True)  # Ask Vosk / Kaldi to ESTIMATE word boundary timestamps.
        results = []
        while True:
            chunk = audio.readframes(4000)
            if not chunk:
                break
            if rec.AcceptWaveform(chunk):
                results.append(json.loads(rec.Result()))
        results.append(json.loads(rec.FinalResult()))
    detected = normalize(" ".join(item.get("text", "") for item in results))
    intervals = valid_word_intervals(results, duration_s)
    return detected, {
        "source": "vosk_word_timestamps",
        "word_level_only": True,
        "duration_s": round(duration_s, 3),
        "intervals": intervals,
        "expected_span": expected_word_span(intervals, expected),
    }


def recognize(model: Model, wav_bytes: bytes) -> str:
    """Backwards-compatible text-only helper."""
    return recognize_with_word_timing(model, wav_bytes, "")[0]

def make_handler(model: Model):
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(ROOT), **kwargs)

        def send_json(self, status: int, body: dict):
            payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

        def do_GET(self):
            route = urllib.parse.unquote(urllib.parse.urlsplit(self.path).path)
            if route == "/api/pronunciation/health":
                return self.send_json(200, {"status": "ready", "offline": True, "model": "vosk-model-small-en-us-0.15", "recognition_only": True})
            # Local-only server: do not expose source metadata, models, Python env or config.
            parts = route.replace("\\", "/").split("/")
            if any(part.startswith(".") or part == "models" for part in parts if part) or route.endswith(".py"):
                self.send_error(403, "Restricted path")
                return
            return super().do_GET()

        def list_directory(self, path):
            self.send_error(403, "Directory listing disabled")
            return None

        def do_POST(self):
            if self.path != "/api/pronunciation/recognize":
                return self.send_json(404, {"error": "Không tìm thấy API."})
            if self.headers.get("Content-Type", "").split(";", 1)[0].strip() != "audio/wav":
                return self.send_json(415, {"error": "Chỉ chấp nhận audio/wav."})
            try:
                size = int(self.headers.get("Content-Length", "0"))
                if size <= 44 or size > MAX_BODY_BYTES:
                    return self.send_json(413, {"error": "File âm thanh không hợp lệ hoặc quá lớn."})
                expected = urllib.parse.unquote(self.headers.get("X-Expected-Word", ""))
                if len(expected) > 80 or not normalize(expected):
                    return self.send_json(400, {"error": "Từ mục tiêu không hợp lệ."})
                audio = self.rfile.read(size)
                diagnostics = analyze_wav(audio)
                detected, word_timing = recognize_with_word_timing(model, audio, expected)
                needle = normalize(expected)
                matched = bool(detected and needle and (f" {needle} " in f" {detected} "))
                return self.send_json(200, {"expected": expected, "recognized": detected, "matched": matched, "recognition_only": True, "recording_quality": diagnostics, "word_timing": word_timing})
            except (ValueError, wave.Error, EOFError) as error:
                return self.send_json(400, {"error": str(error)})
            except Exception:
                return self.send_json(500, {"error": "Lỗi nhận diện local. Xem Terminal để kiểm tra."})

    return Handler

def main():
    if not MODEL_PATH.is_dir():
        print(f"[ERROR] Chưa có model: {MODEL_PATH}")
        print("Tải vosk-model-small-en-us-0.15.zip từ https://alphacephei.com/vosk/models")
        sys.exit(1)
    print("Đang tải model Vosk vào RAM...")
    model = Model(str(MODEL_PATH))
    server = ThreadingHTTPServer(("127.0.0.1", 5500), make_handler(model))
    print("VocaMini offline ASR: http://localhost:5500")
    print("Phím Ctrl+C để dừng. Không gửi âm thanh ra Internet.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    main()
