"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const catalog=JSON.parse(read("data/biomes/biomes.json"));
assert(Array.isArray(catalog.biomes),"biomes.json debe contener biomes[]");
const allSubbiomes=catalog.biomes.flatMap(biome=>biome.subbiomes);
// Contrato global: altura normalizada 0–100; profundidad en metros es un campo distinto.
for(const sub of allSubbiomes){
  if(!sub.spawn)continue;
  const required=sub.spawn.required;
  if(required.terrain==="land"){
    const elevation=required.elevationLevel;
    assert(elevation&&Number.isInteger(elevation.min)&&Number.isInteger(elevation.max),"tierra requiere elevación normalizada: "+sub.id);
    assert(elevation.min>=0&&elevation.max<=100&&elevation.min<=elevation.max,"altura Evolve fuera de 0–100: "+sub.id);
  }else if(required.terrain==="water"){
    assert(!Object.hasOwn(required,"elevationLevel"),"profundidad marina no debe sustituir altura Evolve: "+sub.id);
    const depth=required.waterDepthMeters;
    assert(depth&&Number.isFinite(depth.min)&&Number.isFinite(depth.max)&&depth.min>=0&&depth.max>=depth.min,"profundidad marina en metros inválida: "+sub.id);
    assert(Number.isFinite(required.waterSalinityPpt?.min)&&Number.isFinite(required.waterSalinityPpt?.max),"falta salinidad marina: "+sub.id);
  }
}

const forest=catalog.biomes.find(b=>b.id==="forest");
assert.equal(catalog.biomes.length,7,"Polo agrupa Norte y Sur: deben existir siete biomas");
assert.equal(allSubbiomes.length,23,"deben existir 23 subbiomas");
const polar=catalog.biomes.find(b=>b.id==="polar");
assert(polar,"debe existir el nuevo bioma Polo");
assert.deepEqual(polar.name,{es:"Polo",en:"Pole"},"nombre de bioma Polo debe ser bilingüe");
assert.deepEqual(polar.subbiomes.map(s=>s.id),["polar_north_ice","polar_south_ice"],"conservar identificadores previos de ambos polos");
assert.deepEqual(polar.subbiomes.map(s=>s.name.es),["Polo Norte","Polo Sur"],"los dos subbiomas son Norte y Sur");
assert.deepEqual(polar.subbiomes.map(s=>s.name.en),["North Pole","South Pole"],"ambos subbiomas tienen nombre inglés");
assert(!catalog.biomes.some(b=>b.id==="polar_north"||b.id==="polar_south"),"no mantener polos como biomas independientes");
const northIce=polar.subbiomes.find(s=>s.id==="polar_north_ice");
const southIce=polar.subbiomes.find(s=>s.id==="polar_south_ice");
assert(northIce&&southIce,"deben existir ambos polos");
assert(northIce.description.es.includes("parte superior")&&northIce.description.en.includes("top"),"Polo Norte solo en extremo superior");
assert(northIce.description.es.includes("hielo marino flotante")&&northIce.description.en.includes("floating sea ice"),"Polo Norte es hielo sobre océano");
assert.deepEqual(northIce.spawn.required,{
  terrain:"water",waterDepthMeters:{min:0,max:6000},waterSalinityPpt:{min:25,max:35},meanAnnualTemperatureC:{min:-2,max:1}
},"condiciones requeridas de Polo Norte");
assert.deepEqual(northIce.spawn.preferred,{
  absoluteLatitudeDegrees:{min:75,max:90},meanAnnualTemperatureC:{min:-2,max:0},waterSalinityPpt:{min:30,max:34}
},"preferencias de Polo Norte");
assert.deepEqual(northIce.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:1,maxRegions:1},"Polo Norte exige una sola masa conectada");
assert(!Object.hasOwn(northIce.spawn.required,"elevationLevel"),"Polo Norte no introduce altura terrestre sobre agua");
assert(!Object.hasOwn(northIce.spawn.required,"absoluteLatitudeDegrees"),"la latitud absoluta no sustituye la ubicación obligatoria en hemisferio norte");
assert(southIce.description.es.includes("parte inferior")&&southIce.description.en.includes("bottom"),"Polo Sur se ubica en el extremo inferior");
assert(southIce.description.es.includes("masa continental")&&southIce.description.en.includes("landmass"),"Polo Sur debe ser continente helado");
assert.deepEqual(southIce.spawn.required,{
 terrain:"land",elevationLevel:{min:1,max:100},meanAnnualTemperatureC:{min:-60,max:0}
},"Polo Sur mantiene elevación terrestre 1–100 y temperatura aprobada");
assert.deepEqual(southIce.spawn.preferred,{
 absoluteLatitudeDegrees:{min:65,max:90},elevationLevel:{min:25,max:75},meanAnnualTemperatureC:{min:-55,max:-15}
},"Preferencias del Polo Sur aprobadas");
assert.deepEqual(southIce.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:1,maxRegions:1},"Polo Sur debe ser una sola masa continental");
assert(!Object.hasOwn(southIce.spawn.required,"waterDepthMeters"),"Polo Sur no utiliza profundidad oceánica");
assert(!Object.hasOwn(southIce.spawn.required,"absoluteLatitudeDegrees"),"La latitud absoluta no sustituye hemisferio sur");
assert.equal(southIce.spawn.required.terrain,"land","Polo Sur es continente, no océano");

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
assert.equal(allSubbiomes.filter(x=>x.description).length,20,"7 bosques, 3 desiertos, 4 Llanuras, 4 Marinos y ambos Polos tienen descripción");
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

