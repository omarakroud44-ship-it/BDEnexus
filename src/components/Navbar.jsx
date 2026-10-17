import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Moon, Sun, LogOut, Shield, Ticket, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  ['/', 'Accueil'], ['/evenements', 'Événements'], ['/equipe', 'Équipe'],
  ['/discounts', 'Discounts'], ['/postuler', 'Postuler'],
];

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const toggleDark = () => {
    const d = !dark; setDark(d);
    document.documentElement.classList.toggle('dark', d);
    localStorage.setItem('theme', d ? 'dark' : 'light');
  };
  const cls = ({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:text-fg'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Navigation principale">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="h-9 w-9 rounded-full bg-white" /> NEXUS
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
          {isAdmin && <NavLink to="/admin" className={cls}><Shield className="mr-1 inline h-4 w-4" />Admin</NavLink>}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggleDark} className="btn btn-ghost !p-2" aria-label="Changer de thème">
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              <Link to="/mes-inscriptions" className="btn btn-ghost !p-2" aria-label="Mes inscriptions"><Ticket className="h-5 w-5" /></Link>
              <Link to="/idees" className="btn btn-ghost !p-2" aria-label="Boîte à idées"><Lightbulb className="h-5 w-5" /></Link>
              <button onClick={logout} className="btn btn-ghost !p-2" aria-label="Se déconnecter" title={user.email}><LogOut className="h-5 w-5" /></button>
            </div>
          ) : (
            <Link to="/connexion" className="btn btn-primary hidden md:inline-flex">Connexion</Link>
          )}
          <button className="btn btn-ghost !p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 border-t border-line px-4 py-3 md:hidden" onClick={() => setOpen(false)}>
          {LINKS.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{l}</NavLink>)}
          {user && <>
            <NavLink to="/mes-inscriptions" className={cls}>Mes inscriptions</NavLink>
            <NavLink to="/idees" className={cls}>Boîte à idées</NavLink>
          </>}
          {isAdmin && <NavLink to="/admin" className={cls}>Espace modérateur</NavLink>}
          {user ? <button onClick={logout} className="btn btn-ghost mt-2">Se déconnecter</button>
                : <Link to="/connexion" className="btn btn-primary mt-2">Connexion</Link>}
        </div>
      )}
    </header>
  );
}
