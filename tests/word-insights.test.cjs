const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const w = require('../pronunciation/word-insights.js');
const root = path.resolve(__dirname, '..');

test('water IPA has four phones, two vowel nuclei and first stress', () => {
  const result = w.analyzeIPA('/ˈwoːtə/');
  assert.deepEqual(result.phones, ['w','oː','t','ə']);
  assert.equal(result.count, 2);
  assert.equal(result.stress, 1);
  assert.equal(result.estimate, true);
});
test('explicit IPA syllable breaks are recognized without guessing', () => {
  const a = w.analyzeIPA('/ˈɪm.plə.ment/');
  assert.equal(a.count, 3);
  assert.equal(a.estimate, false);
  assert.equal(a.stress, 1);
});
test('secondary + primary stress determines correct syllable', () => {
  const a = w.analyzeIPA('/ˌkɑːmprəˈhensɪv/');
  assert.equal(a.count, 4);
  assert.equal(a.stress, 3);
});
test('rejects ARPAbet masquerading as IPA, and missing IPA', () => {
  assert.equal(w.analyzeIPA('/kAH0 pAE1/'), null);
  assert.equal(w.analyzeIPA('...'), null);
  assert.equal(w.analyzeIPA(''), null);
});
test('linking advice requires matching sentence and keeps accent nuance', () => {
  const noContext = w.linkingAdvice('water', [], 'en-US', w.analyzeIPA('/ˈwoːtə/'));
  assert.match(noContext, /không có cách nối cố định/);
  const a = w.linkingAdvice('water',['The water is cold.'],'en-GB',w.analyzeIPA('/ˈwoːtə/'));
  assert.match(a, /water → is/);
  assert.match(a, /linking \/r\//);
});
test('buildInsights is honest about missing IPA and not a score', () => {
  const result = w.buildInsights({word:'water', ipa:'', accent:'en-US', examples:[]});
  assert.match(result.syllables, /Chưa có dữ liệu/);
  assert.match(result.note, /không phải điểm chấm/);
});
test('HTML and SW include insights, preserve recorder, and invalidate prior cache', () => {
  const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
  const sw = fs.readFileSync(path.join(root,'sw.js'),'utf8');
  for (const id of ['pron-insights-sounds','pron-insights-syllables','pron-insights-stress','pron-insights-linking']) {
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.ok(html.indexOf('id="pron-accent-status"') < html.indexOf('id="pron-insights"'));
  assert.ok(html.indexOf('id="pron-insights"') < html.indexOf('id="btn-pron-practice"'));
  assert.ok(html.includes('pronunciation/word-insights.js'));
  assert.ok(sw.includes('vocamini-cache-v16'));
  assert.ok(sw.includes('pronunciation/word-insights.js'));
  assert.ok(html.includes('btn-pron-stop'));
});
test('DOM integration updates Sounds/Stress/Linking on word, IPA, example and accent changes', () => {
  const vm = require('node:vm');
  class Element {
    constructor(textContent = '') { this.textContent = textContent; this.listeners = {}; this.value = 'en-US'; this.items = []; }
    addEventListener(name, fn) { this.listeners[name] = fn; }
    querySelectorAll() { return this.items.map(x => ({ textContent:x })); }
  }
  const ids = ['dict-display-word', 'dict-display-phonetic', 'pron-accent-select',
    'dict-examples-list','pron-insights-sounds','pron-insights-syllables',
    'pron-insights-stress','pron-insights-linking','pron-insights-note'];
  const els = Object.fromEntries(ids.map(id => [id,new Element()]));
  els['dict-display-word'].textContent='water';
  els['dict-display-phonetic'].textContent='/ˈwoːtə/';
  els['dict-examples-list'].items=['The water is cold.'];
  const observers=[];
  const fakeDoc={readyState:'complete', getElementById: id => els[id]};
  const source = fs.readFileSync(path.join(root,'pronunciation/word-insights.js'),'utf8');
  vm.runInNewContext(source,{
    document:fakeDoc,
    MutationObserver:class {constructor(cb){observers.push(cb)} observe(){}},
    queueMicrotask: fn => fn()
  });
  assert.match(els['pron-insights-syllables'].textContent, /2 âm tiết/);
  assert.match(els['pron-insights-stress'].textContent, /thứ 1/);
  assert.match(els['pron-insights-linking'].textContent, /water → is/);
  els['pron-accent-select'].value='en-GB';
  els['pron-accent-select'].listeners.change();
  assert.match(els['pron-insights-linking'].textContent, /linking \/r\//);
  els['dict-display-word'].textContent='ship';
  els['dict-display-phonetic'].textContent='/ʃɪp/';
  els['dict-examples-list'].items=[];
  observers[0]();
  assert.match(els['pron-insights-syllables'].textContent, /1 âm tiết/);
  assert.doesNotMatch(els['pron-insights-linking'].textContent, /water/);
});
