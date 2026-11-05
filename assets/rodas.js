(()=>{
const $=s=>document.querySelector(s),rm=matchMedia("(prefers-reduced-motion: reduce)").matches,R0=document.documentElement;
const calmOn=()=>rm||R0.classList.contains("calm");

/* A roda vem do atlas único (assets/wheel.js): pneu, aro, disco e pinça já fundidos, com mapa de normais */
/* Largada: luzes, burnout e fumaça */
const cv=$("#cv"),c=cv.getContext("2d"),W=800,H=360,G=330,R=128,X=300,D=2;
const L=[...document.querySelectorAll(".lights li")],st=$("#st"),go=$("#go");
let ang=0,spd=0,tgt=0,off=0,ps=[],raf=0,busy=false,pwNow=0;
Wheel.on(()=>draw(pwNow));
function ring(rad,f){c.beginPath();for(let i=0;i<=90;i++){const a=i/90*6.2832,r=f(a);c[i?"lineTo":"moveTo"](X+r*Math.sin(a),Math.min(G-R+6-r*Math.cos(a),G-1))}}
function draw(pw){
pwNow=pw;c.setTransform(D,0,0,D,0,0);
c.clearRect(0,0,W,H);
let sk=c.createLinearGradient(0,0,0,G);sk.addColorStop(0,"#0b0f16");sk.addColorStop(1,"#1b2c1f");c.fillStyle=sk;c.fillRect(0,0,W,G);
c.fillStyle="rgba(169,229,64,.55)";c.fillRect(0,G-2,W,2);
let as=c.createLinearGradient(0,G,0,H);as.addColorStop(0,"#262d28");as.addColorStop(1,"#141a16");c.fillStyle=as;c.fillRect(0,G,W,H-G);
c.strokeStyle="#ffc21a";c.lineWidth=4;c.setLineDash([46,40]);c.lineDashOffset=off;
c.beginPath();c.moveTo(0,G+22);c.lineTo(W,G+22);c.stroke();c.setLineDash([]);
ps.forEach(p=>{c.fillStyle="rgba(214,220,228,"+(p.l*.35).toFixed(2)+")";c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill()});
if(!Wheel.ready())return;
const cy=G-R+6,k=Math.round(2*R*D),o=Wheel.draw({size:k,rot:ang,light:[.2,.9,.55],color:[.9,.95,.85]});
c.save();c.beginPath();c.rect(0,0,W,G-1);c.clip();
if(o)c.drawImage(o,X-R,cy-R,2*R,2*R);
/* ondas na lateral do pneu: crescem com o torque */
c.strokeStyle="rgba(255,255,255,.3)";c.lineWidth=1.6;ring(0,a=>R*.84+pw*4*Math.sin(9*a+ang*.5));c.stroke();
c.restore();
}
function tick(){
spd+=(tgt-spd)*.05;const pw=spd/.5;ang+=spd;off-=pw*16;
if(spd>.05)for(let i=0;i<3;i++)ps.push({x:X-20,y:G-8,vx:-(2+Math.random()*4)*(1+pw),vy:-Math.random()*1.4,r:10+Math.random()*10,l:1});
ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=.7;p.l-=.012});ps=ps.filter(p=>p.l>0);
draw(pw);raf=spd>.004||tgt||ps.length?requestAnimationFrame(tick):0;
}
const say=t=>st.textContent=t;
function done(){busy=false;go.removeAttribute("aria-disabled");L.forEach(l=>l.classList.remove("on"));say("Pronto para largar de novo.")}
go.addEventListener("click",()=>{
if(busy)return;busy=true;go.setAttribute("aria-disabled","true");L.forEach(l=>l.classList.remove("on"));
if(calmOn()){L.forEach(l=>l.classList.add("on"));say("Verde! Largou. A fumaça não foi animada porque você prefere menos movimento.");draw(.6);setTimeout(done,2500);return}
say("Pré-estágio. Luzes acendendo.");
[0,1,2].forEach(i=>setTimeout(()=>L[i].classList.add("on"),500*(i+1)));
setTimeout(()=>{L[3].classList.add("on");say("Verde! Largou.");tgt=.5;raf||(raf=requestAnimationFrame(tick))},2200);
setTimeout(()=>{tgt=0;say("Fim do burnout.")},5200);
setTimeout(done,7200);
});
draw(0);