const expectedForestDistribution={
 forest_tropical:{targetLandPercent:8.8,percentBasis:"earthProxy",minRegions:2,maxRegions:3},
 forest_cloud:{targetLandPercent:0.165,percentBasis:"earthProxy",minRegions:1,maxRegions:null},
 forest_temperate:{targetLandPercent:5.4,percentBasis:"earthProxy",minRegions:2,maxRegions:4},
 forest_boreal:{targetLandPercent:8.9,percentBasis:"earthProxy",minRegions:1,maxRegions:3},
 forest_subalpine:{targetLandPercent:null,percentBasis:"unavailable",minRegions:1,maxRegions:null},
 forest_redwood:{targetLandPercent:0.006,percentBasis:"historicalEarthProxy",minRegions:1,maxRegions:1},
 forest_wooded_swamp:{targetLandPercent:0.9,percentBasis:"earthProxy",minRegions:1,maxRegions:2}
};
for(const sub of forest.subbiomes){
 const dist=sub.distribution;
 assert.deepEqual(dist,expectedForestDistribution[sub.id],"distribución terrestre incorrecta: "+sub.id);
 assert(Number.isInteger(dist.minRegions)&&dist.minRegions>=1,"mínimo de masas inválido: "+sub.id);
 assert(dist.maxRegions===null||Number.isInteger(dist.maxRegions)&&dist.maxRegions>=dist.minRegions,"máximo de masas inválido: "+sub.id);
 if(dist.targetLandPercent!==null)assert(dist.targetLandPercent>0&&dist.targetLandPercent<=100,"porcentaje terrestre inválido: "+sub.id);
 assert(!Object.hasOwn(sub.spawn.required,"regionCount"),"los límites de masas no deben mezclarse con spawn: "+sub.id);
}
assert.equal(forest.subbiomes.find(s=>s.id==="forest_tropical").distribution.minRegions,2);
assert.equal(forest.subbiomes.find(s=>s.id==="forest_tropical").distribution.maxRegions,3);
assert.equal(forest.subbiomes.find(s=>s.id==="forest_redwood").distribution.maxRegions,1);
assert.deepEqual(getMountainPlacement("forest_cloud"),{mode:"mountainDependent",belt:"humidMontane"},"bosque nuboso depende de montaña húmeda");
assert.deepEqual(getMountainPlacement("forest_subalpine"),{mode:"mountainDependent",belt:"belowLocalTreeline"},"bosque subalpino depende de línea de árboles montañosa");
assert.deepEqual({min:forest.subbiomes.find(s=>s.id==="forest_boreal").distribution.minRegions,max:forest.subbiomes.find(s=>s.id==="forest_boreal").distribution.maxRegions},{min:1,max:3},"taiga debe tener 1–3 masas");
for(const sub of forest.subbiomes){
  const placement=sub.regionPlacement;
  if(["forest_cloud","forest_subalpine"].includes(sub.id)){
    assert(placement,"falta política de emplazamiento dependiente de montaña: "+sub.id);
    assert.equal(placement.mode,"mountainDependent");
    assert(Object.hasOwn(sub.spawn.preferred,"absoluteLatitudeDegrees"),"la política montañosa debe conservar la latitud preferida: "+sub.id);
  }else assert(!placement,"no crear emplazamientos montañosos para bosques que no lo requieren: "+sub.id);
}
function getMountainPlacement(id){return forest.subbiomes.find(s=>s.id===id).regionPlacement}

