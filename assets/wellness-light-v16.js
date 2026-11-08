(()=>{'use strict';
const hero=document.querySelector('.w-hero'),imageLayer=hero?.querySelector('.w-hero-image');if(!hero||!imageLayer)return;
const reduced=matchMedia('(prefers-reduced-motion:reduce)'),canvas=document.createElement('canvas');canvas.className='w-ripple-canvas';canvas.setAttribute('aria-hidden','true');imageLayer.append(canvas);hero.dataset.lightMode='fallback';
const atmosphere=document.createElement('div');atmosphere.className='w-light-atmosphere';atmosphere.setAttribute('aria-hidden','true');
for(let i=0;i<5;i++){const b=document.createElement('i');b.className='w-sun-beam';b.style.cssText=`--beam-x:${63+i*8}%;--beam-w:${2.6+i%2*2}%;--beam-speed:${12+i*1.7}s;--beam-delay:${-i*2.3}s`;atmosphere.append(b)}
for(let i=0;i<16;i++){const p=document.createElement('i');p.className='w-sun-dust';p.style.cssText=`--dust-x:${54+(i*.618%1)*43}%;--dust-y:${8+(i*.382%1)*59}%;--dust-size:${i%3===0?2:1}px;--dust-speed:${11+i%5*2}s;--dust-delay:${-i*1.7}s`;atmosphere.append(p)}hero.append(atmosphere);
const vertex=`attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
const fragment=`precision mediump float;
varying vec2 v_uv;uniform sampler2D u_image;uniform vec4 u_cover;uniform float u_time;uniform float u_aspect;uniform float u_motion;uniform vec3 u_ripples[4];
void main(){
 vec2 uv=v_uv*u_cover.xy+u_cover.zw;
 float head=1.-smoothstep(.78,1.12,length((uv-vec2(.79,.51))/vec2(.14,.23)));
 float body=1.-smoothstep(.78,1.12,length((uv-vec2(.70,.23))/vec2(.26,.34)));
 float safe=(1.-max(head,body))*smoothstep(.35,.55,uv.x);
 vec2 shift=vec2(0.);
 for(int i=0;i<4;i++){
  float age=u_time-u_ripples[i].z;
  vec2 delta=(v_uv-u_ripples[i].xy)*vec2(u_aspect,1.);
  float dist=length(delta);float active=step(0.,age)*(1.-step(3.8,age));
  float band=(dist-age*.17)/.075;float wave=sin(dist*65.-age*7.)*exp(-band*band)*exp(-age*1.05)*active;
  shift+=delta/max(dist,.001)*wave*.0032/vec2(u_aspect,1.);
 }
 shift+=vec2(sin(uv.y*17.+u_time*.38),cos(uv.x*14.-u_time*.23))*.00035;
 vec2 displaced=clamp(uv+shift*safe*u_motion,vec2(.001),vec2(.999));
 vec3 color=texture2D(u_image,displaced).rgb;
 float rayX=uv.x+(1.-uv.y)*.48;float r1=(rayX-.78)/.023;float r2=(rayX-.91)/.016;float r3=(rayX-1.03)/.032;float rays=exp(-r1*r1)+exp(-r2*r2)*.7+exp(-r3*r3)*.5;
 float breathe=.65+.18*sin(u_time*.36)+.1*sin(u_time*.61+uv.y*3.);
 color+=vec3(1.,.82,.55)*rays*breathe*.037*safe;
 gl_FragColor=vec4(color,1.);
}`;
let gl=null,program=null,texture=null,buffer=null,loc=null,ready=false,visible=false,frame=0,last=0,clock=0,lastPointer=-1,rippleIndex=0,failed=false;let iw=1,ih=1;const ripples=new Float32Array([0,0,-100,0,0,-100,0,0,-100,0,0,-100]);
function fallback(reason){failed=true;ready=false;hero.dataset.lightMode='fallback';cancelAnimationFrame(frame);frame=0;canvas.style.opacity='0';if(reason)console.info('Wellness light: using soft-light fallback ('+reason+').')}
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(message||'shader compile failed')}return s}
function size(){if(!ready||failed)return;const r=imageLayer.getBoundingClientRect(),w=Math.max(1,r.width),h=Math.max(1,r.height),dpr=Math.min(devicePixelRatio||1,w<700?1.25:1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);const scale=Math.max(w/iw,h/ih),vx=w/(iw*scale),vy=h/(ih*scale);const pos=getComputedStyle(imageLayer).backgroundPosition.split(' ');const px=parseFloat(pos[0])/100||.65,py=parseFloat(pos[1])/100||.5;gl.uniform4f(loc.cover,vx,vy,(1-vx)*px,(1-vy)*(1-py));gl.uniform1f(loc.aspect,w/h);start()}
function tick(ts){frame=0;if(!ready||failed||!visible||document.hidden)return;const dt=last?Math.min((ts-last)/1000,.05):.016;last=ts;if(!reduced.matches)clock+=dt;gl.uniform1f(loc.time,clock);gl.uniform1f(loc.motion,reduced.matches?0:1);gl.uniform3fv(loc.ripples,ripples);gl.drawArrays(gl.TRIANGLES,0,6);if(!reduced.matches)frame=requestAnimationFrame(tick)}
function start(){if(!frame&&ready&&!failed&&visible&&!document.hidden){last=0;frame=requestAnimationFrame(tick)}}
async function init(){if(gl||failed)return;try{gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false});if(!gl){fallback('WebGL unavailable');return}const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);loc={cover:gl.getUniformLocation(program,'u_cover'),time:gl.getUniformLocation(program,'u_time'),aspect:gl.getUniformLocation(program,'u_aspect'),motion:gl.getUniformLocation(program,'u_motion'),ripples:gl.getUniformLocation(program,'u_ripples[0]')};
 const url=getComputedStyle(imageLayer).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];if(!url)throw new Error('background missing');const image=new Image();image.decoding='async';image.src=url;await image.decode();iw=image.naturalWidth;ih=image.naturalHeight;texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.uniform1i(gl.getUniformLocation(program,'u_image'),0);ready=true;hero.dataset.lightMode='webgl';size();start();
 }catch(error){fallback(error.message)}}
function ripple(e){if(reduced.matches||!ready||failed||e.target.closest('a,button,input,select,textarea'))return;if(clock-lastPointer<.055)return;lastPointer=clock;const r=imageLayer.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=1-(e.clientY-r.top)/r.height;if(x<0||x>1||y<0||y>1)return;const k=(rippleIndex++%4)*3;ripples[k]=x;ripples[k+1]=y;ripples[k+2]=clock;start()}
hero.addEventListener('pointermove',ripple,{passive:true});hero.addEventListener('pointerdown',ripple,{passive:true});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('context lost')});new ResizeObserver(size).observe(hero);new IntersectionObserver(([e])=>{visible=e.isIntersecting;hero.classList.toggle('w-light-visible',visible);if(visible){init();start()}else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'60px'}).observe(hero);document.addEventListener('visibilitychange',()=>{hero.classList.toggle('w-light-paused',document.hidden);if(document.hidden){cancelAnimationFrame(frame);frame=0}else start()});reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;ripples.fill(-100);start()});
})();
