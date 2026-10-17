import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Écoute temps réel d'une requête Firestore
export function useQ(build, deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(build(),
      (s) => { setData(s.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); },
      (e) => { console.error(e); setLoading(false); });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, loading };
}

// Écoute temps réel d'un document (data = null s'il n'existe pas)
export function useDocSnap(col, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, col, id),
      (s) => { setData(s.exists() ? { id: s.id, ...s.data() } : null); setLoading(false); },
      () => setLoading(false));
    return unsub;
  }, [col, id]);
  return { data, loading };
}
