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

/* Luz que segue o cursor dentro dos cards (só ajusta variáveis CSS) */
if(!rm)document.addEventListener("pointermove",e=>{const c=e.target.closest&&e.target.closest(".fl>div,.directory-card,.home-area,.proof-card,.feature,.next-step,.gar,.close,.status-card,.res");if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px")},{passive:true});

/* Roda do banner das páginas de física: mesma roda do jogo, girando devagar sob a luz do cursor */
const WP=/(rodas|fenomenos|suspensao|transmissao)\.html$/.test(location.pathname),pi=$(".page-intro,.status-intro");
if(WP&&pi&&window.Wheel&&Wheel.ok){
const c=document.createElement("canvas");c.className="pi-wheel";c.setAttribute("aria-hidden","true");pi.append(c);pi.classList.add("has-wheel");
const x=c.getContext("2d");let px=.3,py=.8,ang=0,vs=false,lt=0;
addEventListener("pointermove",e=>{const r=c.getBoundingClientRect();px=(e.clientX-r.left)/r.width;py=1-(e.clientY-r.top)/r.height},{passive:true});
new IntersectionObserver(e=>vs=e[0].isIntersecting).observe(pi);
const go=t=>{if(vs&&!document.hidden&&t-lt>32){const dt=(t-lt)/1000;lt=t;if(!calm)ang+=dt*.35;const r=c.getBoundingClientRect(),S=Math.max(240,Math.min(720,Math.round(r.width*Math.min(devicePixelRatio||1,2))));
const m=.5+.5*Math.sin(t/1400),o=Wheel.draw({size:S,rot:ang,light:[Math.max(-1,Math.min(2,px)),Math.max(-1,Math.min(2,py)),.55],color:[.24+.76*m,.82,.14-.04*m]});
if(o){if(c.width!==S)c.width=c.height=S;x.clearRect(0,0,S,S);x.drawImage(o,0,0)}}requestAnimationFrame(go)};
Wheel.on(()=>requestAnimationFrame(go))}

/* As páginas de leitura usam navegação e progresso sem manter efeitos de fundo ativos. */
if(!document.body.classList.contains("home")){const background=$("#fx");if(background)background.remove();return}

/* Partículas: faíscas de tinta (verde e amarelo) e fumaça */
const fx=$("#fx"),g=fx.getContext("2d"),C=["#3ccf23","#ffd21a","#f1f5ee"],S=[],K=[];let W,H,mx=0,lsy=sy;
function fit(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;fx.width=W*d;fx.height=H*d;g.setTransform(d,0,0,d,0,0)}
addEventListener("resize",fit);fit();
for(let i=0;i<(W<700?12:24);i++)S.push({x:Math.random()*W,y:Math.random()*H,r:.8+Math.random()*2.6,v:.15+Math.random()*.5,c:C[i%3],p:Math.random()*6.3});
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
const whs=$$(".wh",car),wcs=$$(".wc",car),cv=$("canvas",car),ASP=2010/840;
let frontRot=0,ptx=0,pty=0,lp=0,gl=null,U={},lx=.5,ly=.9,idle=-9e9,rearRot=0,vis=false,pt=0;
const fallback=()=>{if(!$(".car-poster,.fb",car)){const i=new Image();i.className="fb";i.alt="";i.width=2010;i.height=840;i.src="assets/img/gol-corpo-2010.webp";car.prepend(i)}cv.hidden=true;cv.style.display="none"};
try{gl=cv.getContext("webgl")}catch(e){}
function paint(t){
if(!gl||!U.P)return;gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform3f(U.P,lx,ly,.55);
const m=.5+.5*Math.sin(t/1400);gl.uniform3f(U.C,.24+.76*m,.81+.01*m,.14-.04*m);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
function size(){const d=Math.min(devicePixelRatio||1,2),w=Math.min(2010,Math.max(640,Math.round(car.offsetWidth*d)));cv.width=w;cv.height=Math.round(w/ASP);if(gl){gl.viewport(0,0,cv.width,cv.height);paint(0)}}
size();new ResizeObserver(()=>{size();wpaint(0)}).observe(car);
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
gl.uniform1i(gl.getUniformLocation(pr,"A"),0);gl.uniform1i(gl.getUniformLocation(pr,"N"),1);paint(0);car.classList.add("lit")}}catch(e){gl=null;fallback()}};
im.onerror=fallback;im.src="assets/img/"+n+".webp"})}catch(e){gl=null;fallback()}
else fallback();
cv.addEventListener("webglcontextlost",e=>{e.preventDefault();gl=null;fallback()});
let gd=true,gC=null,gW=[];addEventListener("scroll",()=>gd=true,{passive:true});addEventListener("resize",()=>gd=true);
const wpaint=t=>{if(!Wheel.ready())return;if(gd||!gC){gC=car.getBoundingClientRect();gW=wcs.map(c=>c.getBoundingClientRect());gd=false}const cr=gC,m=.5+.5*Math.sin(t/1400),col=[.24+.76*m,.81+.01*m,.14-.04*m],k=Math.min(devicePixelRatio||1,2);
wcs.forEach((c,i)=>{const r=gW[i];if(!r||!r.width)return;const S=Math.max(160,Math.min(480,Math.round(r.width*k)));
const L=[(cr.left+lx*cr.width-r.left)/r.width,1-(cr.top+(1-ly)*cr.height-r.top)/r.height,.55].map((v,j)=>j<2?Math.max(-2,Math.min(3,v)):v);
const o=Wheel.draw({size:S,rot:i?frontRot:rearRot,light:L,color:col});if(!o)return;if(c.width!==S){c.width=c.height=S}const x=c.getContext("2d");x.clearRect(0,0,S,S);x.drawImage(o,0,0)})};
Wheel.on(()=>wpaint(0));
const aim=()=>{const r=car.getBoundingClientRect();lx=Math.max(-.3,Math.min(1.3,(ptx-r.left)/r.width));ly=Math.max(-.2,Math.min(1.4,1-(pty-r.top)/r.height))};
addEventListener("pointermove",e=>{ptx=e.clientX;pty=e.clientY;idle=performance.now();if(calm){aim();paint(0);wpaint(0)}},{passive:true});
new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(car.parentElement);
const rb=$("#rev");if(rb){if(rm)rb.hidden=true;else rb.addEventListener("click",()=>{if(!calm)rev=1})}
/* Tração dianteira: a roda da frente patina forte e solta fumaça; a traseira só gira de leve */
const stage=car.parentElement,sk=document.createElement("canvas"),sg=sk.getContext("2d"),PF=[],SC=.7;let lt2=0,sd=true,sH=0,sW=0,fx=0,fy=0,fs=1,fr=0,had=false;
sk.className="smk";sk.setAttribute("aria-hidden","true");stage.append(sk);
const spr=document.createElement("canvas");spr.width=spr.height=64;{const x=spr.getContext("2d"),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,"rgba(238,240,235,1)");g.addColorStop(.5,"rgba(205,209,203,.55)");g.addColorStop(1,"rgba(195,199,193,0)");x.fillStyle=g;x.fillRect(0,0,64,64)}
const sgeo=()=>{const r=sk.getBoundingClientRect(),f=whs[1].getBoundingClientRect();sW=Math.round(r.width*SC);sH=Math.round(r.height*SC);if(sk.width!==sW||sk.height!==sH){sk.width=sW;sk.height=sH}fx=f.left+f.width*.5-r.left;fy=f.bottom-r.top-f.width*.03;fs=f.width/160;sd=false};
new ResizeObserver(()=>sd=true).observe(stage);
const puff=p=>{PF.push({x:fx+(Math.random()-.5)*fs*16,y:fy,vx:-(1.4+Math.random()*2.6)*p*fs,vy:-(.3+Math.random()*1)*fs,r:(10+Math.random()*10)*fs,g:(.9+Math.random()*.8)*fs,l:1,d:.017+Math.random()*.012})};
const smk=dt=>{if(sd)sgeo();
 if(rev>.08&&PF.length<90)for(let i=0;i<(rev>.55?2:1);i++)puff(.6+rev);
 if(!PF.length){if(had){sg.setTransform(1,0,0,1,0,0);sg.clearRect(0,0,sW,sH);had=false}return}
 had=true;sg.setTransform(SC,0,0,SC,0,0);sg.clearRect(0,0,sW/SC,sH/SC);
 for(let i=PF.length-1;i>=0;i--){const p=PF[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.pow(.985,dt);p.vy-=.012*dt*fs;p.r+=p.g*dt*(.8+p.l)*.6;p.l-=p.d*dt;if(p.l<=0){PF.splice(i,1);continue}
  sg.globalAlpha=Math.min(1,p.l*1.3)*.5;sg.drawImage(spr,p.x-p.r,p.y-p.r,p.r*2,p.r*2)}sg.globalAlpha=1};
if(!rm)step=t=>{
if(!vis)return;
const dt=Math.min(3,lt2?(t-lt2)/16.7:1);lt2=t;
rev*=Math.pow(.984,dt);frontRot+=rev*.62*dt;rearRot+=rev*.14*dt;
stage.style.transform=rev>.06?"translate3d(0,"+((Math.random()-.5)*2.2*rev).toFixed(2)+"px,0)":"";
smk(dt);
if(t-idle<2500)aim();else{lx=.5+.5*Math.sin(t/2200);ly=.9}
if(innerWidth>700||t-lp>33){lp=t;paint(t);wpaint(t)}};
stop=()=>{rearRot=0;frontRot=0;rev=0;PF.length=0;stage.style.transform="";sg.setTransform(1,0,0,1,0,0);sg.clearRect(0,0,sk.width,sk.height);had=false;paint(0);wpaint(0)};
}
$$(".wc-card").forEach(c=>{const x=c.getContext("2d"),dr=(L,t)=>{const o=Wheel.draw({size:320,rot:.3,light:L,color:[.24+.76*(.5+.5*Math.sin(t/1400)),.82,.12]});if(o){x.clearRect(0,0,320,320);x.drawImage(o,0,0)}};
Wheel.on(()=>dr(null,0));const a=c.closest("a");if(a&&!rm)a.addEventListener("pointermove",e=>{if(calm)return;const r=c.getBoundingClientRect();dr([(e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height,.55],performance.now())},{passive:true})});
const gt=$(".gauge-tach");
if(gt&&window.Tach){const T=Tach.create(gt,{panel:"#e05a2b",light:"#ffffff",lit:1,rpm:calm?3200:900});let on=false,lg=0;new IntersectionObserver(e=>on=e[0].isIntersecting).observe(gt);
 const sm=u=>u*u*(3-2*u),rv=t=>{const c=(t/1000)%6.4;return c<3.2?900+5400*sm(c/3.2):c<4.4?6300-250*(.5+.5*Math.sin(c*42)):6050-5150*sm((c-4.4)/2)};
 const lp=t=>{if(on&&!document.hidden&&!calm&&t-lg>33){lg=t;T.set({rpm:rv(t)})}requestAnimationFrame(lp)};if(!rm)requestAnimationFrame(lp)}
const cb=$("#calm");
if(cb){if(rm)cb.hidden=true;const sy2=()=>{cb.setAttribute("aria-pressed",calm);cb.textContent=calm?"Animações pausadas":"Pausar animações"};sy2();
cb.addEventListener("click",()=>{calm=!calm;R.classList.toggle("calm",calm);try{localStorage.calm=calm?"1":"0"}catch(e){}sy2();if(calm){K.length=0;stop();parts(0)}})}
if(calm)parts(0);
const f=t=>{if(!calm){parts(t);step(t)}requestAnimationFrame(f)};requestAnimationFrame(f)
})();
