'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

export type Event = { id: number; timestamp: number; kind: string; message: string; details?: Record<string, unknown> };
export type RunState = { status: string; episode_id?: string; session_id?: string; error?: string; runner_name?: string;
  queue_position?: number; launch_requested_at?: number; run_started_at?: number; run_ended_at?: number;
  run_configuration?: Record<string, unknown>; run_summary?: { events: { type: string; timestamp: number; state?: string; reason?: string; position?: number }[] };
  provider?: { model: string; note?: string; underlying_models?: unknown; outcome?: { status: string; reason?: string; summary?: string } };
  feedback_checks?: Record<string, unknown>[]; step_timings?: Record<string, unknown>[]; run_metrics?: Record<string, unknown>;
  interactions?: { events: Event[] }; public_run?: { runner_name: string; model_name: string; task: string; events: Event[] };
};
type Readiness = { ready: boolean; reason?: string; source_revision?: string; preflight_tests?: number };
export type Run = { episode_id: string; prompt?: string; runner_name?: string; model?: string; video_url?: string; result?: string; created_at?: string; robot_id?: string; configuration?: Record<string, unknown> };
const ACTIVE = new Set(['queued', 'preparing', 'running', 'resetting']);

export function useRunner(station: string) {
  const [state, setState] = useState<RunState | null>(null);
  const [ready, setReady] = useState<Readiness | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [statusVerified, setStatusVerified] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [revision, setRevision] = useState(0);
  const csrf = useRef('');
  const bound = useRef('');
  const unresolved = useRef(false);
  const current = useRef(station); current.current = station;
  const active = !!state && ACTIVE.has(state.status);
  const api = useCallback(async (path: string, payload?: unknown) => {
    const headers: Record<string, string> = { 'X-Blupe-Robot': station };
    if (path === 'status' && document.visibilityState === 'visible') headers['X-Yam-Watching'] = '1';
    if (csrf.current) headers['X-Yam-Runner-Token'] = csrf.current;
    if (payload !== undefined) headers['Content-Type'] = 'application/json';
    const response = await fetch('/api/runner/' + path, { headers, method: payload === undefined ? 'GET' : 'POST',
      body: payload === undefined ? undefined : JSON.stringify(payload), cache: 'no-store' });
    const body = await response.json() as Record<string, unknown>;
    if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : 'The runtime request failed.');
    return body;
  }, [station]);
  const readState = useCallback(async () => {
    const next = await api('status');
    if (typeof next.status !== 'string') throw new Error('The runtime returned no verified run status.');
    return next as RunState;
  }, [api]);
  function rememberIntent(at: number | null, pending: boolean) {
    try { sessionStorage.setItem('roboharness.intent.' + station, JSON.stringify({ at, pending })); } catch { /* Runtime safety also rejects concurrent runs. */ }
  }

  useEffect(() => {
    let cancelled = false; let polling = false; let connected = false;
    setReady(null); setConnecting(true); setStatusVerified(false); setStatusError('');
    if (bound.current !== station) {
      bound.current = station; csrf.current = ''; setState(null); setActionError('');
      let intent: { at?: number; pending?: boolean } = {};
      try { intent = JSON.parse(sessionStorage.getItem('roboharness.intent.' + station) || '{}'); } catch {}
      unresolved.current = intent.pending === true; setUncertain(unresolved.current);
      setStartedAt(typeof intent.at === 'number' ? intent.at : null);
    } else if (!unresolved.current) setActionError('');
    async function connect() {
      try {
        const metadata = await api('session', {});
        if (cancelled) return;
        if (typeof metadata.csrf !== 'string') throw new Error('The runtime did not provide a session.');
        csrf.current = metadata.csrf;
        // Read actual execution state before readiness can unlock Run. A refresh
        // never clears an unresolved submission or moves its original clock.
        const next = await readState();
        const readiness = await api('roboharness/readiness') as Readiness;
        if (!cancelled) { connected = true; setState(next); setStatusVerified(true); setReady(readiness); setConnecting(false); }
      } catch (e) { if (!cancelled) { setConnecting(false); setStatusError(e instanceof Error ? e.message : 'Runtime unavailable.'); } }
    }
    async function poll() {
      if (polling || !connected) return;
      polling = true;
      try { const next = await readState(); if (!cancelled) { setState(next); setStatusVerified(true); setStatusError(''); } }
      catch (e) { if (!cancelled) { setStatusVerified(false); setStatusError(e instanceof Error ? e.message : 'Status unavailable.'); } }
      finally { polling = false; }
    }
    connect(); const timer = setInterval(poll, 1000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [api, readState, station, revision]);

  async function launch(payload: Record<string, unknown>) {
    if (submitting || stopping || active || unresolved.current || !statusVerified || connecting || statusError || actionError || !ready?.ready) return;
    const clicked = Date.now(); setStartedAt(clicked); setSubmitting(true); setActionError('');
    unresolved.current = true; setUncertain(true); rememberIntent(clicked, true);
    try {
      await api('run', { ...payload, provider: 'roboharness', model: 'RoboHarness' });
      const next = await readState();
      if (current.current === station) { setState(next); setStatusVerified(true); unresolved.current = false; setUncertain(false); rememberIntent(clicked, false); }
    } catch (e) {
      if (current.current === station) setActionError((e instanceof Error ? e.message : 'Submission failed.') + ' The submission remains unresolved. Check status and use Stop before another Run; no automatic retry occurs.');
    } finally { setSubmitting(false); }
  }
  async function stop() {
    if (stopping || (!active && !unresolved.current && !submitting)) return;
    setStopping(true); setActionError('');
    try {
      // Stop returns an acknowledgement, not a RunState. The normal backend
      // serializes it with launch. Preserve state until status is reconciled.
      await api('stop', {});
      const next = await readState();
      if (current.current === station) { setState(next); setStatusVerified(true); unresolved.current = false; setUncertain(false); rememberIntent(startedAt, false); }
    } catch (e) { setActionError(e instanceof Error ? e.message : 'Stop acknowledgement is unavailable; refresh status.'); }
    finally { setStopping(false); }
  }
  return { state, ready, connecting, statusVerified, error: actionError || statusError, submitting, stopping, uncertain, startedAt, active, launch, stop, api,
    reconnect: () => { setConnecting(true); setStatusVerified(false); setRevision(n => n + 1); } };
}
