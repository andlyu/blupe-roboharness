'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Camera, CircleHelp, Maximize2, X } from 'lucide-react';
import { CHECKS, MODEL_SELECTION, STATIONS, UPSTREAM_REVISION } from '@/lib/roboharness';
import { useRunner } from '@/hooks/use-runner';
import { RunProgress } from '@/components/run-progress';
import { LaunchProgress } from '@/components/launch-progress';
import { RunLibrary } from '@/components/run-library';

type Station = { connected: boolean; available: boolean; mode: string; queue_length: number | null; homed: boolean; settled: boolean; observed_at: number; safety: { ok: boolean; reason: string | null } };
type Point = { u: number; v: number; x: number; y: number; frame: string };

export default function Workspace() {
  const [station, setStation] = useState('yam-1');
  const [camera, setCamera] = useState('top');
  const [view, setView] = useState('workspace');
  const [status, setStatus] = useState<Station | null>(null);
  const [statusError, setStatusError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [frame, setFrame] = useState('');
  const [frameTime, setFrameTime] = useState<number | null>(null);
  const [capturedAt, setCapturedAt] = useState<number | null>(null);
  const frameUrls = useRef<string[]>([]);
  const [inspecting, setInspecting] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [frameSize, setFrameSize] = useState({width:0,height:0});
  const [pixelX, setPixelX] = useState('0');
  const [pixelY, setPixelY] = useState('0');
  const [inspectionError, setInspectionError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(120);
  const [executionMode, setExecutionMode] = useState('interactive');
  const runner = useRunner(station);
  const busy = runner.active || runner.submitting || runner.stopping || runner.uncertain;
  const canRun = runner.ready?.ready && runner.statusVerified && !runner.error && !runner.connecting && !busy && saved && confirmed && task.trim().length > 0 && status?.connected;
  const image = useRef<HTMLImageElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [fullscreenError, setFullscreenError] = useState('');

  useEffect(() => {
    try { const d = JSON.parse(sessionStorage.getItem('roboharness.runner') || '{}'); setName(typeof d.name === 'string' ? d.name : ''); setEmail(typeof d.email === 'string' ? d.email : ''); } catch { /* Storage may be disabled. */ }
  }, []);
  useEffect(() => () => { frameUrls.current.forEach(url => URL.revokeObjectURL(url)); }, []);
  useEffect(() => {
    const controller = new AbortController(); let busy = false;
    setStatus(null); setStatusError(''); setLoading(true);
    async function refresh() {
      if (busy) return; busy = true;
      try { const r = await fetch(`/api/station?id=${station}`, { signal: controller.signal, cache: 'no-store' }); const data = await r.json() as Station & { error?: string }; if (!r.ok) throw new Error(data.error); if (!controller.signal.aborted) { setStatus(data); setStatusError(''); } }
      catch (e) { if (!controller.signal.aborted) setStatusError(e instanceof Error ? e.message : 'Status unavailable. Refresh to reconnect.'); }
      finally { busy = false; if (!controller.signal.aborted) setLoading(false); }
    }
    refresh(); const timer = setInterval(refresh, 4000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [station]);
  useEffect(() => { setPoints([]); setInspecting(false); setFrame(''); setImageError(false); setFrameTime(null); setCapturedAt(null); }, [station, camera]);
  useEffect(() => {
    if (inspecting) return;
    let active = true; let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    async function refresh() {
      let url: string | undefined;
      try {
        const response = await fetch(`/api/camera?id=${station}&camera=${camera}&t=${Date.now()}`, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]), cache: 'no-store' });
        if (!response.ok) throw new Error('Camera unavailable');
        const captured = Number(response.headers.get('x-captured-at'));
        url = URL.createObjectURL(await response.blob());
        const next = new Image(); next.src = url; await next.decode();
        if (!active) { URL.revokeObjectURL(url); return; }
        frameUrls.current.push(url); if (frameUrls.current.length > 2) URL.revokeObjectURL(frameUrls.current.shift()!);
        setFrame(url); setFrameSize({width:next.naturalWidth,height:next.naturalHeight}); setImageError(false); setFrameTime(Date.now()); setCapturedAt(captured > 0 && Number.isFinite(captured) ? captured * 1000 : null);
        timer = setTimeout(refresh, runner.active ? 250 : 1000);
      } catch { if (url) URL.revokeObjectURL(url); if (active) { setImageError(true); timer = setTimeout(refresh, 5000); } }
    }
    refresh(); return () => { active = false; controller.abort(); clearTimeout(timer); };
  }, [station, camera, inspecting, runner.active]);
  function addPoint(u: number, v: number) {
    if (!inspecting || !image.current || !frame || !Number.isInteger(u) || !Number.isInteger(v) || u < 0 || v < 0 || u >= frameSize.width || v >= frameSize.height) { setInspectionError('Enter whole pixel coordinates inside the frozen image.'); return; }
    const box = image.current.getBoundingClientRect();
    const scale = Math.min(box.width / frameSize.width, box.height / frameSize.height);
    const ox = (box.width - frameSize.width * scale) / 2, oy = (box.height - frameSize.height * scale) / 2;
    setPoints(p => [...p.slice(-7), { u, v, x: (u * scale + ox) / box.width, y: (v * scale + oy) / box.height, frame }]);
    setInspectionError('');
  }
  function markPoint(event: React.MouseEvent<HTMLImageElement>) {
    if (!inspecting || !image.current || !frame) return;
    const box = image.current.getBoundingClientRect();
    const scale = Math.min(box.width / frameSize.width, box.height / frameSize.height);
    const ox = (box.width - frameSize.width * scale) / 2, oy = (box.height - frameSize.height * scale) / 2;
    const u = (event.clientX - box.left - ox) / scale, v = (event.clientY - box.top - oy) / scale;
    if (u < 0 || v < 0 || u >= frameSize.width || v >= frameSize.height) return;
    addPoint(Math.floor(u),Math.floor(v));
  }
  const stationName = STATIONS.find(s => s.id === station)!.name;
  const reason = statusError || (loading ? 'Reading station status…' : !status?.connected ? 'Station disconnected' : status.mode === 'DISABLED' ? 'Station disabled · awaiting hardware readiness' : status.available ? 'Station available' : `${status.mode.toLowerCase().replaceAll('_', ' ')} · unavailable`);

  return <>
    <header className="site-header"><a className="brand" href="/">BluPe <span>/</span> <strong>RoboHarness</strong></a><nav aria-label="Main navigation">{[['workspace', 'Workspace'], ['runs', 'Runs'], ['method', 'Method & evidence']].map(([id, label]) => <button key={id} onClick={() => setView(id)} aria-current={view === id ? 'page' : undefined}>{label}</button>)}</nav><a className="paper-link" href="https://arxiv.org/abs/2610.14018" target="_blank" rel="noreferrer">Paper <ArrowUpRight size={15}/></a></header>
    {view === 'workspace' && <main>
      <div className="workspace-heading"><div><h1>Robot workspace</h1><p>RoboHarness on BluPe remote YAM robots.</p></div><label className="station-picker">Station<select value={station} disabled={busy} onChange={e => setStation(e.target.value)}>{STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label></div>
      <div className="workspace-grid"><section className="camera-section" aria-label="Robot camera">
        <div className="camera-stage" ref={stage}><div className="camera-topline"><span><Camera size={16}/> {stationName} · {camera === 'top' ? 'Overhead' : `${camera[0].toUpperCase()}${camera.slice(1)} wrist`}</span><span>{inspecting ? 'Frozen for inspection' : imageError ? 'Feed interrupted · last image' : 'Latest published frames'}</span></div>
          <div className={`camera-image ${inspecting ? 'inspect' : ''}`}>{frame ? <img ref={image} src={frame} data-source-captured-at={capturedAt ? new Date(capturedAt).toISOString() : undefined} alt={`${stationName} ${camera} camera, actual robot footage`} onClick={markPoint}/> : <div className="camera-empty"><Camera size={32}/><p>{imageError ? 'Camera unavailable' : 'Connecting to the robot camera…'}</p><span>{imageError ? 'Reconnecting to the public feed. No replacement footage is shown.' : 'Fetching the latest published image.'}</span></div>}{points.map((p, i) => <span key={i} className="keypoint" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}>{i + 1}</span>)}</div>
          <div className="camera-bottomline"><span>{frameTime ? `${capturedAt ? 'Captured ' + new Date(capturedAt).toLocaleTimeString() : 'Received ' + new Date(frameTime).toLocaleTimeString()} · ${inspecting ? 'paused' : imageError ? 'interrupted · reconnecting' : 'refreshing'}` : imageError ? 'Feed unavailable · reconnecting' : 'Waiting for first frame'}</span><button aria-label="Expand camera" onClick={() => stage.current?.requestFullscreen().catch(() => setFullscreenError('Fullscreen is unavailable in this browser.'))}><Maximize2 size={17}/></button></div></div>
        {fullscreenError && <p role="status">{fullscreenError}</p>}
        <div className="camera-controls"><div className="view-tabs" aria-label="Camera selection">{[['top', 'Overhead'], ['left', 'Left wrist'], ['right', 'Right wrist']].map(([id, label]) => <button key={id} aria-pressed={camera === id} onClick={() => setCamera(id)}>{label}</button>)}</div><button className="inspect-button" aria-pressed={inspecting} disabled={!frame} onClick={() => { setInspecting(!inspecting); setPoints([]); }}>{inspecting ? <X size={15}/> : <CircleHelp size={15}/>} {inspecting ? 'Exit inspection' : 'Inspect image points'}</button></div>
        {inspecting && <div className="inspection"><p>Click the frozen image to inspect pixel coordinates. These points have no depth or robot coordinates yet and do not command motion.</p><form className="pixel-form" onSubmit={e => { e.preventDefault(); addPoint(Number(pixelX),Number(pixelY)); }}><label>Pixel X<input type="number" min="0" max={frameSize.width - 1} step="1" required value={pixelX} onChange={e => setPixelX(e.target.value)}/></label><label>Pixel Y<input type="number" min="0" max={frameSize.height - 1} step="1" required value={pixelY} onChange={e => setPixelY(e.target.value)}/></label><button type="submit" className="secondary">Add point</button></form>{inspectionError && <p role="status">{inspectionError}</p>}<div>{points.length ? points.map((p, i) => <code key={i}>P{i + 1} ({p.u}, {p.v}) px</code>) : <span>No points selected.</span>}</div><button onClick={() => setPoints([])} disabled={!points.length}>Clear points</button></div>}
        <div className="station-status" role="status"><span className={`status-dot ${status?.available && !statusError ? 'available' : ''}`}/><div><strong>{reason}</strong><p>{status?.safety.reason ? status.safety.reason.replaceAll('_', ' ') + '. ' : ''}Monitoring does not join the queue or move the robot.</p></div><span className="queue-count">{status ? `${status.queue_length ?? '—'} queued` : '—'}</span></div>
      </section><aside className="run-panel" aria-labelledby="run-title"><h2 id="run-title">Run RoboHarness</h2><p className="panel-intro">Describe a task for the selected station.</p><label>Task<textarea disabled={busy} maxLength={4000} rows={3} placeholder="Describe the object and the result you want…" value={task} onChange={e => setTask(e.target.value)}/></label>
        <div className="run-setting"><span>Model / approach</span><strong>RoboHarness</strong></div><div className="run-setting"><span>Planning & vision</span><strong>{MODEL_SELECTION.planner.requested_model}</strong></div><div className="run-setting"><span>Reasoning effort</span><strong>{MODEL_SELECTION.planner.reasoning_effort}</strong></div><div className="run-setting"><span>Execution</span><strong>Physical YAM</strong></div><label className="duration-setting">Run limit<select value={duration} disabled={busy} onChange={e => setDuration(Number(e.target.value))}>{[60,120,180,300].map(n => <option key={n} value={n}>{n} seconds</option>)}</select></label><label className="duration-setting">Execution mode<select value={executionMode} disabled={busy} onChange={e => setExecutionMode(e.target.value)}><option value="interactive">Interactive</option><option value="automated_verification">Automated verification</option></select></label>
        <details className="identity"><summary>Runner details <span>{saved ? name : 'Name and email required'}</span></summary><form onSubmit={e => { e.preventDefault(); if (!confirmed) return; try { sessionStorage.setItem('roboharness.runner', JSON.stringify({ name: name.trim(), email: email.trim() })); } catch {} setSaved(true); }}><label>Name<input autoComplete="name" required value={name} onChange={e => { setName(e.target.value); setConfirmed(false); setSaved(false); }}/></label><label>Email<input autoComplete="email" type="email" required value={email} onChange={e => { setEmail(e.target.value); setConfirmed(false); setSaved(false); }}/></label><label className="checkbox"><input type="checkbox" required checked={confirmed} onChange={e => setConfirmed(e.target.checked)}/>These are my runner details.</label><button className="secondary" type="submit">Use these details</button><p>{saved ? 'Confirmed for this browser session. Sent to the integration and BluPe queue when you click Run.' : 'Used for queue admission and run attribution. Email stays out of public evidence.'}</p></form></details>
        <button className="run-button" disabled={!canRun} aria-describedby="launch-status" onClick={() => runner.launch({ prompt: task.trim(), runner_name: name.trim(), email: email.trim(), run_duration_s: duration, cadence_hz: 10, execution_mode: executionMode })}>{runner.submitting ? 'Submitting to queue…' : runner.active ? 'Run in progress' : 'Run RoboHarness'}</button>
        {busy && <button className="stop-button" disabled={runner.stopping} onClick={runner.stop}>{runner.stopping ? 'Requesting Stop…' : 'Stop run'}</button>}
        <div id="launch-status" className="launch-status" role="status"><strong>{runner.connecting ? 'Connecting to the runtime…' : runner.submitting ? 'Submitting to the normal queue…' : runner.uncertain ? 'Submission unresolved' : runner.error ? 'Runtime needs attention' : !runner.ready?.ready ? 'Runtime not ready' : runner.active ? 'Execution active' : !saved || !confirmed ? 'Confirm runner details' : !task.trim() ? 'Enter a task' : !status?.connected ? 'Station disconnected' : 'Ready to submit'}</strong><p>{runner.error || runner.ready?.reason || (runner.active ? 'Watch actual robot progress and use Stop to end the run.' : runner.ready?.ready ? 'Run joins the normal queue and starts physical execution after lease and measured Home readiness.' : 'Waiting for the verified control release and model service. No run is submitted by connecting.')}</p></div>
        {!runner.connecting && (!runner.ready?.ready || runner.error) && <button className="secondary reconnect" disabled={runner.active || runner.submitting} onClick={runner.reconnect}>Refresh runtime status</button>}
        <LaunchProgress state={runner.state} startedAt={runner.startedAt} uncertain={runner.uncertain} stopping={runner.stopping} submitting={runner.submitting}/><p className="safety-note">Queue, readiness, hardware limits and Stop stay enabled. Movement timeouts end the method; they are never retried automatically.</p>
      </aside></div><RunProgress state={runner.state} submittedAt={runner.startedAt} onReplay={() => setView('runs')}/><section className="method-strip"><div><h2>From images to motion</h2><p>The agent selects image keypoints. Tracking and depth ground them in 3D. Geometric constraints guide feasible robot actions.</p></div><button onClick={() => setView('method')}>Inspect the approach <ArrowUpRight size={17}/></button></section><div className="workspace-foot"><p>This YAM adaptation is under construction. Paper results were measured on different robots in simulation.</p><button onClick={() => setView('method')}>View all {CHECKS.length} acceptance checks</button></div>
    </main>}
    {view === 'runs' && <main className="reading"><h1>Runs</h1><p>Physical executions, configuration and retained camera replay for {stationName}.</p><RunLibrary station={station} episode={runner.state?.episode_id}/></main>}
    {view === 'method' && <main className="reading"><h1>RoboHarness on YAM</h1><p className="lead">A visual-geometric interface between a coding agent and robot motion.</p><section><h2>What transfers from the paper</h2><p>RoboHarness connects selected image points, persistent tracking, depth and geometric constraints. A YAM adaptation needs calibrated camera transforms, the correct arm geometry, feasible trajectories and feedback from real hardware.</p><p>The stationary YAM scope excludes mobile-base and torso actions. This site does not claim to reproduce the paper’s benchmark results.</p><div className="source-links"><a href="https://arxiv.org/html/2610.14018v1" target="_blank" rel="noreferrer">Paper · sections 3.1–3.2 <ArrowUpRight size={16}/></a><a href={`https://github.com/BinceQu/RoboHarness/tree/${UPSTREAM_REVISION}`} target="_blank" rel="noreferrer">Official implementation <ArrowUpRight size={16}/></a></div></section><section className="verification"><h2>Acceptance evidence</h2><div className="source-links"><a href="https://github.com/andlyu/blupe-roboharness" target="_blank" rel="noreferrer">Integration source <ArrowUpRight size={16}/></a><a href="https://github.com/andlyu/blupe-roboharness/blob/main/docs/COMPLETION-CHECKLIST.md" target="_blank" rel="noreferrer">Working checklist <ArrowUpRight size={16}/></a><a href="https://github.com/andlyu/blupe-roboharness/blob/main/docs/evidence/model-transport.json" target="_blank" rel="noreferrer">Model test evidence <ArrowUpRight size={16}/></a><a href="https://github.com/andlyu/blupe-roboharness/blob/main/docs/evidence/hover-002-failed.json" target="_blank" rel="noreferrer">Physical attempt evidence <ArrowUpRight size={16}/></a><a href="/evidence/hover-002-ui.mp4" target="_blank" rel="noreferrer">Failed hover footage <ArrowUpRight size={16}/></a></div><p>0 of {CHECKS.length} requirements verified. The integration stays incomplete until each requirement has evidence from the deployed website.</p><ul>{CHECKS.map(label => <li key={label}><span className="unchecked" aria-label="Not verified"/><span>{label}</span><span>Pending</span></li>)}</ul><p>Every physical run requires first observed method motion within 15 seconds of settled Home readiness and within 30 seconds of Run, excluding evidenced queue-admission waiting. Physical footage and matched lifecycle timestamps are required.</p></section><section><h2>Underlying model configuration</h2><p>{MODEL_SELECTION.variant}. Planning and vision use requested model <code>{MODEL_SELECTION.planner.requested_model}</code>, provider Codex, reasoning effort low. The researcher delegated selection. The local catalog and official image/tool capabilities were checked on November 3, 2026; a non-actuating image and structured-output model check passed. Physical task performance remains unverified.</p><p>The service has not returned an immutable resolved model version; that field remains explicitly unresolved. No silent fallback is configured. Dream1 is retained as the researcher’s preference if a VLA role is added; this variant has no VLA component.</p><p><a href="https://developers.openai.com/api/docs/models/gpt-6-astra" target="_blank" rel="noreferrer">Official model capabilities</a></p></section></main>}
    <footer><span>BluPe × RoboHarness</span><span>Research integration · verification pending</span><a href="https://github.com/BinceQu/RoboHarness" target="_blank" rel="noreferrer">Upstream source <ArrowUpRight size={14}/></a></footer>
  </>;
}
