'use strict';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const chinese = () => document.documentElement.lang === 'zh-CN';

// Two real project cards, with inert edge copies for a seamless wrap.
const carousel = document.querySelector('.project-carousel');
if (carousel) {
  const viewport = carousel.querySelector('.carousel-window');
  const track = carousel.querySelector('.carousel-track');
  const originals = [...track.children];
  const clone = card => {
    const copy = card.cloneNode(true);
    copy.dataset.clone = 'true';
    copy.inert = true;
    copy.setAttribute('aria-hidden','true');
    return copy;
  };
  track.prepend(clone(originals.at(-1)));
  track.append(clone(originals[0]));
  const slides = [...track.children];
  let position = 1, focused = false;
  let visible = false, moving = false, timer = null, settleTimer = null;
  const dots = [...carousel.querySelectorAll('[data-slide-to]')];
  carousel.querySelector('.carousel-controls').hidden = false;
  carousel.classList.add('carousel-ready');
  const logicalIndex = () => (position - 1 + originals.length) % originals.length;
  const paint = (animate = true) => {
    track.style.transition = animate && !reducedMotion.matches ? '' : 'none';
    const card = slides[position];
    track.style.transform = `translate3d(${viewport.clientWidth / 2 - card.offsetLeft - card.offsetWidth / 2}px,0,0)`;
    slides.forEach((slide,index) => {
      slide.classList.toggle('is-active',index === position);
      slide.inert = index !== position || slide.dataset.clone === 'true';
      slide.setAttribute('aria-hidden',String(index !== position || slide.dataset.clone === 'true'));
    });
    dots.forEach((dot,index) => dot.setAttribute('aria-current',String(index === logicalIndex())));
  };
  const schedule = () => {
    clearInterval(timer);
    if (!visible || reducedMotion.matches || focused || document.hidden) return;
    // Count from the start of each switch, independently of its animation.
    timer = setInterval(() => move(1),5000);
  };
  const settle = () => {
    clearTimeout(settleTimer);
    if (position === 0) { position = originals.length; paint(false); }
    else if (position === slides.length - 1) { position = 1; paint(false); }
    moving = false;
    // Commit the non-animated wrap before accepting another navigation input.
    void track.offsetWidth;
  };
  const go = (target,announce = false) => {
    if (moving) settle();
    if (target === position) { if (announce) schedule(); return; }
    position = target;
    moving = true;
    paint();
    document.getElementById('project-announcement').textContent = announce ? `${logicalIndex() + 1} / ${originals.length}: ${originals[logicalIndex()].querySelector('h2,h3').textContent}` : '';
    // A fallback covers transitions interrupted by resizing or tab visibility.
    settleTimer = setTimeout(settle,reducedMotion.matches ? 0 : 550);
    if (announce) schedule();
  };
  const move = (direction,announce = false) => {
    if (moving) settle();
    go(position + direction,announce);
  };
  track.addEventListener('transitionend',event => { if (moving && event.target === track && event.propertyName === 'transform') settle(); });
  document.getElementById('project-prev').addEventListener('click',() => move(-1,true));
  document.getElementById('project-next').addEventListener('click',() => move(1,true));
  dots.forEach((dot,index) => dot.addEventListener('click',() => go(index + 1,true)));
  // Keep timed playback running after arrow/dot clicks. Pause while a reader
  // is focused inside the card itself.
  viewport.addEventListener('focusin',() => { focused = true; schedule(); });
  viewport.addEventListener('focusout',event => { if (!viewport.contains(event.relatedTarget)) { focused = false; schedule(); } });
  carousel.addEventListener('keydown',event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const backward = event.key === 'ArrowLeft';
    const fromCard = viewport.contains(event.target);
    move(backward ? -1 : 1,true);
    // A card becomes inert when it leaves. Keep keyboard focus on a stable
    // control rather than allowing the browser to drop it onto the page body.
    if (fromCard) document.getElementById(backward ? 'project-prev' : 'project-next').focus({preventScroll:true});
  });
  let touchStart = null, suppressSwipeClick = false;
  viewport.addEventListener('pointerdown',event => { if (event.pointerType === 'touch') touchStart = {x:event.clientX,y:event.clientY}; });
  viewport.addEventListener('pointerup',event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      suppressSwipeClick = true;
      setTimeout(() => { suppressSwipeClick = false; },350);
      move(dx < 0 ? 1 : -1,true);
    }
  });
  viewport.addEventListener('click',event => {
    if (!suppressSwipeClick) return;
    suppressSwipeClick = false; event.preventDefault(); event.stopPropagation();
  },{capture:true});
  viewport.addEventListener('pointercancel',() => { touchStart = null; });
  new ResizeObserver(() => { if (moving) settle(); paint(false); }).observe(viewport);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); },{threshold:0.25}).observe(viewport);
  document.addEventListener('visibilitychange',() => { if (document.hidden) settle(); schedule(); });
  reducedMotion.addEventListener('change',() => { paint(false); schedule(); });
  document.addEventListener('portfolio-language',() => { document.getElementById('project-announcement').textContent = ''; });
  paint(false);
}

