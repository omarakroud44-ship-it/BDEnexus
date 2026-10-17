import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarPlus, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { catById, fmtDate, fmtTime, isNew, gcalLink } from '../lib/utils';
import { registerToEvent, unregisterFromEvent } from '../lib/registrations';

export default function EventCard({ event: e, registered, compact }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const cat = catById(e.category);
  const left = e.capacity ? e.capacity - (e.registeredCount || 0) : null;
  const full = left !== null && left <= 0;
  const past = e.start && e.start.toDate() < new Date();

  const toggle = async () => {
    setBusy(true); setErr('');
    try { registered ? await unregisterFromEvent(e.id, user) : await registerToEvent(e.id, user); }
    catch (x) { setErr(x.message); }
    setBusy(false);
  };

  return (
    <article className="card flex flex-col overflow-hidden">
      {e.image && <img src={e.image} alt="" className="h-44 w-full object-cover" loading="lazy" />}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge text-white" style={{ background: cat.color }}>{cat.name}</span>
          {isNew(e.createdAt) && <span className="badge bg-accent text-white">Nouveau</span>}
        </div>
        <h3 className="text-xl font-bold">{e.title}</h3>
        <p className="text-sm font-semibold capitalize text-accent">{fmtDate(e.start)} · {fmtTime(e.start)}{e.end ? `–${fmtTime(e.end)}` : ''}</p>
        {e.location && <p className="flex items-center gap-1 text-sm text-muted"><MapPin className="h-4 w-4" />{e.location}</p>}
        {!compact && e.description && <p className="text-sm text-muted">{e.description}</p>}
        {left !== null && <p className="flex items-center gap-1 text-sm"><Users className="h-4 w-4" />{full ? 'Complet' : `${left} place${left > 1 ? 's' : ''} restante${left > 1 ? 's' : ''}`}</p>}

        {!compact && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {!past && (user
              ? <button onClick={toggle} disabled={busy || (full && !registered)} className={`btn ${registered ? 'btn-ghost' : 'btn-primary'}`}>
                  {registered ? 'Se désinscrire' : full ? 'Complet' : 'Je m’inscris'}
                </button>
              : <Link to="/connexion" className="btn btn-primary">Connecte-toi pour t’inscrire</Link>)}
            {e.start && <a href={gcalLink(e)} target="_blank" rel="noreferrer" className="btn btn-ghost"><CalendarPlus className="h-4 w-4" />Google Agenda</a>}
          </div>
        )}
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      </div>
    </article>
  );
}
