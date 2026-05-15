import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, continueAsGuest } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      nav('/map');
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed');
    }
  }

  function handleGuest() {
    continueAsGuest();
    nav('/map');
  }

  return (
    <div className="auth-page">
      <div className="auth-logo">♻</div>
      <h1>RecyClub</h1>
      <p className="auth-subtitle">Smart Recycling & Reward Platform</p>
      <div className="card">
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="••••••••" />
          </div>
          <button type="submit" style={{ width: '100%' }}>Login</button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="btn-guest"
          onClick={handleGuest}
          style={{ width: '100%' }}
        >
          Continue as Guest
        </button>

        <p style={{ marginTop: 16, textAlign: 'center', color: '#6b7280', fontSize: 13 }}>
          Guest users can only view drop-off points on the map.
        </p>

        <p style={{ marginTop: 12, textAlign: 'center' }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
