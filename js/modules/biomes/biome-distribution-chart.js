"use strict";
globalThis.EvolveBiomeDistributionChart = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const colors = ["#16a085","#5b82cd","#e5a23e","#805ad5","#d4637e","#3a9b8a","#9c764a","#618bca","#d18354"];
  const words = {
    es: {
      title: "Distribución de subbiomas — Latitud y altura",
      subtitle: "Distribución ambiental de referencia",
      all: "Todos los subbiomas",
      select: "Destacar subbioma",
      latitude: "Latitud absoluta (°)",
      elevation: "Altura de Evolve (0–100)",
      lat: "Latitud preferida",
      height: "Altura requerida",
      pending: "Distribución pendiente de definición.",
      missing: "Subbiomas pendientes de definición",
      note: "Las áreas representan la altura requerida y la latitud preferida de cada subbioma. Las zonas superpuestas pueden corresponder a varios subbiomas; el clima y las demás condiciones de generación determinan cuál aparece."
    },
    en: {
      title: "Subbiome distribution — Latitude and elevation",
      subtitle: "Reference environmental distribution",
      all: "All subbiomes",
      select: "Highlight subbiome",
      latitude: "Absolute latitude (°)",
      elevation: "Evolve elevation (0–100)",
      lat: "Preferred latitude",
      height: "Required elevation",
      pending: "Distribution pending definition.",
      missing: "Subbiomes pending definition",
      note: "Areas represent the required elevation and preferred latitude of each subbiome. Overlapping zones may correspond to multiple subbiomes; climate and other generation conditions determine which one appears."
    }
  };
  function validRange(range, min, max) {
    return range && Number.isFinite(range.min) && Number.isFinite(range.max)
      && range.min >= min && range.max <= max && range.min <= range.max;
  }
  function getData(biome) {
    const defined = [], pending = [];
    for (const sub of biome.subbiomes || []) {
      const elevation = sub.spawn?.required?.elevationLevel;
      const latitude = sub.spawn?.preferred?.absoluteLatitudeDegrees;
      if (validRange(elevation, 0, 100) && validRange(latitude, 0, 90)) {
        defined.push({id:sub.id, name:sub.name, latitude:{min:latitude.min,max:latitude.max}, elevation:{min:elevation.min,max:elevation.max}});
      } else pending.push({id:sub.id,name:sub.name});
    }
    return {defined,pending};
  }
  function node(tag,cls,text) {
    const item=document.createElement(tag);
    if(cls)item.className=cls;
    if(text!==undefined)item.textContent=String(text);
    return item;
  }
  function svgNode(tag,attributes,text) {
    const item=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attributes||{}))item.setAttribute(key,String(value));
    if(text!==undefined)item.textContent=String(text);
    return item;
  }
  function appendSvg(parent,tag,attributes,text) {
    const item=svgNode(tag,attributes,text);parent.appendChild(item);return item;
  }
  function format(value,lang) {
    return new Intl.NumberFormat(lang==="en"?"en-US":"es-ES",{maximumFractionDigits:2}).format(value);
  }
  function render(host,biome,lang="es") {
    const t=words[lang]||words.es;
    const name=obj=>obj?.[lang]??obj?.es??obj?.en??"";
    const data=getData(biome);
    host.replaceChildren();
    const section=host.appendChild(node("section","biome-distribution"));
    section.appendChild(node("h2","distribution-title",t.title));
    section.appendChild(node("p","distribution-subtitle",t.subtitle));
    if(!data.defined.length){
      section.appendChild(node("p","distribution-pending",t.pending));
      if(data.pending.length)section.appendChild(node("p","distribution-missing",t.missing+": "+data.pending.map(x=>name(x.name)).join(", ")));
      return data;
    }
    const tools=section.appendChild(node("div","distribution-toolbar"));
    const label=tools.appendChild(node("label","distribution-label",t.select));
    const select=label.appendChild(node("select","distribution-select"));
    select.setAttribute("aria-label",t.select);
    const all=select.appendChild(node("option","",t.all));all.value="";
    for(const sub of data.defined){
      const option=select.appendChild(node("option","",name(sub.name)));option.value=sub.id;
    }
    const chart=section.appendChild(node("div","distribution-chart"));
    const svg=svgNode("svg",{viewBox:"0 0 840 455",role:"img","aria-label":t.title,"preserveAspectRatio":"xMidYMid meet"});
    chart.appendChild(svg);
    const x0=88,y0=26,w=710,h=340;
    const px=v=>x0+v/90*w,py=v=>y0+(100-v)/100*h;
    appendSvg(svg,"rect",{x:x0,y:y0,width:w,height:h,fill:"#f8fbff",stroke:"#d6e2ef"});
    for(let x=0;x<=90;x+=15){
      appendSvg(svg,"line",{x1:px(x),y1:y0,x2:px(x),y2:y0+h,stroke:"#dce7f3","stroke-width":1});
      appendSvg(svg,"text",{x:px(x),y:y0+h+22,"text-anchor":"middle",class:"distribution-tick"},x+"°");
    }
    for(let y=0;y<=100;y+=20){
      appendSvg(svg,"line",{x1:x0,y1:py(y),x2:x0+w,y2:py(y),stroke:"#dce7f3","stroke-width":1});
      appendSvg(svg,"text",{x:x0-12,y:py(y)+4,"text-anchor":"end",class:"distribution-tick"},String(y));
    }
    const layer=appendSvg(svg,"g",{"aria-label":t.subtitle});
    appendSvg(svg,"text",{x:x0+w/2,y:433,"text-anchor":"middle",class:"distribution-axis"},t.latitude);
    appendSvg(svg,"text",{transform:"translate(23 "+(y0+h/2)+") rotate(-90)","text-anchor":"middle",class:"distribution-axis"},t.elevation);
    const legend=section.appendChild(node("div","distribution-legend"));
    const rects=new Map(),buttons=new Map();
    for(let i=0;i<data.defined.length;i++){
      const sub=data.defined[i],color=colors[i%colors.length];
      const rect=svgNode("rect",{
        x:px(sub.latitude.min),y:py(sub.elevation.max),
        width:Math.max(1,px(sub.latitude.max)-px(sub.latitude.min)),
        height:Math.max(1,py(sub.elevation.min)-py(sub.elevation.max)),
        fill:color,stroke:color,"stroke-width":1.5,rx:2,tabindex:0,role:"button",
        "aria-label":name(sub.name)
      });
      rect.appendChild(svgNode("title",{},name(sub.name)));
      rect.addEventListener("click",()=>highlight(sub.id));
      rect.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();highlight(sub.id);}});
      rects.set(sub.id,rect);
      const entry=legend.appendChild(node("button","distribution-legend-item"));
      entry.type="button";
      const swatch=entry.appendChild(node("span","distribution-swatch"));
      swatch.style.backgroundColor=color;
      const text=entry.appendChild(node("span","distribution-legend-copy"));
      text.appendChild(node("strong","",name(sub.name)));
      text.appendChild(node("small","",t.lat+": "+format(sub.latitude.min,lang)+"–"+format(sub.latitude.max,lang)+"° · "+t.height+": "+format(sub.elevation.min,lang)+"–"+format(sub.elevation.max,lang)));
      entry.addEventListener("click",()=>highlight(sub.id));
      buttons.set(sub.id,entry);
    }
    function highlight(id){
      select.value=id;
      for(const sub of data.defined){
        const rect=rects.get(sub.id),active=!id||id===sub.id;
        rect.setAttribute("fill-opacity",!id?.31:active?.65:.07);
        rect.setAttribute("stroke-opacity",!id?.85:active?1:.18);
        rect.setAttribute("stroke-width",id===sub.id?3:1.5);
        rect.setAttribute("aria-pressed",String(id===sub.id));
        buttons.get(sub.id).classList.toggle("selected",id===sub.id);
        buttons.get(sub.id).classList.toggle("dimmed",Boolean(id)&&id!==sub.id);
        buttons.get(sub.id).setAttribute("aria-pressed",String(id===sub.id));
      }
      // Draw the highlighted area last so it remains visible wherever ranges overlap.
      for(const sub of data.defined)if(sub.id!==id)layer.appendChild(rects.get(sub.id));
      if(id)layer.appendChild(rects.get(id));
    }
    select.addEventListener("change",()=>highlight(select.value));
    highlight("");
    if(data.pending.length)section.appendChild(node("p","distribution-missing",t.missing+": "+data.pending.map(x=>name(x.name)).join(", ")));
    section.appendChild(node("p","distribution-note",t.note));
    return data;
  }
  return {getData,render};
})();
