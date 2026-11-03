const SOURCE = 'https://raw.githubusercontent.com/andlyu/blupe-roboharness/main/docs/evidence/verification.json';
const PUBLIC_EVIDENCE = /^https:\/\/(?:github\.com\/andlyu\/(?:blupe-roboharness|blupe-remote-bots)(?:\/|$)|roboharness-blupe\.andlyu\.chatgpt\.site\/|roboharness\.54\.209\.185\.15\.sslip\.io\/)/;

export async function GET() {
  try {
    const response = await fetch(SOURCE + '?v=' + Math.floor(Date.now() / 30000), { cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('Evidence unavailable');
    const text = await response.text();
    if (text.length > 65536) throw new Error('Evidence exceeds its limit');
    const data = JSON.parse(text) as { source_revision?: unknown; checks?: unknown };
    if (data.source_revision !== null && (typeof data.source_revision !== 'string' || !/^[a-f0-9]{40}$/.test(data.source_revision))) throw new Error('Invalid source revision');
    if (!Array.isArray(data.checks) || data.checks.length > 17) throw new Error('Invalid checks');
    const seen = new Set<number>();
    const checks = data.checks.map((entry: { id?: unknown; status?: unknown; evidence?: unknown }) => {
      if (!Number.isInteger(entry.id) || (entry.id as number) < 1 || (entry.id as number) > 17 || seen.has(entry.id as number)) throw new Error('Invalid check');
      seen.add(entry.id as number);
      const evidence = Array.isArray(entry.evidence) ? entry.evidence.filter((url: unknown): url is string => typeof url === 'string' && url.length < 1000 && !/@|%40/i.test(url) && PUBLIC_EVIDENCE.test(url)).slice(0, 4) : [];
      return { id: entry.id as number, passed: entry.status === 'passed' && evidence.length > 0, evidence };
    });
    return Response.json({ source_revision: data.source_revision, checks }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Verification evidence is not available yet. Checks remain unverified.' }, { status: 503 });
  }
}