// Original procedural light: slow moving ribbons, no videos or remote assets.
const fluidStates = [];
const vertexSource = 'attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.0,1.0);}';
const fragmentSource = `
precision mediump float;
uniform vec2 u_size;
uniform float u_time;
uniform float u_dark;
uniform vec2 u_pointer;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float field(vec2 p){float n=0.,a=.5;for(int i=0;i<3;i++){n+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.1+2.7;a*=.5;}return n;}
void main(){
 vec2 uv=gl_FragCoord.xy/u_size;vec2 p=(uv-.5)*vec2(u_size.x/u_size.y,1.)*2.;
 vec2 cursor=(u_pointer-.5)*vec2(u_size.x/u_size.y,1.)*2.;
 float influence=exp(-2.5*dot(p-cursor,p-cursor));
 p+=(p-cursor)*influence*.13;
 float t=u_time*.08;
 vec2 warp=vec2(field(p+vec2(t,-t*.4)),field(p+vec2(-t*.6,t)+4.));
 float wave=sin(p.x*2.3+p.y*1.6+warp.x*5.+t);
 float ribbon=smoothstep(.05,.9,wave)*(.5+.5*field(p+warp+t*.25));
 float glow=exp(-3.*length(p-vec2(sin(t)*.7,cos(t*.7)*.3)));
 vec3 paper=vec3(.957,.949,.922);
 vec3 light=paper+vec3(-.027,-.009,.009)*ribbon+vec3(.018,.012,.004)*glow;
 vec3 dark=mix(vec3(.075,.105,.09),vec3(.23,.27,.23),ribbon*.85+glow*.12);
 dark+=vec3(.07,.018,.006)*pow(max(0.,wave),4.)*.35;
 gl_FragColor=vec4(mix(light,dark,u_dark),1.);
}`;
for (const canvas of document.querySelectorAll('[data-fluid]')) {
  const gl = canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
  if (!gl) { canvas.hidden = true; continue; }
  const compile = (type,source) => {
    const shader = gl.createShader(type); gl.shaderSource(shader,source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  };
  const vertex = compile(gl.VERTEX_SHADER,vertexSource), fragment = compile(gl.FRAGMENT_SHADER,fragmentSource);
  if (!vertex || !fragment) { canvas.hidden = true; continue; }
  const program = gl.createProgram(); gl.attachShader(program,vertex); gl.attachShader(program,fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) { canvas.hidden = true; continue; }
  gl.deleteShader(vertex); gl.deleteShader(fragment); gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const attribute = gl.getAttribLocation(program,'a_position'); gl.enableVertexAttribArray(attribute); gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
  const size = gl.getUniformLocation(program,'u_size'), time = gl.getUniformLocation(program,'u_time');
  const pointer = gl.getUniformLocation(program,'u_pointer');
  gl.uniform1f(gl.getUniformLocation(program,'u_dark'),canvas.dataset.fluid === 'dark' ? 1 : 0);
  const state = {visible:true,last:0,elapsed:0,x:.5,y:.5,targetX:.5,targetY:.5,render(stamp,still=false){
    if (gl.isContextLost()) return;
    if (!still && (!this.visible || document.hidden || reducedMotion.matches || stamp-this.last < 40)) return;
    if (!still && this.last) this.elapsed += Math.min(stamp-this.last,80);
    this.last=stamp;
    this.x+=(this.targetX-this.x)*.07;this.y+=(this.targetY-this.y)*.07;
    const ratio=Math.min(devicePixelRatio || 1,1),width=Math.max(1,Math.round(canvas.clientWidth*ratio)),height=Math.max(1,Math.round(canvas.clientHeight*ratio));
    if(canvas.width!==width || canvas.height!==height){canvas.width=width;canvas.height=height;gl.viewport(0,0,width,height);}
    gl.useProgram(program);gl.uniform2f(size,width,height);gl.uniform1f(time,this.elapsed/1000);gl.uniform2f(pointer,this.x,this.y);gl.drawArrays(gl.TRIANGLES,0,6);
  }};
  fluidStates.push(state);
  document.addEventListener('pointermove',event=>{
    if (event.pointerType !== 'mouse' || reducedMotion.matches || !state.visible) return;
    const bounds=canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    state.targetX=Math.max(0,Math.min(1,(event.clientX-bounds.left)/bounds.width));
    state.targetY=1-Math.max(0,Math.min(1,(event.clientY-bounds.top)/bounds.height));
  },{passive:true});
  new ResizeObserver(()=>state.render(performance.now(),true)).observe(canvas);
  new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;state.last=0;}).observe(canvas);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();state.visible=false;canvas.hidden=true;});
  state.render(performance.now(),true);
}
function animateBackground(stamp){fluidStates.forEach(state=>state.render(stamp));requestAnimationFrame(animateBackground);}
requestAnimationFrame(animateBackground);
reducedMotion.addEventListener('change',()=>{fluidStates.forEach(state=>{state.last=0;});});

const socialCaption = document.getElementById('social-caption');
function contactCaption(link){
  if (!link) { socialCaption.textContent=chinese() ? '保持联系。' : "Let's connect."; return; }
  const labels={email:'1446008821@gmail.com',whatsapp:'+44 7468 176158',github:chinese()?'在 GitHub 上找到我':'Find me on GitHub',linkedin:chinese()?'在 LinkedIn 上联系我':'Contact me on LinkedIn'};
  socialCaption.textContent=labels[link.dataset.contact];
}
const socialLinks=document.querySelector('.social-links');
socialLinks.addEventListener('pointerover',event=>{const link=event.target.closest('.social-link');if(link)contactCaption(link);});
socialLinks.addEventListener('pointerleave',()=>contactCaption(socialLinks.querySelector(':focus')));
socialLinks.addEventListener('focusin',event=>contactCaption(event.target.closest('.social-link')));
socialLinks.addEventListener('focusout',event=>contactCaption(event.relatedTarget?.closest('.social-link')));
document.addEventListener('portfolio-language',()=>contactCaption(socialLinks.querySelector(':focus')));
