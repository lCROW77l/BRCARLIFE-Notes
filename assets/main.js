(()=>{
const $=s=>document.querySelector(s),rm=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Barra de progresso de rolagem */
const pg=$("#prog");
addEventListener("scroll",()=>requestAnimationFrame(()=>{
pg.style.transform="scaleX("+scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)+")"}),{passive:true});

})();
