import type { RunState } from '@/hooks/use-runner';

export function LaunchProgress({ state, startedAt, uncertain, stopping, submitting = false }: { state: RunState | null; startedAt: number | null; uncertain: boolean; stopping: boolean; submitting?: boolean }) {
  const events = state?.interactions?.events ?? [];
  const source = state?.run_summary?.events ?? [];
  const admitted = source.find(event => event.type === 'lifecycle' && event.state === 'preparing' && event.reason === 'jetson_leased');
  const queued = source.find(event => event.type === 'queue_entry' || event.type === 'lifecycle' && event.state === 'queued');
  const home = events.find(event => event.details?.stage === 'home_feedback_confirmed' && event.details?.state === 'completed');
  const latest = events.filter(event => ['model_request','model_response','packet_ready','error','policy_timing','lifecycle','trajectory','camera_capture','camera_captured','camera_retry','camera_recovered','camera_failure','observation'].includes(event.kind)).slice(-1)[0];
  const stage = stopping ? 'Stopping and releasing the lease' : submitting ? 'Submitting to the normal queue' : uncertain ? 'Submission unresolved' : state?.status === 'queued' ? 'Waiting for queue admission' : state?.status === 'preparing' ? 'Preparing the robot' : state?.status === 'running' ? home ? 'Executing RoboHarness' : 'Checking measured Home readiness' : state?.status ? `Run ${state.status.replaceAll('_',' ')}` : 'Waiting for runtime status';
  if (!startedAt && !state?.episode_id && !uncertain) return null;
  return <div className="launch-progress" aria-label="Launch progress" role="status"><strong>{stage}</strong>
    <p>{submitting ? 'Sending the task and confirmed runner details. Waiting for queue acknowledgement; the request is never retried automatically.' : uncertain ? 'The original request may have been accepted. Refresh preserves this state; use Stop and wait for verified status before another Run.' : state?.status === 'queued' ? `Normal queue${state.queue_position != null ? ' · position ' + state.queue_position : ''}. No method motion before lease and readiness.` : state?.status === 'preparing' ? 'Lease preparation and startup Home are in progress. Waiting for measured settled feedback. ' + (latest?.message || '') : latest?.message || 'Waiting for the next runtime event.'}</p>
    <dl>{startedAt && <div><dt>Run clicked</dt><dd>{new Date(startedAt).toLocaleTimeString()}</dd></div>}{queued && <div><dt>Queue entered</dt><dd>{new Date(queued.timestamp * 1000).toLocaleTimeString()}</dd></div>}{admitted && <div><dt>Lease admitted</dt><dd>{new Date(admitted.timestamp * 1000).toLocaleTimeString()}</dd></div>}{home && <div><dt>Home feedback confirmed</dt><dd>{new Date(home.timestamp * 1000).toLocaleTimeString()}</dd></div>}{latest && <div><dt>Last event</dt><dd>{new Date(latest.timestamp * 1000).toLocaleTimeString()}</dd></div>}</dl>
  </div>;
}
