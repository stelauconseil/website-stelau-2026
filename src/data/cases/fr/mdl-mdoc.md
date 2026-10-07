---
title: "Vérifier des mDocs, en proximité et sur le web"
description: "Un SDK Android ISO 18013-5 et un vérificateur web pour les documents mobiles."
client: "Agence France Titres"
year: "2025"
category: "SDK & identité numérique"
---

## Lire un document mobile, avec les bons attributs

Dans le cadre de France Identité, Stelau a conçu deux composants complémentaires autour de **mDL/mDoc** : un **SDK Android de lecteur de proximité**, fondé sur ISO/IEC 18013-5 et Bluetooth Low Energy (**BLE**), et un **vérificateur web**.

L’objectif est de permettre à un lecteur de demander les attributs utiles, établir une session sécurisée et traiter une réponse vérifiable, tout en respectant le consentement et la divulgation sélective.

## Le SDK Android : intégrer sans réimplémenter le protocole

Les API Kotlin/Java prennent en charge le **Device Engagement**, l’établissement de la session et la récupération des attributs. Elles relient les briques **CBOR/COSE**, **ECDH** et le chiffrement de session aux contraintes d’une application mobile.

- Sélection des attributs et traitement de la réponse signée.
- Gestion des clés et certificats d’authentification du lecteur lorsque requis.
- Gestion du cycle de vie, des annulations, des délais et des reconnexions BLE.
- Journaux applicatifs et points d’intégration pour les écrans de consentement et les refus.

La résilience radio fait partie du travail : découverte, négociation, reprises et métriques doivent permettre de comprendre les échecs en conditions réelles.

## Le vérificateur web : une expérience depuis le navigateur

Le vérificateur propose un parcours de sélection des attributs, de consentement et de récupération des documents mobiles. Il exploite **Web Bluetooth** sur les appareils et navigateurs compatibles, avec des mécanismes de handover adaptés au contexte.

Des profils de vérification réutilisables, des journaux d’usage et l’export de preuves accompagnent le travail de l’opérateur.

[Essayer le vérificateur web ↗](https://mdoc-web-verifier.stelau.com/)

## Sécurité et interopérabilité

Les sessions utilisent des clés éphémères, le chiffrement et les messages signés prévus par le protocole. La minimisation des attributs échangés et la protection contre la corrélation guident la conception.

Les livrables comprennent un SDK documenté, des exemples d’intégration, des scénarios de test et un vérificateur utilisable pour les démonstrations et les pilotes sur des postes compatibles. Les tests croisés et les jeux de données mDL/mDoc contribuent à vérifier l’interopérabilité.

## La suite

Les évolutions envisagées portent sur d’autres transports, le lecteur iOS, les profils de vérification et leur intégration dans les parcours **EUDI**. Le durcissement des composants et les tests de sérialisation CBOR/COSE accompagnent ces évolutions.
