import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { db } from '../../firebase';
import { useQ } from '../../lib/hooks';
import RecordForm from '../../components/RecordForm';
import Modal from '../../components/Modal';

// Liste + création / modification / suppression d'une collection
export default function CrudPanel({ col, title, fields, defaults = {}, row, readOnly = false }) {
  const { data } = useQ(() => query(collection(db, col), orderBy('createdAt', 'desc')), [col]);
  const [edit, setEdit] = useState(null); // null | {} (nouveau) | doc

  const save = async (values) => {
    if (edit.id) await updateDoc(doc(db, col, edit.id), { ...values, updatedAt: serverTimestamp() });
    else await addDoc(collection(db, col), { ...defaults, ...values, createdAt: serverTimestamp() });
    setEdit(null);
  };
  const remove = (d) => confirm('Supprimer définitivement ?') && deleteDoc(doc(db, col, d.id));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title} <span className="text-base text-muted">({data.length})</span></h2>
        {!readOnly && <button className="btn btn-primary" onClick={() => setEdit({})}><Plus className="h-4 w-4" />Ajouter</button>}
      </div>
      <ul className="space-y-2">
        {data.length === 0 && <li className="text-muted">Rien pour l’instant.</li>}
        {data.map((d) => (
          <li key={d.id} className="card flex items-center justify-between gap-3 p-3">
            <div className="min-w-0 flex-1">{row(d)}</div>
            {!readOnly && <button className="btn btn-ghost !p-2" onClick={() => setEdit(d)} aria-label="Modifier"><Pencil className="h-4 w-4" /></button>}
            <button className="btn btn-ghost !p-2 text-red-600" onClick={() => remove(d)} aria-label="Supprimer"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
      {edit && <Modal title={edit.id ? 'Modifier' : 'Ajouter'} onClose={() => setEdit(null)}><RecordForm fields={fields} initial={edit} onSave={save} onCancel={() => setEdit(null)} /></Modal>}
    </div>
  );
}
