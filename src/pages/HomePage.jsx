import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FlaskConical } from 'lucide-react';
import { API_BASE_URL, APP_MODE } from '../api/config';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero-grid">
      <div className="hero-card">
        <p className="eyebrow">Software Quality Library</p>
        <h1>Welcome to the Software Quality Library</h1>
        <p className="hero-text">
          Browse items, borrow available copies, reserve unavailable items, return loans, and pay fines.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/items" data-testid="start-browsing-button">
            Browse items <ArrowRight size={18} />
          </Link>
          {!isAuthenticated && (
            <Link className="secondary-button" to="/login" data-testid="home-login-button">
              Login
            </Link>
          )}
        </div>
      </div>

      <aside className="info-panel">
        <h2>Current mode</h2>
        <div className="mode-card" data-testid="home-mode-card">
          <FlaskConical size={28} />
          <div>
            <strong>{APP_MODE}</strong>
            <span>{API_BASE_URL}</span>
          </div>
        </div>
        <ul className="check-list">
          <li><CheckCircle2 size={18} /> Login/register</li>
          <li><CheckCircle2 size={18} /> Loan and return</li>
          <li><CheckCircle2 size={18} /> Reservations</li>
          <li><CheckCircle2 size={18} /> Fines</li>
        </ul>
      </aside>
    </section>
  );
}
