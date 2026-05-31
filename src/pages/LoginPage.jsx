import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      const target = location.state?.from?.pathname ?? '/items';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <div>
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <p className="muted-text">Use a registered loaner account to borrow, reserve, return, and pay fines.</p>
      </div>

      <form className="form-stack" onSubmit={handleSubmit} data-testid="login-form">
        <label>
          Email
          <input
            data-testid="login-email-input"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password
          <input
            data-testid="login-password-input"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            autoComplete="current-password"
            required
          />
        </label>

        <StatusMessage type="error" testId="login-error-message">{error}</StatusMessage>

        <button className="primary-button full-width" type="submit" disabled={isSubmitting} data-testid="login-submit-button">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="muted-text center-text">
        No account? <Link to="/register" data-testid="login-register-link">Create one here</Link>
      </p>
    </section>
  );
}
