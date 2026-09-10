# MÔ TẢ ỨNG DỤNG: "VocaMini" – Từ điển & Học từ vựng tiếng Anh (bản thu nhỏ TFlat)

## 1. Tổng quan
Xây dựng một ứng dụng web đơn trang (Single Page Application), có thể chạy chỉ với 1 file HTML (nhúng CSS + JavaScript trong file, hoặc tách 3 file HTML/CSS/JS nếu thuận tiện hơn cho việc code). Không cần backend, không cần server — mọi dữ liệu người dùng (sổ tay, từ đã lưu, tiến trình học) lưu trong `localStorage` của trình duyệt.

Ứng dụng gồm 3 khối chức năng chính:
1. **Tra từ điển** (Dictionary)
2. **Sổ tay từ vựng** (Notebooks)
3. **Học qua trò chơi** (Vocabulary Games)

Giao diện tối giản, hiện đại, thân thiện trên cả desktop và mobile (responsive), tông màu sáng, dễ đọc, có thể có chế độ tối (dark mode) nếu làm được.

---

## 2. Công nghệ đề xuất
- HTML5 + CSS3 + JavaScript thuần (Vanilla JS) — ưu tiên vì gọn nhẹ, chạy được ngay bằng cách mở file HTML.
- Có thể dùng thêm (không bắt buộc):
  - **Web Speech API** (`speechSynthesis`) để phát âm từ vựng miễn phí, không cần API ngoài.
  - **Dictionary API** miễn phí như `https://api.dictionaryapi.dev/api/v2/entries/en/{word}` để lấy nghĩa, phiên âm (IPA), ví dụ, từ loại, đồng nghĩa cho tiếng Anh.
  - Nếu cần dịch nghĩa tiếng Việt, có thể dùng thêm 1 API dịch miễn phí hoặc cho phép người dùng tự nhập/sửa nghĩa tiếng Việt (vì API miễn phí tiếng Anh-Việt khá hạn chế).
  - Ảnh minh hoạ cho từ vựng: có thể dùng link ảnh từ Unsplash/Pixabay (qua API) hoặc để trống, cho phép người dùng tự dán link ảnh khi lưu từ.
- Lưu trữ: `localStorage` (key-value), cấu trúc dữ liệu dạng JSON (xem mục 6).

---

## 3. Chức năng 1: Tra từ điển

### Giao diện
- Thanh tìm kiếm ở đầu trang, gõ 1 từ tiếng Anh → nhấn Enter hoặc nút Tìm.
- Kết quả hiển thị:
  - Từ vựng + phiên âm IPA (vd: `/kəˈpæsəti/`)
  - Nút loa 🔊 để phát âm (dùng Web Speech API hoặc audio từ dictionary API nếu có)
  - Từ loại (danh từ, động từ, tính từ...)
  - Nghĩa tiếng Anh (definition)
  - Nghĩa tiếng Việt (nếu có, hoặc ô cho người dùng tự nhập)
  - 1-3 câu ví dụ (example sentences) kèm dịch nghĩa nếu có
  - Từ đồng nghĩa/trái nghĩa (nếu API trả về)
- Nút **"+ Lưu vào sổ tay"** ngay tại kết quả tra cứu → khi bấm, hiện popup chọn:
  - Chọn 1 sổ tay có sẵn (danh sách sổ tay hiện có), hoặc
  - Tạo sổ tay mới (nhập tên sổ tay) rồi lưu từ vào đó luôn
  - Có thể lưu 1 từ vào nhiều sổ tay khác nhau.

### Xử lý khi không tìm thấy / lỗi mạng
- Hiển thị thông báo rõ ràng, gợi ý kiểm tra chính tả.

---

## 4. Chức năng 2: Sổ tay từ vựng (Notebooks)

- Màn hình riêng "Sổ tay của tôi", liệt kê tất cả sổ tay đã tạo dưới dạng thẻ (card), mỗi thẻ hiển thị: tên sổ tay, số lượng từ, ngày tạo.
- Nút **"+ Tạo sổ tay mới"**: nhập tên, chọn màu/icon đại diện (tuỳ chọn).
- Bấm vào 1 sổ tay → xem danh sách từ vựng trong đó:
  - Mỗi từ hiển thị: từ, phiên âm, nghĩa, nút phát âm, nút xoá khỏi sổ tay, nút sửa nghĩa/ví dụ.
  - Có thể chọn nhiều từ để: xoá hàng loạt, hoặc **bắt đầu học (chơi game) chỉ với các từ trong sổ tay này**.
- Cho phép đổi tên / xoá sổ tay (có xác nhận trước khi xoá).
- Cho phép **di chuyển hoặc copy** từ giữa các sổ tay.

---

## 5. Chức năng 3: Học từ vựng qua Game

Người dùng chọn nguồn từ vựng để học: 1 sổ tay cụ thể, hoặc gộp tất cả các sổ tay, trước khi vào từng game.

