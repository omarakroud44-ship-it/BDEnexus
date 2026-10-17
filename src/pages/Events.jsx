import { useState } from 'react';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useQ } from '../lib/hooks';
import { CATEGORIES } from '../lib/utils';
import EventCard from '../components/EventCard';
import Calendar from '../components/Calendar';
import Modal from '../components/Modal';

export default function Events() {
  const { user } = useAuth();
  const { data: events, loading } = useQ(() => query(collection(db, 'events'), orderBy('start', 'asc')), []);
  const regs = useQ(() => user ? query(collection(db, 'registrations'), where('userId', '==', user.uid)) : collection(db, 'events'), [user?.uid]);
  const myIds = new Set(user ? regs.data.map((r) => r.eventId) : []);
  const [cat, setCat] = useState('');
  const [tab, setTab] = useState('list');
  const [sel, setSel] = useState(null);

  const filtered = events.filter((e) => !cat || e.category === cat);
  const upcoming = filtered.filter((e) => e.start && e.start.toDate() >= new Date(new Date().setHours(0, 0, 0, 0)));

  return (
    <div>
      <h1 className="text-4xl font-extrabold">Événements</h1>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-line p-0.5 font-semibold">
          {[['list', 'Liste'], ['cal', 'Calendrier']].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} className={`rounded-lg px-4 py-1.5 ${tab === v ? 'bg-primary text-onp' : 'text-muted'}`}>{l}</button>
          ))}
        </div>
        <select aria-label="Filtrer par catégorie" className="input !w-auto" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="mt-6">
        {loading ? <p className="text-muted">Chargement…</p> : tab === 'cal'
          ? <Calendar events={filtered} onEvent={setSel} />
          : upcoming.length === 0 ? <p className="text-muted">Aucun événement à venir dans cette catégorie.</p>
          : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{upcoming.map((e) => <EventCard key={e.id} event={e} registered={myIds.has(e.id)} />)}</div>}
      </div>

      {sel && <Modal title={sel.title} onClose={() => setSel(null)}><EventCard event={sel} registered={myIds.has(sel.id)} /></Modal>}
    </div>
  );
}
