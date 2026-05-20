import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isGuest, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="nav">
      <span className="brand" onClick={() => nav('/map')} style={{ cursor: 'pointer' }}>♻ RecyClub</span>

      <NavLink to="/map">Drop-off Map</NavLink>

      {user && user.role === 'MEMBER' && <>
        <NavLink to="/log">Log Recycling</NavLink>
        <NavLink to="/history">My Activity</NavLink>
        <NavLink to="/rewards">Rewards</NavLink>
        <NavLink to="/redemptions">My Redemptions</NavLink>
        <NavLink to="/complaints">Complaints</NavLink>
      </>}

      {user && user.role === 'BUSINESS' && <>
        <NavLink to="/business/rewards">My Rewards</NavLink>
        <NavLink to="/business/validate">Validate Redemption</NavLink>
      </>}

      {user && user.role === 'ADMIN' && <>
        <NavLink to="/admin/dropoffs">Drop-off Points</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/complaints">Complaints</NavLink>
      </>}

      <span className="spacer" />

      {user && user.role === 'MEMBER' && (
        <span className="pts">⭐ {user.points} pts</span>
      )}

      {user ? (
        <>
          <span className="user-info">{user.name} ({user.role})</span>
          <button className="btn-logout" onClick={() => { logout(); nav('/login'); }}>Logout</button>
        </>
      ) : isGuest ? (
        <>
          <span className="user-info guest-label">Guest</span>
          <button className="btn-login" onClick={() => { logout(); nav('/login'); }}>Login / Register</button>
        </>
      ) : null}
    </nav>
  );
}
