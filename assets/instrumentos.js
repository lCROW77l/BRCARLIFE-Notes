/* Demonstrações visuais de instrumentos e câmbio. Valores ilustrativos, não são os do jogo. */
(()=>{
const $=s=>document.querySelector(s),rm=matchMedia("(prefers-reduced-motion:reduce)").matches,calm=()=>document.documentElement.classList.contains("calm")||rm;
const visible=(el,set)=>new IntersectionObserver(e=>set(e[0].isIntersecting)).observe(el);
/* ---------- câmbio ---------- */
const gc=$("#gears");
if(gc&&window.Tach){
 const M=3.65,TOT=30,PAIRS=[[7,23],[10,20],[12,18],[15,15],[17,13]],W=860,H=330,Y1=104,D=TOT*M,Y2=Y1+D,x=gc.getContext("2d");
 const tach=Tach.create($("#tach"),{panel:"#e05a2b",light:"#ffffff",lit:1,rpm:900});
 let gear=0,thr=0,rpm=900,th=0,vis=true,last=performance.now(),cut=0;
 let cx=104;const cols=PAIRS.map(([nd,nn])=>{const rd=nd*M,rn=nn*M,w=2*Math.max(rd,rn),c={nd,nn,rd,rn,x:cx+w/2};cx+=w+14;return c});
  const teeth=(cxx,cy,N,r,a,fill,edge)=>{const st=6.2832/N,ro=r+M*.9,ri=r-M*1.1;x.beginPath();
  for(let k=0;k<N;k++){const b=a+k*st;[[ri,-.47],[ro,-.25],[ro,.25],[ri,.47]].forEach(([R,f],i)=>{const q=b+f*st;(k||i)?x.lineTo(cxx+Math.cos(q)*R,cy+Math.sin(q)*R):x.moveTo(cxx+Math.cos(q)*R,cy+Math.sin(q)*R)})}
  x.closePath();const g=x.createRadialGradient(cxx-r*.3,cy-r*.4,r*.1,cxx,cy,ro);g.addColorStop(0,fill[0]);g.addColorStop(1,fill[1]);x.fillStyle=g;x.fill();x.lineWidth=1.5;x.strokeStyle=edge;x.stroke();
  /* furos de alívio e cubo */
  if(r>40){const n=r>70?5:4;x.fillStyle="#070a08";for(let k=0;k<n;k++){const q=a+k*6.2832/n,rr=r*.55,hr=r*.17;x.beginPath();x.arc(cxx+Math.cos(q)*rr,cy+Math.sin(q)*rr,hr,0,6.2832);x.fill()}}
  x.fillStyle="#0b0f0c";x.beginPath();x.arc(cxx,cy,Math.min(14,r*.32),0,6.2832);x.fill();x.strokeStyle=edge;x.stroke()};
 const shaft=(y,ang,col)=>{x.fillStyle="#1b2220";x.fillRect(8,y-9,W-16,18);x.strokeStyle=col;x.lineWidth=1.5;x.strokeRect(8,y-9,W-16,18);
  x.save();x.beginPath();x.rect(8,y-9,W-16,18);x.clip();x.strokeStyle="#ffffff22";x.lineWidth=2;for(let i=-3;i<(W/22);i++){const px=8+i*22+((ang*22/1.2)%22);x.beginPath();x.moveTo(px,y-9);x.lineTo(px+8,y+9);x.stroke()}x.restore()};
 const render=()=>{x.setTransform(gc.width/W,0,0,gc.height/H,0,0);x.clearRect(0,0,W,H);
  const sel=gear?cols[gear-1]:null,ratio=sel?sel.nd/sel.nn:0,thOut=sel?-th*ratio:0;
  shaft(Y1,th,"#4b5d4f");shaft(Y2,thOut,sel?"#b6ef3d":"#4b5d4f");
  cols.forEach((c,i)=>{const on=gear===i+1,fd=on?["#e4ff9a","#6aa11d"]:["#cfd6d0","#5c6761"],fn=on?["#e4ff9a","#6aa11d"]:["#aab3ad","#444d48"],ed=on?"#d9ff6d":"#242b27";
   const th2=-(c.nd/c.nn)*(th-Math.PI/2)+Math.PI/2+Math.PI+Math.PI/c.nn;
   teeth(c.x,Y2,c.nn,c.rn,th2,fn,ed);teeth(c.x,Y1,c.nd,c.rd,th,fd,ed);
   x.fillStyle=on?"#b6ef3d":"#8d9a90";x.font="700 15px Inter,Arial,sans-serif";x.textAlign="center";x.fillText((i+1)+"ª  ·  "+(c.nn/c.nd).toFixed(2).replace(".",",")+":1",c.x,H-8)});
  if(sel){x.fillStyle="#ffd21a";x.fillRect(sel.x+sel.rn+(sel.x+sel.rn<W-30?2:-8),Y2-16,10,32);x.fillStyle="#ffd21a";x.font="700 12px Inter,Arial,sans-serif";x.fillText("luva",sel.x+sel.rn+7,Y2-22)}
  x.fillStyle="#9fb094";x.font="700 12px Inter,Arial,sans-serif";x.textAlign="left";x.fillText("MOTOR",14,Y1-2);x.fillText("▸ entrada",14,Y1+13);x.fillText("RODAS",14,Y2-2);x.fillText("saída ▸",14,Y2+13)};
 const rs=()=>{const w=gc.clientWidth,k=Math.min(devicePixelRatio||1,2);gc.width=Math.round(w*k);gc.height=Math.round(w*H/W*k)};rs();new ResizeObserver(rs).observe(gc);visible(gc,v=>vis=v);
 const ro=$("#rpmv"),go=$("#gv"),rv=$("#rv"),ov=$("#ov");
 const tick=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;
  if(vis&&!document.hidden){const target=900+thr*6300*(gear?1:1.05);rpm+=(target-rpm)*Math.min(1,dt*(gear?1.7:3.2));
   if(rpm>6950){rpm=6350;cut=.25}cut=Math.max(0,cut-dt);
   if(!calm())th+=dt*(rpm/6000)*3.2;
   tach.set({rpm:rpm+(cut?0:0)});render();
   ro.textContent=Math.round(rpm/10)*10;go.textContent=gear?gear+"ª marcha":"Ponto morto";rv.textContent=gear?(cols[gear-1].nn/cols[gear-1].nd).toFixed(2).replace(".",",")+" : 1":"—";
   ov.textContent=gear?Math.round(rpm*cols[gear-1].nd/cols[gear-1].nn)+" rpm":"0 rpm"}
  requestAnimationFrame(tick)};requestAnimationFrame(tick);
 const bs=[...document.querySelectorAll("[data-gear]")];bs.forEach(b=>b.addEventListener("click",()=>{gear=+b.dataset.gear;bs.forEach(o=>o.setAttribute("aria-pressed",o===b))}));
 const sl=$("#thr");sl.addEventListener("input",()=>{thr=sl.value/100;$("#thrv").textContent=sl.value+"%"});
 addEventListener("keydown",e=>{if(e.target.tagName==="INPUT")return;const n={"0":0,"n":0,"N":0}[e.key];const g=/^[1-5]$/.test(e.key)?+e.key:n;if(g!==undefined){bs[g].click()}});
}
/* ---------- cabine: painel e luz personalizáveis ---------- */
const pc=$("#tachc");
if(pc&&window.Tach){
 const tc=Tach.create(pc,{panel:"#e05a2b",light:"#ffffff",lit:1,rpm:3200});let lit=1,litT=1,rp=3200,sweep=true,vis=true,last=performance.now(),t0=0;visible(pc,v=>vis=v);
 const sw=(id,cb)=>{const box=$(id);box.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;box.querySelectorAll("button").forEach(o=>o.setAttribute("aria-pressed",o===b));cb(b.dataset.c,b.title)})};
 const nm=$("#pn"),ln=$("#ln");
 sw("#sw-panel",(c,n)=>{tc.set({panel:c});nm.textContent=n});sw("#sw-light",(c,n)=>{tc.set({light:c});ln.textContent=n});
 $("#luz").addEventListener("click",e=>{const on=e.currentTarget.getAttribute("aria-pressed")!=="true";e.currentTarget.setAttribute("aria-pressed",on);e.currentTarget.textContent=on?"Luz acesa":"Luz apagada";litT=on?1:0});
 const r=$("#rp");r.addEventListener("input",()=>{sweep=false;rp=+r.value;$("#sweep").setAttribute("aria-pressed","false");tc.set({rpm:rp})});
 $("#sweep").addEventListener("click",e=>{sweep=e.currentTarget.getAttribute("aria-pressed")!=="true";e.currentTarget.setAttribute("aria-pressed",sweep)});
 const f=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;t0+=dt;if(vis&&!document.hidden){if(Math.abs(lit-litT)>.004)lit+=(litT-lit)*Math.min(1,dt*7);else lit=litT;
  if(sweep&&!calm()){rp=3600+3300*Math.sin(t0*.9)*Math.sin(t0*.37+1);r.value=rp}tc.set({lit,rpm:rp})}requestAnimationFrame(f)};requestAnimationFrame(f);
}
})();
