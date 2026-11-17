"""Recording-signal diagnostics for VocaMini Phase 6.1.

These measurements assess basic WAV recording conditions ONLY. They do not
identify phonemes, infer an accent, or produce a pronunciation score.
No external dependency, persistent recording, or network request is needed.
"""

from __future__ import annotations

from array import array
import io
import math
import sys
import wave

SAMPLE_RATE = 16000
FRAME_SAMPLES = 320  # 20 ms
ACTIVE_THRESHOLD = 10 ** (-42 / 20)  # rough acoustic activity, NOT speech VAD


def analyze_wav(wav_bytes: bytes) -> dict:
    """Analyze a mono 16-kHz PCM16 WAV file and return display-safe metrics."""
    with wave.open(io.BytesIO(wav_bytes), "rb") as wav:
        if (wav.getnchannels(), wav.getsampwidth(), wav.getframerate(), wav.getcomptype()) != (1, 2, SAMPLE_RATE, "NONE"):
            raise ValueError("Yêu cầu WAV PCM16, mono, 16000 Hz (không nén).")
        frame_count = wav.getnframes()
        if not (1600 <= frame_count <= SAMPLE_RATE * 16):
            raise ValueError("Bản ghi phải dài 0,1–16 giây.")
        raw = wav.readframes(frame_count)

    samples = array("h")
    samples.frombytes(raw)
    if sys.byteorder != "little":
        samples.byteswap()
    if len(samples) != frame_count:
        raise ValueError("Dữ liệu PCM không đầy đủ.")

    total_sq = sum(int(x) * int(x) for x in samples)
    rms = math.sqrt(total_sq / len(samples)) / 32768
    peak = max(abs(int(x)) for x in samples) / 32768
    clipped = sum(abs(int(x)) >= 32700 for x in samples)

    active = 0
    frames = 0
    for start in range(0, len(samples), FRAME_SAMPLES):
        chunk = samples[start:start + FRAME_SAMPLES]
        if not chunk:
            continue
        frame_rms = math.sqrt(sum(int(x) * int(x) for x in chunk) / len(chunk)) / 32768
        active += frame_rms >= ACTIVE_THRESHOLD
        frames += 1

    def to_dbfs(level: float) -> float:
        return round(20 * math.log10(max(level, 10 ** (-96 / 20))), 1)

    duration = round(len(samples) / SAMPLE_RATE, 2)
    rms_dbfs = to_dbfs(rms)
    peak_dbfs = to_dbfs(peak)
    clipping_pct = round(100 * clipped / len(samples), 2)
    active_pct = round(100 * active / max(frames, 1))

    advice = []
    if rms_dbfs <= -55:
        advice.append("Gần như không có tín hiệu âm thanh; kiểm tra microphone và ghi lại.")
    elif rms_dbfs < -35:
        advice.append("Âm lượng khá nhỏ; đưa micro gần hơn và thử lại.")
    if clipped / len(samples) >= 0.005:
        advice.append("Tín hiệu có dấu hiệu chạm ngưỡng (clipping); giảm âm lượng đầu vào hoặc lùi micro ra.")
    if duration < 0.5:
        advice.append("Bản ghi quá ngắn để luyện từ; thử đọc rõ ràng và ghi lâu hơn.")
    if not advice:
        advice.append("Không phát hiện lỗi mức âm lượng cơ bản; hãy nghe A/B để tự kiểm tra phát âm.")

    return {
        "duration_s": duration,
        "rms_dbfs": rms_dbfs,
        "peak_dbfs": peak_dbfs,
        "clipped_pct": clipping_pct,
        "active_signal_pct": active_pct,
        "status": "check_recording" if (rms_dbfs < -35 or clipping_pct >= 0.5 or duration < 0.5) else "signal_ok",
        "advice": advice,
        "recording_quality_only": True,
    }
