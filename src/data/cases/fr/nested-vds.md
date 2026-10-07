---
title: "Nested VDS : concevoir la preuve"
description: "Conception et rédaction de la spécification TR-23111 pour des preuves optiques imbriquées."
client: "France Identité / Agence France Titres"
year: "2025"
category: "Spécification & R&D"
---

## Deux signatures pour une preuve présentable

Stelau a conçu et rédigé **TR-23111 « Nested Visible Digital Seal »**, une spécification qui s’appuie sur **ISO 22376** pour présenter des preuves optiques compactes et vérifiables.

Le mécanisme imbrique deux objets. L’**Inner VDS** contient les données d’identité et la clé publique de l’appareil ; il est signé par l’autorité émettrice. L’**Outer VDS** contient cet objet interne, éventuellement chiffré pour des destinataires autorisés, et porte la signature de l’appareil de l’utilisateur.

Cette construction relie la preuve d’origine des données à une preuve produite au moment de leur présentation.

## De l’architecture aux détails d’implémentation

### Préparer l’émission et la présentation

À l’émission, l’appareil génère sa paire de clés et transmet sa clé publique à l’autorité, qui produit et signe l’Inner VDS. À la présentation, l’appareil construit, signe puis affiche ou transmet l’Outer VDS.

Pour la confidentialité, l’Inner VDS peut être chiffré avec une clé secrète **K**. Un échange **ECDHE éphémère** par destinataire permet de protéger cette clé. L’Outer porte la clé publique éphémère `ephPubKey` et les versions chiffrées de K.

### Rester compact et interopérable

- Encodage **Base45** pour la représentation QR ou Data Matrix.
- Structures binaires, types compacts et horodatages adaptés aux contraintes de lecture optique.
- Extension **ISO/IEC 18013-5** pour transmettre l’objet dans le Device Engagement en proximité.
- Usage de la clé d’extension `−7` afin que les lecteurs qui ne la prennent pas en charge puissent l’ignorer.

La spécification précise aussi comment indiquer l’origine de la signature de l’Outer, notamment avec la référence de certificat `000000000`, la clé publique de l’appareil étant contenue dans l’Inner.

## Les livrables

La version **1.0 de TR-23111**, datée du **5 janvier 2025**, comprend des exemples de référence : manifestes Inner/Outer, trames hexadécimales et structures décodées.

Elle fournit une base pour les pilotes et les démonstrateurs d’identité vérifiable, avec une attention portée à la minimisation, aux clés éphémères, aux fenêtres de validité et aux risques de corrélation.

## Prolonger le travail

Les suites concernent les profils de présentation en ligne ou hors ligne, les parcours de contrôle et l’articulation avec les portefeuilles **EUDI**. Les tests entre implémentations et l’optimisation de la lecture optique restent des leviers essentiels pour passer d’une spécification à un usage fiable.