assert.deepEqual({min:forest.subbiomes.find(s=>s.id==="forest_temperate").distribution.minRegions,max:forest.subbiomes.find(s=>s.id==="forest_temperate").distribution.maxRegions},{min:2,max:4},"templado debe tener 2–4 masas");
assert.deepEqual({min:forest.subbiomes.find(s=>s.id==="forest_wooded_swamp").distribution.minRegions,max:forest.subbiomes.find(s=>s.id==="forest_wooded_swamp").distribution.maxRegions},{min:1,max:2},"pantano arbolado debe tener 1–2 masas");
assert.equal(forest.subbiomes.find(s=>s.id==="forest_subalpine").distribution.targetLandPercent,null,"sin porcentaje científico mundial, no inventar cifras");
const tundra=catalog.biomes.find(b=>b.id==="tundra");
assert(tundra&&tundra.subbiomes.length===1,"Tundra debe mantenerse como un único subbioma");
const tundraBiome=tundra.subbiomes[0];
assert.equal(tundraBiome.id,"tundra_tundra","La tundra ártica y alpina deben compartir subbioma");
assert(!tundraBiome.spawn&&!tundraBiome.description,"Tundra no tiene aún las condiciones de aparición aprobadas");
assert.deepEqual(tundraBiome.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:2,maxRegions:4},"Tundra debe tener de 2 a 4 masas conectadas aprobadas");
assert(allSubbiomes.filter(s=>!s.spawn).every(s=>s.id==="tundra_tundra"||!s.distribution),"solo Tundra puede tener distribución parcial sin spawn aprobado");
const desertDistributionById={
 desert_sandy:{targetLandPercent:3.9,percentBasis:"earthProxy",minRegions:2,maxRegions:4},
 desert_rocky:{targetLandPercent:9.8,percentBasis:"earthLowerBoundProxy",minRegions:2,maxRegions:4},
 desert_salt_flat:{targetLandPercent:0.008,percentBasis:"singleSiteProxy",minRegions:1,maxRegions:1}
};
const desertForDistribution=catalog.biomes.find(b=>b.id==="desert");
assert.equal(desertForDistribution.subbiomes.length,3,"deben mantenerse tres subbiomas de Desierto");
for(const sub of desertForDistribution.subbiomes){
 assert.deepEqual(sub.distribution,desertDistributionById[sub.id],"distribución desértica incorrecta: "+sub.id);
 assert(sub.distribution.minRegions>=1&&Number.isInteger(sub.distribution.minRegions),"mínimo inválido: "+sub.id);
 assert(sub.distribution.maxRegions>=sub.distribution.minRegions&&Number.isInteger(sub.distribution.maxRegions),"máximo inválido: "+sub.id);
 assert(sub.distribution.targetLandPercent>0&&sub.distribution.targetLandPercent<=100,"porcentaje inválido: "+sub.id);
 assert(!Object.hasOwn(sub.spawn.required,"regionCount"),"las masas no se deben guardar dentro de spawn: "+sub.id);
}
assert.equal(desertForDistribution.subbiomes.find(s=>s.id==="desert_salt_flat").distribution.maxRegions,1,"salar único");
assert.deepEqual([desertForDistribution.subbiomes.find(s=>s.id==="desert_rocky").distribution.minRegions,desertForDistribution.subbiomes.find(s=>s.id==="desert_rocky").distribution.maxRegions],[2,4],"desierto rocoso: 2–4 masas");
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
const rocky=desert.subbiomes.find(s=>s.id==="desert_rocky");
for(const region of ["Atacama","Canyonlands","Gobi","Sahara"])
  assert(rocky.description.es.includes(region),"falta la referencia visual española del desierto rocoso: "+region);
for(const region of ["Atacama","Canyonlands","Gobi","Sahara"])
  assert(rocky.description.en.includes(region),"falta la referencia visual inglesa del desierto rocoso: "+region);
assert(rocky.description.es.includes("no requisitos"),"cañones y mesetas no deben exigirse siempre");
assert(rocky.description.en.includes("not requirements"),"cañones y mesetas no deben exigirse siempre en inglés");
assert.deepEqual(rocky.spawn.required,{terrain:"land",elevationLevel:{min:1,max:84},annualPrecipitationMm:{max:250},dominantSurfaceMaterial:"rock_gravel"},"no alterar las reglas requeridas del desierto rocoso");
assert.deepEqual(rocky.spawn.preferred,{annualPrecipitationMm:{min:0,max:150},meanAnnualTemperatureC:{min:-5,max:30},slopeDegrees:{min:0,max:35},absoluteLatitudeDegrees:{min:15,max:50}},"no alterar las preferencias del desierto rocoso");
const saltFlat=desert.subbiomes.find(s=>s.id==="desert_salt_flat");
for(const word of ["Uyuni","Bolivia","blanca","poligonales","estación seca","reflejar"])
  assert(saltFlat.description.es.includes(word),"falta identidad visual española del Salar: "+word);
for(const word of ["Uyuni","Bolivia","white","polygonal","dry season","reflect"])
  assert(saltFlat.description.en.includes(word),"falta identidad visual inglesa del Salar: "+word);
