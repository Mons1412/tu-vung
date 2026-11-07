"""VocaMini local-only static server with offline Vosk word recognition.

Run from the project directory: python pronunciation/offline_server.py
Binds to 127.0.0.1:5500 only; never uploads audio to a cloud service.
"""

from __future__ import annotations

import io
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

def recognize(model: Model, wav_bytes: bytes) -> str:
    with wave.open(io.BytesIO(wav_bytes), "rb") as audio:
        if audio.getnchannels() != 1 or audio.getsampwidth() != 2 or audio.getframerate() != 16000:
            raise ValueError("Yêu cầu WAV PCM 16-bit, mono, 16000 Hz.")
        if audio.getnframes() < 1600 or audio.getnframes() > 16 * 16000:
            raise ValueError("Bản ghi phải dài 0,1–16 giây.")
        rec = KaldiRecognizer(model, 16000)
        pieces = []
        while True:
            chunk = audio.readframes(4000)
            if not chunk:
                break
            if rec.AcceptWaveform(chunk):
                pieces.append(json.loads(rec.Result()).get("text", ""))
        pieces.append(json.loads(rec.FinalResult()).get("text", ""))
    return normalize(" ".join(pieces))

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
                detected = recognize(model, audio)
                needle = normalize(expected)
                matched = bool(detected and needle and (f" {needle} " in f" {detected} "))
                return self.send_json(200, {"expected": expected, "recognized": detected, "matched": matched, "recognition_only": True, "recording_quality": diagnostics})
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
