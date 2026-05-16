import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyComplaints() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ subject: '', body: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  function load() { api.get('/complaints/mine').then((r) => setList(r.data)); }
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setOk('');
    try {
      await api.post('/complaints', form);
      setForm({ subject: '', body: '' });
      setOk('Complaint submitted. An admin will review it.');
      load();
    } catch (e) { setErr(e.response?.data?.error || 'Failed'); }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>File a Complaint</h2>
        {err && <div className="error">{err}</div>}
        {ok && <div className="success">{ok}</div>}
        <form onSubmit={submit} className="grid">
          <div>
            <label>Subject</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <div>
            <label>Details</label>
            <textarea rows="4" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          </div>
          <div><button>Submit</button></div>
        </form>
      </div>

      <div className="card">
        <h2>My Complaints</h2>
        <table>
          <thead>
            <tr><th>Date</th><th>Subject</th><th>Status</th><th>Admin Response</th></tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>
                  <strong>{c.subject}</strong>
                  <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>{c.body}</div>
                </td>
                <td><span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                <td>{c.resolution
                  ? <span>{c.resolution}</span>
                  : <span style={{ color: '#9ca3af' }}>— awaiting reply —</span>}</td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>No complaints yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
