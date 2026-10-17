import { useState } from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { Copy, Check } from 'lucide-react';
import { db } from '../firebase';
import { useQ } from '../lib/hooks';
import { fmtDate } from '../lib/utils';

export default function Discounts() {
  const { data, loading } = useQ(() => query(collection(db, 'discounts'), orderBy('createdAt', 'desc')), []);
  const [copied, setCopied] = useState('');
  const today = new Date().toISOString().slice(0, 10);
  const valid = data.filter((d) => !d.validUntil || d.validUntil >= today);

  const copy = (id, code) => { navigator.clipboard.writeText(code); setCopied(id); setTimeout(() => setCopied(''), 1500); };

  return (
    <div>
      <h1 className="text-4xl font-extrabold">Mes discounts</h1>
      <p className="mt-2 text-muted">Les bons plans négociés par le pôle Partenariats, réservés aux étudiants connectés.</p>
      {loading ? <p className="mt-6 text-muted">Chargement…</p> : valid.length === 0
        ? <p className="mt-6 text-muted">Aucun bon plan disponible pour le moment.</p>
        : <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {valid.map((d) => (
            <article key={d.id} className="card flex flex-col gap-2 p-5">
              <div className="flex items-center gap-3">
                {d.logo && <img src={d.logo} alt="" className="h-12 w-12 rounded-lg bg-white object-contain" />}
                <h2 className="text-xl font-bold">{d.partner}</h2>
              </div>
              <p className="text-lg font-semibold text-accent">{d.description}</p>
              {d.validUntil && <p className="text-xs text-muted">Valable jusqu’au {fmtDate(d.validUntil, { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
              {d.code && (
                <button onClick={() => copy(d.id, d.code)} className="btn btn-ghost mt-auto justify-between font-mono">
                  {d.code} {copied === d.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </article>
          ))}
        </div>}
    </div>
  );
}
