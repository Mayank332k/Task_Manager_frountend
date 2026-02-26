import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logout(); } catch { /* ignore */ }
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-brand">
        <div className="navbar-logo" aria-hidden="true">✓</div>
        <span className="navbar-title">Task-Manager</span>
      </div>
      <div className="navbar-right">
        {user?.name && (
          <span className="navbar-user-name">{user.name}</span>
        )}
        <button
          id="logout-btn"
          className="btn-icon"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          ↪
        </button>
      </div>
    </nav>
  );
}
