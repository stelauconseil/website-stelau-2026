import {useEffect,useRef,useState} from 'react';
import type {decode} from '@/lib/asn1/decode';
import {inputBytes} from '@/lib/asn1/input';
import example from '@/lib/asn1/example.pem?raw';
import Inspector from './Inspector';
import {LocaleProvider,translate} from './locale';
import {FileKey2,Layers} from './primitives';
import './decoder.css';

type Data=ReturnType<typeof decode>;
export default function Decoder({lang='fr'}:{lang?:'fr'|'en'}){
 const fr=lang==='fr';
 const [data,setData]=useState<Data|null>(null),[generation,setGeneration]=useState(0),[source,setSource]=useState(''),[error,setError]=useState(''),[entry,setEntry]=useState(true),[filename,setFilename]=useState(''),[busy,setBusy]=useState(false);
 const fileRef=useRef<HTMLInputElement>(null);
 const worker=useRef<Worker|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),request=useRef(0);
 function stop(){worker.current?.terminate();worker.current=null;if(timer.current)clearTimeout(timer.current);timer.current=null;}
 useEffect(()=>()=>stop(),[]);
 function fail(message:string){stop();setBusy(false);setError(translate(message,lang));setEntry(true);}
 function load(bytes:Uint8Array,name=fr?'Objet importé':'Imported object'){
  stop();setData(null);setError('');setBusy(true);setFilename(name);
  try{
   const active=new Worker(new URL('../../lib/asn1/decode.worker.ts',import.meta.url),{type:'module'});worker.current=active;
   timer.current=setTimeout(()=>{if(worker.current===active)fail(fr?'Décodage interrompu : structure trop complexe.':'Decoding stopped: the structure is too complex.');},5000);
   active.onmessage=(event:MessageEvent<{ok:boolean;data?:Data;error?:string}>)=>{
    if(worker.current!==active)return;
    if(!event.data.ok||!event.data.data){fail(event.data.error||'Decoding failed.');return;}
    stop();setData(event.data.data);setGeneration(n=>n+1);setBusy(false);setEntry(false);
   };
   active.onerror=()=>{if(worker.current===active)fail(fr?'Le décodeur n’a pas pu traiter cet objet.':'The decoder could not process this object.');};
   active.postMessage(bytes,[bytes.buffer as ArrayBuffer]);
  }catch{fail(fr?'Le décodage local n’est pas disponible dans ce navigateur.':'Local decoding is unavailable in this browser.');}
 }
 function parse(){request.current++;setData(null);try{load(inputBytes(source));}catch(e){fail(e instanceof Error?e.message:String(e));}}
 async function file(f?:File){
  if(!f)return;const id=++request.current;stop();setData(null);setError('');
  if(f.size>262144){fail(fr?'Fichier trop volumineux : maximum 256 Ko.':'File too large: maximum 256 KiB.');return;}
  try{const bytes=new Uint8Array(await f.arrayBuffer());if(id!==request.current)return;const text=new TextDecoder().decode(bytes);load(/^[\s\x20-\x7e]+$/.test(text)?inputBytes(text):bytes,f.name);}
  catch(e){if(id===request.current)fail(e instanceof Error?e.message:String(e));}
 }
 function clear(){request.current++;stop();setBusy(false);setData(null);setSource('');setError('');setFilename('');setEntry(true);}
 function sample(){request.current++;setSource(example);load(inputBytes(example),fr?'Exemple fictif Stelau':'Fictional Stelau example');}
 function download(){if(!data)return;const url=URL.createObjectURL(new Blob([new Uint8Array(data.bytes)],{type:'application/octet-stream'}));const a=document.createElement('a');a.href=url;a.download='certificate.der';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <LocaleProvider lang={lang}><div className="rebop-decoder" data-pagefind-ignore aria-busy={busy}>
  <div className="decoder-top"><span className="decoder-brand"><Layers size={23}/> ASN.1 <b>Atelier</b></span><span className="decoder-local">{fr?'Traitement local · aucun envoi':'Local processing · no upload'}</span><div className="actions">{data&&<button type="button" onClick={()=>setEntry(!entry)}>{fr?'Importer un autre objet':'Import another object'}</button>}<button type="button" onClick={clear}>{fr?'Effacer':'Clear'}</button></div></div>
  {entry&&<section className="importbox" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();void file(e.dataTransfer.files[0]);}}>
   <div className="importtitle"><h3><FileKey2 size={22}/>{fr?'Ouvrir un certificat ou une structure ASN.1':'Open a certificate or ASN.1 structure'}</h3></div>
   <label className="sr-only" htmlFor="decoder-source">{fr?'Certificat PEM, Base64, hexadécimal ou lien Lapo':'PEM certificate, Base64, hexadecimal or Lapo link'}</label>
   <textarea id="decoder-source" value={source} maxLength={400000} spellCheck={false} autoComplete="off" onChange={e=>setSource(e.target.value)} placeholder={fr?'Collez votre certificat PEM, Base64, hexadécimal ou un lien Lapo…\n-----BEGIN CERTIFICATE-----':'Paste a PEM certificate, Base64, hexadecimal or Lapo link…\n-----BEGIN CERTIFICATE-----'}/>
   <div className="importfooter"><span>PEM · DER · Base64 · Hex · {fr?'glisser-déposer':'drag & drop'}<br/>{fr?'Un objet, jusqu’à 256 Ko':'One object, up to 256 KiB'}</span><div className="actions"><button type="button" disabled={busy} onClick={sample}>{fr?'Essayer un exemple':'Try an example'}</button><button type="button" disabled={busy} onClick={()=>fileRef.current?.click()}>{fr?'Choisir un fichier':'Choose a file'}</button><button type="button" className="primary" disabled={busy||!source.trim()} onClick={parse}>{busy?(fr?'Décodage…':'Decoding…'):(fr?'Décoder':'Decode')}</button></div></div>
  </section>}
  <input ref={fileRef} type="file" aria-label={fr?'Importer un certificat local':'Import a local certificate'} accept=".pem,.der,.crt,.cer,.b64,.txt" hidden onChange={e=>{void file(e.target.files?.[0]);e.target.value='';}}/>
  {busy&&<p role="status" className="decoder-message">{fr?'Lecture des octets dans votre navigateur…':'Reading bytes in your browser…'}</p>}
  {error&&<p role="alert" className="error">{error}</p>}
  {data?<><section className="summary"><div className="certificateIcon"><FileKey2 size={27}/></div><div className="identity"><p>{data.cert?'X.509':'ASN.1'} <span>{filename}</span></p><h3>{data.cert?data.subject:data.root.type}</h3>{data.cert&&<div>{fr?'Émetteur':'Issuer'} : {data.issuer}</div>}</div><div className="stat"><strong>{data.bytes.length.toLocaleString(lang)}</strong><span>{fr?'octets':'bytes'}</span></div><div className="stat"><strong>{data.flat.length}</strong><span>{fr?'éléments':'elements'}</span></div><button type="button" onClick={download}>{fr?'Exporter le DER':'Export DER'}</button></section><Inspector key={generation} data={data}/></>:!busy&&<div className="decoder-empty"><span className="mono">30 → ASN.1 → X.509</span><p>{fr?'Du champ à l’octet : explorez les identités, la validité, les usages, les extensions et les QCStatements.':'From fields to bytes: explore identities, validity, usages, extensions and QCStatements.'}</p></div>}
  <p className="decoder-limit">{fr?'Ce décodeur lit les données. Il ne valide ni la signature, ni la chaîne de confiance, ni la révocation ou la qualification eIDAS. Aucun appel OCSP ou CRL n’est effectué.':'This decoder reads the data. It does not validate signatures, trust paths, revocation or eIDAS qualification. No OCSP or CRL requests are made.'}</p>
  <div className="decoder-credits"><span>{fr?'Les objets restent en mémoire jusqu’à effacement ou fermeture de la page.':'Objects remain in memory until cleared or the page is closed.'}</span><a href="https://github.com/lapo-luchini/asn1js" target="_blank" rel="noopener noreferrer">Lapo Luchini · ASN.1</a><a href="/licenses/lapo-asn1.txt" target="_blank" rel="noopener noreferrer">ISC</a></div>
 </div></LocaleProvider>;
}
