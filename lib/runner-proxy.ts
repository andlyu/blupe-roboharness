import { requireStation } from './roboharness';

export const RUNNER_ORIGIN = 'https://roboharness.54.209.185.15.sslip.io';
const READS = new Set(['status', 'past-runs', 'recordings', 'roboharness/readiness', 'roboharness/run-config']);
const WRITES = new Set(['session', 'run', 'stop']);

export async function proxyRunner(request: Request, parts: string[]) {
  const path = parts.join('/');
  const permitted = request.method === 'GET'
    ? READS.has(path) || /^recordings\/(?:robocurve|run)_[a-f0-9]{32}\/(?:artifacts|interactions)$/.test(path)
    : request.method === 'POST' && WRITES.has(path);
  if (!permitted) return Response.json({ error: 'Unknown runner operation.' }, { status: 404 });
  if (request.method === 'POST' && request.headers.get('origin') !== new URL(request.url).origin) {
    return Response.json({ error: 'Submit from this website.' }, { status: 403 });
  }
  let station: string;
  try { station = requireStation(request.headers.get('x-blupe-robot')); }
  catch { return Response.json({ error: 'Choose a supported station.' }, { status: 400 }); }
  const headers = new Headers({ Accept: 'application/json', 'X-Blupe-Robot': station });
  for (const key of ['cookie', 'x-yam-runner-token', 'x-yam-watching']) {
    const value = request.headers.get(key); if (value) headers.set(key, value);
  }
  let body: string | undefined;
  if (request.method === 'POST') {
    if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') return Response.json({ error: 'Use JSON.' }, { status: 415 });
    body = await request.text();
    if (new TextEncoder().encode(body).length > 24000) return Response.json({ error: 'Request is too large.' }, { status: 413 });
    headers.set('Content-Type', 'application/json');
    // This same-origin gateway validates the browser Origin above, retaining
    // the backend's own normal Origin/cookie/CSRF checks on the server hop.
    headers.set('Origin', RUNNER_ORIGIN);
  }
  const query = new URL(request.url).search;
  try {
    const response = await fetch(`${RUNNER_ORIGIN}/api/${path}${query}`, {
      method: request.method, headers, body, redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(20000),
    });
    if (response.status >= 300 && response.status < 400) throw new Error('Unexpected redirect');
    if (!response.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new Error('Runtime returned a non-JSON gateway error');
    const output = new Headers({ 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    const cookies = response.headers.getSetCookie?.() ?? (response.headers.get('set-cookie') ? [response.headers.get('set-cookie')!] : []);
    for (const cookie of cookies) output.append('Set-Cookie', cookie);
    return new Response(response.body, { status: response.status, headers: output });
  } catch {
    return Response.json({ error: 'The RoboHarness runtime is disconnected. Refresh status before starting another run; an uncertain submission is never retried automatically.' }, { status: 503 });
  }
}
