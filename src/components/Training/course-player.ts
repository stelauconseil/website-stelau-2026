import {scenes,type SceneId} from '@/lib/training/scenes';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll<HTMLElement>('[data-course-scene]').forEach(root=>{
 const frame=root.querySelector<HTMLIFrameElement>('[data-course-frame]')!;
 const play=root.querySelector<HTMLButtonElement>('[data-course-play]')!;
 const restart=root.querySelector<HTMLButtonElement>('[data-course-restart]')!;
 const zoom=root.querySelector<HTMLButtonElement>('[data-course-zoom]')!;
 const status=root.querySelector<HTMLElement>('[data-course-status]')!;
 const fr=root.dataset.lang==='fr';
 let wanted=!reduced.matches,visible=false,loaded=false;
 const theme=()=>document.documentElement.classList.contains('dark')?'dark':'light';
 const send=(reset=false)=>{
  frame.contentWindow?.postMessage({type:'stelau-course-control',theme:theme(),play:wanted&&visible&&!document.hidden,restart:reset},location.origin);
  play.setAttribute('aria-pressed',String(wanted));play.textContent=wanted?'Pause':(fr?'Lire':'Play');
 };
 root.dataset.ready='false';
 const load=()=>{if(loaded)return;loaded=true;frame.src=frame.dataset.src+'?theme='+theme();};
 const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)load();send();},{threshold:.08,rootMargin:'100px 0px'});io.observe(root);
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='stelau-course-status')return;
  if(event.data.ready){root.dataset.ready='true';if(frame.dataset.synced!=='true'){frame.dataset.synced='true';send();}}
  root.dataset.step=String(event.data.step);root.dataset.playing=String(event.data.playing);
  const isTotp=root.dataset.scene==='totp';
  const playback=!event.data.playing?(fr?'pause':'paused'):(fr?'boucle automatique':'automatic loop');
  status.textContent=root.dataset.scene==='primitives'?(fr?'5 primitives · scènes originales du cours':'5 primitives · original course scenes'):isTotp?(event.data.playing?(fr?'TOTP en direct · période de 30 s':'Live TOTP · 30-second period'):(fr?'TOTP · pause':'TOTP · paused')):(fr?`Étape ${event.data.step} / ${scenes[root.dataset.scene as SceneId].steps} · ${playback}`:`Step ${event.data.step} / ${scenes[root.dataset.scene as SceneId].steps} · ${playback}`);
 });
 play.addEventListener('click',()=>{wanted=!wanted;load();send();});
 restart.addEventListener('click',()=>{wanted=true;load();send(true);});
 zoom.addEventListener('click',()=>{const on=root.dataset.zoom!=='true';root.dataset.zoom=String(on);zoom.setAttribute('aria-pressed',String(on));zoom.textContent=on?(fr?'Adapter':'Fit'):(fr?'Agrandir':'Enlarge');});
 new MutationObserver(()=>send()).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 document.addEventListener('visibilitychange',()=>send());
 reduced.addEventListener('change',event=>{if(event.matches){wanted=false;send();}});
 send();
});
