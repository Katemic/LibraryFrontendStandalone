import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookMarked, BookmarkPlus, Star } from 'lucide-react';
import { libraryApi } from '../api/libraryApi';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';

function isAvailable(copy) {
  return copy.status?.toLowerCase() === 'available';
}

export default function ItemDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [busyCopyId, setBusyCopyId] = useState(null);
  const [isReserving, setIsReserving] = useState(false);

  async function loadDetails() {
    const [itemData, inventoryData] = await Promise.all([
      libraryApi.getItem(id),
      libraryApi.getInventoryByItem(id),
    ]);
    setItem(itemData);
    setInventory(Array.isArray(inventoryData) ? inventoryData : []);
  }

  useEffect(() => {
    let ignore = false;

    async function run() {
      setIsLoading(true);
      setError('');
      try {
        const [itemData, inventoryData] = await Promise.all([
          libraryApi.getItem(id),
          libraryApi.getInventoryByItem(id),
        ]);
        if (!ignore) {
          setItem(itemData);
          setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Could not load item details');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [id]);

  const availableCopies = useMemo(() => inventory.filter(isAvailable), [inventory]);
  const canReserve = inventory.length > 0 && availableCopies.length === 0;

  async function handleBorrow(copy) {
    setError('');
    setSuccess('');

    if (!isAuthenticated || !user?.id) {
      setError('You need to log in before borrowing an item.');
      return;
    }

    setBusyCopyId(copy.id);
    try {
      await libraryApi.createLoan({ loanerId: user.id, inventoryId: copy.id });
      setSuccess('Loan created successfully.');
      await loadDetails();
    } catch (err) {
      setError(err.message || 'Could not create loan');
    } finally {
      setBusyCopyId(null);
    }
  }

  async function handleReserve() {
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      setError('You need to log in before reserving an item.');
      return;
    }

    setIsReserving(true);
    try {
      await libraryApi.createReservation(Number(id));
      setSuccess('Reservation created successfully.');
    } catch (err) {
      setError(err.message || 'Could not create reservation');
    } finally {
      setIsReserving(false);
    }
  }

  if (isLoading) return <Loading label="Loading item details..." />;
  if (!item) return <StatusMessage type="error">Item was not found.</StatusMessage>;

  return (
    <section>
      <Link className="back-link" to="/items" data-testid="back-to-items-link"><ArrowLeft size={16} /> Back to items</Link>

      <div className="details-layout">
        <article className="details-card" data-testid="item-details-card">
          <div className="large-cover">{item.mediaType ?? 'item'}</div>
          <div>
            <p className="eyebrow">{item.mediaType ?? 'Item'}</p>
            <h1 data-testid="item-details-title">{item.name}</h1>
            <p className="muted-text">{item.description}</p>
            <div className="meta-row">
              <span><Star size={16} /> {item.averageStars ?? 'No rating'}</span>
              <span>Released {item.releaseYear ?? '-'}</span>
              <span>{item.language ?? 'Unknown language'}</span>
            </div>
            <div className="tag-row">
              {(item.genres ?? []).map((genre) => <span className="tag" key={genre}>{genre}</span>)}
              {(item.tags ?? []).map((tag) => <span className="tag muted" key={tag}>{tag}</span>)}
            </div>
          </div>
        </article>

        <aside className="side-card">
          <h2>Inventory copies</h2>
          <p className="muted-text">Available copies can be borrowed. Unavailable items can be reserved.</p>
          <StatusMessage type="error" testId="item-action-error-message">{error}</StatusMessage>
          <StatusMessage type="success" testId="item-action-success-message">{success}</StatusMessage>

          <div className="copy-list" data-testid="inventory-copy-list">
            {inventory.map((copy) => (
              <div className="copy-row" key={copy.id} data-testid={`inventory-copy-${copy.id}`}>
                <div>
                  <strong>{copy.barcode}</strong>
                  <span>{copy.placement ?? 'No placement'}</span>
                </div>
                <span className={`status-pill ${isAvailable(copy) ? 'success' : 'warning'}`}>{copy.status}</span>
                {isAvailable(copy) && (
                  <button
                    className="primary-button small"
                    onClick={() => handleBorrow(copy)}
                    disabled={busyCopyId === copy.id}
                    data-testid={`borrow-copy-${copy.id}`}
                  >
                    <BookMarked size={16} /> {busyCopyId === copy.id ? 'Borrowing...' : 'Borrow'}
                  </button>
                )}
              </div>
            ))}
          </div>

          {canReserve && (
            <button
              className="secondary-button full-width"
              onClick={handleReserve}
              disabled={isReserving}
              data-testid="reserve-item-button"
            >
              <BookmarkPlus size={16} /> {isReserving ? 'Reserving...' : 'Reserve item'}
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}
