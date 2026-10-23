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
