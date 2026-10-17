import { useState } from 'react';
import { collection } from 'firebase/firestore';
import { BarChart3, CalendarDays, Newspaper, Tag, Users, ClipboardCheck, Lightbulb } from 'lucide-react';
import { db } from '../../firebase';
import { useQ } from '../../lib/hooks';
import { DISCOUNT_FIELDS, MEMBER_FIELDS, NEWS_FIELDS } from '../../lib/fields';
import { fmtDate, fmtTime } from '../../lib/utils';
import { poleById } from '../../lib/poles';
import CrudPanel from './CrudPanel';
import EventsAdmin from './EventsAdmin';
import ApplicationsAdmin from './ApplicationsAdmin';

function Stats() {
  const users = useQ(() => collection(db, 'users'), []);
  const apps = useQ(() => collection(db, 'applications'), []);
  const events = useQ(() => collection(db, 'events'), []);
  const next = events.data.filter((e) => e.start?.toDate() >= new Date()).sort((a, b) => a.start.toDate() - b.start.toDate()).slice(0, 5);
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Statistiques</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Étudiants inscrits', users.data.length], ['Candidatures', apps.data.length], ['Événements', events.data.length]].map(([l, n]) => (
          <div key={l} className="card p-5"><p className="font-display text-4xl font-extrabold text-accent">{n}</p><p className="text-sm text-muted">{l}</p></div>
        ))}
      </div>
      <h3 className="mb-2 mt-8 text-xl font-bold">Prochains événements</h3>
      <ul className="space-y-2">
        {next.length === 0 && <li className="text-muted">Aucun événement à venir.</li>}
        {next.map((e) => <li key={e.id} className="card p-3"><span className="font-semibold">{e.title}</span> <span className="text-sm text-muted">· {fmtDate(e.start)} {fmtTime(e.start)} · {e.registeredCount || 0}{e.capacity ? `/${e.capacity}` : ''} inscrit(s)</span></li>)}
      </ul>
    </div>
  );
}

const Row = ({ title, sub }) => <><p className="truncate font-semibold">{title}</p>{sub && <p className="truncate text-sm text-muted">{sub}</p>}</>;

const TABS = [
  ['stats', 'Stats', BarChart3, () => <Stats />],
  ['events', 'Événements', CalendarDays, () => <EventsAdmin />],
  ['news', 'News', Newspaper, () => <CrudPanel col="news" title="News" fields={NEWS_FIELDS} row={(d) => <Row title={d.title} sub={d.text} />} />],
  ['discounts', 'Discounts', Tag, () => <CrudPanel col="discounts" title="Discounts & partenariats" fields={DISCOUNT_FIELDS} row={(d) => <Row title={d.partner} sub={d.description} />} />],
  ['members', 'Membres', Users, () => <CrudPanel col="members" title="Membres du BDE" fields={MEMBER_FIELDS} row={(d) => <Row title={d.name} sub={`${poleById(d.pole)?.name || ''} · ${d.role}`} />} />],
  ['apps', 'Candidatures', ClipboardCheck, () => <ApplicationsAdmin />],
  ['ideas', 'Idées', Lightbulb, () => <CrudPanel col="ideas" readOnly title="Boîte à idées" row={(d) => <Row title={d.title} sub={`${d.userName} : ${d.text}`} />} />],
];

export default function Dashboard() {
  const [tab, setTab] = useState('stats');
  const Current = TABS.find((t) => t[0] === tab)[3];
  return (
    <div>
      <h1 className="mb-5 text-4xl font-extrabold">Espace modérateur</h1>
      <div className="mb-6 flex gap-1 overflow-x-auto pb-1" role="tablist">
        {TABS.map(([id, label, Icon]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 font-semibold ${tab === id ? 'bg-primary text-onp' : 'btn-ghost border border-line'}`}>
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>
      <Current />
    </div>
  );
}
