import {createContext, useContext, type ReactNode} from 'react';

const translations: Record<string,string> = {
  'SHA-256 avec RSA':'SHA-256 with RSA', 'RSA':'RSA',
  'Structure ASN.1':'ASN.1 structure','Tout déplier':'Expand all','Tout replier':'Collapse all','Arbre ASN.1':'ASN.1 tree',
  'Déplier':'Expand','Replier':'Collapse','éléments':'elements','éléments accessibles · couleurs par niveau':'visible elements · colours by depth',
  'Certificat X.509':'X.509 certificate','valeurs':'values','Déclarations présentes dans le certificat.':'Statements contained in the certificate.',
  'Sélectionnez une valeur pour retrouver ses octets.':'Select a value to locate its bytes.',
  'La conformité et la confiance ne sont pas vérifiées.':'Compliance and trust are not verified.',
  'Cet objet n’est pas reconnu comme un certificat X.509.':'This object is not recognised as an X.509 certificate.',
  'Aucun QCStatement présent.':'No QCStatements present.','Critique':'Critical',
  'Valeurs reliées à leur encodage · aucune requête OCSP ou CRL':'Values linked to their encoding · no OCSP or CRL requests',
  'Vue hexadécimale':'Hexadecimal view','Valeur en surimpression':'Value overlay','Longueur':'Length','Contenu':'Content',
  'longueur':'length','contenu':'content','fin BER':'BER end','sélectionner le champ':'select field',
  'Octets du certificat':'Certificate bytes','Octet':'Byte','Valeur décodée en surimpression':'Decoded value overlay',
  'Masquer la surimpression':'Hide overlay','LECTURE X.509':'X.509 READING','LECTURE ASN.1':'ASN.1 READING',
  'Structure composée':'Constructed structure','Contexte à':'Context at','Sélection':'Selection',
  'octets sélectionnés · cliquez un octet pour retrouver son champ':'selected bytes · click a byte to locate its field',
  'Fin BER (EOC)':'BER end (EOC)','Détail de la sélection':'Selection details','CHAMP SÉLECTIONNÉ · NIVEAU':'SELECTED FIELD · DEPTH',
  'Contexte X.509':'X.509 context','Type X.509':'X.509 type','Non identifié pour ce nœud':'Not identified for this node',
  'Début':'Start','Fin exclusive':'Exclusive end','Vide':'Empty','octets supplémentaires':'additional bytes',
  'Vues du certificat':'Certificate views','Structure & octets':'Structure & bytes','Une sélection commune aux trois vues':'One selection across all three views',
  'Général':'General','Sujet':'Subject','Émetteur':'Issuer','Validité':'Validity','Clé publique':'Public key','Signature':'Signature',
  'Période de validité':'Validity period','Algorithme de signature':'Signature algorithm','Numéro de série':'Serial number',
  'Signature annoncée dans TBSCertificate':'Signature declared in TBSCertificate','Version':'Version',
  'Nom commun':'Common name','Pays':'Country','Localité':'Locality','État ou province':'State or province','Organisation':'Organisation',
  'Unité organisationnelle':'Organisational unit','Identifiant d’organisation':'Organisation identifier','Identifiant organisation':'Organisation identifier',
  'Nom':'Surname','Prénom':'Given name','Numéro de série du sujet':'Subject serial number','Adresse électronique':'Email address',
  'Valide à partir du':'Not before','Valide jusqu’au':'Not after','Algorithme':'Algorithm','Module RSA':'RSA modulus','Exposant RSA':'RSA exponent',
  'Paramètres / courbe':'Parameters / curve','Valeur de la clé publique':'Public key value',
  'Identifiant de clé du sujet':'Subject key identifier','Identifiant de clé de l’autorité':'Authority key identifier',
  'Usages de la clé':'Key usage','Usage de clé':'Key usage','Usages étendus de la clé':'Extended key usage','Usage étendu de clé':'Extended key usage',
  'Noms alternatifs du sujet':'Subject alternative names','Noms alternatifs de l’émetteur':'Issuer alternative names','Noms alternatifs':'Alternative names',
  'Contraintes de base':'Basic constraints','Distribution des CRL':'CRL distribution points','Points de distribution CRL':'CRL distribution points',
  'Politiques du certificat':'Certificate policies','Accès à l’autorité':'Authority information access','Accès aux informations de l’autorité':'Authority information access',
  'Autorité de certification':'Certificate authority','Longueur maximale du chemin':'Maximum path length','Usages autorisés':'Permitted usages',
  'Usage étendu':'Extended usage','Identifiant':'Identifier','Identifiant de clé':'Key identifier','Numéro de série de l’autorité':'Authority serial number',
  'Identifiant de politique':'Policy identifier','Déclaration des pratiques (CPS)':'Certification practice statement (CPS)',
  'URI de distribution':'Distribution URI','Valeur brute — non interprétée':'Raw value — not interpreted','Valeur de la signature':'Signature value',
  'Signature électronique':'Electronic signature','Cachet électronique':'Electronic seal','Authentification de site web':'Website authentication',
  'Collez un certificat ou une structure ASN.1.':'Paste a certificate or ASN.1 structure.',
  'Encodage non reconnu. Utilisez PEM, Base64, hexadécimal ou DER.':'Unrecognised encoding. Use PEM, Base64, hexadecimal or DER.',
  'Cette version accepte jusqu’à 256 Ko.':'This decoder accepts up to 256 KiB.',
  'Structure trop complexe pour cette version.':'This structure exceeds the decoder’s complexity limits.',
  'Données supplémentaires après la structure ASN.1. Importez un seul objet.':'Additional data after the ASN.1 structure. Import a single object.',
};
const LocaleContext=createContext<'fr'|'en'>('fr');
export const LocaleProvider=({lang,children}:{lang:'fr'|'en';children:ReactNode})=><LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>;
export function useLocale(){const lang=useContext(LocaleContext);return {lang,t:(text:string)=>translate(text,lang)};}
export function translate(text:string,lang:'fr'|'en'){return lang==='en'?(translations[text]??text):text;}

