(()=>{
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)],rm=matchMedia("(prefers-reduced-motion: reduce)").matches,R=document.documentElement;let calm=rm||R.classList.contains("calm");

/* Transição de página: a faixa cobre a tela com a logo (classe .on) e guarda um aviso; a página nova abre já coberta (classe .nav, no <head>)
   no mesmo estado e a faixa sai com a logo crescendo. Assim a logo aparece uma vez só, sem sumir e reaparecer. */
const wp=$("#wipe");
$$("a[href]").forEach(a=>{const u=new URL(a.href,location);
if(u.origin===location.origin&&u.pathname!==location.pathname&&!a.target)a.addEventListener("click",e=>{
if(e.metaKey||e.ctrlKey||e.shiftKey||e.button||calm)return;e.preventDefault();
R.classList.remove("nav");wp.classList.add("on");try{sessionStorage.wipe="1"}catch(x){}setTimeout(()=>location.href=a.href,640)})});
wp.addEventListener("animationend",e=>{if(e.target===wp)R.classList.remove("nav")});
addEventListener("pageshow",e=>{if(e.persisted){wp.classList.remove("on");R.classList.remove("nav");try{sessionStorage.removeItem("wipe")}catch(x){}}});

/* Altura do header (usada no tamanho do hero) */
const hd=$("header");if(hd){const hh=()=>R.style.setProperty("--hh",hd.offsetHeight+"px");hh();new ResizeObserver(hh).observe(hd)}

/* Rolagem: variáveis CSS para parallax, fade e barra de progresso */
let sy=0,tk=0;
function sc(){sy=scrollY;R.style.setProperty("--sy",sy);R.style.setProperty("--pr",sy/Math.max(1,R.scrollHeight-innerHeight));tk=0}
addEventListener("scroll",()=>tk||(tk=requestAnimationFrame(sc)),{passive:true});sc();

/* Entrada e saída dos blocos ao entrar e sair da tela */
const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle("in",e.isIntersecting)),{threshold:.12});
$$("[data-r]").forEach(e=>rm?e.classList.add("in"):io.observe(e));

/* As páginas de leitura usam navegação e progresso sem manter efeitos de fundo ativos. */
if(!document.body.classList.contains("home")){const background=$("#fx");if(background)background.remove();return}

/* Partículas: faíscas de tinta (verde e amarelo) e fumaça */
const fx=$("#fx"),g=fx.getContext("2d"),C=["#3ccf23","#ffd21a","#f1f5ee"],S=[],K=[];let W,H,mx=0,lsy=sy;
function fit(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;fx.width=W*d;fx.height=H*d;g.setTransform(d,0,0,d,0,0)}
addEventListener("resize",fit);fit();
for(let i=0;i<(W<700?34:70);i++)S.push({x:Math.random()*W,y:Math.random()*H,r:.8+Math.random()*2.6,v:.15+Math.random()*.5,c:C[i%3],p:Math.random()*6.3});
addEventListener("pointermove",e=>{mx=e.clientX/W-.5},{passive:true});
const smoke=(x,y,n,p)=>{for(let i=0;i<n;i++)K.push({x,y,vx:-(1+Math.random()*3)*p,vy:-Math.random()*1.2,r:6+Math.random()*8,u:.5+Math.random()*.5,l:1})};
function parts(t){
g.clearRect(0,0,W,H);const dv=sy-lsy;lsy=sy;
S.forEach(s=>{s.y+=-s.v-dv*.04*s.r;s.x+=Math.sin(t/1500+s.p)*.25+mx*.3;
if(s.y<-8)s.y=H+8;if(s.y>H+8)s.y=-8;if(s.x<-8)s.x=W+8;if(s.x>W+8)s.x=-8;
g.globalAlpha=.2+.4*Math.pow(Math.sin(t/700+s.p),2);g.fillStyle=s.c;g.beginPath();g.arc(s.x,s.y,s.r,0,6.3);g.fill()});
for(const p of K){p.x+=p.vx;p.y+=p.vy;p.vy-=.01;p.r+=p.u;p.l-=.014;g.globalAlpha=Math.max(0,p.l*.38);g.fillStyle="#cfd6cf";g.beginPath();g.arc(p.x,p.y,p.r,0,6.3);g.fill()}
while(K.length&&K[0].l<=0)K.shift();
}

