(()=>{
const groups=[...document.querySelectorAll('[data-filter]')];
const cards=[...document.querySelectorAll('#catalog .feature')];
const count=document.querySelector('#result-count');
const empty=document.querySelector('#catalog-empty');
const selected={area:'all',status:'all'};
function update(){
  let visible=0;
  cards.forEach(card=>{const show=(selected.area==='all'||card.dataset.area===selected.area)&&(selected.status==='all'||card.dataset.status===selected.status);card.hidden=!show;if(show)visible++});
  count.textContent=visible+' '+(visible===1?'item':'itens');
  empty.hidden=visible!==0;
}
groups.forEach(group=>group.addEventListener('click',event=>{
  const button=event.target.closest('button[data-value]');
  if(!button||!group.contains(button))return;
  selected[group.dataset.filter]=button.dataset.value;
  group.querySelectorAll('button').forEach(item=>{const active=item===button;item.classList.toggle('selected',active);item.setAttribute('aria-pressed',String(active))});
  update();
}));
update();
})();
