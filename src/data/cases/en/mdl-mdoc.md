---
title: "Verifying mDocs, nearby and on the web"
description: "An ISO 18013-5 Android SDK and a browser-based mobile document verifier."
client: "Agence France Titres"
year: "2025"
category: "SDK & identité numérique"
---

## Reading a mobile document with the right attributes

As part of France Identité, Stelau designed two complementary **mDL/mDoc** components: an **Android proximity reader SDK**, based on ISO/IEC 18013-5 and Bluetooth Low Energy (**BLE**), and a **web verifier**.

The objective is to let a reader request the attributes it needs, establish a secure session and process a verifiable response, while respecting consent and selective disclosure.

## The Android SDK: integration without rebuilding the protocol

The Kotlin/Java APIs handle **Device Engagement**, session establishment and attribute retrieval. They connect **CBOR/COSE**, **ECDH** and session encryption to the constraints of a mobile application.

- Attribute selection and signed response processing.
- Reader authentication keys and certificates where required.
- Lifecycle management, cancellation, timeouts and BLE reconnections.
- Application logs and integration hooks for consent and refusal screens.

Radio resilience is part of the work. Discovery, negotiation, retries and metrics must make failures understandable in real operating conditions.

## The web verifier: a browser-based experience

The verifier provides a flow for selecting attributes, obtaining consent and retrieving mobile documents. It uses **Web Bluetooth** on compatible devices and browsers, with handover mechanisms adapted to the operating context.

Reusable verification profiles, usage logs and evidence exports support the operator’s work.

[Try the web verifier ↗](https://mdoc-web-verifier.stelau.com/)

## Security and interoperability

Sessions use ephemeral keys, encryption and signed messages as specified by the protocol. Attribute minimisation and protection against correlation guide the design.

Deliverables include a documented SDK, integration examples, test scenarios and a verifier suitable for demonstrations and pilots on compatible systems. Cross-testing and mDL/mDoc datasets help assess interoperability.

## Further work

Possible extensions include additional transports, an iOS reader, further verification profiles and integration into **EUDI** journeys. Component hardening and CBOR/COSE serialisation testing accompany these developments.
