import { Megaphone, Lightbulb, Handshake, HeartHandshake, PartyPopper, GraduationCap, ClipboardList } from 'lucide-react';

export const POLES = [
  { id: 'communication', name: 'Communication', color: '#e11d74', icon: Megaphone },
  { id: 'innovation', name: 'Innovation & Projet', color: '#7c3aed', icon: Lightbulb },
  { id: 'partenariats', name: 'Partenariats & Sponsoring', color: '#f59e0b', icon: Handshake },
  { id: 'solidaire', name: 'Activité solidaire', color: '#16a34a', icon: HeartHandshake },
  { id: 'evenementiel', name: 'Événementiel', color: '#ef4444', icon: PartyPopper },
  { id: 'culturel', name: 'Culturel & Académique', color: '#0ea5e9', icon: GraduationCap },
  { id: 'logistique', name: 'Logistique & Organisation', color: '#64748b', icon: ClipboardList },
];
export const poleById = (id) => POLES.find((p) => p.id === id);
