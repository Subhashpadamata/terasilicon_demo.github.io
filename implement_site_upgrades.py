from pathlib import Path
from PIL import Image
from bs4 import BeautifulSoup
import re, shutil, html

ROOT = Path('/mnt/data/terasilicon_work')
ASSETS = ROOT/'assets'
CONTACT='contact@terasiliconiq.com'
CONTACT_MAILTO='mailto:'+CONTACT
CAPS = [
 ('formal-verification.html','Formal Verification','formal'),
 ('sta-timing-closure.html','STA & Timing Closure','timing'),
 ('emir-power-integrity.html','EMIR & Power Integrity','emir'),
 ('physical-design-signoff.html','Physical Design & Signoff','physical-design'),
 ('rtl-dv-dft.html','RTL, Design Verification & DFT','rtl-dv-dft'),
 ('physical-verification.html','Physical Verification','physical-verification'),
]

# 1) Generate responsive WebP derivatives from the existing 4K source artwork.
image_specs = {
 'formal/formal-property-checking.png':'formal/formal-property-checking',
 'formal/formal-equivalence-checking.png':'formal/formal-equivalence-checking',
 'subpage-diagrams/emir-power-integrity.png':'subpage-diagrams/emir-power-integrity',
 'subpage-diagrams/physical-design-ppa.png':'subpage-diagrams/physical-design-ppa',
 'subpage-diagrams/physical-design-flow.png':'subpage-diagrams/physical-design-flow',
 'subpage-diagrams/rtl-design-verification.png':'subpage-diagrams/rtl-design-verification',
 'subpage-diagrams/dft-testability.png':'subpage-diagrams/dft-testability',
 'subpage-diagrams/physical-verification-drc-lvs.png':'subpage-diagrams/physical-verification-drc-lvs',
 'subpage-diagrams/physical-verification-layout-intent.png':'subpage-diagrams/physical-verification-layout-intent',
 'subpage-diagrams/sta-timing-closure.png':'subpage-diagrams/sta-timing-closure',
 'subpage-diagrams/4k/emir-power-integrity.png':'subpage-diagrams/4k/emir-power-integrity',
 'subpage-diagrams/4k/physical-design-ppa.png':'subpage-diagrams/4k/physical-design-ppa',
 'subpage-diagrams/4k/physical-design-flow.png':'subpage-diagrams/4k/physical-design-flow',
 'subpage-diagrams/4k/rtl-design-verification.png':'subpage-diagrams/4k/rtl-design-verification',
 'subpage-diagrams/4k/dft-testability.png':'subpage-diagrams/4k/dft-testability',
 'subpage-diagrams/4k/physical-verification-drc-lvs.png':'subpage-diagrams/4k/physical-verification-drc-lvs',
 'subpage-diagrams/4k/physical-verification-layout-intent.png':'subpage-diagrams/4k/physical-verification-layout-intent',
 'subpage-diagrams/4k/sta-timing-closure.png':'subpage-diagrams/4k/sta-timing-closure',
 'formal/4k/formal-property-checking.png':'formal/4k/formal-property-checking',
 'formal/4k/formal-equivalence-checking.png':'formal/4k/formal-equivalence-checking',
}
for rel, stem in image_specs.items():
    src=ASSETS/rel
    if not src.exists(): continue
    im=Image.open(src).convert('RGB')
    outdir=ASSETS/Path(stem).parent
    outdir.mkdir(parents=True, exist_ok=True)
    base=Path(stem).name
    for width in (960, 1920, 3840):
        w=min(width, im.width)
        if w==im.width:
            resized=im
        else:
            h=round(im.height*w/im.width)
            resized=im.resize((w,h), Image.Resampling.LANCZOS)
        resized.save(outdir/f'{base}-{w}.webp','WEBP',quality=90,method=6)

# 2) Bundle shared CSS in original cascade order, excluding the now-unused loader stylesheet.
order=[f'{i:02d}-' for i in range(1,11)] + ['12-','13-','14-','15-','16-','17-']
css_files=[]
for prefix in order:
    matches=sorted((ROOT/'css').glob(prefix+'*.css'))
    css_files.extend(matches)
parts=[]
for p in css_files:
    parts.append(f'\n/* ===== {p.name} ===== */\n'+p.read_text(encoding='utf-8'))