assert.deepEqual(saltFlat.spawn.required,{terrain:"land",elevationLevel:{min:1,max:74},annualPrecipitationMm:{max:250},dominantSurfaceMaterial:"salt_crust",endorheicBasin:true,slopeDegrees:{max:5}},"no modificar las condiciones requeridas del Salar");
assert.deepEqual(saltFlat.spawn.preferred,{annualPrecipitationMm:{min:0,max:150},meanAnnualTemperatureC:{min:-5,max:30},slopeDegrees:{min:0,max:2},absoluteLatitudeDegrees:{min:15,max:45}},"no modificar las preferencias del Salar");
assert.equal(desert.subbiomes[0].spawn.required.aeolianDuneField,true,"faltan campos de dunas");
assert.equal(desert.subbiomes[2].spawn.required.endorheicBasin,true,"el salar requiere cuenca cerrada");
assert.equal(desert.subbiomes[2].spawn.required.slopeDegrees.max,5,"el salar requiere relieve plano");
assert.equal(allSubbiomes.filter(x=>x.description).length,20,"7 bosques, 3 desiertos, 4 Llanuras, 4 Marinos y ambos Polos tienen descripción");
assert.equal(allSubbiomes.filter(x=>x.spawn).length,20);
assert.equal(allSubbiomes.filter(x=>!x.spawn).length,3);
const plains=catalog.biomes.find(x=>x.id==="plains");
assert(plains,"debe existir Llanuras");
assert.deepEqual(plains.subbiomes.map(s=>s.id),["plains_savanna","plains_prairie","plains_steppe","plains_open_wetland"],"Llanuras conserva cuatro subbiomas, sin matorral");
const savanna=plains.subbiomes.find(s=>s.id==="plains_savanna");
for(const ref of ["Serengeti","Masái Mara","Cerrado","Australia"])
  assert(savanna.description.es.includes(ref),"falta referencia visual española de Sabana: "+ref);
for(const ref of ["Serengeti","Maasai Mara","Cerrado","Australia"])
  assert(savanna.description.en.includes(ref),"falta referencia visual inglesa de Sabana: "+ref);
