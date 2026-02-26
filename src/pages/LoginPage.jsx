import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]         = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.password) errs.password = 'Password is required.';
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
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err?.response?.data?.message ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <nav className="top-navbar">
        <Link to="/" className="brand">
          <span className="brand-icon" aria-hidden="true">✓</span>
          <span className="brand-name">Task-Manager</span>
        </Link>
        <Link to="/register"><button className="btn btn-ghost btn-sm">Register</button></Link>
      </nav>

      <div className="auth-card frosted login-card">
        {/* Header with shield icon */}
        <div className="auth-card-header-centered">
          <div className="auth-icon-box login-icon-box">
            <ShieldIcon />
          </div>
          <h1 className="auth-card-title" style={{ textAlign: 'center' }}>Welcome Back</h1>
          <p className="auth-card-subtitle" style={{ textAlign: 'center' }}>
            Sign in to manage your tasks securely.
          </p>
        </div>

        {/* Divider */}
        <div className="auth-divider"><span>Sign in with email</span></div>

        {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><EnvelopeIcon /></span>
              <input id="login-email" name="email" type="email"
                className={`input has-left-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="name@company.com"
                value={form.email} onChange={handleChange}
                autoComplete="email" autoFocus aria-invalid={!!errors.email} />
            </div>
            {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password" className="form-label">Password</label>
              <span className="auth-link-sm">Forgot?</span>
            </div>
            <div className="input-wrapper">
              <span className="input-icon-left"><LockIcon /></span>
              <input id="login-password" name="password" type={showPw ? 'text' : 'password'}
                className={`input has-left-icon has-right-icon ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                value={form.password} onChange={handleChange}
                autoComplete="current-password" aria-invalid={!!errors.password} />
              <button type="button" className="input-icon-right"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                <EyeIcon off={showPw} />
              </button>
            </div>
            {errors.password && <span className="form-error" role="alert">{errors.password}</span>}
          </div>

          <button id="login-submit-btn" type="submit"
            className="btn btn-primary btn-full" disabled={loading}
            style={{ marginTop: '4px' }}>
            {loading ? <><span className="btn-spinner" />Signing In…</> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>

      <footer className="page-footer">© 2026 TASK-MANAGER. ALL RIGHTS RESERVED.</footer>
    </div>
  );
}
