import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useQ } from '../lib/hooks';
import { POLES } from '../lib/poles';
import { fmtDate } from '../lib/utils';
import EventCard from '../components/EventCard';

export default function Home() {
  const events = useQ(() => query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(3)), []);
  const news = useQ(() => query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(3)), []);
  const members = useQ(() => collection(db, 'members'), []);

  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 py-6 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl">NEXUS, le point de rencontre des étudiants.</h1>
          <p className="mt-5 max-w-prose text-lg text-muted">Soirées, sorties, tournois, projets solidaires et bons plans : le Bureau des Étudiants organise ta vie de campus. Viens y participer, ou rejoins l’équipe.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/evenements" className="btn btn-primary">Voir les événements</Link>
            <Link to="/postuler" className="btn btn-ghost">Rejoindre le BDE</Link>
          </div>
        </div>
        <div className="flex justify-center py-8">
          <div className="orbit-wrap">
            <div className="orbit" aria-hidden="true"><i className="ring ring-1" /><i className="ring ring-2" /><i className="ring ring-3" /></div>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo NEXUS Bureau des Étudiants" className="relative h-full w-full rounded-full bg-white shadow-xl" />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-3xl font-extrabold">Derniers événements</h2>
        {events.data.length === 0
          ? <p className="text-muted">Aucun événement pour l’instant. Reviens bientôt !</p>
          : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{events.data.map((e) => <EventCard key={e.id} event={e} compact />)}</div>}
        <Link to="/evenements" className="btn btn-ghost mt-5">Tous les événements</Link>
      </section>

      {news.data.length > 0 && (
        <section>
          <h2 className="mb-5 text-3xl font-extrabold">News</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {news.data.map((n) => (
              <article key={n.id} className="card overflow-hidden">
                {n.image && <img src={n.image} alt="" className="h-40 w-full object-cover" loading="lazy" />}
                <div className="p-4">
                  <p className="text-xs text-muted">{fmtDate(n.createdAt, { day: 'numeric', month: 'long' })}</p>
                  <h3 className="text-lg font-bold">{n.title}</h3>
                  <p className="mt-1 text-sm text-muted">{n.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-5 text-3xl font-extrabold">Notre équipe</h2>
        <div className="flex flex-wrap gap-3">
          {POLES.map((p) => (
            <Link to="/equipe" key={p.id} className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white" style={{ background: p.color }}>
              <p.icon className="h-4 w-4" /> {p.name} <span className="rounded-full bg-white/25 px-2 text-xs">{members.data.filter((m) => m.pole === p.id).length}</span>
            </Link>
          ))}
        </div>
        <Link to="/equipe" className="btn btn-ghost mt-5">Voir l’affiche de l’équipe</Link>
      </section>
    </div>
  );
}
