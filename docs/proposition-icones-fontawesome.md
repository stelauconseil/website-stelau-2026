# Iconographie Stelau — Font Awesome Duotone Solid

Essai du 6 octobre 2026 : à la demande de Stelau, le Duotone Solid classique (`fad`) remplace Utility Duo Semibold. Abonnement Pro+ confirmé. Les emplacements, cartes et textes sont conservés pour faciliter la comparaison.

## Direction visuelle

La couche principale reprend le bleu Stelau (`#0069b4` en clair, `#75baf0` en sombre). La seconde couche reprend exactement cette même couleur à 40 % d’opacité, selon le rendu Duotone par défaut. Elle s’adapte ainsi au fond clair ou sombre sans introduire de nouvelle teinte. Les autres couleurs de l’identité et les textes restent inchangés. Les icônes décoratives complètent des libellés explicites.

## Accueil

| Emplacement | Intention | Icône candidate |
| --- | --- | --- |
| « La technique, avec le sens du collectif. » | Remplacer le trait courbé par un petit groupe de personnes ; texte conservé. | `users` |
| Carte « Éclairer. » | Orientation, conseil et choix éclairés. | `compass` |
| Carte « Vérifier. » | Observation et analyse technique. | `magnifying-glass` |
| Carte « Construire. » | Développement et code. | `code` |
| « Comment nous travaillons » | Dialogue entre les personnes et partage. | `comments` |
| Réalisations | Travail professionnel et missions. | `briefcase` |
| Blog | Connaissances documentées et partagées. | `book-open` |

Les icônes des trois cartes remplacent les signes typographiques actuels. Sur les autres sections, elles restent de petits repères à côté de l’intitulé, afin de conserver la hiérarchie et les photos.

Le badge « Freepik · illustration » de la photographie principale est retiré en français et en anglais. Le texte alternatif reste une description de la photographie.

## Expertise cybersécurité pour l’assurance

Les trois questions d’ouverture deviennent trois repères de méthode avec une icône de 36–40 px :

| Question | Intention | Icône candidate |
| --- | --- | --- |
| Matérialité | Examiner les éléments et traces disponibles. | `magnifying-glass` |
| Mécanismes | Lire l’enchaînement technique. | `share-nodes` |
| Causalité | Établir ou écarter un lien. | `link` |

Pour le corps de la page, des titres accompagnés d’icônes de 28 px et quelques blocs visuels donnent des points d’entrée dans le texte :

| Section | Traitement | Icône candidate |
| --- | --- | --- |
| Un métier, une responsabilité | Un titre avec un repère professionnel. | `briefcase` |
| Déontologie et manifestation de la vérité | Les quatre principes deviennent des cartes compactes, avec leur texte intact. | `compass`, `clipboard-check`, `eye`, `users` |
| Matérialité et mécanismes | Un titre et un fil de méthode : examiner / reconstituer / documenter. | `magnifying-glass` |
| Causalité | Le résultat reste en évidence : lien établi / écarté / indéterminé, chaque état étant écrit explicitement. | `link` |
| Missions IXI-Plus | Des livrables faciles à repérer dans le texte. | `clipboard-check` |
| Transmission du métier | Un repère humain pour l’apprentissage avec les praticiens. | `users` |

Cette proposition conserve les textes de fond. Elle évite les clichés visuels de cybersécurité et ne met pas en scène l’expertise comme une activité judiciaire.

## Extension à toutes les pages FR/EN

Les repères Duotone accompagnent désormais les titres et les sections d’À propos, les expertises et leurs livrables, les réalisations, le Blog et ses métadonnées, les coordonnées et le formulaire, les documents légaux et les pages 404. Les textes explicites restent présents et les icônes décoratives sont masquées aux lecteurs d’écran.

| Notre terrain de jeu | Icône retenue |
| --- | --- |
| eIDAS | `scale-balanced` |
| EUDI Wallet | `wallet` |
| ISO 18013-5 | `id-card` |
| PKI & HSM | `microchip` |
| ISO 27001 | `clipboard-check` |

Le pied de page anthracite utilise le bleu clair `#75baf0` dans les deux thèmes. Les implantations sont centralisées dans `company.ts` : Paris XIII - Paris XVI - Guyancourt - Angers. Chaque ville dispose d’un lien cartographique sur la page Contact.

## Intégration retenue dans Astro

Les 35 variantes Duotone Solid sont vérifiées dans le Kit `1daec18b88` (version 7.3.1, révision 3) et récupérées avec le CLI Font Awesome authentifié. Le composant Astro `Icon.astro` incorpore uniquement les SVG utilisés aux pages au build. Aucun script, aucune police d’icônes ni aucune requête externe Font Awesome n’est nécessaire chez le visiteur.

La licence est conservée avec les actifs ; `provenance.json` consigne leur origine et leur empreinte SHA-256. `.font-awesome.md` documente la famille, le style et les conventions. Le build ne requiert aucun token de compte.

## Références officielles

- [Duotone](https://docs.fontawesome.com/web/style/duotone/)
- [Kits et sélection de styles](https://docs.fontawesome.com/web/setup/use-kit/)
- [CLI officiel](https://docs.fontawesome.com/web/use-with/fa-cli/)
