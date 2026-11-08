document.documentElement.classList.add('js');
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)');
for(const [selector,count] of [['.calibration',33],['.atlas-ticks',17]]){const target=document.querySelector(selector);if(target)for(let i=0;i<count;i++)target.append(document.createElement('i'));}
for(let i=0;i<54;i++)$('spectrum').append(document.createElement('i'));

const menu=$('mobile-menu'),menuButton=document.querySelector('.menu-toggle');
function closeMenu(){menu.close();document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');}
menuButton.addEventListener('click',()=>{menu.showModal();document.body.classList.add('menu-open');menuButton.setAttribute('aria-expanded','true');});
menu.querySelector('.menu-close').addEventListener('click',closeMenu);
menu.addEventListener('close',()=>{document.body.classList.remove('menu-open');menuButton.setAttribute('aria-expanded','false');});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

const statement=document.querySelector('.statement');
statement.querySelectorAll('h2 span').forEach((el,i)=>el.style.setProperty('--word',i));
if(!reduced.matches&&'IntersectionObserver'in window){statement.classList.add('reveal-ready');const reveal=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){statement.classList.add('in-view');reveal.disconnect();}},{threshold:.25});reveal.observe(statement);}
const hero=document.querySelector('.hero'),art=document.querySelector('.hero-art');let heroVisible=true,scrollFrame=0;
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;});observer.observe(hero);}
function drift(){scrollFrame=0;if(!reduced.matches&&heroVisible&&innerWidth>999)art.style.setProperty('--hero-drift',`${Math.min(24,scrollY*.035)}px`);}
window.addEventListener('scroll',()=>{if(heroVisible&&!scrollFrame)scrollFrame=requestAnimationFrame(drift);},{passive:true});
reduced.addEventListener('change',()=>{if(reduced.matches){art.style.removeProperty('--hero-drift');statement.classList.add('in-view');}});

// Load the study only when its section enters the viewport. One engine owns
// playback, including the distinction between an explicit pause and suspension.
let engine=null,initializing=null,attempt=0;
const experience=$('experience'),loader=$('study-loading'),poster=$('study-poster');
const controls=[$('play'),$('restart'),...document.querySelectorAll('.chapters button')];
function busy(value){experience.setAttribute('aria-busy',String(value));controls.forEach(b=>b.disabled=value);}
function studyVisible(){const rect=$('simulation').getBoundingClientRect();return !document.hidden&&!menu.open&&rect.bottom>0&&rect.top<innerHeight;}
function studyReady(){loader.hidden=true;poster.hidden=true;busy(false);engine?.setActive(studyVisible());}
function studyError(){experience.setAttribute('aria-busy','false');loader.hidden=false;$('retry').hidden=false;controls.forEach(b=>b.disabled=true);}
experience.addEventListener('studyready',studyReady);experience.addEventListener('studyerror',studyError);
async function activate(){
 if(initializing)return initializing;
 loader.hidden=false;busy(true);$('voice-state').textContent='Preparing';$('retry').hidden=true;
 initializing=(async()=>{try{const url=new URL('../simulation/src/cinema.js',import.meta.url);if(attempt++)url.searchParams.set('retry',attempt);engine=await import(url.href);const loaded=await engine.ready;if(loaded)studyReady();return loaded;}catch{initializing=null;$('load-status').hidden=false;$('load-status').textContent='The study could not load. Please try again.';$('voice-state').textContent='Study unavailable';studyError();return false;}})();
 return initializing;
}
function syncStudy(){const visible=studyVisible();if(engine)engine.setActive(visible);else if(visible&&!initializing&&$('retry').hidden)activate();}
$('retry').addEventListener('click',()=>{if(!engine)activate();else{loader.hidden=false;busy(true);}});
if('IntersectionObserver'in window)new IntersectionObserver(syncStudy).observe($('simulation'));
else window.addEventListener('scroll',syncStudy,{passive:true});
document.addEventListener('visibilitychange',syncStudy);
menuButton.addEventListener('click',syncStudy);menu.addEventListener('close',syncStudy);
syncStudy();
