/* Conta-giros: atlas único (assets/img/painel.webp) com máscaras em canais. As cores do painel e da luz são aplicadas aqui,
   como no jogo: luz = painel × luz, levemente clareada (painel vermelho + luz branca = avermelhado). */
(()=>{
const AW=576,AH=564,NW=51,NH=318,CX=288.3,CY=291.6,PX=24.4,PY=292,LW=580,LH=584;
let atlas=null,cbs=[],ready=false;
const im=new Image();im.onload=()=>{
 const c=document.createElement("canvas");c.width=im.width;c.height=im.height;const x=c.getContext("2d",{willReadFrequently:true});x.drawImage(im,0,0);
 const d=x.getImageData(0,0,im.width,im.height).data,mk=(w,h,ox,fn)=>{const o=document.createElement("canvas");o.width=w;o.height=h;const ox2=o.getContext("2d"),id=ox2.createImageData(w,h);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const s=((j)*im.width+i+ox)*4,t=(j*w+i)*4,v=fn(d,s);id.data[t]=v[0];id.data[t+1]=v[1];id.data[t+2]=v[2];id.data[t+3]=v[3]}ox2.putImageData(id,0,0);return o};
 const W=(a)=>[255,255,255,a];
 atlas={dial:mk(AW,AH,0,(d,s)=>W(d[s])),glow:mk(AW,AH,0,(d,s)=>W(d[s+1])),
  nCol:mk(NW,NH,AW,(d,s)=>[d[s],d[s+1],d[s+2],255]),nA:mk(NW,NH,AW+NW,(d,s)=>W(d[s])),nL:mk(NW,NH,AW+NW,(d,s)=>W(d[s+1])),nS:mk(NW,NH,AW+NW,(d,s)=>[0,0,0,d[s+2]])};
 /* a cor do ponteiro precisa do alfa do próprio ponteiro */
 const n=atlas.nCol.getContext("2d");n.globalCompositeOperation="destination-in";n.drawImage(atlas.nA,0,0);
 ready=true;cbs.splice(0).forEach(f=>f())};im.src="assets/img/painel.webp";
const hex=h=>{h=h.replace("#","");return[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255)};
const litOf=(p,l)=>p.map((v,i)=>{const m=v*l[i];return 1-(1-m)*(1-.28*l[i])});
const css=(c,a=1)=>`rgba(${c.map(v=>Math.round(v*255)).join(",")},${a})`;
const tint=(src,col)=>{const o=document.createElement("canvas");o.width=src.width;o.height=src.height;const x=o.getContext("2d");x.drawImage(src,0,0);x.globalCompositeOperation="source-in";x.fillStyle=css(col);x.fillRect(0,0,o.width,o.height);return o};
const deg=r=>{const k=r/1000;return k<1?184.5-21*k:163.5-27.65*(k-1)};
window.Tach={ready:f=>ready?f():cbs.push(f),
create(cv,o={}){
 const s={panel:"#e05a2b",light:"#ffffff",lit:0,rpm:900,...o},x=cv.getContext("2d"),cache={};
 const get=(k,src,col)=>{const key=k+col.map(v=>v.toFixed(2));return cache[key]||(cache[key]=(Object.keys(cache).length>24&&(Object.keys(cache).forEach(q=>delete cache[q])),tint(src,col)))};
 const api={s,set(p){Object.assign(s,p);api.draw()},draw(){
  if(!ready)return;const k=Math.min(devicePixelRatio||1,2),w=cv.clientWidth||320,W=Math.round(w*k),H=Math.round(w*LH/LW*k);if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  x.setTransform(W/LW,0,0,H/LH,0,0);x.clearRect(0,0,LW,LH);
  const P=hex(s.panel),L=hex(s.light),lc=litOf(P,L),u=s.lit,mixc=P.map((v,i)=>v*(1-u)+lc[i]*u),ox=2;
  /* face */
  x.save();x.beginPath();x.arc(CX+ox,CY,288,0,6.2832);x.clip();
  let g=x.createRadialGradient(CX+ox-60,CY-90,20,CX+ox,CY,290);g.addColorStop(0,"#23292c");g.addColorStop(.7,"#0c0f10");g.addColorStop(1,"#040505");x.fillStyle=g;x.fillRect(0,0,LW,LH);
  /* leve brilho da luz sobre a face */
  if(u>0){g=x.createRadialGradient(CX+ox,CY,10,CX+ox,CY,280);g.addColorStop(0,css(lc,.16*u));g.addColorStop(1,css(lc,0));x.fillStyle=g;x.fillRect(0,0,LW,LH)}
  x.drawImage(get("d",atlas.dial,mixc),ox,0);
  if(u>0){x.globalCompositeOperation="lighter";x.globalAlpha=.75*u;x.drawImage(get("g",atlas.glow,lc),ox,0);x.globalAlpha=1;x.globalCompositeOperation="source-over"}
  /* ponteiro */
  const a=(90-deg(Math.max(0,Math.min(7600,s.rpm))))*Math.PI/180;
  x.save();x.translate(CX+ox+7,CY+9);x.rotate(a);x.globalAlpha=.6;x.drawImage(atlas.nS,-PX,-PY);x.restore();
  x.save();x.translate(CX+ox,CY);x.rotate(a);x.drawImage(atlas.nCol,-PX,-PY);
  if(u>0){x.globalCompositeOperation="lighter";x.globalAlpha=.9*u;x.drawImage(get("n",atlas.nL,lc),-PX,-PY)}x.restore();
  /* pino central */
  g=x.createRadialGradient(CX+ox-5,CY-6,2,CX+ox,CY,26);g.addColorStop(0,"#6b7276");g.addColorStop(1,"#15191b");x.fillStyle=g;x.beginPath();x.arc(CX+ox,CY,24,0,6.2832);x.fill();
  x.restore();
  /* aro e vidro */
  x.lineWidth=7;x.strokeStyle="#2c3236";x.beginPath();x.arc(CX+ox,CY,285,0,6.2832);x.stroke();x.lineWidth=2;x.strokeStyle="#ffffff1f";x.beginPath();x.arc(CX+ox,CY,280,3.4,5.1);x.stroke();
  x.save();x.beginPath();x.arc(CX+ox,CY,280,0,6.2832);x.clip();g=x.createLinearGradient(80,60,340,330);g.addColorStop(0,"#ffffff1c");g.addColorStop(.5,"#ffffff05");g.addColorStop(1,"#ffffff00");x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.lineTo(LW,0);x.lineTo(0,LH*.55);x.fill();x.restore();
 }};
 Tach.ready(()=>api.draw());return api}};
})();
