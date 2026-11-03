import {gsap} from 'gsap';
import {hydrate} from '@/lib/training/course/core/primitives.js';
import {localizeScene} from '@/lib/training/scene-locale';
import {scenes,type SceneId} from '@/lib/training/scenes';
type Life={enter?:()=>void;leave?:()=>void;step?:(n:number)=>void;final?:()=>void;restart?:()=>void};
const loaders={
 primitives:()=>import('@/lib/training/course/slides/primitives/animation/slide.js'),
 certificate:()=>import('@/lib/training/course/slides/assemblage/certificat/slide.js'),
 tls:()=>import('@/lib/training/course/slides/assemblage/tls/slide.js'),
 aes:()=>import('@/lib/training/course/slides/histoire/aes-confusion-diffusion/slide.js'),
 totp:()=>import('@/lib/training/course/slides/hachage/totp/slide.js'),
};
const mount=document.querySelector<HTMLElement>('[data-scene-root]')!;
const scene=mount.dataset.scene as SceneId;
const stage=mount.querySelector<HTMLElement>('.reveal')!;
const section=stage.querySelector<HTMLElement>('section')!;
const fit=()=>{stage.style.transform=`scale(${mount.clientWidth/1600})`;};
new ResizeObserver(fit).observe(mount);fit();
let life:Life={},playing=false,desired=false,entered=false,step=0,timer:ReturnType<typeof setTimeout>|undefined;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let ready=false;
const status=()=>{section.dataset.step=String(step);parent.postMessage({type:'stelau-course-status',scene,step,playing,ready},location.origin);};
function show(n:number){
 step=n;
 section.querySelectorAll<HTMLElement>('.fragment').forEach(el=>el.classList.toggle('visible',Number(el.dataset.fragmentIndex||0)<=n));
 life.step?.(n);status();
}
function tick(){
 if(!playing||!scenes[scene].steps)return;
 const max=scenes[scene].steps;
 // TOTP keeps its final diagram while the scene's own clock continues ticking.
 if(scene==='totp'&&step>=max)return;
 timer=setTimeout(()=>{if(!playing)return;show(step>=max?0:step+1);tick();},step>=max?5200:3600);
}
function sync(){
 if(!ready)return;
 const next=desired&&!document.hidden;
 clearTimeout(timer);
 if(next&&!playing){gsap.globalTimeline.resume();if(!entered||scene==='primitives'||scene==='totp')life.enter?.();entered=true;}
 if(!next&&playing){if(scene==='primitives'||scene==='totp')life.leave?.();gsap.globalTimeline.pause();}
 playing=next;if(playing)tick();status();
}
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='stelau-course-control')return;
 const d=event.data;
 if(d.theme==='light'||d.theme==='dark')document.documentElement.dataset.theme=d.theme;
 if(typeof d.play==='boolean')desired=d.play;
 if(d.restart&&ready){gsap.globalTimeline.resume();show(0);life.restart?.();}
 sync();
});
document.addEventListener('visibilitychange',sync);
async function init(){
 try{
  localizeScene(section,document.documentElement.lang);
  hydrate();
  const mod=await loaders[scene]();
  life=mod.default(section,{printing:reduced}) as Life;
  ready=true;
  if(reduced){life.final?.();step=scenes[scene].steps;gsap.globalTimeline.pause();}
  else show(0);
  status();sync();
 }catch(error){console.error('Course scene failed',scene,error);document.querySelector<HTMLElement>('[data-scene-error]')!.hidden=false;}
}
void init();
window.addEventListener('pagehide',()=>{clearTimeout(timer);if(entered)life.leave?.();gsap.globalTimeline.clear();});
