import { forwardRef } from 'react';
import { POLES } from '../lib/poles';

// Affiche des membres par pôle (exportable en PNG)
const Poster = forwardRef(function Poster({ members }, ref) {
  return (
    <div ref={ref} className="rounded-3xl p-5 sm:p-8" style={{ background: 'linear-gradient(160deg,#0e1450,#1a2468 55%,#1f5fa8)', color: '#fff' }}>
      <div className="mb-6 flex items-center gap-4">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="h-16 w-16 rounded-full bg-white sm:h-20 sm:w-20" />
        <div>
          <h2 className="font-display text-3xl font-extrabold sm:text-5xl">Le bureau NEXUS</h2>
          <p className="text-sm opacity-80 sm:text-base">Bureau des Étudiants · Notre équipe</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POLES.map((p) => {
          const list = members.filter((m) => m.pole === p.id).sort((a, b) => (b.role === 'Responsable') - (a.role === 'Responsable'));
          return (
            <section key={p.id} className="overflow-hidden rounded-2xl bg-white/10">
              <header className="flex items-center gap-2 px-4 py-3 font-display text-lg font-bold" style={{ background: p.color }}>
                <p.icon className="h-5 w-5" /> {p.name}
              </header>
              <ul className="space-y-2 p-3">
                {list.length === 0 && <li className="px-1 text-sm opacity-60">Bientôt de nouveaux visages</li>}
                {list.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    {m.photo
                      ? <img src={m.photo} alt="" crossOrigin="anonymous" className="h-11 w-11 rounded-full object-cover" style={{ border: `2px solid ${p.color}` }} />
                      : <span className="flex h-11 w-11 items-center justify-center rounded-full font-bold" style={{ background: p.color }}>{m.name?.[0]}</span>}
                    <div className="leading-tight">
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-xs opacity-75">{m.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
});
export default Poster;
