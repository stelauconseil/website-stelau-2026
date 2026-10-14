# Publication de Stelau sur GitHub Pages

Dépôt : `stelauconseil/website-stelau-2026`. Branche publiée : `main`.
Adresse cible : **https://www.stelau.com/**.

## Ce que fait la CI

| Événement | Vérification et build | Publication |
| --- | --- | --- |
| Pull request vers `main` | Oui | Non |
| Push sur `main` | Oui | Oui, si tous les contrôles passent |
| Lancement manuel sur `main` | Oui | Oui, si tous les contrôles passent |
| Tâche quotidienne, 05:15 UTC | Oui | Oui, si `main` est la branche par défaut |
| Lancement manuel sur une autre branche | Oui | Non |

1. Installer Node 24 et les dépendances verrouillées avec `npm ci`.
2. Exécuter `npm run verify` : typage Astro, génération des pages et des images, indexation Pagefind FR/EN, vérification des liens et ancres, redirections, flux RSS et articles importés.
3. Lire l’adresse déclarée dans GitHub Pages et vérifier qu’elle correspond au domaine de `astro.config.mjs`, sans préfixe de dépôt.
4. Envoyer uniquement `dist/` comme artefact GitHub Pages.
5. Déployer cet artefact dans l’environnement `github-pages`.

Les builds obsolètes d’une même branche sont annulés ; un déploiement déjà commencé peut terminer. Les droits d’écriture Pages et OIDC sont accordés au seul job de déploiement. Les pull requests, y compris depuis un fork, n’ont aucun accès à ce job. Aucun PAT, secret de déploiement ou secret Font Awesome n’est nécessaire.

Le site reste entièrement statique. Le workflow ne nécessite ni branche `gh-pages`, ni serveur Node en production. La recherche est livrée dans `dist/pagefind/` ; les animations, photos et la vidéo sont incluses dans le build.

Le fichier vide `public/.nojekyll` est copié par Astro à la racine de `dist/` ; `npm run verify` contrôle sa présence. Le déploiement par artefact GitHub Actions ne passe pas par Jekyll et n’en a pas besoin. Ce marqueur protège néanmoins le build compilé si une publication depuis une branche est introduite plus tard, notamment les fichiers sous `_astro/`. Il ne remplace ni le build Astro ni le choix de la source **GitHub Actions** : publier les sources du dépôt avec Jekyll désactivé ne produit pas le site.

## Activer le nouveau dépôt

