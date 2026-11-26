# Accent-Aware IPA v1.1 — VocaMini

## Mục tiêu

- Chuyển US ↔ UK cập nhật IPA và thông tin Sounds/Syllables/Stress theo IPA đã chọn.
- Không lấy `entry.phonetic` hoặc IPA đầu tiên không gắn vùng rồi mặc định là UK/US.
- Giữ nguyên mọi chức năng ghi âm, Vosk, MFA; không dùng IPA để chấm phát âm.

## Nguồn

1. **Free Dictionary API**: `phonetics[].text` được gắn vùng khi cùng phần tử có `audio` với hậu tố `-us`, `-uk`, `-gb`, hoặc trường locale/region/accent rõ ràng. Đây là dấu hiệu vùng giọng từ metadata, không phải xác nhận độc lập từng biến thể.
2. **Ba từ đối chiếu** `water`, `schedule`, `library`: IPA theo cách phát âm US/UK tham khảo của Cambridge. Đây là danh sách nhỏ minh họa, KHÔNG phải một từ điển IPA đầy đủ.
   - https://dictionary.cambridge.org/pronunciation/english/water
   - https://dictionary.cambridge.org/pronunciation/english/schedule
   - https://dictionary.cambridge.org/pronunciation/english/library
3. **English Wiktionary (dự phòng)**: chỉ đọc cấu trúc wikitext trong mục English → Pronunciation, và chỉ nhận `{{IPA|en|...}}` khi có nhãn UK/RP/US/GA rõ ràng (trực tiếp hoặc nhãn bullet cha). Sử dụng API MediaWiki Action `action=parse&prop=wikitext&origin=*`, không tự đoán IPA từ cách viết của từ. Không coi Wiki là Cambridge. Dữ liệu/cộng đồng Wiktionary áp dụng giấy phép mở: https://en.wiktionary.org/wiki/Wiktionary:Copyrights
4. Các trường `phonetic` đơn lẻ, IPA không nhãn, từ lưu local và Datamuse không được gán nhãn US/UK.

## Hạn chế

- Từ không có IPA được xác minh theo vùng giọng hiển thị `—`, không đoán. Từ đa nghĩa/đa cách đọc có thể cần chọn cách phát âm theo từ loại/ngữ cảnh; phiên bản này chưa có chọn biến thể.
- Phần Sounds/Syllables/Stress tính dựa trên IPA; đếm âm tiết và trọng âm vẫn có thể ước tính hoặc sai nếu IPA chưa đánh dấu rõ.
- Với API online, trình duyệt phải kết nối Internet và cho phép CORS; Vosk/MFA vẫn chạy local.
- Có thể phát thêm request Free Dictionary API và khi thiếu nhãn UK/US sẽ thử truy vấn English Wiktionary. Thao tác này cần Internet và quyền truy cập CORS; không lưu âm thanh, không gửi microphone lên API từ điển.
- Với UK, đây là kiểu phát âm tham chiếu phía nam nước Anh; UK thực tế có nhiều phương ngữ.

## Kiểm thử

```bash
node --check pronunciation/accent-ipa.js
node --check pronunciation/word-insights.js
node --test tests/*.test.cjs
./.venv/bin/python -m unittest discover -s tests -p 'test_*.py' -v
```

Các bước nghiệm thu: tra `water`, đổi UK/US (phải khác), tra `schedule`, đổi UK/US (phải khác), tra từ không có IPA vùng (phải hiển thị thiếu dữ liệu), sau đó thử ghi âm tự động/Vosk và MFA để xác nhận không bị ảnh hưởng. Sau khi thay Service Worker, đóng toàn bộ tab VocaMini rồi mở lại.
