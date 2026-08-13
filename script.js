const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');
toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const logoTarget=document.querySelector('.solutions-visual p');
if(logoTarget)logoTarget.outerHTML='<div class="orbit-system" aria-label="Terasilicon IQ engineering roles"><div class="orbit-core"><img src="assets/terasilicon-iq-logo-lockup.png" alt="Terasilicon IQ"></div><div class="role-orbit orbit-rtl"><button class="role-node" type="button" aria-label="RTL Design"><b>01</b><span>RTL Design</span></button></div><div class="role-orbit orbit-dv"><button class="role-node" type="button" aria-label="Design Verification"><b>02</b><span>Design Verification</span></button></div><div class="role-orbit orbit-dft"><button class="role-node" type="button" aria-label="Design for Test"><b>03</b><span>DFT</span></button></div><div class="role-orbit orbit-pd"><button class="role-node" type="button" aria-label="Physical Design"><b>04</b><span>Physical Design</span></button></div></div>';

const revealTargets=document.querySelectorAll('.statement,.metrics,.service-card,.industries-heading,.industry-grid,.solutions-copy,.article-grid,.contact');
revealTargets.forEach(item=>item.classList.add('reveal-on-scroll'));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
revealTargets.forEach(item=>observer.observe(item));

const metricObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.querySelectorAll('[data-count]').forEach(counter=>{const target=Number(counter.dataset.count);const duration=900;const started=performance.now();const tick=now=>{const progress=Math.min((now-started)/duration,1);const value=Math.round(target*(1-Math.pow(1-progress,3)));counter.firstChild.nodeValue=value; if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)});metricObserver.unobserve(entry.target)}),{threshold:.5});
const metrics=document.querySelector('.metrics');if(metrics)metricObserver.observe(metrics);
