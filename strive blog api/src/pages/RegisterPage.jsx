import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await register(form.name, form.email, form.password);
      setSuccess('Registrazione completata. Ora puoi accedere.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.message || 'Registrazione fallita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">Create account</p>
        <h1>Registrazione</h1>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nome
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Registrazione...' : 'Registrati'}
          </button>
        </form>

        <p className="auth-link">
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </div>
    </section>
  );
}
