import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Redemptions() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/redemptions/mine').then((r) => setItems(r.data)); }, []);
  return (
    <div className="container">
      <div className="card">
        <h2>My Redemptions</h2>
      </div>
      <div className="grid grid-2">
        {items.map((r) => (
          <div className="card" key={r.id}>
            <h3 style={{ marginTop: 0 }}>{r.reward?.title}</h3>
            <p>Spent: <strong>{r.pointsSpent} pts</strong></p>
            <p>Status: <span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></p>
            {r.status === 'PENDING' && (
              <div className="qr-box">
                <img src={r.qrImage} alt="QR" />
                <code>{r.qrCode}</code>
              </div>
            )}
            <p style={{ fontSize: 12, color: '#6b7280' }}>{new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {!items.length && <p>No redemptions yet.</p>}
      </div>
    </div>
  );
}
