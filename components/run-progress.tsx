'use client';
import type { RunState } from '@/hooks/use-runner';

const descriptions: Record<string, string> = {
  queued: 'Waiting for normal queue admission. The robot is not leased to this run yet.',
  preparing: 'The station is preparing and checking measured Home readiness. Method motion waits for these checks.',
  running: 'RoboHarness is observing, grounding points and checking geometric actions. Watch the camera and event log for actual progress.',
  resetting: 'The run is ending. Waiting for normal parking and lease release.',
  completed: 'Execution ended. Inspect the footage to assess the object outcome.',
  stopped: 'Execution stopped. Check the outcome, final feedback and parking events below.',
  failed: 'The run failed. Read the failure event before starting another run. Timed-out motion is not retried automatically.',
  idle: 'No active execution in this browser session.',
};

export function RunProgress({ state, submittedAt, onReplay }: { state: RunState | null; submittedAt: number | null; onReplay: () => void }) {
  if (!state) return null;
  const events = state.interactions?.events ?? [];
  const config = state.run_configuration ?? {};
  return <section className="run-progress" aria-label="Current run">
    <div className="library-heading"><h2>Current run</h2><strong className="run-state">{state.status.replaceAll('_', ' ')}</strong></div>
    <p role="status">{descriptions[state.status] || 'Waiting for a runtime update. The latest reported state is shown above.'}</p>
    {state.queue_position != null && <p>Queue position: {state.queue_position}</p>}
    {state.error && <p className="inline-error">{state.error}</p>}
    {state.provider?.note && <p>{state.provider.note}</p>}
    {state.provider?.outcome && <p><strong>{state.provider.outcome.status}</strong> · {state.provider.outcome.summary || state.provider.outcome.reason}</p>}
    <dl className="run-facts"><div><dt>Episode</dt><dd>{state.episode_id || 'Not assigned'}</dd></div><div><dt>Approach</dt><dd>RoboHarness</dd></div><div><dt>Run clicked</dt><dd>{submittedAt ? new Date(submittedAt).toISOString() : 'Not observed in this page session'}</dd></div></dl>
    {events.length > 0 && <ol className="event-log" aria-label="Run events">{events.slice(-30).map((event, i) => <li key={`${event.id}-${i}`}><time dateTime={new Date(event.timestamp * 1000).toISOString()}>{new Date(event.timestamp * 1000).toLocaleTimeString()}</time><div><strong>{event.message}</strong>{event.details && <pre>{JSON.stringify(event.details, null, 2)}</pre>}</div></li>)}</ol>}
    <details><summary>Recorded approach configuration</summary><pre>{JSON.stringify({ model: 'RoboHarness', underlying_models: state.provider?.underlying_models ?? config.underlying_models ?? 'Awaiting runtime configuration', execution_mode: config.execution_mode ?? 'See run metadata' }, null, 2)}</pre></details>
    <details><summary>Lifecycle and feedback evidence</summary><pre>{JSON.stringify({ run_context: { episode_id: state.episode_id, session_id: state.session_id }, source_events: state.run_summary?.events ?? [], feedback_checks: state.feedback_checks ?? [], step_timings: state.step_timings ?? [], run_metrics: state.run_metrics ?? {} }, null, 2)}</pre></details>
    {state.episode_id && <button className="secondary" onClick={onReplay}>Open this run’s replay</button>}
  </section>;
}
