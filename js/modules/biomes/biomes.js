"use strict";globalThis.EvolveBiomesView=function(index,router){const $=id=>document.getElementById(id);let lang="es",query="",current=router.current(),sectionExpanded=true,expandedBiomeId=current.biomeId;const name=o=>o?.[lang]??o?.es??o?.en??"";const tr=(a,b)=>lang==="es"?a:b;const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n};function render(){const b=index.parent(current.biomeId)||index.biomes[0];$("title").textContent=name(b.name);$("subtitle").textContent=tr("Subbiomas y requisitos de aparición","Subbiomes and spawn requirements");const nav=$("categories");nav.replaceChildren();
    const section=nav.appendChild(el("div","wiki-nav-section"));
    const heading=section.appendChild(el("button","wiki-nav-heading"));
    heading.type="button";heading.setAttribute("aria-expanded",String(sectionExpanded));
    heading.appendChild(el("span","",tr("Biomas","Biomes")));
    heading.appendChild(el("span","nav-chevron"+(sectionExpanded?" expanded":""),"▸"));
    heading.onclick=()=>{sectionExpanded=!sectionExpanded;render()};
    if(sectionExpanded){
      const tree=section.appendChild(el("div","wiki-biome-tree"));
      for(const biome of index.biomes){
        const item=tree.appendChild(el("div","wiki-biome-group"));
        const expanded=expandedBiomeId===biome.id;
        const btn=item.appendChild(el("button","navbtn wiki-biome-btn"+(biome.id===b.id?" active":"")));
        btn.type="button";btn.setAttribute("aria-expanded",String(expanded));
        btn.appendChild(el("span","",name(biome.name)));
        btn.appendChild(el("span","nav-chevron"+(expanded?" expanded":""),"▸"));
        btn.onclick=()=>{
          expandedBiomeId=expanded?null:biome.id;
          if(biome.id!==current.biomeId || current.subbiomeId)router.go(biome.id);
          else render();
        };
        if(expanded){
          const children=item.appendChild(el("div","wiki-subbiome-tree"));
          for(const sub of index.children(biome.id)){
            const subBtn=children.appendChild(el("button","navbtn wiki-subbiome-btn"+(current.subbiomeId===sub.id?" active":"")));
            subBtn.type="button";subBtn.textContent=name(sub.name);
            if(current.subbiomeId===sub.id)subBtn.setAttribute("aria-current","page");
            subBtn.onclick=()=>router.go(biome.id,sub.id);
          }
        }
      }
    }const crumbs=$("breadcrumbs");crumbs.replaceChildren();$("back").hidden=!current.subbiomeId;$("back").onclick=()=>router.go(b.id);if(current.subbiomeId){const p=crumbs.appendChild(el("button","crumb-link",name(b.name)));p.onclick=()=>router.go(b.id);crumbs.appendChild(el("span","crumb-separator","/"));crumbs.appendChild(el("span","crumb-current",name(index.subbiome(current.subbiomeId).name)));}else crumbs.appendChild(el("span","crumb-current",name(b.name)));const list=$("list");list.replaceChildren();const rows=index.children(b.id).filter(s=>(name(s.name)+" "+s.id).toLowerCase().includes(query.toLowerCase()));$("count").textContent=rows.length+" / "+index.children(b.id).length;for(const sub of rows){const btn=list.appendChild(el("button","item"+(sub.id===current.subbiomeId?" active":"")));btn.type="button";btn.appendChild(el("strong","",name(sub.name)));btn.appendChild(el("small","",sub.id));btn.onclick=()=>router.go(b.id,sub.id);}const area=$("detail");if(current.subbiomeId)globalThis.EvolveBiomeDetail.render(area,index.subbiome(current.subbiomeId),lang);else{area.replaceChildren();area.appendChild(el("h2","",name(b.name)));area.appendChild(el("p","muted",tr("Selecciona un subbioma para ver su definición.","Select a subbiome to view its definition.")));area.appendChild(el("p","biome-stats",tr("Subbiomas con reglas declarativas: ","Subbiomes with draft rules: ")+index.children(b.id).filter(s=>s.spawn).length+" / "+index.children(b.id).length));}}$("search").addEventListener("input",e=>{query=e.target.value;render()});$("language").addEventListener("change",e=>{lang=e.target.value;document.documentElement.lang=lang;render()});return {show:route=>{current=route;if(route.subbiomeId)expandedBiomeId=route.biomeId;render();}};};