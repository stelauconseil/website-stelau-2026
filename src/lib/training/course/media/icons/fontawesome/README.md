# Icônes Font Awesome Duotone Solid

SVG officiels Font Awesome 7.3.1 (licence Pro+) : 54 repris du Kit Stelau `1daec18b88` du site
`website-stelau-2026`, les autres copiés depuis le téléchargement Pro+ local
(`~/codes/fontawesome-pro/fontawesome-pro-plus-7.3.1-web/svgs/duotone`).
`provenance.json` donne l'empreinte SHA-256 de chaque fichier ; `vp test` la vérifie.

- Ajouter une icône : `vp run icons:add <nom> [<nom>…]` (variable `FA_DUOTONE_DIR` pour une autre source).
- Ne jamais modifier un SVG à la main : les retouches se font dans `core/primitives.js`
  (ex. DH : `shuffle` avec la flèche secondaire retournée de 180°).
- Calque secondaire : `opacity=".4"` ; les deux calques suivent `currentColor`.
