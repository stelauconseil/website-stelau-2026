# Stelau — site web

Refonte du site [Stelau](https://www.stelau.com/) avec **Astro**, en français et en anglais. Une architecture statique qui privilégie la rapidité, la lisibilité et la sobriété, avec des thèmes clair et sombre.

- **HTML prêt à servir** : les pages sont générées au build et distribuées par GitHub Pages. Aucun rendu applicatif serveur n’est nécessaire à chaque visite, ce qui évite ce coût dans le délai du premier octet (TTFB). Le temps réel dépend aussi du réseau et de l’hébergement.
- **React en îlots** : l’intégration native Astro/React conserve les composants React interactifs. Seules les zones qui en ont besoin sont hydratées, au moment choisi ; le décodeur est chargé à l’approche de sa section. Le contenu éditorial reste du HTML statique.
- **Images optimisées au build** : le composant `Image` d’Astro produit du **WebP**, des variantes adaptées et des `srcset` / `sizes`. Le navigateur choisit la taille utile ; les dimensions réservées et le chargement différé des images secondaires limitent les décalages visuels et les transferts inutiles.
- **Recherche statique** : Pagefind construit les index FR/EN à partir du site généré, sans serveur de recherche dédié.
- **Qualité contrôlée** : vérification Astro/TypeScript, tests de l’outil interactif, build et contrôle des liens internes avant déploiement.

## Développement

Node.js 24 recommandé.

```sh
npm ci
npm run dev
```

```sh
npm run verify
npm run preview
```

Le build est nécessaire pour tester la recherche. La CI GitHub vérifie les pull requests et déploie les builds validés de `main` vers **www.stelau.com**. [Configuration de l’hébergement](docs/deploiement-github-pages.md).
