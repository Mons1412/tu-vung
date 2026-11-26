/** VocaMini Accent-Aware IPA v1.1: locale evidence only, no pronunciation scoring.
 * No changes to microphone, Vosk or MFA. No external paid API.
 */
(function (root) {
  'use strict';
  // Small human-checked examples used to regression-test locale switching.
  // This is NOT a general pronunciation dictionary; add more words only after review.
  const CURATED = Object.freeze({
    water: {
      'en-GB': { ipa: '/ˈwɔː.tə/', source: 'Cambridge (UK, đối chiếu)' },
      'en-US': { ipa: '/ˈwɑː.t̬ɚ/', source: 'Cambridge (US, đối chiếu)' }
    },
    schedule: {
      'en-GB': { ipa: '/ˈʃedʒ.uːl/', source: 'Cambridge (UK, đối chiếu)' },
      'en-US': { ipa: '/ˈskedʒ.uːl/', source: 'Cambridge (US, đối chiếu)' }
    },
    library: {
      'en-GB': { ipa: '/ˈlaɪ.brər.i/', source: 'Cambridge (UK, đối chiếu)' },
      'en-US': { ipa: '/ˈlaɪ.brer.i/', source: 'Cambridge (US, đối chiếu)' }
    }
  });

  function normalizeIpa(value) {
    if (typeof value !== 'string') return null;
    const ipa = value.trim();
    if (!ipa || ipa.length > 150 || /[A-Z0-9<>]/u.test(ipa)) return null;
    // This is shape validation, NOT a complete IPA or dialect verifier.
    if (/^\/.+\/$/u.test(ipa) || /^\[.+\]$/u.test(ipa)) return ipa;
    if (/^[a-zɐɑæʌəɚɝɛɜɪʊɔɒθðŋʃʒˈˌː.\sˑɡɾʔʉøœɹʧʤɥɲɕʑʎɨɵɘʉ̩̯̃͡ʰʷ̬]+$/u.test(ipa)) return '/' + ipa + '/';
    return null;
  }

  function labeledLocale(phonetic) {
    if (!phonetic || typeof phonetic !== 'object') return null;
    const labels = ['locale','region','accent','country','language','lang']
      .map(key => phonetic[key]).filter(x => typeof x === 'string').join(' ').toLowerCase();
    const ukLabel = /(?:^|[^a-z])(?:en[-_]gb|en[-_]uk|gb|uk|british|received pronunciation)(?:$|[^a-z])/u.test(labels);
    const usLabel = /(?:^|[^a-z])(?:en[-_]us|us|usa|american|general american)(?:$|[^a-z])/u.test(labels);
    if (ukLabel !== usLabel) return ukLabel ? 'en-GB' : 'en-US';
    // Audio suffix counts only when attached to the SAME phonetic object as its IPA.
    // Example: schedule-us.mp3, hello--_gb_1.mp3. Never guess from the IPA symbols.
    const audio = String(phonetic.audio || '').split('?')[0].split('#')[0].toLowerCase();
    const file = audio.slice(audio.lastIndexOf('/') + 1);
    const ukAudio = /(?:-|_)(?:uk|gb)(?=[-_.]|$)/u.test(file);
    const usAudio = /(?:-|_)(?:us|usa)(?=[-_.]|$)/u.test(file);
    if (ukAudio !== usAudio) return ukAudio ? 'en-GB' : 'en-US';
    return null;
  }

  function extractLabeled(entries) {
    const accents = { 'en-GB': null, 'en-US': null };
    let unlabeled = null;
    if (!Array.isArray(entries)) return {accents, unlabeled};
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object') continue;
      unlabeled = unlabeled || normalizeIpa(entry.phonetic);
      for (const p of Array.isArray(entry.phonetics) ? entry.phonetics : []) {
        const ipa = normalizeIpa(p?.text);
        if (!ipa) continue;
        const region = labeledLocale(p);
        if (region && !accents[region]) {
          accents[region] = {ipa, source: 'Free Dictionary API (IPA + nhãn audio ' + (region === 'en-GB' ? 'UK' : 'US') + ')'};
        } else if (!region && !unlabeled) {
          unlabeled = ipa;
        }
      }
    }
    return {accents, unlabeled};
  }

  // English Wiktionary is a fallback, not a source of guessed IPA. We accept only
  // IPA templates with explicit US/UK, GA/RP labels in the English pronunciation
  // section. Parent bullets may pass their label to nested bullets.
  function parseWiktionary(wikitext) {
    const accents = { 'en-GB': null, 'en-US': null };
    if (typeof wikitext !== 'string' || wikitext.length > 350000) return accents;
    let inEnglish = false;
    let pronunciationDepth = 0;
    const ancestors = [];
    const scores = { 'en-GB': 0, 'en-US': 0 };

    function labelsOf(text) {
      const parts = [];
      for (const match of text.matchAll(/\{\{(?:a|accent)\|en\|([^{}]{1,90})\}\}/giu)) parts.push(match[1]);
      for (const match of text.matchAll(/\|a\d*=([^|}]{1,90})/giu)) parts.push(match[1]);
      // Some entries use plain labels before the IPA template, e.g. "(UK)".
      const prefix = text.split(/\{\{IPA\|en\|/iu, 1)[0];
      for (const match of prefix.matchAll(/\((Received Pronunciation|RP|General American|GA|UK|US|British English|American English)\)/giu)) parts.push(match[1]);
      return parts.join(' ').toLowerCase().split(/[,/;\s]+/u).filter(Boolean);
    }
    function classify(labels) {
      const text = ' ' + labels.join(' ') + ' ';
      const rp = /\b(?:rp|received pronunciation)\b/iu.test(text);
      const ga = /\b(?:ga|general american)\b/iu.test(text);
      const uk = rp || /\b(?:uk|en-gb|british)\b/iu.test(text);
      const us = ga || /\b(?:us|en-us|american)\b/iu.test(text);
      return {'en-GB': uk ? (rp ? 3 : 2) : 0, 'en-US': us ? (ga ? 3 : 2) : 0};
    }

    for (const line of wikitext.split(/\r?\n/u)) {
      const heading = line.match(/^(={2,6})\s*([^=]+?)\s*\1\s*$/u);
      if (heading) {
        const depth = heading[1].length;
        const title = heading[2].trim();
        if (depth === 2) { inEnglish = title === 'English'; pronunciationDepth = 0; }
        else if (inEnglish) {
          if (/^Pronunciation(?: \d+)?$/iu.test(title)) pronunciationDepth = depth;
          else if (pronunciationDepth && depth <= pronunciationDepth) pronunciationDepth = 0;
        }
        ancestors.length = 0;
        continue;
      }
      if (!inEnglish || !pronunciationDepth) continue;
      const bullet = line.match(/^(\*+)\s*(.*)$/u);
      if (!bullet) continue;
      const depth = bullet[1].length;
      const body = bullet[2];
      // Prevent a sibling bullet from inheriting a previous sibling's accent.
      ancestors.length = depth;
      const directLabels = labelsOf(body);
      ancestors[depth - 1] = directLabels;
      const contextLabels = ancestors.flat().filter(Boolean);
      const classification = classify(contextLabels);
      const ipaTemplates = [...body.matchAll(/\{\{IPA\|en\|([^{}\n]{1,400})\}\}/giu)];
      for (const template of ipaTemplates) {
        const fields = template[1].split('|');
        // Prefer phonemic /.../ over narrow phonetic [...] for user lessons.
        const ipa = fields.map(normalizeIpa).find(item => item?.startsWith('/'));
        if (!ipa) continue;
        for (const locale of ['en-GB','en-US']) {
          const score = classification[locale];
          if (score > scores[locale]) {
            scores[locale] = score;
            accents[locale] = {ipa, source: `English Wiktionary (${score === 3 ? (locale === 'en-GB' ? 'RP' : 'GA') : (locale === 'en-GB' ? 'UK' : 'US')} có nhãn)`};
          }
        }
      }
    }
    return accents;
  }

  function wiktionaryUrl(word) {
    const params = new URLSearchParams({ action:'parse', page:word, prop:'wikitext', format:'json', formatversion:'2', origin:'*' });
    return 'https://en.wiktionary.org/w/api.php?' + params;
  }

  // Offline SQLite is the primary source for non-curated vocabulary. The server
  // returns region-separated variants; preserve metadata instead of guessing locale.
  function extractOffline(payload) {
    const out = {accents: {'en-GB': null, 'en-US': null}, unlabeled: null};
    if (!payload || typeof payload !== 'object' || !payload.accents) return out;
    for (const locale of ['en-GB', 'en-US']) {
      const rows = payload.accents[locale];
      if (!Array.isArray(rows)) continue;
      const valid = rows.filter(row => row && normalizeIpa(row.ipa) &&
        typeof row.source === 'string' && row.source.length < 100).slice(0, 12);
      if (!valid.length) continue;
      const first = valid[0];
      out.accents[locale] = {
        ipa: normalizeIpa(first.ipa),
        source: first.source + ' (offline)',
        notationWarning: typeof first.notation_warning === 'string' ? first.notation_warning : '',
        variants: valid.length
      };
    }
    return out;
  }

  function mergeAccents(preferred, fallback) {
    const out = preferred || {accents: {'en-GB': null, 'en-US': null}, unlabeled: null};
    if (!fallback) return out;
    for (const locale of ['en-GB','en-US']) {
      if (!out.accents[locale] && fallback.accents?.[locale]) out.accents[locale] = fallback.accents[locale];
    }
    if (!out.unlabeled && fallback.unlabeled) out.unlabeled = fallback.unlabeled;
    return out;
  }

  function resolve(word, accent, fetched) {
    const normalized = String(word || '').trim().toLowerCase();
    const locale = accent === 'en-GB' ? 'en-GB' : 'en-US';
    const curated = CURATED[normalized]?.[locale];
    return curated || fetched?.accents?.[locale] || null;
  }

  function mount() {
    const wordElement = document.getElementById('dict-display-word');
    const ipaElement = document.getElementById('dict-display-phonetic');
    const statusElement = document.getElementById('dict-ipa-status');
    const accentElement = document.getElementById('pron-accent-select');
    if (![wordElement,ipaElement,statusElement,accentElement].every(Boolean)) return;
    let currentWord = '';
    let fetched = null;
    let loading = false;
    let controller = null;
    let generation = 0;
    const cache = new Map();

    function paint() {
      const selected = resolve(currentWord, accentElement.value, fetched);
      const locale = accentElement.value === 'en-GB' ? 'UK' : 'US';
      const next = selected ? selected.ipa : '—';
      ipaElement.dataset.ipaVerified = selected ? 'true' : 'false';
      ipaElement.dataset.ipaSource = selected?.source || '';
      ipaElement.dataset.ipaNotationWarning = selected?.notationWarning || '';
      if (ipaElement.textContent !== next) ipaElement.textContent = next;
      if (!currentWord) statusElement.textContent = '';
      else if (selected) statusElement.textContent = `IPA ${locale} · ${selected.source}${selected.variants > 1 ? ` · ${selected.variants} biến thể` : ''}.${selected.notationWarning ? ` ⚠ ${selected.notationWarning}` : ''}`;
      else if (loading) statusElement.textContent = `Đang tìm IPA ${locale} có nguồn vùng giọng rõ ràng…`;
      else statusElement.textContent = `Chưa có IPA ${locale} xác định vùng giọng${fetched?.unlabeled ? ' (nguồn hiện có chỉ có phiên âm chưa gắn vùng).' : '.'}`;
      // Supports consumers whose IPA string is identical across the two accents.
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('vocamini:ipa-updated'));
    }

    function updateWord() {
      const incoming = wordElement.textContent.trim();
      const nextWord = incoming === 'Word' ? '' : incoming.toLowerCase();
      if (nextWord === currentWord) {paint(); return;}
      if (controller) controller.abort();
      controller = null;
      currentWord = nextWord;
      fetched = cache.get(currentWord) || null;
      loading = !!currentWord && !fetched && !CURATED[currentWord];
      const localGen = ++generation;
      paint();
      if (!loading) return;
      controller = new AbortController();
      const signal = controller.signal;
      const targetWord = currentWord;

      (async () => {
        try {
          // Try the local database first. It works with Internet disconnected.
          try {
            const response = await fetch(`/api/pronunciation/ipa?word=${encodeURIComponent(targetWord)}`, {signal, cache:'no-store'});
            if (response.ok) {
              fetched = extractOffline(await response.json());
              if (localGen !== generation || signal.aborted) return;
              paint();
            }
          } catch (error) {
            if (signal.aborted) return;
            console.warn('Accent-Aware IPA: offline database unavailable', error);
          }
          if (localGen !== generation || signal.aborted) return;
          // Only use existing online sources for accents absent in the offline DB.
          if (!fetched?.accents?.['en-GB'] || !fetched?.accents?.['en-US']) {
            let entries = null;
            try {
              const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(targetWord)}`, {signal});
              if (response.ok) entries = await response.json();
            } catch (error) {
              if (signal.aborted) return;
              console.warn('Accent-Aware IPA: Free Dictionary API unavailable', error);
            }
            if (localGen !== generation || signal.aborted) return;
            fetched = mergeAccents(fetched, extractLabeled(entries));
            paint();
          }
          if (!fetched.accents['en-GB'] || !fetched.accents['en-US']) {
            // Avoid fetching a complete Wiktionary page for invalid/spurious words.
            if (/^[a-z][a-z'-]{0,49}$/u.test(targetWord)) {
              try {
                const response = await fetch(wiktionaryUrl(targetWord), {signal, cache:'no-store'});
                if (response.ok) {
                  const payload = await response.json();
                  const raw = payload?.parse?.wikitext;
                  const wikitext = typeof raw === 'string' ? raw : raw?.['*'];
                  const secondary = parseWiktionary(wikitext);
                  for (const accent of ['en-GB','en-US']) {
                    if (!fetched.accents[accent] && secondary[accent]) fetched.accents[accent] = secondary[accent];
                  }
                }
              } catch (error) {
                if (signal.aborted) return;
                console.warn('Accent-Aware IPA: Wiktionary unavailable', error);
              }
            }
          }
          if (localGen !== generation || signal.aborted) return;
          cache.set(targetWord, fetched);
        } finally {
          if (localGen === generation && !signal.aborted) {
            loading = false;
            controller = null;
            paint();
          }
        }
      })().catch(error => {
        if (localGen === generation && !signal.aborted) {
          console.warn('Accent-Aware IPA: unexpected loading error', error);
          loading = false;
          controller = null;
          paint();
        }
      });
    }

    const wordObserver = new MutationObserver(updateWord);
    wordObserver.observe(wordElement, {subtree:true, childList:true, characterData:true});
    // Existing DictionaryService may later update the single generic phonetic.
    // Reapply only a locale-evidenced IPA, or the explicit unavailable marker.
    const ipaObserver = new MutationObserver(() => {
      const chosen = resolve(currentWord, accentElement.value, fetched);
      const target = chosen ? chosen.ipa : '—';
      if (ipaElement.textContent !== target) paint();
    });
    ipaObserver.observe(ipaElement, {subtree:true, childList:true, characterData:true});
    accentElement.addEventListener('change', paint);
    updateWord();
  }

  const api = {normalizeIpa, labeledLocale, extractLabeled, extractOffline, mergeAccents, parseWiktionary, wiktionaryUrl, resolve, CURATED};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
