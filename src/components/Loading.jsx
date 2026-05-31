export default function Loading({ label = 'Loading...' }) {
  return <div className="loading-card" data-testid="loading-indicator">{label}</div>;
}
