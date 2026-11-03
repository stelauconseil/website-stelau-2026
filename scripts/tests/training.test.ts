import {test} from 'node:test';
import assert from 'node:assert/strict';
import {encrypt,fromHex} from '../../src/lib/training/course/lib/aes.js';
import {totp,toHex} from '../../src/lib/training/course/lib/hash.js';
import {computeCodeChallenge,generateCodeVerifier,generateES256KeyPair,exportPublicJwk,signES256,verifyES256,sha256Hex} from '../../src/lib/training/oidapp/crypto.ts';

test('course AES engine matches the FIPS-197 Appendix B ciphertext',()=>{
 assert.equal(toHex(encrypt(fromHex('3243f6a8885a308d313198a2e0370734'),fromHex('2b7e151628aed2a6abf7158809cf4f3c'))),'3925841d02dc09fbdc118597196a0b32');
});
test('course TOTP engine matches RFC 6238 Appendix B, including a leading-zero result',()=>{
 const key='12345678901234567890';
 assert.equal(totp(key,59,{digits:8}).code,'94287082');
 assert.equal(totp(key,1111111109,{digits:8}).code,'07081804');
 assert.equal(totp(key,20000000000,{digits:8}).code,'65353130');
});
test('embedded PKCE computes the RFC 7636 Appendix B challenge',async()=>{
 assert.equal(await computeCodeChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'),'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
 const verifier=generateCodeVerifier();assert.match(verifier,/^[A-Za-z0-9._~-]{64}$/);assert.notEqual(verifier,generateCodeVerifier());
});
test('embedded signature verifies, rejects an altered message, and keeps the private key non-exportable',async()=>{
 const pair=await generateES256KeyPair();const message='{"holder":"Camille"}';
 const sig=await signES256(pair.privateKey,message);
 assert.equal(await verifyES256(pair.publicKey,sig,message),true);
 assert.equal(await verifyES256(pair.publicKey,sig,'{"holder":"Alex"}'),false);
 assert.equal(pair.privateKey.extractable,false);assert.equal((await exportPublicJwk(pair.publicKey)).kty,'EC');
});
test('embedded SHA-256 matches the standard abc vector',async()=>{
 assert.equal(await sha256Hex('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});
