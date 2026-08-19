/* Terasilicon IQ — lightweight interaction enhancements. */
(function(){
  'use strict';
  const openLightbox=(img)=>{
    const overlay=document.createElement('div'); overlay.className='tsiq-lightbox'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
    const close=document.createElement('button'); close.className='tsiq-lightbox-close'; close.type='button'; close.setAttribute('aria-label','Close image'); close.textContent='×';
    const image=document.createElement('img'); image.src=img.currentSrc||img.src; image.alt=img.alt||'';
    overlay.append(close,image); document.body.appendChild(overlay); document.body.classList.add('lightbox-open');
    const dismiss=()=>{overlay.remove();document.body.classList.remove('lightbox-open')};
    close.addEventListener('click',dismiss); overlay.addEventListener('click',e=>{if(e.target===overlay)dismiss()}); document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){dismiss();document.removeEventListener('keydown',esc)}}); close.focus();
  };
  document.querySelectorAll('[data-lightbox] img').forEach(img=>{img.addEventListener('click',()=>openLightbox(img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(img)}})});
  document.querySelectorAll('.engineering-form').forEach(form=>{form.addEventListener('submit',function(e){
    e.preventDefault();
    const data=new FormData(form); const lines=[]; for(const [k,v] of data.entries()){ if(v instanceof File){ lines.push(k+': '+(v.name||'No file selected')); } else { lines.push(k+': '+v); } }
    const subject='Engineering Inquiry — Terasilicon IQ'; const body=lines.join('\n');
    window.location.href='mailto:contact@terasiliconiq.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  })});
})();