assert.deepEqual(savanna.spawn.required,{
 terrain:"land",elevationLevel:{min:1,max:64},meanAnnualTemperatureC:{min:18},
 annualPrecipitationMm:{min:400,max:1800},
 dryMonthsPerYear:{min:3,max:8,dryMonthThresholdMm:60},
 herbaceousVegetationDominant:true,treeCanopyCoverPercent:{max:40}
},"las condiciones obligatorias de sabana deben conservarse");
assert.deepEqual(savanna.spawn.preferred,{
 meanAnnualTemperatureC:{min:20,max:30},annualPrecipitationMm:{min:650,max:1300},
 treeCanopyCoverPercent:{min:5,max:30},absoluteLatitudeDegrees:{min:0,max:30}
},"las preferencias de sabana deben conservarse");
assert(!Object.hasOwn(savanna.spawn.required,"absoluteLatitudeDegrees"),"latitud de sabana no debe ser obligatoria");
for(const sub of plains.subbiomes){
  assert(sub.description?.es?.trim()&&sub.description?.en?.trim(),"Llanuras requiere descripción bilingüe: "+sub.id);
  assert(sub.spawn?.required&&sub.spawn?.preferred,"Llanuras requiere spawn completo: "+sub.id);
  assert(sub.distribution,"Llanuras requiere distribución: "+sub.id);
}
assert(catalog.biomes.find(x=>x.id==="tundra"),"Tundra sigue como bioma independiente");
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
const reef=marine.subbiomes.find(x=>x.id==="marine_reef");
assert(reef,"falta el arrecife marino");
assert(reef.description.es.includes("Gran Barrera de Coral")&&reef.description.en.includes("Great Barrier Reef"),"referencia australiana aprobada de Arrecife");
for(const form of ["costero","barrera","atolones"])assert(reef.description.es.includes(form),"falta forma de arrecife: "+form);
assert.deepEqual(reef.spawn.required,{
 terrain:"water",waterDepthMeters:{min:0,max:50},waterSalinityPpt:{min:32,max:42},
 meanAnnualTemperatureC:{min:20,max:30}
},"Arrecife solo incorpora profundidad y salinidad como campos nuevos");
assert.deepEqual(reef.spawn.preferred,{
 absoluteLatitudeDegrees:{min:0,max:30},waterDepthMeters:{min:0,max:30},meanAnnualTemperatureC:{min:23,max:29}
},"Arrecife usa latitud y temperatura comunes");
assert.deepEqual(reef.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:4,maxRegions:8},"Arrecife 4–8 sistemas; porcentaje pendiente");
assert(!Object.hasOwn(reef.spawn.required,"elevationLevel"),"profundidad oceánica no equivale a elevación Evolve");
assert(!Object.hasOwn(reef.spawn.required,"absoluteLatitudeDegrees"),"latitud marina debe ser preferencia");
const estuary=marine.subbiomes.find(x=>x.id==="marine_estuary_littoral");
assert(estuary,"falta Estuario o litoral");
assert(estuary.description.es.includes("costa rocosa")&&estuary.description.es.includes("Chesapeake"),"Estuario debe priorizar costa rocosa y mantener referencia estuarina");
assert(estuary.description.en.includes("rocky coastline")&&estuary.description.en.includes("Chesapeake"),"falta la descripción inglesa de Estuario");
assert(estuary.description.es.includes("franja costera continua"),"los litorales deben favorecer franjas continuas");
assert.deepEqual(estuary.spawn.required,{terrain:"water",waterDepthMeters:{min:0,max:50},waterSalinityPpt:{min:0,max:40},meanAnnualTemperatureC:{min:-2,max:35}},"Estuario no debe introducir parámetros nuevos");
assert.deepEqual(estuary.spawn.preferred,{absoluteLatitudeDegrees:{min:0,max:90},waterDepthMeters:{min:0,max:20}},"Estuario debe preferir profundidad 0–20 m y latitudes globales");
assert.deepEqual(estuary.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:1,maxRegions:8},"Estuario 1–8 masas preliminares y porcentaje pendiente");
assert(!Object.hasOwn(estuary.spawn.required,"elevationLevel"),"el litoral no debe heredar elevación terrestre");
assert(!Object.hasOwn(estuary.spawn.required,"absoluteLatitudeDegrees"),"latitud del litoral no debe ser filtro duro");
assert(marine.subbiomes.every(s=>s.spawn&&s.description?.es&&s.description?.en&&s.distribution),"los cuatro subbiomas marinos deben estar definidos");
const mangrove=marine.subbiomes.find(x=>x.id==="marine_mangrove");
assert.equal(mangrove.name.es,"Manglar");
assert(!forest.subbiomes.some(x=>x.id==="forest_mangrove"),"Manglar no debe duplicarse en Bosque");
assert(mangrove.description.es.includes("Sundarbans")&&mangrove.description.es.includes("Bangladesh")&&mangrove.description.es.includes("India"),"Manglar requiere referencia principal de Sundarbans");
assert(mangrove.description.en.includes("Sundarbans")&&mangrove.description.en.includes("intertidal"),"Manglar requiere descripción inglesa");
assert(mangrove.description.es.includes("raíces aéreas")&&mangrove.description.es.includes("deltas"),"Manglar requiere raíces y distribución costera");
assert.deepEqual(mangrove.spawn.required,{
  terrain:"water",waterDepthMeters:{min:0,max:5},waterSalinityPpt:{min:0,max:40},
  meanAnnualTemperatureC:{min:20,max:30}
},"Manglar no debe añadir parámetros marinos diferentes de profundidad y salinidad");
assert.deepEqual(mangrove.spawn.preferred,{
  absoluteLatitudeDegrees:{min:0,max:30},waterDepthMeters:{min:0,max:2},
  waterSalinityPpt:{min:5,max:30},meanAnnualTemperatureC:{min:24,max:28}
},"Manglar debe conservar preferencias aprobadas");
assert.deepEqual(mangrove.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:2,maxRegions:6},"Manglar debe tener de 2 a 6 masas y porcentaje pendiente");
assert(!Object.hasOwn(mangrove.spawn.required,"elevationLevel"),"Manglar no usa altura terrestre");
assert(!Object.hasOwn(mangrove.spawn.required,"absoluteLatitudeDegrees"),"latitud debe ser preferencia");
const sharedMarineParams=new Set(["terrain","meanAnnualTemperatureC","absoluteLatitudeDegrees","waterDepthMeters","waterSalinityPpt"]);
for(const k of [...Object.keys(mangrove.spawn.required),...Object.keys(mangrove.spawn.preferred)])
 assert(sharedMarineParams.has(k),"Manglar introduce un parámetro inesperado: "+k);
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
assert(detail.includes("herbaceousVegetationDominant"),"la ficha debe mostrar dominancia herbácea de sabana");
assert(detail.includes("treeCanopyCoverPercent"),"la ficha debe mostrar cobertura arbórea de sabana");
assert(detail.includes("sub.distribution"),"la ficha debe mostrar distribución si está definida");
assert(detail.includes("targetLandPercent"),"la ficha debe mostrar porcentaje terrestre");
assert(detail.includes("minRegions")&&detail.includes("maxRegions"),"la ficha debe mostrar límites de masas");
assert(detail.includes("sub.regionPlacement"),"la ficha debe mostrar la política de emplazamiento");
assert(detail.includes("earthLowerBoundProxy")&&detail.includes("singleSiteProxy"),"la ficha debe distinguir referencias de grava y Uyuni");
assert(detail.includes("Bosque montano húmedo"),"falta traducción de la franja nubosa");
assert(detail.includes("Bajo el límite local de árboles"),"falta traducción de la franja subalpina");
assert(detail.includes("No comparable global reference"),"la ficha debe indicar ausencia de referencia real");
assert(detail.includes('treeCanopyCoverPercent:"%"'),"la cobertura arbórea debe aparecer en %");
assert(detail.includes('waterDepthMeters:"m"')&&detail.includes('waterSalinityPpt:"‰"'),"faltan unidades de profundidad y salinidad marina");
assert(detail.includes("Profundidad del agua")&&detail.includes("Salinidad del agua"),"faltan etiquetas marinas bilingües");
for(const label of ["interiorOrRainShadow","fluvialFloodplainInfluence","slowDrainage","seasonalFlooding"])
 assert(detail.includes(label),"campo geográfico o hidrológico sin etiqueta localizada: "+label);
