import { proxyRunner } from '@/lib/runner-proxy';
type Context = { params: Promise<{ path: string[] }> };
async function route(request: Request, context: Context) {
  return proxyRunner(request, (await context.params).path);
}
export const GET = route;
export const POST = route;
