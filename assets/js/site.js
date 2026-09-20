
(()=>{
 const nav=document.querySelector('.nav'),toggle=document.querySelector('.menu-toggle');
 if(toggle)toggle.onclick=()=>nav.classList.toggle('open');
 document.querySelectorAll('[data-signin]').forEach(x=>x.addEventListener('change',e=>{if(e.target.value)location.href=e.target.value}));
})();
