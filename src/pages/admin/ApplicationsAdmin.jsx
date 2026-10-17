import { useState } from 'react';
import { collection, doc, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { Download } from 'lucide-react';
import { db } from '../../firebase';
import { useDocSnap, useQ } from '../../lib/hooks';
import { POLES, poleById } from '../../lib/poles';
import { STATUS, fmtDate } from '../../lib/utils';

export default function ApplicationsAdmin() {
  const settings = useDocSnap('settings', 'applications');
  const { data } = useQ(() => query(collection(db, 'applications'), orderBy('createdAt', 'desc')), []);
  const [fp, setFp] = useState('');
  const [fs, setFs] = useState('');
  const open = settings.data?.open === true;
  const list = data.filter((a) => (!fp || a.poles?.includes(fp)) && (!fs || a.status === fs));

  // Une nouvelle période (periodId) est créée à chaque ouverture : chacun peut re-postuler.
  const toggle = () => setDoc(doc(db, 'settings', 'applications'),
    { open: !open, ...(open ? {} : { periodId: String(Date.now()) }) }, { merge: true });
  const setNext = (v) => setDoc(doc(db, 'settings', 'applications'), { nextOpening: v }, { merge: true });
  const setStatus = (a, status) => updateDoc(doc(db, 'applications', a.id), { status });

  const exportCsv = () => {
    const head = ['Nom', 'Email', 'Téléphone', 'Filière', 'Année', 'Pôles', 'Statut', 'Motivation', 'Expériences', 'Dispos', 'Lien'];
    const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const rows = list.map((a) => [a.name, a.email, a.phone, a.filiere, a.annee, a.poles?.map((p) => poleById(p)?.name).join(' / '), STATUS[a.status]?.label, a.motivation, a.experiences, a.dispo, a.link].map(q).join(','));
    const blob = new Blob(['\ufeff' + [head.map(q).join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'candidatures-nexus.csv'; a.click();
  };

  return (
    <div>
      <div className="card mb-5 flex flex-wrap items-center justify-between gap-4 p-4">
        <div>
          <p className="text-lg font-bold">Candidatures {open ? 'ouvertes' : 'fermées'}</p>
          <label className="mt-1 flex items-center gap-2 text-sm text-muted">Prochaine ouverture
            <input type="date" className="input !w-auto !py-1" defaultValue={settings.data?.nextOpening || ''} onBlur={(e) => setNext(e.target.value)} />
          </label>
        </div>
        <button onClick={toggle} className={`btn ${open ? 'btn-danger' : 'btn-primary'}`}>{open ? 'Fermer les candidatures' : 'Ouvrir les candidatures'}</button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select aria-label="Filtrer par pôle" className="input !w-auto" value={fp} onChange={(e) => setFp(e.target.value)}>
          <option value="">Tous les pôles</option>{POLES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select aria-label="Filtrer par statut" className="input !w-auto" value={fs} onChange={(e) => setFs(e.target.value)}>
          <option value="">Tous les statuts</option>{Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
        <button onClick={exportCsv} className="btn btn-ghost ml-auto"><Download className="h-4 w-4" />Export CSV</button>
      </div>

      <ul className="space-y-3">
        {list.length === 0 && <li className="text-muted">Aucune candidature.</li>}
        {list.map((a) => (
          <li key={a.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">{a.name} <span className="text-sm font-normal text-muted">· {a.filiere}, {a.annee}</span></p>
              <span className={`badge ${STATUS[a.status]?.cls}`}>{STATUS[a.status]?.label}</span>
            </div>
            <p className="text-sm text-muted">{a.email} · {a.phone} · {fmtDate(a.createdAt, { day: 'numeric', month: 'short' })}</p>
            <p className="mt-1 text-sm font-semibold">{a.poles?.map((p) => poleById(p)?.name).join(' · ')}</p>
            <p className="mt-2 whitespace-pre-line text-sm">{a.motivation}</p>
            {a.experiences && <p className="mt-1 text-sm text-muted">Compétences : {a.experiences}</p>}
            <p className="text-sm text-muted">Dispos : {a.dispo}{a.link && <> · <a className="text-accent underline" href={a.link} target="_blank" rel="noreferrer">Lien</a></>}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn btn-ghost !py-1.5" onClick={() => setStatus(a, 'acceptee')}>Accepter</button>
              <button className="btn btn-ghost !py-1.5" onClick={() => setStatus(a, 'en_attente')}>Mettre en attente</button>
              <button className="btn btn-ghost !py-1.5" onClick={() => setStatus(a, 'refusee')}>Refuser</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
