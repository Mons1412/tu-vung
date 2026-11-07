const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const pairs = require('../pronunciation/phoneme-data.js');

class FakeElement {
  constructor(id = '') {
    this.id = id;
    this.textContent = '';
    this.value = '';
    this.children = [];
    this.listeners = {};
    this.className = '';
  }
  addEventListener(event, callback) { this.listeners[event] = callback; }
  appendChild(node) { this.children.push(node); return node; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  fire(event) { this.listeners[event]?.(); }
}

test('minimal-pair UI renders both cards, changes accent, and triggers existing dictionary practice', () => {
  const ids = ['pron-minimal-pairs', 'pron-pair-select', 'dict-display-word', 'pron-accent-select',
    'pron-pair-cards', 'pron-pair-difference', 'pron-pair-tips', 'pron-pair-status',
    'dict-search-input', 'dict-search-form'];
  const elements = Object.fromEntries(ids.map(id => [id, new FakeElement(id)]));
  elements['pron-accent-select'].value = 'en-US';
  elements['dict-display-word'].textContent = 'Word';
  let submitted = 0;
  elements['dict-search-form'].requestSubmit = () => { submitted++; };
  const dispatched = [];
  const win = { VocaMiniMinimalPairs: pairs, dispatchEvent: event => dispatched.push(event) };
  const document = {
    readyState: 'complete',
    getElementById: id => elements[id],
    createElement: () => new FakeElement(),
    addEventListener: () => {}
  };
  const script = fs.readFileSync(require.resolve('../pronunciation/minimal-pairs.js'), 'utf8');
  vm.runInNewContext(script, {
    document, window: win,
    MutationObserver: class { observe() {} },
    Event: class { constructor(type) { this.type = type; } },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } }
  });
  assert.equal(elements['pron-pair-select'].children.length, pairs.length);
  let cards = elements['pron-pair-cards'].children;
  assert.equal(cards.length, 2);
  assert.equal(cards[0].children[0].textContent, 'ship');
  assert.equal(cards[1].children[1].textContent, '/ʃiːp/');

  cards[0].children[3].children[0].fire('click');
  assert.deepEqual(dispatched.map(e => e.type), ['vocamini:prepare-reference-audio', 'vocamini:speak-reference-word']);
  assert.equal(dispatched[1].detail.word, 'ship');

  cards[1].children[3].children[1].fire('click');
  assert.equal(elements['dict-search-input'].value, 'sheep');
  assert.equal(submitted, 1);

  elements['pron-pair-select'].value = 'thin-tin';
  elements['pron-pair-select'].fire('change');
  cards = elements['pron-pair-cards'].children;
  assert.equal(cards[0].children[0].textContent, 'thin');
  assert.equal(cards[1].children[1].textContent, '/tɪn/');
  elements['pron-accent-select'].value = 'en-GB';
  elements['pron-accent-select'].fire('change');
  assert.ok(elements['pron-pair-status'].textContent.includes('en-GB'));
});
