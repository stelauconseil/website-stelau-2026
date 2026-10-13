# Portraits de Lucas et Kilian : détourage

Traitement demandé par Stelau le 13 octobre 2026 : harmoniser les arrière-plans avec les autres portraits de l’équipe.

Outil utilisé : imagegen intégré, mode édition, `transparent_background: true`.

Fichiers finaux :

- `/Users/bob/codes/website-stelau-2026/src/assets/images/lucas.kotevski-detoure.png`
- `/Users/bob/codes/website-stelau-2026/src/assets/images/kilian.hardy-detoure.png`

Les portraits originaux fournis dans `Photos et videos` sont conservés. Le fond affiché derrière les silhouettes reste celui des cartes (`var(--soft)`), différent dans les thèmes clair et sombre. Astro génère les variantes WebP au build.

## Consignes finales envoyées à imagegen

Deux appels distincts, un pour Lucas et un pour Kilian, chacun utilisant uniquement son portrait comme cible d’édition. Dans le texte ci-dessous, `PERSON` est remplacé respectivement par `Lucas` ou `Kilian` :

> Use case: background-extraction. Edit target: the supplied portrait of PERSON. Primary request: remove ONLY the background and return the exact same person as a clean photographic cutout on a genuinely transparent background. Preserve the original face, identity, expression, eyes, nose, mouth, hair, beard, skin texture, pose, lighting, clothing, colours and photographic detail. Do not beautify, redraw, relight, stylise or change the person. Remove all wall/background pixels and any background signs, text, logos and circular matte outside the person. Preserve fine hair edges and the full visible head, shoulders and clothing. Square composition suitable for a website team avatar, head and shoulders centred with a little transparent room above the hair. No added shadow, no halo, no backdrop, no text, no new clothing. Real alpha transparency.
