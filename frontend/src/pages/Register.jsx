import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, continueAsGuest } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER', businessName: '', address: '' });
  const [err, setErr] = useState('');

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await register(form);
      const redirect = localStorage.getItem('rc_postLoginRedirect');
      localStorage.removeItem('rc_postLoginRedirect');
      nav(redirect || '/map');
    } catch (e) {
      setErr(e.response?.data?.error || 'Register failed');
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
        <h2>Register</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: 10 }}>
            <label>Role</label>
            <select value={form.role} onChange={(e) => set('role', e.target.value)}>
              <option value="MEMBER">Member</option>
              <option value="BUSINESS">Business Partner</option>
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Full name</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="John Doe" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} placeholder="Min 6 characters" />
          </div>
          {form.role === 'BUSINESS' && (
            <>
              <div style={{ marginBottom: 10 }}>
                <label>Business name</label>
                <input value={form.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder="Your business name" />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label>Address</label>
                <input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Business address" />
              </div>
            </>
          )}
          <button type="submit" style={{ width: '100%' }}>Create account</button>
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

        <p style={{ marginTop: 16, textAlign: 'center' }}>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
