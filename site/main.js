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

// The page is ready before the study. No clinical volume, animation engine or
// audio is requested until a visitor deliberately activates this section.
let engine=null,initializing=null,attempt=0,activationIntent=0;
const experience=$('experience'),loader=$('study-loading'),poster=$('study-poster');
const controls=[$('play'),$('restart'),...document.querySelectorAll('.chapters button')];
function busy(value){experience.setAttribute('aria-busy',String(value));controls.forEach(b=>b.disabled=value);$('command-input').disabled=value;$('send').disabled=value;}
function studyReady(){loader.hidden=true;poster.hidden=true;busy(false);}
function studyError(){experience.setAttribute('aria-busy','false');loader.hidden=false;$('retry').hidden=false;controls.forEach(b=>b.disabled=true);$('command-input').disabled=true;$('send').disabled=true;}
experience.addEventListener('studyready',studyReady);experience.addEventListener('studyerror',studyError);
async function activate(){
 if(initializing)return initializing;
 $('play').removeEventListener('click',firstPlay);$('restart').removeEventListener('click',firstRestart);document.querySelectorAll('.chapters button').forEach(b=>b.removeEventListener('click',firstChapter));
 loader.hidden=false;busy(true);$('voice-state').textContent='Preparing';$('retry').hidden=true;
 initializing=(async()=>{try{const url=new URL('../simulation/src/cinema.js',import.meta.url);if(attempt++)url.searchParams.set('retry',attempt);engine=await import(url.href);const loaded=await engine.ready;if(loaded)studyReady();return loaded;}catch{initializing=null;$('load-status').hidden=false;$('load-status').textContent='The study could not load. Please try again.';$('voice-state').textContent='Study unavailable';studyError();return false;}})();
 return initializing;
}
function studyVisible(){const rect=$('simulation').getBoundingClientRect();return !document.hidden&&!menu.open&&rect.bottom>0&&rect.top<innerHeight;}
async function activateFor(action){
 const intent=++activationIntent;
 // Move at the visitor's click, never later when a network request completes.
 experience.scrollIntoView({block:'center',behavior:reduced.matches?'instant':'smooth'});
 if(await activate()&&intent===activationIntent&&studyVisible())action();
}
function firstPlay(){return activateFor(()=>engine.startSequence());}
function firstRestart(){return activateFor(()=>engine.showChapter(0));}
function firstChapter(event){const index=Number(event.currentTarget.dataset.step);return activateFor(()=>engine.showChapter(index));}
$('play').addEventListener('click',firstPlay);$('restart').addEventListener('click',firstRestart);document.querySelectorAll('.chapters button').forEach(b=>b.addEventListener('click',firstChapter));
document.querySelector('.try-it').addEventListener('toggle',event=>{if(event.target.open&&!initializing)activate();});
$('retry').addEventListener('click',()=>{if(!engine)activate();else{loader.hidden=false;busy(true);}});
function suspendStudy(){activationIntent++;engine?.pauseSequence();}
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)suspendStudy();},{threshold:0});observer.observe($('simulation'));}
document.addEventListener('visibilitychange',()=>{if(document.hidden)suspendStudy();});
menuButton.addEventListener('click',suspendStudy);
