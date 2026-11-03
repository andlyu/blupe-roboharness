import { readPublic, requireStation } from '@/lib/roboharness';
type Queue = { entries?: unknown[]; stations?: { jetson_id: string; connected?: boolean; available?: boolean; mode?: string }[] };
type Observation = { mode?: string; observed_at?: number; timestamp?: number; homed?: boolean; settled?: boolean; safety?: { ok?: boolean; reason?: string } };
export async function GET(request: Request) {
  let id: string;
  try { id = requireStation(new URL(request.url).searchParams.get('id')); }
  catch { return Response.json({ error: 'Unknown station.' }, { status: 400 }); }
  try {
    const responses = await Promise.all([readPublic(`/v1/robots/${id}/queue`), readPublic(`/v1/robots/${id}/observation`)]);
    const [queue, observation] = await Promise.all(responses.map(r => r.json())) as [Queue, Observation];
    if (!queue || !observation || !Array.isArray(queue.stations) || !Array.isArray(queue.entries)) throw new Error('Malformed station data.');
    const station = queue.stations?.find((s: { jetson_id: string }) => s.jetson_id === id);
    // Explicit projection excludes capabilities, email and unrecognized fields.
    return Response.json({ id, checked_at: Date.now() / 1000,
      connected: station?.connected === true, available: station?.available === true,
      mode: typeof station?.mode === 'string' ? station.mode : 'UNKNOWN', queue_length: queue.entries.length,
      observed_at: observation.observed_at ?? observation.timestamp ?? null,
      homed: observation.homed === true, settled: observation.settled === true,
      safety: { ok: observation.safety?.ok === true, reason: typeof observation.safety?.reason === 'string' ? observation.safety.reason : null },
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Station status unavailable. Refresh to reconnect; no run was submitted.' }, { status: 502 }); }
}
