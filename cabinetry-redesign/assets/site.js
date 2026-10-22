(() => {
  "use strict";
  const ROOT = "./";
  const applySettings = d => {
    const s=d.settings||{},design=s.design||{},root=document.documentElement;
    const colors={accent:"--gold",background:"--paper",dark:"--black",cream:"--cream"};
    Object.entries(colors).forEach(([field,variable])=>{
      const value=design[field];if(/^#[0-9a-f]{6}$/i.test(value||""))root.style.setProperty(variable,value);
    });
    const fonts={"Playfair Display":'"Playfair Display",Georgia,serif',"DM Sans":'"DM Sans",Arial,sans',"Manrope":'"Manrope",Arial,sans',Georgia:'Georgia,serif',Arial:'Arial,sans-serif'};
    if(fonts[design.headingFont])root.style.setProperty("--serif",fonts[design.headingFont]);
    if(fonts[design.bodyFont])root.style.setProperty("--sans",fonts[design.bodyFont]);
    const styleText=String(design.customCSS||"");
    if(styleText && styleText.length<10000){
      const style=document.createElement("style");style.id="k-custom-style";style.textContent=styleText;document.head.appendChild(style);
    }
    const metadata=s.seo||{},prefix={home:"home",products:"products",projects:"projects",about:"about",contact:"contact"}[page]||"home";
    const title=metadata[prefix+"Title"],desc=metadata[prefix+"Description"];
    if(title)document.title=String(title)+" | K Cabinetry";
    if(desc){document.querySelector('meta[name="description"]')?.setAttribute("content",desc);document.querySelector('meta[property="og:description"]')?.setAttribute("content",desc);}
    if(title)document.querySelector('meta[property="og:title"]')?.setAttribute("content",String(title)+" | K Cabinetry");
  };
  const applyVisibility = d => {
    const sections=d.settings?.sections||{};
    const selectors={ticker:".ticker",intro:".intro",collections:".collections",benefits:".benefits",projects:"section.projects",cta:".cta-photo"};
    Object.entries(selectors).forEach(([key,selector])=>{if(sections[key]===false)document.querySelector(selector)?.remove();});
  };

  const $ = (selector, root=document) => root.querySelector(selector);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const safeImage = value => {
    const s=String(value||"").trim();
    return (/^https:\/\//i.test(s) || /^(?:\.\/)?(?:media|assets)\/[a-z\d_./ -]+\.(?:png|jpe?g|webp|avif|gif|svg)$/i.test(s)) ? esc(s) : "";
  };
  const textLines = value => esc(value).replace(/\n/g, "<br>");
  const photo = (src,alt="",cls="",loading="lazy") => '<img class="'+cls+'" src="'+safeImage(src)+'" alt="'+esc(alt)+'" loading="'+loading+'" referrerpolicy="no-referrer">';
  const link = (href,label,outline=false) => '<a class="btn'+(outline?' btn-outline':'')+'" href="'+esc(href)+'">'+esc(label)+' <span aria-hidden="true">↗</span></a>';
  const anchor = (href,label) => '<a class="text-link" href="'+esc(href)+'">'+esc(label)+' <span aria-hidden="true">↗</span></a>';
  const eyebrow = (text,dark=false) => '<p class="eyebrow'+(dark?' dark':'')+'">'+esc(text)+'</p>';
  const page = document.body.dataset.page || "home";
  const urlFor = name => name === "home" ? "./index.html" : "./"+name+".html";
  const navItems=[["home","Home"],["about","About"],["products","Products"],["projects","Inspiration"],["contact","Contact"]];
  const header = d => {
    const b=d.brand||{};
    const menu=(d.settings?.navigation||navItems.map(([page,label])=>({page,label,visible:true}))).filter(item=>item.visible!==false).map(item=>[item.page,item.label]).map(([id,label])=>'<a href="'+urlFor(id)+'" class="'+(page===id?'active':'')+'" '+(page===id?'aria-current="page"':'')+'>'+label+'</a>').join("");
    return (d.settings?.announcementEnabled===false?"":'<div class="topline">'+esc(d.settings?.announcement||"Thoughtful design • Cabinets & countertops • Georgia")+'</div>')+
      '<header class="header" id="header"><div class="shell header-inner"><a class="brand" href="./index.html" aria-label="K Cabinetry home">'+photo(b.logo,"K Cabinetry gold emblem","logo","eager")+
      '<span class="brand-wordmark">K CABINETRY<small>FINE INTERIORS</small></span></a>'+
      '<button type="button" class="menu-toggle" id="menu-toggle" aria-controls="primary-navigation" aria-expanded="false">Menu <span aria-hidden="true">☰</span></button>'+
      '<nav class="nav" id="primary-navigation" aria-label="Main navigation">'+menu+'</nav>'+link("./contact.html",d.settings?.buttons?.quote||"Request a quote").replace('class="btn"','class="btn head-action"')+
      '</div></header>';
  };
  const footer = d => {
    const b=d.brand||{};
    return '<footer class="footer"><div class="shell"><div class="footer-top"><div>'+
      '<a class="brand" href="./index.html">'+photo(b.logo,"K Cabinetry gold emblem","logo")+ '<span class="brand-wordmark">K CABINETRY<small>FINE INTERIORS</small></span></a>'+
      '<p class="footer-copy">'+esc(b.tagline)+'</p></div>'+
      '<div><h4>Explore</h4><div class="footer-links">'+(d.settings?.navigation||navItems.map(([page,label])=>({page,label,visible:true}))).filter(item=>item.visible!==false).map(item=>[item.page,item.label]).map(([id,l])=>'<a href="'+urlFor(id)+'">'+l+'</a>').join('')+'</div></div>'+
      '<div><h4>Contact</h4><p><a href="tel:'+esc(String(b.phone||"").replace(/[^+\d]/g,""))+'">'+esc(b.phone)+'</a><br>'+
      '<a href="mailto:'+esc(b.email)+'">'+esc(b.email)+'</a></p><p>'+esc(b.address)+'</p></div>'+
      '<div><h4>Showroom hours</h4><p>'+esc(b.hours)+'</p><p><a href="./contact.html">Plan a visit ↗</a></p></div></div>'+
      '<div class="footer-bottom"><span>© <span id="year"></span> K Cabinetry. All rights reserved.</span><span>Thoughtfully made for the spaces we share.</span></div>'+
      '</div></footer>';
  };
  const pageHero=(label,title,image) => '<section class="pagehero">'+photo(image,title,'','eager')+'<div class="shell">'+eyebrow(label)+'<h1 class="title">'+esc(title)+'</h1></div></section>';
  const productCard=(p) => '<a class="product-card reveal" href="./products.html#'+esc(p.id)+'"><div class="photo">'+photo(p.image,p.title)+'</div><span class="round-arrow" aria-hidden="true">↗</span><div class="product-card-info"><div class="meta">'+esc(p.category)+'</div><h3>'+esc(p.title)+'</h3><p class="desc">'+esc(p.short)+'</p>'+anchor('./products.html#'+p.id,'Discover the collection')+'</div></a>';
  const projectCard=(p) => '<a href="./projects.html" class="project-card reveal">'+photo(p.image,p.title)+'<div class="project-caption"><div><small>'+esc(p.category)+'</small><h3>'+esc(p.title)+'</h3></div><b aria-hidden="true">↗</b></div></a>';
  const cta=(d)=>{const h=d.home||{};return '<section class="cta-photo">'+photo(h.ctaImage||d.hero?.image,"Beautiful interior")+
      '<div class="shell cta-inner">'+eyebrow("LET'S MAKE IT HAPPEN")+'<h2 class="title">'+esc(h.ctaTitle||"Let's bring your vision to life.")+'</h2><p>'+esc(h.ctaText||"We would love to hear about your project.")+'</p>'+link("./contact.html",d.settings?.buttons?.cta||"Get in touch")+'</div></section>';};
  const home = d =>{
    const h=d.home||{}, hero=d.hero||{}, products=d.products||[], projects=d.projects||[], benefits=h.benefits||[];
    return '<section class="hero">'+photo(hero.image,"Elegant K Cabinetry kitchen interior","hero-img","eager")+
      '<div class="shell hero-inner"><div class="hero-content">'+eyebrow(hero.eyebrow)+'<h1 class="display">'+esc(hero.title)+'</h1>'+
      '<p class="hero-desc">'+esc(hero.description)+'</p><div class="hero-actions">'+link("./products.html",hero.ctaLabel||"Explore collections")+
      link("./contact.html",d.settings?.buttons?.heroSecondary||"Let's talk about your project",true)+'</div></div></div><div class="hero-side">INTERIORS WITH INTENTION — K CABINETRY</div><div class="hero-bottom"></div></section>'+
      '<div class="ticker"><div class="shell ticker-inner"><div class="ticker-item"><span>✦</span> Timeless cabinetry</div><div class="ticker-item"><span>✦</span> Beautiful surfaces</div><div class="ticker-item"><span>✦</span> Personal service</div></div></div>'+
      '<section class="section intro"><div class="shell intro-grid"><div class="intro-copy reveal">'+eyebrow(h.introLabel,true)+'<h2 class="title">'+esc(h.introTitle)+'</h2>'+
      '<p class="section-copy">'+esc(h.introText)+'</p>'+anchor("./about.html","Our story")+'</div><div class="image-frame reveal">'+photo(h.introImage,"Warm architectural interior")+
      '<div class="image-badge"><span>KC</span><small>Fine living<br>by design</small></div></div></div></section>'+
      '<section class="section collections"><div class="shell"><div class="section-head">'+
      '<div>'+eyebrow("THE COLLECTIONS",true)+'<h2 class="title">'+esc(h.productsTitle)+'</h2><p class="section-copy">'+esc(h.productsText)+'</p></div>'+anchor("./products.html","View all products")+'</div>'+
      '<div class="collection-grid">'+products.slice(0,3).map(productCard).join('')+'</div></div></section>'+
      '<section class="section benefits"><div class="shell"><div class="benefits-heading">'+eyebrow("THE K CABINETRY DIFFERENCE")+'<h2 class="title">'+esc(h.valueTitle)+'</h2></div>'+
      '<div class="benefit-grid">'+benefits.map(b=>'<article class="benefit reveal"><span class="benefit-num">'+esc(b.number)+'</span><h3>'+esc(b.title)+'</h3><p>'+esc(b.body)+'</p></article>').join('')+'</div></div></section>'+
      '<section class="section projects"><div class="shell"><div class="section-head"><div>'+eyebrow("SPACES TO INSPIRE",true)+'<h2 class="title">'+esc(h.projectsTitle)+'</h2>'+
      '<p class="section-copy">'+esc(h.projectsText)+'</p></div>'+anchor("./projects.html","More inspiration")+'</div><div class="project-grid">'+projects.slice(0,2).map(projectCard).join('')+'</div></div></section>'+cta(d);
  };
  const products = d => pageHero("K CABINETRY / COLLECTIONS","The collections.",d.hero?.image)+
    '<section class="page-intro"><div class="shell">'+eyebrow("FIND YOUR FINISH",true)+'<h2 class="title">Beautiful materials. Thoughtful details.</h2>'+
    '<p class="section-copy">Explore the cabinetry and surface options that transform kitchens, bathrooms and interiors into spaces you will love spending time in.</p></div></section>'+
    '<section class="product-list"><div class="shell">'+(d.products||[]).map(p=>'<article class="product-row reveal" id="'+esc(p.id)+'">'+
    '<div class="product-photo">'+photo(p.image,p.title)+'</div><div class="product-info">'+eyebrow(p.category,true)+'<h2>'+esc(p.title)+'</h2>'+
    '<p class="subtitle">'+esc(p.short)+'</p><p>'+esc(p.description)+'</p><ul class="feature-list">'+String(p.features||"").split('\n').filter(Boolean).map(s=>'<li>'+esc(s)+'</li>').join('')+
    '</ul>'+anchor("./contact.html","Ask about this collection")+'</div></article>').join('')+'</div></section>'+cta(d);
  const projects = d => {
    const categories=["All",...new Set((d.projects||[]).map(p=>p.category).filter(Boolean))];
    return pageHero("K CABINETRY / INSPIRATION","Spaces that inspire.",d.home?.introImage||d.hero?.image)+
      '<section class="page-intro"><div class="shell">'+eyebrow("THE LOOKBOOK",true)+'<h2 class="title">Ideas worth exploring.</h2>'+
      '<p class="section-copy">A curated collection of design inspiration. These editorial inspiration images are illustrative, not a verified portfolio of completed K Cabinetry installations.</p></div></section>'+
      '<section class="shell"><div class="gallery-controls" role="group" aria-label="Filter inspiration by category">'+
      categories.map((c,i)=>'<button type="button" class="filter-btn'+(i===0?' active':'')+'" data-filter="'+esc(c)+'" aria-pressed="'+(i===0?'true':'false')+'">'+esc(c)+'</button>').join('')+
      '</div><div class="gallery-grid">'+(d.projects||[]).map(p=>'<figure class="gallery-card reveal" data-category="'+esc(p.category)+'"><div class="photo">'+photo(p.image,p.title)+'</div><figcaption><span class="kicker">'+esc(p.category)+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p></figcaption></figure>').join('')+
      '</div></section>'+cta(d);
  };
  const about = d => {
    const a=d.about||{};
    return pageHero(a.eyebrow||"OUR STORY",a.title,d.home?.introImage||d.hero?.image)+
      '<section class="shell story"><div class="story-photo reveal">'+photo(a.image,"Beautiful K Cabinetry design inspiration")+'</div><div class="reveal">'+
      eyebrow("THE WAY WE WORK",true)+'<h2 class="title">'+esc(a.storyTitle)+'</h2><p>'+esc(a.intro)+'</p><p>'+esc(a.storyText)+'</p>'+
      anchor("./contact.html","Start a conversation")+'</div></section>'+
      '<section class="section steps"><div class="shell">'+eyebrow("OUR APPROACH",true)+'<h2 class="title">From the first idea to the finishing detail.</h2>'+
      '<div class="step-grid">'+(a.steps||[]).map(s=>'<article class="step reveal"><span class="num">'+esc(s.number)+'</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.description)+'</p></article>').join('')+
      '</div></div></section>'+cta(d);
  };
  const contact = d => {
    const b=d.brand||{}, c=d.contact||{};
    return pageHero(c.eyebrow||"GET IN TOUCH","Let's talk.",d.home?.ctaImage||d.hero?.image)+
      '<section class="shell contact-wrap"><div class="contact-details">'+eyebrow("VISIT OR CONNECT",true)+'<h2 class="title">'+esc(c.title)+'</h2>'+
      '<p class="section-copy">'+esc(c.introduction)+'</p><div class="contact-line"><h3>Call us</h3><a href="tel:'+esc(String(b.phone||"").replace(/[^+\d]/g,""))+'">'+esc(b.phone)+'</a></div>'+
      '<div class="contact-line"><h3>Email us</h3><a href="mailto:'+esc(b.email)+'">'+esc(b.email)+'</a></div>'+
      '<div class="contact-line"><h3>Find us</h3><p>'+esc(b.address)+'</p><p>'+esc(b.hours)+'</p></div></div>'+
      '<form class="contact-form" id="inquiry-form"><h2>Tell us about your project.</h2><p>'+esc(c.note)+'</p>'+
      '<div class="form-grid"><div class="field"><label for="name">Your name *</label><input id="name" name="name" autocomplete="name" required></div>'+
      '<div class="field"><label for="email">Email address *</label><input id="email" name="email" type="email" autocomplete="email" required></div>'+
      '<div class="field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" autocomplete="tel"></div>'+
      '<div class="field"><label for="type">Project type</label><select id="type" name="project"><option>Kitchen</option><option>Bathroom</option><option>Countertops</option><option>Commercial / other</option></select></div>'+
      '<div class="field full"><label for="message">Tell us a little about your project *</label><textarea id="message" name="message" required></textarea></div></div>'+
      '<button class="btn" type="submit">Prepare inquiry <span aria-hidden="true">↗</span></button><div class="form-status" role="status" aria-live="polite"></div>'+
      '<p class="tiny">Without a configured form service, this opens your email application to send the inquiry. No message is stored on the website.</p></form></section>';
  };
  const render = async () => {
    try {
      const response=await fetch(ROOT+"content/site.json",{cache:"no-store"});
      if(!response.ok) throw Error("Content unavailable");
      const d=await response.json();
      applySettings(d);
      const sections={home,products,projects,about,contact};
      $("#site").innerHTML=header(d)+'<main id="main">'+(sections[page]||home)(d)+'</main>'+footer(d);
      applyVisibility(d);
      $("#year").textContent=new Date().getFullYear();
      const head=$("#header"),toggle=$("#menu-toggle");
      const sticky=()=>head.classList.toggle("scrolled",scrollY>65);
      addEventListener("scroll",sticky,{passive:true});sticky();
      toggle.addEventListener("click",()=>{
        const isOpen=head.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded",String(isOpen));
      });
      document.addEventListener("keydown",ev=>{if(ev.key==="Escape"){head.classList.remove("menu-open");toggle.setAttribute("aria-expanded","false");}});
      if("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches){
        const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("shown");io.unobserve(e.target);}}),{threshold:.08});
        document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
      } else document.querySelectorAll(".reveal").forEach(el=>el.classList.add("shown"));
      document.querySelectorAll(".filter-btn").forEach(button=>button.addEventListener("click",()=>{
        const cat=button.dataset.filter;
        document.querySelectorAll(".filter-btn").forEach(el=>{const sel=el===button;el.classList.toggle("active",sel);el.setAttribute("aria-pressed",String(sel));});
        document.querySelectorAll(".gallery-card").forEach(el=>{el.hidden=cat!=="All" && el.dataset.category!==cat;el.style.display=el.hidden?"none":"";});
      }));
      const form=$("#inquiry-form");
      if(form) form.addEventListener("submit",async e=>{
        e.preventDefault();
        if(!form.reportValidity()) return;
        const values=Object.fromEntries(new FormData(form).entries());
        const status=$(".form-status",form), endpoint=String(d.contact?.formEndpoint||"").trim();
        if(/^https:\/\//i.test(endpoint)){
          const btn=$("button[type=submit]",form);btn.disabled=true;status.textContent="Sending your inquiry…";
          try {
            const r=await fetch(endpoint,{method:"POST",body:JSON.stringify(values),headers:{"Accept":"application/json","Content-Type":"application/json"}});
            if(!r.ok) throw Error("Form service returned "+r.status);
            status.textContent="Thank you. Your inquiry was submitted.";form.reset();
          }catch(err){status.textContent="Couldn't submit automatically. Please email "+d.brand.email+"."; }
          finally{btn.disabled=false;}
        }else{
          const subject="K Cabinetry inquiry — "+values.project;
          const body=["Name: "+values.name,"Email: "+values.email,"Phone: "+(values.phone||"Not provided"),"Project: "+values.project,"","Details:",values.message].join("\n");
          const mail="mailto:"+encodeURIComponent(d.brand.email)+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);
          status.textContent="Your email app will open. Please send the prepared message to complete your inquiry.";
          window.location.href=mail;
        }
      });
    } catch (error) {
      console.error("Site content error:", error);
      $("#site").innerHTML='<main class="loading"><h1>K Cabinetry</h1><p>We could not load the website content. Please refresh or contact <a href="mailto:info@kcabinetry.net">info@kcabinetry.net</a>.</p></main>';
    }
  };
  render();
})();