(()=>{
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)],rm=matchMedia("(prefers-reduced-motion: reduce)").matches,R=document.documentElement;let calm=rm||R.classList.contains("calm");

/* Saída de página: faixa verde e amarela cobre a tela antes de navegar */
const wp=$("#wipe");
$$("a[href]").forEach(a=>{const u=new URL(a.href,location);
if(u.origin===location.origin&&u.pathname!==location.pathname&&!a.target)a.addEventListener("click",e=>{
if(e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;e.preventDefault();wp.classList.add("on");setTimeout(()=>location.href=a.href,rm?0:520)})});
addEventListener("pageshow",e=>e.persisted&&wp.classList.remove("on"));

/* Rolagem: variáveis CSS para parallax, fade e barra de progresso */
let sy=0,tk=0;
function sc(){sy=scrollY;R.style.setProperty("--sy",sy);R.style.setProperty("--pr",sy/Math.max(1,R.scrollHeight-innerHeight));tk=0}
addEventListener("scroll",()=>tk||(tk=requestAnimationFrame(sc)),{passive:true});sc();

/* Entrada e saída dos blocos ao entrar e sair da tela */
const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle("in",e.isIntersecting)),{threshold:.12});
$$("[data-r]").forEach(e=>rm?e.classList.add("in"):io.observe(e));

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

/* Gol GTI: iluminação dinâmica com normal map (WebGL) e rodas ligadas ao deslocamento */
const car=$("#car");let step=()=>{},stop=()=>{},rev=0;
if(car){
const whs=$$(".wh",car),rims=$$("img",car).filter(i=>i.closest(".wh")),cv=$("canvas",car),fb=$(".fb",car);
let ptx=0,pty=0,lp=0,gl=null,U={},lx=.5,ly=.9,idle=-9e9,tx=0,rot=0,vis=true,t0=performance.now(),pt=0;
try{gl=cv.getContext("webgl")}catch(e){}
function paint(t){
if(!gl||!U.P)return;gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform3f(U.P,lx,ly,.55);
const m=.5+.5*Math.sin(t/1400);gl.uniform3f(U.C,.24+.76*m,.81+.01*m,.14-.04*m);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
if(gl)try{
const sh=(k,s)=>{const o=gl.createShader(k);gl.shaderSource(o,s);gl.compileShader(o);return o},pr=gl.createProgram();
gl.attachShader(pr,sh(gl.VERTEX_SHADER,"attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0,1);}"));
gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,"precision mediump float;varying vec2 v;uniform sampler2D A,N;uniform vec3 P,C;void main(){vec4 c=texture2D(A,v);vec3 n=normalize(texture2D(N,v).rgb*2.-1.);vec3 d=vec3((P.xy-v)*vec2(3.84,1.),P.z);vec3 l=normalize(d);float f=1./(1.+.15*dot(d.xy,d.xy));float df=max(dot(n,l),0.)*f;vec3 h=normalize(l+vec3(0.,0.,1.));float sp=pow(max(dot(n,h),0.),36.)*f;float k=max(dot(n,normalize(vec3(-.4,.7,.6))),0.)*.28;vec3 col=c.rgb*(vec3(.1,.12,.14)+k+C*df*1.5)+C*sp*.9;gl_FragColor=vec4(col*c.a,c.a);}"));
gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 0;gl.useProgram(pr);
const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const q=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(q);gl.vertexAttribPointer(q,2,gl.FLOAT,false,0,0);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.viewport(0,0,cv.width,cv.height);gl.clearColor(0,0,0,0);
let ok=0;["gol","gol_n"].forEach((n,i)=>{const im=new Image();im.onload=()=>{try{
const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
["TEXTURE_MIN_FILTER","TEXTURE_MAG_FILTER"].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,gl[k],gl.LINEAR));
["TEXTURE_WRAP_S","TEXTURE_WRAP_T"].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,gl[k],gl.CLAMP_TO_EDGE));
if(++ok==2){U={P:gl.getUniformLocation(pr,"P"),C:gl.getUniformLocation(pr,"C")};
gl.uniform1i(gl.getUniformLocation(pr,"A"),0);gl.uniform1i(gl.getUniformLocation(pr,"N"),1);fb.hidden=true;paint(0)}}catch(e){gl=null}};
im.src="assets/img/"+n+".webp"})}catch(e){gl=null}
cv.addEventListener("webglcontextlost",e=>{e.preventDefault();gl=null;fb.hidden=false});
const aim=()=>{const r=car.getBoundingClientRect();lx=Math.max(-.3,Math.min(1.3,(ptx-r.left)/r.width));ly=Math.max(-.2,Math.min(1.4,1-(pty-r.top)/r.height))};
addEventListener("pointermove",e=>{ptx=e.clientX;pty=e.clientY;idle=performance.now();if(calm){aim();paint(0)}},{passive:true});
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(car.parentElement);
const rb=$("#rev");if(rb){if(rm)rb.hidden=true;else rb.addEventListener("click",()=>{if(!calm)rev=1})}
const ease=x=>1-Math.pow(1-x,3);
if(!rm)step=t=>{
if(!vis)return;
const p=Math.max(0,Math.min(1,(t-t0-1200)/2600)),off=-(1-ease(p))*(innerWidth+car.offsetWidth)+sy*1.1;
const dx=off-tx;tx=off;const Rp=car.offsetWidth*.0625;
rev*=.965;rot+=dx/Rp+rev*.55;
const j=rev>.05?(Math.random()-.5)*rev*3:0;
car.style.transform="translate("+off.toFixed(1)+"px,"+j.toFixed(1)+"px)";
rims.forEach(i=>i.style.transform="rotate("+rot+"rad)");
if(Math.abs(dx)>3||rev>.08){const w=whs[0].getBoundingClientRect();if(t-pt>40){pt=t;smoke(w.left+w.width*.25,w.bottom-10,1+(rev>.3?1:0),1+rev*2)}}
if(t-idle<2500)aim();else{lx=.5+.5*Math.sin(t/2200);ly=.9}
if(innerWidth>700||t-lp>33){lp=t;paint(t)}};
stop=()=>{car.style.transform="";rims.forEach(i=>i.style.transform="");rev=0;paint(0)};
}
const cb=$("#calm");
if(cb){if(rm)cb.hidden=true;const sy2=()=>{cb.setAttribute("aria-pressed",calm);cb.textContent=calm?"Animações pausadas":"Pausar animações"};sy2();
cb.addEventListener("click",()=>{calm=!calm;R.classList.toggle("calm",calm);try{localStorage.calm=calm?"1":"0"}catch(e){}sy2();if(calm){K.length=0;stop();parts(0)}})}
if(calm)parts(0);
const f=t=>{if(!calm){parts(t);step(t)}requestAnimationFrame(f)};requestAnimationFrame(f)
})();
