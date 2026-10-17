import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toDate, catById } from '../lib/utils';

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function Calendar({ events, onDay, onEvent }) {
  const [view, setView] = useState('month');
  const [cursor, setCursor] = useState(new Date());

  const days = useMemo(() => {
    const s = new Date(cursor);
    if (view === 'week') s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
    else { s.setDate(1); s.setDate(1 - ((s.getDay() + 6) % 7)); }
    return Array.from({ length: view === 'week' ? 7 : 42 }, (_, i) => { const d = new Date(s); d.setDate(s.getDate() + i); return d; });
  }, [view, cursor]);

  const move = (n) => {
    const c = new Date(cursor);
    if (view === 'week') c.setDate(c.getDate() + 7 * n);
    else { c.setDate(1); c.setMonth(c.getMonth() + n); }
    setCursor(c);
  };
  const eventsOf = (d) => events.filter((e) => toDate(e.start)?.toDateString() === d.toDateString())
    .sort((a, b) => toDate(a.start) - toDate(b.start));

  return (
    <div className="card p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost !p-2" onClick={() => move(-1)} aria-label="Précédent"><ChevronLeft className="h-4 w-4" /></button>
          <h3 className="min-w-40 text-center text-lg font-bold capitalize">{cursor.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h3>
          <button className="btn btn-ghost !p-2" onClick={() => move(1)} aria-label="Suivant"><ChevronRight className="h-4 w-4" /></button>
          <button className="btn btn-ghost !py-1.5 text-sm" onClick={() => setCursor(new Date())}>Aujourd’hui</button>
        </div>
        <div className="flex rounded-xl border border-line p-0.5 text-sm font-semibold">
          {[['month', 'Mois'], ['week', 'Semaine']].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} className={`rounded-lg px-3 py-1 ${view === v ? 'bg-primary text-onp' : 'text-muted'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-line bg-line">
        {DAYS.map((d) => <div key={d} className="bg-card py-1 text-center text-xs font-semibold text-muted">{d}</div>)}
        {days.map((d) => {
          const out = view === 'month' && d.getMonth() !== cursor.getMonth();
          const today = d.toDateString() === new Date().toDateString();
          return (
            <div key={d.toISOString()} role={onDay ? 'button' : undefined} tabIndex={onDay ? 0 : undefined}
              onClick={() => onDay?.(d)} onKeyDown={(e) => e.key === 'Enter' && onDay?.(d)}
              className={`bg-card p-1 text-left ${view === 'week' ? 'min-h-56' : 'min-h-16 sm:min-h-24'} ${out ? 'opacity-40' : ''} ${onDay ? 'cursor-pointer hover:bg-primary/5' : ''}`}>
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${today ? 'bg-accent text-white' : ''}`}>{d.getDate()}</span>
              <div className="mt-1 space-y-1">
                {eventsOf(d).map((e) => (
                  <button key={e.id} onClick={(ev) => { ev.stopPropagation(); onEvent?.(e); }}
                    className="block w-full truncate rounded px-1 py-0.5 text-left text-[11px] font-semibold text-white sm:text-xs"
                    style={{ background: catById(e.category).color }} title={e.title}>{e.title}</button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
