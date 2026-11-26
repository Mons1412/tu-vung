# VocaMini — Offline IPA Integration v1.0 (US/UK)

## Mục tiêu

Tái sử dụng **SQLite đã giải nén** tại:

`~/Projects/ipa-datasets/vocamini_ipa_offline_package/output/vocamini_ipa_offline_v0_1.sqlite`

Đường dẫn này nằm **ngoài** `~/Projects/tu-vung`, do đó không vô tình đưa database, dữ liệu gốc hoặc giấy phép lên website GitHub/Netlify. **Không sao chép SQLite vào thư mục VocaMini** khi đang dùng `SimpleHTTPRequestHandler`.

Nếu chuyển database đi nơi khác, đặt biến môi trường trước khi chạy server:

```bash
export VOCAMINI_IPA_DB="$HOME/Projects/ipa-datasets/vocamini_ipa_offline_package/output/vocamini_ipa_offline_v0_1.sqlite"
```

## Endpoint

Mở server Python `pronunciation/offline_server.py`, sau đó gọi:

- `GET http://localhost:5500/api/pronunciation/ipa?word=water`
- `GET http://localhost:5500/api/pronunciation/ipa?word=library&accent=en-GB`

Trả về các biến thể theo từng vùng giọng, nguồn và `notation_warning`. Truy cập DB **read-only**; không gửi âm thanh đến dịch vụ từ điển. Nếu thiếu file SQLite, API trả 503. Từ không tồn tại trả danh sách rỗng. API không chấm điểm phát âm.

## Quy tắc chọn nguồn

1. Ba từ đã đối chiếu thủ công (`water`, `schedule`, `library`) tiếp tục ưu tiên nguồn curated trong module hiện tại.
2. Các từ khác: **SQLite offline** trước.
3. Nếu thiếu UK/US trong SQLite, các nguồn online đã có (Free Dictionary API / Wiktionary) vẫn là fallback tùy điều kiện mạng.
4. Không gán IPA US vào UK hoặc ngược lại. Giữ lại số lượng biến thể; hiện chỉ hiển thị biến thể đầu và thông báo khi có nhiều biến thể.

## Britfone / IPA và hạn chế

- Britfone đánh dấu trọng âm **ngay trước nguyên âm của âm tiết được nhấn**. Đây không phải ký pháp đánh dấu đầu âm tiết thông thường.
- Bản tích hợp **chỉ** đưa dấu trọng âm ra đầu từ khi chắc chắn là nguyên âm đầu tiên và không có dấu nhấn phụ. Không tự nhận dạng ranh giới các âm tiết còn lại.
- Nếu không thể chỉnh an toàn, giao diện vẫn hiển thị dữ liệu có chú thích `⚠` và thông báo hạn chế. Chỉ số âm tiết/Stress của Word Insights còn mang tính ước tính, không phải dữ liệu syllabification đã xác minh.
- Một số mục US/UK trong dataset có thể dùng quy ước ký hiệu khác Cambridge. Không tự coi Cambridge là duy nhất hoặc cho rằng mọi phiên âm dataset đều chính xác.
- Vosk và MFA vẫn là mô hình US: IPA theo vùng trong từ điển **không** thay đổi khả năng chấm phát âm.

## Kiểm thử

```bash
node --check pronunciation/accent-ipa.js
node --test tests/*.test.cjs
./.venv/bin/python -m unittest discover -s tests -p 'test_*.py' -v
curl -fsS 'http://localhost:5500/api/pronunciation/ipa?word=library'
```

Sau khi áp dụng patch: **khởi động lại server**, đóng mọi tab VocaMini và tải lại Firefox để nhận Service Worker `vocamini-cache-v16`.

## Giấy phép / xuất xứ

- `ipa-dict/en_US`: xem giấy phép và phần Credits của nguồn gốc trong gói dataset.
- `Britfone/3.0.1`: MIT; giữ NOTICE/License kèm theo dữ liệu khi phân phối lại.
- `ipa-dict` có một số nguồn thứ ba với giấy phép riêng; rà soát trước khi phát hành hoặc đưa dữ liệu lên GitHub.
