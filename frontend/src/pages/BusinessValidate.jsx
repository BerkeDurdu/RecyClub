import { useState } from 'react';
import api from '../api/axios';

export default function BusinessValidate() {
  const [qr, setQr] = useState('');
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr(''); setResult(null);
    try {
      const r = await api.post('/redemptions/validate', { qrCode: qr.trim() });
      setResult(r.data);
      setQr('');
    } catch (e) {
      setErr(e.response?.data?.error || 'Validation failed');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Validate Redemption</h2>
        <p>Müşterinin telefonundaki QR kodunu girin (veya tarayıcı tarayıcısı ile okutun).</p>
        {err && <div className="error">{err}</div>}
        {result && (
          <div className="success">
            ✅ Validated! Reward <strong>{result.reward?.title || '#' + result.rewardId}</strong> for {result.pointsSpent} pts.
          </div>
        )}
        <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
          <input style={{ flex: 1 }} value={qr} onChange={(e) => setQr(e.target.value)} placeholder="REWARD-xxxx-xxxx" required />
          <button>Validate</button>
        </form>
      </div>
    </div>
  );
}
