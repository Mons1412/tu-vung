const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const accent = require('../pronunciation/accent-ipa.js');

test('offline records preserve US/UK and alternate variants without guessing', () => {
  const parsed = accent.extractOffline({word:'schedule',accents:{
    'en-US':[{'variant_index':1,ipa:'/ˈskɛdʒuɫ/',source:'ipa-dict/en_US'}],
    'en-GB':[
      {variant_index:1,ipa:'/ˈʃɛdʒuːl/',source:'Britfone/3.0.1'},
      {variant_index:2,ipa:'/ˈskɛdʒuːl/',source:'Britfone/3.0.1'}]
  }});
  assert.equal(parsed.accents['en-GB'].variants,2);
  assert.equal(accent.resolve('scheduleX','en-GB', parsed).ipa,'/ˈʃɛdʒuːl/');
  assert.equal(parsed.accents['en-US'].ipa,'/ˈskɛdʒuɫ/');
});

test('missing one accent never borrows IPA from the other', () => {
  const primary = accent.extractOffline({accents:{'en-GB':[], 'en-US':[{ipa:'/ˈwɜrd/', source:'ipa-dict/en_US'}]}});
  assert.equal(primary.accents['en-GB'],null);
  const merged = accent.mergeAccents(primary,{accents:{'en-US': {ipa:'/invalid/',source:'API'},'en-GB':null}});
  assert.equal(merged.accents['en-US'].source,'ipa-dict/en_US (offline)');
  assert.equal(merged.accents['en-GB'],null);
});

test('accent module queries local IPA endpoint before online for a complete offline word', async () => {
  class El {
    constructor(text='') {this.textContent=text; this.value='en-US'; this.dataset={}; this.listeners={};}
    addEventListener(name,fn){this.listeners[name]=fn;}
    fire(name){this.listeners[name]?.();}
  }
  const word=new El('book'), ipa=new El('...'), status=new El(''), select=new El();
  const dom={'dict-display-word':word,'dict-display-phonetic':ipa,'dict-ipa-status':status,'pron-accent-select':select};
  const calls=[];
  const fetchFake=async(url)=>{
    calls.push(url);
    assert.ok(url.startsWith('/api/pronunciation/ipa?word='),'should not call online if offline has both accents');
    return {ok:true,json:async()=>({word:'book',accents:{
      'en-US':[{ipa:'/ˈbʊk/',source:'ipa-dict/en_US',variant_index:1}],
      'en-GB':[{ipa:'/ˈbʊk/',source:'Britfone/3.0.1',variant_index:1}]
    }})};
  };
  const context={document:{readyState:'complete',getElementById:id=>dom[id]},
    window:{dispatchEvent(){}},Event:class{constructor(type){this.type=type;}},
    MutationObserver:class{observe(){}},fetch:fetchFake,AbortController,URLSearchParams,console};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../pronunciation/accent-ipa.js'),'utf8'),context);
  await new Promise(resolve=>setTimeout(resolve,20));
  assert.equal(calls.length,1);
  assert.equal(ipa.textContent,'/ˈbʊk/');
  assert.match(status.textContent,/offline/);
  select.value='en-GB'; select.fire('change');
  assert.equal(ipa.textContent,'/ˈbʊk/');
});
