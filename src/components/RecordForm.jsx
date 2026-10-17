import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { storage } from '../firebase';
import { toLocalInput } from '../lib/utils';

// Formulaire générique piloté par une liste de champs
// field: { key, label, type: text|textarea|select|datetime|date|number|image|checkbox, options?, required? }
export default function RecordForm({ fields, initial = {}, onSave, onCancel }) {
  const [v, setV] = useState(() => {
    const o = {};
    fields.forEach((f) => { const x = initial[f.key]; o[f.key] = f.type === 'datetime' ? toLocalInput(x) : x ?? (f.type === 'checkbox' ? false : ''); });
    return o;
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }));

  const upload = async (k, file) => {
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const r = ref(storage, `uploads/${Date.now()}_${file.name.replace(/[^\w.-]/g, '_')}`);
      await uploadBytes(r, file);
      set(k, await getDownloadURL(r));
    } catch { setErr('Envoi de l’image impossible (5 Mo max, image uniquement).'); }
    setBusy(false);
  };

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    const out = {};
    fields.forEach((f) => {
      const x = v[f.key];
      out[f.key] = f.type === 'datetime' ? (x ? Timestamp.fromDate(new Date(x)) : null)
        : f.type === 'number' ? (x === '' ? null : Number(x)) : x;
    });
    try { await onSave(out); } catch (x) { setErr(x.message || 'Erreur'); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          {f.type !== 'checkbox' && <label htmlFor={f.key} className="label">{f.label}{f.required && ' *'}</label>}
          {f.type === 'textarea' ? <textarea id={f.key} className="input" rows={4} required={f.required} value={v[f.key]} onChange={(e) => set(f.key, e.target.value)} />
          : f.type === 'select' ? (
            <select id={f.key} className="input" required={f.required} value={v[f.key]} onChange={(e) => set(f.key, e.target.value)}>
              <option value="">— Choisir —</option>
              {f.options.map((o) => <option key={o.id ?? o} value={o.id ?? o}>{o.name ?? o}</option>)}
            </select>)
          : f.type === 'image' ? (
            <div className="space-y-2">
              {v[f.key] && <img src={v[f.key]} alt="" className="h-24 rounded-lg object-cover" />}
              <input id={f.key} type="file" accept="image/*" onChange={(e) => upload(f.key, e.target.files[0])} className="text-sm" />
            </div>)
          : f.type === 'checkbox' ? (
            <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={v[f.key]} onChange={(e) => set(f.key, e.target.checked)} />{f.label}</label>)
          : <input id={f.key} className="input" type={f.type === 'datetime' ? 'datetime-local' : f.type} required={f.required} value={v[f.key]} onChange={(e) => set(f.key, e.target.value)} />}
        </div>
      ))}
      {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Patiente…' : 'Enregistrer'}</button>
      </div>
    </form>
  );
}
