const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Compile the actual deployed route modules. No accepting command validator or
// physical transport is substituted; these tests certify only monitoring and
// the pending-integration launch refusal, not the motion command contract.
function load(file, fetchImpl) {
  const filename = path.resolve(file);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const requireLocal = name => {
    if (name === '@/lib/roboharness' || name === './roboharness') return load('lib/roboharness.ts', fetchImpl);
    throw new Error('Unexpected import: ' + name);
  };
  vm.runInNewContext(code, { module, exports: module.exports, require: requireLocal, fetch: fetchImpl,
    Request, Response, Headers, TextEncoder, URL, AbortSignal, Date, setTimeout }, { filename });
  return module.exports;
}

test('unconfigured run refuses before any outbound request', async () => {
  let count = 0;
  const route = load('app/api/run/route.ts', () => { count++; throw new Error('Unexpected network'); });
  const response = await route.POST(new Request('https://example.com/api/run', { method: 'POST' }));
  assert.equal(response.status, 503);
  const data = await response.json();
  assert.equal(data.state, 'not_submitted'); assert.equal(data.outbound_actuator_submissions, 0); assert.equal(count, 0);
});

test('runner gateway rejects unknown routes, cross-origin writes and station traversal before network', async () => {
  let count = 0;
  const { proxyRunner } = load('lib/runner-proxy.ts', () => { count++; throw new Error('Unexpected network'); });
  const request = (path, headers = {}) => new Request('https://example.com/api/runner/' + path, {
    method: 'POST', headers: { Origin: 'https://example.com', 'Content-Type': 'application/json', 'X-Blupe-Robot': 'yam-1', ...headers }, body: '{}',
  });
  assert.equal((await proxyRunner(request('arbitrary'), ['arbitrary'])).status, 404);
  assert.equal((await proxyRunner(request('run', { Origin: 'https://attacker.invalid' }), ['run'])).status, 403);
  assert.equal((await proxyRunner(request('run', { 'X-Blupe-Robot': '../other' }), ['run'])).status, 400);
  assert.equal(count, 0);
});

test('runner gateway preserves normal session cookies, CSRF, station and exact body on the trusted hop', async () => {
  const calls = [];
  const { proxyRunner, RUNNER_ORIGIN } = load('lib/runner-proxy.ts', async (url, options) => {
    calls.push({ url, options });
    return Response.json({ status: 'queued' }, { headers: { 'Set-Cookie': 'visitor=synthetic; Path=/; HttpOnly; Secure; SameSite=Strict' } });
  });
  const body = JSON.stringify({ provider: 'roboharness', model: 'RoboHarness', runner_name: 'Synthetic runner', email: 'synthetic@example.invalid' });
  const r = await proxyRunner(new Request('https://example.com/api/runner/run', { method: 'POST', body, headers: {
    Origin: 'https://example.com', 'Content-Type': 'application/json', 'X-Blupe-Robot': 'yam-1', Cookie: 'visitor=synthetic', 'X-Yam-Runner-Token': 'synthetic-token',
  } }), ['run']);
  assert.equal(r.status, 200); assert.equal(calls.length, 1);
  assert.equal(calls[0].url, RUNNER_ORIGIN + '/api/run');
  assert.equal(calls[0].options.body, body);
  assert.equal(calls[0].options.headers.get('Origin'), RUNNER_ORIGIN);
  assert.equal(calls[0].options.headers.get('Cookie'), 'visitor=synthetic');
  assert.equal(calls[0].options.headers.get('X-Yam-Runner-Token'), 'synthetic-token');
  assert(r.headers.get('set-cookie').includes('HttpOnly'));
});

test('ambiguous runner failures and redirects are surfaced without automatic retry', async () => {
  for (const outcome of ['network', 'redirect', 'gateway']) {
    let calls = 0;
    const { proxyRunner } = load('lib/runner-proxy.ts', async () => {
      calls++; if (outcome === 'network') throw new Error('Lost response');
      if (outcome === 'gateway') return new Response('error code: 525', { status: 525, headers: { 'Content-Type': 'text/plain' } });
      return new Response(null, { status: 302, headers: { Location: 'https://unrelated.invalid' } });
    });
    const r = await proxyRunner(new Request('https://example.com/api/runner/stop', { method: 'POST', body: '{}', headers: {
      Origin: 'https://example.com', 'Content-Type': 'application/json', 'X-Blupe-Robot': 'yam-1',
    } }), ['stop']);
    assert.equal(r.status, 503); assert.equal(calls, 1); assert.match((await r.json()).error, /never retried automatically/);
  }
});

test('unknown station and camera cannot become arbitrary upstream URLs', async () => {
  let count = 0;
  const fetcher = () => { count++; throw new Error('Unexpected network'); };
  const station = load('app/api/station/route.ts', fetcher);
  const camera = load('app/api/camera/route.ts', fetcher);
  for (const id of ['', 'other-robot', '../sessions', 'https://example.org']) {
    assert.equal((await station.GET(new Request('https://example.com/api/station?id=' + encodeURIComponent(id)))).status, 400);
  }
  assert.equal((await camera.GET(new Request('https://example.com/api/camera?id=yam-1&camera=../../sessions'))).status, 400);
  assert.equal(count, 0);
});

