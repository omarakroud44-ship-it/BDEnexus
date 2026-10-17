import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login, error } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (user) nav('/', { replace: true }); }, [user, nav]);
  const domain = import.meta.env.VITE_ALLOWED_DOMAIN;
  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="mx-auto h-28 w-28 rounded-full bg-white" />
      <h1 className="mt-6 text-3xl font-extrabold">Rejoins l’espace NEXUS</h1>
      <p className="mt-2 text-muted">Connecte-toi avec Google pour t’inscrire aux événements, retrouver tes discounts et postuler au BDE.{domain && ` Réservé aux adresses @${domain}.`}</p>
      <button onClick={login} className="btn btn-primary mt-6 w-full">Se connecter avec Google</button>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
