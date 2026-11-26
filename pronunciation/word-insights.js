/**
 * VocaMini — Pronunciation Insights (IPA-based, non-scoring).
 * This module uses the IPA and real examples already shown by DictionaryService.
 * No new network call, microphone access, AI diagnosis or saved user audio.
 */
(function () {
  'use strict';

  // Multi-character IPA phonemes must be consumed before individual symbols.
  const COMPLEX = ['t͡ʃ', 'd͡ʒ', 'd͡z', 't͡s', 'tʃ', 'dʒ', 'aɪ', 'aʊ', 'eɪ', 'ɔɪ', 'oʊ', 'əʊ', 'ɪə', 'eə', 'ʊə'];
  const VOWELS = new Set([...'aɑɐæʌəɘɜɞɛeɪiɨɒɔoøœɶʊuʉɯɤyʏɚɝɵɿʅ']);
  const CUES = Object.freeze({
    w: 'Chu môi rồi chuyển nhanh sang nguyên âm.',
    p: 'Hai môi khép rồi bật hơi.', b: 'Hai môi khép rồi bật tiếng có rung.',
    m: 'Khép môi, để hơi thoát qua mũi.',
    f: 'Răng trên chạm môi dưới, thổi hơi.',
    v: 'Răng trên chạm môi dưới, có rung dây thanh.',
    θ: 'Đầu lưỡi gần răng, thổi hơi không rung.',
    ð: 'Đầu lưỡi gần răng, thổi hơi có rung.',
    t: 'Đầu lưỡi chạm vùng lợi trên rồi nhả.',
    d: 'Đầu lưỡi chạm vùng lợi trên, có rung.',
    s: 'Thổi hơi qua khe hẹp gần lợi, không rung.',
    z: 'Như /s/ nhưng có rung dây thanh.',
    ʃ: 'Hơi đi qua vùng sau lợi, môi hơi tròn.',
    ʒ: 'Như /ʃ/ nhưng có rung dây thanh.',
    tʃ: 'Bật âm /t/ sang /ʃ/ liền mạch.',
    dʒ: 'Bật âm /d/ sang /ʒ/ liền mạch.',
    k: 'Nâng phần sau lưỡi lên vòm mềm rồi bật.',
    ɡ: 'Như /k/ nhưng có rung dây thanh.',
    g: 'Như /k/ nhưng có rung dây thanh.',
    h: 'Thở nhẹ không rung trước nguyên âm.',
    l: 'Đầu lưỡi chạm vùng lợi, hơi đi hai bên lưỡi.',
    r: 'Đưa lưỡi gần vòm miệng, không chạm mạnh.',
    ɹ: 'Đưa lưỡi gần vòm miệng, không chạm mạnh.',
    j: 'Trượt nhanh từ vị trí /i/ sang nguyên âm sau.',
    ŋ: 'Âm mũi với phần sau lưỡi nâng lên.',
    ə: 'Âm schwa: nguyên âm nhẹ, lưỡi thư giãn.',
    ɚ: 'Schwa có màu /r/, thường gặp trong giọng Mỹ.',
    ɝ: 'Nguyên âm nhấn có màu /r/ trong giọng Mỹ.',
    æ: 'Mở miệng rộng, lưỡi đặt thấp phía trước.',
    ɪ: 'Nguyên âm ngắn, lưỡi hơi cao phía trước.',
    i: 'Nâng lưỡi cao phía trước, môi không tròn.',
    iː: 'Giữ nguyên âm /i/ dài hơn.',
    ʊ: 'Nguyên âm ngắn, lưỡi cao phía sau, môi tròn.',
    uː: 'Giữ nguyên âm /u/ dài hơn, môi tròn.',
    ʌ: 'Nguyên âm ngắn, miệng mở vừa, lưỡi trung tâm.',
    ɑː: 'Mở miệng, hạ lưỡi phía sau, giữ âm dài.',
    ɔː: 'Giữ nguyên âm dài, môi tròn nhẹ.',
    oː: 'Giữ nguyên âm dài, môi hơi tròn.',
    eɪ: 'Trượt từ nguyên âm giữa sang /ɪ/.',
    aɪ: 'Trượt từ âm mở sang /ɪ/.',
    aʊ: 'Trượt từ âm mở sang /ʊ/.',
    ɔɪ: 'Trượt từ /ɔ/ sang /ɪ/.',
    oʊ: 'Trượt từ âm /o/ sang /ʊ/.',
    əʊ: 'Trượt từ âm giữa sang /ʊ/.',
  });

  function normalizeIPA(raw) {
    if (typeof raw !== 'string') return '';
    const text = raw.trim();
    if (!/^\/[^/]+\/$/u.test(text) && !/^\[[^\]]+\]$/u.test(text)) return '';
    const content = text.slice(1, -1).trim();
    // Some dictionary fallbacks return ARPAbet such as /kAH0 pAE1/; do not call that IPA.
    if (!content || /[A-Z0-9]/u.test(content) || content.length > 120) return '';
    return content;
  }

  function splitPhones(ipa) {
    const phones = [];
    const chars = Array.from(ipa);
    for (let i = 0; i < chars.length;) {
      const char = chars[i];
      if (/[\s.ˈˌ\[\]/]/u.test(char)) { i++; continue; }
      const tail = chars.slice(i).join('');
      const match = COMPLEX.find(p => tail.startsWith(p));
      if (match) { phones.push(match); i += Array.from(match).length; continue; }
      if ('ːˑ̩̯̃ʰʷ'.includes(char) && phones.length) {
        phones[phones.length - 1] += char; i++; continue;
      }
      phones.push(char); i++;
    }
    return phones;
  }

  function nucleusPositions(ipa) {
    const out = [];
    // Ignore stress and explicit syllable boundaries; longest-match nuclei handle diphthongs.
    const s = Array.from(ipa);
    for (let i = 0; i < s.length;) {
      const tail = s.slice(i).join('');
      const diphthong = COMPLEX.find(p => VOWELS.has(Array.from(p)[0]) && tail.startsWith(p));
      if (diphthong) { out.push(i); i += Array.from(diphthong).length; continue; }
      if (VOWELS.has(s[i])) out.push(i);
      i++;
    }
    return out;
  }

  function analyzeIPA(raw) {
    const ipa = normalizeIPA(raw);
    if (!ipa) return null;
    const phones = splitPhones(ipa);
    const nuclei = nucleusPositions(ipa);
    if (!nuclei.length) return null;
    const primaryAt = Array.from(ipa).indexOf('ˈ');
    const stress = primaryAt < 0 ? null : 1 + nuclei.filter(p => p < primaryAt).length;
    const count = nuclei.length;
    // Dots are a useful indication of explicit syllable division but some dictionaries omit them.
    const dots = (ipa.match(/\./gu) || []).length;
    const explicit = dots === count - 1 && dots > 0;
    return {
      ipa, phones, count, stress: stress && stress <= count ? stress : null,
      estimate: !explicit,
      cues: [...new Set(phones)].filter(phone => CUES[phone]).slice(0, 3).map(phone => `/${phone}/: ${CUES[phone]}`)
    };
  }

  function nextWordInExample(word, examples) {
    const wanted = (word || '').trim().toLocaleLowerCase('en');
    if (!wanted || !Array.isArray(examples)) return null;
    for (const example of examples) {
      const sentence = String(example || '').replace(/[“”]/gu, '').trim();
      const words = Array.from(sentence.matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)*/gu), match => match[0]);
      for (let i = 0; i < words.length; i++) {
        if (words[i].toLowerCase() === wanted && words[i+1]) {
          return { sentence, next: words[i+1] };
        }
      }
    }
    return null;
  }

  function linkingAdvice(word, examples, accent, parsed) {
    const contextual = nextWordInExample(word, examples);
    if (!contextual) {
      return 'Chưa có ngữ cảnh phù hợp. Linking xảy ra giữa các từ trong câu, không có cách nối cố định cho từ đứng riêng.';
    }
    const pair = `${word} → ${contextual.next}`;
    const nextMaybeVowel = /^[aeiou]/i.test(contextual.next);
    const finalPhone = parsed?.phones?.[parsed.phones.length - 1] || '';
    const isVowelFinal = VOWELS.has(Array.from(finalPhone)[0] || '');
    let tip = 'Hãy nghe cả câu và chú ý chuyển tiếp giữa hai từ; không đọc tách rời từng tiếng.';
    if (nextMaybeVowel && !isVowelFinal && finalPhone) {
      tip = 'Nếu từ sau bắt đầu bằng âm nguyên âm, phụ âm cuối có thể nối sang từ sau. Chữ cái đầu không luôn phản ánh âm thực.';
    } else if (nextMaybeVowel && isVowelFinal) {
      tip = 'Nếu hai từ nối bằng hai âm nguyên âm, có thể xuất hiện chuyển tiếp /j/, /w/ hoặc hiện tượng /r/ tùy giọng và ngữ cảnh.';
    }
    if (accent === 'en-GB' && /(?:r|re)$/i.test(word) && nextMaybeVowel) {
      tip += ' Ở một số giọng Anh–Anh không rhotic, có thể nghe linking /r/.';
    }
    return `Ví dụ: “${contextual.sentence}” · Liền âm: ${pair}. ${tip}`;
  }

  function buildInsights({word, ipa, accent, examples, ipaVerified = false, ipaSource = "", ipaNotationWarning = ""}) {
    const parsed = analyzeIPA(ipa);
    const validWord = typeof word === 'string' && word.trim() && word !== 'Word';
    if (!validWord) return { sounds: 'Tra một từ để xem.', syllables: '—', stress: '—', linking: '—', note: '' };
    const sounds = parsed
      ? `Các âm: ${parsed.phones.slice(0, 24).map(p => `/${p}/`).join(' · ')}${parsed.phones.length > 24 ? ' …' : ''}${parsed.cues.length ? '\nCách phát âm: ' + parsed.cues.join(' ') : ''}`
      : 'Chưa có IPA hợp lệ để tách âm và hướng dẫn cách phát âm.';
    const syllables = parsed
      ? `${parsed.count} âm tiết${parsed.estimate ? ' (ước tính từ IPA)' : ' (IPA có dấu ngắt âm tiết)'}`
      : 'Chưa có dữ liệu âm tiết đáng tin cậy.';
    const stress = parsed?.stress
      ? `Trọng âm chính: âm tiết thứ ${parsed.stress}${parsed.estimate ? ' (suy từ dấu ˈ)' : ''}.`
      : (parsed?.count === 1 ? 'Từ một âm tiết; IPA không đánh dấu trọng âm riêng.' : 'Chưa xác định trọng âm chính (thiếu dấu ˈ trong IPA).');
    const verified = ipaVerified === true;
    const source = typeof ipaSource === 'string' ? ipaSource : '';
    const note = verified && parsed
      ? `IPA ${accent === 'en-GB' ? 'UK' : 'US'} có nguồn: ${source}. Số âm tiết vẫn là phân tích tự động từ IPA; đây không phải điểm chấm phát âm.${ipaNotationWarning ? ` Lưu ý: ${ipaNotationWarning}` : ''}`
      : `Chưa có IPA được xác minh theo giọng ${accent === 'en-GB' ? 'UK' : 'US'}. Không dùng phiên âm chưa xác định vùng để hướng dẫn hoặc đánh giá phát âm. Đây không phải điểm chấm phát âm.`;
    return { sounds, syllables, stress, linking: linkingAdvice(word, examples, accent, parsed), note };
  }

  function mount() {
    const ids = ['dict-display-word', 'dict-display-phonetic', 'pron-accent-select',
      'dict-examples-list', 'pron-insights-sounds', 'pron-insights-syllables',
      'pron-insights-stress', 'pron-insights-linking', 'pron-insights-note'];
    const byId = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
    if (ids.some(id => !byId[id])) return;
    let queued = false;
    function render() {
      queued = false;
      const examples = Array.from(byId['dict-examples-list'].querySelectorAll('.example-en'), e => e.textContent);
      const result = buildInsights({
        word: byId['dict-display-word'].textContent.trim(),
        ipa: byId['dict-display-phonetic'].textContent.trim(),
        ipaVerified: byId['dict-display-phonetic'].dataset?.ipaVerified === 'true',
        ipaSource: byId['dict-display-phonetic'].dataset?.ipaSource || '',
        ipaNotationWarning: byId['dict-display-phonetic'].dataset?.ipaNotationWarning || '',
        accent: byId['pron-accent-select'].value,
        examples
      });
      for (const key of ['sounds', 'syllables', 'stress', 'linking']) {
        byId[`pron-insights-${key}`].textContent = result[key];
      }
      byId['pron-insights-note'].textContent = result.note;
    }
    function queue() {
      if (!queued) { queued = true; queueMicrotask(render); }
    }
    const observer = new MutationObserver(queue);
    for (const id of ['dict-display-word', 'dict-display-phonetic', 'dict-examples-list']) {
      observer.observe(byId[id], {childList: true, subtree: true, characterData: true});
    }
    byId['pron-accent-select'].addEventListener('change', queue);
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('vocamini:ipa-updated', queue);
    }
    queue();
  }

  const api = { normalizeIPA, splitPhones, analyzeIPA, nextWordInExample, linkingAdvice, buildInsights };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
  }
})();