(ROOT/'css/site-bundle.css').write_text(''.join(parts), encoding='utf-8')

# 3) Common helper HTML snippets.
related = {
 'formal': [('sta-timing-closure.html','STA & Timing Closure','Timing paths, constraints and closure analysis.'),('rtl-dv-dft.html','RTL, Design Verification & DFT','RTL, UVM, assertions, coverage and testability.')],
 'timing': [('formal-verification.html','Formal Verification','Property proofs, counterexamples and equivalence.'),('physical-design-signoff.html','Physical Design & Signoff','Implementation, PPA and physical closure.')],
 'emir': [('physical-design-signoff.html','Physical Design & Signoff','PPA, power delivery and physical optimization.'),('physical-verification.html','Physical Verification','DRC, LVS and signoff readiness.')],
 'physical-design': [('sta-timing-closure.html','STA & Timing Closure','Timing analysis and closure of critical paths.'),('emir-power-integrity.html','EMIR & Power Integrity','IR-drop, electromigration and power-grid risk.')],
 'rtl-dv-dft': [('formal-verification.html','Formal Verification','Assertions, property proof and equivalence.'),('sta-timing-closure.html','STA & Timing Closure','Timing constraints and implementation closure.')],
 'physical-verification': [('physical-design-signoff.html','Physical Design & Signoff','Implementation and PPA optimization.'),('emir-power-integrity.html','EMIR & Power Integrity','Power integrity and signoff risk analysis.')],
}

def responsive_picture(img_src, alt, eager=False, lightbox=True):
    # img_src should be assets/.../4k/name.png
    p=Path(img_src)
    stem=p.with_suffix('')
    # WebP versions are siblings in same folder.
    base=stem.name
    parent=stem.parent
    src960=f'{parent}/{base}-960.webp'
    src1920=f'{parent}/{base}-1920.webp'
    src3840=f'{parent}/{base}-3840.webp'
    attrs='loading="eager"' if eager else 'loading="lazy"'
    attrs += ' decoding="async"'
    link=f' data-lightbox="technical-diagram"' if lightbox else ''
    return (f'<picture class="responsive-diagram"{link}>'
            f'<source type="image/webp" srcset="{src960} 960w, {src1920} 1920w, {src3840} 3840w" sizes="(max-width: 900px) 100vw, 92vw">'
            f'<img src="{img_src}" srcset="{img_src} 3840w" sizes="(max-width: 900px) 100vw, 92vw" alt="{html.escape(alt)}" {attrs}{" tabindex=\"0\" role=\"button\"" if lightbox else ""}/>'
            f'</picture>')

def breadcrumb(title):
    return f'''<nav class="cap-breadcrumb" aria-label="Breadcrumb"><a href="index.html#home">Home</a><span aria-hidden="true">→</span><a href="index.html#capabilities">Capabilities</a><span aria-hidden="true">→</span><span aria-current="page">{html.escape(title)}</span></nav>'''

def related_html(items):
    cards=''.join(f'<a class="related-card" href="{u}"><span class="related-label">RELATED CAPABILITY</span><strong>{html.escape(t)}</strong><span>{html.escape(d)}</span><b aria-hidden="true">→</b></a>' for u,t,d in items)
    return f'''<section class="related-capabilities" aria-labelledby="related-title"><div class="related-head"><div><p class="eyebrow">CONTINUE EXPLORING</p><h2 id="related-title">Related Capabilities</h2></div><a href="index.html#capabilities" class="related-all">View all capabilities →</a></div><div class="related-grid">{cards}</div></section>'''

