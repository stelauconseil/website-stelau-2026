// A small, scoped adapter keeps the original course engines and their GSAP timelines intact.
const dictionary:Record<string,string> = {
 'TLS 1.2 · quatre rôles complémentaires':'TLS 1.2 · four complementary roles',
 'Établir un secret partagé':'Establish a shared secret',
 'Clé publique client':'Client public key', 'Clé publique serveur':'Server public key',
 'ECDHE · les clés privées restent locales':'ECDHE · private keys stay local',
 'Authentifier le serveur':'Authenticate the server',
 'Client vérifie':'Client verifies', 'Serveur signe':'Server signs',
 'Certificat + signature des paramètres ECDHE':'Certificate + signature of ECDHE parameters',
 'Protéger les échanges':'Protect the exchange',
 'AES-128-GCM · chiffrement authentifié':'AES-128-GCM · authenticated encryption',
 'Dériver les clés et confirmer l’échange':'Derive keys and confirm the exchange',
 'Secret + aléas':'Secret + randoms',
 'HMAC-SHA256 · clés et empreinte du transcript':'HMAC-SHA256 · keys and transcript hash',
 'les carottes sont cuites':'the carrots are cooked',
 'Titulaire':'Holder', 'génère sa bi-clé':'generates a key pair', "clé privée de l'AC":'CA private key',
 'Benoit Leger-Derville Stelau valide 3 ans':'Benoit Leger-Derville\nStelau\nvalid for 3 years',
 'Assemblage cryptographique · TLS':'Cryptographic assembly · TLS',
 'TLS 1.3 · authentification serveur':'TLS 1.3 · server authentication',
 'Clés de handshake':'Handshake keys', 'Certificate · identité serveur':'Certificate · server identity',
 'CertificateVerify · signature du transcript':'CertificateVerify · transcript signature',
 'Serveur puis client':'Server, then client', 'Finished · HMAC du transcript':'Finished · transcript HMAC',
 'HKDF · clés applicatives':'HKDF · application keys', 'Données · chiffrement AEAD':'Data · AEAD encryption',
 'Chiffré':'Ciphertext', 'Chiffré′':'Ciphertext′', 'chiffré′':'ciphertext′',
 'bits sur 128 ont changé':'bits out of 128 changed',
 'Un code calculé localement':'A locally computed code', 'T = ⌊ heure Unix / 30 ⌋':'T = ⌊ Unix time / 30 ⌋',
 'Secret K à saisir dans votre application (Base32)':'Secret K for your authenticator (Base32)',
 'Animation des primitives cryptographiques : AES, RSA, SHA, Diffie-Hellman, PRNG':'Cryptographic primitives animation: AES, RSA, SHA, Diffie–Hellman, PRNG',
 'Les 5 primitives en action':'The 5 primitives in action',
 'Chiffrement symétrique':'Symmetric encryption','Chiffrement asymétrique':'Asymmetric cryptography',
 '· chiffrement':'· encryption','· signature':'· signature','Fonctions de hachage':'Hash functions',
 'Établissement de clé':'Key agreement','Générateurs d’aléa':'Random generators',"Générateurs d'aléa":'Random generators',
 '· déterministe : même graine, même suite':'· deterministic: same seed, same sequence',
 'graine':'seed','aléa':'random','clé publique':'public key','clé privée':'private key','le secret':'the secret',
 'Assemblage cryptographique':'Cryptographic assembly','Certificat électronique':'Electronic certificate',
 "Ce n'est pas une primitive cryptographique":'It is not a cryptographic primitive',
 "C'est un":'It is an',"assemblage":'assembly',"C'est un fichier comme un autre":'It is a file like any other',
 'identité':'identity','qui ?':'who?','du titulaire':'of the holder',
 "signature de l'identité par un tiers":'identity signed by a third party',
 "l'autorité de certification":'the certification authority',
 'Sujet':'Subject',"valide 3 ans":'valid for 3 years','Clé publique':'Public key',
 "Signature de l'AC":'CA signature','identité + clé publique + signature d’un tiers':'identity + public key + third-party signature',
 "identité + clé publique + signature d'un tiers":'identity + public key + third-party signature',
 'Empreinte · id ‖ clé':'Digest · id ‖ key','Vérification':'Verification',"pièce d'identité, face à face":'identity document, face to face',
 'Autorité de certification':'Certification authority','le tiers de confiance':'the trusted third party',
 'Bi-clé du titulaire':'Holder’s key pair','la clé privée reste secrète':'the private key remains secret',
 'Une suite de chiffrement, quatre primitives':'One cipher suite, four primitives',
 "TLS 1.3 ne nomme plus que le chiffrement et le hachage (":'TLS 1.3 names only the cipher and hash (',
 ") : l'échange de clés (ECDHE) et la signature (RSA, ECDSA) se négocient à part.":'): key exchange (ECDHE) and signatures (RSA, ECDSA) are negotiated separately.',
 'Serveur':'Server','Identité client':'Client identity','Aléa client':'Client randomness','Identité serveur':'Server identity','Aléa serveur':'Server randomness',
 'Échange de clés':'Key exchange','Secret':'Secret','Chiffrement authentifié':'Authenticated encryption',
 'Toujours au cœur du chiffrement symétrique moderne ·':'Still at the heart of modern symmetric encryption ·',
 'Confusion':'Confusion','Diffusion':'Diffusion','et':'and',
 "Un tour d'AES : substitution, permutation, mélange, clé":'One AES round: substitution, permutation, mixing, key',
 '⊕ clé de tour : seule la':'⊕ round key: only the','clé':'key','est secrète':'is secret',
 'par':'through','substitution':'substitution','(boîte S)':'(S-box)','permutation':'permutation','par mélange des colonnes':'by mixing columns',
 '× 10 tours':'× 10 rounds','les 4 opérations, encore et encore':'the operations, round after round',
 'Clair':'Plaintext','état : 16 octets, 4 lignes × 4 colonnes':'state: 16 bytes, 4 rows × 4 columns',
 'Bloc clair et clé':'Plaintext block and key','clair':'plaintext','chiffré':'ciphertext','clair′':'plaintext′',
 'Exemple de la norme FIPS-197, annexe B':'FIPS-197 example, Appendix B',
 "Chaque octet est combiné (⊕, XOR) avec l'octet de la clé de tour.":'Each byte is combined (⊕, XOR) with a round-key byte.',
 ': la boîte S':': the S-box','Chaque octet est remplacé par un autre, lu dans une table de 256 cases.':'Each byte is replaced using a table of 256 values.',
 ': la permutation':': permutation',': le mélange':': mixing',
 "La ligne":'Row',"tourne de":'rotates by',"cases vers la gauche : les octets d'une colonne se dispersent dans les 4 colonnes.":'positions to the left: bytes spread across all four columns.',
 'Chaque colonne est multipliée par une matrice :':'Each column is multiplied by a matrix:',
 'chaque octet de sortie dépend des 4 octets':'each output byte depends on all four bytes','de la colonne.':'of the column.',
 '10 tours plus tard':'10 rounds later','Identique au vecteur de test de la norme.':'Matches the standard’s test vector.',
 'Effet avalanche':'Avalanche effect','On change':'Change','1 seul bit':'just 1 bit','du clair :':'in the plaintext:',
 'bits changés':'changed bits','Hachage cryptographique · Secure Hash Algorithm':'Cryptographic hashing · Secure Hash Algorithm',
 'Du secret partagé au code à 6 chiffres : TOTP':'From a shared secret to a six-digit code: TOTP',
 'HMAC-SHA1(K, T) · 20 octets':'HMAC-SHA1(K, T) · 20 bytes',
 "4 octets à partir de l'offset, bit de poids fort à 0":'4 bytes from the offset, most significant bit cleared',
 'Secret en Base32':'Secret in Base32','le même secret, partagé une seule fois':'the same secret, shared once',
 'Exemple pédagogique':'Teaching example','un bit du clair change':'one plaintext bit changes',
};
export function localizeScene(root:HTMLElement,lang:string){
 if(lang!=='en')return ()=>{};
 const translate=(input:string)=>{
  const clean=input.replace(/\s+/g,' ').trim();
  const value=dictionary[clean];
  if(value)return input.replace(input.trim(),value);
  if(/^Tour \d+$/.test(clean))return input.replace('Tour ','Round ');
  return input;
 };
 const visit=(node:Node)=>{
  if(node.nodeType===Node.TEXT_NODE){const next=translate(node.textContent||'');if(next!==node.textContent)node.textContent=next;return;}
  if(node instanceof Element){
   for(const attr of ['aria-label','title','alt']){const v=node.getAttribute(attr);if(v){const next=translate(v);if(next!==v)node.setAttribute(attr,next);}}
   node.childNodes.forEach(visit);
  }
 };
 visit(root);
 const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')visit(r.target);else r.addedNodes.forEach(visit);}});
 observer.observe(root,{subtree:true,childList:true,characterData:true});
 return ()=>observer.disconnect();
}
