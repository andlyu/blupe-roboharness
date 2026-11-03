import { readPublic, requireStation } from '@/lib/roboharness';
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  let id: string;
  try { id = requireStation(params.get('id')); } catch { return new Response('Unknown station.', { status: 400 }); }
  const camera = params.get('camera');
  if (!['top', 'left', 'right'].includes(camera ?? '')) return new Response('Unknown camera.', { status: 400 });
  try {
    const response = await readPublic(`/v1/robots/${id}/cameras/${camera}.jpg`);
    if (!response.headers.get('content-type')?.startsWith('image/jpeg')) throw new Error('Invalid camera response.');
    const headers = new Headers({ 'Content-Type': 'image/jpeg', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    const captured = response.headers.get('x-captured-at');
    if (captured) headers.set('X-Captured-At', captured);
    return new Response(response.body, { headers });
  } catch { return new Response('Camera unavailable. Refresh to reconnect.', { status: 502 }); }
}
