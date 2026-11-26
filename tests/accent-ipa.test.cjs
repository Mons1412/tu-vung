const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const accent = require('../pronunciation/accent-ipa.js');
const insights = require('../pronunciation/word-insights.js');

test('curated water and schedule switch UK and US without using generic API IPA', () => {
  assert.equal(accent.resolve('water','en-GB').ipa, '/ˈwɔː.tə/');
  assert.equal(accent.resolve('water','en-US').ipa, '/ˈwɑː.t̬ɚ/');
  assert.equal(accent.resolve('schedule','en-GB').ipa, '/ˈʃedʒ.uːl/');
  assert.equal(accent.resolve('schedule','en-US').ipa, '/ˈskedʒ.uːl/');
  const i=insights.buildInsights({word:'water',ipa:accent.resolve('water','en-US').ipa,accent:'en-US',examples:[],ipaVerified:true,ipaSource:'Cambridge'});
  assert.match(i.syllables,/2 âm tiết/);
  assert.match(i.stress,/thứ 1/);
  assert.match(i.note,/IPA US có nguồn/);
});

test('only IPA/audio in same object labeled US or UK counts as evidence', () => {
  const entries=[{
    phonetic:'/ˈskɛ.dʒu.əl/',
    phonetics:[
      {text:'',audio:'https://api.dictionaryapi.dev/media/pronunciations/en/schedule-au.mp3'},
      {text:'/ˈskɛ.dʒu.əl/',audio:''},
      {text:'/ʃɛ.djuːl/',audio:''},
      {text:'/ˈskɛ.dʒu.əl/',audio:'https://api.dictionaryapi.dev/media/pronunciations/en/schedule-us.mp3'}
    ]
  }];
  const parsed = accent.extractLabeled(entries);
  assert.equal(parsed.accents['en-US'].ipa, '/ˈskɛ.dʒu.əl/');
  assert.equal(parsed.accents['en-GB'], null);
  assert.equal(accent.resolve('unlisted','en-GB',parsed),null);
  assert.equal(parsed.unlabeled,'/ˈskɛ.dʒu.əl/');
});

test('realistically labeled UK audio and explicit region metadata are supported', () => {
  const parsed = accent.extractLabeled([{phonetics:[
    {text:'həˈləʊ',audio:'//ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3'},
    {text:'/həˈloʊ/',locale:'en-US'}
  ]}]);
  assert.equal(parsed.accents['en-GB'].ipa,'/həˈləʊ/');
  assert.equal(parsed.accents['en-US'].ipa,'/həˈloʊ/');
});

test('unlabeled IPA, ARPAbet and AU-only audio never get a guessed UK/US locale', () => {
  const result=accent.extractLabeled([{phonetic:'/ˈwoːtə/',phonetics:[
    {text:'/ˈwoːtə/',audio:''},
    {text:'/wɒtə/',audio:'https://host/water-au.mp3'},
    {text:'/kAH0 pAE1/',audio:'https://host/water-us.mp3'}
  ]}]);
  assert.equal(result.accents['en-GB'],null);
  assert.equal(result.accents['en-US'],null);
  assert.equal(result.unlabeled,'/ˈwoːtə/');
  assert.equal(accent.normalizeIpa('/kAH0 pAE1/'),null);
});

test('DOM locale switching and repeated generic overwrites keep verified IPA and update word insights', () => {
  class El {
    constructor(text='') { this.textContent=text; this.dataset={}; this.value='en-GB';this.listeners={}; }
    addEventListener(name,fn) { this.listeners[name]=fn; }
    fire(name) { this.listeners[name]?.(); }
  }
  const word=new El('water'), ipa=new El('...'), status=new El(''), select=new El();
  const els={'dict-display-word':word,'dict-display-phonetic':ipa,'dict-ipa-status':status,'pron-accent-select':select};
  const observers=[];
  const listeners={};
  const fakeWindow={addEventListener(name,fn){listeners[name]=fn;},dispatchEvent(event){listeners[event.type]?.();}};
  const context={document:{readyState:'complete',getElementById:(id)=>els[id]},window:fakeWindow,
    Event:class{constructor(type){this.type=type;}},
    MutationObserver:class{constructor(fn){observers.push(fn);}observe(){}},
    fetch:()=>{throw new Error('should not fetch curated word');}, AbortController};
  vm.runInNewContext(fs.readFileSync(path.join(root,'pronunciation/accent-ipa.js'),'utf8'),context);
  assert.equal(ipa.textContent,'/ˈwɔː.tə/');
  assert.match(status.textContent,/IPA UK/);
  assert.equal(ipa.dataset.ipaVerified,'true');
  select.value='en-US';select.fire('change');
  assert.equal(ipa.textContent,'/ˈwɑː.t̬ɚ/');
  ipa.textContent='/ˈwoːtə/';observers[1]();
  assert.equal(ipa.textContent,'/ˈwɑː.t̬ɚ/');
  word.textContent='schedule';observers[0]();
  assert.equal(ipa.textContent,'/ˈskedʒ.uːl/');
  select.value='en-GB';select.fire('change');
  assert.equal(ipa.textContent,'/ˈʃedʒ.uːl/');
});

test('HTML, SW and readme integrate module without removing recorder/MFA', () => {
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  assert.ok(html.includes('id="dict-ipa-status"'));
  assert.ok(html.includes('pronunciation/accent-ipa.js'));
  assert.ok(sw.includes('vocamini-cache-v16'));
  assert.ok(sw.includes('pronunciation/accent-ipa.js'));
  assert.ok(html.includes('btn-pron-stop'));
  assert.ok(html.includes('btn-pron-align'));
  assert.ok(fs.existsSync(path.join(root,'PHASE6_ACCENT_AWARE_IPA_README.md')));
});
