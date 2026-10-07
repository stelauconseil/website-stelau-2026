---
title: "La cryptographie au service des titres"
description: "Une solution de signature pour les échanges avec les passeports électroniques et les CNIe."
client: "Eviden / ANTS"
year: "2024"
category: "Développement sécurisé"
---

## Autoriser la lecture des données biométriques

Pour Eviden et l’Agence Nationale des Titres Sécurisés (**ANTS**), Stelau a développé une solution de signature destinée aux échanges avec les passeports électroniques, les cartes nationales d’identité électroniques et les titres de séjour.

Le titre émet un **challenge d’accès**. Sa signature participe à l’autorisation de lecture du **Data Group 3 (DG3)**, qui contient les images des empreintes digitales. Ce mécanisme s’appuie sur une chaîne de certificats et des clés dont la gestion doit rester maîtrisée.

## Une chaîne technique, de la PKI au service de signature

### Des services compatibles avec les équipements existants

Les **webservices SOAP** exposent deux fonctions : obtenir la chaîne de certificats de confiance et demander la signature du challenge. L’intégration tient compte des dispositifs de remise déployés en mairie, préfecture et consulat, ainsi que des équipements de contrôle aéroportuaire.

### Des clés protégées et des certificats adaptés

La solution se connecte aux **PKI** qui émettent des **Card Verifiable Certificates (CVC)**. Elle utilise des **HSM** pour générer les paires de clés asymétriques et réaliser les signatures. La protection des communications complète cette architecture.

### Une administration utilisable au quotidien

L’interface développée avec **React** permet de gérer les certificats et les clés, consulter les journaux et suivre l’état des services. L’administration fait partie du périmètre de sécurité : elle doit aider les opérateurs à comprendre et à contrôler ce qui se passe.

## Les référentiels et les livrables

Le travail s’inscrit dans les spécifications des titres de voyage, notamment **ICAO 9303** et **TR-03110**, et dans les exigences de confiance applicables au projet.

La réalisation comprend les services de gestion des challenges, les connexions PKI et HSM, et l’interface d’administration. Elle a permis de déployer une solution intégrée au contexte opérationnel de l’ANTS, avec une gestion centralisée des certificats et des opérations cryptographiques.
