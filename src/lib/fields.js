import { CATEGORIES } from './utils';
import { POLES } from './poles';

export const EVENT_FIELDS = [
  { key: 'title', label: 'Titre', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'start', label: 'Début', type: 'datetime', required: true },
  { key: 'end', label: 'Fin', type: 'datetime' },
  { key: 'location', label: 'Lieu', type: 'text' },
  { key: 'category', label: 'Catégorie', type: 'select', options: CATEGORIES, required: true },
  { key: 'capacity', label: 'Nombre de places (vide = illimité)', type: 'number' },
  { key: 'image', label: 'Affiche / image', type: 'image' },
];
export const NEWS_FIELDS = [
  { key: 'title', label: 'Titre', type: 'text', required: true },
  { key: 'text', label: 'Texte', type: 'textarea', required: true },
  { key: 'image', label: 'Image', type: 'image' },
];
export const DISCOUNT_FIELDS = [
  { key: 'partner', label: 'Nom du partenaire', type: 'text', required: true },
  { key: 'logo', label: 'Logo', type: 'image' },
  { key: 'description', label: 'Réduction (ex. -15 % sur tout)', type: 'text', required: true },
  { key: 'code', label: 'Code promo (optionnel)', type: 'text' },
  { key: 'validUntil', label: 'Valable jusqu’au', type: 'date' },
];
export const MEMBER_FIELDS = [
  { key: 'name', label: 'Nom', type: 'text', required: true },
  { key: 'photo', label: 'Photo', type: 'image' },
  { key: 'pole', label: 'Pôle', type: 'select', options: POLES, required: true },
  { key: 'role', label: 'Rôle', type: 'select', options: ['Responsable', 'Membre'], required: true },
];
