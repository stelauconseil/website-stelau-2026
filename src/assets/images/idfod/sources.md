# idFod — captures fournies par Stelau

Source : dossier `Développements sécurisés/idFod/captures idFod` du projet de refonte.

- `administration-claire.png` : `cape 2025-03-31 à 18.56.41.png`.
- `supervision-sombre.png` : `cape 2025-03-30 à 22.50.39.png`.
- `alerte-renouvellement.png` : `cape 2026-01-13 à 08.06.59.png`.

Les fichiers d’origine sont conservés sans modification. Les bandes et la barre du navigateur sont masquées dans le cadre de présentation CSS. Les images WebP et leurs variantes responsives sont produites par Astro au build.

La vue détaillée `cape 2026-01-13 à 08.08.04.png` n’est pas reprise : elle contient notamment un code d’enregistrement qui n’est pas nécessaire à la présentation.

Les captures montrent les indicateurs et diagnostics de l’interface ; les valeurs affichées ne sont pas présentées comme des performances de production ou des engagements de service.

Références techniques consultées le 12 octobre 2026 :

- ICAO Doc 9303, partie 11 : https://www.icao.int/sites/default/files/publications/DocSeries/9303_p11_cons_en.pdf
- BSI TR-03110 : https://www.bsi.bund.de/dok/TR-03110

Les panneaux de code reprennent des passages réels des fichiers déposés par Stelau dans `extraits des codes idFod`. Seule l’indentation extérieure est retirée pour la présentation. Les fichiers complets ne sont pas copiés dans le site, et les extraits ne sont pas exécutés. Les plages de lignes et les empreintes SHA-256 des sources sont consignées dans `src/data/code/idfod/sources.json`.

- `CVCSignatureUtils.ts`, lignes 196–209 : conversion de clé publique EC en DER.
- `CVCertificateRequest.ts`, lignes 85–98 : signature et assemblage d’une demande de certificat CVC, à l’intérieur de la méthode `create`.
- `CVCertificate.ts`, lignes 180–192 : lecture du droit DG3. Ce contrôle isolé n’est pas présenté comme une validation complète des autorisations ou de la chaîne.
