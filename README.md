# Escale — boutique à auditer

Version publique de la boutique fictive du cours UX × IA. Ouvrir le site suffit : aucune installation, aucun compte personnel, aucun panneau formateur, aucun corrigé activable.

**Site : https://clement8426.github.io/escale-demo/**

18 produits, catalogue, fiches produit, panier, commande et confirmation. Tous les paiements sont fictifs. Utilisez des coordonnées inventées. Connexion facultative : `camille@example.test` / `Escale2026!` (ou `alex@example.test`, même mot de passe). Les profils sont publics : ce n'est pas une authentification protégeant des données privées. Panier et profil restent dans le navigateur.

## Pour le formateur

Les neuf défauts sont volontairement conservés :

1. Boutons d'ajout de styles différents : catalogue, fiche et suggestion du panier.
2. Cartes du catalogue : paddings de 12, 24 et 36 px.
3. Commande : soumettre un code postal `20` efface les autres champs. `2000` permet de terminer.
4. Fiche « Le Week-end » : bouton favori sans nom accessible.
5. Confirmation > Annuler cette commande : actions inaccessibles avec Tab et Échap sans effet.
6. Même fenêtre : double négation et boutons Oui / Non. Oui conserve, Non annule.
7. Fiche « Le Week-end » : PNG non compressé d'environ 11,5 Mo, demandé avec `fetch(..., {cache:'no-store'})` pour contourner le cache HTTP du navigateur, puis affiché via une URL blob.
8. Fiche produit : trois secondes de vide sans skeleton.
9. Fiche produit : contraste insuffisant du prix.

Le bloc 4, comportement, reste théorique : aucun traceur ni faux résultat d'analyse comportementale.

**Différence avec le professeur local :** GitHub Pages héberge un export statique Next.js. L'attente de trois secondes est simulée côté navigateur, pas une requête serveur lente. Le poids du PNG et son transfert sont réels. Les en-têtes du CDN GitHub restent gérés par GitHub ; `no-store` est ici une option de requête navigateur, pas une démonstration d'en-têtes de cache serveur. Pour démontrer l'API lente et comparer les politiques de cache serveur, utiliser la version professeur. Dans Network, chercher `lourde.png` et retirer le filtre Images si nécessaire : le téléchargement est effectué avec fetch. Aucun interrupteur, paramètre d'URL ni ancien état local ne peut activer les corrections.

## Maintenance (Mac, Windows, Linux)

Node.js 22 ou plus récent :

```sh
npm ci
npm run build
npm start
```

Ouvrir http://127.0.0.1:4215/ . Pour développer : `npm run dev` (après un premier build pour générer les images).

Tests : `npm test`, puis `npm run test:e2e` après construction et installation de Chromium (`npx playwright install chromium`). Le test E2E vérifie les neuf défauts, le parcours et l'absence de commandes de correction. Il ne certifie pas l'accessibilité : certains échecs sont justement l'exercice.

Chaque push sur `main` reconstruit, teste puis publie sur GitHub Pages. Le workflow règle le préfixe `/escale-demo`. Aucun secret d'hébergement requis.

Photo et polices : crédits conservés dans `public/images/source/CREDITS.md` et `public/fonts/OFL.txt`.