// Translate only explanatory values, never subject names, email addresses or raw bytes.
export function fieldValue(value:string,schema:string,lang:'fr'|'en'){
  if(lang==='fr'||/AttributeTypeAndValue|GeneralName|CertificateSerialNumber/.test(schema))return value;
  let result=value;
  for(const [from,to] of Object.entries({'Clé publique EC':'EC public key','SHA-1 avec RSA':'SHA-1 with RSA','SHA-256 avec RSA':'SHA-256 with RSA','SHA-384 avec RSA':'SHA-384 with RSA','SHA-512 avec RSA':'SHA-512 with RSA','ECDSA avec SHA-256':'ECDSA with SHA-256','ECDSA avec SHA-384':'ECDSA with SHA-384','ECDSA avec SHA-512':'ECDSA with SHA-512','Authentification serveur':'Server authentication','Authentification client':'Client authentication','Signature de code':'Code signing','Protection du courrier':'Email protection','Horodatage':'Time-stamping','Signature OCSP':'OCSP signing','Tout usage étendu':'Any extended usage','Certificat de l’autorité':'Issuer certificate','OID non référencé':'Unlisted OID','Non (cA = FALSE)':'No (cA = FALSE)','Oui (cA = TRUE)':'Yes (cA = TRUE)','Signature numérique':'Digital signature','Engagement de contenu':'Content commitment','Chiffrement de clé':'Key encipherment','Chiffrement des données':'Data encipherment','Accord de clé':'Key agreement','Signature de certificats':'Certificate signing','Signature de CRL':'CRL signing','Chiffrement uniquement':'Encipher only','Déchiffrement uniquement':'Decipher only','Aucun bit positionné':'No bits set','valeur par défaut, aucun octet dédié':'default value, no dedicated bytes','Déclaration présente':'Statement present','Signature électronique':'Electronic signature','Cachet électronique':'Electronic seal','Authentification de site web':'Website authentication','non critique':'non-critical','critique':'critical'}))result=result.replaceAll(from,to);
  return result;
}
