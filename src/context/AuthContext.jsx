import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

const DOMAIN = (import.meta.env.VITE_ALLOWED_DOMAIN || '').toLowerCase().replace(/^@/, '');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) { setUser(null); setIsAdmin(false); setLoading(false); return; }
      const email = (u.email || '').toLowerCase();
      if (DOMAIN && !email.endsWith('@' + DOMAIN)) {
        setError(`Connexion réservée aux adresses @${DOMAIN}.`);
        await signOut(auth);
        return;
      }
      try {
        // Profil créé à la première connexion
        const ref = doc(db, 'users', u.uid);
        if (!(await getDoc(ref)).exists()) {
          await setDoc(ref, {
            name: u.displayName || '', email, photo: u.photoURL || '',
            role: 'etudiant', createdAt: serverTimestamp(),
          });
        }
        // Modérateur = email présent dans la collection "admins" (id = email en minuscules)
        const adminSnap = await getDoc(doc(db, 'admins', email));
        setIsAdmin(adminSnap.exists());
      } catch (e) {
        console.error(e);
      }
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async () => {
    setError('');
    try { await signInWithPopup(auth, googleProvider); }
    catch (e) { if (e.code !== 'auth/popup-closed-by-user') setError('Connexion impossible. Réessaie.'); }
  };
  const logout = () => signOut(auth);

  return <Ctx.Provider value={{ user, isAdmin, loading, error, login, logout }}>{children}</Ctx.Provider>;
}
