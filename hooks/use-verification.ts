'use client';
import { useEffect, useState } from 'react';

type Evidence = { source_revision: string | null; checks: { id: number; passed: boolean; evidence: string[] }[] };
export function useVerification(sourceRevision?: string) {
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [message, setMessage] = useState('Loading verification evidence…');
  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const response = await fetch('/api/verification', { cache: 'no-store' });
        const data = await response.json() as Evidence & { error?: string };
        if (!response.ok) throw new Error(data.error);
        if (!cancelled) { setEvidence(data); setMessage(data.source_revision === sourceRevision ? 'Evidence matches the current control release.' : 'Current release verification is pending.'); }
      } catch (e) { if (!cancelled) { setEvidence(null); setMessage(e instanceof Error ? e.message : 'Evidence unavailable.'); } }
    }
    void refresh(); const timer = setInterval(refresh, 30000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [sourceRevision]);
  const checks = sourceRevision && evidence?.source_revision === sourceRevision ? evidence.checks : [];
  return { checks, passed: checks.filter(check => check.passed).length, message };
}
