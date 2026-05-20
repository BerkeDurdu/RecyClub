import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const TYPES = [
  { v: 'GLASS', label: 'Glass (5 pts/kg)' },
  { v: 'PLASTIC', label: 'Plastic (8 pts/kg)' },
  { v: 'BATTERY', label: 'Battery (20 pts/kg)' },
  { v: 'PAPER', label: 'Paper (3 pts/kg)' },
];

export default function LogRecycling() {
  const { refresh } = useAuth();
  const [wasteType, setWasteType] = useState('PLASTIC');
  const [quantity, setQuantity] = useState(1);
  const [dropOffPointId, setDropOffPointId] = useState('');
  const [points, setPoints] = useState([]);
  const [created, setCreated] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/drop-off-points').then((r) => setPoints(r.data));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const r = await api.post('/waste-logs', {
        wasteType, quantity: Number(quantity),
        dropOffPointId: dropOffPointId || undefined,
      });
      setCreated(r.data);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed');
    } finally { setBusy(false); }
  }

  async function validateNow() {
    try {
      const r = await api.post('/waste-logs/validate', { qrCode: created.qrCode });
      await refresh();
      alert(`Validated! +${created.pointsAwarded} points. New balance: ${r.data.points}`);
      setCreated(null);
    } catch (e) {
      alert(e.response?.data?.error || 'Validate failed');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Log Recycling Activity</h2>
        <p>Select the waste type and quantity. The system generates a QR code; once it is validated at the drop-off point, the points are credited to your account.</p>
        {err && <div className="error">{err}</div>}
        <form onSubmit={submit} className="grid grid-3">
          <div>
            <label>Waste type</label>
            <select value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
              {TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label>Quantity (kg)</label>
            <input type="number" step="0.1" min="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div>
            <label>Drop-off point</label>
            <select value={dropOffPointId} onChange={(e) => setDropOffPointId(e.target.value)}>
              <option value="">— select —</option>
              {points.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button disabled={busy}>{busy ? 'Submitting…' : 'Generate QR'}</button>
          </div>
        </form>
      </div>

      {created && (
        <div className="card">
          <h2>Your Drop-off QR</h2>
          <p>Go to the drop-off point and scan this QR. You will earn <strong>{created.pointsAwarded} pts</strong> once it is validated.</p>
          <div className="qr-box">
            <img src={created.qrImage} alt="QR" />
            <code>{created.qrCode}</code>
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={validateNow}>Simulate validation at drop-off</button>
          </div>
        </div>
      )}
    </div>
  );
}
