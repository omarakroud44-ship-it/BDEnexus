import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useQ } from '../lib/hooks';
import EventCard from '../components/EventCard';

export default function MyRegistrations() {
  const { user } = useAuth();
  const regs = useQ(() => query(collection(db, 'registrations'), where('userId', '==', user.uid)), [user.uid]);
  const events = useQ(() => query(collection(db, 'events'), orderBy('start', 'asc')), []);
  const ids = new Set(regs.data.map((r) => r.eventId));
  const mine = events.data.filter((e) => ids.has(e.id));

  return (
    <div>
      <h1 className="text-4xl font-extrabold">Mes inscriptions</h1>
      {mine.length === 0
        ? <p className="mt-6 text-muted">Tu n’es inscrit à aucun événement. Va faire un tour dans l’onglet Événements.</p>
        : <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{mine.map((e) => <EventCard key={e.id} event={e} registered />)}</div>}
    </div>
  );
}
