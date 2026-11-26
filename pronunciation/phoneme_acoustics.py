"""Phase 6.3A: descriptive PCM measurements inside REAL MFA phone intervals.

This code intentionally DOES NOT evaluate pronunciation correctness. MFA aligns to
an expected transcript, so phone spans may be wrong if a word was mispronounced.
Only standard-library Python is used and no waveform bytes are retained.
"""
from __future__ import annotations

from array import array
import io
import math
import re
import sys
import wave

SAMPLE_RATE_HZ = 16000
MAX_SECONDS = 16
MAX_PHONES = 40
PHONE_LABEL = re.compile(r"[A-Za-z][A-Za-z0-9_]*\Z")


def _to_dbfs(amplitude: float) -> float:
    """Limit the display's silence floor to -96 dBFS, like Audio Diagnostics."""
    return round(20 * math.log10(max(amplitude, 10 ** (-96 / 20))), 1)


def extract_phoneme_features(wav_bytes: bytes, intervals: list[dict]) -> dict:
    """Return descriptive time-domain features scoped to MFA-provided intervals.

    No boundaries are inferred or altered. We reject malformed/out-of-range
    alignment data instead of silently inventing phone positions.
    """
    if not isinstance(intervals, list) or not 1 <= len(intervals) <= MAX_PHONES:
        raise ValueError("Cần từ 1 đến 40 khoảng âm vị hợp lệ từ MFA.")
    try:
        with wave.open(io.BytesIO(wav_bytes), "rb") as wav:
            if (wav.getnchannels(), wav.getsampwidth(), wav.getframerate(), wav.getcomptype()) != (1, 2, SAMPLE_RATE_HZ, "NONE"):
                raise ValueError("Chỉ hỗ trợ WAV PCM16 mono 16000 Hz.")
            total_frames = wav.getnframes()
            if not SAMPLE_RATE_HZ // 4 <= total_frames <= MAX_SECONDS * SAMPLE_RATE_HZ:
                raise ValueError("Bản ghi phải dài 0,25–16 giây.")
            raw = wav.readframes(total_frames)
    except (wave.Error, EOFError) as exc:
        raise ValueError("Không đọc được WAV để phân tích đặc trưng âm học.") from exc

    samples = array("h")
    if len(raw) != total_frames * 2:
        raise ValueError("File WAV bị thiếu dữ liệu âm thanh.")
    samples.frombytes(raw)
    if sys.byteorder != "little":
        samples.byteswap()
    duration = total_frames / SAMPLE_RATE_HZ

    result = []
    last_end = 0.0
    for index, item in enumerate(intervals):
        if not isinstance(item, dict):
            raise ValueError("Khoảng âm vị không hợp lệ.")
        label = item.get("phone")
        a = item.get("start_s")
        b = item.get("end_s")
        if not isinstance(label, str) or not PHONE_LABEL.fullmatch(label):
            raise ValueError("Nhãn ARPAbet không hợp lệ.")
        if any(isinstance(v, bool) or not isinstance(v, (int, float)) for v in (a, b)):
            raise ValueError("Thời gian âm vị không hợp lệ.")
        start, end = float(a), float(b)
        if (not math.isfinite(start) or not math.isfinite(end)
                or start < 0 or end <= start or end > duration + 0.005
                or (index and start < last_end - 0.03)):
            raise ValueError("Khoảng âm vị nằm ngoài bản ghi hoặc chồng lấn.")
        last_end = end
        # Only quantize boundaries to PCM sample indices; no new phone times.
        left = max(0, min(total_frames, math.floor(start * SAMPLE_RATE_HZ)))
        right = max(0, min(total_frames, math.ceil(end * SAMPLE_RATE_HZ)))
        if right <= left:
            raise ValueError("Khoảng âm vị quá ngắn để lấy mẫu PCM.")
        chunk = samples[left:right]
        n = len(chunk)
        rms = math.sqrt(sum(int(s) * int(s) for s in chunk) / n) / 32768.0
        peak = max(abs(int(s)) for s in chunk) / 32768.0
        clipped = sum(abs(int(s)) >= 32700 for s in chunk)
        # ZCR: sign reversals per second (not pitch, phoneme identity or accuracy).
        # Zeros/silence do not count as crossings.
        prev_sign = 0
        crossings = 0
        for sample in chunk:
            sign = (sample > 0) - (sample < 0)
            if sign:
                if prev_sign and sign != prev_sign:
                    crossings += 1
                prev_sign = sign
        measured_span_s = n / SAMPLE_RATE_HZ
        result.append({
            "phone": label,
            "start_s": round(start, 3),
            "end_s": round(end, 3),
            "duration_ms": round((end - start) * 1000, 1),
            "rms_dbfs": _to_dbfs(rms),
            "peak_dbfs": _to_dbfs(peak),
            "zero_crossings_per_s": round(crossings / measured_span_s, 1),
            "clipped_pct": round(100 * clipped / n, 2),
        })

    return {
        "source": "pcm16_mfa_interval_features",
        "status": "extracted",
        "feature_only": True,
        "pronunciation_score": None,
        "sample_rate_hz": SAMPLE_RATE_HZ,
        "duration_s": round(duration, 3),
        "intervals": result,
        "note": "Đặc trưng tín hiệu trong khoảng MFA ước tính; không chấm đúng/sai, không đo giọng US/UK.",
    }
