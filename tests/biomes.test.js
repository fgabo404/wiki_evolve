"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const catalog=JSON.parse(read("data/biomes/biomes.json"));
assert(Array.isArray(catalog.biomes),"biomes.json debe contener biomes[]");
const allSubbiomes=catalog.biomes.flatMap(biome=>biome.subbiomes);
const forest=catalog.biomes.find(b=>b.id==="forest");
assert.equal(catalog.biomes.length,8,"deben conservarse ocho biomas");
assert.equal(allSubbiomes.length,23,"deben existir 23 subbiomas");
assert(forest,"falta Bosque");
assert.deepEqual(forest.subbiomes.map(x=>x.id),["forest_tropical","forest_cloud","forest_temperate","forest_boreal","forest_subalpine","forest_redwood","forest_wooded_swamp"]);
assert(!allSubbiomes.some(x=>x.id==="forest_subtropical"),"Bosque subtropical no debe reaparecer");
for(const sub of forest.subbiomes){
  assert.equal(typeof sub.description?.es,"string","falta descripción en español: "+sub.id);
  assert.equal(typeof sub.description?.en,"string","falta descripción en inglés: "+sub.id);
  assert(sub.description.es.trim()&&sub.description.en.trim(),"descripción vacía: "+sub.id);
  assert(sub.spawn?.required&&Object.keys(sub.spawn.required).length,"spawn.required incompleto: "+sub.id);
  assert(sub.spawn?.preferred&&Object.keys(sub.spawn.preferred).length,"spawn.preferred incompleto: "+sub.id);
}
assert.equal(allSubbiomes.filter(x=>x.description).length,7,"solo los 7 bosques revisados tienen descripción");
const temperate=forest.subbiomes.find(x=>x.id==="forest_temperate");
assert(temperate.description.es.includes("Europa central y occidental"),"bosque templado requiere referencia europea");
assert(temperate.description.en.includes("Central and Western Europe"),"falta descripción inglesa de la referencia europea");
const boreal=forest.subbiomes.find(x=>x.id==="forest_boreal");
assert(boreal,"debe existir Bosque boreal");
assert(boreal.description.es.includes("Finlandia y Canadá"),"la descripción boreal debe reflejar la referencia visual aprobada");
assert(boreal.description.en.includes("Finland and Canada"),"falta referencia boreal en inglés");
assert(boreal.description.es.includes("musgos y líquenes"),"falta vegetación característica de taiga");
assert(boreal.description.en.includes("moss- and lichen-covered"),"falta vegetación característica de taiga en inglés");
assert(boreal.description.es.includes("Yakutia")&&boreal.description.en.includes("Yakutia"),"faltan los alerces de Yakutia");
assert.deepEqual(boreal.spawn.required.monthsMeanTemperatureAbove10C,{min:1,max:3},"debe conservarse el spawn boreal");
assert.equal(boreal.spawn.required.annualPrecipitationMm.min,200);

