const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'pronunciation/recorder.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');

class FakeElement {
  constructor(id = '') {
    this.id = id; this.textContent = ''; this.value = ''; this.hidden = true;
    this.children = []; this.listeners = {}; this.attributes = {};
    this.classList = { contains: () => true };
  }
  addEventListener(name, cb) { this.listeners[name] = cb; }
  setAttribute(name, value) { this.attributes[name] = value; }
  replaceChildren(...children) { this.children = children; }
  append(...children) { this.children.push(...children); }
  pause() {}
  removeAttribute(name) { delete this.attributes[name]; }
  load() {}
  getContext() { return { clearRect() {} }; }
}
function makeRecorder() {
  const ids = ['pron-record-panel', 'btn-pron-practice', 'btn-pron-close', 'btn-pron-record',
    'btn-pron-stop', 'btn-pron-clear', 'pron-record-timer', 'pron-record-status',
    'pron-record-target', 'pron-record-accent', 'pron-record-playback', 'dict-display-word',
    'pron-accent-select', 'view-dict', 'pron-compare-panel', 'btn-pron-compare-sample',
    'btn-pron-compare-self', 'btn-pron-compare-retry', 'pron-playback-speed',
    'pron-compare-status', 'pron-user-waveform', 'pron-wave-meta', 'btn-pron-asr',
    'pron-asr-result', 'pron-audio-quality', 'pron-audio-quality-result',
    'pron-word-timing', 'pron-word-timing-result', 'pron-word-timing-track',
    'btn-pron-align', 'pron-align-status', 'pron-phone-track', 'pron-acoustic-features',
    'pron-feature-status', 'pron-feature-track'];
  const els = Object.fromEntries(ids.map(id => [id, new FakeElement(id)]));
  els['dict-display-word'].textContent = 'water';
  els['pron-accent-select'].value = 'en-US';
  const win = { addEventListener() {}, setInterval() { return 1; }, setTimeout() { return 2; },
    clearInterval() {}, clearTimeout() {} };
  const document = { getElementById: id => els[id], addEventListener() {},
    createElement: tag => new FakeElement(tag) };
  const script = js.replace("  document.addEventListener('DOMContentLoaded'", "  window.__TestRecorder = PronunciationRecorder;\n  document.addEventListener('DOMContentLoaded'");
  vm.runInNewContext(script, { window: win, document, console, Blob, URL: {
    createObjectURL: () => 'blob:test', revokeObjectURL: () => {}
  }, MutationObserver: class { observe() {} }, Event: class {}, navigator: {} });
  return { recorder: new win.__TestRecorder(), els };
}

test('practice button starts capture immediately after opening (one click)', () => {
  const { recorder, els } = makeRecorder();
  recorder.updateTarget();
  let starts = 0;
  recorder.start = () => { starts++; };
  recorder.togglePanel();
  assert.equal(els['pron-record-panel'].hidden, false);
  assert.equal(starts, 1);
  assert.equal(els['btn-pron-practice'].attributes['aria-expanded'], 'true');
  // A second click closes the panel, rather than initiating another recorder.
  recorder.togglePanel();
  assert.equal(els['pron-record-panel'].hidden, true);
  assert.equal(starts, 1);
});

test('a completed valid recording automatically invokes Vosk once', () => {
  const { recorder, els } = makeRecorder();
  recorder.updateTarget();
  els['pron-record-panel'].hidden = false;
  let calls = 0;
  recorder.recognizeOffline = () => { calls++; };
  recorder.analyzeAudio = () => {};
  const session = { generation: recorder.generation, cancelled: false,
    chunks: [new Blob(['hi'], { type: 'audio/webm' })],
    stream: { getTracks: () => [{ stop() {} }] },
    recorder: { mimeType: 'audio/webm' } };
  recorder.finish(session);
  assert.equal(recorder.phase, 'ready');
  assert.equal(calls, 1);
  assert.equal(els['pron-compare-panel'].hidden, false);
  assert.match(els['pron-record-status'].textContent, /Vosk đang nhận diện/);
});

test('cancelled or stale recordings do not auto-send to Vosk', () => {
  const { recorder, els } = makeRecorder();
  recorder.updateTarget();
  els['pron-record-panel'].hidden = false;
  let calls = 0;
  recorder.recognizeOffline = () => { calls++; };
  recorder.analyzeAudio = () => {};
  const fakeSession = { generation: recorder.generation, cancelled: true,
    chunks: [new Blob(['hi'])], stream: { getTracks: () => [{ stop() {} }] },
    recorder: { mimeType: 'audio/webm' } };
  recorder.finish(fakeSession);
  assert.equal(calls, 0);
  fakeSession.cancelled = false;
  recorder.generation++;
  recorder.finish(fakeSession);
  assert.equal(calls, 0);
});

test('minimal pairs and A/B checkbox self-check are absent from practice panel, code preserved', () => {
  assert.doesNotMatch(html, /id="pron-minimal-pairs"/);
  assert.doesNotMatch(html, /class="pron-self-check"/);
  assert.doesNotMatch(html, /<script src="pronunciation\/(?:phoneme-data|minimal-pairs)\.js"><\/script>/);
  assert.ok(fs.existsSync(path.join(root, 'pronunciation/minimal-pairs.js')));
  assert.ok(fs.existsSync(path.join(root, 'pronunciation/phoneme-data.js')));
  assert.doesNotMatch(sw, /"\.\/pronunciation\/minimal-pairs\.js"/);
  assert.match(js, /void this\.recognizeOffline\(\)/);
  assert.match(js, /MAX_DURATION_MS = 15000/);
});
