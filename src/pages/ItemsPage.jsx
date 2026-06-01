import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { libraryApi } from '../api/libraryApi';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadItems() {
      try {
        const data = await libraryApi.getItems();
        if (!ignore) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError(err.message || 'Could not load items');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadItems();
    return () => {
      ignore = true;
    };
  }, []);

  const mediaTypes = useMemo(() => {
    const values = new Set(items.map((item) => item.mediaType).filter(Boolean));
    return ['all', ...values];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = item.name?.toLowerCase().includes(query.toLowerCase()) ?? false;
      const matchesMedia = mediaType === 'all' || item.mediaType === mediaType;
      return matchesQuery && matchesMedia;
    });
  }, [items, query, mediaType]);

  if (isLoading) return <Loading label="Loading items..." />;

  return (
    <section>
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1>Items</h1>
          <p className="muted-text">Discover our collection of items.</p>
        </div>
      </div>

      <StatusMessage type="error" testId="items-error-message">{error}</StatusMessage>

      <div className="toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            data-testid="item-search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title"
          />
        </label>
        <select data-testid="media-type-filter" value={mediaType} onChange={(event) => setMediaType(event.target.value)}>
          {mediaTypes.map((type) => (
            <option key={type} value={type}>{type === 'all' ? 'All media types' : type}</option>
          ))}
        </select>
      </div>

      <div className="item-grid" data-testid="items-grid">
        {filteredItems.map((item) => (
          <article className="item-card" key={item.id} data-testid={`item-card-${item.id}`}>
            <div className="item-cover">{item.mediaType ?? 'item'}</div>
            <div className="item-card-body">
              <span className="tag">{item.mediaType ?? 'unknown'}</span>
              <h2>{item.name}</h2>
              <p className="muted-text">Released {item.releaseYear ?? '-'}</p>
              <p className="rating"><Star size={16} /> {item.averageStars ?? 'No rating'}</p>
              <Link className="secondary-button full-width" to={`/items/${item.id}`} data-testid={`view-item-${item.id}`}>
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && <div className="empty-state" data-testid="no-items-message">No items found.</div>}
    </section>
  );
}