const expectedHeights={"forest_tropical":{"min":1,"max":50},"forest_cloud":{"min":25,"max":74},"forest_temperate":{"min":1,"max":64},"forest_boreal":{"min":1,"max":55},"forest_subalpine":{"min":65,"max":84},"forest_redwood":{"min":1,"max":35},"forest_wooded_swamp":{"min":1,"max":20}};
for(const sub of forest.subbiomes){
  assert.deepEqual(sub.spawn.required.elevationLevel,expectedHeights[sub.id],"altura obligatoria distinta a la aprobada: "+sub.id);
  assert.equal(sub.spawn.required.terrain,"land","todos los bosques necesitan terreno terrestre");
  assert(!("elevationMeters" in sub.spawn.preferred),"altura en metros no debe permanecer como preferencia: "+sub.id);
  assert(Number.isInteger(sub.spawn.required.elevationLevel.min)&&Number.isInteger(sub.spawn.required.elevationLevel.max),"altura debe usar niveles enteros");
  assert(sub.spawn.required.elevationLevel.min>=1&&sub.spawn.required.elevationLevel.max<=100,"altura fuera de la escala 0–100: "+sub.id);
}
const expectedForestLatitudes={
  forest_tropical:{min:0,max:23.5},
  forest_cloud:{min:0,max:30},
  forest_temperate:{min:30,max:60},
  forest_boreal:{min:50,max:75},
  forest_subalpine:{min:30,max:70},
  forest_redwood:{min:35,max:43},
  forest_wooded_swamp:{min:20,max:35}
};
for(const sub of forest.subbiomes){
  assert.deepEqual(sub.spawn.preferred.absoluteLatitudeDegrees,expectedForestLatitudes[sub.id],"latitud preferida incorrecta: "+sub.id);
  assert(!Object.hasOwn(sub.spawn.required,"absoluteLatitudeDegrees"),"la latitud no debe ser obligatoria: "+sub.id);
  assert.deepEqual(sub.spawn.required.elevationLevel,{
    forest_tropical:{min:1,max:50},forest_cloud:{min:25,max:74},forest_temperate:{min:1,max:64},
    forest_boreal:{min:1,max:55},forest_subalpine:{min:65,max:84},
    forest_redwood:{min:1,max:35},forest_wooded_swamp:{min:1,max:20}
  }[sub.id],"la altura requerida debe conservarse: "+sub.id);
}
const desert=catalog.biomes.find(x=>x.id==="desert");
assert(desert,"debe existir Desierto");
assert.deepEqual(desert.subbiomes.map(s=>s.id),["desert_sandy","desert_rocky","desert_salt_flat"],"no agregar ni retirar subbiomas desérticos");
const expectedDesert={
 desert_sandy:{height:{min:1,max:64},lat:{min:10,max:40},material:"sand"},
 desert_rocky:{height:{min:1,max:84},lat:{min:15,max:50},material:"rock_gravel"},
 desert_salt_flat:{height:{min:1,max:74},lat:{min:15,max:45},material:"salt_crust"}
};
for(const sub of desert.subbiomes){
 const e=expectedDesert[sub.id];
 assert(sub.description?.es?.trim()&&sub.description?.en?.trim(),"faltan las descripciones bilingües del desierto: "+sub.id);
 assert.deepEqual(sub.spawn?.required?.elevationLevel,e.height,"altura obligatoria fuera del estándar 0–100: "+sub.id);
 assert.deepEqual(sub.spawn?.preferred?.absoluteLatitudeDegrees,e.lat,"latitud preferida incorrecta: "+sub.id);
 assert.equal(sub.spawn.required.terrain,"land");
 assert.equal(sub.spawn.required.annualPrecipitationMm.max,250,"aridez obligatoria incorrecta: "+sub.id);
 assert.equal(sub.spawn.required.dominantSurfaceMaterial,e.material,"material geológico incorrecto: "+sub.id);
 assert(!Object.hasOwn(sub.spawn.required,"absoluteLatitudeDegrees"),"la latitud del desierto no debe ser obligatoria");
 assert(sub.spawn.preferred.meanAnnualTemperatureC,"temperatura como preferencia sin excluir desiertos fríos");
}
const sandy=desert.subbiomes.find(s=>s.id==="desert_sandy");
for(const region of ["Sahara","Rub al-Jali","Namib","Taklamakán"])
  assert(sandy.description.es.includes(region),"falta la referencia visual española: "+region);
for(const region of ["Sahara","Rub' al Khali","Namib","Taklamakan"])
  assert(sandy.description.en.includes(region),"falta la referencia visual inglesa: "+region);
assert.deepEqual(sandy.spawn.required,{terrain:"land",elevationLevel:{min:1,max:64},annualPrecipitationMm:{max:250},dominantSurfaceMaterial:"sand",aeolianDuneField:true},"no alterar las reglas requeridas del desierto arenoso");
assert.deepEqual(sandy.spawn.preferred,{annualPrecipitationMm:{min:0,max:150},meanAnnualTemperatureC:{min:10,max:35},absoluteLatitudeDegrees:{min:10,max:40}},"no alterar las preferencias del desierto arenoso");
assert.equal(desert.subbiomes[0].spawn.required.aeolianDuneField,true,"faltan campos de dunas");
assert.equal(desert.subbiomes[2].spawn.required.endorheicBasin,true,"el salar requiere cuenca cerrada");
assert.equal(desert.subbiomes[2].spawn.required.slopeDegrees.max,5,"el salar requiere relieve plano");
assert.equal(allSubbiomes.filter(x=>x.description).length,10,"solo los 7 bosques y 3 desiertos revisados tienen descripción");
assert.equal(allSubbiomes.filter(x=>x.spawn).length,10);
assert.equal(allSubbiomes.filter(x=>!x.spawn).length,13);
const cloud=forest.subbiomes.find(x=>x.id==="forest_cloud");
assert.equal(cloud.name.es,"Bosque nuboso");
assert.equal(cloud.name.en,"Cloud Forest");
assert.equal(cloud.spawn.required.terrain,"land");
assert.equal(cloud.spawn.required.cloudImmersionFrequent,true);
assert.deepEqual(cloud.spawn.required.elevationLevel,{min:25,max:74});
assert(cloud.description.es.includes("niebla"));
assert(cloud.description.en.includes("mist"));
const marine=catalog.biomes.find(x=>x.id==="marine");
assert(marine,"debe existir el bioma Marino");
const mangrove=marine.subbiomes.find(x=>x.id==="marine_mangrove");
assert.equal(mangrove.name.es,"Manglar");
assert(!forest.subbiomes.some(x=>x.id==="forest_mangrove"),"Manglar no debe duplicarse en Bosque");
assert(!mangrove.spawn&&!mangrove.description,"Manglar marino no revisado debe permanecer intacto");
const redwood=forest.subbiomes.find(x=>x.id==="forest_redwood");
assert.equal(redwood.name.es,"Bosque de secuoyas");
assert.equal(redwood.name.en,"Redwood Forest");
assert.equal(redwood.spawn.required.coastalFogFrequent,true);
assert.deepEqual(redwood.spawn.preferred.distanceToCoastKm,{min:0,max:80});
assert.equal(redwood.spawn.required.terrain,"land");
assert(redwood.description.es.includes("Sequoia sempervirens"));
assert(redwood.description.en.includes("Sequoia sempervirens"));
const subalpine=forest.subbiomes.find(x=>x.id==="forest_subalpine");
assert.equal(subalpine.name.es,"Bosque subalpino");
assert.equal(subalpine.spawn.required.terrain,"land");
assert.deepEqual(subalpine.spawn.required.distanceBelowLocalTreelineMeters,{min:0,max:700});
assert.equal(subalpine.spawn.required.slopeDegrees.max,40);
assert.deepEqual(subalpine.spawn.required.elevationLevel,{min:65,max:84});
assert.equal(10>=subalpine.spawn.required.elevationLevel.min && 10<=subalpine.spawn.required.elevationLevel.max,false,"Bosque subalpino no puede aparecer a altura 10");
assert.equal(subalpine.spawn.required.distanceBelowLocalTreelineMeters.max,700,"se conserva la condición local de árboles");

