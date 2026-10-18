import copy from '@/data/presentation-flow.json';
import type {IdentityDemo,ClaimName,Presentation,Verification} from '@/lib/identity-demo/protocol';

type Attack='none'|'copy'|'replay';
export function initPresentationFlows(){
 document.querySelectorAll<HTMLElement>('[data-presentation-flow]').forEach(el=>{
  const c=copy[el.dataset.lang==='en'?'en':'fr'];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const play=el.querySelector<HTMLButtonElement>('[data-flow-play]')!;
  const scene=el.querySelector<HTMLElement>('[data-flow-scene]')!;
  const packet=el.querySelector<HTMLElement>('[data-flow-packet]')!;
  const actors=[...el.querySelectorAll<HTMLElement>('[data-flow-actor]')];
  const selectors=[...el.querySelectorAll<HTMLButtonElement>('[data-flow-select]')];
  const inputs=[...el.querySelectorAll<HTMLInputElement>('[data-disclosure]')];
  let phase=0,requested=false,visible=false,denied=false,initialised=false,attack:Attack='none',revision=0;
  let gsap:(typeof import('gsap'))['gsap']|undefined;
  let session:IdentityDemo|undefined,presentation:Presentation|undefined;
  let requestedClaims:ClaimName[]=['qualification_valid'];
  let protocol:typeof import('@/lib/identity-demo/protocol')|undefined;
  let loading:Promise<void>|undefined;
  let timeline:ReturnType<NonNullable<typeof gsap>['timeline']>|undefined;
  const selection=()=>inputs.filter(i=>i.checked).map(i=>i.value as ClaimName);
  function set(selector:string,value:string){el.querySelectorAll(selector).forEach(item=>item.textContent=value);}
  function selectedPreview(){
   const rows=inputs.filter(input=>input.checked).map(input=>input.closest('label')!.querySelector('code')!.textContent!);
   el.querySelectorAll('[data-selected-claims]').forEach(target=>{target.replaceChildren(...rows.map(text=>{const code=document.createElement('code');code.textContent=text;return code;}));});
   set('[data-disclosure-count]',`${rows.length} / 4 ${c.selected}`);
   const complete=requestedClaims.every(name=>selection().includes(name));
   el.querySelector<HTMLButtonElement>('[data-flow-accept]')!.disabled=!complete;
   el.querySelector<HTMLElement>('[data-request-missing]')!.hidden=complete;
  }
  function sync(){
   play.setAttribute('aria-pressed',String(requested&&visible&&!document.hidden));
   play.textContent=requested?c.pause:c.play;
   play.disabled=denied||phase===2;
  }
  function render(){
   el.dataset.phase=String(phase);
   el.querySelectorAll<HTMLElement>('[data-flow-description]').forEach((item,i)=>item.hidden=i!==phase);
   selectors.forEach((button,i)=>{if(i===phase)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
   el.querySelector<HTMLElement>('[data-flow-consent]')!.hidden=phase!==2;
   el.querySelector<HTMLElement>('[data-flow-refused]')!.hidden=!denied;
   el.querySelector<HTMLButtonElement>('[data-flow-next]')!.disabled=phase===4||phase===2||denied;
   sync();
  }
  function checks(result:Verification){
   el.dataset.verification=String(result.ok);
   set('[data-active-rp]',attack==='replay'?'RP-B':'RP-A');
   set('[data-rp-verdict]',result.ok?c.verified:(el.dataset.lang==='en'?'Rejected':'Refusée'));
   const values=[result.issuer&&result.validity,result.disclosures&&result.requested&&result.required,result.holder,result.audience&&result.nonce&&result.fresh,result.hash];
   el.querySelectorAll<HTMLElement>('[data-check]').forEach((row,i)=>{
    row.dataset.valid=String(values[i]);row.querySelector('[data-check-result]')!.textContent=values[i]?'✓':'×';
   });
   const verdict=el.querySelector<HTMLElement>('[data-verification-verdict]')!;
   verdict.dataset.valid=String(result.ok);verdict.textContent=result.ok?c.verified:(el.dataset.lang==='en'?'Presentation rejected':'Présentation refusée');
   const target=el.querySelector('[data-received-claims]')!;
   target.replaceChildren(...Object.entries(result.revealed).map(([name,value])=>{const code=document.createElement('code');code.textContent=`${name}: ${JSON.stringify(value)}`;return code;}));
  }
  function payloads(){
   if(!session||!presentation||!protocol)return;
   const proof=session.issuanceProof.split('.');
   const kb=presentation.kbjwt.split('.');
   const data=[session.payload,{header:protocol.decodePart(proof[0]),payload:protocol.decodePart(proof[1])},session.issuanceRequest,session.issuanceResponse,session.request,protocol.decodePart(kb[1]),{vp_token:{qualification:[presentation.sdjwt+presentation.kbjwt]}}];
   data.forEach((value,i)=>set(`[data-protocol-json="${i}"]`,JSON.stringify(value,null,2)));
   set('[data-nonce]',session.nonceA);
   set('[data-holder-tag]',`P-256 · x: ${session.holderJwk.x!.slice(0,10)}…`);
   set('[data-vc-digest]',session.disclosures[0].hash.slice(0,13)+'… (+3)');
   set('[data-sd-hash]',protocol.decodePart(kb[1]).sd_hash);
   set('[data-kb-iat]',String(protocol.decodePart(kb[1]).iat));
  }
  async function refresh(){
   selectedPreview();
   if(!session||!protocol)return;
   const ticket=++revision;const mode=attack;
   el.dataset.demoState='pending';
   el.querySelectorAll<HTMLButtonElement>('.transfer-tests button').forEach(button=>button.disabled=true);
   try{
    const p=await session.present(selection(),mode==='copy');
    const result=await session.verify(p,mode==='replay'?protocol.RP_B:protocol.RP_A,mode==='replay'?session.nonceB:session.nonceA);
    if(ticket!==revision)return;
    presentation=p;payloads();checks(result);
    el.dataset.demoState='ready';
    const status=el.querySelector<HTMLElement>('[data-attack-result]')!;
    status.hidden=mode==='none';status.textContent=mode==='copy'?c.copyRejected:mode==='replay'?c.replayRejected:'';
    el.querySelectorAll<HTMLButtonElement>('.transfer-tests button').forEach(button=>button.disabled=false);
   }catch{if(ticket===revision)unavailable();}
  }
  function unavailable(){
   el.dataset.demoState='error';el.querySelector<HTMLElement>('[data-demo-unavailable]')!.hidden=false;
   set('[data-verification-verdict]',c.unavailable);
  }
  function point(index:number){const a=actors[index].getBoundingClientRect(),s=scene.getBoundingClientRect();return{x:a.left-s.left+a.width/2,y:a.top-s.top+a.height*.57};}
  function transfer(from:number,to:number,title:string,note:string,at:number,duration:number){
   if(!timeline||!gsap||reduced.matches)return;
   const a=point(from),b=point(to);
   timeline.call(()=>{set('[data-packet-title]',title);set('[data-packet-note]',note);},[],at)
    .set(packet,{x:a.x,y:a.y,xPercent:-50,yPercent:-50,opacity:0},at)
    .to(packet,{opacity:1,duration:.35},at+.1)
    .to(packet,{x:b.x,y:b.y,duration,ease:'power2.inOut'},at+.5)
    .to(packet,{opacity:0,duration:.35},at+.5+duration);
  }
  function buildStep(){
   timeline?.kill();gsap?.set(packet,{opacity:0});
   gsap?.set(el.querySelector('.wallet-key'),{scale:1});
   gsap?.set(el.querySelector('.holder-stamp'),{scale:1,opacity:1});render();
   if(!gsap)return;
   timeline=gsap.timeline({paused:true,onComplete:()=>{
    if(!requested)return;
    if(phase<4){phase++;if(phase===2)requested=false;buildStep();resume();}
    else{requested=false;sync();}
   }});
   timeline.to({elapsed:0},{elapsed:1,duration:phase===0?9:7},0);
   if(phase===0){
    transfer(1,0,'OID4VCI · proofs.jwt','H · aud = issuer · c_nonce',.4,2.5);
    transfer(0,1,'SD-JWT VC',`${c.issuerSeal} · cnf.jwk = H`,4.5,2.8);
   }
   if(phase===1)transfer(2,1,'OID4VP · DCQL','qualification_valid · client_id · nonce',.6,3.1);
   if(phase===3&&!reduced.matches){
    timeline.to(el.querySelector('.wallet-key'),{scale:1.07,duration:.8,repeat:1,yoyo:true,ease:'sine.inOut'},.5)
     .fromTo(el.querySelector('.holder-stamp'),{scale:.92,opacity:.2},{scale:1,opacity:1,duration:1.3,immediateRender:false,ease:'power2.out'},2.1);
   }
   if(phase===4)transfer(1,2,'OID4VP · vp_token',`SD-JWT + ${selection().length} disclosure(s) + KB-JWT`,.6,3.1);
  }
  function resume(){if(requested&&visible&&!document.hidden&&!denied&&phase!==2)timeline?.resume();sync();}
  function ensure(){
   if(!loading)loading=(async()=>{
    try{gsap=(await import('gsap')).gsap;buildStep();}catch{/* Static steps and controls stay usable. */}
    try{protocol=await import('@/lib/identity-demo/protocol');session=await protocol.createIdentityDemo();session.setRequestedClaims(requestedClaims);await refresh();}catch{unavailable();}
   })();
   return loading;
  }
  async function go(next:number,autoplay=false){
   initialised=true;requested=false;timeline?.pause();phase=Math.max(0,Math.min(4,next));denied=false;
   if(attack!=='none'){attack='none';void refresh();}
   await ensure();if(phase>=3)await refresh();buildStep();requested=autoplay&&phase!==2;
   set('[data-flow-announcement]',`${phase+1} / 5 · ${c.steps[phase][1]}`);resume();
  }
  play.addEventListener('click',async()=>{
   initialised=true;if(denied||phase===2)return;
   if(requested){requested=false;timeline?.pause();sync();return;}
   await ensure();if(phase===4||timeline?.progress()===1){phase=0;buildStep();}
   requested=true;resume();
  });
  el.querySelector('[data-flow-replay]')!.addEventListener('click',()=>void go(0,!reduced.matches));
  selectors.forEach((button,i)=>button.addEventListener('click',()=>void go(i)));
  el.querySelector('[data-flow-next]')!.addEventListener('click',()=>{if(!denied&&phase!==2)void go(phase+1);});
  el.querySelector('[data-flow-refuse]')!.addEventListener('click',()=>{requested=false;denied=true;timeline?.pause();gsap?.set(packet,{opacity:0});render();});
  el.querySelector('[data-flow-accept]')!.addEventListener('click',()=>{if(requestedClaims.every(name=>selection().includes(name)))void go(3,!reduced.matches);});
  inputs.forEach(input=>input.addEventListener('change',()=>{attack='none';void refresh();}));
  el.querySelector<HTMLSelectElement>('[data-request-profile]')!.addEventListener('change',event=>{
   const named=(event.target as HTMLSelectElement).value==='named';
   requestedClaims=named?['qualification_valid','name']:['qualification_valid'];
   inputs.forEach(input=>{
    const asked=requestedClaims.includes(input.value as ClaimName);input.disabled=!asked;input.checked=asked;
    input.closest('label')!.querySelector('[data-claim-demand]')!.textContent=asked?c.required:c.optional;
   });
   set('[data-request-claims]',`claims: [ ${requestedClaims.join(', ')} ]`);
   session?.setRequestedClaims(requestedClaims);attack='none';void refresh();
  });
  for(const [selector,mode] of [['[data-copy-test]','copy'],['[data-replay-test]','replay'],['[data-reset-test]','none']] as const){
   el.querySelector(selector)!.addEventListener('click',async()=>{requested=false;timeline?.pause();attack=mode;await ensure();await refresh();sync();});
  }
  new IntersectionObserver(async entries=>{
   visible=entries[0].isIntersecting;
   if(!visible){timeline?.pause();sync();return;}
   if(!initialised){initialised=true;await ensure();if(!reduced.matches)requested=true;}
   resume();
  },{threshold:.1}).observe(el);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){timeline?.pause();sync();}else resume();});
  reduced.addEventListener('change',()=>{if(reduced.matches){requested=false;buildStep();sync();}});
  let width=scene.clientWidth;
  new ResizeObserver(()=>{if(width!==scene.clientWidth){width=scene.clientWidth;buildStep();resume();}}).observe(scene);
  el.querySelectorAll<HTMLElement>('[data-flow-interactive]').forEach(item=>item.hidden=false);
  selectedPreview();render();
 });
}
