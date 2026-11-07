# VocaMini — Sổ ghi chú cần chỉnh sửa cuối dự án

> Tệp này chỉ dành cho những điều cần sửa sau khi các phase đã hoàn thành. Không cần sửa ngay khi chưa ảnh hưởng đến chức năng chính.

| ID | Vị trí / Phase | Vấn đề đã đánh dấu | Mức ưu tiên | Hướng xử lý | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| 001 | (điền sau) | (điền sau) | Thấp/Trung bình/Cao | (điền sau) | Chưa xử lý |

## Những điều cần giữ nguyên

- Không phá dữ liệu sổ tay từ vựng trong Local Storage.
- Duy trì lựa chọn Anh–Anh / Anh–Mỹ và ghi âm A/B.
- Vosk nhận diện từ offline, không được gọi là bộ chấm phát âm.
- Không commit `.venv/`, `models/`, `.env`, bản ghi người dùng.

## Tiêu chuẩn sửa cuối

- Có bước tái hiện cho mỗi lỗi, có kiểm thử sau sửa.
- Các thay đổi giao diện được kiểm tra cả Windows desktop và màn hình điện thoại.
- Không hứa chấm âm vị nếu chưa có dữ liệu hoặc mô hình đã kiểm chứng.

## Phase 6.2A notes

- Mốc theo từ Vosk: có thể sai ở tiếng ồn, âm ngắn, hoặc ASR nhận sai từ.
- Chưa tích hợp MFA và chưa có mốc từng âm vị thực sự. Cần test mô hình, từ điển và căn chỉnh với bản ghi của người học.
