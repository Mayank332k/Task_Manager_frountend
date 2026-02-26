import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/* ── Inline SVG Icons ── */
const EnvelopeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const EyeIcon = ({ off }) => off ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    else if (form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Min. 6 characters required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err?.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <nav className="top-navbar">
        <Link to="/" className="brand">
          <span className="brand-icon" aria-hidden="true">✓</span>
          <span className="brand-name">Task-Manager</span>
        </Link>
        <Link to="/login"><button className="btn btn-ghost btn-sm">Sign In</button></Link>
      </nav>

      <div className="auth-card frosted">
        <div className="auth-card-header-simple">
          <h1 className="auth-card-title">Create Account</h1>
          <p className="auth-card-subtitle">Sign up and start managing your tasks.</p>
        </div>

        {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><UserIcon /></span>
              <input id="reg-name" name="name" type="text"
                className={`input has-left-icon ${errors.name ? 'input-error' : ''}`}
                placeholder="mayank.." value={form.name} onChange={handleChange}
                autoComplete="name" aria-invalid={!!errors.name} />
            </div>
            {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><EnvelopeIcon /></span>
              <input id="reg-email" name="email" type="email"
                className={`input has-left-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="Mayank@example.com" value={form.email} onChange={handleChange}
                autoComplete="email" aria-invalid={!!errors.email} />
            </div>
            {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><LockIcon /></span>
              <input id="reg-password" name="password" type={showPw ? 'text' : 'password'}
                className={`input has-left-icon has-right-icon ${errors.password ? 'input-error' : ''}`}
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
                autoComplete="new-password" aria-invalid={!!errors.password} />
              <button type="button" className="input-icon-right"
                onClick={() => setShowPw((v) => !v)} aria-label="Toggle password">
                <EyeIcon off={showPw} />
              </button>
            </div>
            {errors.password
              ? <span className="form-error" role="alert">{errors.password}</span>
              : <span className="form-hint">Min. 6 characters</span>}
          </div>

          <button id="register-submit-btn" type="submit"
            className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? <><span className="btn-spinner" />Creating Account…</> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
      <footer className="page-footer">© 2026 Task-Manager. All rights reserved.</footer>
    </div>
  );
}