const ids=new Set();
for(const biome of catalog.biomes){
  assert(biome.id,"bioma sin id");
  assert(!ids.has(biome.id),"bioma duplicado: "+biome.id);
  ids.add(biome.id);
  assert(Array.isArray(biome.subbiomes),"subbiomes[] ausente: "+biome.id);
  for(const sub of biome.subbiomes){
    assert(sub.id,"subbioma sin id");
    assert(!ids.has(sub.id),"ID duplicado: "+sub.id);
    ids.add(sub.id);
  }
}
const scripts=["js/app.js","js/router.js","js/core/catalog-loader.js","js/core/catalog-index.js","js/modules/biomes/biomes.js","js/modules/biomes/biome-detail.js","js/modules/biomes/biome-distribution-chart.js"];
for(const p of scripts)new vm.Script(read(p),{filename:p});
const html=read("index.html");
assert(!html.includes("offline/catalogs.js"),"HTML no debe cargar snapshot offline");
assert(html.includes('src="./js/core/catalog-loader.js"'));
const loader=read("js/core/catalog-loader.js");
assert(loader.includes('fetch("./data/biomes/biomes.json"'),"La única fuente debe ser el JSON");
assert(loader.includes('cache:"no-store"'),"Las recargas deben leer datos frescos");
const app=read("js/app.js");
assert(app.includes("await globalThis.EvolveCatalogLoader.load()"),"El inicio debe esperar los datos");
const detail=read("js/modules/biomes/biome-detail.js");
assert(detail.includes("sub.description?.[lang]"),"la ficha debe mostrar la descripción en el idioma seleccionado");
assert(detail.includes('el("p","biome-description",description)'),"la ficha debe mostrar la descripción como texto");
assert(detail.includes("elevationLevel"),"la ficha debe mostrar altura 0–100");
assert(detail.includes("Nivel de altura (0–100)"),"falta etiqueta de nivel de altura");
assert(!detail.includes('elevationLevel:"m"'),"la escala 0–100 no usa metros");
assert(detail.includes("distanceBelowLocalTreelineMeters"),"falta mostrar distancia al límite de árboles");
assert(detail.includes("Distancia bajo el límite local de árboles"),"falta la etiqueta localizada");
assert(detail.includes('distanceBelowLocalTreelineMeters:"m"'),"la distancia requiere unidades m");
assert(detail.includes("cloudImmersionFrequent"),"la ficha debe mostrar la inmersión en nubes");
assert(detail.includes("Inmersión frecuente en nubes bajas"),"falta la etiqueta traducida de nubes");
assert(detail.includes("coastalFogFrequent"),"la ficha debe mostrar la niebla costera");
assert(detail.includes("Niebla costera frecuente"),"falta etiqueta traducida para niebla costera");
assert(detail.includes('distanceToCoastKm:"km"'),"la ficha debe mostrar distancia a costa en km");
assert(detail.includes('dominantSurfaceMaterial'),"falta campo de material superficial");
assert(detail.includes('aeolianDuneField'),"falta campo de dunas");
assert(detail.includes('endorheicBasin'),"falta cuenca endorreica");
assert(detail.includes('materialLabels'),"los materiales desérticos deben localizarse");
assert(detail.includes('Costra salina')&&detail.includes('Salt crust'),"faltan nombres de materiales en ambos idiomas");
const nav=read("js/modules/biomes/biomes.js");
assert(nav.includes("wiki-nav-heading"));
assert(nav.includes("wiki-biome-tree"));
assert(!nav.includes("wiki-subbiome-tree"),"Los subbiomas deben mostrarse en el contenido");
assert(nav.includes("router.go(biome.id)"));
assert(nav.includes("router.go(b.id,sub.id)"));

