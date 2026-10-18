import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createIdentityDemo,decodePart,RP_A,RP_B,ISSUER} from '../../src/lib/identity-demo/protocol.ts';

test('issuance proof uses the holder key bound into the issuer-signed credential',async()=>{
 const d=await createIdentityDemo();
 assert.equal(d.issuanceProofValid,true);
 const [header,body]=d.issuanceProof.split('.').slice(0,2).map(decodePart);
 assert.equal(header.typ,'openid4vci-proof+jwt');
 assert.deepEqual(header.jwk,d.payload.cnf.jwk);
 assert.equal(body.aud,ISSUER);assert.equal(body.nonce,d.cNonce);
 assert.equal('d' in d.holderJwk,false);
 assert.equal(d.issuanceResponse.credentials.length,1);
});
test('selective disclosure releases only the chosen claims, retaining the issuer signature',async()=>{
 const d=await createIdentityDemo();
 const minimal=await d.present(['qualification_valid']);
 const unsolicited=await d.present(['qualification_valid','name']);
 const a=await d.verify(minimal);
 assert.equal((await d.verify(unsolicited)).requested,false,'unsolicited disclosure is rejected');
 const oldNonce=d.nonceA;
 d.setRequestedClaims(['qualification_valid','name']);
 assert.notEqual(d.nonceA,oldNonce);assert.equal(d.request.nonce,d.nonceA);
 assert.equal((await d.verify(minimal)).nonce,false);
 const expanded=await d.present(['qualification_valid','name']);
 assert.equal(minimal.sdjwt.split('~')[0],expanded.sdjwt.split('~')[0]);
 const b=await d.verify(expanded);
 assert.equal(a.ok,true);assert.deepEqual(a.revealed,{qualification_valid:true});
 assert.equal(b.ok,true);assert.deepEqual(b.revealed,{qualification_valid:true,name:'Camille Exemple'});
 assert.equal('birthdate' in b.revealed,false);assert.equal('address' in b.revealed,false);
});
test('copying a credential without the bound private key fails holder proof validation',async()=>{
 const d=await createIdentityDemo();
 const result=await d.verify(await d.present(['qualification_valid'],true));
 assert.equal(result.issuer,true);assert.equal(result.disclosures,true);assert.equal(result.hash,true);
 assert.equal(result.audience,true);assert.equal(result.nonce,true);
 assert.equal(result.holder,false);assert.equal(result.ok,false);
});
test('a valid presentation cannot be replayed to a different RP or a new challenge',async()=>{
 const d=await createIdentityDemo(),p=await d.present(['qualification_valid']);
 const b=await d.verify(p,RP_B,d.nonceB);
 assert.equal(b.holder,true);assert.equal(b.issuer,true);assert.equal(b.hash,true);
 assert.equal(b.audience,false);assert.equal(b.nonce,false);assert.equal(b.ok,false);
 const newChallenge=await d.verify(p,RP_A,d.nonceB);
 assert.equal(newChallenge.audience,true);assert.equal(newChallenge.nonce,false);assert.equal(newChallenge.ok,false);
});
test('adding or modifying disclosures invalidates the binding or the issuer commitments',async()=>{
 const d=await createIdentityDemo(),p=await d.present(['qualification_valid']);
 const extra={...p,sdjwt:p.sdjwt+d.disclosures[1].encoded+'~'};
 const a=await d.verify(extra);assert.equal(a.disclosures,true);assert.equal(a.hash,false);assert.equal(a.ok,false);
 const changed=decodePart(d.disclosures[0].encoded);changed[2]=false;
 const tampered=p.sdjwt.replace(d.disclosures[0].encoded,Buffer.from(JSON.stringify(changed)).toString('base64url'));
 const modified=await d.verify({...p,sdjwt:tampered});
 assert.equal(modified.issuer,true);assert.equal(modified.disclosures,false);assert.equal(modified.hash,false);assert.equal(modified.ok,false);
 const empty=await d.verify(await d.present([]));assert.equal(empty.required,false);assert.equal(empty.ok,false);
 const wrong={...p,kbjwt:'not.a.jwt'};assert.equal((await d.verify(wrong)).ok,false);
});
