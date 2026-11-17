# VocaMini Phase 4 — Offline word recognition (Windows)

Phase 4 **không** chấm phát âm theo âm vị. Nó dùng nhận diện giọng nói (Vosk) để đối chiếu từ máy nghe được với từ mục tiêu. Không nhận đúng có thể do model, tiếng ồn hoặc phát âm; không được coi là lỗi phát âm chắc chắn.

## Chuẩn bị

- Windows 11, Python 3.11 64-bit, VocaMini đã áp dụng Phase 3 free.
- Dừng `http-server` cũ ở port 5500.
- Tải model một lần từ trang chính thức: https://alphacephei.com/vosk/models, chọn `vosk-model-small-en-us-0.15.zip` (~40 MB).
- Giải nén vào `models/vosk-model-small-en-us-0.15/` (trong folder phải có `am`, `conf`, `graph`, v.v.).

## PowerShell

```powershell
Set-Location -LiteralPath "E:\01_Projects\Tu vung"
py -0p
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements-offline.txt
New-Item -ItemType Directory -Force .\models | Out-Null
Expand-Archive -LiteralPath "E:\05_Downloads\vosk-model-small-en-us-0.15.zip" -DestinationPath .\models -Force
.\.venv\Scripts\python.exe .\pronunciation\offline_server.py
```

Truy cập `http://localhost:5500`, tra `water`, ghi âm, nhấn **Kiểm tra máy nghe được gì**. Nếu `py -3.11` không có, hãy cài Python 3.11 x64 rồi chạy lại; kiểm tra `py -0p` trước khi cài.

## Giới hạn

- Vosk ở đây chỉ dùng model tiếng Anh Mỹ cho nhận diện ở cả hai lựa chọn giao diện; `en-GB` vẫn điều khiển giọng mẫu, **không thay đổi model ASR**. Đây không phải hệ thống chấm accent.
- Không chấm 0–100; một từ đơn thường khó nhận diện hơn câu dài.
- Audio được gửi đến Python server chỉ trên `127.0.0.1:5500` khi bấm nhận diện, xử lý RAM và không lưu file.
- Bản thân ứng dụng từ điển vẫn có thể truy cập Internet để tải nguồn mẫu, không offline toàn bộ.
- Nếu port 5500 đang bận, hãy dừng server cũ (`Ctrl+C`) trước.