def contact_html(title):
    return f'''<section class="detailed-contact enhanced-contact" id="requirement-form" aria-labelledby="contact-title"><div class="contact-copy"><p class="eyebrow">ENGINEERING INQUIRY</p><h2 id="contact-title">Discuss Your {html.escape(title)} Requirement</h2><p>Share the scope, design stage and verification or signoff challenge. We will route the request to the engineering team.</p><p class="contact-direct">Prefer email? <a href="{CONTACT_MAILTO}">{CONTACT}</a></p></div><form class="engineering-form" action="mailto:{CONTACT}" method="post" enctype="text/plain"><div class="form-grid"><label>Name<input required name="Name" autocomplete="name"></label><label>Work Email<input required type="email" name="Work Email" autocomplete="email"></label><label>Company<input name="Company" autocomplete="organization"></label><label>EDA Tools / Flow<input name="EDA Tools / Flow" placeholder="e.g. VC Formal, JasperGold, VCS"></label></div><label>Verification / Signoff Scope<textarea required name="Scope" rows="4" placeholder="Briefly describe the block, interface, flow or closure challenge."></textarea></label><label>Attachment / Specs Link<input name="Attachment / Specs Link" placeholder="Optional secure link to specs or NDA material"></label><div class="form-actions"><button class="button" type="submit">Prepare Engineering Inquiry →</button><span>Submitting opens your configured email client with the details.</span></div></form></section>'''

# Schema/meta data
page_meta={
 'formal-verification.html':('Formal Verification Services | Terasilicon IQ','Formal property checking, SVA, counterexample debug and formal equivalence checking for ASIC and SoC designs.' ,'formal/4k/formal-property-checking.png'),
 'sta-timing-closure.html':('STA & Timing Closure | Terasilicon IQ','Static timing analysis, setup and hold closure, MMMC analysis and implementation guidance for ASIC and SoC signoff.','subpage-diagrams/4k/sta-timing-closure.png'),
 'emir-power-integrity.html':('EMIR & Power Integrity | Terasilicon IQ','Static and dynamic IR-drop, electromigration and power-grid analysis to identify and close power-integrity risks.','subpage-diagrams/4k/emir-power-integrity.png'),
 'physical-design-signoff.html':('Physical Design & PPA Optimization | Terasilicon IQ','Physical implementation, floorplanning, placement, CTS, routing, ECOs and PPA optimization through physical closure.','subpage-diagrams/4k/physical-design-ppa.png'),
 'rtl-dv-dft.html':('RTL, Design Verification & DFT | Terasilicon IQ','RTL design verification, SystemVerilog, UVM, assertions, coverage, scan, ATPG and DFT testability support.','subpage-diagrams/4k/rtl-design-verification.png'),
 'physical-verification.html':('Physical Verification — DRC, LVS & Signoff | Terasilicon IQ','DRC, LVS, layout-versus-schematic analysis, physical debug and signoff readiness for semiconductor layouts.','subpage-diagrams/4k/physical-verification-drc-lvs.png'),
}

