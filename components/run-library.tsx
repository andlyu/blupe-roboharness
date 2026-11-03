'use client';
import { useEffect, useRef, useState } from 'react';
import { Run } from '@/hooks/use-runner';
import { replaySource } from '@/lib/replay';

export function RunLibrary({ station, episode }: { station: string; episode?: string }) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selected, setSelected] = useState<Run | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerStatus, setPlayerStatus] = useState('');
  const [cursor, setCursor] = useState<number | null>(0);
  const [revision, setRevision] = useState(0);
  const player = useRef<HTMLVideoElement>(null);
  const currentStation = useRef(station); currentStation.current = station;
  const selection = useRef(0);
  const pendingChecks = useRef({ episode: '', attempts: 0 });
  const [playback, setPlayback] = useState({ position: 0, duration: 0 });
  const videoSource = replaySource(selected?.video_url, station);
  useEffect(() => {
    let cancelled = false;
    selection.current++; pendingChecks.current = { episode: '', attempts: 0 };
    setLoading(true); setError(''); setRuns([]); setSelected(null);
    fetch(`/api/runner/past-runs?robot_id=${station}&model=RoboHarness&offset=0`, { headers: { 'X-Blupe-Robot': station }, cache: 'no-store' })
      .then(async r => { const d = await r.json() as { runs: Run[]; next_offset: number | null; error?: string }; if (!r.ok) throw new Error(d.error); return d; })
      .then(d => { if (!cancelled) { setRuns(d.runs); setCursor(d.next_offset); if (episode) { const current = d.runs.find(r => r.episode_id === episode); if (current) { void select(current); } } } })
      .catch(e => { if (!cancelled) setError(e.message); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; selection.current++; };
  }, [station, episode, revision]);
  async function select(run: Run) {
    const requestId = ++selection.current;
    setPlayback({position:0,duration:0});
    setSelected(run); setPlayerStatus('Loading this run’s retained camera footage…');
    try {
      const r = await fetch(`/api/runner/past-runs?episode_id=${encodeURIComponent(run.episode_id)}&model=RoboHarness&robot_id=${station}`, { headers: { 'X-Blupe-Robot': station }, cache: 'no-store' });
      const d = await r.json() as { runs: Run[]; error?: string };
      if (!r.ok) throw new Error(d.error);
      if (requestId !== selection.current || currentStation.current !== station) return;
      const match = d.runs.find(item => item.episode_id === run.episode_id && item.model === 'RoboHarness' && item.robot_id === station);
      if (!match) { setPlayerStatus('This RoboHarness episode is not available in the selected station’s history yet. Refresh runs to check again.'); return; }
      const c = await fetch(`/api/runner/roboharness/run-config?episode_id=${encodeURIComponent(run.episode_id)}`, { headers: { 'X-Blupe-Robot': station }, cache: 'no-store' });
      const recorded = c.ok ? await c.json() as { configuration?: Record<string, unknown> } : {};
      if (requestId !== selection.current || currentStation.current !== station) return;
      setSelected({ ...match, configuration: recorded.configuration }); if (!match.video_url) setPlayerStatus('No retained clip is available yet. Checking for completed camera processing…');
    } catch (e) { if (requestId === selection.current && currentStation.current === station) setPlayerStatus(e instanceof Error ? e.message : 'Replay unavailable. Refresh to reconnect.'); }
  }
  useEffect(() => {
    if (!selected || selected.video_url) return;
    if (pendingChecks.current.episode !== selected.episode_id) pendingChecks.current = { episode: selected.episode_id, attempts: 0 };
    if (pendingChecks.current.attempts >= 20) { setPlayerStatus('No retained clip is available yet. Check the run outcome or refresh to check again.'); return; }
    const timer = setTimeout(() => { pendingChecks.current.attempts++; void select(selected); }, 2000);
    return () => clearTimeout(timer);
  }, [selected, station]);
  async function more() {
    if (loading || cursor == null) return;
    setLoading(true); setError('');
    try {
      const r = await fetch(`/api/runner/past-runs?robot_id=${station}&model=RoboHarness&offset=${cursor}`, { headers: { 'X-Blupe-Robot': station }, cache: 'no-store' });
      const d = await r.json() as { runs: Run[]; next_offset: number | null; error?: string };
      if (!r.ok) throw new Error(d.error);
      setRuns(old => [...old, ...d.runs]); setCursor(d.next_offset);
    } catch (e) { setError(e instanceof Error ? e.message : 'History unavailable.'); }
    finally { setLoading(false); }
  }
  return <section className="run-library"><div className="library-heading"><h2>RoboHarness runs</h2><button className="secondary" onClick={() => setRevision(n => n + 1)}>Refresh runs</button></div>
    {episode && !selected && <p>Current episode: {episode}. <button className="secondary" onClick={() => select({ episode_id: episode })}>Check current episode replay</button></p>}
    {selected && <div className="replay-panel"><h3>{selected.prompt || selected.episode_id}</h3><p>{selected.runner_name || 'Runner not recorded'} · Model: RoboHarness · {selected.episode_id}</p>
      {videoSource && <><video ref={player} key={videoSource} src={videoSource} controls playsInline preload="metadata" onTimeUpdate={e => setPlayback({position:e.currentTarget.currentTime,duration:e.currentTarget.duration})} onLoadedData={e => { setPlayback({position:e.currentTarget.currentTime,duration:e.currentTarget.duration}); setPlayerStatus((selected.capture_source === 'timed_ui_verification' ? 'Retained screen capture of this physical run.' : 'Retained actual camera footage.') + (selected.capture_partial ? ' Partial capture; inspect the gaps and recorded outcome.' : '') + ' Use the timeline to seek.'); }} onError={() => setPlayerStatus('This recording is unavailable. Refresh to check its status.')}/><div className="library-heading"><button className="secondary" onClick={() => { if (player.current) player.current.currentTime = Math.max(0, player.current.currentTime - 5); }}>Back 5 seconds</button><output aria-label="Replay time">{playback.position.toFixed(1)} / {Number.isFinite(playback.duration) ? playback.duration.toFixed(1) : '—'} seconds</output><button className="secondary" onClick={() => { if (player.current && Number.isFinite(player.current.duration)) player.current.currentTime = Math.min(player.current.duration, player.current.currentTime + 5); }}>Forward 5 seconds</button></div></>}<p role="status">{playerStatus}</p>
      <details><summary>Stored run details</summary><pre>{JSON.stringify({ episode_id: selected.episode_id, robot_id: selected.robot_id, model: selected.model, runner_name: selected.runner_name, result: selected.result, configuration: selected.configuration ?? 'Configuration not available in this history entry.' }, null, 2)}</pre></details></div>}
    {error && <p role="status">{error}</p>}{loading && <p role="status">Loading retained run history…</p>}
    {!runs.length && !selected && !loading && !error && <div className="empty-runs"><h3>No RoboHarness executions yet.</h3><p>Physical runs and pending recordings will appear here with their task, runner and actual configuration.</p></div>}
    <ul className="run-list">{runs.map(run => <li key={run.episode_id}><button onClick={() => select(run)}><strong>{run.prompt || run.episode_id}</strong><span>{run.runner_name || 'Runner not recorded'} · RoboHarness · {run.episode_id}</span><span>{run.video_url ? 'Watch retained replay' : 'View run / check recording'}</span></button></li>)}</ul>
    {cursor !== null && runs.length > 0 && <button className="secondary" disabled={loading} onClick={more}>Load previous runs</button>}
  </section>;
}
