import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useQ } from '../../lib/hooks';
import { EVENT_FIELDS } from '../../lib/fields';
import { fmtDate, fmtTime } from '../../lib/utils';
import Calendar from '../../components/Calendar';
import RecordForm from '../../components/RecordForm';
import Modal from '../../components/Modal';

export default function EventsAdmin() {
  const { data } = useQ(() => query(collection(db, 'events'), orderBy('start', 'asc')), []);
  const [edit, setEdit] = useState(null);

  const save = async (values) => {
    if (edit.id) await updateDoc(doc(db, 'events', edit.id), { ...values, updatedAt: serverTimestamp() });
    else await addDoc(collection(db, 'events'), { ...values, registeredCount: 0, createdAt: serverTimestamp() });
    setEdit(null);
  };
  const remove = async () => { if (confirm('Supprimer cet événement ?')) { await deleteDoc(doc(db, 'events', edit.id)); setEdit(null); } };
  const newOn = (d) => { const s = new Date(d); s.setHours(18, 0, 0, 0); setEdit({ start: s }); };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-bold">Événements</h2>
      <p className="mb-4 text-sm text-muted">Clique sur un jour pour ajouter un événement, ou sur un événement pour le modifier.</p>
      <Calendar events={data} onDay={newOn} onEvent={setEdit} />
      <ul className="mt-5 space-y-2">
        {data.map((e) => (
          <li key={e.id}><button onClick={() => setEdit(e)} className="card w-full p-3 text-left hover:border-accent">
            <span className="font-semibold">{e.title}</span> <span className="text-sm text-muted">· {fmtDate(e.start)} {fmtTime(e.start)} · {e.registeredCount || 0} inscrit(s)</span>
          </button></li>
        ))}
      </ul>
      {edit && (
        <Modal title={edit.id ? 'Modifier l’événement' : 'Nouvel événement'} onClose={() => setEdit(null)}>
          <RecordForm fields={EVENT_FIELDS} initial={edit} onSave={save} onCancel={() => setEdit(null)} />
          {edit.id && <button onClick={remove} className="btn btn-danger mt-3 w-full">Supprimer l’événement</button>}
        </Modal>
      )}
    </div>
  );
}
