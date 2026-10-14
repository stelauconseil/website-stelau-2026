# Photographies et histoire Stelau — 14 octobre 2026

Les cinq originaux ont été fournis par Stelau dans « Photos et videos ». Ils restent intacts dans le dossier de ressources. Les copies destinées au site sont nommées selon leur usage et rendues par `astro:assets` en WebP avec variantes responsive.

| Original | Actif du site | Usage |
| --- | --- | --- |
| verifier-lucas.png | src/assets/images/stelau-terrain/lucas-verification.png | Catalogue / Vérifier, FR et EN |
| IMG_5106.jpeg | src/assets/images/stelau-terrain/rencontre-auditeurs.png | Dernière photographie des audits de certification, FR et EN |
| IMG_2844.jpeg | src/assets/images/stelau-terrain/fondateurs-stelau.jpeg | Introduction de l’histoire de Stelau, FR et EN |
| IMG_1696.jpeg | src/assets/images/france-identite/atelier-collectif.jpeg | Réalisation France Identité, FR et EN |
| IMG_1698.jpeg | src/assets/images/france-identite/echanges-equipe.jpeg | Réalisation France Identité, FR et EN |

Les deux premières ont fait l’objet d’une retouche avec l’outil intégré imagegen : éclairage, teintes, simplification du fond pour Lucas et adaptation au format horizontal. Les trois autres sont les photographies originales. Les légendes ne donnent pas de date ou de lieu de prise de vue non confirmé. Le dîner n’est pas présenté comme un audit ; la mention de confidentialité de la page a été ajustée.

## Repères historiques

- [Site Stelau archivé le 10 avril 2025](https://web.archive.org/web/20250410072609/https://www.stelau.com/) : création en 2002, jalon LSTI en 2017, agrément ANSSI pour l’évaluation en 2021, développement sécurisé en 2022, accompagnement CSPN en 2023. Ce sont les jalons de la timeline de l’ancien site, pas nécessairement les dates de première activité dans ces domaines. Le texte évite d’assimiler un agrément à une qualification générale de tous les services Stelau.
- [Présentation de Benoit à l’EGE](https://www.ege.fr/ecole/corps-professoral/benoit-leger-derville) : enseignement à l’EPITA depuis 2010, IXI-Plus depuis 2018, cofondation de reBop en 2021, cours à l’EGE depuis 2023. La fiche précise le début des audits eIDAS en 2016 : le jalon LSTI de 2017 n’est donc pas présenté comme leur commencement.
- [Stelau sur LinkedIn](https://fr.linkedin.com/company/stelau-conseil) : création en 2002 et spécialités. Le profil individuel public ne permettait pas de lire toute l’expérience ; aucune date masquée n’a été inventée.
- Réalisation France Identité existante : 2024. Annonce iDAKTO déjà référencée dans `src/data/company.ts` : mi-juin 2026.
- Ajouts concernant Nicolas, à la demande de Stelau : invention du Nested VDS et formalisation en norme pour France Identité ; présentations des avancées du wallet en conférences internationales. Le jalon Nested VDS est placé en 2025, année de la version 1.0 de TR-23111 référencée dans la réalisation existante (5 janvier 2025) ; il ne prétend pas dater les premiers travaux de conception ni une adoption ISO. Le jalon conférences est placé en 2026, année du retour de Genève déjà documenté sur le site. Ces années sont retenues en attendant une éventuelle précision de Stelau sur les dates souhaitées.

Les formulations de la timeline sont précisées par Stelau : l’entrée IXI-Plus de 2018 concerne le cabinet Stelau ; l’entrée reBop de 2021 mentionne les deux cofondateurs, Benoit et Nicolas. Ces précisions sont reprises dans les textes FR et EN.

## Réutilisations photographiques

Contrôle des imports de tous les composants et empreintes SHA-256 des actifs : aucun fichier d’image identique n’est stocké sous deux noms différents. Les réutilisations dans des pages distinctes sont :

- `code-review.jpeg` : accueil et catalogue / Éclairer.
- `workshop.jpeg` : accueil et catalogue / Construire.

La réutilisation de `ecoute-reunion-audit.jpg` dans Vérifier est supprimée par la photo de Lucas. Celle de `workshop.jpeg` dans À propos est supprimée par la photo des fondateurs. Les deux autres réutilisations sont conservées : la demande portait sur leur vérification ; les photos Éclairer et Construire avaient été expressément retenues pour le catalogue. La photographie technique autrefois commune aux audits et aux exercices de crise a été remplacée dans la page crise par une nouvelle scène de débriefing générée (`debrief-retour-experience.png`). Le même visuel FR/EN ou une vue agrandie de la même capture ne constitue pas un doublon éditorial.

## Prompts des retouches

Mode : outil intégré imagegen, une image cible par appel, fond opaque.

### Lucas

> Edit target: the supplied real Stelau photograph of Lucas working thoughtfully at his laptop. Identity-preserve editorial retouch, photorealistic, not a new scene. Improve the photo for a cybersecurity consultancy website: brighter balanced natural window light, subtle fresh contrast and clean neutral colors, restrained warmth on skin, better definition without beauty filters. Preserve exactly the man's recognizable face/profile, hair, beard, concentrated expression, hand on forehead, other hand at computer, body proportions, clothing, laptop and desk arrangement. Keep the authentic shared office atmosphere; simplify distracting scribbles on the whiteboard into a clean mostly blank whiteboard, subtly tidy background visual noise, soften background depth of field. Do not add people, badges, logos, decorative cyber objects or change the task. Do not show readable new screen contents. Compose a landscape 4:3 crop centered on Lucas and his laptop for a card; gently extend only neutral office backdrop if needed for landscape format, keeping the subject's entire head, hands and laptop visible. Keep documentary authenticity, no stock-photo look, no waxy skin. Output one enhanced photograph.

### Rencontre

> Edit target: this real Stelau photograph of four smiling male colleagues at a round restaurant table at night. Use case: identity-preserve, gentle photographic retouch for an editorial website. Keep EXACTLY all four people's recognizable faces, identities, expressions, head shapes, hairstyles, facial hair, ages, skin textures, hand gestures, clothing, seats and positions. Keep the original composition, authentic evening restaurant setting, Paris street visible through the windows, table, glasses and objects, including the wine bottle. Change only photographic lighting and color grading: gently lift shadows on the four faces, neutralise the yellow-green cast in skin and white shirts, softly recover highlights, add a little clarity and natural rich color without oversaturation. Preserve the night ambience and warm convivial feeling. No new elements, no changed identities, no beautification or smoothing of wrinkles, no stock-image restaging, no text or watermark. Preserve landscape 4:3 composition. Output one retouched version.
