export function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-DK', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
}
