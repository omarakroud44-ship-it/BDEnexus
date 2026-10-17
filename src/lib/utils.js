export const CATEGORIES = [
  { id: 'soiree', name: 'Soirée', color: '#e11d74' },
  { id: 'sortie', name: 'Sortie', color: '#f59e0b' },
  { id: 'tournoi', name: 'Tournoi', color: '#ef4444' },
  { id: 'solidaire', name: 'Solidaire', color: '#16a34a' },
  { id: 'academique', name: 'Académique', color: '#0ea5e9' },
  { id: 'culturel', name: 'Culturel', color: '#7c3aed' },
  { id: 'autre', name: 'Autre', color: '#64748b' },
];
export const catById = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const toDate = (v) => (v?.toDate ? v.toDate() : v ? new Date(v) : null);
export const fmtDate = (v, o = { weekday: 'long', day: 'numeric', month: 'long' }) => toDate(v)?.toLocaleDateString('fr-FR', o) ?? '';
export const fmtTime = (v) => toDate(v)?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) ?? '';
export const isNew = (ts, days = 7) => { const d = toDate(ts); return !!d && Date.now() - d.getTime() < days * 864e5; };

export const toLocalInput = (v) => {
  const d = toDate(v); if (!d) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const gcalLink = (e) => {
  const f = (d) => toDate(d).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const end = e.end || new Date(toDate(e.start).getTime() + 2 * 3600e3);
  const p = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates: `${f(e.start)}/${f(end)}`, details: e.description || '', location: e.location || '' });
  return `https://calendar.google.com/calendar/render?${p}`;
};

export const STATUS = {
  en_attente: { label: 'En attente', cls: 'bg-amber-100 text-amber-800' },
  acceptee: { label: 'Acceptée', cls: 'bg-green-100 text-green-800' },
  refusee: { label: 'Refusée', cls: 'bg-red-100 text-red-800' },
};
