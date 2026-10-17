import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Events from './pages/Events';
import Team from './pages/Team';
import Discounts from './pages/Discounts';
import Apply from './pages/Apply';
import MyRegistrations from './pages/MyRegistrations';
import Ideas from './pages/Ideas';
import Dashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:p-3">Aller au contenu</a>
      <Navbar />
      <main id="main" className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/equipe" element={<Team />} />
          <Route path="/postuler" element={<Apply />} />
          <Route path="/discounts" element={<ProtectedRoute><Discounts /></ProtectedRoute>} />
          <Route path="/mes-inscriptions" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
          <Route path="/idees" element={<ProtectedRoute><Ideas /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute admin><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<p className="py-20 text-center text-muted">Page introuvable.</p>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