test('station route projects public state without runner email or capability', async () => {
  const calls = [];
  const route = load('app/api/station/route.ts', async (url, options) => {
    calls.push({ url, options });
    return Response.json(url.endsWith('/queue') ? {
      entries: [{ email: 'private@example.invalid', session_capability: 'secret' }],
      stations: [{ jetson_id: 'yam-1', connected: true, available: false, mode: 'DISABLED' }],
    } : { homed: false, settled: false, observed_at: 123, safety: { ok: false, reason: 'hardware_not_initialized' }, email: 'private@example.invalid' });
  });
  const response = await route.GET(new Request('https://example.com/api/station?id=yam-1'));
  assert.equal(response.status, 200);
  const body = await response.text();
  assert(!body.includes('private@example.invalid')); assert(!body.includes('secret'));
  assert.equal(JSON.parse(body).mode, 'DISABLED'); assert.equal(JSON.parse(body).queue_length, 1);
  assert(calls.every(c => c.url.startsWith('https://yam-session-api.n5hthc3gj4cqy.us-east-1.cs.amazonlightsail.com/v1/robots/yam-1/')));
  assert(calls.every(c => c.options.redirect === 'manual' && c.options.cache === 'no-store'));
});

test('upstream monitoring failure remains an error, with no invented readiness', async () => {
  const route = load('app/api/station/route.ts', async () => { throw new Error('offline'); });
  const r = await route.GET(new Request('https://example.com/api/station?id=yam-1'));
  assert.equal(r.status, 502); assert(!('available' in await r.json()));
});

test('camera rejects a non-image upstream response', async () => {
  const route = load('app/api/camera/route.ts', async () => Response.json({ wrong: true }));
  assert.equal((await route.GET(new Request('https://example.com/api/camera?id=yam-1&camera=top'))).status, 502);
});

test('edge-compatible manual redirect mode rejects redirect responses', async () => {
  let calls = 0;
  const route = load('app/api/station/route.ts', async (_url, options) => {
    calls++; assert.equal(options.redirect, 'manual');
    return new Response(null, { status: 302, headers: { Location: 'https://unrelated.example/' } });
  });
  assert.equal((await route.GET(new Request('https://example.com/api/station?id=yam-1'))).status, 502);
  assert.equal(calls, 2);
});


test('immutable replay media forwards station and byte range without widening routes', async () => {
  const calls=[];
  const { proxyRunner }=load('lib/runner-proxy.ts',async (url,options)=>{calls.push({url,options});return new Response(new Uint8Array([1,2,3]),{status:206,headers:{'Content-Type':'video/mp4','Content-Range':'bytes 0-2/20','Accept-Ranges':'bytes',ETag:'"synthetic-digest"'}});});
  const digest='a'.repeat(64),parts=['integration-replays','ep_offline',digest+'.mp4'];
  const response=await proxyRunner(new Request('https://example.com/api/runner/'+parts.join('/')+'?robot_id=robot-ba8413962083809c',{headers:{Range:'bytes=0-2'}}),parts);
  assert.equal(response.status,206);assert.equal(response.headers.get('content-type'),'video/mp4');assert.equal(response.headers.get('content-range'),'bytes 0-2/20');
  assert.equal((await response.arrayBuffer()).byteLength,3);assert.equal(calls[0].options.headers.get('Range'),'bytes=0-2');assert.equal(calls[0].options.headers.get('X-Blupe-Robot'),'robot-ba8413962083809c');
  const before=calls.length;
  assert.equal((await proxyRunner(new Request('https://example.com/api/runner/x'),['integration-replays','../other','bad.mp4'])).status,404);
  assert.equal((await proxyRunner(new Request('https://example.com/api/runner/'+parts.join('/')+'?robot_id=other'),parts)).status,400);assert.equal(calls.length,before);
});

test('replay sources accept only matched integration clips or the normal public archive',()=>{
  const {replaySource}=load('lib/replay.ts',()=>{throw new Error('Unexpected network');});
  assert.equal(replaySource('/api/integration-replays/ep_offline/'+'a'.repeat(64)+'.mp4','yam-1'),'/api/runner/integration-replays/ep_offline/'+'a'.repeat(64)+'.mp4?robot_id=yam-1');
  assert.equal(replaySource('https://unrelated.invalid/private.mp4','yam-1'),null);
  assert.equal(replaySource('/api/integration-replays/../private.mp4','yam-1'),null);
  const archive='https://huggingface.co/datasets/andlyu/Public-YAM-runs/resolve/main/videos/ep_offline.mp4';assert.equal(replaySource(archive,'yam-1'),archive);
});


test('verification feed projects only revision-bound public evidence', async()=>{
  const route=load('app/api/verification/route.ts',async(url)=>{assert(url.startsWith('https://raw.githubusercontent.com/andlyu/blupe-roboharness/main/docs/evidence/verification.json'));return Response.json({source_revision:'a'.repeat(40),email:'private@example.invalid',checks:[{id:1,status:'passed',email:'private@example.invalid',evidence:['https://github.com/andlyu/blupe-roboharness/blob/main/docs/COMPLETION-CHECKLIST.md','https://unrelated.invalid/','javascript:bad']},{id:2,status:'passed',evidence:[]}]});});
  const r=await route.GET();assert.equal(r.status,200);const d=await r.json();assert.equal(d.checks[0].passed,true);assert.equal(d.checks[1].passed,false);assert.equal(d.checks[0].evidence.length,1);assert(!JSON.stringify(d).includes('private@example.invalid'));
});

test('missing or ambiguous verification evidence cannot create passes', async()=>{
  for(const data of [null,{source_revision:'a'.repeat(40),checks:[{id:1},{id:1}]},{source_revision:'other',checks:[]}]){
    const route=load('app/api/verification/route.ts',async()=>data ? Response.json(data) : new Response('missing',{status:404}));
    const r=await route.GET();assert.equal(r.status,503);assert(!('checks' in await r.json()));
  }
});
