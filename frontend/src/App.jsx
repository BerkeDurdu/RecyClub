import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import DropOffMap from './pages/DropOffMap';
import LogRecycling from './pages/LogRecycling';
import History from './pages/History';
import Rewards from './pages/Rewards';
import Redemptions from './pages/Redemptions';
import BusinessRewards from './pages/BusinessRewards';
import BusinessValidate from './pages/BusinessValidate';
import AdminDropOffs from './pages/AdminDropOffs';
import AdminUsers from './pages/AdminUsers';
import AdminComplaints from './pages/AdminComplaints';
import MyComplaints from './pages/MyComplaints';
import Scan from './pages/Scan';

export default function App() {
  const { user, isGuest } = useAuth();

  // Not logged in and not a guest -> show Login/Register screens
  if (!user && !isGuest) {
    // Preserve a scanned QR deep link so we return to it after logging in
    const { pathname, search } = window.location;
    if (pathname.startsWith('/scan')) {
      localStorage.setItem('rc_postLoginRedirect', pathname + search);
    }
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public map (guests included) */}
        <Route path="/map" element={<DropOffMap />} />

        {/* QR scan landing — completes validation for the logged-in user */}
        <Route path="/scan" element={<Scan />} />

        {/* Auth pages — redirect to map when already logged in */}
        <Route path="/login" element={<Navigate to="/map" replace />} />
        <Route path="/register" element={<Navigate to="/map" replace />} />

        {/* Member pages */}
        <Route path="/log" element={<ProtectedRoute roles={['MEMBER']}><LogRecycling /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute roles={['MEMBER']}><History /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute roles={['MEMBER']}><Rewards /></ProtectedRoute>} />
        <Route path="/redemptions" element={<ProtectedRoute roles={['MEMBER']}><Redemptions /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute roles={['MEMBER']}><MyComplaints /></ProtectedRoute>} />

        {/* Business pages */}
        <Route path="/business/rewards" element={<ProtectedRoute roles={['BUSINESS']}><BusinessRewards /></ProtectedRoute>} />
        <Route path="/business/validate" element={<ProtectedRoute roles={['BUSINESS']}><BusinessValidate /></ProtectedRoute>} />

        {/* Admin pages */}
        <Route path="/admin/dropoffs" element={<ProtectedRoute roles={['ADMIN']}><AdminDropOffs /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute roles={['ADMIN']}><AdminComplaints /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </>
  );
}
