import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminComplaints() {
  const [items, setItems] = useState([]);
  function load() { api.get('/admin/complaints').then((r) => setItems(r.data)); }
  useEffect(() => { load(); }, []);

  async function resolve(c, status) {
    const resolution = status === 'CLOSED' ? prompt('Resolution note?') || '' : undefined;
    await api.patch(`/admin/complaints/${c.id}`, { status, resolution });
    load();
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Complaints</h2>
        <table>
          <thead><tr><th>Date</th><th>User</th><th>Subject</th><th>Body</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>{c.user?.name} ({c.user?.email})</td>
                <td>{c.subject}</td>
                <td style={{ maxWidth: 280 }}>{c.body}</td>
                <td><span className="badge pending">{c.status}</span></td>
                <td>
                  {c.status !== 'IN_REVIEW' && <button className="secondary" onClick={() => resolve(c, 'IN_REVIEW')}>Review</button>}{' '}
                  {c.status !== 'CLOSED' && <button onClick={() => resolve(c, 'CLOSED')}>Close</button>}
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan="6" style={{ textAlign: 'center', color: '#9ca3af' }}>No complaints.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