# 4) Modify six capability pages.
for filename,title,key in CAPS:
    path=ROOT/filename
    soup=BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser')
    head=soup.head
    mt,desc,img=page_meta[filename]
    soup.title.string=mt
    d=head.find('meta',attrs={'name':'description'})
    if d: d['content']=desc
    else: head.append(soup.new_tag('meta',attrs={'name':'description','content':desc}))
    # remove stylesheet links and add bundle after font link
    for link in list(head.find_all('link',rel='stylesheet')):
        link.decompose()
    bundle=soup.new_tag('link',rel='stylesheet',href='css/site-bundle.css')
    fontlink=head.find('link',href=lambda x: x and 'fonts.googleapis.com' in x)
    if fontlink: fontlink.insert_after(bundle)
    else: head.append(bundle)
    # remove loader assets and markup
    loader=soup.find(id='tsiq-loader')
    if loader: loader.decompose()
    for s in soup.find_all('script',src=re.compile(r'logo-loader\.js')): s.decompose()
    # Add OG/Twitter/meta
    for attrs in [
        {'property':'og:title','content':mt},{'property':'og:description','content':desc},{'property':'og:type','content':'website'},{'property':'og:image','content':img},{'property':'og:url','content':filename},
    ]:
        tag=soup.new_tag('meta',attrs=attrs); head.append(tag)
    for attrs in [{'name':'twitter:card','content':'summary_large_image'},{'name':'twitter:title','content':mt},{'name':'twitter:description','content':desc},{'name':'twitter:image','content':img}]:
        head.append(soup.new_tag('meta',attrs=attrs))
    # Breadcrumb
    main=soup.find('main')
    container=main.find(class_='detailed-container') if main else None
    if container and not container.find(class_='cap-breadcrumb'):
        container.insert(0,BeautifulSoup(breadcrumb(title),'html.parser'))
    # Replace contact CTAs with new form later; direct mail links to contact.
    for a in soup.find_all('a'):
        href=a.get('href','')
        if 'mail.google.com' in href and ('hr%40' in href or 'hr@' in href):
            a['href']=CONTACT_MAILTO
            a.attrs.pop('target',None); a.attrs.pop('rel',None)
    # Replace image markup in detailed-domain visuals with responsive pictures, preserving visual-note.
    for visual in soup.select('.detailed-domain .visual'):
        imgs=visual.find_all('img',recursive=False)
        for im in imgs:
            src=im.get('src','')
            if '/4k/' in src:
                alt=im.get('alt','Technical semiconductor engineering diagram')
                eager=im.get('loading')=='eager'
                pic=BeautifulSoup(responsive_picture(src,alt,eager),'html.parser')
                im.replace_with(pic)
    # Formal page: replace dedicated visuals similarly
    for im in soup.select('.formal-visuals img'):
        src=im.get('src','')
        if '/4k/' in src:
            alt=im.get('alt','Formal verification technical diagram')
            pic=BeautifulSoup(responsive_picture(src,alt,False),'html.parser')
            im.replace_with(pic)
    # Formal tools section, once.
    if key=='formal' and not soup.find(class_='eda-ecosystem'):
        tools=BeautifulSoup('''<section class="eda-ecosystem" aria-labelledby="eda-title"><div><p class="eyebrow">EDA ECOSYSTEM</p><h2 id="eda-title">Formal Verification Tool Environments</h2><p>Formal verification workflows can be integrated around the major commercial formal-analysis environments used by ASIC and SoC teams.</p></div><div class="tool-badges"><span>Synopsys VC Formal</span><span>Synopsys Formality</span><span>Cadence JasperGold</span><span>Cadence Conformal LEC</span><span>Siemens Questa Formal</span><span>OneSpin</span></div></section>''','html.parser')
        # Put before outcome
        out=container.find(class_='outcome') if container else None
        if out: out.insert_before(tools)
    # Related before contact, replace old detailed-contact with enhanced contact and related.
    old_contact=container.find(class_='detailed-contact') if container else None
    if old_contact:
        new_contact=BeautifulSoup(contact_html(title),'html.parser').section
        old_contact.replace_with(new_contact)
        contact_node=new_contact
    else:
        contact_node=None
    if container and not container.find(class_='related-capabilities'):
        rel=BeautifulSoup(related_html(related[key]),'html.parser').section
        if contact_node: contact_node.insert_before(rel)
        else: container.append(rel)
    # Add breadcrumb/schema JSON-LD
    schema={"@context":"https://schema.org","@type":"Service","name":title,"description":desc,"provider":{"@type":"Organization","name":"Terasilicon IQ"},"serviceType":title,"url":filename}
    ld=soup.new_tag('script',type='application/ld+json'); ld.string=__import__('json').dumps(schema,indent=2); head.append(ld)
    # Add enhancement JS before </body>
    if not soup.find('script',src='script/site-enhancements.js'):
        s=soup.new_tag('script',src='script/site-enhancements.js',defer=True); soup.body.append(s)
    # Write formatted HTML
    path.write_text(str(soup),encoding='utf-8')

# 5) Site-wide index: bundle CSS, remove loader, improve CTA email, add basic SEO/social/schema.
path=ROOT/'index.html'
soup=BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser')
for link in list(soup.head.find_all('link',rel='stylesheet')): link.decompose()
fontlink=soup.head.find('link',href=lambda x: x and 'fonts.googleapis.com' in x)
bundle=soup.new_tag('link',rel='stylesheet',href='css/site-bundle.css')
if fontlink: fontlink.insert_after(bundle)
else: soup.head.append(bundle)
loader=soup.find(id='tsiq-loader')
if loader: loader.decompose()
for s in soup.find_all('script',src=re.compile(r'logo-loader\.js')): s.decompose()
# replace hr mail URLs sitewide
for a in soup.find_all('a'):
    href=a.get('href','')
    if 'mail.google.com' in href and ('hr%40' in href or 'hr@' in href):
        a['href']=CONTACT_MAILTO; a.attrs.pop('target',None); a.attrs.pop('rel',None)
    if href=='mailto:hr@terasiliconiq.com': a['href']=CONTACT_MAILTO
