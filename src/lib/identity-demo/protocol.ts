/** A closed, fictional SD-JWT+KB teaching fixture. Not a general-purpose verifier.
 * All keys are ephemeral, non-exportable private CryptoKeys. No network/storage.
 * OAuth, metadata, certificate trust, status and hardware attestation are outside
 * this local demonstration; its ES256 signatures and SHA-256 checks are real.
 */
export const ISSUER = 'https://issuer.example.test';
export const RP_A = 'x509_san_dns:rp-a.example.test';
export const RP_B = 'x509_san_dns:rp-b.example.test';
export const claims = [
 {name:'qualification_valid',value:true},
 {name:'name',value:'Camille Exemple'},
 {name:'birthdate',value:'1999-04-12'},
 {name:'address',value:'Adresse fictive / fictional address'},
] as const;
export type ClaimName = typeof claims[number]['name'];
export interface Presentation {sdjwt:string; kbjwt:string;}
export interface Verification {
 issuer:boolean; validity:boolean; disclosures:boolean; holder:boolean;
 hash:boolean; audience:boolean; nonce:boolean; fresh:boolean; required:boolean; requested:boolean; ok:boolean;
 revealed:Record<string,unknown>;
}
const utf8=new TextEncoder();
function b64(bytes:Uint8Array){return btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replace(/=+$/,'');}
function bytes(encoded:string){const raw=atob(encoded.replaceAll('-','+').replaceAll('_','/'));return Uint8Array.from(raw,c=>c.charCodeAt(0));}
function encode(value:unknown){return b64(utf8.encode(JSON.stringify(value)));}
export function decodePart(value:string){return JSON.parse(new TextDecoder().decode(bytes(value)));}
export async function digest(value:string){return b64(new Uint8Array(await crypto.subtle.digest('SHA-256',utf8.encode(value))));}
function random(){return b64(crypto.getRandomValues(new Uint8Array(16)));}
async function keyPair(){return crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);}
async function sign(header:Record<string,unknown>,payload:Record<string,unknown>,key:CryptoKey){
 const input=encode(header)+'.'+encode(payload);
 const signature=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,utf8.encode(input));
 return input+'.'+b64(new Uint8Array(signature));
}
async function signature(jwt:string,key:CryptoKey){
 try {const [h,p,s]=jwt.split('.');if(!h||!p||!s||jwt.split('.').length!==3)return false;
  if(decodePart(h).alg!=='ES256')return false;
  return await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,bytes(s),utf8.encode(h+'.'+p));
 } catch{return false;}
}
export async function createIdentityDemo(){
 const [issuer,holder,other]=await Promise.all([keyPair(),keyPair(),keyPair()]);
 const holderJwk=await crypto.subtle.exportKey('jwk',holder.publicKey);
 let nonceA=random();
 const nonceB=random(),cNonce=random();
 const now=Math.floor(Date.now()/1000);
 const disclosures=await Promise.all(claims.map(async claim=>{
  const disclosure=encode([random(),claim.name,claim.value]);
  return {name:claim.name,value:claim.value,encoded:disclosure,hash:await digest(disclosure)};
 }));
 const payload={iss:ISSUER,vct:'https://issuer.example.test/credentials/qualification',iat:now,exp:now+3600,cnf:{jwk:holderJwk},_sd_alg:'sha-256',_sd:disclosures.map(d=>d.hash).sort()};
 const credential=await sign({alg:'ES256',typ:'dc+sd-jwt'},payload,issuer.privateKey);
 const issuanceProof=await sign({alg:'ES256',typ:'openid4vci-proof+jwt',jwk:holderJwk},{aud:ISSUER,iat:now,nonce:cNonce},holder.privateKey);
 const proofBody=decodePart(issuanceProof.split('.')[1]);
 const issuanceProofValid=await signature(issuanceProof,holder.publicKey)&&proofBody.aud===ISSUER&&proofBody.nonce===cNonce;
 const request={response_type:'vp_token',response_mode:'direct_post',client_id:RP_A,response_uri:'https://rp-a.example.test/response',nonce:nonceA,dcql_query:{credentials:[{id:'qualification',format:'dc+sd-jwt',meta:{vct_values:[payload.vct]},claims:[{path:['qualification_valid']}]}]}};
 function setRequestedClaims(names:ClaimName[]){
  nonceA=random();request.nonce=nonceA;
  request.dcql_query.credentials[0].claims=names.map(name=>({path:[name]}));
 }
 async function present(selected:ClaimName[],wrongKey=false):Promise<Presentation>{
  // Always preserve fixture order; include only the chosen disclosures.
  const chosen=disclosures.filter(d=>selected.includes(d.name));
  const sdjwt=credential+'~'+chosen.map(d=>d.encoded+'~').join('');
  const kbjwt=await sign({alg:'ES256',typ:'kb+jwt'},{aud:RP_A,nonce:nonceA,iat:Math.floor(Date.now()/1000),sd_hash:await digest(sdjwt)},wrongKey?other.privateKey:holder.privateKey);
  return {sdjwt,kbjwt};
 }
 async function verify(presentation:Presentation,recipient=RP_A,challenge=nonceA):Promise<Verification>{
  const result:Verification={issuer:false,validity:false,disclosures:false,holder:false,hash:false,audience:false,nonce:false,fresh:false,required:false,requested:false,ok:false,revealed:{}};
  const requestedNames=request.dcql_query.credentials[0].claims.map(claim=>claim.path[0]);
  try {
   const chunks=presentation.sdjwt.split('~');const issuerJwt=chunks.shift()!;
   if(chunks.pop()!==''||new Set(chunks).size!==chunks.length)return result;
   const body=decodePart(issuerJwt.split('.')[1]);
   result.issuer=await signature(issuerJwt,issuer.publicKey)&&body.iss===ISSUER;
   const time=Math.floor(Date.now()/1000);
   result.validity=body.iat<=time&&body.exp>time&&body.vct===payload.vct;
   result.disclosures=body._sd_alg==='sha-256'&&Array.isArray(body._sd);
   for(const encoded of chunks){
    const disclosure=decodePart(encoded);
    if(!Array.isArray(disclosure)||disclosure.length!==3||!body._sd.includes(await digest(encoded))){result.disclosures=false;continue;}
    const name=disclosure[1];
    if(typeof name!=='string'||Object.hasOwn(result.revealed,name)){result.disclosures=false;continue;}
    // Null-prototype handling is unnecessary for the closed fixture, but avoid setters.
    Object.defineProperty(result.revealed,name,{value:disclosure[2],enumerable:true});
   }
   const kbHeader=decodePart(presentation.kbjwt.split('.')[0]);
   const kb=decodePart(presentation.kbjwt.split('.')[1]);
   const boundKey=await crypto.subtle.importKey('jwk',body.cnf.jwk,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
   result.holder=kbHeader.typ==='kb+jwt'&&await signature(presentation.kbjwt,boundKey);
   result.hash=kb.sd_hash===await digest(presentation.sdjwt);
   result.audience=kb.aud===recipient;
   result.nonce=kb.nonce===challenge;
   result.fresh=typeof kb.iat==='number'&&kb.iat<=time+5&&time-kb.iat<120;
   result.required=result.revealed.qualification_valid===true;
   result.requested=Object.keys(result.revealed).length===requestedNames.length&&requestedNames.every(name=>Object.hasOwn(result.revealed,name));
   result.ok=['issuer','validity','disclosures','holder','hash','audience','nonce','fresh','required','requested'].every(k=>result[k as keyof Verification]===true);
  }catch{/* A malformed fixture fails closed. */}
  return result;
 }
 return {
  credential,payload,holderJwk,disclosures,get nonceA(){return nonceA;},nonceB,cNonce,issuanceProof,issuanceProofValid,present,verify,setRequestedClaims,request,
  issuanceRequest:{credential_configuration_id:'qualification_sdjwt',proofs:{jwt:[issuanceProof]}},
  issuanceResponse:{credentials:[{credential:credential+'~'+disclosures.map(d=>d.encoded+'~').join('')}]},

 };
}
export type IdentityDemo=Awaited<ReturnType<typeof createIdentityDemo>>;
