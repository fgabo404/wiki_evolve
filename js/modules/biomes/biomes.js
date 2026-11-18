"use strict";globalThis.EvolveBiomesView=function(index,router,resources){const $=id=>document.getElementById(id);let lang="es",query="",current=router.current(),sectionExpanded=true;const name=o=>o?.[lang]??o?.es??o?.en??"";const tr=(a,b)=>lang==="es"?a:b;const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n};function render(){const isResources=current.page==="resources";const b=index.parent(current.biomeId)||index.biomes[0];$("title").textContent=isResources?tr("Recursos","Resources"):name(b.name);$("subtitle").textContent=isResources?tr("Catálogo de minerales","Minerals catalog"):tr("Subbiomas y requisitos de aparición","Subbiomes and spawn requirements");const nav=$("categories");nav.replaceChildren();
    const section=nav.appendChild(el("div","wiki-nav-section"));
    const heading=section.appendChild(el("button","wiki-nav-heading"));
    heading.type="button";heading.setAttribute("aria-expanded",String(sectionExpanded));
    heading.appendChild(el("span","",tr("Biomas","Biomes")));
    heading.appendChild(el("span","nav-chevron"+(sectionExpanded?" expanded":""),"▸"));
    heading.onclick=()=>{sectionExpanded=!sectionExpanded;render()};
    if(sectionExpanded){
      const tree=section.appendChild(el("div","wiki-biome-tree"));
      for(const biome of index.biomes){
        const btn=tree.appendChild(el("button","navbtn wiki-biome-btn"+(biome.id===b.id?" active":"")));
        btn.type="button";btn.textContent=name(biome.name);
        btn.onclick=()=>router.go(biome.id);
      }
    }
    const resourceButton=nav.appendChild(el("button","wiki-nav-heading wiki-resources-nav"+(isResources?" active":""),tr("Recursos","Resources")));resourceButton.type="button";resourceButton.onclick=()=>router.goResources();
    const crumbs=$("breadcrumbs");crumbs.replaceChildren();
    if(isResources){
      $("back").hidden=true;
      crumbs.appendChild(el("span","crumb-current",tr("Recursos / Minerales","Resources / Minerals")));
      $("distribution").replaceChildren();$("distribution").hidden=true;
      const result=globalThis.EvolveResourcesView.render($("list"),$("detail"),resources,lang,query,current.mineralId,id=>router.goResources(id));
      $("count").textContent=result.shown+" / "+result.total;
      return;
    }
    $("distribution").hidden=false;$("back").hidden=!current.subbiomeId;$("back").onclick=()=>router.go(b.id);if(current.subbiomeId){const p=crumbs.appendChild(el("button","crumb-link",name(b.name)));p.onclick=()=>router.go(b.id);crumbs.appendChild(el("span","crumb-separator","/"));crumbs.appendChild(el("span","crumb-current",name(index.subbiome(current.subbiomeId).name)));}else crumbs.appendChild(el("span","crumb-current",name(b.name)));const distribution=$("distribution");globalThis.EvolveBiomeDistributionChart.render(distribution,b,lang);const list=$("list");list.replaceChildren();const rows=index.children(b.id).filter(s=>(name(s.name)+" "+s.id).toLowerCase().includes(query.toLowerCase()));$("count").textContent=rows.length+" / "+index.children(b.id).length;for(const sub of rows){const btn=list.appendChild(el("button","item"+(sub.id===current.subbiomeId?" active":"")));btn.type="button";btn.appendChild(el("strong","",name(sub.name)));btn.appendChild(el("small","",sub.id));btn.onclick=()=>router.go(b.id,sub.id);}const area=$("detail");if(current.subbiomeId){const sub=index.subbiome(current.subbiomeId);globalThis.EvolveBiomeDetail.render(area,sub,lang);globalThis.EvolveBiomeExtras.render(area,sub,resources,lang,id=>router.goResources(id));}else{area.replaceChildren();area.appendChild(el("h2","",name(b.name)));area.appendChild(el("p","muted",tr("Selecciona un subbioma para ver su definición.","Select a subbiome to view its definition.")));area.appendChild(el("p","biome-stats",tr("Subbiomas con reglas declarativas: ","Subbiomes with draft rules: ")+index.children(b.id).filter(s=>s.spawn).length+" / "+index.children(b.id).length));}}$("search").addEventListener("input",e=>{query=e.target.value;render()});$("language").addEventListener("change",e=>{lang=e.target.value;document.documentElement.lang=lang;render()});return {show:route=>{current=route;render();}};};