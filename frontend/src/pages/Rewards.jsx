import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Rewards() {
  const { user, refresh } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [maxCost, setMaxCost] = useState('');
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState('');

  function load() {
    const params = maxCost ? { maxPointCost: maxCost } : {};
    api.get('/rewards', { params }).then((r) => setRewards(r.data));
  }

  useEffect(() => { load(); refresh(); /* eslint-disable-next-line */ }, []);

  async function redeem(rewardId) {
    setErr(''); setMsg(null);
    try {
      const r = await api.post('/redemptions', { rewardId });
      setMsg(r.data);
      refresh();
      load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Redeem failed');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Reward Catalog</h2>
        <p>Your balance: <strong>{user?.points} pts</strong></p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
          <div style={{ flex: 1, maxWidth: 200 }}>
            <label>Max point cost</label>
            <input type="number" value={maxCost} onChange={(e) => setMaxCost(e.target.value)} placeholder="any" />
          </div>
          <button onClick={load}>Filter</button>
        </div>
        {err && <div className="error">{err}</div>}
        {msg && (
          <div className="success">
            Redeemed! Show this QR at <strong>{msg.reward?.title || 'partner'}</strong>:
            <div className="qr-box" style={{ marginTop: 8 }}>
              <img src={msg.qrImage} alt="QR" />
              <code>{msg.qrCode}</code>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-3">
        {rewards.map((r) => (
          <div className="card" key={r.id}>
            <h3 style={{ marginTop: 0 }}>{r.title}</h3>
            <p style={{ color: '#6b7280', minHeight: 40 }}>{r.description || '—'}</p>
            <p><strong>{r.pointCost} pts</strong> · stock: {r.stock}</p>
            <p style={{ fontSize: 12, color: '#6b7280' }}>at {r.business?.name}</p>
            <button
              disabled={!user || user.points < r.pointCost || r.stock <= 0}
              onClick={() => redeem(r.id)}
            >
              Redeem
            </button>
          </div>
        ))}
        {!rewards.length && <p>No rewards available.</p>}
      </div>
    </div>
  );
}
