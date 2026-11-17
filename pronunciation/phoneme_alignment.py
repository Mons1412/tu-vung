"""Optional MFA one-word forced alignment, strictly separate from Vosk.

No pronunciation scoring. WAV and transcript are written to a TemporaryDirectory
only after explicit request, and are removed after completion. MFA may separately
create diagnostic logs or model caches in its configured work directory.
"""

from __future__ import annotations

import json
import math
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import wave
import io


class AlignmentUnavailable(RuntimeError):
    """MFA is not installed/configured or cannot run."""


class AlignmentFailed(RuntimeError):
    """MFA ran but supplied no valid phoneme intervals."""


SIMPLE_WORD = re.compile(r"[a-z]+(?:'[a-z]+)?\Z")
PHONE_LABEL = re.compile(r"[A-Za-z][A-Za-z0-9_]*\Z")
SILENCE = {"sil", "sp", "spn", "<eps>", ""}


def validate_expected_word(raw: str) -> str:
    word = raw.strip().lower()
    if len(word) > 40 or not SIMPLE_WORD.fullmatch(word):
        raise ValueError("Bản thử nghiệm MFA chỉ hỗ trợ một từ tiếng Anh (a–z, có thể chứa dấu nháy).")
    return word


def duration_of_wav(data: bytes) -> float:
    try:
        with wave.open(io.BytesIO(data), "rb") as audio:
            if (audio.getnchannels(), audio.getsampwidth(), audio.getframerate(), audio.getcomptype()) != (1, 2, 16000, "NONE"):
                raise ValueError("Cần file WAV PCM mono, 16-bit, 16000 Hz.")
            duration = audio.getnframes() / 16000
    except (wave.Error, EOFError) as exc:
        raise ValueError("Bản ghi WAV không hợp lệ.") from exc
    if not 0.25 <= duration <= 16:
        raise ValueError("Bản thử nghiệm cần ghi âm từ 0,25 đến 16 giây.")
    return duration


def parse_mfa_json(content: dict, expected: str, duration_s: float) -> dict:
    """Read *actual MFA JSON* phones tier; never make up boundaries.

    MFA emits {start, end, tiers: {phones: {type: interval, entries: [[start,end,label],...]}}}.
    """
    tiers = content.get("tiers") if isinstance(content, dict) else None
    if not isinstance(tiers, dict):
        raise AlignmentFailed("MFA không trả về định dạng JSON tiers hợp lệ.")

    phone_tiers = [value for key, value in tiers.items()
                   if str(key).lower().split(" - ")[-1] == "phones"]
    if len(phone_tiers) != 1 or not isinstance(phone_tiers[0], dict):
        raise AlignmentFailed("MFA không trả về đúng một lớp phones.")
    entries = phone_tiers[0].get("entries")
    if not isinstance(entries, list):
        raise AlignmentFailed("Lớp phones không có danh sách intervals.")

    phones = []
    prev_end = 0.0
    for entry in entries:
        if not isinstance(entry, (list, tuple)) or len(entry) != 3:
            raise AlignmentFailed("MFA trả về một khoảng âm vị sai cấu trúc.")
        begin, end, label = entry
        if not isinstance(label, str):
            raise AlignmentFailed("Nhãn âm vị không hợp lệ.")
        label = label.strip()
        if label.lower() in SILENCE:
            continue
        if not PHONE_LABEL.fullmatch(label):
            raise AlignmentFailed("Nhãn âm vị không hợp lệ hoặc không thuộc bộ ký hiệu ARPAbet.")
        if isinstance(begin, bool) or isinstance(end, bool) or not isinstance(begin, (int, float)) or not isinstance(end, (int, float)):
            raise AlignmentFailed("Mốc thời gian âm vị không phải số.")
        begin, end = float(begin), float(end)
        if not (math.isfinite(begin) and math.isfinite(end)) or begin < 0 or end <= begin or end > duration_s + 0.08:
            raise AlignmentFailed("Mốc âm vị nằm ngoài phạm vi bản ghi.")
        if begin < prev_end - 0.03:
            raise AlignmentFailed("Các âm vị bị chồng lấn không hợp lệ.")
        prev_end = end
        phones.append({"phone": label, "start_s": round(begin, 3), "end_s": round(min(end, duration_s), 3)})
    if not phones or len(phones) > 40:
        raise AlignmentFailed("MFA chưa căn chỉnh được âm vị nào cho bản ghi này.")
    if any(p["end_s"] <= p["start_s"] for p in phones):
        raise AlignmentFailed("Một mốc thời gian bị rút về 0 sau khi chuẩn hóa.")
    return {
        "source": "montreal_forced_aligner",
        "status": "aligned",
        "phoneme_level_only": True,
        "pronunciation_score": None,
        "expected": expected,
        "model_accent": "en-US",
        "phone_set": "ARPABET",
        "duration_s": round(duration_s, 3),
        "intervals": phones,
        "note": "Căn chỉnh theo từ mục tiêu, không xác thực người đọc đã phát âm đúng.",
    }


