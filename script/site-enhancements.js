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
  var button=document.getElementById('sales-email-button');
  if(!button) return;
  button.addEventListener('click',function(){
    var mailto=button.getAttribute('href');
    if(!mailto) return;
    window.location.href=mailto;
    window.setTimeout(function(){
      if(document.visibilityState==='visible' && !document.getElementById('mail-fallback')){
        var note=document.createElement('div');
        note.id='mail-fallback';
        note.className='mail-fallback';
        note.innerHTML='<strong>Your email application did not open?</strong><span>Please send your enquiry directly to <a href="mailto:sales@terasiliconiq.com">sales@terasiliconiq.com</a>.</span>';
        button.parentNode.appendChild(note);
      }
    },900);
  });
})();


/* V6.16 — lightweight viewport reveal animations. */
(function(){
  'use strict';
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const selectors=['.flow-section','#signoff .section-head','#signoff .card.core','#capabilities .section-head','#capabilities .capability-row','#solutions .section-head','#solutions .card','#about .section-head','#about .check-list','.detailed-domain','.subpage-requirement-cta','.contact-details .footer-column'];
  const elements=Array.from(document.querySelectorAll(selectors.join(',')));
  if(!elements.length)return;
  document.body.classList.add('tsiq-motion-ready');
  elements.forEach((el,index)=>{el.classList.add('tsiq-reveal');const delay=index%4;if(delay)el.classList.add('tsiq-delay-'+delay);});
  const observer=new IntersectionObserver((entries,obs)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('tsiq-revealed');obs.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -7% 0px'});
  elements.forEach(el=>observer.observe(el));
})();