const chartSource=read("js/modules/biomes/biome-distribution-chart.js");
assert(html.includes('src="./js/modules/biomes/biome-distribution-chart.js"'),"el HTML debe cargar el componente");
assert(html.includes('id="distribution"'),"falta el contenedor de la gráfica");
assert(html.indexOf('id="distribution"')>html.indexOf('id="workspace"'),"la gráfica debe estar debajo del listado y detalles");
assert(!html.includes('id="distribution" hidden'),"la gráfica no debe ocultarse");
assert(!nav.includes("distribution.hidden="),"no ocultar la gráfica al seleccionar un subbioma");
assert(!nav.includes("distribution.replaceChildren()"),"no borrar la gráfica al cambiar de ficha");
assert(nav.includes('globalThis.EvolveBiomeDistributionChart.render(distribution,b,lang)'),"la gráfica se debe renderizar con el bioma y el idioma actuales");
assert(chartSource.includes("spawn?.required?.elevationLevel"),"altura requerida desde JSON");
assert(chartSource.includes("spawn?.preferred?.absoluteLatitudeDegrees"),"latitud preferida desde JSON");
assert(!chartSource.includes("forest_tropical"),"prohibidos los rangos codificados por bosque");
assert(!chartSource.includes('id==="forest"'),"el componente debe ser genérico");
const chartCtx={};
vm.runInNewContext(chartSource,chartCtx);
const chartAPI=chartCtx.EvolveBiomeDistributionChart;
const data=chartAPI.getData(forest);
assert.equal(data.defined.length,7,"los siete bosques deben representarse");
assert.equal(data.pending.length,0);
for(const sub of forest.subbiomes){
  const plotted=data.defined.find(row=>row.id===sub.id);
  assert(plotted);
  assert.equal(plotted.latitude.min,sub.spawn.preferred.absoluteLatitudeDegrees.min);
  assert.equal(plotted.latitude.max,sub.spawn.preferred.absoluteLatitudeDegrees.max);
  assert.equal(plotted.elevation.min,sub.spawn.required.elevationLevel.min);
  assert.equal(plotted.elevation.max,sub.spawn.required.elevationLevel.max);
}
const desertChart=chartAPI.getData(desert);
assert.equal(desertChart.defined.length,3,"la gráfica debe representar los tres desiertos");
assert.equal(desertChart.pending.length,0,"no deben quedar desiertos pendientes de distribución");
for(const sub of desert.subbiomes){
 const plotted=desertChart.defined.find(x=>x.id===sub.id);
 assert(plotted,"falta en la gráfica: "+sub.id);
 assert.equal(plotted.latitude.min,sub.spawn.preferred.absoluteLatitudeDegrees.min);
 assert.equal(plotted.latitude.max,sub.spawn.preferred.absoluteLatitudeDegrees.max);
 assert.equal(plotted.elevation.min,sub.spawn.required.elevationLevel.min);
 assert.equal(plotted.elevation.max,sub.spawn.required.elevationLevel.max);
}
for(const biome of catalog.biomes.filter(b=>b.id!=="forest"&&b.id!=="desert")){
  const result=chartAPI.getData(biome);
  assert.equal(result.defined.length,0,"bioma sin rangos no debe dibujar valores inventados");
  assert.equal(result.pending.length,biome.subbiomes.length);
}
const testPartial={subbiomes:[forest.subbiomes[0],{id:"without_ranges",name:{es:"Sin rangos"}}]};
assert.equal(chartAPI.getData(testPartial).defined.length,1);
assert.equal(chartAPI.getData(testPartial).pending.length,1);
const changed=JSON.parse(JSON.stringify(forest));
changed.subbiomes[0].spawn.preferred.absoluteLatitudeDegrees.max=12;
assert.equal(chartAPI.getData(changed).defined[0].latitude.max,12,"la gráfica debe leer el JSON actualizado");

console.log("PASS: 8 biomas, 23 subbiomas, 7 bosques + 3 desiertos con descripción y spawn; gráfica reutilizable para ambos biomas; manglar sigue marino");
