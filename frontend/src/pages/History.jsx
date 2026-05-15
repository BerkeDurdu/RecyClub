import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function History() {
  const { user, refresh } = useAuth();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/waste-logs/mine').then((r) => setLogs(r.data));
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="card">
        <h2>Points & History</h2>
        <p>Current balance: <strong>{user?.points} pts</strong></p>
      </div>
      <div className="card">
        <h2>Recycling Activity</h2>
        <table>
          <thead>
            <tr><th>Date</th><th>Type</th><th>Qty (kg)</th><th>Points</th><th>Drop-off</th><th>Status</th></tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{new Date(l.createdAt).toLocaleString()}</td>
                <td>{l.wasteType}</td>
                <td>{l.quantity}</td>
                <td>{l.pointsAwarded}</td>
                <td>{l.dropOffPoint?.name || '—'}</td>
                <td><span className={`badge ${l.status.toLowerCase()}`}>{l.status}</span></td>
              </tr>
            ))}
            {!logs.length && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af' }}>No logs yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
