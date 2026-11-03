export const API_ORIGIN = 'https://yam-session-api.n5hthc3gj4cqy.us-east-1.cs.amazonlightsail.com';
export const STATIONS = [{ id: 'yam-1', name: 'YAM1' }, { id: 'robot-ba8413962083809c', name: 'Robo-house YAM' }] as const;
export const UPSTREAM_REVISION = 'd58e2defb25b9167a1ef14ab778995bf9e9de42f';
export const MODEL_SELECTION = {
  approach: 'RoboHarness', variant: 'YAM adaptation · replacement planning/vision model',
  planner: { provider: 'codex', requested_model: 'gpt-6-astra', reasoning_effort: 'low', resolved_model: null },
  vision: { provider: 'codex', requested_model: 'gpt-6-astra', reasoning_effort: 'low', resolved_model: null },
  selection: 'Researcher delegated compatible current model selection on 2026-11-03.',
  verification: 'Official image/tool capability and local account catalog checked; non-actuating three-image and structured-output inference passed in 6.60 seconds. Physical task performance unverified.',
  fallback: null,
};
export const CHECKS = [
  'Website and source revision', 'Public website, source and demo evidence',
  'Executed approach identified as RoboHarness', 'Researcher-selected models and resolved versions',
  'Editable, confirmed runner name and email', 'Method and runner in run context',
  'Actual human attribution in model tests', 'Required command-contract preflight',
  'Representative physical task and object outcome', 'RoboHarness execution on physical YAM',
  'Live physical arms during execution', 'Immediate replay with playback and seeking',
  'Previous-run selection and retained replay', 'Simulation review, or verified not applicable',
  'Every-run startup and visual motion timing', 'Persistent wait, completion and recovery stages',
  'Final deployed UI physical verification',
] as const;
export function requireStation(value: string | null): string {
  if (!STATIONS.some(s => s.id === value)) throw new Error('Choose a supported YAM station.');
  return value!;
}
export async function readPublic(path: string) {
  let response: Response;
  // Workers implements manual redirects, but not redirect:error. Reject the
  // returned 3xx through the status check instead of following another origin.
  try { response = await fetch(API_ORIGIN + path, { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(8000) }); }
  catch (error) { console.error('Public robot monitoring request failed:', error instanceof Error ? error.message : 'network error'); throw error; }
  if (!response.ok) throw new Error(`Robot monitoring returned HTTP ${response.status}.`);
  return response;
}
