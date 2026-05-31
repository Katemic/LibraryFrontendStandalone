import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { libraryApi } from '../api/libraryApi';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';
import { formatDate } from '../utils/date';

export default function MyLoansPage() {
  const [loans, setLoans] = useState([]);
  const [includeReturned, setIncludeReturned] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [busyLoanId, setBusyLoanId] = useState(null);

  async function loadLoans(showReturned = includeReturned) {
    setError('');
    const data = await libraryApi.getMyLoans(showReturned);
    setLoans(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      setIsLoading(true);
      try {
        const data = await libraryApi.getMyLoans(includeReturned);
        if (!ignore) setLoans(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError(err.message || 'Could not load loans');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [includeReturned]);

  async function handleReturn(loanId) {
    setError('');
    setSuccess('');
    setBusyLoanId(loanId);

    try {
      await libraryApi.returnLoan(loanId);
      setSuccess('Loan returned successfully.');
      await loadLoans();
    } catch (err) {
      setError(err.message || 'Could not return loan');
    } finally {
      setBusyLoanId(null);
    }
  }

  if (isLoading) return <Loading label="Loading your loans..." />;

  return (
    <section>
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My loans</h1>
          <p className="muted-text">Current loans are shown by default. Toggle history to include returned loans.</p>
        </div>
        <label className="toggle-row">
          <input
            data-testid="include-returned-checkbox"
            type="checkbox"
            checked={includeReturned}
            onChange={(event) => setIncludeReturned(event.target.checked)}
          />
          Include returned
        </label>
      </div>

      <StatusMessage type="error" testId="my-loans-error-message">{error}</StatusMessage>
      <StatusMessage type="success" testId="my-loans-success-message">{success}</StatusMessage>

      <div className="table-card" data-testid="my-loans-table">
        <table>
          <thead>
            <tr>
              <th>Loan</th>
              <th>Item name</th>
              <th>Status</th>
              <th>Loan date</th>
              <th>Due date</th>
              <th>Return date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id} data-testid={`loan-row-${loan.id}`}>
                <td>#{loan.id}</td>
                <td>{loan.itemName}</td>
                <td><span className="status-pill">{loan.status}</span></td>
                <td>{formatDate(loan.loanDate)}</td>
                <td>{formatDate(loan.dueDate)}</td>
                <td>{formatDate(loan.returnDate)}</td>
                <td>
                  {!loan.returnDate && loan.status !== 'returned' && (
                    <button
                      className="secondary-button small"
                      onClick={() => handleReturn(loan.id)}
                      disabled={busyLoanId === loan.id}
                      data-testid={`return-loan-${loan.id}`}
                    >
                      <RotateCcw size={16} /> {busyLoanId === loan.id ? 'Returning...' : 'Return'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loans.length === 0 && <div className="empty-state" data-testid="no-loans-message">No loans found.</div>}
      </div>
    </section>
  );
}
