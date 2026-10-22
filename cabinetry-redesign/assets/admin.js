(() => {
"use strict";
const REPO="kkiran777/k-cabinetry-site",BRANCH="main",FOLDER="cabinetry-redesign";
const DOC=FOLDER+"/content/site.json",API="https://api.github.com/repos/"+REPO+"/contents/";
let token="",data=null,sha="",dirty=false,active="brand",busy=false;
const $=(s,root=document)=>root.querySelector(s);
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const schemas={
 builder:{title:"Visual page builder",description:"Drag, reorder, edit and live-preview your homepage."},

 announcement:{title:"Announcement bar",description:"Edit the thin banner at the top of your website.",fields:[["announcementEnabled","Show announcement bar","checkbox"],["announcement","Announcement text","textarea"]],basePath:"settings"},
 design:{title:"Brand colors & typography",description:"Update your site-wide appearance without editing CSS.",fields:[["accent","Gold / accent color","color"],["background","Page background","color"],["dark","Dark panels / header","color"],["cream","Cream background","color"],["headingFont","Heading font","font"],["bodyFont","Body font","font"],["customCSS","Advanced custom CSS","textarea"]],basePath:"settings.design"},
 navigation:{title:"Menus & navigation",description:"Change menu names, visibility and their order.",arrayPath:"settings.navigation",fields:[["label","Menu label"],["page","Page key: home, about, products, projects or contact"],["visible","Show in menu","checkbox"]]},
 sections:{title:"Homepage visibility",description:"Show or hide entire sections on your homepage.",fields:[["ticker","Feature strip","checkbox"],["intro","Welcome / about section","checkbox"],["collections","Product collection cards","checkbox"],["benefits","Why choose us section","checkbox"],["projects","Inspiration feature","checkbox"],["cta","Bottom call-to-action","checkbox"]],basePath:"settings.sections"},
 buttons:{title:"Buttons & calls to action",description:"Edit the text of the primary navigation and marketing buttons.",fields:[["heroSecondary","Secondary hero button"],["cta","Bottom banner button"],["quote","Navigation quote button"]],basePath:"settings.buttons"},
 seo:{title:"Search engine settings",description:"Manage browser tab titles and search-result descriptions for each page.",fields:[
 ["homeTitle","Homepage SEO title"],["homeDescription","Homepage description","textarea"],["productsTitle","Products SEO title"],["productsDescription","Products description","textarea"],["projectsTitle","Inspiration SEO title"],["projectsDescription","Inspiration description","textarea"],["aboutTitle","About SEO title"],["aboutDescription","About description","textarea"],["contactTitle","Contact SEO title"],["contactDescription","Contact description","textarea"]],basePath:"settings.seo"},

 brand:{title:"Brand & contact",description:"Your logo, business contact details and footer information.",fields:[
 ["name","Business name"],["logo","Brand logo","image"],["tagline","Tagline","textarea"],["phone","Phone number"],["email","Public email address"],["address","Business address","textarea"],["hours","Business hours"],["instagram","Instagram URL"],["facebook","Facebook URL"]]},
 hero:{title:"Homepage hero",description:"The first section visitors see when they land on your site.",fields:[
 ["eyebrow","Small heading"],["title","Main headline","textarea"],["description","Introduction","textarea"],["image","Large hero photo","image"],["ctaLabel","Primary button text"]]},
 home:{title:"Homepage sections",description:"Control the welcome section, product intro, inspiration and closing banner.",fields:[
 ["introLabel","Intro eyebrow"],["introTitle","Intro headline"],["introText","Intro paragraph","textarea"],["introImage","Intro photo","image"],["productsTitle","Products heading"],["productsText","Products intro","textarea"],["valueTitle","Why choose us heading"],["projectsTitle","Inspiration heading"],["projectsText","Inspiration copy","textarea"],["ctaTitle","Bottom banner headline"],["ctaText","Bottom banner copy","textarea"],["ctaImage","Bottom banner photo","image"]]},
 benefits:{title:"Service highlights",description:"The three value statements displayed on the homepage.",arrayPath:"home.benefits",fields:[
 ["number","Number"],["title","Heading"],["body","Description","textarea"]]},
 products:{title:"Product collections",description:"Manage cards and details on the Products page. Add, reorder or remove items.",arrayPath:"products",fields:[
 ["id","URL anchor / unique ID"],["category","Category eyebrow"],["title","Product name"],["short","Short description","textarea"],["description","Product detail","textarea"],["image","Product image","image"],["features","Feature list (one per line)","textarea"]]},
 projects:{title:"Inspiration gallery",description:"Inspiration photos and categories. Replace these with permission-cleared project photos when ready.",arrayPath:"projects",fields:[
 ["title","Image title"],["category","Gallery category"],["description","Caption","textarea"],["image","Gallery image","image"]]},
 about:{title:"About page",description:"Tell your company's story and explain your approach.",fields:[
 ["eyebrow","Small heading"],["title","Page title","textarea"],["intro","Introduction","textarea"],["image","About page photo","image"],["storyTitle","Story heading"],["storyText","Our story","textarea"]]},
 steps:{title:"Our process",description:"The process steps on the About page.",arrayPath:"about.steps",fields:[
 ["number","Step number"],["title","Step title"],["description","Step description","textarea"]]},
 contact:{title:"Contact page",description:"The contact page copy and optional form endpoint.",fields:[
 ["eyebrow","Small heading"],["title","Page heading"],["introduction","Introduction","textarea"],["note","Form instructions","textarea"],["formEndpoint","HTTPS form submission endpoint"]]}
};
const sections=["builder","brand","design","announcement","navigation","sections","buttons","hero","home","benefits","products","projects","about","steps","contact","seo"];
const status=(message,problem=false,selector="#editor-status")=>{
 const el=$(selector); if(!el)return;el.textContent=message||"";el.classList.toggle("error",!!problem);
};
function markDirty(){
 dirty=true;
 $("#publish").disabled=busy;
 const state=$("#change-state");
 state.textContent="Unpublished changes";state.classList.add("dirty");
 status("");
}
function markClean(){
 dirty=false;$("#publish").disabled=true;
 const state=$("#change-state");state.textContent="All changes published";state.classList.remove("dirty");
}
function getValue(path){return path.split(".").reduce((obj,key)=>obj?.[key],data);}
function putValue(path,value){
 const parts=path.split(".");let obj=data;
 for(let i=0;i<parts.length-1;i++){if(obj[parts[i]]==null)return;obj=obj[parts[i]];}
 obj[parts[parts.length-1]]=value;markDirty();updatePreview();
}
function fieldHTML(label,type,path){
 const rawValue=getValue(path);
 const value=String(rawValue??"");
 const key=esc(path),caption=esc(label);
 let control;
 if(type==="checkbox")control='<input type="checkbox" data-path="'+key+'" '+(rawValue===true?"checked":"")+' aria-label="'+caption+'">';
 else if(type==="color")control='<input type="color" data-path="'+key+'" value="'+(/^#[0-9a-f]{6}$/i.test(value)?esc(value):"#caa967")+'">';
 else if(type==="font")control='<select data-path="'+key+'">'+["Playfair Display","DM Sans","Manrope","Georgia","Arial"].map(v=>'<option value="'+esc(v)+'" '+(value===v?"selected":"")+' >'+esc(v)+'</option>').join("")+'</select>';
 else if(type==="textarea")control='<textarea data-path="'+key+'" rows="4">'+esc(value)+'</textarea>';
 else control='<input type="text" data-path="'+key+'" value="'+esc(value)+'" autocomplete="off">';
 if(type==="image"){
   const src=/^https:\/\//i.test(value)?value:/^(?:\.\/)?media\//i.test(value)?"../"+value:"";
   return '<div class="field wide"><label>'+caption+'</label><div class="image-tool">'+control+
    '<button type="button" class="upload-btn" data-upload="'+key+'">Upload photo</button></div>'+
    (src?'<div class="image-preview"><img src="'+esc(src)+'" alt="'+caption+' preview" loading="lazy"></div>':'')+
    '<small class="help-line">Paste a secure image URL or upload a photo (JPG, PNG, WebP, AVIF or GIF; up to 4 MB).</small></div>';
 }
 const wide=type==="textarea"||label.length>32;
 return '<div class="field'+(wide?' wide':'')+'"><label>'+caption+'</label>'+control+'</div>';
}

// Visual page builder: hero remains fixed; all other homepage sections can be reordered.
const BLOCKS=[
 {id:"ticker",name:"Trust & service strip",detail:"Three value statements below the hero",tab:"sections"},
 {id:"intro",name:"Welcome / about",detail:"Large feature image and introduction",tab:"home"},
 {id:"collections",name:"Product collections",detail:"Featured product cards",tab:"products"},
 {id:"benefits",name:"Why choose us",detail:"Three service highlights",tab:"benefits"},
 {id:"projects",name:"Inspiration showcase",detail:"Featured project imagery",tab:"projects"},
 {id:"cta",name:"Contact banner",detail:"Final call-to-action section",tab:"home"}
];
let previewTimer=null,draggedId=null,previewMode="desktop",previewPage="home";
function updatePreview(){
 if(active!=="builder")return;
 clearTimeout(previewTimer);
 previewTimer=setTimeout(()=>{
   const frame=$("#builder-frame");
   if(frame?.contentWindow&&data)frame.contentWindow.postMessage({type:"K_CABINETRY_PREVIEW",payload:data},location.origin);
 },180);
}

const CUSTOM_TYPES={
 text:{label:"Text section",description:"Heading, description and optional button"},
 image:{label:"Image + text",description:"Image beside editable text and a button"},
 banner:{label:"Full-width banner",description:"Statement text with optional background photo"},
 spacer:{label:"Section spacer",description:"A flexible vertical gap between sections"}
};
function ensureCustom(){
 data.settings ||= {};
 data.settings.customBlocks ||= [];
 data.settings.sectionOrder ||= BLOCKS.map(b=>b.id);
}
function newCustomBlock(type,original){
 ensureCustom();
 const id="custom-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6);
 const b={id,type,title:"Your next great idea.",body:"Edit this section's text, photo and button in the page builder.",image:"",buttonText:"Learn more",buttonUrl:"./contact.html",visible:true,...(original||{})};
 b.id=id;b.type=type;data.settings.customBlocks.push(b);data.settings.sectionOrder.push(id);
 markDirty();render();updatePreview();
}
function customCard(b){
 const type=CUSTOM_TYPES[b.type]||CUSTOM_TYPES.text;
 const visible=b.visible!==false;
 return '<div class="builder-card custom-card" draggable="true" data-block="'+esc(b.id)+'" tabindex="0"><span class="drag-handle" title="Drag to reorder">⠿</span>'+
 '<div class="builder-card-body"><strong>'+esc(b.title||type.label)+'</strong><small>'+esc(type.label)+'</small></div>'+
 '<label class="builder-visibility"><input type="checkbox" data-custom-visible="'+esc(b.id)+'" '+(visible?"checked":"")+'> Show</label>'+
 '<button type="button" data-custom-edit="'+esc(b.id)+'">Edit</button>'+
 '<button type="button" data-custom-duplicate="'+esc(b.id)+'" title="Duplicate block">⧉</button>'+
 '<button type="button" data-block-up="'+esc(b.id)+'">↑</button><button type="button" data-block-down="'+esc(b.id)+'">↓</button>'+
 '<button type="button" data-custom-delete="'+esc(b.id)+'" title="Delete section">×</button></div>';
}
function customEditPanel(){
 const selected=window.kSelectedCustom;
 const b=data.settings.customBlocks.find(x=>x.id===selected);
 if(!b)return "";
 const i=data.settings.customBlocks.findIndex(x=>x.id===selected);
 return '<div class="builder-panel custom-editor"><strong>Editing: '+esc(CUSTOM_TYPES[b.type]?.label||"Custom section")+'</strong>'+
 '<p>Edit the selected block below. Updates show immediately in the preview.</p>'+
 fieldHTML("Heading",null,"settings.customBlocks."+i+".title")+
 fieldHTML("Description","textarea","settings.customBlocks."+i+".body")+
 (b.type!=="spacer"?fieldHTML("Section image / background","image","settings.customBlocks."+i+".image"):"")+
 (b.type!=="spacer"?fieldHTML("Button label",null,"settings.customBlocks."+i+".buttonText"):"")+
 (b.type!=="spacer"?fieldHTML("Button link",null,"settings.customBlocks."+i+".buttonUrl"):"")+
 '<button type="button" data-custom-done="1">Done editing</button></div>';
}
function renderBuilder(){
 const root=$("#editor");
 ensureCustom();
 if(!Array.isArray(data.settings.sectionOrder))data.settings.sectionOrder=BLOCKS.map(b=>b.id);
 const order=[...new Set([...data.settings.sectionOrder,...BLOCKS.map(b=>b.id),...data.settings.customBlocks.map(b=>b.id)])].filter(id=>BLOCKS.some(b=>b.id===id)||data.settings.customBlocks.some(b=>b.id===id));
 const cards=order.map(id=>{
  const custom=data.settings.customBlocks.find(b=>b.id===id);if(custom)return customCard(custom);
  const b=BLOCKS.find(block=>block.id===id),visible=data.settings.sections?.[id]!==false;
  return '<div class="builder-card" draggable="true" data-block="'+esc(id)+'" tabindex="0" aria-label="'+esc(b.name)+'">'+
   '<span class="drag-handle" title="Drag to reorder">⠿</span><div class="builder-card-body"><strong>'+esc(b.name)+'</strong><small>'+esc(b.detail)+'</small></div>'+
   '<label class="builder-visibility"><input type="checkbox" data-block-visible="'+esc(id)+'" '+(visible?"checked":"")+' aria-label="Show '+esc(b.name)+'"> Show</label>'+
   '<button type="button" data-block-edit="'+esc(b.tab)+'">Edit</button>'+
   '<button type="button" data-block-up="'+esc(id)+'" aria-label="Move up">↑</button><button type="button" data-block-down="'+esc(id)+'" aria-label="Move down">↓</button></div>';
 }).join("");
 const pageButtons=[["home","Home"],["products","Products"],["projects","Gallery"],["about","About"],["contact","Contact"]].map(([key,label])=>'<button type="button" data-preview-page="'+key+'" class="'+(previewPage===key?"selected":"")+'">'+label+'</button>').join("");
 root.innerHTML='<div class="panel-header"><h2>Visual page builder</h2><p>Drag cards to reorder your homepage, switch sections on or off and see your unpublished edits instantly.</p></div>'+
 '<div class="builder-layout"><div class="builder-controls"><div class="builder-label">Homepage layout <span>Drag ⠿ to reorder</span></div>'+
 '<div id="builder-blocks">'+cards+'</div><div class="builder-add"><strong>Add a new section</strong><div class="builder-add-buttons">'+Object.entries(CUSTOM_TYPES).map(([id,t])=>'<button type="button" data-custom-add="'+id+'">+ '+esc(t.label)+'</button>').join("")+'</div></div><p class="help-line">The hero stays at the top. To change its text and image, use the Homepage hero tab.</p>'+
 customEditPanel()+'<div class="builder-panel"><strong>Quick-edit homepage</strong><p>Changes appear immediately in the live preview.</p>'+
 fieldHTML("Hero headline","textarea","hero.title")+fieldHTML("Hero description","textarea","hero.description")+
 fieldHTML("Welcome headline",null,"home.introTitle")+fieldHTML("Closing banner headline",null,"home.ctaTitle")+
 '</div><div class="builder-panel"><strong>Tools</strong><div class="builder-tool-row"><button type="button" data-builder-action="reset">Restore default order</button><button type="button" data-builder-action="showall">Show all sections</button></div></div></div>'+
 '<div class="builder-preview"><div class="builder-preview-tools"><div class="preview-pages">'+pageButtons+'</div>'+
 '<div class="builder-size"><button type="button" data-preview-mode="desktop" class="'+(previewMode==="desktop"?"selected":"")+'">Desktop</button>'+
 '<button type="button" data-preview-mode="mobile" class="'+(previewMode==="mobile"?"selected":"")+'">Mobile</button></div></div>'+
 '<div class="builder-viewport '+previewMode+'"><iframe id="builder-frame" title="Live website preview" loading="eager" src="../'+(previewPage==="home"?"index":previewPage)+'.html?preview=1"></iframe></div>'+
 '<p class="help-line">This preview uses your unsaved edits. Only “Publish changes” updates the public website.</p></div></div>';
 const frame=$("#builder-frame");frame.addEventListener("load",updatePreview);
 updatePreview();
}
function orderChange(from,to){
 const order=data.settings.sectionOrder;
 const fromIndex=order.indexOf(from),toIndex=order.indexOf(to);
 if(fromIndex<0||toIndex<0||fromIndex===toIndex)return;
 order.splice(fromIndex,1);order.splice(toIndex,0,from);
 markDirty();render();updatePreview();
}
function builderClick(event){
 const el=event.target.closest("button");
 if(!el)return;
 const edit=el.dataset.blockEdit;
 if(edit){active=edit;render();return;}
 const up=el.dataset.blockUp,down=el.dataset.blockDown;
 if(up||down){
   const id=up||down,order=data.settings.sectionOrder,index=order.indexOf(id);
   const other=order[index+(up?-1:1)];if(other)orderChange(id,other);return;
 }
 const mode=el.dataset.previewMode;
 if(mode){previewMode=mode;$(".builder-viewport")?.classList.toggle("mobile",mode==="mobile");$(".builder-viewport")?.classList.toggle("desktop",mode!=="mobile");document.querySelectorAll("[data-preview-mode]").forEach(b=>b.classList.toggle("selected",b.dataset.previewMode===mode));return;}
 const pageKey=el.dataset.previewPage;
 if(pageKey){previewPage=pageKey;render();return;}
 const action=el.dataset.builderAction;
 if(action==="reset"){data.settings.sectionOrder=[...BLOCKS.map(b=>b.id),...data.settings.customBlocks.map(b=>b.id)];markDirty();render();updatePreview();}
 if(action==="showall"){BLOCKS.forEach(b=>{data.settings.sections[b.id]=true;});data.settings.customBlocks.forEach(b=>b.visible=true);markDirty();render();updatePreview();}
}

function render(){
 if(active==="builder"){renderBuilder();return;}
 const schema=schemas[active];if(!schema||!data)return;
 $("#editor-nav").innerHTML=sections.map(id=>'<button type="button" class="'+(id===active?"active":"")+'" data-tab="'+id+'" aria-current="'+(id===active?"page":"false")+'">'+esc(schemas[id].title)+'</button>').join("");
 let html='<div class="panel-header"><h2>'+esc(schema.title)+'</h2><p>'+esc(schema.description)+'</p></div>';
 if(schema.arrayPath){
   const items=getValue(schema.arrayPath)||[];
   html+= '<p class="help-line">Edit these items in any order. Save your changes using “Publish changes”.</p>';
   items.forEach((entry,i)=>{
      html+='<article class="collection-row"><div class="collection-heading"><h3>'+esc(entry.title||entry.number||"Item")+" "+(entry.title?"":"#"+(i+1))+'</h3>'+
       '<div class="row-actions"><button type="button" data-action="up" data-index="'+i+'"'+(i===0?" disabled":"")+'>↑ Move up</button>'+
       '<button type="button" data-action="down" data-index="'+i+'"'+(i===items.length-1?" disabled":"")+'>↓ Move down</button>'+
       '<button type="button" data-action="delete" data-index="'+i+'">Remove</button></div></div>'+
       '<div class="fields">'+schema.fields.map(([k,label,type])=>fieldHTML(label,type,schema.arrayPath+"."+i+"."+k)).join("")+'</div></article>';
   });
   html+='<button type="button" class="add-row" data-action="add">+ Add '+(active==="products"?"product":active==="projects"?"gallery item":active==="navigation"?"menu link":"step")+'</button>';
 } else {
   html+='<div class="fields">'+schema.fields.map(([k,label,type])=>fieldHTML(label,type,(schema.basePath||active)+"."+k)).join("")+'</div>';
   if(active==="contact")html+='<div class="notice"><strong>Contact form:</strong> Without a form endpoint, visitors can prepare an email from the contact page. For automatic submissions, paste an HTTPS endpoint from a form provider that accepts JSON POST requests, and configure that provider to permit requests from your hosted site.</div>';
   if(active==="brand")html+='<div class="notice">The logo shown by default is the supplied K Cabinetry emblem hosted on your existing website. You can upload it here to save a copy into your new GitHub site.</div>';
 }
 if(active==="navigation")html+='<div class="notice">Menu links use page keys: home, about, products, projects, contact. Hiding a menu link does not disable direct page access.</div>';
 $("#editor").innerHTML=html;
}
function encode(text){
 const bytes=new TextEncoder().encode(text);let chars="";
 for(let i=0;i<bytes.length;i+=8192)chars+=String.fromCharCode(...bytes.subarray(i,i+8192));
 return btoa(chars);
}
function decode(content){
 const raw=atob(content.replace(/\s+/g,""));
 return new TextDecoder().decode(Uint8Array.from(raw,ch=>ch.charCodeAt(0)));
}
async function github(method,path,body){
 if(!token)throw Error("Please reconnect to GitHub.");
 const response=await fetch(API+path+(method==="GET"?"?ref="+encodeURIComponent(BRANCH):""),{
    method,headers:{"Authorization":"Bearer "+token,"Accept":"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28",...(body?{"Content-Type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})
 });
 if(!response.ok){
   let extra="";try{const payload=await response.json();extra=payload.message||"";}catch{}
   if(response.status===401||response.status===403)throw Error("GitHub access denied. Check that your token can access this repository with Contents: Read and write. "+extra);
   if(response.status===409)throw Error("Your file changed in GitHub. Refresh and reconnect to avoid overwriting someone else's changes.");
   throw Error("GitHub request failed ("+response.status+"). "+extra);
 }
 return response.json();
}
async function signIn(event){
 event.preventDefault();
 token=$("#token").value.trim();
 if(!token)return;
 const btn=$("#login-form button");btn.disabled=true;
 status("Connecting securely to GitHub…",false,"#login-status");
 try{
   const item=await github("GET",DOC);
   sha=item.sha;data=JSON.parse(decode(item.content));
   if(!data.settings)throw Error("Content settings unavailable; please reload the page.");
   $("#login").hidden=true;$("#dashboard").hidden=false;$("#signout").hidden=false;
   $("#token").value="";
   active="builder";markClean();render();status("Connected. Choose a section to begin.");
 }catch(err){token="";status(err.message,true,"#login-status");}
 finally{btn.disabled=false;}
}
function signOut(){
 token="";sha="";data=null;dirty=false;
 $("#dashboard").hidden=true;$("#login").hidden=false;$("#signout").hidden=true;$("#token").value="";
 status("",false,"#login-status");
}
async function publish(){
 if(!dirty||busy||!data)return;
 busy=true;$("#publish").disabled=true;
 status("Publishing changes to GitHub…");
 try{
   const json=JSON.stringify(data,null,2)+"\n";
   const result=await github("PUT",DOC,{message:"Edit K Cabinetry website content via Content Studio",content:encode(json),branch:BRANCH,sha});
   sha=result.content.sha;markClean();status("Published successfully. Refresh the website to see your updates; hosting caches can take a few minutes.");
 }catch(err){status(err.message,true);$("#publish").disabled=false;}
 finally{busy=false;if(dirty)$("#publish").disabled=false;}
}
function editList(event){
 const button=event.target.closest("[data-action]");if(!button)return;
 const schema=schemas[active];if(!schema?.arrayPath)return;
 const items=getValue(schema.arrayPath);
 if(!Array.isArray(items))return;
 const action=button.dataset.action,i=Number(button.dataset.index);
 if(action==="add"){
   const record=Object.fromEntries(schema.fields.map(([key])=>[key,""]));
   if(active==="products")record.id="collection-"+Date.now();
   if(active==="navigation"){record.page="home";record.visible=true;}
   if(active==="benefits"||active==="steps")record.number=String(items.length+1).padStart(2,"0");
   items.push(record);
 }else if(action==="delete"){
   if(!confirm("Remove this item from the website? You can still cancel by not publishing."))return;
   items.splice(i,1);
 }else if(action==="up"&&i>0){[items[i-1],items[i]]=[items[i],items[i-1]];}
 else if(action==="down"&&i<items.length-1){[items[i],items[i+1]]=[items[i+1],items[i]];}
 else return;
 markDirty();render();updatePreview();
}
async function uploadImage(path){
 const picker=document.createElement("input");picker.type="file";picker.accept="image/png,image/jpeg,image/webp,image/avif,image/gif";
 picker.addEventListener("change",async()=>{
   const file=picker.files?.[0];if(!file)return;
   const allowed=["image/png","image/jpeg","image/webp","image/avif","image/gif"];
   if(!allowed.includes(file.type)){status("Upload a JPG, PNG, WebP, AVIF or GIF file.",true);return;}
   if(file.size>4*1024*1024){status("Image is larger than 4 MB. Please resize it first.",true);return;}
   const button=Array.from(document.querySelectorAll("[data-upload]")).find(b=>b.dataset.upload===path);
   if(button)button.disabled=true;
   status("Uploading image to GitHub…");
   try{
     const reader=new FileReader();
     const base64=await new Promise((resolve,reject)=>{
       reader.onload=()=>resolve(String(reader.result).split(",")[1]);
       reader.onerror=()=>reject(Error("Could not read image."));reader.readAsDataURL(file);
     });
     const basename=file.name.replace(/\.[^.]+$/,"").toLowerCase().replace(/[^a-z0-9-]+/g,"-").slice(0,55).replace(/^-|-$/g,"")||"photo";
     const extension={"image/png":"png","image/jpeg":"jpg","image/webp":"webp","image/avif":"avif","image/gif":"gif"}[file.type];
     const filename=Date.now()+"-"+basename+"."+extension;
     await github("PUT",FOLDER+"/media/"+filename,{message:"Upload K Cabinetry website photo: "+basename,content:base64,branch:BRANCH});
     putValue(path,"media/"+filename);render();
     status("Photo uploaded. Click Publish changes to add the new image to your website content.");
   }catch(err){status("Upload failed: "+err.message,true);}
   finally{if(button)button.disabled=false;}
 });
 picker.click();
}
$("#login-form").addEventListener("submit",signIn);
$("#signout").addEventListener("click",()=>{if(dirty&&!confirm("Discard changes not yet published?"))return;signOut();});
$("#publish").addEventListener("click",publish);
$("#editor-nav").addEventListener("click",event=>{
 const target=event.target.closest("[data-tab]");
 if(target){active=target.dataset.tab;render();}
});
$("#editor").addEventListener("change",event=>{
 const box=event.target.closest("[data-block-visible]");
 if(box && active==="builder"){putValue("settings.sections."+box.dataset.blockVisible,box.checked);}
 const custom=event.target.closest("[data-custom-visible]");
 if(custom&&active==="builder"){const idx=data.settings.customBlocks.findIndex(b=>b.id===custom.dataset.customVisible);if(idx>=0)putValue("settings.customBlocks."+idx+".visible",custom.checked);}
});
$("#editor").addEventListener("dragstart",event=>{
 const card=event.target.closest("[data-block]");if(!card)return;
 draggedId=card.dataset.block;event.dataTransfer.effectAllowed="move";event.dataTransfer.setData("text/plain",draggedId);
});
$("#editor").addEventListener("dragover",event=>{if(event.target.closest("[data-block]")){event.preventDefault();event.dataTransfer.dropEffect="move";}});
$("#editor").addEventListener("drop",event=>{
 const target=event.target.closest("[data-block]");if(target&&draggedId){event.preventDefault();orderChange(draggedId,target.dataset.block);}draggedId=null;
});
$("#editor").addEventListener("dragend",()=>{draggedId=null;});
$("#editor").addEventListener("input",event=>{
 const el=event.target.closest("[data-path]");
 if(el)putValue(el.dataset.path,el.type==="checkbox"?el.checked:el.value);
});
$("#editor").addEventListener("change",event=>{
 const el=event.target.closest("[data-path]");
 if(el&&/\.(image|logo)$/.test(el.dataset.path))render();
});
$("#editor").addEventListener("click",event=>{
 if(active==="builder")builderClick(event);
 const upload=event.target.closest("[data-upload]");
 if(upload){uploadImage(upload.dataset.upload);return;}
 editList(event);
});
window.addEventListener("beforeunload",e=>{if(dirty){e.preventDefault();e.returnValue="";}});
})();