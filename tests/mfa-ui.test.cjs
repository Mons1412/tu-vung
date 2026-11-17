const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'pronunciation/recorder.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

test('MFA UI has independent button and accessible status area', () => {
  for (const id of ['pron-phone-alignment','btn-pron-align','pron-align-status','pron-phone-track']) {
    assert.ok(html.includes(`id="${id}"`), `missing ${id}`);
    if (id !== 'pron-phone-alignment') assert.ok(js.includes(`'${id}'`), `javascript missing ${id}`);
  }
  assert.match(html, /không đánh giá âm nào đúng hoặc sai/);
});

test('MFA is gated to US, expected word and user action', () => {
  assert.match(js, /this\.asrMatched = data\.matched;/);
  assert.match(js, /this\.currentAccent !== 'en-US'/);
  assert.match(js, /this\.alignButton\?\.addEventListener\('click'/);
  assert.match(js, /fetch\('\/api\/pronunciation\/align'/);
  assert.match(js, /this\.clearPhonemeAlignment\(\)/);
});

test('Service Worker bypasses all APIs', () => {
  assert.match(sw, /requestUrl\.pathname\.startsWith\('\/api\/'\)/);
  assert.match(sw, /vocamini-cache-v10/);
});
