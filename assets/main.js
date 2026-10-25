(()=>{
const $=s=>document.querySelector(s),rm=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Barra de progresso de rolagem */
const pg=$("#prog");
addEventListener("scroll",()=>requestAnimationFrame(()=>{
pg.style.transform="scaleX("+scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)+")"}),{passive:true});

/* Largada: luzes, burnout e fumaça */
const cv=$("#cv"),c=cv.getContext("2d"),W=800,H=360,G=330,R=95,X=250;
const L=[...document.querySelectorAll(".lights li")],st=$("#st"),go=$("#go");
let ang=0,spd=0,tgt=0,off=0,ps=[],raf=0,busy=false;
function ring(rad,f){c.beginPath();for(let i=0;i<=90;i++){const a=i/90*6.2832,r=f(a);c[i?"lineTo":"moveTo"](X+r*Math.sin(a),Math.min(G-R+6-r*Math.cos(a),G-1))}}
function draw(pw){
c.clearRect(0,0,W,H);
c.fillStyle="#1c2230";c.fillRect(0,G,W,H-G);
c.strokeStyle="#ffc21a";c.lineWidth=4;c.setLineDash([46,40]);c.lineDashOffset=off;
c.beginPath();c.moveTo(0,G+22);c.lineTo(W,G+22);c.stroke();c.setLineDash([]);
ps.forEach(p=>{c.fillStyle="rgba(214,220,228,"+(p.l*.35).toFixed(2)+")";c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill()});
c.fillStyle="#0b0d11";ring(R,()=>R);c.fill();
c.strokeStyle="#5b6577";c.lineWidth=2;ring(0,a=>R*.78+pw*5*Math.sin(9*a+ang*.5));c.stroke();
c.save();c.translate(X,G-R+6);c.rotate(ang);c.strokeStyle="#c8d0da";c.lineWidth=9;c.lineCap="round";
for(let k=0;k<5;k++){c.rotate(1.2566);c.beginPath();c.moveTo(0,0);c.lineTo(0,-44);c.stroke()}
c.lineWidth=4;c.beginPath();c.arc(0,0,52,0,6.3);c.stroke();c.restore();
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
if(rm){L.forEach(l=>l.classList.add("on"));say("Verde! Largou. A fumaça não foi animada porque você prefere menos movimento.");draw(.6);setTimeout(done,2500);return}
say("Pré-estágio. Luzes acendendo.");
[0,1,2].forEach(i=>setTimeout(()=>L[i].classList.add("on"),500*(i+1)));
setTimeout(()=>{L[3].classList.add("on");say("Verde! Largou.");tgt=.5;raf||(raf=requestAnimationFrame(tick))},2200);
setTimeout(()=>{tgt=0;say("Fim do burnout.")},5200);
setTimeout(done,7200);
});
draw(0);

/* Garagem: pressão, torque, calor e cor do aro */
const q=i=>document.getElementById(i);
function lab(){
const p=+q("p").value,t=+q("t").value,h=+q("h").value/100,g=215,R=80;
const s=4+(36-p)*.75,cy=g-R+s,A=(t/100)*(.8+(36-p)/8),n=5+Math.round((36-p)/4);
let d="",w="";
for(let i=0;i<=96;i++){
const a=i/96*6.2832,m=i?"L":"M";
let y=cy-R*Math.cos(a);if(y>g)y=g;
d+=m+(200+R*Math.sin(a)).toFixed(1)+" "+y.toFixed(1);
const r=(R+44)/2+A*Math.sin(n*a);let y2=cy-r*Math.cos(a);if(y2>g-3)y2=g-3;
w+=m+(200+r*Math.sin(a)).toFixed(1)+" "+y2.toFixed(1);
}
q("tr").setAttribute("d",d+"Z");q("wr").setAttribute("d",w+"Z");
q("rg").setAttribute("transform","translate(200 "+cy.toFixed(1)+")");
const hw=Math.sqrt(Math.max(0,R*R-(R-s)**2));
q("pt").setAttribute("x1",200-hw);q("pt").setAttribute("x2",200+hw);
const col=h<.02?"hsl(210 8% 45%)":"hsl("+(8+42*h)+" 95% "+(28+48*h)+"%)",dk=q("dk").style;
dk.fill=col;dk.filter="drop-shadow(0 0 "+(h*12)+"px "+col+")";
q("pv").textContent=p+" psi";q("tv").textContent=t+"%";
q("hv").textContent="≈ "+Math.round(200+900*h)+" °C";
q("o0").textContent=p<11?"subinflado":p<22?"na faixa ideal":"sobreinflado";
q("o1").textContent="~"+Math.round(hw*8.2)+" mm";
q("o2").textContent=A<1?"quase nenhuma":A<3?"moderadas":"profundas";
}
["p","t","h"].forEach(i=>q(i).addEventListener("input",lab));
document.querySelectorAll("input[name=rc]").forEach(r=>r.addEventListener("change",()=>q("rg").style.setProperty("--rc",r.value)));
lab();
})();
