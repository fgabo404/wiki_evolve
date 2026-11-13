"use strict";
globalThis.EvolveBiomeDistributionChart = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const colors = ["#16a085","#5b82cd","#e5a23e","#805ad5","#d4637e","#3a9b8a","#9c764a","#618bca","#d18354"];
  const words = {
    es: {
      title: "Distribución de subbiomas — Latitud y altura",
      marineTitle: "Distribución de subbiomas — Latitud y profundidad",
      subtitle: "Distribución ambiental de referencia",
      all: "Todos los subbiomas",
      select: "Destacar subbioma",
      latitude: "Latitud absoluta (°)",
      elevation: "Altura de Evolve (0–100)",
      depth: "Profundidad del agua (m)",
      lat: "Latitud preferida",
      height: "Altura requerida",
      depthRange: "Profundidad requerida",
      pending: "Distribución pendiente de definición.",
      missing: "Subbiomas pendientes de definición",
      note: "Las áreas representan la altura requerida y la latitud preferida de cada subbioma. Las zonas superpuestas pueden corresponder a varios subbiomas; el clima y las demás condiciones de generación determinan cuál aparece.",
      marineNote: "Las áreas representan profundidad requerida (metros) y latitud preferida. La profundidad aumenta hacia abajo; con océano profundo se amplía el tramo de 0–50 m y se comprime el de 50 m al fondo, por lo que el eje no es lineal. Salinidad y temperatura ayudan a determinar dónde aparece cada subbioma."
    },
    en: {
      title: "Subbiome distribution — Latitude and elevation",
      marineTitle: "Subbiome distribution — Latitude and depth",
      subtitle: "Reference environmental distribution",
      all: "All subbiomes",
      select: "Highlight subbiome",
      latitude: "Absolute latitude (°)",
      elevation: "Evolve elevation (0–100)",
      depth: "Water depth (m)",
      lat: "Preferred latitude",
      height: "Required elevation",
      depthRange: "Required depth",
      pending: "Distribution pending definition.",
      missing: "Subbiomes pending definition",
      note: "Areas represent the required elevation and preferred latitude of each subbiome. Overlapping zones may correspond to multiple subbiomes; climate and other generation conditions determine which one appears.",
      marineNote: "Areas represent required depth (meters) and preferred latitude. Depth increases downward; when deep ocean is present, the 0–50 m zone is expanded and the 50 m-to-bottom zone compressed, so the vertical axis is not linear. Salinity and temperature help determine where each subbiome may occur."
    }
  };
  function validRange(range, min, max) {
    return range && Number.isFinite(range.min) && Number.isFinite(range.max)
      && range.min >= min && range.max <= max && range.min <= range.max;
  }
  function getData(biome) {
    const defined = [], pending = [];
    const marine = biome?.id === "marine";
    for (const sub of biome.subbiomes || []) {
      const vertical = marine ? sub.spawn?.required?.waterDepthMeters : sub.spawn?.required?.elevationLevel;
      const latitude = sub.spawn?.preferred?.absoluteLatitudeDegrees;
      if (validRange(vertical, 0, marine ? 11000 : 100) && validRange(latitude, 0, 90)) {
        const item = {id:sub.id, name:sub.name, latitude:{min:latitude.min,max:latitude.max}};
        item[marine ? "depth" : "elevation"] = {min:vertical.min,max:vertical.max};
        defined.push(item);
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
    // Polo mixes floating Arctic sea ice and continental Antarctic ice.
    // Render them in separate existing charts: metres of water depth vs Evolve 0–100 elevation.
    if(biome?.id==="polar"){
      host.replaceChildren();
      const sections=[
        {id:"marine",name:lang==="en"?"North Pole":"Polo Norte",subbiomes:(biome.subbiomes||[]).filter(s=>s.id==="polar_north_ice")},
        {id:"polar_land",name:lang==="en"?"South Pole":"Polo Sur",subbiomes:(biome.subbiomes||[]).filter(s=>s.id==="polar_south_ice")}
      ];
      const combined={defined:[],pending:[]};
      for(const part of sections){
        const wrapper=host.appendChild(node("section","polar-distribution-section"));
        wrapper.appendChild(node("h3","",part.name));
        const drawing=wrapper.appendChild(node("div",""));
        const result=render(drawing,part,lang);
        combined.defined.push(...result.defined);
        combined.pending.push(...result.pending);
      }
      return combined;
    }
    const t=words[lang]||words.es;
    const name=obj=>obj?.[lang]??obj?.es??obj?.en??"";
    const data=getData(biome);
    const marine=biome?.id==="marine";
    const maximum=marine?Math.max(50,...data.defined.map(x=>x.depth.max)):100;
    const deepMarine=marine&&maximum>50;
    const vertical=x=>marine?x.depth:x.elevation;
    host.replaceChildren();
    const section=host.appendChild(node("section","biome-distribution"));
    section.appendChild(node("h2","distribution-title",marine?t.marineTitle:t.title));
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
    const svg=svgNode("svg",{viewBox:"0 0 840 455",role:"img","aria-label":marine?t.marineTitle:t.title,"preserveAspectRatio":"xMidYMid meet"});
    chart.appendChild(svg);
    const x0=88,y0=26,w=710,h=340;
    const px=v=>x0+v/90*w;
    // When deep-sea ranges are present, reserve 40% of the plot for 0–50 m.
    // This retains visible reef and mangrove areas while still displaying 0–11,000 m.
    const py=v=>!marine?y0+(100-v)/100*h:
      deepMarine?y0+(v<=50?(v/50)*.4:(.4+(v-50)/(maximum-50)*.6))*h:
      y0+v/maximum*h;
    appendSvg(svg,"rect",{x:x0,y:y0,width:w,height:h,fill:"#f8fbff",stroke:"#d6e2ef"});
    for(let x=0;x<=90;x+=15){
      appendSvg(svg,"line",{x1:px(x),y1:y0,x2:px(x),y2:y0+h,stroke:"#dce7f3","stroke-width":1});
      appendSvg(svg,"text",{x:px(x),y:y0+h+22,"text-anchor":"middle",class:"distribution-tick"},x+"°");
    }
    const ticks=deepMarine?[0,10,25,50,2000,6000,maximum]:Array.from({length:6},(_,i)=>maximum*i/5);
    for(const y of [...new Set(ticks)]){
      appendSvg(svg,"line",{x1:x0,y1:py(y),x2:x0+w,y2:py(y),stroke:deepMarine&&y===50?"#8294aa":"#dce7f3","stroke-width":deepMarine&&y===50?2:1,"stroke-dasharray":deepMarine&&y===50?"5 4":"none"});
      appendSvg(svg,"text",{x:x0-12,y:py(y)+4,"text-anchor":"end",class:"distribution-tick"},format(y,lang));
    }
    const layer=appendSvg(svg,"g",{"aria-label":t.subtitle});
    appendSvg(svg,"text",{x:x0+w/2,y:433,"text-anchor":"middle",class:"distribution-axis"},t.latitude);
    appendSvg(svg,"text",{transform:"translate(23 "+(y0+h/2)+") rotate(-90)","text-anchor":"middle",class:"distribution-axis"},marine?t.depth:t.elevation);
    const legend=section.appendChild(node("div","distribution-legend"));
    const rects=new Map(),buttons=new Map();
    for(let i=0;i<data.defined.length;i++){
      const sub=data.defined[i],color=colors[i%colors.length],range=vertical(sub);
      const rect=svgNode("rect",{
        x:px(sub.latitude.min),y:py(marine?range.min:range.max),
        width:Math.max(1,px(sub.latitude.max)-px(sub.latitude.min)),
        height:Math.max(1,Math.abs(py(range.min)-py(range.max))),
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
      text.appendChild(node("small","",t.lat+": "+format(sub.latitude.min,lang)+"–"+format(sub.latitude.max,lang)+"° · "+(marine?t.depthRange:t.height)+": "+format(range.min,lang)+"–"+format(range.max,lang)+(marine?" m":"")));
      entry.addEventListener("click",()=>highlight(sub.id));
      buttons.set(sub.id,entry);
    }
    // Paint the largest ranges first so shallow coastal habitats remain visible.
    const paintOrder=[...data.defined].sort((a,b)=>{
      const area=s=>(s.latitude.max-s.latitude.min)*(py(vertical(s).max)-py(vertical(s).min));
      return area(b)-area(a);
    });
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
      for(const sub of paintOrder)if(sub.id!==id)layer.appendChild(rects.get(sub.id));
      if(id)layer.appendChild(rects.get(id));
    }
    select.addEventListener("change",()=>highlight(select.value));
    highlight("");
    if(data.pending.length)section.appendChild(node("p","distribution-missing",t.missing+": "+data.pending.map(x=>name(x.name)).join(", ")));
    section.appendChild(node("p","distribution-note",marine?t.marineNote:t.note));
    return data;
  }
  return {getData,render};
})();
