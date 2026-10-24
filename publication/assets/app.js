"use strict";
document.addEventListener("DOMContentLoaded",function(){
  const menu=document.querySelector(".menu-toggle");
  const nav=document.getElementById("site-nav");
  if(menu&&nav){
    function closeMenu(){nav.classList.remove("is-open");menu.setAttribute("aria-expanded","false");menu.setAttribute("aria-label","Open navigation")}
    menu.addEventListener("click",function(){const opened=nav.classList.toggle("is-open");menu.setAttribute("aria-expanded",String(opened));menu.setAttribute("aria-label",opened?"Close navigation":"Open navigation")});
    nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",closeMenu)});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenu()});
    document.addEventListener("click",function(e){if(!nav.contains(e.target)&&!menu.contains(e.target))closeMenu()});
  }
  const year=document.getElementById("year");
  if(year)year.textContent=String(new Date().getFullYear());
  const filters=Array.from(document.querySelectorAll(".filter-button"));
  const cards=Array.from(document.querySelectorAll(".project-card[data-category]"));
  const status=document.getElementById("filter-status");
  filters.forEach(function(button){button.addEventListener("click",function(){
    const category=button.dataset.filter;
    let visible=0;
    filters.forEach(function(b){const active=b===button;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active))});
    cards.forEach(function(card){const show=category==="all"||card.dataset.category===category;card.hidden=!show;if(show)visible++});
    if(status)status.textContent=category==="all"?"Showing all "+visible+" projects.":"Showing "+visible+" "+category+" project"+(visible===1?".":"s.");
  })});
});


/* Progressive, accessible journal search. Editorial pages and feed remain standalone. */
(function(){
  "use strict";
  const input=document.querySelector("[data-article-search]");
  const cards=Array.from(document.querySelectorAll("[data-article-card]"));
  const filters=Array.from(document.querySelectorAll("[data-category-filter]"));
  const count=document.getElementById("article-count");
  const empty=document.getElementById("empty-state");
  let category="all";
  function update(){
    const query=(input?.value||"").trim().toLocaleLowerCase();
    let shown=0;
    for(const card of cards){
      const matches=(category==="all"||card.dataset.category===category)&&((card.dataset.search||"")+" "+card.textContent).toLocaleLowerCase().includes(query);
      card.hidden=!matches;if(matches)shown++;
    }
    if(count)count.textContent=shown+" article"+(shown===1?"":"s")+" available";
    if(empty){empty.hidden=shown!==0;empty.setAttribute("aria-hidden",String(shown!==0));}
  }
  for(const filter of filters)filter.addEventListener("click",function(){
    category=this.dataset.categoryFilter;
    for(const button of filters){const active=button===this;button.classList.toggle("is-active",active);button.setAttribute("aria-pressed",String(active));}
    update();
  });
  input?.addEventListener("input",update);
  update();
})();


/* Display each original-resolution JPEG at its natural aspect ratio when available.
   Until publication, retain the local gallery fallback without a broken-image icon. */
(function(){
  "use strict";
  function loadOriginalWorkflowImages(){
    for(const frame of document.querySelectorAll(".workflow-image[data-photo-path]")){
      const src=frame.getAttribute("data-photo-path");
      const photo=new Image();
      photo.onload=function(){
        frame.appendChild(photo);
        frame.classList.add("has-original");
        frame.removeAttribute("role");
        frame.removeAttribute("aria-label");
      };
      photo.alt=frame.getAttribute("aria-label")||"Software delivery workflow";
      photo.loading="eager";
      photo.decoding="async";
      photo.src=src;
    }
  }
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",loadOriginalWorkflowImages,{once:true});
  }else{
    loadOriginalWorkflowImages();
  }
})();
