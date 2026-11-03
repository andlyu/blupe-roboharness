export function replaySource(value: string | undefined, station: string) {
  if (!value) return null;
  if (/^\/api\/integration-replays\/ep_[A-Za-z0-9_-]{1,100}\/[a-f0-9]{64}\.mp4$/.test(value)) {
    return value.replace('/api/', '/api/runner/') + '?robot_id=' + encodeURIComponent(station);
  }
  return value.startsWith('https://huggingface.co/datasets/andlyu/Public-YAM-runs/resolve/') ? value : null;
}
