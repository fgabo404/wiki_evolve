"use strict";
globalThis.EvolveResourcesView={
 render(list,detail,resources,lang,query,selectedId,onSelect){
  const el=(tag,klass,text)=>{const n=document.createElement(tag);if(klass)n.className=klass;if(text!==undefined)n.textContent=String(text);return n};
  const name=x=>x?.name?.[lang]??x?.name?.es??x?.name?.en??x?.id??"";
  const minerals=resources?.minerals||[];
  const matching=minerals.filter(m=>(name(m)+" "+m.id+" "+(m.description?.[lang]??m.description?.es??"")).toLowerCase().includes(query.toLowerCase()));
  list.replaceChildren();
  for(const m of matching){
   const btn=list.appendChild(el("button","item"+(m.id===selectedId?" active":"")));
   btn.type="button";btn.appendChild(el("strong","",name(m)));btn.appendChild(el("small","",m.id));btn.onclick=()=>onSelect(m.id);
  }
  detail.replaceChildren();
  const selected=minerals.find(m=>m.id===selectedId);
  if(selected){
   detail.appendChild(el("h2","",name(selected)));detail.appendChild(el("div","code",selected.id));
   const d=selected.description?.[lang]??selected.description?.es??selected.description?.en;
   if(d)detail.appendChild(el("p","biome-description",d));
  }else{
   detail.appendChild(el("h2","",lang==="en"?"Minerals":"Minerales"));
   detail.appendChild(el("p","muted",lang==="en"?"Select a mineral to see its definition.":"Selecciona un mineral para ver su definición."));
  }
  return {shown:matching.length,total:minerals.length};
 }
};
