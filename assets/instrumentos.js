/* Demonstrações visuais de instrumentos e câmbio. Valores ilustrativos, não são os do jogo. */
(()=>{
const $=s=>document.querySelector(s),rm=matchMedia("(prefers-reduced-motion:reduce)").matches,calm=()=>document.documentElement.classList.contains("calm")||rm;
const visible=(el,set)=>new IntersectionObserver(e=>set(e[0].isIntersecting)).observe(el);
/* ---------- câmbio ---------- */
const gc=$("#gears");
if(gc&&window.Tach){
 /* relações do jogo (exatas) usadas nos números; as contagens de dentes são inteiras e as aproximam (≤3%) só para o desenho */
 const REAL=[3.455,1.944,1.286,.969,.8],REVR=3.166,FD=3.889,CIRC=2*Math.PI*.2888,LIM=6300;
 const TOT=45,D=109.5,M=2*D/TOT,rr=n=>n*M/2,PAIRS=[[10,35],[15,30],[20,25],[23,22],[25,20]],RV={nd:8,ni:6,nn:25},FDT=[9,35];
 const Y1=104,Y2=Y1+D,H=450,x=gc.getContext("2d"),fm=(v,d=3)=>v.toFixed(d).replace(".",",");
 let cx=104;const cols=PAIRS.map(([nd,nn],i)=>{const rd=rr(nd),rn=rr(nn),w=2*Math.max(rd,rn),c={nd,nn,rd,rn,x:cx+w/2,real:REAL[i]};cx+=w+16;return c});
 const rw=2*Math.max(rr(RV.nn),rr(RV.nd),rr(RV.ni)),R0={x:cx+rw/2};cx+=rw+16;
 const fw=2*rr(FDT[1]),F0={x:cx+fw/2};cx+=fw+16;const W=Math.ceil(cx+4);gc.style.aspectRatio=W+"/"+H;
 const tach=Tach.create($("#tach"),{panel:"#e05a2b",light:"#ffffff",lit:1,rpm:900});
 let gear=0,thr=0,rpm=900,th=0,vis=true,last=performance.now(),cut=0;
 const mesh=(tp,np,nn)=>-(np/nn)*(tp-Math.PI/2)+Math.PI/2+Math.PI+Math.PI/nn;
 const teeth=(cxx,cy,N,r,a,fill,edge,hel)=>{const st=6.2832/N,ro=r+M*.9,ri=r-M*1.1;x.beginPath();
  for(let k=0;k<N;k++){const b=a+k*st;[[ri,-.47],[ro,-.25],[ro,.25],[ri,.47]].forEach(([R,f],i)=>{const q=b+f*st;(k||i)?x.lineTo(cxx+Math.cos(q)*R,cy+Math.sin(q)*R):x.moveTo(cxx+Math.cos(q)*R,cy+Math.sin(q)*R)})}
  x.closePath();const g=x.createRadialGradient(cxx-r*.3,cy-r*.4,r*.1,cxx,cy,ro);g.addColorStop(0,fill[0]);g.addColorStop(1,fill[1]);x.fillStyle=g;x.fill();x.lineWidth=1.5;x.strokeStyle=edge;x.stroke();
  if(hel){x.strokeStyle="#00000055";x.lineWidth=1.2;x.beginPath();for(let k=0;k<N;k++){const b=a+k*st;x.moveTo(cxx+Math.cos(b-.3*st)*(ri+1),cy+Math.sin(b-.3*st)*(ri+1));x.lineTo(cxx+Math.cos(b+.3*st)*(ro-1),cy+Math.sin(b+.3*st)*(ro-1))}x.stroke()}
  if(r>38){const n=r>70?5:4;x.fillStyle="#070a08";for(let k=0;k<n;k++){const q=a+k*6.2832/n,rb=r*.55,hr=r*.17;x.beginPath();x.arc(cxx+Math.cos(q)*rb,cy+Math.sin(q)*rb,hr,0,6.2832);x.fill()}}
  x.fillStyle="#0b0f0c";x.beginPath();x.arc(cxx,cy,Math.min(13,r*.32),0,6.2832);x.fill();x.strokeStyle=edge;x.lineWidth=1.5;x.stroke()};
 const shaft=(y,x0,x1,ang,col)=>{x.fillStyle="#1b2220";x.fillRect(x0,y-9,x1-x0,18);x.strokeStyle=col;x.lineWidth=1.5;x.strokeRect(x0,y-9,x1-x0,18);
  x.save();x.beginPath();x.rect(x0,y-9,x1-x0,18);x.clip();x.strokeStyle="#ffffff22";x.lineWidth=2;for(let i=-3;i<((x1-x0)/22)+2;i++){const px=x0+i*22+((ang*22/1.2)%22);x.beginPath();x.moveTo(px,y-9);x.lineTo(px+8,y+9);x.stroke()}x.restore()};
 const ST=["#cfd6d0","#5c6761"],SN=["#aab3ad","#444d48"],ON=["#e4ff9a","#6aa11d"],AM=["#f1dfa2","#8a6d1d"];
 const lab=(t,xx,on)=>{x.fillStyle=on?"#b6ef3d":"#8d9a90";x.font="700 15px Inter,Arial,sans-serif";x.textAlign="center";x.fillText(t,xx,H-10)};
 const render=()=>{x.setTransform(gc.width/W,0,0,gc.height/H,0,0);x.clearRect(0,0,W,H);
  const fwd=gear>0?cols[gear-1]:null,rev=gear<0,sel=fwd||rev,tr=fwd?fwd.nd/fwd.nn:rev?RV.nd/RV.nn:0;
  const thOut=fwd?-th*tr:rev?th*tr:0,pr=mesh(thOut,FDT[0],FDT[1]);
  shaft(Y1,8,R0.x+rr(RV.nn)+6,th,"#4b5d4f");shaft(Y2,8,F0.x+4,thOut,sel?"#b6ef3d":"#4b5d4f");
  cols.forEach((c,i)=>{const on=gear===i+1,ed=on?"#d9ff6d":"#242b27",t2=mesh(th,c.nd,c.nn);
   teeth(c.x,Y2,c.nn,c.rn,t2,on?ON:SN,ed,true);teeth(c.x,Y1,c.nd,c.rd,th,on?ON:ST,ed,true);lab((i+1)+"ª · "+fm(c.real),c.x,on)});
  /* ré: gear de entrada, intermediária e de saída, todas de dentes retos */
  {const on=rev,ed=on?"#d9ff6d":"#242b27",yi=Y1+rr(RV.nd)+rr(RV.ni),ti=mesh(th,RV.nd,RV.ni),to=mesh(ti,RV.ni,RV.nn);
   teeth(R0.x,Y2,RV.nn,rr(RV.nn),to,on?ON:SN,ed,false);teeth(R0.x,yi,RV.ni,rr(RV.ni),ti,on?ON:SN,ed,false);teeth(R0.x,Y1,RV.nd,rr(RV.nd),th,on?ON:ST,ed,false);lab("R · "+fm(REVR),R0.x,on)}
  /* diferencial: pinhão no eixo de saída e coroa, ambos helicoidais */
  {const rp=rr(FDT[0]),rc=rr(FDT[1]),yc=Y2+rp+rc;teeth(F0.x,yc,FDT[1],rc,mesh(thOut,FDT[0],FDT[1]),AM,"#ffd21a",true);teeth(F0.x,Y2,FDT[0],rp,thOut,AM,"#ffd21a",true);
   x.fillStyle="#ffd21a";x.font="700 15px Inter,Arial,sans-serif";x.textAlign="center";x.fillText("Final · "+fm(FD),F0.x,H-10)}
  if(fwd){const e=fwd.x+fwd.rn;x.fillStyle="#ffd21a";x.fillRect(e+(e<W-30?2:-8),Y2-16,10,32);x.font="700 12px Inter,Arial,sans-serif";x.textAlign="center";x.fillText("luva",e+7,Y2-22)}
  x.fillStyle="#9fb094";x.font="700 12px Inter,Arial,sans-serif";x.textAlign="left";x.fillText("MOTOR",14,Y1-2);x.fillText("▸ entrada",14,Y1+13);x.fillText("RODAS",14,Y2-2);x.fillText("saída ▸",14,Y2+13)};
 const rs=()=>{const w=gc.clientWidth,k=Math.min(devicePixelRatio||1,2);gc.width=Math.round(w*k);gc.height=Math.round(w*H/W*k)};rs();new ResizeObserver(rs).observe(gc);visible(gc,v=>vis=v);
 const ro=$("#rpmv"),go=$("#gv"),rv=$("#rv"),ov=$("#ov");
 const ratio=()=>gear>0?REAL[gear-1]:gear<0?REVR:0;
 const tick=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;
  if(vis&&!document.hidden){const target=900+thr*(LIM+300)*(gear?1:1.05)-thr*300;rpm+=(target-rpm)*Math.min(1,dt*(gear?1.7:3.2));
   if(rpm>=LIM){rpm=LIM-240;cut=.2}cut=Math.max(0,cut-dt);
   if(!calm())th+=dt*(rpm/6000)*3.2;
   tach.set({rpm});render();
   ro.textContent=Math.round(rpm/10)*10;go.textContent=gear>0?gear+"ª marcha":gear<0?"Ré":"Ponto morto";
   const g=ratio();rv.textContent=g?fm(g)+" : 1":"—";
   /* velocidade teórica das rodas: rpm ÷ (câmbio × final) × circunferência (raio 0,2888 m), sem patinagem */
   const kmh=g?rpm/(g*FD)*CIRC*60/1000*(gear<0?-1:1):0;ov.textContent=(kmh<0?"−":"")+Math.round(Math.abs(kmh))+" km/h";
   $("#tot").textContent=g?"total "+fm(g*FD,2)+" : 1":"câmbio × final "+fm(FD)}
  requestAnimationFrame(tick)};requestAnimationFrame(tick);
 const bs=[...document.querySelectorAll("[data-gear]")],pick=g=>{const b=bs.find(o=>+o.dataset.gear===g);if(!b)return;gear=g;bs.forEach(o=>o.setAttribute("aria-pressed",o===b))};
 bs.forEach(b=>b.addEventListener("click",()=>pick(+b.dataset.gear)));
 const sl=$("#thr");sl.addEventListener("input",()=>{thr=sl.value/100;$("#thrv").textContent=sl.value+"%"});
 addEventListener("keydown",e=>{if(e.target.tagName==="INPUT")return;if(/^[1-5]$/.test(e.key))pick(+e.key);else if(e.key==="0"||/^n$/i.test(e.key))pick(0);else if(/^r$/i.test(e.key))pick(-1)});
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
  if(sweep&&!calm()){rp=3300+2900*Math.sin(t0*.9);r.value=rp}tc.set({lit,rpm:rp})}requestAnimationFrame(f)};requestAnimationFrame(f);
}
})();
