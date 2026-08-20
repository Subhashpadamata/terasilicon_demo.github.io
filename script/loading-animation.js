/* Terasilicon IQ — production page loading animation */
(function(){
  'use strict';
  var loader=document.getElementById('tsiq-loader');
  if(!loader) return;
  var hidden=false;
  function hide(){
    if(hidden) return; hidden=true;
    window.setTimeout(function(){loader.classList.add('is-hidden');}, 1150);
  }
  if(document.readyState==='complete') hide();
  else window.addEventListener('load',hide,{once:true});
  window.setTimeout(function(){loader.classList.add('is-hidden');},3500);
})();
