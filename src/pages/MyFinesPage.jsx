import { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { libraryApi } from '../api/libraryApi';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/date';

export default function MyFinesPage() {
  const { user } = useAuth();
  const [fines, setFines] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [busyFineId, setBusyFineId] = useState(null);

  async function loadFines() {
    if (!user?.id) return;
    const data = await libraryApi.getFinesByLoaner(user.id);
    setFines(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      setIsLoading(true);
      setError('');
      try {
        if (!user?.id) return;
        const data = await libraryApi.getFinesByLoaner(user.id);
        if (!ignore) setFines(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError(err.message || 'Could not load fines');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  async function handlePay(fineId) {
    setError('');
    setSuccess('');
    setBusyFineId(fineId);

    try {
      await libraryApi.payFine(fineId);
      setSuccess('Fine paid successfully.');
      await loadFines();
    } catch (err) {
      setError(err.message || 'Could not pay fine');
    } finally {
      setBusyFineId(null);
    }
  }

  if (isLoading) return <Loading label="Loading fines..." />;

  return (
    <section>
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My fines</h1>
          <p className="muted-text">Pay unpaid fines connected to your loans.</p>
        </div>
      </div>

      <StatusMessage type="error" testId="my-fines-error-message">{error}</StatusMessage>
      <StatusMessage type="success" testId="my-fines-success-message">{success}</StatusMessage>

      <div className="table-card" data-testid="my-fines-table">
        <table>
          <thead>
            <tr>
              <th>Fine</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              <th>Paid</th>
              <th>Loan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine) => (
              <tr key={fine.id} data-testid={`fine-row-${fine.id}`}>
                <td>#{fine.id}</td>
                <td>{fine.amount} kr.</td>
                <td><span className="status-pill warning">{fine.status}</span></td>
                <td>{formatDate(fine.createdDate)}</td>
                <td>{formatDate(fine.paidDate)}</td>
                <td>#{fine.loanId}</td>
                <td>
                  {fine.status === 'unpaid' && (
                    <button
                      className="primary-button small"
                      onClick={() => handlePay(fine.id)}
                      disabled={busyFineId === fine.id}
                      data-testid={`pay-fine-${fine.id}`}
                    >
                      <CreditCard size={16} /> {busyFineId === fine.id ? 'Paying...' : 'Pay'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {fines.length === 0 && <div className="empty-state" data-testid="no-fines-message">No fines found.</div>}
      </div>
    </section>
  );
}
