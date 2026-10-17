import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// base './' : le site fonctionne à la racine comme dans un sous-dossier (GitHub Pages)
export default defineConfig({ base: './', plugins: [react()], server: { host: true, allowedHosts: true } });
