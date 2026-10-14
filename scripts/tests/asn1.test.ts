import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {decode,inputBytes} from '../../src/lib/asn1/decode.ts';
import {contentBytes,fieldAtNode} from '../../src/lib/asn1/x509.ts';
const pem=readFileSync(new URL('../../src/lib/asn1/example.pem',import.meta.url),'utf8');
const tlv=(tag:number,parts:Uint8Array[])=>{const value=Buffer.concat(parts);const length=value.length<128?[value.length]:value.length<256?[0x81,value.length]:[0x82,value.length>>8,value.length&255];return Uint8Array.from([tag,...length,...value]);};

test('PEM, DER, Base64, Base64url, hex and pasted Lapo links produce the same certificate',()=>{
 const bytes=inputBytes(pem);const b64=Buffer.from(bytes).toString('base64');
 for(const input of [b64,Buffer.from(bytes).toString('base64url'),Buffer.from(bytes).toString('hex'),'https://lapo.it/asn1js/#'+b64])assert.deepEqual(inputBytes(input),bytes);
 const cert=decode(bytes);assert.equal(cert.cert,true);assert.equal(cert.subject,'demo.rebop.example.test');assert.equal(cert.qc.length,2);
 assert.match(cert.fields.find(f=>f.label==='Module RSA')!.value,/^2048 bits/);
 assert.equal(cert.fields.find(f=>f.label==='Autorité de certification')!.value,'Non (cA = FALSE)');
 assert.deepEqual(cert.fields.filter(f=>f.label==='dNSName').map(f=>f.value),['demo.rebop.example.test','api.example.test']);
 assert.equal(cert.fields.find(f=>f.label==='iPAddress')!.value,'192.0.2.10');
 assert.ok(cert.fields.some(f=>f.schema==='QCStatement'&&f.value.includes('Authentification de site web')));
 for(const node of cert.flat){assert.ok(node.id>=0&&node.end<=bytes.length);assert.ok(node.id+node.tagLength<=node.id+node.header);assert.equal(contentBytes(bytes,node).length,node.contentEnd-node.id-node.header);for(const child of node.children)assert.ok(child.id>=node.id+node.header&&child.end<=node.contentEnd);}
 for(const field of cert.fields){assert.ok(cert.flat.includes(field.node));if(!field.derived)assert.equal(fieldAtNode(cert.fields,field.node)?.node.id,field.node.id);}
 const cloned=structuredClone(cert);assert.ok(cloned.flat.includes(cloned.fields[0].node),'Worker transfers retain node references');
});

test('BER indefinite lengths, high tags, generic ASN.1 and trailing data',()=>{
 const ber=decode(inputBytes('30800201010000'));assert.equal(ber.root.indefinite,true);assert.equal(ber.root.contentEnd,5);assert.equal(ber.root.end,7);assert.equal(ber.cert,false);
 const high=decode(inputBytes('9F1F0101'));assert.equal(high.root.tagLength,2);assert.equal(high.root.header,3);
 assert.throws(()=>decode(inputBytes('30030201')));
 assert.throws(()=>decode(inputBytes('300302010100')),/Données supplémentaires/);
 assert.throws(()=>decode(new Uint8Array(262145)),/256 Ko/);
 assert.throws(()=>inputBytes(''),/Collez/);assert.throws(()=>inputBytes('!not-base64!'),/Encodage/);
});

test('Parsing enforces nesting and node limits before a large object can reach the UI',()=>{
 let deep=inputBytes('020101');for(let i=0;i<120;i++)deep=tlv(0x30,[deep]);
 assert.throws(()=>decode(deep),/Structure trop complexe/);
 const wide=tlv(0x30,Array.from({length:20001},()=>inputBytes('020101')));
 assert.throws(()=>decode(wide),/Structure trop complexe/);
});

test('X.509 version defaults and unknown or malformed extensions keep their raw bytes',()=>{
 const cert=decode(inputBytes(pem));const tbs=cert.root.children[0];const enc=(n:typeof tbs)=>cert.bytes.slice(n.id,n.end);
 const basics=tbs.children.slice(1,7).map(enc);const shell=(body:Uint8Array)=>tlv(0x30,[body,enc(cert.root.children[1]),enc(cert.root.children[2])]);
 const v1=decode(shell(tlv(0x30,basics)));assert.match(v1.fields.find(f=>f.label==='Version')!.value,/^v1/);assert.equal(v1.qc.length,0);
 const unknown=tlv(0x30,[inputBytes('06032A0304'),inputBytes('0101FF'),tlv(4,[inputBytes('0500')])]);
 const malformed=tlv(0x30,[inputBytes('0603551D13'),tlv(4,[inputBytes('020101')])]);
 const other=decode(shell(tlv(0x30,[enc(tbs.children[0]),...basics,tlv(0xa3,[tlv(0x30,[unknown,malformed])])])));
 assert.equal(other.fields.find(f=>f.group==='Extension 1.2.3.4')!.decoded,false);
 assert.equal(other.fields.find(f=>f.group==='Extension 1.2.3.4')!.critical,true);
 assert.equal(other.fields.find(f=>f.group==='Contraintes de base')!.decoded,false);
});
