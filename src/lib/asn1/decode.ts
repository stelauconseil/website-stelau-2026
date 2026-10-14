import { certificateFields } from './x509.ts';
import { ASN1 } from '@lapo/asn1js';
export type Node = { id:number; end:number; header:number; tagLength:number; contentEnd:number; indefinite:boolean; depth:number; type:string; value:string; label:string; children:Node[]; parent?:number };
export const names:Record<string,string>={'2.5.4.3':'Nom commun','2.5.4.6':'Pays','2.5.4.10':'Organisation','2.5.4.11':'Unité organisationnelle','2.5.4.97':'Identifiant organisation','2.5.4.4':'Nom','2.5.4.42':'Prénom','2.5.4.5':'Numéro de série','1.2.840.113549.1.1.1':'RSA','1.2.840.113549.1.1.11':'SHA-256 avec RSA','2.5.29.19':'Contraintes de base','2.5.29.15':'Usage de clé','2.5.29.37':'Usage étendu de clé','2.5.29.17':'Noms alternatifs','2.5.29.14':'Identifiant de clé du sujet','2.5.29.35':'Identifiant de clé de l’autorité','2.5.29.32':'Politiques du certificat','2.5.29.31':'Points de distribution CRL','1.3.6.1.5.5.7.1.1':'Accès aux informations de l’autorité','1.3.6.1.5.5.7.1.3':'QCStatements','0.4.0.1862.1.1':'QcCompliance','0.4.0.1862.1.4':'QcSSCD','0.4.0.1862.1.5':'QcPDS','0.4.0.1862.1.6':'QcType','0.4.0.1862.1.6.1':'Signature électronique','0.4.0.1862.1.6.2':'Cachet électronique','0.4.0.1862.1.6.3':'Authentification de site web'};
export {inputBytes} from './input.ts';
export function decode(bytes:Uint8Array){
 if(bytes.length>262144)throw Error('Cette version accepte jusqu’à 256 Ko.');
 let parsingDepth=0,parsingNodes=0;
 // Bound complexity during parsing, before walking the decoded structure.
 class LimitedASN1 extends (ASN1 as any){
  static decode(stream:any,offset?:number,type:any=LimitedASN1):any{
   if(++parsingDepth>100||++parsingNodes>20000)throw Error('Structure trop complexe pour cette version.');
   try{return ASN1.decode(stream,offset,type);}finally{parsingDepth--;}
  }
 }
 const raw=LimitedASN1.decode(bytes); const flat:Node[]=[];
 function visit(a:any,depth=0,parent?:number):Node{if(depth>100||flat.length>20000)throw Error('Structure trop complexe pour cette version.');const n:Node={id:a.posStart(),end:a.posEnd(),header:a.header,tagLength:a.tagLen,contentEnd:a.posEnd()-(a.length<0?2:0),indefinite:a.length<0,depth,type:a.typeName(),value:String(a.content(4000)??''),label:'',children:[],parent};if(n.type==='OBJECT_IDENTIFIER')n.value=n.value.split('\n')[0];flat.push(n);n.children=(a.sub??[]).map((x:any)=>visit(x,depth+1,n.id));if(n.type==='OBJECT_IDENTIFIER')n.label=names[n.value]??'';return n;}
 const root=visit(raw);if(root.end!==bytes.length)throw Error('Données supplémentaires après la structure ASN.1. Importez un seul objet.');
 const t=root.children[0]; let cert=false;
 if(root.type==='SEQUENCE'&&root.children.length===3&&t?.type==='SEQUENCE'&&root.children[1]?.type==='SEQUENCE'&&root.children[2]?.type==='BIT_STRING'){
 const off=t.children[0]?.type==='[0]'?1:0;const fields=['Numéro de série','Algorithme de signature','Émetteur','Période de validité','Sujet','Clé publique'];cert=t.children[off]?.type==='INTEGER'&&t.children[off+1]?.type==='SEQUENCE'&&t.children[off+2]?.type==='SEQUENCE'&&t.children[off+3]?.children.length===2&&t.children[off+3].children.every(n=>['UTCTime','GeneralizedTime'].includes(n.type))&&t.children[off+4]?.type==='SEQUENCE'&&t.children[off+5]?.type==='SEQUENCE'&&t.children[off+5]?.children[0]?.type==='SEQUENCE'&&t.children[off+5]?.children[1]?.type==='BIT_STRING';if(cert){root.label='Certificate';t.label='TBSCertificate';fields.forEach((label,i)=>{if(t.children[i+off])t.children[i+off].label=label;});if(off)t.children[0].label='Version';root.children[1].label='Algorithme de signature';root.children[2].label='Signature';t.children.filter(n=>n.type==='[3]').forEach(n=>n.label='Extensions');}}
 for(const n of flat){if(!n.label&&n.type==='SEQUENCE'&&n.children[0]?.type==='OBJECT_IDENTIFIER')n.label=names[n.children[0].value]??n.children[0].value;}
 const subject=flat.find(n=>n.label==='Sujet');const issuer=flat.find(n=>n.label==='Émetteur');
 function cn(n?:Node):string{if(!n)return '—';for(const rdn of n.children)for(const attribute of rdn.children){if(attribute.children[0]?.value==='2.5.4.3')return attribute.children[1]?.value??'—';}return '—';}
 const extension=cert?flat.find(n=>n.label==='QCStatements'&&n.type==='SEQUENCE'):undefined; const statements=extension?.children.find(n=>n.type==='OCTET_STRING')?.children[0]?.children??[];
 return {root,flat,bytes,cert,fields:cert?certificateFields(root,bytes):[],subject:cn(subject),issuer:cn(issuer),qc:statements.map(n=>n.children[0]).filter((n):n is Node=>!!n&&n.type==='OBJECT_IDENTIFIER')};
}
