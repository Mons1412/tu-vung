const test = require('node:test');
const assert = require('node:assert/strict');
const pairs = require('../pronunciation/phoneme-data.js');

const validWord = /^[a-z]+$/;
const accents = ['en-US', 'en-GB'];

test('each minimal pair has two distinct playable words and both accent IPA entries', () => {
  assert.ok(pairs.length >= 6);
  const ids = new Set();
  for (const pair of pairs) {
    assert.ok(pair.id && !ids.has(pair.id));
    ids.add(pair.id);
    assert.equal(pair.words.length, 2);
    assert.notEqual(pair.words[0].word, pair.words[1].word);
    assert.ok(pair.name && pair.difference && pair.tips.length >= 2);
    for (const entry of pair.words) {
      assert.match(entry.word, validWord);
      assert.ok(entry.meaning);
      for (const locale of accents) {
        assert.ok(entry.ipa[locale]?.startsWith('/') && entry.ipa[locale]?.endsWith('/'));
      }
    }
    for (const locale of accents) {
      assert.notEqual(pair.words[0].ipa[locale], pair.words[1].ipa[locale]);
    }
  }
});
