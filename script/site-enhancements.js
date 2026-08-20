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
/* HR email fallback: keep mailto behavior, but provide a visible fallback when no mail app opens. */
(function(){
  'use strict';
  var button=document.getElementById('hr-email-button');
  if(!button) return;
  button.addEventListener('click',function(){
    var mailto=button.getAttribute('href');
    if(!mailto) return;
    window.location.href=mailto;
    window.setTimeout(function(){
      if(document.visibilityState==='visible' && !document.getElementById('hr-mail-fallback')){
        var note=document.createElement('div');
        note.id='hr-mail-fallback';
        note.className='hr-mail-fallback';
        note.innerHTML='<strong>Your email application did not open?</strong><span>Please send your enquiry directly to <a href="mailto:hr@terasiliconiq.com">hr@terasiliconiq.com</a>.</span>';
        button.parentNode.appendChild(note);
      }
    },900);
  });
})();
