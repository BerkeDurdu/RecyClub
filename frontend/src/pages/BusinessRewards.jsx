import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function BusinessRewards() {
  const [rewards, setRewards] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', pointCost: 100, stock: 10 });
  const [err, setErr] = useState('');

  function load() { api.get('/rewards/mine').then((r) => setRewards(r.data)); }
  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/rewards', { ...form, pointCost: Number(form.pointCost), stock: Number(form.stock) });
      setForm({ title: '', description: '', pointCost: 100, stock: 10 });
      load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Create failed');
    }
  }

  async function toggle(r) {
    await api.patch(`/rewards/${r.id}`, { isActive: !r.isActive });
    load();
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My Rewards</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={create} className="grid grid-2">
          <div><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div><label>Point cost</label><input type="number" min="1" value={form.pointCost} onChange={(e) => setForm({ ...form, pointCost: e.target.value })} /></div>
          <div><label>Stock</label><input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          <div style={{ gridColumn: '1 / -1' }}><label>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div style={{ gridColumn: '1 / -1' }}><button>Add reward</button></div>
        </form>
      </div>
      <div className="card">
        <h2>Active catalog</h2>
        <table>
          <thead><tr><th>Title</th><th>Cost</th><th>Stock</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {rewards.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.pointCost}</td>
                <td>{r.stock}</td>
                <td>{r.isActive ? 'Yes' : 'No'}</td>
                <td><button className="secondary" onClick={() => toggle(r)}>{r.isActive ? 'Deactivate' : 'Activate'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
