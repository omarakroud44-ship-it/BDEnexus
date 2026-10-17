import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export async function registerToEvent(eventId, user) {
  await runTransaction(db, async (tx) => {
    const eRef = doc(db, 'events', eventId);
    const rRef = doc(db, 'registrations', `${eventId}_${user.uid}`);
    const [e, r] = await Promise.all([tx.get(eRef), tx.get(rRef)]);
    if (!e.exists()) throw new Error('Événement introuvable.');
    if (r.exists()) return;
    const { capacity, registeredCount = 0 } = e.data();
    if (capacity && registeredCount >= capacity) throw new Error('Cet événement est complet.');
    tx.set(rRef, { eventId, userId: user.uid, userName: user.displayName || '', email: user.email, createdAt: serverTimestamp() });
    tx.update(eRef, { registeredCount: registeredCount + 1 });
  });
}

export async function unregisterFromEvent(eventId, user) {
  await runTransaction(db, async (tx) => {
    const eRef = doc(db, 'events', eventId);
    const rRef = doc(db, 'registrations', `${eventId}_${user.uid}`);
    const [e, r] = await Promise.all([tx.get(eRef), tx.get(rRef)]);
    if (!r.exists()) return;
    tx.delete(rRef);
    if (e.exists()) tx.update(eRef, { registeredCount: Math.max(0, (e.data().registeredCount || 0) - 1) });
  });
}
