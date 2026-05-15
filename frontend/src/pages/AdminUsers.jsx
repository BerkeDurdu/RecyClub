import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  function load() { api.get('/admin/users').then((r) => setUsers(r.data)); }
  useEffect(() => { load(); }, []);

  async function flag(u) {
    await api.patch(`/admin/users/${u.id}/flag`, { isFlagged: !u.isFlagged });
    load();
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Manage Users</h2>
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Points</th><th>Flagged</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.points}</td>
                <td>{u.isFlagged ? 'Yes' : 'No'}</td>
                <td><button className={u.isFlagged ? 'secondary' : 'danger'} onClick={() => flag(u)}>{u.isFlagged ? 'Unflag' : 'Flag'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
