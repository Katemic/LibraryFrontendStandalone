import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  firstName: '',
  lastName: '',
  cpr: '',
  tlf: '',
  email: '',
  password: '',
};

export default function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exampleEmail = useMemo(() => `test.user.${Date.now()}@example.com`, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function fillExample() {
    setForm({
      firstName: 'Test',
      lastName: 'User',
      cpr: '0101901234',
      tlf: '+45 12345678',
      email: exampleEmail,
      password: 'Password1',
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await register(form);
      setSuccess('Registration created. Logging you in...');
      await login({ email: form.email, password: form.password });
      navigate('/items', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-card wide">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">New loaner</p>
          <h1>Register</h1>
          <p className="muted-text">Create a user with valid values from your black-box design.</p>
        </div>
        <button className="secondary-button" type="button" onClick={fillExample} data-testid="fill-register-example-button">
          Fill valid example
        </button>
      </div>

      <form className="form-grid" onSubmit={handleSubmit} data-testid="register-form">
        <label>
          First name
          <input data-testid="register-first-name-input" name="firstName" value={form.firstName} onChange={updateField} required />
        </label>
        <label>
          Last name
          <input data-testid="register-last-name-input" name="lastName" value={form.lastName} onChange={updateField} required />
        </label>
        <label>
          CPR
          <input data-testid="register-cpr-input" name="cpr" value={form.cpr} onChange={updateField} placeholder="0101901234" required />
        </label>
        <label>
          Phone (add space after country code)
          <input data-testid="register-tlf-input" name="tlf" value={form.tlf} onChange={updateField} placeholder="+45 12345678" required />
        </label>
        <label className="span-two">
          Email
          <input data-testid="register-email-input" name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label className="span-two">
          Password
          <input data-testid="register-password-input" name="password" type="password" value={form.password} onChange={updateField} required />
        </label>

        <div className="span-two">
          <StatusMessage type="error" testId="register-error-message">{error}</StatusMessage>
          <StatusMessage type="success" testId="register-success-message">{success}</StatusMessage>
          <button className="primary-button full-width" type="submit" disabled={isSubmitting} data-testid="register-submit-button">
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </div>
      </form>
    </section>
  );
}
