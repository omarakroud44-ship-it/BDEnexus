import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ admin = false, children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <p className="p-10 text-center text-muted">Chargement…</p>;
  if (!user) return <Navigate to="/connexion" replace />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}
