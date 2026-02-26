import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WAIT_SECS = 8; // auto-redirect countdown

export default function NoticePage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(WAIT_SECS);

  // Countdown timer → auto-redirect to /login
  useEffect(() => {
    if (countdown <= 0) { navigate('/login'); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, navigate]);

  return (
    <div className="auth-page notice-page">
      {/* Brand */}
      <nav className="top-navbar">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">✓</span>
          <span className="brand-name">Task-Manager</span>
        </div>
      </nav>

      <div className="auth-card frosted notice-card">
        {/* Render icon */}
        <div className="notice-icon-wrap">
          <div className="notice-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <circle cx="12" cy="16" r="0.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        <h1 className="notice-title">Just a heads-up! 🚀</h1>

        <p className="notice-body">
          This app uses the <strong>Render free tier</strong> for the backend.
          Free instances spin down after inactivity, so the first request may
          take up to <strong>60 seconds</strong> to wake up.
        </p>

        <div className="notice-steps">
          <div className="notice-step">
            <span className="notice-step-num">1</span>
            <span>Click <strong>Continue</strong> below and try to sign in or register</span>
          </div>
          <div className="notice-step">
            <span className="notice-step-num">2</span>
            <span>If you see an error, wait <strong>30–60 seconds</strong> and retry</span>
          </div>
          <div className="notice-step">
            <span className="notice-step-num">3</span>
            <span>After the first successful request, everything runs fast ⚡</span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={() => navigate('/login')}
          style={{ marginTop: '8px' }}
        >
          Got it, Continue → ({countdown}s)
        </button>

        <p className="notice-skip" onClick={() => navigate('/login')}>
          Skip — take me there now
        </p>
      </div>

      <footer className="page-footer">© 2026 Task-Manager. All rights reserved.</footer>
    </div>
  );
}
