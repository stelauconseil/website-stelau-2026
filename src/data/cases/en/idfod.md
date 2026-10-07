---
title: "Cryptography for secure documents"
description: "A signing solution for exchanges with electronic passports and identity cards."
client: "Eviden / ANTS"
year: "2024"
category: "Développement sécurisé"
---

## Authorising access to biometric data

For Eviden and France’s Agence Nationale des Titres Sécurisés (**ANTS**), Stelau developed a signing solution for exchanges with electronic passports, electronic national identity cards and residence permits.

The document sends an **access challenge**. Signing it forms part of the authorisation process for reading **Data Group 3 (DG3)**, which contains fingerprint images. The mechanism relies on a certificate chain and carefully managed cryptographic keys.

## From PKI to the signing service

### Services compatible with existing equipment

The **SOAP webservices** expose two functions: retrieving the trust certificate chain and requesting a challenge signature. Integration accounts for document delivery equipment in town halls, prefectures and consulates, as well as airport inspection systems.

### Protected keys and appropriate certificates

The solution connects to **PKIs** that issue **Card Verifiable Certificates (CVC)**. It uses **HSMs** to generate asymmetric key pairs and perform signatures. Protected communications complete the architecture.

### Administration that supports daily operations

The administration interface, built with **React**, lets operators manage certificates and keys, inspect logs and monitor service status. Administration is part of the security scope: operators need to understand and control the system’s behaviour.

## Specifications and deliverables

The work draws on travel document specifications, including **ICAO 9303** and **TR-03110**, and the trust requirements applicable to the project.

The deliverables include challenge management services, PKI and HSM connections, and the administration interface. Together they enabled an integrated deployment in the ANTS operational environment, with centralised management of certificates and cryptographic operations.
