import { useState } from 'react';
import { addDoc, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useQ } from '../lib/hooks';
import { fmtDate } from '../lib/utils';

export default function Ideas() {
  const { user } = useAuth();
  const mine = useQ(() => query(collection(db, 'ideas'), where('userId', '==', user.uid)), [user.uid]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);

  const send = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'ideas'), { title, text, userId: user.uid, userName: user.displayName || '', createdAt: serverTimestamp() });
    setTitle(''); setText(''); setDone(true); setTimeout(() => setDone(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-4xl font-extrabold">Boîte à idées</h1>
      <p className="mt-2 text-muted">Une idée de soirée, de sortie ou une suggestion pour le BDE ? Dis-nous tout.</p>
      <form onSubmit={send} className="card mt-6 space-y-4 p-5">
        <div><label htmlFor="t" className="label">Ton idée en une phrase</label><input id="t" className="input" required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><label htmlFor="d" className="label">Détails</label><textarea id="d" className="input" rows={4} required value={text} onChange={(e) => setText(e.target.value)} /></div>
        <button className="btn btn-primary">Envoyer l’idée</button>
        {done && <p role="status" className="text-sm text-green-600">Idée envoyée, merci !</p>}
      </form>
      {mine.data.length > 0 && <>
        <h2 className="mb-3 mt-8 text-2xl font-bold">Mes idées envoyées</h2>
        <ul className="space-y-2">{mine.data.map((i) => <li key={i.id} className="card p-4"><p className="font-semibold">{i.title}</p><p className="text-sm text-muted">{i.text}</p><p className="mt-1 text-xs text-muted">{fmtDate(i.createdAt, { day: 'numeric', month: 'long' })}</p></li>)}</ul>
      </>}
    </div>
  );
}
