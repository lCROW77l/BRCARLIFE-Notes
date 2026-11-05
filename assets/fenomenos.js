(()=>{
const groups=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('#catalog .feature')];
const count=document.querySelector('#result-count');
const empty=document.querySelector('#catalog-empty');
const more=document.querySelector('#catalog-more');
const selected={area:'all',status:'all'};
let expanded=false;
function update(){
  let total=0,visible=0;
  cards.forEach(card=>{const match=(selected.area==='all'||card.dataset.area===selected.area)&&(selected.status==='all'||card.dataset.status===selected.status);if(match)total++;const show=match&&(expanded||total<=8);card.hidden=!show;if(show)visible++});
  count.textContent=visible===total?total+' '+(total===1?'recurso':'recursos'):visible+' de '+total+' recursos';
  empty.hidden=total!==0;
  more.hidden=expanded||total<=8;
  if(!more.hidden)more.innerHTML='Ver todos os '+total+' recursos <span aria-hidden="true">↓</span>';
}
groups.forEach(group=>group.addEventListener('click',event=>{
  const button=event.target.closest('button[data-value]');
  if(!button||!group.contains(button))return;
  selected[group.dataset.filter]=button.dataset.value;
  expanded=false;
  group.querySelectorAll('button').forEach(item=>{const active=item===button;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active))});
  update();
}));
more.addEventListener('click',()=>{expanded=true;update()});
update();
})();