assert(detail.includes('Costra salina')&&detail.includes('Salt crust'),"faltan nombres de materiales en ambos idiomas");
const nav=read("js/modules/biomes/biomes.js");
assert(nav.includes("wiki-nav-heading"));
assert(nav.includes("wiki-biome-tree"));
assert(!nav.includes("wiki-subbiome-tree"),"Los subbiomas deben mostrarse en el contenido");
assert(nav.includes("router.go(biome.id)"));
assert(nav.includes("router.go(b.id,sub.id)"));
const routerSource=read("js/router.js");
assert(routerSource.includes("polar_north:\"polar_north_ice\""),"enlaces anteriores del Polo Norte deben redirigir al subbioma");
assert(routerSource.includes("polar_south:\"polar_south_ice\""),"enlaces anteriores del Polo Sur deben redirigir al subbioma");


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

assert.deepEqual(savanna.distribution,{targetLandPercent:13.8,percentBasis:"earthProxy",minRegions:2,maxRegions:4},"Sabana debe ocupar referencia terrestre 13,8 % y formar 2–4 masas");
assert.deepEqual(savanna.spawn.preferred.absoluteLatitudeDegrees,{min:0,max:30},"Sabana debe mantener su latitud preferida 0–30°");
assert.deepEqual(savanna.spawn.required.elevationLevel,{min:1,max:64},"Sabana debe mantener elevación requerida 1–64");
assert(plains.subbiomes.every(s=>s.distribution&&s.spawn),"todos los subbiomas de Llanuras están definidos");
assert(!Object.hasOwn(savanna.spawn.required,"regionCount"),"las masas de Sabana no pertenecen al spawn");
const prairie=plains.subbiomes.find(s=>s.id==="plains_prairie");
assert(prairie,"falta Pradera");
assert(prairie.description.es.includes("Grandes Llanuras")&&prairie.description.es.includes("Pampas argentinas"),"faltan referencias visuales de Pradera");
assert(prairie.description.en.includes("Great Plains")&&prairie.description.en.includes("Pampas"),"faltan referencias inglesas de Pradera");
assert.deepEqual(prairie.spawn.required,{terrain:"land",elevationLevel:{min:1,max:64},meanAnnualTemperatureC:{min:2,max:20},annualPrecipitationMm:{min:450,max:1200},herbaceousVegetationDominant:true,treeCanopyCoverPercent:{max:10}},"conservar condiciones obligatorias de Pradera");
assert.deepEqual(prairie.spawn.preferred,{absoluteLatitudeDegrees:{min:30,max:60},slopeDegrees:{min:0,max:10}},"Pradera debe favorecer latitudes 30–60 y pendientes suaves");
assert(!Object.hasOwn(prairie.spawn.required,"absoluteLatitudeDegrees"),"la latitud de Pradera no debe ser obligatoria");
assert.deepEqual(prairie.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:2,maxRegions:4},"Pradera 2–4 masas y porcentaje pendiente");
assert(!Object.hasOwn(prairie.spawn.required,"regionCount"),"las masas no pertenecen al spawn");
const steppe=plains.subbiomes.find(s=>s.id==="plains_steppe");
assert(steppe.description.es.includes("Mongolia")&&steppe.description.es.includes("Patagonia"),"Estepa: faltan ambas referencias visuales");
assert(steppe.description.en.includes("Mongolia")&&steppe.description.en.includes("Patagonia"),"Estepa: descripción inglesa incompleta");
assert.deepEqual(steppe.spawn.required,{terrain:"land",elevationLevel:{min:1,max:74},meanAnnualTemperatureC:{min:-10,max:15},annualPrecipitationMm:{min:150,max:500},herbaceousVegetationDominant:true,treeCanopyCoverPercent:{max:10}},"Estepa debe conservar sus rangos aprobados");
assert.deepEqual(steppe.spawn.preferred,{absoluteLatitudeDegrees:{min:30,max:60},annualPrecipitationMm:{min:200,max:400},interiorOrRainShadow:true},"Estepa favorece interiores o sombras de lluvia");
assert.deepEqual(steppe.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:2,maxRegions:4},"Estepa 2–4 masas; porcentaje pendiente");
const wetland=plains.subbiomes.find(s=>s.id==="plains_open_wetland");
assert(wetland.description.es.includes("Pantanal brasileño"),"Pantanal debe tener como referencia principal Brasil");
assert(wetland.description.en.includes("Brazil's Pantanal"),"Pantanal: descripción inglesa incompleta");
assert.deepEqual(wetland.spawn.required,{terrain:"land",elevationLevel:{min:1,max:38},meanAnnualTemperatureC:{min:20,max:28},annualPrecipitationMm:{min:900,max:1700},herbaceousVegetationDominant:true,fluvialFloodplainInfluence:true,slowDrainage:true,seasonalFlooding:true},"Pantanal requiere hidrología estacional y altura 1–38");
assert.deepEqual(wetland.spawn.preferred,{elevationLevel:{min:1,max:20},absoluteLatitudeDegrees:{min:10,max:25},annualPrecipitationMm:{min:1100,max:1500},treeCanopyCoverPercent:{max:20}},"Pantanal debe conservar las preferencias aprobadas");
assert.deepEqual(wetland.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:1,maxRegions:1},"Pantanal debe tener exactamente una masa cuando aparece");
for(const sub of [steppe,wetland]){
 assert(!Object.hasOwn(sub.spawn.required,"absoluteLatitudeDegrees"),"latitud no debe ser filtro duro: "+sub.id);
 assert(!Object.hasOwn(sub.spawn.required,"regionCount"),"masas no deben estar dentro de spawn: "+sub.id);
}

