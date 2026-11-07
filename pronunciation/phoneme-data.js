/* Phase 5 — small, manually curated minimal-pair lessons.
 * IPA is a study reference, NOT a pronunciation assessment of user audio.
 * The listed pronunciations are common standard US/UK dictionary forms.
 */
(function (root) {
  'use strict';
  const pairs = [
    {
      id: 'ship-sheep', name: 'Nguyên âm /ɪ/ và /iː/',
      words: [
        { word: 'ship', ipa: { 'en-US': '/ʃɪp/', 'en-GB': '/ʃɪp/' }, meaning: 'con tàu' },
        { word: 'sheep', ipa: { 'en-US': '/ʃiːp/', 'en-GB': '/ʃiːp/' }, meaning: 'con cừu' }
      ],
      difference: 'Phân biệt chất lượng nguyên âm trước, sau đó mới chú ý độ dài.',
      tips: [
        'Âm /ɪ/: miệng mở nhẹ, lưỡi nâng về phía trước nhưng thả lỏng; không kéo quá dài.',
        'Âm /iː/: lưỡi nâng cao và ra trước hơn, khóe môi hơi kéo ngang; âm thường dài và căng hơn.',
        'Thử luân phiên ship → sheep; giữ phụ âm /ʃ/ và /p/ không đổi.'
      ]
    },
    {
      id: 'sit-seat', name: 'Nguyên âm /ɪ/ và /iː/ (bài 2)',
      words: [
        { word: 'sit', ipa: { 'en-US': '/sɪt/', 'en-GB': '/sɪt/' }, meaning: 'ngồi' },
        { word: 'seat', ipa: { 'en-US': '/siːt/', 'en-GB': '/siːt/' }, meaning: 'chỗ ngồi' }
      ],
      difference: 'Giữ nguyên /s/ và /t/, chỉ thay đổi nguyên âm ở giữa.',
      tips: [
        '/ɪ/ trong sit: lưỡi hơi thấp và thả lỏng hơn /iː/.',
        '/iː/ trong seat: nâng lưỡi cao về phía trước, không chỉ kéo dài âm /ɪ/.',
        'Đọc chậm sit → seat → sit và tự nghe lại.'
      ]
    },
    {
      id: 'full-fool', name: 'Nguyên âm /ʊ/ và /uː/',
      words: [
        { word: 'full', ipa: { 'en-US': '/fʊl/', 'en-GB': '/fʊl/' }, meaning: 'đầy' },
        { word: 'fool', ipa: { 'en-US': '/fuːl/', 'en-GB': '/fuːl/' }, meaning: 'người ngốc' }
      ],
      difference: 'Chú ý vị trí lưỡi và độ tròn môi, không dựa hoàn toàn vào độ dài.',
      tips: [
        '/ʊ/: môi tròn vừa phải, lưỡi nâng phía sau nhưng thả lỏng.',
        '/uː/: môi thường tròn hơn, vị trí lưỡi cao hơn; âm thường dài hơn.',
        'Đọc full → fool và nghe kỹ âm trước phụ âm /l/.'
      ]
    },
    {
      id: 'thin-tin', name: 'Phụ âm /θ/ và /t/',
      words: [
        { word: 'thin', ipa: { 'en-US': '/θɪn/', 'en-GB': '/θɪn/' }, meaning: 'mỏng' },
        { word: 'tin', ipa: { 'en-US': '/tɪn/', 'en-GB': '/tɪn/' }, meaning: 'thiếc; hộp thiếc' }
      ],
      difference: 'Âm /θ/ cho luồng hơi liên tục đi qua vùng răng; /t/ là âm tắc rồi bật ra.',
      tips: [
        '/θ/: đặt đầu lưỡi nhẹ giữa hai hàm răng hoặc gần mặt trong răng trên, thổi hơi, không rung dây thanh.',
        '/t/: đầu lưỡi chạm lợi ngay sau răng trên, giữ luồng hơi rồi bật ra.',
        'Đừng biến thin thành tin: luyện riêng /θ/ trước khi ghép /ɪn/.'
      ]
    },
    {
      id: 'very-berry', name: 'Phụ âm /v/ và /b/',
      words: [
        { word: 'very', ipa: { 'en-US': '/ˈver.i/', 'en-GB': '/ˈver.i/' }, meaning: 'rất' },
        { word: 'berry', ipa: { 'en-US': '/ˈber.i/', 'en-GB': '/ˈber.i/' }, meaning: 'quả mọng' }
      ],
      difference: '/v/ là âm xát kéo dài; /b/ đóng hai môi rồi bật ra.',
      tips: [
        '/v/: răng trên chạm nhẹ môi dưới, cho hơi đi qua và tạo tiếng rung.',
        '/b/: hai môi khép kín trước khi bật ra; không đặt răng lên môi dưới.',
        'Đặt tay ở cổ để cảm nhận cả /v/ và /b/ đều hữu thanh.'
      ]
    },
    {
      id: 'cap-cup', name: 'Nguyên âm /æ/ và /ʌ/',
      words: [
        { word: 'cap', ipa: { 'en-US': '/kæp/', 'en-GB': '/kæp/' }, meaning: 'mũ lưỡi trai' },
        { word: 'cup', ipa: { 'en-US': '/kʌp/', 'en-GB': '/kʌp/' }, meaning: 'cái cốc' }
      ],
      difference: '/æ/ mở miệng rộng hơn và lưỡi tiến trước hơn /ʌ/.',
      tips: [
        '/æ/: hạ hàm, miệng mở khá rộng, lưỡi hướng về phía trước.',
        '/ʌ/: miệng mở vừa, lưỡi ở vị trí trung tâm và thư giãn hơn.',
        'Giữ nguyên /k/ và /p/, luyện cap → cup → cap.'
      ]
    }
  ];

  if (typeof module === 'object' && module.exports) module.exports = pairs;
  else root.VocaMiniMinimalPairs = pairs;
})(typeof window !== 'undefined' ? window : globalThis);
