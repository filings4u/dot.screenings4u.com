(function(){
  'use strict';

  const MANAGED_HOST='dot.screenings4u.com';
  const API='https://elpbnytpciqnbexiaebp.supabase.co/functions/v1/dot-distribution-runtime';
  const POLL_MS=5000;
  let lastSignature='';
  let pollTimer=null;

  function pageRoute(){
    const p=location.pathname||'/';
    if(p==='/'||p.endsWith('/index.html')) return '/';
    return p.startsWith('/')?p:'/'+p;
  }

  function ensureMeta(name,property){
    const selector=property?`meta[property="${property}"]`:`meta[name="${name}"]`;
    let el=document.head.querySelector(selector);
    if(!el){el=document.createElement('meta');if(property)el.setAttribute('property',property);else el.setAttribute('name',name);document.head.appendChild(el)}
    return el;
  }
  function ensureLink(rel){
    let el=document.head.querySelector(`link[rel="${rel}"]`);
    if(!el){el=document.createElement('link');el.rel=rel;document.head.appendChild(el)}
    return el;
  }
  function cleanClassList(value){return String(value||'').split(/\s+/).map(x=>x.trim()).filter(x=>/^[A-Za-z0-9_-]+$/.test(x))}
  function safeHttps(raw){
    if(!raw)return'';
    try{const u=new URL(String(raw),location.href);return u.protocol==='https:'?u.href:''}catch{return''}
  }
  function merge(){
    const out={};
    for(const src of arguments){
      if(!src||typeof src!=='object'||Array.isArray(src))continue;
      for(const [k,v] of Object.entries(src)){
        if(v&&typeof v==='object'&&!Array.isArray(v)&&out[k]&&typeof out[k]==='object'&&!Array.isArray(out[k])) out[k]={...out[k],...v};
        else out[k]=v;
      }
    }
    return out;
  }

  function applyBanner(cfg){
    let el=document.getElementById('s4u-management-banner');
    const b=cfg.banner;
    const text=typeof b==='string'?b:(b&&typeof b==='object'?String(b.text||''):'');
    if(!text){if(el)el.remove();return}
    if(!el){
      el=document.createElement('div');el.id='s4u-management-banner';el.setAttribute('role','status');
      el.style.cssText='position:relative;z-index:2147482000;background:#102f55;color:#fff;text-align:center;padding:10px 18px;font:700 14px/1.4 Inter,Arial,sans-serif';
      document.body.insertAdjacentElement('afterbegin',el);
    }
    el.textContent=text;
    if(b&&typeof b==='object'&&b.background) el.style.background=String(b.background);
    if(b&&typeof b==='object'&&b.color) el.style.color=String(b.color);
  }

  function applyStatus(cfg){
    let el=document.getElementById('s4u-management-status-overlay');
    const status=String(cfg.status||'active').toLowerCase();
    if(!['maintenance','disabled','inactive'].includes(status)){if(el)el.remove();return}
    if(!el){el=document.createElement('div');el.id='s4u-management-status-overlay';document.body.appendChild(el)}
    const heading=status==='maintenance'?'This page is temporarily unavailable':'This page is currently unavailable';
    el.innerHTML=`<div><strong>${heading}</strong><p>${status==='maintenance'?'We are completing an update. Please try again shortly.':'Please return to the screenings4u DOT home page.'}</p><a href="/">Return to DOT Home</a></div>`;
    el.style.cssText='position:fixed;inset:0;z-index:2147483600;background:#f4f7fb;display:grid;place-items:center;padding:24px;font-family:Inter,Arial,sans-serif;color:#17365f';
    const box=el.firstElementChild; if(box) box.style.cssText='max-width:620px;background:#fff;border:1px solid #dbe4ef;border-radius:16px;padding:34px;text-align:center;box-shadow:0 20px 55px rgba(16,47,85,.12)';
  }

  function applyConfig(payload){
    if(!payload||payload.managed!==true)return;
    const cfg=merge(payload.global?.published_config,payload.target?.published_config,payload.page?.published_config);
    const sig=JSON.stringify(cfg);
    if(sig===lastSignature)return;
    lastSignature=sig;

    if(cfg.redirect_url){const u=safeHttps(cfg.redirect_url);if(u&&u!==location.href){location.replace(u);return}}
    if(cfg.title)document.title=String(cfg.title);
    if(cfg.meta_description!==undefined)ensureMeta('description').content=String(cfg.meta_description||'');
    if(cfg.meta_keywords!==undefined)ensureMeta('keywords').content=String(cfg.meta_keywords||'');
    if(cfg.robots!==undefined)ensureMeta('robots').content=String(cfg.robots||'');
    else if(cfg.seo_index===false)ensureMeta('robots').content='noindex,nofollow';
    if(cfg.og_title!==undefined)ensureMeta('', 'og:title').content=String(cfg.og_title||'');
    if(cfg.og_description!==undefined)ensureMeta('', 'og:description').content=String(cfg.og_description||'');
    if(cfg.og_image!==undefined)ensureMeta('', 'og:image').content=String(cfg.og_image||'');
    if(cfg.twitter_card!==undefined)ensureMeta('twitter:card').content=String(cfg.twitter_card||'summary_large_image');
    if(cfg.canonical_url){const u=safeHttps(cfg.canonical_url);if(u)ensureLink('canonical').href=u}
    const fav=safeHttps(cfg.favicon_url)||'images/fav.png';
    ensureLink('icon').href=fav;

    let style=document.getElementById('s4u-management-runtime-style');
    if(cfg.custom_css){if(!style){style=document.createElement('style');style.id='s4u-management-runtime-style';document.head.appendChild(style)}style.textContent=String(cfg.custom_css)}
    else if(style)style.remove();

    document.body.classList.forEach(c=>{if(c.startsWith('s4u-managed-'))document.body.classList.remove(c)});
    cleanClassList(cfg.body_class).forEach(c=>document.body.classList.add('s4u-managed-'+c));

    let jsonld=document.getElementById('s4u-managed-jsonld');
    if(cfg.structured_data&&Object.keys(cfg.structured_data||{}).length){if(!jsonld){jsonld=document.createElement('script');jsonld.type='application/ld+json';jsonld.id='s4u-managed-jsonld';document.head.appendChild(jsonld)}jsonld.textContent=JSON.stringify(cfg.structured_data)}
    else if(jsonld)jsonld.remove();

    applyBanner(cfg);
    applyStatus(cfg);

    if(Array.isArray(payload.manifest)){
      window.S4UManagedPageManifest=payload.manifest;
      window.dispatchEvent(new CustomEvent('s4u:management-runtime-updated',{detail:{config:cfg,manifest:payload.manifest}}));
    }else{
      window.dispatchEvent(new CustomEvent('s4u:management-runtime-updated',{detail:{config:cfg}}));
    }
  }

  async function load(includeManifest){
    try{
      const q=new URLSearchParams({host:MANAGED_HOST,route:pageRoute()});
      if(includeManifest)q.set('include_manifest','1');
      const r=await fetch(`${API}?${q.toString()}`,{method:'GET',cache:'no-store',headers:{'Accept':'application/json'}});
      const d=await r.json().catch(()=>null);
      if(r.ok&&d)applyConfig(d);
    }catch(err){console.warn('DOT live management configuration unavailable.',err)}
  }

  function start(){
    load(true);
    if(pollTimer)clearInterval(pollTimer);
    pollTimer=setInterval(()=>{if(document.visibilityState==='visible')load(false)},POLL_MS);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
