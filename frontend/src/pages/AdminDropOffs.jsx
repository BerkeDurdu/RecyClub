import { useEffect, useState } from 'react';
import api from '../api/axios';

const ALL_TYPES = ['GLASS', 'PLASTIC', 'BATTERY', 'PAPER'];

export default function AdminDropOffs() {
  const [points, setPoints] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', latitude: '', longitude: '', acceptedTypes: [] });
  const [err, setErr] = useState('');

  function load() { api.get('/drop-off-points/all').then((r) => setPoints(r.data)); }
  useEffect(() => { load(); }, []);

  function toggleType(t) {
    setForm((f) => ({
      ...f,
      acceptedTypes: f.acceptedTypes.includes(t) ? f.acceptedTypes.filter((x) => x !== t) : [...f.acceptedTypes, t],
    }));
  }

  async function create(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/drop-off-points', {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      setForm({ name: '', address: '', latitude: '', longitude: '', acceptedTypes: [] });
      load();
    } catch (e) { setErr(e.response?.data?.error || 'Failed'); }
  }

  async function deactivate(id) {
    await api.delete(`/drop-off-points/${id}`);
    load();
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Manage Drop-off Points</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={create} className="grid grid-2">
          <div><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div><label>Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required /></div>
          <div><label>Latitude</label><input type="number" step="0.000001" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required /></div>
          <div><label>Longitude</label><input type="number" step="0.000001" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required /></div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Accepted types</label>
            {ALL_TYPES.map((t) => (
              <label key={t} style={{ display: 'inline-block', marginRight: 12, fontWeight: 400 }}>
                <input type="checkbox" checked={form.acceptedTypes.includes(t)} onChange={() => toggleType(t)} /> {t}
              </label>
            ))}
          </div>
          <div style={{ gridColumn: '1 / -1' }}><button>Add point</button></div>
        </form>
      </div>
      <div className="card">
        <h2>All drop-off points</h2>
        <table>
          <thead><tr><th>Name</th><th>Address</th><th>Lat</th><th>Lng</th><th>Types</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.address}</td>
                <td>{Number(p.latitude).toFixed(4)}</td>
                <td>{Number(p.longitude).toFixed(4)}</td>
                <td>{(p.acceptedTypes || []).join(', ')}</td>
                <td>{p.isActive ? 'Yes' : 'No'}</td>
                <td>{p.isActive && <button className="danger" onClick={() => deactivate(p.id)}>Deactivate</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
