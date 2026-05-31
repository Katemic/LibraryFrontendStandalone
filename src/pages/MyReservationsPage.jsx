import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { libraryApi } from '../api/libraryApi';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState(null);

  async function loadReservations() {
    setError('');
    try {
      const data = await libraryApi.getMyReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.status === 404) {
        setReservations([]);
        return;
      }
      throw err;
    }
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      setIsLoading(true);
      try {
        const data = await libraryApi.getMyReservations();
        if (!ignore) setReservations(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore && err.status === 404) {
          setReservations([]);
        } else if (!ignore) {
          setError(err.message || 'Could not load reservations');
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, []);

  async function handleCancel(itemId) {
    setError('');
    setSuccess('');
    setBusyItemId(itemId);

    try {
      await libraryApi.cancelReservation(itemId);
      setSuccess('Reservation cancelled successfully.');
      await loadReservations();
    } catch (err) {
      setError(err.message || 'Could not cancel reservation');
    } finally {
      setBusyItemId(null);
    }
  }

  if (isLoading) return <Loading label="Loading reservations..." />;

  return (
    <section>
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My reservations</h1>
          <p className="muted-text">Reservations can be cancelled by item.</p>
        </div>
      </div>

      <StatusMessage type="error" testId="my-reservations-error-message">{error}</StatusMessage>
      <StatusMessage type="success" testId="my-reservations-success-message">{success}</StatusMessage>

      <div className="reservation-grid" data-testid="my-reservations-list">
        {reservations.map((reservation) => (
          <article className="reservation-card" key={reservation.id ?? reservation.itemId} data-testid={`reservation-row-${reservation.itemId}`}>
            <div>
              <span className="tag">Item #{reservation.itemId}</span>
              <h2>Reservation #{reservation.id ?? '-'}</h2>
              <p className="muted-text">Queue number: {reservation.queue_number ?? reservation.queueNumber ?? '-'}</p>
            </div>
            <span className="status-pill warning">{reservation.status}</span>
            <button
              className="ghost-button danger"
              onClick={() => handleCancel(reservation.itemId)}
              disabled={busyItemId === reservation.itemId}
              data-testid={`cancel-reservation-${reservation.itemId}`}
            >
              <Trash2 size={16} /> {busyItemId === reservation.itemId ? 'Cancelling...' : 'Cancel'}
            </button>
          </article>
        ))}
      </div>

      {reservations.length === 0 && <div className="empty-state" data-testid="no-reservations-message">No reservations found.</div>}
    </section>
  );
}
