/* Roda do site: um atlas (albedo, normal, máscara) iluminado em WebGL por uma luz fixa + a luz colorida do cursor.
   Um único contexto compartilhado desenha em canvas 2D de destino. Atlas: [pneu | aro-fundo | pinça | aro-frente]. */
(()=>{
const TILES=4,cv=document.createElement("canvas");let gl=null,U={},ready=false,cbs=[];
try{gl=cv.getContext("webgl",{premultipliedAlpha:true,alpha:true})}catch(e){}
const api={cv,ok:!!gl,ready:()=>ready,on(f){ready?f():cbs.push(f)}};
window.Wheel=api;if(!gl)return;
const VS="attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0,1);}";
const FS=`precision mediump float;varying vec2 v;uniform sampler2D A,N,M;
uniform float tile,rot,zoom,dim,heat,lit;uniform vec2 off;uniform vec3 P,C,tint,hc;
void main(){
 vec2 s=(v-.5)*zoom-off;float c=cos(rot),sn=sin(rot);
 vec2 t=vec2(c*s.x-sn*s.y,sn*s.x+c*s.y)+.5;
 if(t.x<0.||t.x>1.||t.y<0.||t.y>1.)discard;
 vec2 u=vec2((tile+t.x)/${TILES}.,t.y);
 vec4 a=texture2D(A,u);if(a.a<.004)discard;
 vec3 m=texture2D(M,u).rgb,n=texture2D(N,u).rgb*2.-1.;
 n.xy=vec2(c*n.x+sn*n.y,-sn*n.x+c*n.y);n=normalize(n);
 vec3 col=a.rgb;
 col=mix(col,col*tint,m.r);
 col=mix(col,mix(col,hc,.75)+hc*.25,heat*m.g);
 col*=1.-.5*dim*m.b;
 vec3 g=normalize(vec3(-.55,.56,.62));
 float base=.7+.5*min(max(dot(n,g),0.),1.6);
 vec3 d=vec3(P.xy-v,P.z);vec3 l=normalize(d);float f=lit/(1.+3.5*dot(d.xy,d.xy));
 float df=max(dot(n,l),0.)*f;vec3 h=normalize(l+vec3(0.,0.,1.));float sp=pow(max(dot(n,h),0.),36.)*f;
 col=col*base*mix(vec3(1.),C*1.05,clamp(df*.6,0.,1.))+C*sp*.7;
 gl_FragColor=vec4(col*a.a,a.a);}`;
const sh=(k,s)=>{const o=gl.createShader(k);gl.shaderSource(o,s);gl.compileShader(o);return o},pr=gl.createProgram();
gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);
if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){api.ok=false;return}
gl.useProgram(pr);
const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
const q=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(q);gl.vertexAttribPointer(q,2,gl.FLOAT,false,0,0);
["tile","rot","zoom","dim","heat","lit","off","P","C","tint","hc"].forEach(k=>U[k]=gl.getUniformLocation(pr,k));
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(0,0,0,0);
let n=0;["roda","roda-n","roda-m"].forEach((f,i)=>{const im=new Image();im.onload=()=>{
 const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
 [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR));
 [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(k=>gl.texParameteri(gl.TEXTURE_2D,k,gl.CLAMP_TO_EDGE));
 gl.uniform1i(gl.getUniformLocation(pr,"AMN"[i]),i);
 if(++n==3){ready=true;cbs.splice(0).forEach(f=>f())}};im.src="assets/img/"+f+".webp"});
/* o={size,zoom,rot,tire:{rot,dy},light:[x,y,z]|null,color:[r,g,b],tint,heat,heatColor,dim,rim:{dy}}
   dy em fração do diâmetro (positivo = para baixo). Devolve o canvas WebGL (copie com drawImage já). */
api.draw=o=>{
 if(!ready)return null;const S=o.size|0;if(cv.width!==S){cv.width=cv.height=S}gl.viewport(0,0,S,S);gl.clear(gl.COLOR_BUFFER_BIT);
 const L=o.light,r=o.rot||0,z=o.zoom||1;
 gl.uniform1f(U.zoom,z);gl.uniform1f(U.dim,o.dim||0);gl.uniform1f(U.heat,o.heat||0);
 gl.uniform3f(U.P,L?L[0]:.5,L?L[1]:.5,L?L[2]:.55);gl.uniform1f(U.lit,L?1:0);
 const C=o.color||[.24,.81,.14],T=o.tint||[1,1,1],H=o.heatColor||[1,.4,.1];
 gl.uniform3f(U.C,C[0],C[1],C[2]);gl.uniform3f(U.tint,T[0],T[1],T[2]);gl.uniform3f(U.hc,H[0],H[1],H[2]);
 const rd=(o.rim&&o.rim.dy)||0,td=(o.tire&&o.tire.dy)||0,tr=o.tire&&o.tire.rot!=null?o.tire.rot:r;
 [[0,tr,td],[1,r,rd],[2,0,rd],[3,r,rd]].forEach(([t,a,dy])=>{
  gl.uniform1f(U.tile,t);gl.uniform1f(U.rot,a);gl.uniform2f(U.off,0,-dy);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)});
 return cv};
})();