# social metadata
head=soup.head
idxdesc=head.find('meta',attrs={'name':'description'})
index_desc=idxdesc.get('content') if idxdesc else 'Signoff-driven ASIC and SoC semiconductor engineering services.'
for attrs in [{'property':'og:title','content':'Terasilicon IQ | Signoff-Driven Semiconductor Engineering'},{'property':'og:description','content':index_desc},{'property':'og:type','content':'website'},{'property':'og:image','content':'assets/terasilicon-iq-logo-transparent.png'},{'property':'og:url','content':'index.html'},{'name':'twitter:card','content':'summary_large_image'}]: head.append(soup.new_tag('meta',attrs=attrs))
idxschema={"@context":"https://schema.org","@type":"ProfessionalService","name":"Terasilicon IQ","description":index_desc,"url":"index.html","email":CONTACT}
ld=soup.new_tag('script',type='application/ld+json'); ld.string=__import__('json').dumps(idxschema,indent=2); head.append(ld)
if not soup.find('script',src='script/site-enhancements.js'):
    s=soup.new_tag('script',src='script/site-enhancements.js',defer=True); soup.body.append(s)
path.write_text(str(soup),encoding='utf-8')

# 6) Enhancement JS: lightbox + inquiry form mailto body.
js='''/* Terasilicon IQ — lightweight interaction enhancements. */\n(function(){\n  'use strict';\n  const openLightbox=(img)=>{\n    const overlay=document.createElement('div'); overlay.className='tsiq-lightbox'; overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');\n    const close=document.createElement('button'); close.className='tsiq-lightbox-close'; close.type='button'; close.setAttribute('aria-label','Close image'); close.textContent='×';\n    const image=document.createElement('img'); image.src=img.currentSrc||img.src; image.alt=img.alt||'';\n    overlay.append(close,image); document.body.appendChild(overlay); document.body.classList.add('lightbox-open');\n    const dismiss=()=>{overlay.remove();document.body.classList.remove('lightbox-open')};\n    close.addEventListener('click',dismiss); overlay.addEventListener('click',e=>{if(e.target===overlay)dismiss()}); document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){dismiss();document.removeEventListener('keydown',esc)}}); close.focus();\n  };\n  document.querySelectorAll('[data-lightbox] img').forEach(img=>{img.addEventListener('click',()=>openLightbox(img));img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(img)}})});\n  document.querySelectorAll('.engineering-form').forEach(form=>{form.addEventListener('submit',function(e){\n    e.preventDefault();\n    const data=new FormData(form); const lines=[]; for(const [k,v] of data.entries()) lines.push(k+': '+v);\n    const subject='Engineering Inquiry — Terasilicon IQ'; const body=lines.join('\\n');\n    window.location.href='mailto:contact@terasiliconiq.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);\n  })});\n})();\n'''
(ROOT/'script/site-enhancements.js').write_text(js,encoding='utf-8')

