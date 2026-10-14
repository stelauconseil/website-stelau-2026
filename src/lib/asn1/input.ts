export function inputBytes(text:string){
 let s=text.trim(); if(s.includes('#'))s=s.slice(s.indexOf('#')+1);
 if(s.length>400000)throw Error('Cette version accepte jusqu’à 256 Ko.');
 if(!s)throw Error('Collez un certificat ou une structure ASN.1.');
 if(/^(?:[\da-f]{2}\s*)+$/i.test(s))return Uint8Array.from(s.replace(/\s/g,'').match(/../g)!,v=>parseInt(v,16));
 s=s.replace(/-----BEGIN [^-]+-----|-----END [^-]+-----/g,'').replace(/\s/g,'').replace(/-/g,'+').replace(/_/g,'/');
 try{return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}catch{throw Error('Encodage non reconnu. Utilisez PEM, Base64, hexadécimal ou DER.');}
}