def _mfa_base_command() -> list[str]:
    custom = os.environ.get("VOCAMINI_MFA_EXE", "").strip()
    if custom:
        executable = Path(custom).expanduser()
        if not executable.is_file() or executable.suffix.lower() != ".exe":
            raise AlignmentUnavailable("VOCAMINI_MFA_EXE phải là đường dẫn đầy đủ tới mfa.exe trong môi trường Conda.")
        return [str(executable)]
    executable = shutil.which("mfa")
    if executable:
        return [executable]
    conda = shutil.which("conda")
    if conda:
        return [conda, "run", "-n", "vocamini-aligner", "mfa"]
    raise AlignmentUnavailable("Chưa tìm thấy MFA. Cài Miniforge, tạo môi trường vocamini-aligner và khởi động lại server.")


def align_audio_mfa(wav_bytes: bytes, raw_expected: str, accent: str) -> dict:
    if accent != "en-US":
        raise ValueError("Thử nghiệm MFA hiện chỉ dùng mô hình Anh–Mỹ (US). Không sử dụng cho Anh–Anh (UK).")
    expected = validate_expected_word(raw_expected)
    duration_s = duration_of_wav(wav_bytes)
    cmd = _mfa_base_command()
    # Don't let transcripts escape temporary files or become shell input.
    with tempfile.TemporaryDirectory(prefix="vocamini_mfa_") as temp:
        root = Path(temp)
        sound, transcript, aligned = root / "sample.wav", root / "sample.txt", root / "aligned.json"
        sound.write_bytes(wav_bytes)
        transcript.write_text(expected + "\n", encoding="utf-8")
        work = root / "work"
        work.mkdir()
        args = cmd + ["align_one", "--output_format", "json", "--temporary_directory", str(work),
                      str(sound), str(transcript), "english_us_arpa", "english_us_arpa", str(aligned)]
        try:
            run = subprocess.run(args, shell=False, capture_output=True, text=True,
                                 encoding="utf-8", errors="replace", timeout=150, check=False)
        except subprocess.TimeoutExpired as exc:
            raise AlignmentFailed("MFA xử lý quá lâu. Kiểm tra cấu hình và thử bản ghi ngắn hơn.") from exc
        except OSError as exc:
            raise AlignmentUnavailable("Không thể khởi chạy MFA từ môi trường Conda.") from exc
        if run.returncode != 0:
            # Do not echo arbitrary logs or local paths into browser output.
            raise AlignmentFailed("MFA không căn chỉnh được. Kiểm tra mô hình/từ điển hoặc chạy lệnh MFA thủ công để xem log.")
        if not aligned.is_file() or aligned.stat().st_size > 2_000_000:
            raise AlignmentFailed("Không tìm thấy JSON căn chỉnh hợp lệ từ MFA.")
        try:
            payload = json.loads(aligned.read_text(encoding="utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise AlignmentFailed("Không đọc được JSON do MFA tạo ra.") from exc
        return parse_mfa_json(payload, expected, duration_s)
