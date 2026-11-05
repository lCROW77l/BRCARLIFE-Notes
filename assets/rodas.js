(()=>{
const $=s=>document.querySelector(s),rm=matchMedia("(prefers-reduced-motion: reduce)").matches,R0=document.documentElement;
const calmOn=()=>rm||R0.classList.contains("calm");

/* Sprites do jogo (WheelKit): A = pneu, barril e disco (giram), B = pinça (fixa), C = aro e cubo (giram) */
const loadImg=(src,cb)=>{const i=new Image();i.onload=cb;i.src="assets/img/"+src;return i};

/* Largada: luzes, burnout e fumaça */
const cv=$("#cv"),c=cv.getContext("2d"),W=800,H=360,G=330,R=95,X=250,D=2;
const L=[...document.querySelectorAll(".lights li")],st=$("#st"),go=$("#go");
let ang=0,spd=0,tgt=0,off=0,ps=[],raf=0,busy=false,pwNow=0;
const WA=loadImg("roda-a.webp",()=>draw(pwNow)),WB=loadImg("roda-b.webp",()=>draw(pwNow)),WC=loadImg("roda-c.webp",()=>draw(pwNow));
function ring(rad,f){c.beginPath();for(let i=0;i<=90;i++){const a=i/90*6.2832,r=f(a);c[i?"lineTo":"moveTo"](X+r*Math.sin(a),Math.min(G-R+6-r*Math.cos(a),G-1))}}
function draw(pw){
pwNow=pw;c.setTransform(D,0,0,D,0,0);
c.clearRect(0,0,W,H);
c.fillStyle="#1c2230";c.fillRect(0,G,W,H-G);
c.strokeStyle="#ffc21a";c.lineWidth=4;c.setLineDash([46,40]);c.lineDashOffset=off;
c.beginPath();c.moveTo(0,G+22);c.lineTo(W,G+22);c.stroke();c.setLineDash([]);
ps.forEach(p=>{c.fillStyle="rgba(214,220,228,"+(p.l*.35).toFixed(2)+")";c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill()});
if(!(WA.complete&&WB.complete&&WC.complete&&WA.naturalWidth))return;
const cy=G-R+6;
c.save();c.beginPath();c.rect(0,0,W,G-1);c.clip();
c.save();c.translate(X,cy);c.rotate(ang);c.drawImage(WA,-R,-R,2*R,2*R);c.restore();
/* ondas na lateral do pneu: crescem com o torque */
c.strokeStyle="rgba(255,255,255,.3)";c.lineWidth=1.6;ring(0,a=>R*.84+pw*4*Math.sin(9*a+ang*.5));c.stroke();
c.drawImage(WB,X-R,cy-R,2*R,2*R);
c.save();c.translate(X,cy);c.rotate(ang);c.drawImage(WC,-R,-R,2*R,2*R);c.restore();
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
const NAMES=["pneu","base","disco","pinca","face","lip","parafusos"],IM={};let nload=0,spin=0,vis=false,gRaf=0,last=0;
NAMES.forEach(n=>IM[n]=loadImg("garagem/"+n+".webp",()=>{if(++nload==NAMES.length)lab()}));
/* camadas tingidas ficam em cache e só são refeitas quando a cor ou o calor mudam */
const cache={};
function tinted(key,img,fn){if(cache[key])return cache[key];const o=document.createElement("canvas");o.width=o.height=S;const x=o.getContext("2d");x.drawImage(img,0,0);fn(x);x.globalCompositeOperation="destination-in";x.drawImage(img,0,0);return cache[key]=o}
const mul=(x,col)=>{x.globalCompositeOperation="multiply";x.fillStyle=col;x.fillRect(0,0,S,S)};
function lab(){
if(nload<NAMES.length)return;
const p=+q("p").value,t=+q("t").value,h=+q("h").value/100;
const s=4+(36-p)*.75,cy=GG-GR+s*KS,A=(t/100)*(.8+(36-p)/8)*KS,n=5+Math.round((36-p)/4);
const hw=Math.sqrt(Math.max(0,80*80-(80-s)**2));
const hk=Math.round(h*20),hh=hk/20,col=hh<.02?"hsl(210 8% 45%)":"hsl("+(8+42*hh)+" 95% "+(28+48*hh)+"%)";
const rc=document.querySelector("input[name=rc]:checked").value;
const face=tinted("f"+rc,IM.face,x=>mul(x,rc));
const disc=tinted("d"+hk,IM.disco,x=>{mul(x,"#d8d3c6");if(hh>.02){x.globalCompositeOperation="source-atop";x.globalAlpha=Math.min(.9,.3+.65*hh);x.fillStyle=col;x.fillRect(0,0,S,S);x.globalAlpha=1}});
const kk=1-.5*Math.max(0,(hh-.55)/.45),cal=tinted("c"+Math.round(kk*20),IM.pinca,x=>mul(x,"rgb("+Math.round(255*kk)+","+Math.round(255*kk)+","+Math.round(255*kk)+")"));
g.setTransform(GD,0,0,GD,0,0);g.clearRect(0,0,GW,GH);
g.strokeStyle="#aab3a8";g.lineWidth=2;g.beginPath();g.moveTo(10,GG);g.lineTo(390,GG);g.stroke();
const put=(img,y,rot,sz)=>{g.save();g.translate(GX,y);if(rot)g.rotate(rot);g.drawImage(img,-GR,-GR,2*GR,2*GR);g.restore()};
const ry=Math.min(cy,GG-GR*.7125-3);   /* o aro não afunda junto: a lateral do pneu comprime */
/* pneu: o apoio no chão fica reto (recorte no plano do chão) */
g.save();g.beginPath();g.rect(0,0,GW,GG);g.clip();put(IM.pneu,cy,spin);
g.strokeStyle="rgba(255,255,255,.28)";g.lineWidth=1.6;g.beginPath();
for(let i=0;i<=96;i++){const a=i/96*6.2832,r=GR*.79+A*.5*Math.sin(n*a+spin*.5);let y=cy-r*Math.cos(a);if(y>GG-3)y=GG-3;g[i?"lineTo":"moveTo"](GX+r*Math.sin(a),y)}g.stroke();
g.restore();
put(IM.base,ry,0);
if(hh>.02){g.shadowColor=col;g.shadowBlur=hh*16*GD}
put(disc,ry,spin);g.shadowBlur=0;g.shadowColor="transparent";
put(cal,ry,0);put(face,ry,spin);put(IM.lip,ry,spin);put(IM.parafusos,ry,spin);
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
})();