/* Gol GTI: corpo do jogo (albedo + normal map) iluminado em WebGL por uma luz colorida que segue o cursor; rodas do jogo em camadas, ligadas ao deslocamento */
const car=$("#car");let step=()=>{},stop=()=>{},rev=0;
if(car){
const whs=$$(".wh",car),spin=$$(".wa,.wc",car),cv=$("canvas",car),ASP=2010/840;
let ptx=0,pty=0,lp=0,gl=null,U={},lx=.5,ly=.9,idle=-9e9,tx=0,rot=0,frontRot=0,vis=false,t0=0,pt=0;
const fallback=()=>{if(!$(".fb",car)){const i=new Image();i.className="fb";i.alt="";i.width=2010;i.height=840;i.src="assets/img/gol-corpo-2010.webp";car.prepend(i)}cv.hidden=true};
try{gl=cv.getContext("webgl")}catch(e){}
function paint(t){
if(!gl||!U.P)return;gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform3f(U.P,lx,ly,.55);
const m=.5+.5*Math.sin(t/1400);gl.uniform3f(U.C,.24+.76*m,.81+.01*m,.14-.04*m);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
function size(){const d=Math.min(devicePixelRatio||1,2),w=Math.min(2010,Math.max(640,Math.round(car.offsetWidth*d)));cv.width=w;cv.height=Math.round(w/ASP);if(gl){gl.viewport(0,0,cv.width,cv.height);paint(0)}}
size();new ResizeObserver(size).observe(car);
if(gl)try{
const sh=(k,s)=>{const o=gl.createShader(k);gl.shaderSource(o,s);gl.compileShader(o);return o},pr=gl.createProgram();
gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0,1);}"));
/* base = luz fixa do jogo (superfície plana = 1,0, como no render original); sobre ela entra a luz colorida do cursor */
gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec2 v;uniform sampler2D A,N;uniform vec3 P,C;void main(){vec4 c=texture2D(A,v);vec3 n=normalize(texture2D(N,v).rgb*2.-1.);vec3 g=normalize(vec3(-.55,.56,.62));float base=.45+.887*min(max(dot(n,g),0.),1.5);vec3 d=vec3((P.xy-v)*vec2(2.393,1.),P.z);vec3 l=normalize(d);float f=1./(1.+3.5*dot(d.xy,d.xy));float df=max(dot(n,l),0.)*f;vec3 h=normalize(l+vec3(0.,0.,1.));float sp=pow(max(dot(n,h),0.),36.)*f;vec3 col=c.rgb*base*mix(vec3(1.),C*1.05,clamp(df*.6,0.,1.))+C*sp*.7;gl_FragColor=vec4(col*c.a,c.a);}"));
gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 0;gl.useProgram(pr);
const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const q=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(q);gl.vertexAttribPointer(q,2,gl.FLOAT,false,0,0);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);
let ok=0;["gol-corpo-a","gol-corpo-n"].forEach((n,i)=>{const im=new Image();im.onload=()=>{try{
const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
["TEXTURE_MIN_FILTER","TEXTURE_MAG_FILTER"].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,gl[k],gl.LINEAR));
["TEXTURE_WRAP_S","TEXTURE_WRAP_T"].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,gl[k],gl.CLAMP_TO_EDGE));
if(++ok==2){U={P:gl.getUniformLocation(pr,"P"),C:gl.getUniformLocation(pr,"C")};
gl.uniform1i(gl.getUniformLocation(pr,"A"),0);gl.uniform1i(gl.getUniformLocation(pr,"N"),1);paint(0)}}catch(e){gl=null;fallback()}};
im.onerror=fallback;im.src="assets/img/"+n+".webp"})}catch(e){gl=null;fallback()}
else fallback();
cv.addEventListener("webglcontextlost",e=>{e.preventDefault();gl=null;fallback()});
const aim=()=>{const r=car.getBoundingClientRect();lx=Math.max(-.3,Math.min(1.3,(ptx-r.left)/r.width));ly=Math.max(-.2,Math.min(1.4,1-(pty-r.top)/r.height))};
addEventListener("pointermove",e=>{ptx=e.clientX;pty=e.clientY;idle=performance.now();if(calm){aim();paint(0)}},{passive:true});
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(car.parentElement);
const rb=$("#rev");if(rb){if(rm)rb.hidden=true;else rb.addEventListener("click",()=>{if(!calm)rev=1})}
const ease=x=>1-Math.pow(1-x,3);
if(!calm)car.style.transform="translate(-"+(innerWidth+car.offsetWidth)+"px,0)";
if(!rm)step=t=>{
if(!vis)return;if(!t0)t0=t;
const sr=car.parentElement.getBoundingClientRect(),p=Math.max(0,Math.min(1,(t-t0-600)/2600)),off=-(1-ease(p))*(innerWidth+car.offsetWidth)+Math.max(0,sy-Math.max(0,sr.bottom+sy-innerHeight))*1.1;
const dx=off-tx;tx=off;const Rp=car.offsetWidth*.0793;
rev*=.965;rot+=dx/Rp;frontRot+=rev*.55;
car.style.transform="translate("+off.toFixed(1)+"px,0)";
spin.forEach((i,n)=>i.style.transform="rotate("+(rot+(n<2?0:frontRot))+"rad)");
if(Math.abs(dx)>3||rev>.08){const w=whs[1].getBoundingClientRect();if(t-pt>40){pt=t;smoke(w.left+w.width*.12,w.bottom-10,1+(rev>.3?1:0),1+rev*2)}}
if(t-idle<2500)aim();else{lx=.5+.5*Math.sin(t/2200);ly=.9}
if(innerWidth>700||t-lp>33){lp=t;paint(t)}};
stop=()=>{car.style.transform="";spin.forEach(i=>i.style.transform="");rev=0;paint(0)};
}
const cb=$("#calm");
if(cb){if(rm)cb.hidden=true;const sy2=()=>{cb.setAttribute("aria-pressed",calm);cb.textContent=calm?"Animações pausadas":"Pausar animações"};sy2();
cb.addEventListener("click",()=>{calm=!calm;R.classList.toggle("calm",calm);try{localStorage.calm=calm?"1":"0"}catch(e){}sy2();if(calm){K.length=0;stop();parts(0)}})}
if(calm)parts(0);
const f=t=>{if(!calm){parts(t);step(t)}requestAnimationFrame(f)};requestAnimationFrame(f)
})();
