---
title: "Nested VDS: designing digital proof"
description: "Design and specification of TR-23111 for nested optical digital proofs."
client: "France Identité / Agence France Titres"
year: "2025"
category: "Spécification & R&D"
---

## Two signatures for a presentable proof

Stelau designed and authored **TR-23111 “Nested Visible Digital Seal”**, a specification based on **ISO 22376** for compact, verifiable optical proofs.

The mechanism nests two objects. The **Inner VDS** contains identity data and the device’s public key, signed by the issuing authority. The **Outer VDS** contains that inner object, optionally encrypted for authorised recipients, and is signed by the user’s device.

This construction connects evidence of the data’s origin to a proof created at presentation time.

## From architecture to implementation details

### Issuance and presentation

During issuance, the device generates its key pair and sends its public key to the authority, which produces and signs the Inner VDS. At presentation time, the device constructs and signs the Outer VDS, then displays or transmits it.

For confidentiality, the Inner VDS can be encrypted with a secret key **K**. An **ephemeral ECDHE** exchange for each recipient protects that key. The Outer carries the ephemeral public key `ephPubKey` and the encrypted versions of K.

### Compactness and interoperability

- **Base45** encoding for QR or Data Matrix representation.
- Binary structures, compact types and timestamps suited to optical reading constraints.
- An **ISO/IEC 18013-5** extension to carry the object in proximity Device Engagement.
- Extension key `−7`, allowing readers that do not support it to ignore it.

The specification also explains how to indicate the source of the Outer signature, including the certificate reference `000000000`, with the device’s public key carried in the Inner.

## Deliverables

**TR-23111 version 1.0**, dated **5 January 2025**, includes reference examples: Inner/Outer manifests, hexadecimal frames and decoded structures.

It provides a basis for verifiable identity pilots and demonstrators, with attention to minimisation, ephemeral keys, validity windows and correlation risks.

## Further work

Next steps concern online and offline presentation profiles, inspection journeys and integration with **EUDI** wallets. Cross-implementation testing and optical reading optimisation remain essential to turning a specification into reliable use.
