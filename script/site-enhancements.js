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
})();
