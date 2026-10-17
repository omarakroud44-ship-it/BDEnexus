import { X } from 'lucide-react';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="card max-h-[92vh] w-full max-w-xl overflow-y-auto p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="btn btn-ghost !p-2" aria-label="Fermer"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
