# NEXUS – site du Bureau des Étudiants

React + Vite + Tailwind + Firebase (Auth Google, Firestore, Storage, Hosting).

## Arborescence
```
nexus-bde/
├─ public/logo.png            Logo NEXUS
├─ firestore.rules            Règles Firestore
├─ storage.rules              Règles Storage (upload réservé aux modérateurs)
├─ firebase.json  cors.json  .env.example
└─ src/
   ├─ main.jsx  App.jsx  firebase.js  index.css
   ├─ context/AuthContext.jsx   Connexion Google, profil, rôle modérateur
   ├─ lib/                      hooks temps réel, pôles, champs de formulaires, utilitaires
   ├─ components/               Navbar, Footer, Calendar, EventCard, Poster, RecordForm, Modal, ProtectedRoute
   └─ pages/
      ├─ Home, Login, Events, Team, Discounts, Apply, MyRegistrations, Ideas
      └─ admin/ Dashboard, EventsAdmin, ApplicationsAdmin, CrudPanel
```

## Installation
1. `npm install`
2. Console Firebase (console.firebase.google.com) → **Ajouter un projet**.
3. **Build → Authentication → Sign-in method** : activer **Google**.
4. **Build → Firestore Database** : créer la base (mode production).
5. **Build → Storage** : activer (nécessite le plan Blaze selon la région ; l'usage reste gratuit à petite échelle).
6. **Paramètres du projet → Vos applications → Web (</>)** : copier la config.
7. `cp .env.example .env` puis remplir les variables `VITE_FIREBASE_*`, `VITE_ALLOWED_DOMAIN` (ex. `univ-exemple.fr`, vide = tous), `VITE_CONTACT_EMAIL`, `VITE_INSTAGRAM_URL`.
8. `npm run dev` → http://localhost:5173

## Premier modérateur
Console Firestore → **Démarrer une collection** `admins` → ID du document = **ton email en minuscules** (ex. `prenom.nom@gmail.com`), un champ `name` (texte) quelconque. Reconnecte-toi : l'onglet **Admin** apparaît. Pour ajouter / retirer un modérateur : ajouter / supprimer un document dans `admins`.

## Règles de sécurité et déploiement
```
npm i -g firebase-tools
firebase login
firebase init        # choisir ton projet ; garder firebase.json existant (ne pas écraser)
firebase deploy --only firestore:rules,storage
npm run build
firebase deploy --only hosting
```
- Domaine de la fac côté base : dans `firestore.rules`, remplacer `domainOk()` par `return email().matches('.*@univ-exemple[.]fr');`
- Authentication → Settings → **Authorized domains** : ajouter ton domaine Hosting si besoin.
- Export PNG de l'affiche : `gsutil cors set cors.json gs://TON_BUCKET` (sinon les photos bloquent l'export).

## Schéma Firestore
| Collection | ID | Champs |
|---|---|---|
| users | uid | name, email, photo, role, createdAt |
| admins | email (minuscules) | name |
| events | auto | title, description, start, end, location, category, capacity, image, registeredCount, createdAt |
| registrations | `eventId_uid` | eventId, userId, userName, email, createdAt |
| discounts | auto | partner, logo, description, code, validUntil, createdAt |
| news | auto | title, text, image, createdAt |
| members | auto | name, photo, pole, role (Responsable/Membre), createdAt |
| applications | `periodId_uid` | name, email, phone, filiere, annee, poles[], motivation, experiences, dispo, link, status, periodId, userId, createdAt |
| settings | `applications` | open (bool), periodId, nextOpening |
| ideas | auto | title, text, userId, userName, createdAt |

Candidatures : l'ID `periodId_uid` + les règles garantissent **une seule candidature par période** ; `periodId` change à chaque réouverture.

## Pistes d'amélioration
Billetterie avec QR code, points de fidélité, newsletter, boutique de merch, email de confirmation (extension *Trigger Email* ou EmailJS), notifications push, export PDF de l'affiche, galerie photos des événements, sondages.

## Publier sur GitHub Pages (gratuit)
1. Envoie le projet sur GitHub (branche `main`). Le fichier `.env` n'est pas envoyé.
2. Dépôt → Settings → Pages → Source : **GitHub Actions**.
3. Dépôt → Settings → Secrets and variables → Actions → crée un secret par variable du `.env` (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.). Les valeurs vides sont acceptées pour `VITE_ALLOWED_DOMAIN`, `VITE_CONTACT_EMAIL`, `VITE_INSTAGRAM_URL`.
4. Chaque envoi sur `main` redéploie le site à `https://TON-PSEUDO.github.io/NOM-DU-DEPOT/#/`.
5. Firebase → Authentication → Settings → Authorized domains : ajoute `TON-PSEUDO.github.io`.
Les adresses contiennent `#/` (HashRouter) pour éviter les erreurs 404 au rechargement.
