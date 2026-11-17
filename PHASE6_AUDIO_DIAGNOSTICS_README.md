# VocaMini Phase 6.1 — Kiểm tra tín hiệu trước khi chấm phát âm

## Thực hiện

- Backend dùng thư viện chuẩn Python để phân tích WAV PCM16 mono, 16 kHz sau khi người dùng **chủ động nhấn nút Vosk**.
- Trả thêm đối tượng `recording_quality` trong JSON của `/api/pronunciation/recognize`. Vẫn giữ các trường cũ `expected`, `recognized`, `matched`, `recognition_only`.
- Frontend hiển thị thời lượng, âm lượng trung bình RMS (dBFS), peak (dBFS), phần trăm mẫu gần clipping và phần trăm khung 20 ms có năng lượng vượt ngưỡng tham khảo.
- Cảnh báo tín hiệu quá nhỏ, clipping hoặc bản ghi ngắn. Các ngưỡng là **heuristic**, cần kiểm chứng thêm với thiết bị thực tế.
- Không lưu file ghi âm xuống đĩa; backend chỉ làm việc trong RAM. Không có dịch vụ cloud hoặc gói pip mới.

## Điều Phase 6.1 CHƯA làm

- Không xác định lỗi từng âm vị, không so sánh tín hiệu với giọng mẫu, không đo độ chính xác phát âm, không chấm giọng US/UK.
- `active_signal_pct` là tỷ lệ khung có **năng lượng âm**, không phải VAD phát hiện tiếng nói; tiếng ồn cũng có thể làm chỉ số tăng.
- Vosk vẫn chỉ nhận diện từ bằng model `small-en-us`, áp dụng như cũ cho cả hai lựa chọn phát âm.

## Chạy trên Windows PowerShell

```powershell
Set-Location -LiteralPath "E:\01_Projects\Tu vung"
.\.venv\Scripts\python.exe -m unittest discover -s tests -p 'test_audio_diagnostics.py' -v
node --check .\pronunciation\recorder.js
node --test .\tests\minimal-pairs.test.cjs .\tests\minimal-pairs-ui.test.cjs
.\.venv\Scripts\python.exe .\pronunciation\offline_server.py
```

Trên trang từ điển, ghi âm từ `water`, nhấn **Kiểm tra máy nghe được gì**. Bên dưới kết quả Vosk sẽ xuất hiện **Kiểm tra tín hiệu ghi âm**. Đọc bình thường, nói nhỏ và thử gần mic để kiểm tra cảnh báo.

Sau khi sửa mã, có thể cần Unregister Service Worker + làm mới trình duyệt vì cache đã đổi từ `v7` sang `v8`. **Không xóa Local Storage.**

## Nghiên cứu Phase 6.2: phoneme alignment

Một lựa chọn chuyên sâu là Montreal Forced Aligner (MFA), cần môi trường conda riêng cùng acoustic model/dictionary và có bước đánh giá khả năng căn chỉnh âm vị. Căn chỉnh chỉ dự đoán **vị trí âm** khi đã biết văn bản, không tự chứng minh âm đó phát âm đúng. Không ép MFA vào `.venv` Python/Vosk đang ổn định; trước tiên cần thử nghiệm độc lập có dữ liệu kiểm chứng.

## Danh sách điều chỉnh sau cùng

Ghi các vị trí UI, lỗi nhận diện hoặc trải nghiệm bạn đánh dấu vào file `PHASE6_REVIEW_NOTES.md`. Gom thay đổi cuối cùng sau khi hoàn thành và nghiệm thu từng phase.
