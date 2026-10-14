# reBop et l’atelier ASN.1 / X.509

Pages : `/realisations/rebop/` et `/en/work/rebop/`. Références depuis l’accueil, les réalisations et les activités Construire dans le menu et le catalogue.

## Sources éditoriales

Le dépôt fourni `rebop-site` (commit `6a08804`) contient une ancienne maquette Gatsby, des textes de template et des visuels de démonstration. Il confirme le positionnement CLM et l’origine du produit ; le contenu fonctionnel de la nouvelle page s’appuie sur la documentation publique officielle consultée le 14 octobre 2026 :

- [Découverte et surveillance](https://www.rebop.io/real-time-certificate-monitoring/) : services exposés, collecte interne, contexte d’utilisation.
- [Sonde](https://docs.rebop.io/docs/guides/probe/what-is-probe/) : collecte de certificats, métadonnées, JSON, clé d’API ; fichiers de clés privées ignorés.
- [Certificats](https://docs.rebop.io/docs/guides/app/certificates/) : analyse, emplacements et opérations sur l’inventaire.
- [AI Engine](https://docs.rebop.io/docs/guides/app/ai-engine/) : corrélation, propositions de renouvellement, archivage et transfert de métadonnées.
- [Fonctions avancées](https://www.rebop.io/advanced-features/) : Deploy Delay, certificats invalides encore en ligne, renouvellements suspects et alertes.
- [Réglages](https://docs.rebop.io/docs/guides/app/settings/) : profils et journaux.
- [Timeline](https://docs.rebop.io/docs/guides/app/timeline/) : suivi des échéances et des renouvellements.
- [Site reBop](https://www.rebop.io/) : offres SaaS et Enterprise, on-premise, VM, conteneur et IaaS.

La page distingue détection de renouvellement, émission et déploiement. Elle ne promet pas de connecteurs SCEP/EST, d’automatisation d’émission, de déploiement de clés privées ou d’algorithmes post-quantiques précis non établis par ces sources. Aucun tarif ni quota de plan n’est recopié. Le schéma du haut est une composition originale, sans statistiques fictives. Les captures de l’ancien dépôt ne sont pas publiées.

## Captures de l’interface

Quatre captures publiées sur le site officiel reBop ont été reprises le 14 octobre 2026 dans `src/assets/images/rebop/`. Leurs dates et indicateurs sont ceux des captures du produit, pas des statistiques actuelles de Stelau. Elles sont servies localement, optimisées en WebP avec des tailles responsive et chargées progressivement. Les légendes FR/EN décrivent les fonctions montrées ; le composant `RebopScreen.astro` permet l’agrandissement au clic, la fermeture par Échap et le retour du focus. Sans JavaScript, le lien ouvre directement l’image.

- `tableau-de-bord.png` : [source](https://www.rebop.io/static/4d68e907a5ffb808dffeade15fdf6415/d67f6/dash-1.png), site [reBop](https://www.rebop.io/).
- `analyse-x509.png` : [source](https://www.rebop.io/static/1ea2ead837e24555617a917c93b7aa28/b4047/decode-1.png), site [reBop](https://www.rebop.io/).
- `comparaison-renouvellement.png` : [source](https://www.rebop.io/static/791979ced1955913259d001026b697f2/194ca/nasa-cert-10.png), site [reBop](https://www.rebop.io/).
- `timeline-certificats.png` : [source](https://www.rebop.io/static/c821adc45c876a0f7fb9a41653f8652d/40b3d/timeline-small-size-flatly.png), page [surveillance](https://www.rebop.io/real-time-certificate-monitoring/).

Les captures restent fidèles à l’interface publiée. Leur cadre suit le thème Stelau ; les couleurs internes du produit sont conservées.

## Reprise du décodeur fourni

Origine : application `decoder-x-509`, commit `9f1dd40`. Le parsing et la lecture sémantique proviennent de `lib/decode.ts` et `lib/x509.ts` ; l’inspecteur React reprend `components/inspector.tsx` avec ses trois vues synchronisées, ses listes virtualisées TanStack, les offsets, la surimpression et le détail tag/longueur/contenu.

Adaptations :

- `@astrojs/react` et `client:visible` ; page statique, aucune dépendance Next/Vinext, serveur, base de données ou endpoint applicatif.
- Parsing dans un worker dédié, chargé à la première utilisation. Le thread de la page reste disponible.
- Traductions FR/EN, palette et thème Stelau, styles isolés sous `.rebop-decoder`, SVG Font Awesome locaux.
- Onglets clavier et commutateur natifs ; pas de bibliothèque UI générale supplémentaire.
- Import PEM, DER, Base64/Base64url, hexadécimal, lien Lapo collé, fichier local et glisser-déposer ; export DER, effacement et remplacement de l’objet.
- Aucun certificat dans l’URL de la page, aucune lecture automatique du fragment, aucune copie en stockage persistant, aucun appel réseau d’analyse, OCSP ou CRL. Les octets transitent uniquement entre la page et son worker local. Les fichiers JS nécessaires sont des ressources statiques du site.
- Un objet maximum, 256 Kio de données binaires, limite de profondeur et de nombre de nœuds pendant le parsing, arrêt du worker après 5 secondes.
- Les résultats du visiteur sont exclus de Pagefind et ne peuvent pas être présents dans le build statique.

L’atelier n’est pas une interface du service reBop. Il n’effectue pas la validation cryptographique d’une signature, d’une chaîne ou d’une révocation ; les QCStatements exposent les déclarations encodées sans prouver une qualification eIDAS. Le parseur accepte BER et DER, sans prouver la canonicalité DER. Les extensions inconnues ou non interprétables conservent leurs octets bruts.

`example.pem` est un certificat auto-signé fictif généré pour cette page : domaine `demo.rebop.example.test`, organisation « Stelau Demonstration », adresses de documentation et QCStatements pédagogiques. La clé privée utilisée pour le générer a été supprimée. Le certificat personnel de test du dépôt d’origine n’a pas été copié.

## Licence et références

`@lapo/asn1js` 2.0.0, Lapo Luchini, licence ISC. Texte conservé dans `public/licenses/lapo-asn1.txt`, avec attribution visible dans l’atelier. Les liens normatifs de la lecture X.509 vers RFC 5280, RFC 3279, RFC 3739 et ETSI EN 319 412-5 sont repris de l’application.

## Vérifications

```sh
npm run test:decoder
npm run verify
```

Les tests du décodeur couvrent les encodages d’entrée, la reconnaissance X.509, RSA, SAN, QCStatements, la liaison des champs aux octets et sa conservation après un clone de worker, BER, tags longs, objets tronqués ou concaténés, les bornes de complexité, la version par défaut, les extensions inconnues et malformées. Le vérificateur du build vérifie aussi les deux pages, leurs entrées de sitemap et l’île React différée.
