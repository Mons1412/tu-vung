# VocaMini — Phase 5: Minimal Pairs & Phoneme Guide

## Tính năng mới

- 6 bài tập minimal pairs: `ship/sheep`, `sit/seat`, `full/fool`, `thin/tin`, `very/berry`, `cap/cup`.
- IPA tham khảo theo từng lựa chọn `en-US` / `en-GB`.
- Giải thích bằng tiếng Việt về vị trí lưỡi, môi, luồng hơi, điểm khác nhau giữa hai âm.
- Nút **Nghe** sử dụng SoundService của VocaMini (nguồn phát mẫu tùy giọng đã chọn).
- Nút **Luyện** gọi công cụ tra từ hiện có để sau đó dùng recorder và Vosk của Phase 4.
- Không ghi âm mới khi người dùng chưa bấm; không chấm điểm phát âm giả.

## Sử dụng

1. Chạy VocaMini bằng Python server Phase 4, giữ nguyên `http://localhost:5500`.
2. Tra `ship` hoặc từ khác và mở **Luyện phát âm từ này**.
3. Chọn bài trong danh sách **Minimal Pairs**, nghe hai từ A/B và đọc phần hướng dẫn.
4. Bấm **Luyện ship** hoặc **Luyện sheep**. Sau khi từ mới được tra xong, mở lại phần luyện phát âm và ghi âm.
5. Dùng A/B giọng mẫu / giọng của tôi, rồi thử Vosk nhận diện để kiểm tra máy nghe ra từ gì.

## Kiểm thử

```powershell
node --check .\app.js
node --check .\sw.js
node --check .\pronunciation\recorder.js
node --check .\pronunciation\phoneme-data.js
node --check .\pronunciation\minimal-pairs.js
node --test .\tests\minimal-pairs.test.cjs
```

## Giới hạn

- IPA là tham khảo từ điển và có thể có nhiều biến thể hợp lệ. Cả UK và US ở sáu cặp này có cùng ký hiệu phổ biến.
- Tiếng mẫu online có thể cần kết nối Internet. Khi fallback sang Web Speech, cần có voice đúng locale trên Windows.
- Vosk `small-en-us` dùng cho nhận diện từ trong cả hai chế độ, không phân tích âm vị và không chấm accent.
- Nhận diện từ đúng **không đồng nghĩa** từng âm vị đều chuẩn.
- Không đưa `.venv/`, `models/`, dữ liệu người học hoặc khóa truy cập lên Git.
