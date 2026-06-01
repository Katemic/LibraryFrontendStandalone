import { Link, NavLink, Outlet } from 'react-router-dom';
import { BookOpen, ClipboardList, Coins, LogOut, UserRound } from 'lucide-react';
import { API_BASE_URL, APP_MODE } from '../api/config';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand" data-testid="home-link">
          <BookOpen size={28} />
          <span>Library</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/items" data-testid="nav-items">Items</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/my-loans" data-testid="nav-my-loans">My loans</NavLink>
              <NavLink to="/my-reservations" data-testid="nav-my-reservations">Reservations</NavLink>
              <NavLink to="/my-fines" data-testid="nav-my-fines">Fines</NavLink>
            </>
          )}
        </nav>

        <div className="user-area">
          <span className="mode-pill" title={API_BASE_URL} data-testid="api-mode">
            {APP_MODE}
          </span>
          {isAuthenticated ? (
            <>
              <span className="user-chip" data-testid="logged-in-user">
                <UserRound size={16} /> {user?.firstName ?? user?.email ?? 'User'}
              </span>
              <button className="ghost-button" onClick={logout} data-testid="logout-button">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link className="ghost-button" to="/login" data-testid="nav-login">Login</Link>
              <Link className="primary-button small" to="/register" data-testid="nav-register">Register</Link>
            </>
          )}
        </div>
      </header>

      <main className="page-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <span><ClipboardList size={16} /> Built for happy-path e2e tests</span>
      </footer>
    </div>
  );
}
