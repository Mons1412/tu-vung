const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const accent = require('../pronunciation/accent-ipa.js');

const wordFixture = `==English==
===Pronunciation===
* {{a|en|UK}} {{IPA|en|/ˈlaɪ.bɹi/}}
** {{a|en|RP}} {{IPA|en|/ˈlaɪ.bɹə.ɹi/}}
* {{a|en|US}}
** {{a|en|GA}} {{IPA|en|/ˈlaɪˌbɹɛɹ.i/|/ˈlaɪ.bɹəɹ.i/}}
* {{a|en|Australia}} {{IPA|en|/wrong/}}
===Noun===
* {{IPA|en|/bad/|a=US}}
==French==
===Pronunciation===
* {{IPA|en|/wrong/|a=US}}
`;

test('library is curated for both UK and US from reviewed data', () => {
  assert.equal(accent.resolve('library','en-GB').ipa, '/ˈlaɪ.brər.i/');
  assert.equal(accent.resolve('library','en-US').ipa, '/ˈlaɪ.brer.i/');
  assert.match(accent.resolve('library','en-GB').source,/Cambridge/);
});

test('Wiktionary parser takes labeled RP and GA, including nested bullet inheritance', () => {
  const p = accent.parseWiktionary(wordFixture);
  assert.equal(p['en-GB'].ipa, '/ˈlaɪ.bɹə.ɹi/');
  assert.equal(p['en-US'].ipa, '/ˈlaɪˌbɹɛɹ.i/');
  assert.match(p['en-GB'].source,/RP/);
  assert.match(p['en-US'].source,/GA/);
});

test('Wiktionary parser handles labels embedded in IPA templates and one IPA shared by UK and US', () => {
  const w = `==English==\n===Pronunciation===\n* {{IPA|en|/ˈtɛst/|a=RP,GA}}\n`;
  const p = accent.parseWiktionary(w);
  assert.equal(p['en-GB'].ipa,'/ˈtɛst/');
  assert.equal(p['en-US'].ipa,'/ˈtɛst/');
});

test('Wiktionary parser does not attribute unlabeled, AU-only, other sections, other languages to US/UK', () => {
  const w = `==English==\n===Pronunciation===\n* {{IPA|en|/no-label/}}\n* {{a|en|AU}} {{IPA|en|/au/}}\n===Noun===\n* {{IPA|en|/wrong/|a=UK}}\n==French==\n===Pronunciation===\n* {{IPA|en|/bad/|a=US}}`;
  const p = accent.parseWiktionary(w);
  assert.equal(p['en-GB'],null);
  assert.equal(p['en-US'],null);
  assert.equal(accent.parseWiktionary('')['en-GB'],null);
});

test('Wiktionary URL uses MediaWiki action API CORS and no credentials', () => {
  const u = new URL(accent.wiktionaryUrl('hello'));
  assert.equal(u.hostname,'en.wiktionary.org');
  assert.equal(u.searchParams.get('origin'),'*');
  assert.equal(u.searchParams.get('prop'),'wikitext');
  assert.equal(u.searchParams.get('page'),'hello');
});

test('DOM fetches accent-specific Wiktionary fallback only after Free Dictionary lacks an accent', async () => {
  class El {
    constructor(content='') { this.textContent=content; this.dataset={}; this.value='en-GB';this.listeners={}; }
    addEventListener(name,handler){this.listeners[name]=handler;}
    fire(name){this.listeners[name]?.();}
  }
  const word = new El('example'), ipa = new El('...'), status = new El(), select = new El();
  const el={'dict-display-word':word,'dict-display-phonetic':ipa,'dict-ipa-status':status,'pron-accent-select':select};
  let requests=[];
  const fakeFetch=async (url) => {
    requests.push(String(url));
    if (String(url).includes('dictionaryapi.dev')) return {ok:true,json:async()=>[{phonetics:[{text:'/ɪɡˈzæmpəl/',audio:'https://host/example-us.mp3'}]}]};
    if (String(url).includes('wiktionary.org')) return {ok:true,json:async()=>({parse:{wikitext:'==English==\n===Pronunciation===\n* {{IPA|en|/ɪɡˈzɑːmpəl/|a=RP}}'}})};
    throw new Error('unexpected URL '+url);
  };
  const ctx={document:{readyState:'complete',getElementById:id=>el[id]}, window:{dispatchEvent(){}},
    Event:class{constructor(type){this.type=type;}}, MutationObserver:class{observe(){}},
    AbortController, URLSearchParams, fetch:fakeFetch, console};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../pronunciation/accent-ipa.js'),'utf8'),ctx);
  for(let i=0; i<20 && !ipa.textContent.startsWith('/'); i++) await new Promise(r=>setTimeout(r,0));
  assert.equal(ipa.textContent,'/ɪɡˈzɑːmpəl/');
  select.value='en-US';select.fire('change');
  assert.equal(ipa.textContent,'/ɪɡˈzæmpəl/');
  assert.equal(requests.filter(u=>u.includes('wiktionary.org')).length,1);
});