/* Garagem: pressão, torque, calor e cor do aro, desenhados com as camadas do jogo */
const q=i=>document.getElementById(i),gc=q("gc"),g=gc.getContext("2d"),GW=400,GH=260,GD=2,GR=100,GX=200,GG=244,S=600,KS=GR/80;   /* KS: o modelo foi escrito para um pneu de raio 80 */
let spin=0,vis=false,gRaf=0,last=0;
Wheel.on(()=>lab());
function lab(){
if(!Wheel.ready())return;
const p=+q("p").value,t=+q("t").value,h=+q("h").value/100;
const s=4+(36-p)*.75,cy=GG-GR+s*KS,A=(t/100)*(.8+(36-p)/8)*KS,n=5+Math.round((36-p)/4);
const hw=Math.sqrt(Math.max(0,80*80-(80-s)**2));
const hk=Math.round(h*20),hh=hk/20,col=hh<.02?"hsl(210 8% 45%)":"hsl("+(8+42*hh)+" 95% "+(28+48*hh)+"%)";
const rc=document.querySelector("input[name=rc]:checked").value;
const hex=rc.replace("#","").match(/../g).map(v=>parseInt(v,16)/255);
const kk=1-.5*Math.max(0,(hh-.55)/.45),Z=1.3,ry=Math.min(cy,GG-GR*.7125-3);   /* o aro não afunda junto: a lateral do pneu comprime */
const hc=[1,.35+.5*hh,.08+.3*hh];
const o=Wheel.draw({size:Math.round(2*GR*Z*GD),zoom:Z,rot:spin,tire:{rot:spin,dy:(cy-ry)/(2*GR)},rim:{dy:0},tint:hex,heat:hh<.02?0:Math.min(.95,.3+.65*hh),heatColor:hc,dim:1-kk,light:[.15,.95,.55],color:[.95,.97,1]});
g.setTransform(GD,0,0,GD,0,0);g.clearRect(0,0,GW,GH);
g.strokeStyle="#aab3a8";g.lineWidth=2;g.beginPath();g.moveTo(10,GG);g.lineTo(390,GG);g.stroke();
g.save();g.beginPath();g.rect(0,0,GW,GG);g.clip();
if(hh>.02){g.shadowColor=col;g.shadowBlur=hh*14*GD}
if(o)g.drawImage(o,GX-GR*Z,ry-GR*Z,2*GR*Z,2*GR*Z);g.shadowBlur=0;g.shadowColor="transparent";
/* ondas na lateral do pneu */
g.strokeStyle="rgba(255,255,255,.28)";g.lineWidth=1.6;g.beginPath();
for(let i=0;i<=96;i++){const a=i/96*6.2832,r=GR*.79+A*.5*Math.sin(n*a+spin*.5);let y=cy-r*Math.cos(a);if(y>GG-3)y=GG-3;g[i?"lineTo":"moveTo"](GX+r*Math.sin(a),y)}g.stroke();
g.restore();
/* área de contato */
g.strokeStyle="#e0401c";g.lineWidth=5;g.lineCap="round";g.beginPath();g.moveTo(GX-hw*KS,GG+3);g.lineTo(GX+hw*KS,GG+3);g.stroke();
q("pv").textContent=p+" psi";q("tv").textContent=t+"%";
q("hv").textContent="≈ "+Math.round(200+900*h)+" °C";
q("o0").textContent=p<11?"subinflado":p<22?"na faixa ideal":"sobreinflado";
q("o1").textContent="~"+Math.round(hw*4.8)+" mm";
q("o2").textContent=A<1?"quase nenhuma":A<3?"moderadas":"profundas";
}
/* com torque e sem pedido de menos movimento, a roda gira devagar enquanto a garagem está na tela */
function loop(now){
gRaf=0;if(!vis||calmOn()||document.hidden)return;
const t=+q("t").value;if(t>0){spin+=(now-last)/1000*(t/100)*5;lab()}last=now;gRaf=requestAnimationFrame(loop)}
const kick=()=>{if(!gRaf&&vis&&!calmOn()){last=performance.now();gRaf=requestAnimationFrame(loop)}};
new IntersectionObserver(e=>{vis=e[0].isIntersecting;kick()}).observe(gc);
document.addEventListener("visibilitychange",kick);
["p","t","h"].forEach(i=>q(i).addEventListener("input",()=>{lab();kick()}));
document.querySelectorAll("input[name=rc]").forEach(r=>r.addEventListener("change",lab));
q("calm")&&q("calm").addEventListener("click",()=>setTimeout(()=>{lab();kick()},0));

/* Detalhes: aro trocando de cor e disco esquentando, com a mesma roda (recorte por zoom) */
const CORES=[["Polido","#e8ecf1"],["Amarelo","#ffc21a"],["Vermelho","#e5484d"],["Azul","#3b82f6"],["Verde-água","#2dd4bf"]];
const hx=h=>h.replace("#","").match(/../g).map(v=>parseInt(v,16)/255);
const close=[{id:"ca",zoom:.62,pan:[-.1,.1],f:(t,o)=>{const i=Math.floor(t/2200)%CORES.length;o.tint=hx(CORES[i][1]);q("can").textContent=CORES[i][0]}},
{id:"cf",zoom:.6,pan:[.16,.1],f:(t,o)=>{const h=.5-.5*Math.cos(t/2600);o.heat=h<.03?0:Math.min(.95,.3+.65*h);o.heatColor=[1,.35+.5*h,.08+.3*h];o.dim=Math.max(0,(h-.55)/.45)*.5;q("cfn").textContent="≈ "+Math.round(200+900*h)+" °C"}}];
close.forEach(k=>{const c=q(k.id),x=c.getContext("2d");let on=false;new IntersectionObserver(e=>on=e[0].isIntersecting).observe(c);
const fr=t=>{if(on&&!document.hidden&&Wheel.ready()){const o={size:560,zoom:k.zoom,pan:k.pan,rot:calmOn()?0:t/9000,light:[.2,.85,.55],color:[.95,.97,1]};k.f(calmOn()?0:t,o);const g2=Wheel.draw(o);if(g2){x.clearRect(0,0,560,560);x.drawImage(g2,0,0)}}requestAnimationFrame(fr)};requestAnimationFrame(fr)});
})();
