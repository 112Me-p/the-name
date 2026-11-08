(()=>{'use strict';
const section=document.querySelector('#discover');if(!section)return;
const names=['mini','life','deep','future','path'],cards=[...section.querySelectorAll('[data-dimension]')],gallery=section.querySelector('.v4-gallery'),backdrop=document.createElement('div'),mobile=matchMedia('(max-width:700px)'),fine=matchMedia('(hover:hover) and (pointer:fine)'),en=document.documentElement.lang==='en';
backdrop.className='insight-hover-backdrop';backdrop.setAttribute('aria-hidden','true');
const images=names.map(n=>{const img=new Image();img.alt='';img.decoding='async';img.dataset.src='assets/insight-'+n+'.webp';backdrop.append(img);return img});document.body.prepend(backdrop);
const nav=document.createElement('nav');nav.className='dimension-mobile-nav';nav.setAttribute('aria-label',en?'Choose an Insight dimension':'เลือกมิติ Insight');
const shortNames=['Mini','Life','Deep','Future','Path'];
const tabs=cards.map((card,i)=>{const b=document.createElement('button');b.type='button';b.textContent=String(i+1).padStart(2,'0')+' · '+shortNames[i];b.setAttribute('aria-label',card.querySelector('.v4-card-name').textContent);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{section.scrollIntoView({block:'start',behavior:'instant'});gallery.scrollTo({left:card.offsetLeft-gallery.offsetLeft-(gallery.clientWidth-card.offsetWidth)/2,behavior:'instant'});show(i);});nav.append(b);return b});section.querySelector('.wrap').append(nav);
function backdropLayout(){if(mobile.matches)section.prepend(backdrop);else document.body.prepend(backdrop)}backdropLayout();mobile.addEventListener('change',backdropLayout);
let keyboard=false,selected=-1,inView=false,scrollFrame=0;
function preload(){images.forEach(img=>{if(!img.getAttribute('src'))img.src=img.dataset.src})}
function show(i){preload();selected=i;images.forEach((img,j)=>img.classList.toggle('is-current',i===j));tabs.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));document.body.classList.add('insight-background-on')}
function hide(){selected=-1;document.body.classList.remove('insight-background-on');tabs.forEach(b=>b.setAttribute('aria-pressed','false'))}
document.addEventListener('keydown',e=>{if(e.key==='Tab')keyboard=true});
document.addEventListener('pointerdown',e=>{keyboard=false;if(!e.target.closest('#discover'))hide()});
document.addEventListener('pointermove',e=>{if(!fine.matches||mobile.matches)return;keyboard=false;if(!e.target.closest('#discover [data-dimension]'))hide()},{passive:true});
cards.forEach((card,i)=>{
 card.addEventListener('pointerenter',e=>{if(fine.matches&&!mobile.matches&&e.pointerType!=='touch')show(i)});
 card.addEventListener('pointerleave',()=>{if(!keyboard&&!mobile.matches)hide()});
 card.addEventListener('focusin',()=>{if(keyboard)show(i)});
 card.addEventListener('focusout',()=>{if(!mobile.matches)hide()});
 card.addEventListener('pointerdown',()=>show(i),{passive:true});card.addEventListener('click',()=>{show(i);if(mobile.matches)section.scrollIntoView({block:'start',behavior:'instant'})});
});
gallery.addEventListener('scroll',()=>{if(!mobile.matches||!inView||scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const r=gallery.getBoundingClientRect(),center=r.left+r.width/2;let nearest=0,best=Infinity;cards.forEach((c,i)=>{const q=c.getBoundingClientRect(),d=Math.abs(q.left+q.width/2-center);if(d<best){best=d;nearest=i}});show(nearest);const detail=section.querySelector('#dimension-detail');detail.hidden=true;cards.forEach(c=>c.setAttribute('aria-expanded','false'));})},{passive:true});
new IntersectionObserver(([e])=>{inView=e.isIntersecting;if(inView)preload();else hide()},{threshold:.2}).observe(section);
mobile.addEventListener('change',()=>{hide();section.querySelector('#dimension-detail').hidden=true;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});addEventListener('blur',hide);
})();
