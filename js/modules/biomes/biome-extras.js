"use strict";
globalThis.EvolveBiomeExtras={
 render(root,sub,resources,lang,goMineral){
  const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);return n};
  const t=(es,en)=>lang==="en"?en:es;
  const range=x=>x?.min!=null&&x?.max!=null?x.min+" – "+x.max:"—";
  const minerals=sub.minerales||[],fauna=sub.fauna||[];
  if(!minerals.length&&!fauna.length)return;
  root.appendChild(el("h3","extra-heading",t("Recursos y fauna","Resources and fauna")));
  if(minerals.length){
   const sec=root.appendChild(el("section","extra-section"));sec.appendChild(el("h4","",t("Minerales y yacimientos","Minerals and deposits")+" ("+minerals.length+")"));
   const list=sec.appendChild(el("div","extra-list")),lookup=new Map((resources?.minerals||[]).map(m=>[m.id,m]));
   for(const item of minerals){
    const m=lookup.get(item.id),card=list.appendChild(el("article","extra-record"));
    const name=m?.name?.[lang]??m?.name?.es??m?.id??item.id;
    const title=card.appendChild(el(m?"button":"strong",m?"extra-link":"extra-record-title",name));
    if(m){title.type="button";title.onclick=()=>goMineral(item.id)}
    const description=m?.description?.[lang]??m?.description?.es;
    if(description)card.appendChild(el("p","extra-description",description));
    if(item.spawn){
     const stats=card.appendChild(el("div","extra-stats")),s=item.spawn;
     stats.appendChild(el("span","",t("Yacimientos","Deposits")+": "+range(s)));
     if(s.surface){stats.appendChild(el("span","",t("Afloramiento","Outcrop")+": "+(s.surface.outcrop?t("Sí","Yes"):t("No","No"))));stats.appendChild(el("span","",t("Cantidad superficial","Surface count")+": "+range(s.surface)))}
     if(s.underground)stats.appendChild(el("span","",t("Profundidad (niveles)","Depth (levels)")+": "+range(s.underground)));
    }
   }
  }
  if(fauna.length){
   const sec=root.appendChild(el("section","extra-section"));sec.appendChild(el("h4","",t("Fauna","Fauna")+" ("+fauna.length+")"));
   const list=sec.appendChild(el("div","extra-list"));
   const social={solitary:[ "Solitario","Solitary"],pair:["Pareja","Pair"],group:["Grupo","Group"],herd:["Manada","Herd"],school:["Cardumen","School"],colony:["Colonia","Colony"],swarm:["Enjambre","Swarm"]};
   for(const a of fauna){
    const card=list.appendChild(el("article","extra-record"));card.appendChild(el("strong","extra-record-title",a.id));
    if(a.spawn){
     const stats=card.appendChild(el("div","extra-stats"));stats.appendChild(el("span","",t("Apariciones","Spawns")+": "+range(a.spawn)));
     if(a.spawn.socialMode)stats.appendChild(el("span","",t("Comportamiento","Behavior")+": "+(social[a.spawn.socialMode]?.[lang==="en"?1:0]??a.spawn.socialMode)));
     if(a.spawn.groupSize)stats.appendChild(el("span","",t("Tamaño de grupo","Group size")+": "+range(a.spawn.groupSize)));
    }
   }
  }
 }
};
