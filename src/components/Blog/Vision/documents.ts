// The full document list is server-rendered; animation is an optional enhancement.
export function initDocumentCollections(){
 document.querySelectorAll<HTMLElement>('[data-document-collection]').forEach(el=>{
  const cards=[...el.querySelectorAll<HTMLElement>('[data-document-card]')];
  const counter=el.querySelector('[data-document-count]')!;
  const toggle=el.querySelector<HTMLButtonElement>('[data-document-play]')!;
  const fr=el.dataset.lang==='fr',reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let requested=false,visible=false,timer=0,index=cards.length,started=false;
  let tween: (typeof import('gsap'))['gsap'] | undefined;
  function sync(){toggle.setAttribute('aria-pressed',String(requested));toggle.textContent=requested?'Pause':(fr?'Lire l’animation':'Play animation');}
  function render(){counter.textContent=String(index).padStart(2,'0');cards.forEach((card,i)=>{card.style.opacity=i<index?'1':'.18';});}
  function stop(){window.clearTimeout(timer);timer=0;}
  function tick(){stop();if(!requested||!visible||document.hidden)return;if(index>=cards.length){requested=false;sync();return;}index++;render();if(tween&&!reduced.matches)tween.fromTo(cards[index-1],{y:10},{y:0,duration:.65,ease:'power2.out'});timer=window.setTimeout(tick,1800);}
  toggle.addEventListener('click',()=>{requested=!requested;if(requested){if(index===cards.length)index=0;tick();}else stop();sync();});
  el.querySelector('[data-document-replay]')!.addEventListener('click',()=>{stop();index=0;requested=!reduced.matches;if(requested)tick();else{index=cards.length;render();}sync();});
  el.querySelector('[data-document-all]')!.addEventListener('click',()=>{stop();requested=false;index=cards.length;render();sync();});
  new IntersectionObserver(async entries=>{visible=entries[0].isIntersecting;if(!visible){stop();return;}if(!started){started=true;if(!reduced.matches){try{tween=(await import('gsap')).gsap;}catch{/* Content remains usable without the animation bundle. */}index=0;requested=true;render();}}if(requested)tick();sync();},{threshold:.12}).observe(el);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(visible&&requested)tick();});
  reduced.addEventListener('change',()=>{if(reduced.matches){stop();requested=false;tween?.killTweensOf(cards);cards.forEach(card=>card.style.transform='');index=cards.length;render();sync();}});
  el.querySelector<HTMLElement>('[data-document-controls]')!.hidden=false;
 });
}
