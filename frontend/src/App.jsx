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

export default function App() {
  const { user, isGuest } = useAuth();

  /* Giriş yapılmamış ve misafir değilse → Login/Register ekranı */
  if (!user && !isGuest) {
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
        {/* Herkes (guest dahil) haritayı görebilir */}
        <Route path="/map" element={<DropOffMap />} />

        {/* Auth sayfaları - giriş yapmışsa map'e yönlendir */}
        <Route path="/login" element={<Navigate to="/map" replace />} />
        <Route path="/register" element={<Navigate to="/map" replace />} />

        {/* Member sayfaları */}
        <Route path="/log" element={<ProtectedRoute roles={['MEMBER']}><LogRecycling /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute roles={['MEMBER']}><History /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute roles={['MEMBER']}><Rewards /></ProtectedRoute>} />
        <Route path="/redemptions" element={<ProtectedRoute roles={['MEMBER']}><Redemptions /></ProtectedRoute>} />

        {/* Business sayfaları */}
        <Route path="/business/rewards" element={<ProtectedRoute roles={['BUSINESS']}><BusinessRewards /></ProtectedRoute>} />
        <Route path="/business/validate" element={<ProtectedRoute roles={['BUSINESS']}><BusinessValidate /></ProtectedRoute>} />

        {/* Admin sayfaları */}
        <Route path="/admin/dropoffs" element={<ProtectedRoute roles={['ADMIN']}><AdminDropOffs /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute roles={['ADMIN']}><AdminComplaints /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </>
  );
}