### Game 1: Sắp xếp chữ cái (Word Scramble)
- Hiển thị: ảnh minh hoạ của từ (nếu có, nếu không thì icon mặc định) + nút phát âm 🔊 (đọc to từ đó).
- Bên dưới là các chữ cái/thành phần của từ bị xáo trộn ngẫu nhiên, hiển thị dạng các ô/thẻ rời rạc.
- Người dùng bấm chọn lần lượt từng chữ cái theo đúng thứ tự để ghép thành từ đúng.
- Ngay khi chọn **sai vị trí** (chữ cái không đúng thứ tự cần thiết tại bước đó) → ô đó báo đỏ tức thì (hiệu ứng rung nhẹ + đổi màu đỏ), rồi trả lại để người dùng chọn lại.
- Khi ghép đúng toàn bộ từ → báo xanh, hiệu ứng chúc mừng nhẹ, tự động chuyển sang từ tiếp theo sau 1-2 giây.
- Có thanh tiến trình (vd: Từ 3/10) và nút "Bỏ qua" / "Xem đáp án" nếu người dùng bí.

### Game 2: Trắc nghiệm (Multiple Choice Quiz)
Hai chiều, người dùng có thể chọn chế độ:
- **Anh → Việt**: hiển thị từ tiếng Anh (+ phát âm), 4 đáp án nghĩa tiếng Việt, chọn 1 đáp án đúng.
- **Việt → Anh**: hiển thị nghĩa tiếng Việt, 4 đáp án là từ tiếng Anh, chọn từ đúng.
- Đáp án sai (nhiễu) được lấy ngẫu nhiên từ các từ khác trong cùng sổ tay/bộ từ đang học để tăng độ khó hợp lý.
- Chọn đúng → báo xanh; chọn sai → báo đỏ và làm nổi bật đáp án đúng, rồi mới cho qua câu tiếp theo.
- Hiển thị kết quả tổng kết cuối phiên học: số câu đúng/sai, % chính xác, danh sách từ đã sai để ôn lại.

### (Gợi ý mở rộng, không bắt buộc)
- Game Flashcard: lật thẻ xem nghĩa, tự đánh giá "Nhớ" / "Chưa nhớ".
- Game nghe – chọn từ đúng (Listening quiz): chỉ phát âm thanh, không hiện chữ, người dùng chọn từ nghe được.
- Chế độ ôn tập theo thuật toán lặp lại ngắt quãng đơn giản (spaced repetition): từ sai nhiều sẽ xuất hiện lại thường xuyên hơn.

---

## 6. Cấu trúc dữ liệu (lưu trong localStorage)

```json
{
  "notebooks": [
    {
      "id": "nb_001",
      "name": "Từ vựng TOEIC",
      "createdAt": "2026-09-07T10:00:00Z",
      "color": "#4F8EF7",
      "words": [
        {
          "id": "w_001",
          "word": "capacity",
          "phonetic": "/kəˈpæsəti/",
          "partOfSpeech": "noun",
          "meaningEn": "the maximum amount that something can contain or produce",
          "meaningVi": "sức chứa, năng lực",
          "examples": [
            { "en": "The stadium has a capacity of 50,000.", "vi": "Sân vận động có sức chứa 50.000 người." }
          ],
          "imageUrl": "",
          "addedAt": "2026-09-07T10:05:00Z",
          "reviewStats": { "correct": 0, "wrong": 0, "lastReviewed": null }
        }
      ]
    }
  ]
}
```

---

## 7. Luồng người dùng tổng quát (User Flow)

1. Mở app → màn hình chính có thanh tra từ + menu điều hướng (Tra từ / Sổ tay / Học từ vựng).
2. Tra 1 từ → xem nghĩa, ví dụ, phát âm → bấm "+ Lưu vào sổ tay" → chọn/tạo sổ tay → lưu.
3. Vào mục "Sổ tay" → xem lại các từ đã lưu, quản lý (sửa/xoá/di chuyển).
4. Vào mục "Học từ vựng" → chọn sổ tay muốn học → chọn loại game (Sắp xếp chữ cái / Trắc nghiệm) → học → xem kết quả.

---

## 8. Yêu cầu giao diện
- Responsive, dùng tốt trên điện thoại (vì đây là ứng dụng học từ vựng dùng hàng ngày).
- Có thanh điều hướng dưới cùng (bottom navigation) kiểu app di động: Trang chủ / Tra từ / Sổ tay / Học tập.
- Hiệu ứng chuyển động mượt (transition, animation nhẹ) khi báo đúng/sai, chuyển câu.
- Màu sắc rõ ràng: xanh lá = đúng, đỏ = sai, để người học phản xạ nhanh.

---

## 9. Ghi chú khi đưa cho AI code
- Vì chỉ chạy bằng 1 file (không server), toàn bộ gọi API bên ngoài (dictionary API, ảnh...) cần xử lý lỗi mạng nhẹ nhàng (try-catch, fallback về nhập tay).
- Ưu tiên làm cho chắc 2 game (sắp xếp chữ cái + trắc nghiệm) và chức năng sổ tay hoạt động mượt trước, các API bên ngoài (ảnh, dịch) có thể để là "nice to have".
- Dữ liệu mẫu (seed data): nên có sẵn 1 sổ tay mẫu với ~10 từ để người dùng thấy ngay giao diện hoạt động khi mở app lần đầu.
