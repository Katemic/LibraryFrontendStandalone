export default function StatusMessage({ type = 'info', children, testId }) {
  if (!children) return null;
  return (
    <div className={`status-message ${type}`} data-testid={testId} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  );
}