1. Commiter puis pousser les fichiers de cette CI dans le nouveau dépôt.
2. Dans [Settings → Pages](https://github.com/stelauconseil/website-stelau-2026/settings/pages), choisir **Build and deployment → Source → GitHub Actions**. Ne pas générer un second workflow : celui du dépôt est déjà prêt.
3. Vérifier que la branche par défaut est `main`. Dans **Settings → Environments → github-pages**, autoriser les déploiements depuis `main` ; conserver les approbations manuelles si vous en souhaitez une avant publication.
4. Si une politique d’organisation limite les Actions autorisées, autoriser les cinq Actions officielles utilisées dans le workflow (`checkout`, `setup-node`, `configure-pages`, `upload-pages-artifact`, `deploy-pages`).

Si un second workflow automatique **pages build and deployment** lance `actions/jekyll-build-pages` sur les sources et signale des erreurs YAML dans les composants `.astro`, vérifier de nouveau la source Pages et sélectionner **GitHub Actions**, plutôt qu’une publication depuis une branche. Ne pas modifier les délimiteurs de frontmatter Astro ou la syntaxe MDX pour satisfaire Jekyll.

Avant le transfert du domaine, les vérifications du site peuvent réussir puis l’étape **Verify production domain** échouer volontairement. Le site actuel utilise des liens à la racine ; il ne serait pas fonctionnel sous `/website-stelau-2026/` avec cette configuration. La CI attend donc le domaine choisi.

## Transférer www.stelau.com au moment de la bascule

Le clone de l’ancien dépôt `stelauconseil/stelauconseil.github.io` contient déjà un fichier `CNAME` déclarant `www.stelau.com`. Au contrôle du 14 octobre 2026, le DNS `www` pointe vers `stelauconseil.github.io.`. L’association actuelle du domaine dans les réglages Pages reste à vérifier : les DNS seuls ne désignent pas le dépôt qui le sert.

Quand le nouveau build a passé les vérifications et que vous êtes prêt à remplacer le site actuel :

1. Si le domaine est encore associé à l’ancien dépôt, retirer **Custom domain** dans les réglages Pages de ce dépôt. Retirer aussi son fichier `CNAME` de la branche publiée s’il y est encore présent, afin qu’un prochain déploiement de l’ancien site ne le réintroduise pas.
2. Dans les réglages Pages du **nouveau dépôt**, saisir **Custom domain → www.stelau.com → Save**.
3. Dans [Actions](https://github.com/stelauconseil/website-stelau-2026/actions), sélectionner **Verify and deploy Stelau → Run workflow → main**. Le push initial peut déjà avoir lancé un build ; relancer celui-ci s’il avait échoué avant la configuration du domaine.
4. Dès que GitHub propose l’option, activer **Enforce HTTPS**. Le premier déploiement accepte l’adresse HTTP que GitHub peut annoncer pendant la création du certificat ; les liens canoniques du site restent en HTTPS.
5. Après succès du job de déploiement, vérifier `https://www.stelau.com/`, une page EN, la recherche, la vidéo de l’expertise assurance et les flux RSS.

Avec une publication par GitHub Actions, GitHub ignore le fichier `CNAME` de l’artefact : le domaine se règle dans **Settings → Pages**. Aucun nouveau fichier `public/CNAME` n’est nécessaire. Voir la [documentation GitHub sur les domaines personnalisés](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

Une courte interruption est possible pendant le transfert et la mise en place du certificat. Conserver l’ancien dépôt et sa configuration pour pouvoir revenir à l’ancien site en réassociant le domaine si nécessaire.

## DNS

Le CNAME DNS observé correspond déjà à la valeur attendue. Pour `www`, le réglage est :

| Nom | Type | Cible |
| --- | --- | --- |
| `www` | `CNAME` | `stelauconseil.github.io.` |

La cible ne contient ni `https://`, ni le nom du dépôt. Si ce réglage est toujours présent au moment de la bascule, le conserver.

Pour que `stelau.com` sans `www` redirige aussi via GitHub Pages, vérifier que les enregistrements A de la racine sont ceux de GitHub : `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Le contrôle du 14 octobre a retourné `185.199.108.153` ; vérifier la zone complète chez le gestionnaire DNS avant toute modification. Préserver les enregistrements de messagerie existants. Les [valeurs officielles GitHub](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain) font référence pour cette configuration.

## Vérifier et republier

En local :

```sh
npm ci
npm run verify
npm run preview
```

Après activation, chaque push réussi sur `main` republie le site. Le build quotidien publie les articles dont la date est passée au moment du build ; ce n’est pas une publication à la minute. Pour republier immédiatement ou revenir à une version précédente, lancer le workflow sur `main` après le commit voulu (ou le revert du changement).

Le dossier `dist/` n’est pas à commiter. L’exécution locale ne valide pas encore l’accès à Pages, les règles de l’environnement, les DNS ou le certificat : le premier lancement sur GitHub vérifiera ces éléments.

Après un déploiement réussi, vérifier les accueils `/` et `/en/`, une page du Blog dans chaque langue, les fichiers CSS/JS/images sous `/_astro/`, une recherche Pagefind avec des résultats, `/rss.xml`, `/en/rss.xml` et la vidéo de l’expertise assurance. Les ressources doivent être servies sans erreur HTTP et avec le type de contenu attendu ; tester aussi les médias dans le navigateur. Vérifier la redirection HTTP vers HTTPS après activation de **Enforce HTTPS**. Le site cible la racine de `www.stelau.com` : ne pas ajouter un `base` de dépôt sans adapter également les routes, les ressources, Pagefind et les contrôles du workflow.

Référence du workflow : [publication avec un workflow GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
