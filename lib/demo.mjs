import { findProduct } from './catalogue.mjs';
export const asset = path => `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
/** Attente pédagogique côté navigateur : aucun serveur métier ni vraie commande. */
export function loadProduct(id, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const abort = () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort);
      const product = findProduct(id);
      product ? resolve(product) : reject(new Error('Produit introuvable'));
    }, 3000);
    signal?.addEventListener('abort', abort, { once: true });
  });
}
export function demoLogin(email, password) {
  const accounts = [
    { email: 'camille@example.test', name: 'Camille', city: 'Neuchâtel', postal: '2000', address: 'Rue de la Démo 12' },
    { email: 'alex@example.test', name: 'Alex', city: 'Lausanne', postal: '1003', address: 'Place Exemple 4' }
  ];
  const profile = accounts.find(a => a.email === String(email).trim().toLowerCase());
  return profile && password === 'Escale2026!' ? { ok: true, profile, error: '' } : { ok: false, profile: null, error: 'Ces identifiants de démonstration ne correspondent pas.' };
}
