import { useRef, useState } from 'react';
import { collection } from 'firebase/firestore';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { db } from '../firebase';
import { useQ } from '../lib/hooks';
import Poster from '../components/Poster';

export default function Team() {
  const { data: members } = useQ(() => collection(db, 'members'), []);
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a'); a.href = url; a.download = 'affiche-equipe-nexus.png'; a.click();
    } catch (e) { alert('Export impossible (vérifie la configuration CORS du Storage, voir README).'); }
    setBusy(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-extrabold">Notre équipe</h1>
        <button onClick={download} disabled={busy} className="btn btn-primary"><Download className="h-4 w-4" />{busy ? 'Export…' : 'Télécharger l’affiche'}</button>
      </div>
      <Poster ref={ref} members={members} />
    </div>
  );
}
