(()=>{'use strict';
const mobile=matchMedia('(max-width:700px)'),english=document.documentElement.lang==='en';
const universe=document.querySelector('.life-universe');
if(universe){
 const stage=document.createElement('div');stage.className='life-orbit-stage';
 const orbit=universe.querySelector('.life-orbits');orbit.setAttribute('preserveAspectRatio','xMidYMid meet');orbit.innerHTML='<circle cx="500" cy="500" r="380"/><circle cx="500" cy="500" r="402"/>';
 universe.append(stage);[orbit,universe.querySelector('.life-node-layer'),universe.querySelector('.life-center')].forEach(el=>stage.append(el));
 function fit(){const intro=universe.querySelector('.life-intro'),h=universe.clientHeight,w=universe.clientWidth,top=intro.offsetTop+intro.offsetHeight+16,bottom=36,size=Math.max(180,Math.min(w-20,h-top-bottom));stage.style.width=stage.style.height=size+'px';stage.style.top=(top+(h-top-bottom-size)/2)+'px';}
 new ResizeObserver(fit).observe(universe);new ResizeObserver(fit).observe(universe.querySelector('.life-intro'));document.fonts.ready.then(fit);fit();
}
})();