# 7) UX/SEO CSS appended to bundle as a dedicated file, then rebuild bundle.
ux='''\n/* ===== 18-ux-seo-conversion.css ===== */\n.cap-breadcrumb{display:flex;align-items:center;gap:9px;margin:0 0 22px;color:var(--muted);font:11px/1.4 "IBM Plex Mono",monospace;letter-spacing:.02em}.cap-breadcrumb a{color:var(--muted);text-decoration:none}.cap-breadcrumb a:hover{color:var(--violet)}.cap-breadcrumb span[aria-current="page"]{color:var(--ink)}\n.related-capabilities{margin:66px 0 0;padding-top:42px;border-top:1px solid var(--line)}.related-head{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:20px}.related-head h2{margin:0;color:var(--ink);font-size:clamp(28px,3vw,42px);line-height:1.05;letter-spacing:-1.5px;text-transform:uppercase}.related-head .eyebrow{margin-bottom:8px}.related-all{color:var(--violet);font:11px "IBM Plex Mono",monospace;text-decoration:none}.related-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.related-card{position:relative;display:flex;flex-direction:column;gap:8px;padding:24px;border:1px solid var(--line);background:#fff;color:var(--ink);text-decoration:none;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.related-card:hover{transform:translateY(-2px);border-color:rgba(101,53,147,.45);box-shadow:0 14px 30px rgba(16,22,56,.08)}.related-card .related-label{color:var(--violet);font:10px "IBM Plex Mono",monospace;letter-spacing:.1em}.related-card strong{font-size:19px}.related-card span:not(.related-label){color:var(--muted);font-size:13px;line-height:1.5;max-width:620px}.related-card b{position:absolute;right:22px;top:50%;transform:translateY(-50%);font-size:20px;color:var(--violet)}\n.enhanced-contact{display:grid;grid-template-columns:minmax(0,.72fr) minmax(0,1.28fr);gap:42px;text-align:left!important;align-items:start}.enhanced-contact .contact-copy h2{margin:0 0 12px;text-align:left}.enhanced-contact .contact-copy p:not(.eyebrow){margin:0 0 12px}.contact-direct{font-size:12px!important}.contact-direct a{color:var(--violet);font-family:"IBM Plex Mono",monospace}.engineering-form{display:flex;flex-direction:column;gap:14px}.engineering-form label{display:flex;flex-direction:column;gap:7px;color:var(--ink);font:11px "IBM Plex Mono",monospace;letter-spacing:.02em}.engineering-form input,.engineering-form textarea{width:100%;box-sizing:border-box;border:1px solid #d5d2cc;background:#fff;color:var(--ink);font:13px "Space Grotesk",sans-serif;padding:11px 12px;border-radius:2px;outline:none}.engineering-form input:focus,.engineering-form textarea:focus{border-color:var(--violet);box-shadow:0 0 0 3px rgba(101,53,147,.09)}.form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.form-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap}.form-actions button{border:0;cursor:pointer}.form-actions span{color:var(--muted);font-size:11px;line-height:1.4}.eda-ecosystem{margin-top:22px;padding:28px;border:1px solid var(--line);background:#fff;display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:28px;align-items:center}.eda-ecosystem h2{margin:0 0 10px;color:var(--ink);font-size:clamp(24px,2.5vw,36px);line-height:1.05;text-transform:uppercase}.eda-ecosystem p:not(.eyebrow){margin:0;color:var(--muted);font-size:13px;line-height:1.65}.tool-badges{display:flex;gap:9px;flex-wrap:wrap}.tool-badges span{padding:9px 11px;border:1px solid #d7d5d1;border-radius:3px;background:#f8f7f4;color:#59617a;font:10px "IBM Plex Mono",monospace}.responsive-diagram{display:block}.responsive-diagram img{cursor:zoom-in}.tsiq-lightbox{position:fixed;inset:0;z-index:9999;background:rgba(8,13,28,.92);display:flex;align-items:center;justify-content:center;padding:30px;backdrop-filter:blur(4px)}.tsiq-lightbox img{max-width:94vw;max-height:92vh;width:auto;height:auto;object-fit:contain;box-shadow:0 24px 70px rgba(0,0,0,.4)}.tsiq-lightbox-close{position:fixed;top:18px;right:22px;width:44px;height:44px;border:1px solid rgba(255,255,255,.4);background:rgba(8,13,28,.65);color:#fff;border-radius:50%;font-size:28px;line-height:1;cursor:pointer}.lightbox-open{overflow:hidden}\n@media(max-width:900px){.related-grid,.enhanced-contact,.eda-ecosystem{grid-template-columns:1fr}.related-head{align-items:start;flex-direction:column}.enhanced-contact .contact-copy h2{text-align:center}.enhanced-contact .contact-copy{text-align:center}.form-grid{grid-template-columns:1fr}}\n@media(max-width:560px){.cap-breadcrumb{margin-bottom:16px}.related-capabilities{margin-top:48px;padding-top:32px}.related-grid{gap:12px}.related-card{padding:20px}.related-card b{right:16px}.enhanced-contact{padding:34px 18px}.eda-ecosystem{padding:22px 18px}.tsiq-lightbox{padding:16px}.tsiq-lightbox img{max-width:96vw;max-height:86vh}}\n'''
(ROOT/'css/18-ux-seo-conversion.css').write_text(ux,encoding='utf-8')
# rebuild bundle with new file at end
parts.append(ux)
(ROOT/'css/site-bundle.css').write_text(''.join(parts),encoding='utf-8')

print('Upgrades implemented.')
