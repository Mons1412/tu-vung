/** Phase 5: focused minimal-pair practice on top of the existing VocaMini dictionary.
 * This module never grades user audio; it only supplies curated practice material.
 */
(() => {
  'use strict';
  const pairs = window.VocaMiniMinimalPairs;
  if (!Array.isArray(pairs) || !pairs.length) return;

  function setup() {
    const root = document.getElementById('pron-minimal-pairs');
    const selector = document.getElementById('pron-pair-select');
    const targetWord = document.getElementById('dict-display-word');
    const accent = document.getElementById('pron-accent-select');
    const cards = document.getElementById('pron-pair-cards');
    const explanation = document.getElementById('pron-pair-difference');
    const tipList = document.getElementById('pron-pair-tips');
    const status = document.getElementById('pron-pair-status');
    if (![root, selector, targetWord, accent, cards, explanation, tipList, status].every(Boolean)) return;

    const byId = new Map(pairs.map(pair => [pair.id, pair]));
    let currentPair = pairs[0];

    // Avoid injecting HTML from dictionary search results. All labels use textContent.
    for (const pair of pairs) {
      const option = document.createElement('option');
      option.value = pair.id;
      option.textContent = `${pair.words[0].word} / ${pair.words[1].word} — ${pair.name}`;
      selector.appendChild(option);
    }

    function render() {
      const locale = accent.value === 'en-GB' ? 'en-GB' : 'en-US';
      cards.replaceChildren();
      for (const entry of currentPair.words) {
        const card = document.createElement('div');
        card.className = 'pron-pair-card';
        const heading = document.createElement('strong');
        heading.textContent = entry.word;
        const ipa = document.createElement('span');
        ipa.className = 'pron-pair-ipa';
        ipa.textContent = entry.ipa[locale];
        const meaning = document.createElement('span');
        meaning.className = 'pron-pair-meaning';
        meaning.textContent = entry.meaning;
        const buttons = document.createElement('div');
        buttons.className = 'pron-pair-actions';
        const listen = document.createElement('button');
        listen.type = 'button';
        listen.className = 'btn btn-secondary btn-sm';
        listen.textContent = `🔊 Nghe ${entry.word}`;
        listen.addEventListener('click', () => {
          // Stop user recording if active BEFORE starting a separate sample.
          window.dispatchEvent(new Event('vocamini:prepare-reference-audio'));
          window.dispatchEvent(new CustomEvent('vocamini:speak-reference-word', {
            detail: { word: entry.word }
          }));
          status.textContent = `Đang phát mẫu ${entry.word} theo giọng ${locale}.`;
        });
        const practice = document.createElement('button');
        practice.type = 'button';
        practice.className = 'btn btn-primary btn-sm';
        practice.textContent = `🎙️ Luyện ${entry.word}`;
        practice.addEventListener('click', () => {
          const input = document.getElementById('dict-search-input');
          const form = document.getElementById('dict-search-form');
          if (!input || !form) return;
          window.dispatchEvent(new Event('vocamini:stop-reference-audio'));
          input.value = entry.word;
          // This intentionally uses the existing dictionary search and recorder.
          if (typeof form.requestSubmit === 'function') form.requestSubmit();
          else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          status.textContent = `Đang tra “${entry.word}”. Khi từ xuất hiện, chọn “Luyện phát âm từ này” và ghi âm.`;
        });
        buttons.append(listen, practice);
        card.append(heading, ipa, meaning, buttons);
        cards.appendChild(card);
      }
      explanation.textContent = currentPair.difference;
      tipList.replaceChildren();
      for (const sentence of currentPair.tips) {
        const li = document.createElement('li');
        li.textContent = sentence;
        tipList.appendChild(li);
      }
      status.textContent = `Phiên âm tham khảo (${locale}). Nghe mẫu để luyện, không phải chấm phát âm.`;
    }

    function syncPairToWord() {
      const word = targetWord.textContent.trim().toLowerCase();
      const match = pairs.find(pair => pair.words.some(item => item.word === word));
      if (match && currentPair.id !== match.id) {
        currentPair = match;
        selector.value = currentPair.id;
        render();
      }
    }

    selector.addEventListener('change', () => {
      currentPair = byId.get(selector.value) || pairs[0];
      render();
    });
    accent.addEventListener('change', render);
    new MutationObserver(syncPairToWord).observe(targetWord, { childList: true, characterData: true, subtree: true });
    selector.value = currentPair.id;
    render();
    syncPairToWord();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
