import type { Node } from './decode.ts';

export type Reference = { label: string; url: string };
export type CertificateField = {
  id: string;
  group: string;
  label: string;
  value: string;
  schema: string;
  node: Node;
  references: Reference[];
  critical?: boolean;
  derived?: boolean;
  decoded?: boolean;
};
export const rfc = (number: number, section: string): Reference => ({
  label: `RFC ${number} § ${section}`,
  url: `https://www.rfc-editor.org/rfc/rfc${number}.html#section-${section}`,
});
const ref = (section: string) => rfc(5280, section);
const etsi: Reference = { label: 'ETSI EN 319 412-5', url: 'https://www.etsi.org/deliver/etsi_en/319400_319499/31941205/' };
const oidNames: Record<string, string> = {
  '1.2.840.113549.1.1.1': 'RSA', '1.2.840.113549.1.1.5': 'SHA-1 avec RSA',
  '1.2.840.113549.1.1.10': 'RSASSA-PSS', '1.2.840.113549.1.1.11': 'SHA-256 avec RSA',
  '1.2.840.113549.1.1.12': 'SHA-384 avec RSA', '1.2.840.113549.1.1.13': 'SHA-512 avec RSA',
  '1.2.840.10045.2.1': 'Clé publique EC', '1.2.840.10045.4.3.2': 'ECDSA avec SHA-256',
  '1.2.840.10045.4.3.3': 'ECDSA avec SHA-384', '1.2.840.10045.4.3.4': 'ECDSA avec SHA-512',
  '1.3.101.112': 'Ed25519', '1.3.101.113': 'Ed448',
  '1.2.840.10045.3.1.7': 'P-256 / prime256v1', '1.3.132.0.34': 'P-384', '1.3.132.0.35': 'P-521',
  '1.3.6.1.5.5.7.3.1': 'Authentification serveur', '1.3.6.1.5.5.7.3.2': 'Authentification client',
  '1.3.6.1.5.5.7.3.3': 'Signature de code', '1.3.6.1.5.5.7.3.4': 'Protection du courrier',
  '1.3.6.1.5.5.7.3.8': 'Horodatage', '1.3.6.1.5.5.7.3.9': 'Signature OCSP',
  '2.5.29.37.0': 'Tout usage étendu',
  '1.3.6.1.5.5.7.48.1': 'OCSP', '1.3.6.1.5.5.7.48.2': 'Certificat de l’autorité',
};
const dnNames: Record<string, string> = {
  '2.5.4.3': 'Nom commun', '2.5.4.6': 'Pays', '2.5.4.7': 'Localité', '2.5.4.8': 'État ou province',
  '2.5.4.10': 'Organisation', '2.5.4.11': 'Unité organisationnelle', '2.5.4.97': 'Identifiant d’organisation',
  '2.5.4.4': 'Nom', '2.5.4.42': 'Prénom', '2.5.4.5': 'Numéro de série du sujet',
  '1.2.840.113549.1.9.1': 'Adresse électronique',
};
const extInfo: Record<string, [string, string, string]> = {
  '2.5.29.14': ['Identifiant de clé du sujet', 'SubjectKeyIdentifier', '4.2.1.2'],
  '2.5.29.15': ['Usages de la clé', 'KeyUsage', '4.2.1.3'],
  '2.5.29.17': ['Noms alternatifs du sujet', 'SubjectAltName', '4.2.1.6'],
  '2.5.29.18': ['Noms alternatifs de l’émetteur', 'IssuerAltName', '4.2.1.7'],
  '2.5.29.19': ['Contraintes de base', 'BasicConstraints', '4.2.1.9'],
  '2.5.29.31': ['Distribution des CRL', 'CRLDistributionPoints', '4.2.1.13'],
  '2.5.29.32': ['Politiques du certificat', 'CertificatePolicies', '4.2.1.4'],
  '2.5.29.35': ['Identifiant de clé de l’autorité', 'AuthorityKeyIdentifier', '4.2.1.1'],
  '2.5.29.37': ['Usages étendus de la clé', 'ExtKeyUsageSyntax', '4.2.1.12'],
  '1.3.6.1.5.5.7.1.1': ['Accès à l’autorité', 'AuthorityInfoAccessSyntax', '4.2.2.1'],
  '1.3.6.1.5.5.7.1.3': ['QCStatements', 'QCStatements', '4.2'],
};
export function contentBytes(bytes: Uint8Array, node: Node) {
  return bytes.slice(node.id + node.header, node.contentEnd);
}
export function hexBytes(bytes: Uint8Array, separator = ' ') {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0').toUpperCase()).join(separator);
}
function namedOid(n?: Node) {
  if (!n) return 'Absent';
  return `${oidNames[n.value] || n.label || 'OID non référencé'} (${n.value})`;
}
function descendants(node: Node): Node[] { return [node, ...node.children.flatMap(descendants)]; }
function timeValue(bytes: Uint8Array, n: Node) {
  const raw = new TextDecoder().decode(contentBytes(bytes, n));
  const m = /^(\d{2}|\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(raw);
  if (!m) return `${raw} (format temporel non normalisé)`;
  const year = m[1].length === 2 ? (Number(m[1]) >= 50 ? '19' : '20') + m[1] : m[1];
  return `${year}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]} UTC`;
}
function generalName(bytes: Uint8Array, n: Node): [string, string] {
  const b = contentBytes(bytes, n);
  if (['[1]', '[2]', '[6]'].includes(n.type)) {
    return [{ '[1]': 'rfc822Name', '[2]': 'dNSName', '[6]': 'uniformResourceIdentifier' }[n.type]!, new TextDecoder().decode(b)];
  }
  if (n.type === '[7]') {
    if (b.length === 4) return ['iPAddress', Array.from(b).join('.')];
    if (b.length === 16) return ['iPAddress', Array.from({ length: 8 }, (_, i) => ((b[i * 2] << 8) | b[i * 2 + 1]).toString(16)).join(':')];
  }
  if (n.type === '[4]') return ['directoryName', descendants(n).filter(c => /String$/.test(c.type)).map(c => c.value).join(', ')];
  return [`GeneralName ${n.type}`, `Valeur non interprétée : ${hexBytes(b)}`];
}

/** Semantic values always retain the ASN.1 node that supplies their bytes. */
export function certificateFields(root: Node, bytes: Uint8Array): CertificateField[] {
  const fields: CertificateField[] = [];
  function add(node: Node | undefined, group: string, label: string, value: string, schema: string, references: Reference[], extra: Partial<CertificateField> = {}) {
    if (node) fields.push({ id: `${node.id}:${schema}`, node, group, label, value, schema, references, decoded: true, ...extra });
  }
  const tbs = root.children[0];
  const explicitVersion = tbs.children[0]?.type === '[0]';
  const offset = explicitVersion ? 1 : 0;
  const [serial, signature, issuer, validity, subject, spki] = tbs.children.slice(offset, offset + 6);
  if (explicitVersion) {
    const n = tbs.children[0].children[0];
    add(n, 'Général', 'Version', `v${Number(n.value) + 1}`, 'Version', [ref('4.1.2.1')]);
  } else add(tbs, 'Général', 'Version', 'v1 (valeur par défaut, aucun octet dédié)', 'Version DEFAULT v1', [ref('4.1.2.1')], { derived: true });
  add(serial, 'Général', 'Numéro de série', hexBytes(contentBytes(bytes, serial), ':'), 'CertificateSerialNumber', [ref('4.1.2.2')]);
  add(signature, 'Général', 'Signature annoncée dans TBSCertificate', namedOid(signature.children[0]), 'AlgorithmIdentifier', [ref('4.1.2.3')]);
  add(root.children[1], 'Signature', 'Algorithme de signature', namedOid(root.children[1].children[0]), 'AlgorithmIdentifier', [ref('4.1.1.2')]);
  for (const [node, group, section] of [[issuer, 'Émetteur', '4.1.2.4'], [subject, 'Sujet', '4.1.2.6']] as const) {
    add(node, '_structure', group, node.children.flatMap(rdn => rdn.children).map(a => a.children[1]?.value ?? '').join(', '), 'Name / RDNSequence', [ref(section)]);
    for (const rdn of node.children) for (const attribute of rdn.children) {
      const [oid, value] = attribute.children;
      if (oid && value) add(attribute, '_structure', dnNames[oid.value] ?? oid.value, value.value, 'AttributeTypeAndValue', [ref(section)]);
      if (oid && value) add(value, group, dnNames[oid.value] ?? oid.value, value.value, `AttributeTypeAndValue.value (${oid.value})`, [ref(section)]);
    }
  }
  add(validity, '_structure', 'Période de validité', validity.children.map(n => timeValue(bytes, n)).join(' → '), 'Validity', [ref('4.1.2.5')]);
  add(spki, '_structure', 'Clé publique', namedOid(spki.children[0]?.children[0]), 'SubjectPublicKeyInfo', [ref('4.1.2.7')]);
  validity.children.forEach((n, i) => add(n, 'Validité', i === 0 ? 'Valide à partir du' : 'Valide jusqu’au', timeValue(bytes, n), i === 0 ? 'Validity.notBefore / Time' : 'Validity.notAfter / Time', [ref('4.1.2.5')]));
  const [keyAlgorithm, key] = spki.children;
  add(keyAlgorithm, 'Clé publique', 'Algorithme', namedOid(keyAlgorithm?.children[0]), 'SubjectPublicKeyInfo.algorithm', [ref('4.1.2.7')]);
  if (keyAlgorithm?.children[0]?.value === '1.2.840.113549.1.1.1') {
    const [modulus, exponent] = key?.children[0]?.children ?? [];
    if (modulus) {
      const raw = contentBytes(bytes, modulus); const first = raw.findIndex(b => b !== 0);
      const bits = first < 0 ? 0 : (raw.length - first - 1) * 8 + (32 - Math.clz32(raw[first]));
      add(modulus, 'Clé publique', 'Module RSA', `${bits} bits\n${hexBytes(raw)}`, 'RSAPublicKey.modulus', [rfc(3279, '2.3.1')]);
    }
    add(exponent, 'Clé publique', 'Exposant RSA', exponent?.value ?? '', 'RSAPublicKey.publicExponent', [rfc(3279, '2.3.1')]);
  } else {
    if (keyAlgorithm?.children[1]) add(keyAlgorithm.children[1], 'Clé publique', 'Paramètres / courbe', keyAlgorithm.children[1].type === 'OBJECT_IDENTIFIER' ? namedOid(keyAlgorithm.children[1]) : keyAlgorithm.children[1].value, 'AlgorithmIdentifier.parameters', [ref('4.1.2.7')]);
    if (key) add(key, 'Clé publique', 'Valeur de la clé publique', hexBytes(contentBytes(bytes, key).slice(1)), 'SubjectPublicKeyInfo.subjectPublicKey', [ref('4.1.2.7')]);
  }
  const extensions = tbs.children.find(n => n.type === '[3]')?.children[0]?.children ?? [];
  for (const extension of extensions) {
    const oid = extension.children[0]?.value;
    const octets = extension.children.find(n => n.type === 'OCTET_STRING');
    if (!oid || !octets) continue;
    const critical = extension.children.some(n => n.type === 'BOOLEAN' && contentBytes(bytes, n)[0] !== 0);
    const inner = octets.children[0];
    const info = extInfo[oid];
    const group = info?.[0] ?? `Extension ${oid}`;
    const references = oid === '1.3.6.1.5.5.7.1.3' ? [rfc(3739, '3.2.6'), etsi] : [ref(info?.[2] ?? '4.2')];
    const start = fields.length;
    const emit = (n: Node, label: string, value: string, schema = info?.[1] ?? 'Extension.extnValue') => add(n, group, label, value, schema, references, { critical });
    const expectedType = oid === '2.5.29.15' ? 'BIT_STRING' : oid === '2.5.29.14' ? 'OCTET_STRING' : 'SEQUENCE';
    if (inner && inner.type === expectedType) switch (oid) {
      case '2.5.29.19': {
        const ca = inner.children.find(n => n.type === 'BOOLEAN');
        emit(ca ?? inner, 'Autorité de certification', ca && contentBytes(bytes, ca)[0] ? 'Oui (cA = TRUE)' : 'Non (cA = FALSE)', 'BasicConstraints.cA');
        const path = inner.children.find(n => n.type === 'INTEGER');
        if (path) emit(path, 'Longueur maximale du chemin', path.value, 'BasicConstraints.pathLenConstraint');
        break;
      }
      case '2.5.29.15': {
        const bits = contentBytes(bytes, inner);
        const labels = ['Signature numérique (digitalSignature)', 'Engagement de contenu (contentCommitment / nonRepudiation)', 'Chiffrement de clé (keyEncipherment)', 'Chiffrement des données (dataEncipherment)', 'Accord de clé (keyAgreement)', 'Signature de certificats (keyCertSign)', 'Signature de CRL (cRLSign)', 'Chiffrement uniquement (encipherOnly)', 'Déchiffrement uniquement (decipherOnly)'];
        emit(inner, 'Usages autorisés', labels.filter((_, i) => i < (bits.length - 1) * 8 - bits[0] && (bits[1 + (i >> 3)] & (0x80 >> (i % 8)))).join('\n') || 'Aucun bit positionné');
        break;
      }
      case '2.5.29.37': inner.children.forEach(n => emit(n, 'Usage étendu', namedOid(n), 'KeyPurposeId')); break;
      case '2.5.29.17': case '2.5.29.18':
        inner.children.forEach(n => { const [type, value] = generalName(bytes, n); emit(n, type, value, `GeneralName.${type}`); }); break;
      case '2.5.29.14': emit(inner, 'Identifiant', hexBytes(contentBytes(bytes, inner), ':'), 'SubjectKeyIdentifier / KeyIdentifier'); break;
      case '2.5.29.35':
        inner.children.forEach(n => {
          if (n.type === '[0]') emit(n, 'Identifiant de clé', hexBytes(contentBytes(bytes, n), ':'), 'AuthorityKeyIdentifier.keyIdentifier');
          else if (n.type === '[2]') emit(n, 'Numéro de série de l’autorité', hexBytes(contentBytes(bytes, n), ':'), 'AuthorityKeyIdentifier.authorityCertSerialNumber');
          else if (n.type === '[1]') n.children.forEach(c => { const [type, value] = generalName(bytes, c); emit(c, type, value, 'AuthorityKeyIdentifier.authorityCertIssuer'); });
        }); break;
      case '2.5.29.32':
        inner.children.forEach(policy => {
          const id = policy.children[0]; if (id) emit(id, 'Identifiant de politique', id.value, 'PolicyInformation.policyIdentifier');
          for (const qualifier of policy.children[1]?.children ?? []) {
            const [id, value] = qualifier.children;
            if (id && value) emit(value, id.value === '1.3.6.1.5.5.7.2.1' ? 'Déclaration des pratiques (CPS)' : `Qualificatif ${id.value}`, value.type.endsWith('String') ? value.value : descendants(value).filter(n => !n.children.length).map(n => n.value).join(' · '), 'PolicyQualifierInfo.qualifier');
          }
        }); break;
      case '1.3.6.1.5.5.7.1.1':
        inner.children.forEach(access => { const [method, location] = access.children; if (method && location) emit(location, oidNames[method.value] ?? method.value, generalName(bytes, location)[1], 'AccessDescription.accessLocation'); }); break;
      case '2.5.29.31':
        descendants(inner).filter(n => n.type === '[6]').forEach(n => emit(n, 'URI de distribution', generalName(bytes, n)[1], 'DistributionPoint.fullName / GeneralName.uniformResourceIdentifier')); break;
      case '1.3.6.1.5.5.7.1.3':
        inner.children.forEach(statement => {
          const id = statement.children[0]; if (!id) return;
          const information = statement.children[1];
          const value = !information ? `Déclaration présente (${id.value})` : descendants(information).filter(n => !n.children.length).map(n => n.label ? `${n.label} (${n.value})` : n.value).join('\n');
          emit(statement, id.label || id.value, value, 'QCStatement');
        }); break;
    }
    if (fields.length === start) add(octets, group, 'Valeur brute — non interprétée', hexBytes(contentBytes(bytes, octets)), 'Extension.extnValue', references, { critical, decoded: false });
    // Container metadata is useful for selections on extension headers and OIDs.
    add(extension, 'Extensions', group, `${oid} · ${critical ? 'critique' : 'non critique'}`, `Extension (${info?.[1] ?? oid})`, references, { critical, decoded: !!info });
  }
  const signatureBytes = contentBytes(bytes, root.children[2]);
  add(root.children[2], 'Signature', 'Valeur de la signature', hexBytes(signatureBytes.slice(1)), 'Certificate.signatureValue', [ref('4.1.1.3')]);
  return fields;
}

export function fieldAtNode(fields: CertificateField[], node: Node) {
  return fields.filter(f => !f.derived && f.node.id <= node.id && f.node.end >= node.end)
    .sort((a, b) => (a.node.end - a.node.id) - (b.node.end - b.node.id))[0];
}
