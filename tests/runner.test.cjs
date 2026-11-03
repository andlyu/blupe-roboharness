const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { createRoot } = require('react-dom/client');
const { JSDOM } = require('jsdom');

function deferred() { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; }
function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: 'https://example.invalid' });
  global.window = dom.window; global.document = dom.window.document;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  let value; let interval; let failedStatus = false; let holdStatus; let holdRun; let status = 'idle'; let attempt;
  const calls = [];
  const fetcher = async (url, options) => {
    const path = url.replace('/api/runner/', ''); calls.push({ path, method: options.method });
    if (path === 'session') return Response.json({ csrf: 'synthetic-token' });
    if (path === 'roboharness/readiness') return Response.json({ ready: true });
    if (path === 'status') {
      if (holdStatus) await holdStatus.promise;
      if (failedStatus) throw new Error('Synthetic disconnected status');
      return Response.json({ status, attempt_id: attempt, episode_id: status === 'idle' ? undefined : 'ep_synthetic' });
    }
    if (path === 'run') { if (holdRun) { await holdRun.promise; return Response.json({ ok: true }); } throw new Error('Synthetic response lost; submission outcome unknown'); }
    if (path === 'stop') { status = 'stopped'; return Response.json({ ok: true }); }
    throw new Error('Unexpected operation');
  };
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync('hooks/use-runner.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module, exports: module.exports, require: name => { assert.equal(name, 'react'); return React; },
    document: dom.window.document, sessionStorage: dom.window.sessionStorage, fetch: fetcher,
    Date, Error, setInterval: fn => { interval = fn; return 1; }, clearInterval() {}, }, { filename: 'use-runner.ts' });
  const { useRunner } = module.exports;
  function Harness() { value = useRunner('yam-1'); return React.createElement('div', null, value.state?.status || 'connecting'); }
  const root = createRoot(dom.window.document.getElementById('root'));
  return { calls, get value() { return value; }, dom,
    mount: () => React.act(async () => { root.render(React.createElement(Harness)); }),
    close: async () => { await React.act(async () => root.unmount()); dom.window.close(); },
    setServer: (next, id) => { status = next; attempt = id; }, holdRun: v => { holdRun = v; },
    failStatus: v => { failedStatus = v; }, holdStatus: v => { holdStatus = v; }, poll: () => React.act(async () => { await interval(); }),
  };
}

test('actual React hook keeps uncertain launch and original clock across reconnect, then reconciles Stop acknowledgement', async () => {
  const h = setup();
  try {
    await h.mount(); assert.equal(h.value.statusVerified, true); assert.equal(h.value.ready.ready, true);
    await React.act(async () => { await h.value.launch({ prompt: 'Synthetic non-actuating test' }); });
    const clicked = h.value.startedAt;
    assert(clicked > 0); assert.equal(h.value.uncertain, true);
    const held = deferred(); h.holdStatus(held);
    await React.act(async () => h.value.reconnect());
    assert.equal(h.value.statusVerified, false); assert.equal(h.value.uncertain, true); assert.equal(h.value.startedAt, clicked);
    await React.act(async () => { await h.value.launch({}); });
    assert.equal(h.calls.filter(c => c.path === 'run').length, 1);
    h.holdStatus(null); await React.act(async () => held.resolve());
    assert.equal(h.value.statusVerified, true); assert.equal(h.value.ready.ready, true); assert.equal(h.value.uncertain, true);
    await React.act(async () => { await h.value.launch({}); });
    assert.equal(h.calls.filter(c => c.path === 'run').length, 1);
    await React.act(async () => { await h.value.stop(); });
    assert.equal(h.value.state.status, 'stopped'); assert.equal(h.value.uncertain, false); assert.equal(h.value.startedAt, clicked);
    assert.equal(h.calls.filter(c => c.path === 'stop').length, 1);
  } finally { await h.close(); }
});

test('status loss locks launch and recovery never submits automatically', async () => {
  const h = setup();
  try {
    await h.mount(); h.failStatus(true); await h.poll();
    assert.equal(h.value.statusVerified, false); assert.match(h.value.error, /disconnected/);
    await React.act(async () => { await h.value.launch({}); });
    assert.equal(h.calls.filter(c => c.path === 'run').length, 0);
    h.failStatus(false); await h.poll(); assert.equal(h.value.statusVerified, true); assert.equal(h.value.error, '');
    assert.equal(h.calls.filter(c => c.path === 'run').length, 0);
  } finally { await h.close(); }
});


test('new launch never pairs old attempt evidence with its new click clock', async () => {
  const h = setup();
  try {
    h.setServer('stopped', 'previous-attempt'); await h.mount();
    assert.equal(h.value.state.attempt_id, 'previous-attempt');
    const pending = deferred(); h.holdRun(pending); let launch;
    await React.act(async () => { launch = h.value.launch({ prompt: 'Synthetic non-actuating new attempt' }); });
    const clicked = h.value.startedAt;
    assert.equal(h.value.submitting, true); assert.equal(h.value.state, null);
    await h.poll(); assert.equal(h.value.state, null);
    const stored = JSON.parse(h.dom.window.sessionStorage.getItem('roboharness.intent.yam-1'));
    assert.equal(stored.previousAttempt, 'previous-attempt'); assert.equal(stored.at, clicked);
    h.setServer('queued', 'new-attempt');
    await React.act(async () => { pending.resolve(); await launch; });
    assert.equal(h.value.state.attempt_id, 'new-attempt');
    assert.equal(h.value.uncertain, false); assert.equal(h.value.startedAt, clicked);
    assert.equal(h.calls.filter(c => c.path === 'run').length, 1);
  } finally { await h.close(); }
});
