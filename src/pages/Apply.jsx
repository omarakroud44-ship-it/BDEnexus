import { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useDocSnap } from '../lib/hooks';
import { POLES, poleById } from '../lib/poles';
import { STATUS, fmtDate } from '../lib/utils';

const Field = ({ id, label, children }) => <div><label htmlFor={id} className="label">{label}</label>{children}</div>;

export default function Apply() {
  const { user, loading: authLoading } = useAuth();
  const settings = useDocSnap('settings', 'applications');
  const appId = user && settings.data?.periodId ? `${settings.data.periodId}_${user.uid}` : null;
  const mine = useDocSnap('applications', appId || '_none_');
  const [f, setF] = useState({ name: user?.displayName || '', filiere: '', annee: '', phone: '', poles: [], motivation: '', experiences: '', dispo: '', link: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  if (authLoading || settings.loading) return <p className="text-muted">Chargement…</p>;
  const open = settings.data?.open === true;

  if (!open) return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <h1 className="text-3xl font-extrabold">Les candidatures sont actuellement fermées</h1>
      {settings.data?.nextOpening && <p className="mt-3 text-muted">Prochaine ouverture : {fmtDate(settings.data.nextOpening, { day: 'numeric', month: 'long', year: 'numeric' })}.</p>}
    </div>
  );
  if (!user) return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <h1 className="text-3xl font-extrabold">Rejoindre le BDE</h1>
      <p className="mt-3 text-muted">Les candidatures sont ouvertes. Connecte-toi avec Google pour postuler.</p>
      <Link to="/connexion" className="btn btn-primary mt-5">Se connecter</Link>
    </div>
  );
  if (mine.data) {
    const s = STATUS[mine.data.status] || STATUS.en_attente;
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <h1 className="text-3xl font-extrabold">Ta candidature est bien reçue</h1>
        <p className="mt-4">Statut : <span className={`badge ${s.cls}`}>{s.label}</span></p>
        <p className="mt-3 text-muted">Pôles souhaités : {mine.data.poles?.map((p) => poleById(p)?.name).join(', ')}</p>
      </div>
    );
  }

  const togglePole = (id) => set('poles', f.poles.includes(id) ? f.poles.filter((p) => p !== id) : f.poles.length < 2 ? [...f.poles, id] : f.poles);

  const submit = async (e) => {
    e.preventDefault();
    if (f.poles.length === 0) { setErr('Choisis au moins un pôle (2 maximum).'); return; }
    setBusy(true); setErr('');
    try {
      await setDoc(doc(db, 'applications', appId), {
        ...f, email: user.email, userId: user.uid, periodId: settings.data.periodId,
        status: 'en_attente', createdAt: serverTimestamp(),
      });
    } catch { setErr('Envoi impossible : les candidatures viennent peut-être de fermer.'); }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-4xl font-extrabold">Postuler au BDE</h1>
      <Field id="name" label="Nom et prénom"><input id="name" className="input" required value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
      <Field id="email" label="Email"><input id="email" className="input opacity-70" value={user.email} disabled /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="filiere" label="Filière"><input id="filiere" className="input" required value={f.filiere} onChange={(e) => set('filiere', e.target.value)} /></Field>
        <Field id="annee" label="Année d’étude"><input id="annee" className="input" required value={f.annee} onChange={(e) => set('annee', e.target.value)} /></Field>
      </div>
      <Field id="phone" label="Téléphone"><input id="phone" type="tel" className="input" required value={f.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
      <fieldset>
        <legend className="label">Pôle(s) souhaité(s) – 2 maximum</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {POLES.map((p) => (
            <label key={p.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border-2 p-3 font-semibold ${f.poles.includes(p.id) ? '' : 'border-line'}`} style={f.poles.includes(p.id) ? { borderColor: p.color } : {}}>
              <input type="checkbox" checked={f.poles.includes(p.id)} onChange={() => togglePole(p.id)} />
              <p.icon className="h-4 w-4" style={{ color: p.color }} />{p.name}
            </label>
          ))}
        </div>
      </fieldset>
      <Field id="motivation" label="Ta motivation"><textarea id="motivation" rows={5} className="input" required value={f.motivation} onChange={(e) => set('motivation', e.target.value)} /></Field>
      <Field id="exp" label="Expériences / compétences"><textarea id="exp" rows={3} className="input" value={f.experiences} onChange={(e) => set('experiences', e.target.value)} /></Field>
      <Field id="dispo" label="Disponibilités par semaine"><input id="dispo" className="input" required placeholder="ex. 4 h, surtout le mercredi" value={f.dispo} onChange={(e) => set('dispo', e.target.value)} /></Field>
      <Field id="link" label="Portfolio / LinkedIn (optionnel)"><input id="link" type="url" className="input" value={f.link} onChange={(e) => set('link', e.target.value)} /></Field>
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Envoi…' : 'Envoyer ma candidature'}</button>
    </form>
  );
}