const savannaChart=chartAPI.getData(plains);
assert.equal(savannaChart.defined.length,4,"la gráfica de Llanuras debe dibujar los cuatro subbiomas");
assert.equal(savannaChart.pending.length,0,"Llanuras ya no tiene subbiomas pendientes");
assert.equal(savannaChart.defined[0].id,"plains_savanna");
assert.equal(savannaChart.defined[0].latitude.min,0);
assert.equal(savannaChart.defined[0].latitude.max,30);
assert.equal(savannaChart.defined[0].elevation.min,1);
assert.equal(savannaChart.defined[0].elevation.max,64);
const prairieChart=savannaChart.defined.find(x=>x.id==="plains_prairie");
assert(prairieChart,"Pradera debe figurar en la gráfica");
assert.deepEqual({latitude:{min:prairieChart.latitude.min,max:prairieChart.latitude.max},elevation:{min:prairieChart.elevation.min,max:prairieChart.elevation.max}},{latitude:{min:30,max:60},elevation:{min:1,max:64}},"Pradera debe graficarse con latitud 30–60 y altura 1–64");
for(const [id,latitude,elevation] of [
  ["plains_steppe",{min:30,max:60},{min:1,max:74}],
  ["plains_open_wetland",{min:10,max:25},{min:1,max:38}]
]){
  const p=savannaChart.defined.find(x=>x.id===id);
  assert(p,"la gráfica debe incluir "+id);
  assert.deepEqual({min:p.latitude.min,max:p.latitude.max},latitude,"latitud gráfica incorrecta: "+id);
  assert.deepEqual({min:p.elevation.min,max:p.elevation.max},elevation,"altura gráfica incorrecta: "+id);
}
const reefChart=chartAPI.getData(marine);
assert.equal(reefChart.defined.length,4,"los cuatro marinos deben dibujarse en la gráfica");
assert.equal(reefChart.pending.length,0,"no deben quedar marinos pendientes");
const plottedReef=reefChart.defined[0];
assert.equal(plottedReef.id,"marine_reef");
assert.deepEqual({min:plottedReef.latitude.min,max:plottedReef.latitude.max},{min:0,max:30});
assert.deepEqual({min:plottedReef.depth.min,max:plottedReef.depth.max},{min:0,max:50},"la gráfica usa metros de profundidad, no altura terrestre");
assert(!Object.hasOwn(plottedReef,"elevation"),"Arrecife no debe heredar elevación terrestre");
const plottedEstuary=reefChart.defined.find(s=>s.id==="marine_estuary_littoral");
assert(plottedEstuary,"Estuario o litoral debe aparecer en la gráfica marina");
assert.deepEqual({min:plottedEstuary.latitude.min,max:plottedEstuary.latitude.max},{min:0,max:90});
assert.deepEqual({min:plottedEstuary.depth.min,max:plottedEstuary.depth.max},{min:0,max:50});
assert(!Object.hasOwn(plottedEstuary,"elevation"),"el litoral no debe utilizar altura terrestre");
const plottedMangrove=reefChart.defined.find(x=>x.id==="marine_mangrove");
assert(plottedMangrove,"Manglar debe aparecer en la gráfica marina");
assert.deepEqual({min:plottedMangrove.latitude.min,max:plottedMangrove.latitude.max},{min:0,max:30},"latitud de Manglar en la gráfica");
assert.deepEqual({min:plottedMangrove.depth.min,max:plottedMangrove.depth.max},{min:0,max:5},"profundidad de Manglar en la gráfica");
assert(!Object.hasOwn(plottedMangrove,"elevation"),"Manglar no debe utilizar altura terrestre");
const openOcean=marine.subbiomes.find(s=>s.id==="marine_open_ocean");
assert(openOcean.description.es.includes("océano Pacífico")&&openOcean.description.en.includes("Pacific Ocean"),"Océano abierto debe referenciar Pacífico");
assert(openOcean.description.es.includes("conectada"),"Océano abierto debe favorecer continuidad");
assert.deepEqual(openOcean.spawn.required,{
 terrain:"water",waterDepthMeters:{min:0,max:11000},waterSalinityPpt:{min:30,max:40},meanAnnualTemperatureC:{min:-2,max:32}
},"Océano abierto debe conservar las condiciones compartidas");
assert.deepEqual(openOcean.spawn.preferred,{
 absoluteLatitudeDegrees:{min:0,max:90},waterDepthMeters:{min:200,max:6000},waterSalinityPpt:{min:33,max:37}
},"Océano abierto debe conservar preferencias aprobadas");
assert.deepEqual(openOcean.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:1,maxRegions:3},"Océano abierto 1–3 masas, una preferida");
assert(!Object.hasOwn(openOcean.spawn.required,"elevationLevel"),"Marino no usa altura terrestre");
const plottedOcean=reefChart.defined.find(s=>s.id==="marine_open_ocean");
assert(plottedOcean,"Océano abierto no aparece en la gráfica");
assert.deepEqual({min:plottedOcean.latitude.min,max:plottedOcean.latitude.max},{min:0,max:90},"Océano global");
assert.deepEqual({min:plottedOcean.depth.min,max:plottedOcean.depth.max},{min:0,max:11000},"Profundidad hasta 11 km");
assert(!Object.hasOwn(plottedOcean,"elevation"),"Océano no usa altura terrestre");
assert(chartSource.includes('marine?t.depth:t.elevation'),"la gráfica debe etiquetar profundidad del océano");
assert(chartSource.includes("deepMarine?y0+"),"la profundidad marina debe crecer hacia abajo y ampliar los 0–50 m");
assert(chartSource.includes("paintOrder"),"regiones profundas detrás de los hábitats someros");
const tundraChart=chartAPI.getData(tundra);
assert.equal(tundraChart.defined.length,0,"No graficar Tundra antes de aprobar rangos de aparición");
assert.equal(tundraChart.pending.length,1,"Tundra debe figurar como pendiente en la gráfica");
const polarChart=chartAPI.getData(polar);
assert.equal(polarChart.defined.length,2,"ambos polos deben verse en la gráfica polar");
assert.equal(polarChart.pending.length,0,"Polo queda completamente definido en gráfica");
assert.equal(polarChart.defined[0].id,"polar_north_ice");
assert.deepEqual({min:polarChart.defined[0].depth.min,max:polarChart.defined[0].depth.max},{min:0,max:6000},"Polo Norte muestra batimetría en metros");
assert.deepEqual({min:polarChart.defined[0].latitude.min,max:polarChart.defined[0].latitude.max},{min:75,max:90},"Polo Norte muestra 75–90 grados");
assert(!Object.hasOwn(polarChart.defined[0],"elevation"),"Polo Norte no debe tener altitud terrestre");
const plottedSouth=polarChart.defined.find(x=>x.id==="polar_south_ice");
assert(plottedSouth,"Polo Sur debe figurar en la gráfica");
assert.deepEqual({min:plottedSouth.latitude.min,max:plottedSouth.latitude.max},{min:65,max:90},"Latitud de Polo Sur");
assert.deepEqual({min:plottedSouth.elevation.min,max:plottedSouth.elevation.max},{min:1,max:100},"Escala Evolve para Polo Sur");
assert(!Object.hasOwn(plottedSouth,"depth"),"Polo Sur no tiene profundidad marina");
assert(chartSource.includes('biome?.id==="polar"'),"Polo debe tener vistas separadas");
assert(chartSource.includes('id:"polar_land"'),"Polo Sur debe utilizar eje de altura Evolve");
for(const biome of catalog.biomes.filter(b=>b.id!=="forest"&&b.id!=="desert"&&b.id!=="plains"&&b.id!=="marine"&&b.id!=="polar")){
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

console.log("PASS: 7 biomas, 23 subbiomas; ambos Polos aprobados (una masa cada uno), 20 definidos y 3 pendientes");
