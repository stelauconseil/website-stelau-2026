# Stelau — première version de la refonte

Astro 7, génération statique, Tailwind 4 et Pagefind. Architecture des pages, contenu MDX, auteurs et médias repris du site FullVerify. Les clones de référence restent dans `../sources/`.

## Lancer le site

Node 24 recommandé.

```sh
npm ci
npm run verify
npm run preview
```

Le build est nécessaire pour tester la recherche Pagefind. `npm run dev` suffit pour travailler sur les pages. Aucun déploiement de production n’a été effectué.

## Organisation

- `src/pages/` : pages françaises. `src/pages/en/` : pages anglaises distinctes.
- `src/data/blog/fr/` et `src/data/blog/en/` : les deux articles FullVerify, chacun dans les deux langues, avec leurs médias originaux.
- `src/data/authors/` : auteurs importés. La mention erronée de cofondateur pour Hector a été corrigée.
- `src/data/cases/fr/` et `src/data/cases/en/` : cinq réalisations réécrites à partir du site Stelau actuel, dans les deux langues.
- `src/data/team.ts` : sept personnes du site existant, avec leurs portraits et rôles à confirmer.
- `src/config/site.ts` : liens, langues et routes correspondantes.

## Coordonnées

Implantations : Paris XIII - Paris XVI - Guyancourt - Angers. Téléphone : +33 1 85 40 12 70. Les implantations, le téléphone et les liens vers les cartes des villes sont centralisés dans `src/data/company.ts`, utilisés dans le footer, le contact et les documents légaux FR/EN.

## Identité visuelle

Le logo d’origine avec sa signature « digital security » est repris à l’identique dans `public/brand/logo.stelau.png`, ainsi que le favicon historique. Le bleu `#0069B4` et le gris anthracite `#212529` proviennent du site actuel. Le logo est affiché sur fond anthracite dans les deux thèmes pour préserver ses lettres blanches. Les boutons conservent le bleu historique ; les accents sont éclaircis dans le thème sombre pour rester lisibles. Les couleurs sont centralisées au début de `src/styles/global.css`.

## Stelau et iDAKTO

Stelau a été acquise par iDAKTO mi-juin 2026. L’annonce figure sur l’accueil et dans l’histoire de l’équipe en français et en anglais. Le footer indique l’appartenance au groupe sur toutes les pages. Les textes et les liens LinkedIn sont centralisés dans `src/data/company.ts`. La mention d’indépendance de la première version a été remplacée.

Communiqué iDAKTO du 16 juin 2026 : https://www.idakto.com/blog/idakto-accelerates-its-growth-with-the-acquisition-of-stelau-specialist-in-cybersecurity-for-digital-identity-infrastructure/

## Publications

Un article est publié si `draft: false` et si `pubDate` est passée au moment du build. Conserver le même nom de dossier (slug) et la même `mappingKey` entre les versions FR/EN pour faire correspondre les pages. Les nouveaux articles doivent avoir leur fichier dans chaque langue publiée. Pour une date précise, utiliser une date ISO avec fuseau, par exemple `2026-10-06T09:00:00+02:00`. La date d’affichage utilise Europe/Paris.

Le dossier `site/` est prévu comme racine du futur dépôt et de l’hébergement. Le workflow `.github/workflows/build.yml` construit et conserve un artefact quotidien. Le raccordement de cet artefact à l’hébergement, après validation de la préproduction, est nécessaire pour publier automatiquement les articles programmés.

## Points de validation éditoriale avant production

- La photographie principale provient de Freepik. Stelau a confirmé les droits d’utilisation ; le badge visible a été retiré. Une photographie de la développeuse Stelau pourra la remplacer ultérieurement.
- L’extrait cryptographique de l’accueil est repris du billet FullVerify sur mdoc-web-verifier. Le dossier WSCA contient une synthèse PowerPoint, pas de code source. Ajouter un extrait WSCA destiné à publication pour le remplacer.
- Actualiser la liste des consultants, les intitulés et les portraits.
- Relire et affiner ensemble les textes FR/EN proposés, notamment les réalisations et les descriptions d’expertise.
- Les quatre pages Legal et leur sommaire sont repris dans la structure de FullVerify, avec des textes adaptés au site vitrine. Les clauses d’abonnement et d’API ont été retirées. Ce sont des documents de travail : renseigner les identifiants de société et l’hébergeur définitif, valider les durées de conservation et le traitement Formspree avant publication. Référence sur les préférences de navigateur : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi.
- Le formulaire reprend l’identifiant Formspree du site Stelau actuel. Vérifier sa configuration et tester un envoi avec votre accord. Aucun message n’a été envoyé pendant les vérifications.
- La newsletter FullVerify n’avait pas de service d’inscription branché. Le footer propose le flux RSS fonctionnel ; le raccordement d’une newsletter sera une étape distincte si souhaitée.

## Visuels

Photographies Freepik fournies par Stelau, photos d’équipe fournies par Stelau, portraits issus du site existant. Les sources restent dans `../Freepik/` et `../Photos et videos/`.

## Expertise cybersécurité pour l’assurance

La page permanente `/expertises/expertise-cyber-assurance/` et sa version anglaise `/en/expertise/expertise-cyber-assurance/` présentent l’activité avec IXI-Plus. Le contenu est dans `src/components/Expertise/CyberInsurance.astro`. Les liens figurent dans Conseil & expertise, l’index des expertises et À propos, sans ajouter une quatrième famille d’expertises.

Source métier : `../documents/Plaquette_IXI-Plus_Cyber_Risk.pdf`, complétée par les précisions de Stelau sur la déontologie, la manifestation de la vérité, la matérialité des attaques et la causalité avec le sinistre. Les coordonnées historiques de la plaquette ne sont pas reprises. La page distingue cette activité de l’expertise judiciaire et ne modifie pas les fonctions individuelles des consultants. Les références Service Public et NIST sont des repères complémentaires, sans mention d’agrément ou de certification. Le billet du Blog associé sera préparé séparément.

## Proposition d’icônes Font Awesome

Stelau dispose d’un abonnement Pro+. Toutes les familles de pages FR/EN utilisent le Duotone Solid classique, en bleu Stelau avec une seconde couche de la même couleur à 40 % d’opacité et sous forme de SVG locaux rendus au build Astro. Les 35 SVG officiels du Kit `1daec18b88` sont stockés dans `src/assets/icons/fontawesome/duotone-solid/`, avec licence et provenance ; `src/components/Icon/Icon.astro` les intègre au build. `.font-awesome.md` consigne la version 7.3.1 et la révision 3. Aucun token n’est requis pour construire le site, et aucun script Font Awesome n’est chargé chez le visiteur. Les variantes ont été vérifiées et récupérées avec le CLI officiel. La sélection est décrite dans `docs/proposition-icones-fontawesome.md`.

## Code de l’accueil

L’extrait WebCrypto dispose de deux palettes Shiki générées au build : GitHub Light et une variante GitHub Dark sur fond anthracite, avec des mots-clés et des fonctions orange. Le changement suit le thème global, y compris le choix Système, sans charger de coloration syntaxique côté visiteur.

## Essai du bandeau d’accueil

Les accueils FR/EN utilisent une texture de points discrète sur les bandeaux anthracite de navigation et de pied de page, accompagnée des références WebCrypto de la home. Le haut comporte un reflet bleu qui ne joue qu’une fois pendant 4,4 secondes ; le bas conserve une texture plus espacée, statique. La décoration est ignorée par les lecteurs d’écran et Pagefind ; le reflet est désactivé avec `prefers-reduced-motion`. Le composant `BandTexture.astro` ne charge aucun script ni actif externe.
