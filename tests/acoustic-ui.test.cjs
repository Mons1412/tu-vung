const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'pronunciation/recorder.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

class Element {
  constructor(id = '') {
    this.id=id; this.textContent=''; this.hidden=true; this.children=[]; this.listeners={};
    this.className=''; this.value=''; this.classList={contains: () => true};
  }
  addEventListener(type, cb) { this.listeners[type]=cb; }
  replaceChildren(...items) { this.children=items; }
  append(...items) { this.children.push(...items); }
  appendChild(item) { this.children.push(item); }
  setAttribute() {}
}

function createRecorder() {
  const ids = ['pron-record-panel','btn-pron-practice','btn-pron-close','btn-pron-record',
    'btn-pron-stop','btn-pron-clear','pron-record-timer','pron-record-status','pron-record-target',
    'pron-record-accent','pron-record-playback','dict-display-word','pron-accent-select',
    'view-dict','pron-compare-panel','btn-pron-compare-sample','btn-pron-compare-self',
    'btn-pron-compare-retry','pron-playback-speed','pron-compare-status','pron-user-waveform',
    'pron-wave-meta','btn-pron-asr','pron-asr-result','pron-audio-quality',
    'pron-audio-quality-result','pron-word-timing','pron-word-timing-result',
    'pron-word-timing-track','btn-pron-align','pron-align-status','pron-phone-track',
    'pron-acoustic-features','pron-feature-status','pron-feature-track'];
  const els=Object.fromEntries(ids.map(id=>[id,new Element(id)]));
  const win={addEventListener:()=>{}};
  const doc={
    getElementById: id=>els[id],
    createElement: tag=>new Element(tag),
    addEventListener:()=>{},
  };
  const ctx={
    document:doc,
    window:win,
    MutationObserver:class {observe(){}},
    Event:class {},
    navigator:{},
    console
  };
  // Expose the class only in this VM's code copy; production script is unchanged.
  vm.runInNewContext(script.replace("  document.addEventListener('DOMContentLoaded'", "  window.__TestRecorder = PronunciationRecorder;\n  document.addEventListener('DOMContentLoaded'"),ctx);
  return {recorder:new win.__TestRecorder(),els};
}

test('features panel is opt-in, local, and clearly not a pronunciation score',()=>{
  for (const id of ['pron-acoustic-features','pron-feature-status','pron-feature-track']) {
    assert.match(html,new RegExp(`id="${id}"`));
    assert.ok(script.includes(`'${id}'`));
  }
  assert.match(html,/KHÔNG phải điểm phát âm/);
  assert.match(html,/ZCR/);
  assert.match(sw,/vocamini-cache-v16/);
  assert.match(sw,/requestUrl\.pathname\.startsWith\('\/api\/'\)/);
});

test('features are only rendered from actual MFA intervals and are cleared on retry',()=>{
  assert.match(script,/this\.renderAcousticFeatures\(data\.acoustic_features, intervals, data\.duration_s\)/);
  assert.match(script,/features\.source !== 'pcm16_mfa_interval_features'/);
  assert.match(script,/features\.pronunciation_score !== null/);
  assert.match(script,/Math\.abs\(feature\.start_s - phone\.start_s\)/);
  assert.match(script,/this\.clearAcousticFeatures\(\)/);
  assert.match(script,/numbers\.textContent/);
  // Every number is textContent, so labels from the API cannot inject HTML.
  assert.doesNotMatch(script,/numbers\.innerHTML/);
});


test('real feature renderer displays only validated matching measurements and cleans old rows',()=>{
  const {recorder,els}=createRecorder();
  const aligned=[{phone:'W',start_s:.1,end_s:.2},{phone:'AA1',start_s:.2,end_s:.5}];
  const features={
    source:'pcm16_mfa_interval_features',status:'extracted',feature_only:true,
    pronunciation_score:null,sample_rate_hz:16000,duration_s:1,
    intervals:[
      {phone:'W',start_s:.1,end_s:.2,duration_ms:100,rms_dbfs:-29.5,peak_dbfs:-11,zero_crossings_per_s:256.2,clipped_pct:0},
      {phone:'AA1',start_s:.2,end_s:.5,duration_ms:300,rms_dbfs:-25,peak_dbfs:-8.2,zero_crossings_per_s:460,clipped_pct:0}
    ]
  };
  recorder.renderAcousticFeatures(features,aligned,1);
  assert.equal(els['pron-acoustic-features'].hidden,false);
  assert.equal(els['pron-feature-track'].children.length,2);
  assert.match(els['pron-feature-track'].children[0].children[1].textContent,/RMS -29.5 dBFS/);
  assert.match(els['pron-feature-status'].textContent,/Không chấm phát âm/);
  const corrupted=JSON.parse(JSON.stringify(features));
  corrupted.intervals[0].start_s=.8;
  recorder.renderAcousticFeatures(corrupted,aligned,1);
  assert.equal(els['pron-acoustic-features'].hidden,true);
  assert.equal(els['pron-feature-track'].children.length,0);
  recorder.renderAcousticFeatures(features,aligned,1);
  recorder.clearPhonemeAlignment();
  assert.equal(els['pron-acoustic-features'].hidden,true);
  assert.equal(els['pron-feature-track'].children.length,0);
});
