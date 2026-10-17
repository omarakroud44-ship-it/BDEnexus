import { Mail, Instagram } from 'lucide-react';

export default function Footer() {
  const mail = import.meta.env.VITE_CONTACT_EMAIL;
  const insta = import.meta.env.VITE_INSTAGRAM_URL;
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="h-10 w-10 rounded-full bg-white" />
          <p className="text-sm text-muted">NEXUS – Bureau des Étudiants</p>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          {mail && <a href={`mailto:${mail}`} className="flex items-center gap-1 hover:text-accent"><Mail className="h-4 w-4" />{mail}</a>}
          {insta && <a href={insta} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-accent"><Instagram className="h-4 w-4" />Instagram</a>}
        </div>
      </div>
    </footer>
  );
}
