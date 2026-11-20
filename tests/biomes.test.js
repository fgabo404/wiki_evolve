"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const read=p=>fs.readFileSync(path.join(__dirname,"..",p),"utf8");
const catalog=JSON.parse(read("data/biomes/biomes.json"));
assert(Array.isArray(catalog.biomes),"biomes.json debe contener biomes[]");
const allSubbiomes=catalog.biomes.flatMap(biome=>biome.subbiomes);

const mineralCatalog=JSON.parse(read("data/resources/resouce.json"));
assert(Array.isArray(mineralCatalog.minerals),"resouce.json debe tener grupo minerals");
assert.equal(mineralCatalog.minerals.length,55,"55 minerales en el catálogo global");
const mineralIds=mineralCatalog.minerals.map(m=>m.id);
assert.equal(new Set(mineralIds).size,55,"IDs de minerales sin duplicados");
assert(mineralCatalog.minerals.every(m=>/^[a-z][A-Za-z0-9]*$/.test(m.id)&&m.name?.es&&m.description?.es),"mineral global con id camelCase, nombre y descripción");
assert.equal(allSubbiomes.filter(s=>Array.isArray(s.minerales)).length,23,"los 23 subbiomas deben definir minerales");
const mineralReferences=allSubbiomes.flatMap(s=>s.minerales.map(m=>m.id));
assert.equal(mineralReferences.length,521,"total de referencias minerales por subbioma");
assert.deepEqual([...new Set(mineralReferences)].sort(),[...mineralIds].sort(),"cada mineral global debe aparecer en al menos un subbioma y ninguna referencia quedar huérfana");
for(const sub of allSubbiomes){
 assert(sub.minerales.length>0,"todos los subbiomas tienen alguna posibilidad mineral: "+sub.id);
 assert.equal(new Set(sub.minerales.map(m=>m.id)).size,sub.minerales.length,"mineral repetido en subbioma: "+sub.id);
 for(const entry of sub.minerales){
  assert(mineralIds.includes(entry.id),"referencia de mineral desconocido: "+entry.id);
  const spawn=entry.spawn;
  assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"yacimientos min/max inválidos: "+entry.id);
  assert(typeof spawn.surface?.outcrop==="boolean","afloramiento debe ser booleano: "+entry.id);
  assert(Number.isInteger(spawn.surface.min)&&Number.isInteger(spawn.surface.max)&&spawn.surface.min===0&&spawn.surface.max>=0&&spawn.surface.max<=spawn.max,"cantidad superficial inválida: "+entry.id);
  if(!spawn.surface.outcrop)assert.equal(spawn.surface.max,0,"sin afloramiento no puede asignarse cuota superficial");
  const d=spawn.underground;
  assert(Number.isInteger(d?.min)&&Number.isInteger(d?.max)&&d.min>=-20&&d.max<=0&&d.min<=d.max,"profundidad fuera de 0 a -20: "+entry.id);
 }
}
assert.deepEqual(allSubbiomes.find(s=>s.id==="forest_tropical").minerales.find(m=>m.id==="malaquita"),{
 id:"malaquita",spawn:{min:1,max:4,surface:{outcrop:true,min:0,max:2},underground:{min:-4,max:0}}
},"malaquita en Selva debe conservar el contrato aprobado y profundidad de diseño");
assert(allSubbiomes.filter(s=>s.spawn.required.terrain==="water").every(s=>s.minerales.every(m=>!m.spawn.surface.outcrop)),"la superficie subacuática no debe fingir afloramiento visible en tierra");
assert.equal(allSubbiomes.find(s=>s.id==="forest_tropical").fauna.length,42,"preservar la fauna de Selva");

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

const steppeFaunaExpected=[
 ["caballoSalvaje",2,7,"herd",5,20],["asnoSalvaje",2,7,"herd",5,18],["gacela",3,10,"herd",6,25],["uro",1,5,"herd",4,15],["bisonte",1,6,"herd",6,25],["muflon",1,5,"herd",4,15],["cabraSalvaje",1,5,"herd",4,12],["ciervo",1,6,"herd",3,12],["lobo",1,5,"group",3,8],["zorro",1,6,"solitary"],["lince",1,4,"solitary"],["puma",1,3,"solitary"],["osoPardo",1,3,"solitary"],["tejon",1,5,"group",2,6],["liebre",4,16,"solitary"],["raton",5,20,"group",3,12],["hamsterSalvaje",3,12,"solitary"],["zorrillo",1,6,"solitary"],["aguila",1,4,"pair"],["buho",1,5,"solitary"],["condorAndino",1,3,"pair"],["vibora",1,7,"solitary"],["lagarto",2,9,"solitary"],["hormigas",3,12,"colony",500,30000],["abejas",1,6,"colony",500,15000],["aranas",5,20,"solitary"]
];
const steppeExpectedEntries=steppeFaunaExpected.map(([id,min,max,socialMode,gmin,gmax])=>({
 id,spawn:{min,max,socialMode,...(gmin===undefined?{}:{groupSize:{min:gmin,max:gmax}})}
}));
const steppeSubbiome=catalog.biomes.find(b=>b.id==="plains").subbiomes.find(s=>s.id==="plains_steppe");
assert.equal(steppeFaunaExpected.length,26,"exactamente 26 animales salvajes aprobados para Estepa");
assert.deepEqual(steppeSubbiome.fauna,steppeExpectedEntries,"preservar exactamente los 26 registros aprobados de Estepa y su orden");
assert.equal(new Set(steppeSubbiome.fauna.map(x=>x.id)).size,26,"IDs únicos en Estepa");
for(const {id,spawn} of steppeSubbiome.fauna){
 assert(/^[a-z][A-Za-z0-9]*$/.test(id),"ID camelCase inválido en Estepa: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn inválido en Estepa: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"socialMode inválido de Estepa: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"solitario o pareja no debe incluir groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize inválido de Estepa: "+id);
}
for(const [id,count] of [["forest_tropical",42],["forest_cloud",41],["forest_temperate",39],["forest_boreal",42],["forest_subalpine",37],["forest_redwood",26],["forest_wooded_swamp",43],["plains_savanna",31],["plains_prairie",31]]){
 assert.equal(allSubbiomes.find(s=>s.id===id).fauna.length,count,"preservar fauna anterior de "+id);
}
assert.equal(allSubbiomes.flatMap(s=>s.minerales).length,521,"conservar 521 referencias minerales");
assert.equal(mineralCatalog.minerals.length,55,"conservar 55 minerales globales");

const prairieFaunaExpected=[
 ["uro",2,6,"herd",5,18],["bisonte",2,7,"herd",8,30],["caballoSalvaje",2,7,"herd",5,20],["asnoSalvaje",1,5,"herd",4,15],["ciervo",2,7,"herd",4,15],["venado",2,8,"herd",4,15],["alce",1,4,"solitary"],["jabali",1,5,"herd",4,12],["muflon",1,5,"herd",5,15],["cabraSalvaje",1,5,"herd",4,12],["lobo",1,5,"group",3,8],["puma",1,3,"solitary"],["coyote",1,5,"pair"],["zorro",1,6,"solitary"],["lince",1,4,"solitary"],["osoPardo",1,3,"solitary"],["tejon",1,5,"group",2,6],["zorrillo",2,8,"solitary"],["mapache",1,6,"solitary"],["liebre",4,16,"solitary"],["conejo",3,12,"group",2,8],["puercoespin",1,5,"solitary"],["murcielago",1,7,"colony",10,100],["aguila",1,4,"pair"],["buho",1,5,"solitary"],["buitre",1,6,"flock",4,15],["codornizSalvaje",3,10,"flock",5,20],["ganso",2,8,"flock",5,25],["vibora",1,7,"solitary"],["hormigas",3,12,"colony",1000,40000],["abejas",2,8,"colony",1000,20000]
];
const prairieExpectedEntries=prairieFaunaExpected.map(([id,min,max,socialMode,gmin,gmax])=>({
 id,spawn:{min,max,socialMode,...(gmin===undefined?{}:{groupSize:{min:gmin,max:gmax}})}
}));
const prairieSubbiome=catalog.biomes.find(b=>b.id==="plains").subbiomes.find(s=>s.id==="plains_prairie");
assert.equal(prairieFaunaExpected.length,31,"exactamente 31 animales salvajes aprobados para Pradera");
assert.deepEqual(prairieSubbiome.fauna,prairieExpectedEntries,"preservar exactamente los 31 registros completos de Pradera y su orden");
assert.equal(new Set(prairieSubbiome.fauna.map(x=>x.id)).size,31,"IDs únicos de fauna de Pradera");
for(const {id,spawn} of prairieSubbiome.fauna){
 assert(/^[a-z][A-Za-z0-9]*$/.test(id),"ID camelCase inválido en Pradera: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn inválido de Pradera: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"socialMode inválido de Pradera: "+id);
 if(["solitary","pair"].includes(spawn.socialMode)) assert(!Object.hasOwn(spawn,"groupSize"),"solitario o pareja no incluye groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize inválido de Pradera: "+id);
}
for(const [id,count] of [["forest_tropical",42],["forest_cloud",41],["forest_temperate",39],["forest_boreal",42],["forest_subalpine",37],["forest_redwood",26],["forest_wooded_swamp",43],["plains_savanna",31]]){
 const s=allSubbiomes.find(s=>s.id===id);
 assert.equal(s.fauna.length,count,"conservar fauna anterior de "+id);
}
assert.equal(allSubbiomes.flatMap(s=>s.minerales).length,521,"conservar 521 referencias minerales");
assert.equal(mineralCatalog.minerals.length,55,"conservar 55 minerales globales");

const savannaFaunaExpected=[
 ["leon",1,4,"group",4,12],["leopardo",1,4,"solitary"],["guepardo",1,4,"solitary"],["hienaManchada",1,5,"group",8,30],["serval",1,5,"solitary"],["zorro",1,5,"solitary"],["elefanteAfricano",1,4,"herd",6,20],["rinoceronteNegro",1,3,"solitary"],["hipopotamo",1,4,"herd",5,25],["jirafa",2,6,"herd",3,12],["bufaloAfricano",2,7,"herd",8,30],["nu",3,10,"herd",10,40],["cebra",3,9,"herd",5,20],["impala",3,10,"herd",8,30],["gacela",3,10,"herd",5,25],["jabali",1,5,"herd",3,10],["armadillo",2,7,"solitary"],["liebre",3,12,"solitary"],["raton",5,20,"group",3,12],["suricata",2,7,"group",5,20],["puercoespin",1,6,"pair"],["avestruz",2,7,"group",3,12],["aguila",1,5,"pair"],["buitre",2,8,"flock",4,15],["pintadaSalvaje",3,10,"flock",8,25],["cocodrilo",1,5,"solitary"],["vibora",2,8,"solitary"],["tortugaTerrestre",2,8,"solitary"],["termitas",3,12,"colony",1000,50000],["hormigas",4,14,"colony",1000,50000],["abejas",2,8,"colony",1000,25000]
];
const savannaExpectedEntries=savannaFaunaExpected.map(([id,min,max,socialMode,gmin,gmax])=>({
 id,spawn:{min,max,socialMode,...(gmin===undefined?{}:{groupSize:{min:gmin,max:gmax}})}
}));
const savannaSubbiome=catalog.biomes.find(b=>b.id==="plains").subbiomes.find(s=>s.id==="plains_savanna");
assert.equal(savannaFaunaExpected.length,31,"exactamente 31 animales salvajes aprobados para Sabana");
assert.deepEqual(savannaSubbiome.fauna,savannaExpectedEntries,"conservar exactamente los 31 registros completos de Sabana en el orden aprobado");
assert.equal(new Set(savannaSubbiome.fauna.map(e=>e.id)).size,31,"sin IDs duplicados en Sabana");
for(const {id,spawn} of savannaSubbiome.fauna){
 assert(/^[a-z][A-Za-z0-9]*$/.test(id),"ID de Sabana no es camelCase: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn de Sabana inválido: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"socialMode inválido en Sabana: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"solitario o pareja no debe contener groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize inválido en Sabana: "+id);
}
for(const [id,count] of [["forest_tropical",42],["forest_cloud",41],["forest_temperate",39],["forest_boreal",42],["forest_subalpine",37],["forest_redwood",26],["forest_wooded_swamp",43]]){
 assert.equal(forest.subbiomes.find(s=>s.id===id).fauna.length,count,"conservar fauna anterior: "+id);
}
assert.equal(allSubbiomes.flatMap(s=>s.minerales).length,521,"conservar las 521 referencias de minerales");
assert.equal(mineralCatalog.minerals.length,55,"conservar los 55 minerales del catálogo global");

const woodedSwampFaunaExpected=[
 ["jaguar",1,3,"solitary"],["ocelote",1,4,"solitary"],["coyote",1,5,"pair"],["zorro",1,5,"solitary"],["osoNegro",1,3,"solitary"],["mapache",2,10,"solitary"],["venado",2,8,"herd",3,12],["jabali",2,7,"herd",4,12],["nutria",2,7,"group",2,8],["capibara",2,8,"herd",5,20],["raton",5,20,"group",3,12],["murcielago",2,9,"colony",20,150],["caiman",2,8,"solitary"],["cocodrilo",1,5,"solitary"],["anaconda",1,4,"solitary"],["vibora",2,8,"solitary"],["iguana",2,9,"solitary"],["tortugaAguaDulce",3,12,"solitary"],["tortugaMordedora",1,6,"solitary"],["rana",5,20,"group",5,15],["garza",2,8,"solitary"],["ciguena",1,5,"pair"],["espatulaRosada",2,7,"flock",3,15],["flamenco",1,5,"flock",10,40],["pelicano",1,6,"flock",5,20],["aguila",1,3,"pair"],["aguilaPescadora",1,4,"pair"],["buho",1,6,"solitary"],["pato",3,12,"flock",5,25],["ganso",2,8,"flock",5,20],["pajaroCarpintero",2,7,"pair"],["bagre",3,12,"group",3,12],["pirana",2,10,"school",5,25],["anguilaElectrica",1,4,"solitary"],["carpa",3,12,"school",5,20],["perca",2,10,"school",5,20],["tilapia",3,12,"school",5,25],["cangrejoRio",3,12,"solitary"],["camaronRio",4,16,"group",5,25],["hormigas",4,14,"colony",1000,50000],["termitas",3,10,"colony",2000,100000],["abejas",2,8,"colony",1000,25000],["aranas",7,25,"solitary"]
];
const woodedSwampExpectedEntries=woodedSwampFaunaExpected.map(([id,min,max,socialMode,gmin,gmax])=>({
 id,spawn:{min,max,socialMode,...(gmin===undefined?{}:{groupSize:{min:gmin,max:gmax}})}
}));
const woodedSwampSubbiome=forest.subbiomes.find(s=>s.id==="forest_wooded_swamp");
assert.equal(woodedSwampFaunaExpected.length,43,"exactamente 43 animales aprobados para Pantano arbolado");
assert.deepEqual(woodedSwampSubbiome.fauna,woodedSwampExpectedEntries,"conservar exactamente los 43 registros y orden aprobados del Pantano arbolado");
assert.equal(new Set(woodedSwampSubbiome.fauna.map(x=>x.id)).size,43,"no duplicar fauna en Pantano arbolado");
for(const {id,spawn} of woodedSwampSubbiome.fauna){
 assert(/^[a-z][A-Za-z0-9]*$/.test(id),"ID inválido en Pantano arbolado: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn inválido en Pantano arbolado: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"socialMode inválido en Pantano arbolado: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"solitario o pareja no debe incluir groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize inválido en Pantano arbolado: "+id);
}
for(const [id,count] of [["forest_tropical",42],["forest_cloud",41],["forest_temperate",39],["forest_boreal",42],["forest_subalpine",37],["forest_redwood",26]]){
 assert.equal(forest.subbiomes.find(s=>s.id===id).fauna.length,count,"conservar fauna de bosques anteriores: "+id);
}
assert.equal(allSubbiomes.flatMap(s=>s.minerales).length,521,"conservar las 521 referencias de minerales");
assert.equal(mineralCatalog.minerals.length,55,"conservar 55 minerales del catálogo global");

const redwoodFaunaExpected=[
 ["puma",1,3,"solitary"],["lobo",1,4,"group",3,8],["zorro",1,6,"solitary"],["coyote",1,5,"pair"],["osoPardo",1,4,"solitary"],["venado",2,8,"herd",4,15],["alce",1,4,"solitary"],["mapache",2,9,"solitary"],["castor",1,4,"group",3,8],["ardilla",4,16,"solitary"],["raton",5,20,"group",3,12],["conejo",3,12,"group",2,8],["liebre",2,9,"solitary"],["murcielago",2,9,"colony",10,120],["aguila",1,3,"pair"],["buho",1,6,"solitary"],["paloma",3,10,"flock",5,20],["rana",4,16,"group",3,12],["salmon",1,6,"school",5,25],["trucha",2,10,"school",3,12],["bagre",2,8,"group",3,10],["cangrejoRio",3,12,"solitary"],["hormigas",3,12,"colony",1000,50000],["abejas",2,8,"colony",1000,25000],["aranas",7,28,"solitary"],["lombrices",12,45,"solitary"]
];
const redwoodExpectedEntries=redwoodFaunaExpected.map(([id,min,max,socialMode,gmin,gmax])=>({
 id,spawn:{min,max,socialMode,...(gmin===undefined?{}:{groupSize:{min:gmin,max:gmax}})}
}));
const redwoodSubbiome=forest.subbiomes.find(s=>s.id==="forest_redwood");
assert.equal(redwoodFaunaExpected.length,26,"exactamente 26 animales aprobados para Redwood");
assert.deepEqual(redwoodSubbiome.fauna,redwoodExpectedEntries,"preservar los 26 registros completos y su orden tal como fueron aprobados");
assert.equal(new Set(redwoodSubbiome.fauna.map(e=>e.id)).size,26,"sin fauna duplicada en Redwood");
for(const {id,spawn} of redwoodSubbiome.fauna){
 assert(/^[a-z][A-Za-z0-9]*$/.test(id),"ID camelCase inválido en Redwood: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn inválido en Redwood: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"socialMode inválido en Redwood: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"solitario o pareja no debe incluir groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize inválido en Redwood: "+id);
}
for(const [id,count] of [["forest_tropical",42],["forest_cloud",41],["forest_temperate",39],["forest_boreal",42],["forest_subalpine",37]]){
 assert.equal(forest.subbiomes.find(s=>s.id===id).fauna.length,count,"preservar la fauna anterior: "+id);
}
assert.equal(allSubbiomes.flatMap(s=>s.minerales).length,521,"preservar las 521 referencias minerales");
assert.equal(mineralCatalog.minerals.length,55,"preservar los 55 minerales del catálogo global");

const subalpineFaunaExpected=[
 ["lobo",1,4,"group",3,8],["zorro",1,5,"solitary"],["puma",1,3,"solitary"],["lince",1,4,"solitary"],["osoPardo",1,3,"solitary"],["osoNegro",1,3,"solitary"],["gloton",1,3,"solitary"],["alce",1,4,"solitary"],["ciervo",1,6,"herd",3,12],["venado",1,6,"herd",3,10],["cabraMontesa",2,6,"herd",4,12],["ibice",2,6,"herd",5,15],["ovejaCimarrona",1,5,"herd",5,15],["yak",1,4,"herd",5,15],["bisonte",1,3,"herd",4,12],["jabali",1,4,"herd",3,10],["marta",1,5,"solitary"],["nutria",1,4,"group",2,6],["castor",1,3,"group",3,8],["liebre",2,10,"solitary"],["conejo",2,8,"group",2,8],["ardilla",3,12,"solitary"],["puercoespin",1,5,"solitary"],["murcielago",1,6,"colony",10,80],["aguila",1,3,"pair"],["buho",1,5,"solitary"],["pajaroCarpintero",1,6,"pair"],["rana",2,10,"group",3,10],["sapo",1,8,"solitary"],["trucha",2,8,"school",3,12],["salmon",1,5,"school",5,20],["perca",1,6,"school",4,15],["cangrejoRio",1,7,"solitary"],["hormigas",2,8,"colony",500,20000],["abejas",1,5,"colony",500,10000],["aranas",4,16,"solitary"],["lombrices",6,25,"solitary"]
];
const subalpineExpectedEntries=subalpineFaunaExpected.map(([id,min,max,socialMode,gmin,gmax])=>({
 id,spawn:{min,max,socialMode,...(gmin===undefined?{}:{groupSize:{min:gmin,max:gmax}})}
}));
const subalpineSubbiome=forest.subbiomes.find(s=>s.id==="forest_subalpine");
assert.equal(subalpineFaunaExpected.length,37,"exactamente 37 animales aprobados en Bosque subalpino");
assert.deepEqual(subalpineSubbiome.fauna,subalpineExpectedEntries,"preservar valores exactos y orden de los 37 registros aprobados");
assert.equal(new Set(subalpineSubbiome.fauna.map(e=>e.id)).size,37,"no duplicar IDs de fauna subalpina");
for(const {id,spawn} of subalpineSubbiome.fauna){
 assert(/^[a-z][a-zA-Z0-9]*$/.test(id),"ID inválido en Bosque subalpino: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn inválido en Bosque subalpino: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"socialMode inválido en Bosque subalpino: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"solo/pareja no debe incluir groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize inválido en Bosque subalpino: "+id);
}
for(const [id,count] of [["forest_tropical",42],["forest_cloud",41],["forest_temperate",39],["forest_boreal",42]]){
 assert.equal(forest.subbiomes.find(s=>s.id===id).fauna.length,count,"preservar fauna anterior: "+id);
}
assert.equal(allSubbiomes.flatMap(s=>s.minerales).length,521,"preservar 521 referencias minerales");
assert.equal(mineralCatalog.minerals.length,55,"preservar 55 minerales globales");

const borealFaunaExpected=[
 ["lobo",1,5,"group",3,8],["zorro",1,6,"solitary"],["zorroArtico",1,4,"solitary"],["puma",1,3,"solitary"],["lince",1,5,"solitary"],["tigre",1,3,"solitary"],["osoPardo",1,4,"solitary"],["osoNegro",1,4,"solitary"],["alce",1,6,"solitary"],["reno",2,7,"herd",5,25],["ciervo",2,7,"herd",4,15],["venado",2,7,"herd",3,12],["bisonte",1,4,"herd",5,15],["jabali",1,5,"herd",4,12],["tejon",1,5,"group",2,6],["nutria",1,5,"group",2,6],["castor",1,5,"group",3,8],["mapache",1,6,"solitary"],["liebre",3,12,"solitary"],["conejo",2,10,"group",2,8],["raton",5,20,"group",3,12],["murcielago",1,7,"colony",10,100],["halcon",1,5,"pair"],["buho",1,6,"solitary"],["pajaroCarpintero",2,8,"pair"],["cisne",1,4,"pair"],["ganso",2,8,"flock",5,25],["pato",3,10,"flock",5,20],["grulla",1,5,"pair"],["rana",3,12,"group",3,10],["sapo",2,10,"solitary"],["salamandra",1,7,"solitary"],["vibora",1,6,"solitary"],["trucha",2,9,"school",3,12],["salmon",1,6,"school",5,25],["perca",2,10,"school",5,20],["bagre",1,6,"group",3,10],["cangrejoRio",2,8,"solitary"],["hormigas",2,9,"colony",1000,30000],["abejas",1,6,"colony",1000,15000],["aranas",5,20,"solitary"],["lombrices",8,30,"solitary"]
];
const borealExpectedEntries=borealFaunaExpected.map(([id,min,max,socialMode,groupMin,groupMax])=>({
 id,spawn:{min,max,socialMode,...(groupMin===undefined?{}:{groupSize:{min:groupMin,max:groupMax}})}
}));
const borealSubbiome=forest.subbiomes.find(s=>s.id==="forest_boreal");
assert.equal(borealFaunaExpected.length,42,"42 animales aprobados en Bosque boreal");
assert.deepEqual(borealSubbiome.fauna,borealExpectedEntries,"conservar exactamente los 42 registros completos aprobados de Bosque boreal");
assert.equal(new Set(borealSubbiome.fauna.map(x=>x.id)).size,42,"sin fauna duplicada en Bosque boreal");
for(const {id,spawn} of borealSubbiome.fauna){
 assert(/^[a-z][A-Za-z0-9]*$/.test(id),"ID camelCase inválido en Bosque boreal: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn boreal inválido: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"socialMode boreal inválido: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"solitario o pareja no debe incluir groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize boreal inválido: "+id);
}
assert.equal(forest.subbiomes.find(s=>s.id==="forest_tropical").fauna.length,42,"Selva conserva sus 42 animales");
assert.equal(forest.subbiomes.find(s=>s.id==="forest_cloud").fauna.length,41,"Bosque nuboso conserva sus 41 animales");
assert.equal(forest.subbiomes.find(s=>s.id==="forest_temperate").fauna.length,39,"Bosque templado conserva sus 39 animales");
assert.equal(allSubbiomes.flatMap(s=>s.minerales).length,521,"conservar las 521 referencias de minerales");
assert.equal(mineralCatalog.minerals.length,55,"conservar los 55 minerales globales");

const temperateFaunaExpected=[
 ["lobo",1,5,"group",3,8],["zorro",1,6,"solitary"],["puma",1,3,"solitary"],["lince",1,4,"solitary"],["osoPardo",1,4,"solitary"],["osoNegro",1,4,"solitary"],
 ["ciervo",2,8,"herd",4,15],["alce",1,5,"solitary"],["jabali",2,7,"herd",4,15],["tejon",1,5,"group",2,6],["mapache",2,10,"solitary"],["zarigueya",2,8,"solitary"],["nutria",1,5,"group",2,6],["castor",1,5,"group",3,8],["zorrillo",2,8,"solitary"],["conejo",3,14,"group",2,8],["liebre",3,12,"solitary"],["ardilla",4,16,"solitary"],["raton",5,22,"group",3,12],["murcielago",2,10,"colony",10,150],
 ["aguila",1,3,"pair"],["buho",1,6,"solitary"],["pajaroCarpintero",2,8,"pair"],["ruisenor",3,12,"solitary"],["paloma",3,12,"flock",5,20],["tortola",2,10,"pair"],["pavoSilvestre",1,6,"flock",4,15],
 ["vibora",2,8,"solitary"],["lagarto",3,12,"solitary"],["tortugaAguaDulce",1,6,"solitary"],["trucha",2,10,"school",3,12],["salmon",1,6,"school",5,25],["carpa",2,9,"school",4,15],["bagre",2,9,"group",3,10],["cangrejoRio",3,12,"solitary"],["hormigas",3,12,"colony",1000,60000],["abejas",2,8,"colony",1000,25000],["aranas",6,25,"solitary"],["lombrices",12,45,"solitary"]
];
const temperateExpectedEntries=temperateFaunaExpected.map(([id,min,max,socialMode,groupMin,groupMax])=>({
 id,spawn:{min,max,socialMode,...(groupMin===undefined?{}:{groupSize:{min:groupMin,max:groupMax}})}
}));
const temperateSubbiome=forest.subbiomes.find(s=>s.id==="forest_temperate");
assert.equal(temperateFaunaExpected.length,39,"exactamente 39 animales aprobados de Bosque templado");
assert.deepEqual(temperateSubbiome.fauna,temperateExpectedEntries,"conservar los 39 registros completos de Bosque templado exactamente aprobados");
assert.equal(new Set(temperateSubbiome.fauna.map(a=>a.id)).size,39,"sin fauna repetida en Bosque templado");
for(const {id,spawn} of temperateSubbiome.fauna){
 assert(/^[a-z][A-Za-z0-9]*$/.test(id),"ID de fauna templada no está en camelCase: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn templado inválido: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"socialMode templado inválido: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"solitario o pareja sin groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize templado inválido: "+id);
}
assert.equal(forest.subbiomes.find(s=>s.id==="forest_tropical").fauna.length,42,"Selva conserva los 42 animales");
assert.equal(forest.subbiomes.find(s=>s.id==="forest_cloud").fauna.length,41,"Bosque nuboso conserva los 41 animales");
assert.equal(allSubbiomes.flatMap(s=>s.minerales).length,521,"se conservan 521 referencias minerales");
assert.equal(mineralCatalog.minerals.length,55,"se conservan los 55 minerales globales");

const cloudFaunaExpected=[
 ["jaguar",1,3,"solitary"],["puma",1,4,"solitary"],["ocelote",1,5,"solitary"],["leopardo",1,3,"solitary"],["tigre",1,2,"solitary"],["osoNegro",1,4,"solitary"],
 ["venado",2,8,"herd",3,12],["jabali",2,6,"herd",4,15],["armadillo",2,9,"solitary"],["pangolin",1,4,"solitary"],["tejon",1,6,"group",2,6],["raton",5,20,"group",3,12],["monoCapuchino",1,6,"group",8,20],["lemur",1,6,"group",4,15],["ardilla",3,12,"solitary"],["zarigueya",2,8,"solitary"],
 ["quetzal",1,5,"pair"],["tucan",1,6,"flock",3,8],["loro",2,9,"flock",5,20],["guacamaya",1,5,"flock",4,12],["colibri",4,15,"solitary"],["pajaroCarpintero",2,9,"pair"],["buho",1,5,"solitary"],["lechuza",1,5,"solitary"],["aguila",1,3,"pair"],["murcielago",2,10,"colony",10,150],
 ["rana",5,22,"group",3,12],["sapo",3,15,"solitary"],["vibora",2,8,"solitary"],["iguana",1,6,"solitary"],["nutria",1,4,"group",2,6],["trucha",2,10,"school",3,12],["bagre",2,9,"group",3,10],["cangrejoRio",3,12,"solitary"],["camaronRio",3,12,"group",4,20],["hormigas",3,12,"colony",1000,60000],["termitas",2,8,"colony",1000,50000],["lombrices",12,45,"solitary"],["abejas",2,8,"colony",1000,25000],["aranas",6,25,"solitary"],["luciernagas",3,12,"swarm",5,35]
];
const cloudFauna=forest.subbiomes.find(sub=>sub.id==="forest_cloud").fauna;
const cloudExpectedEntries=cloudFaunaExpected.map(([id,min,max,socialMode,gmin,gmax])=>({
 id,spawn:{min,max,socialMode,...(gmin===undefined?{}:{groupSize:{min:gmin,max:gmax}})}
}));
assert.equal(cloudFaunaExpected.length,41,"exactamente 41 especies/grupos aprobados para Bosque nuboso");
assert.deepEqual(cloudFauna,cloudExpectedEntries,"la configuración completa de los 41 animales debe permanecer idéntica a la aprobada");
assert.equal(new Set(cloudFauna.map(e=>e.id)).size,41,"sin IDs duplicados en Bosque nuboso");
for(const {id,spawn} of cloudFauna){
 assert(/^[a-z][A-Za-z0-9]*$/.test(id),"ID camelCase inválido en Bosque nuboso: "+id);
 assert(Number.isInteger(spawn.min)&&spawn.min>=1&&Number.isInteger(spawn.max)&&spawn.max>=spawn.min,"spawn mínimo y máximo inválidos: "+id);
 assert(["solitary","pair","group","herd","flock","school","colony","swarm"].includes(spawn.socialMode),"modo social inválido: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"individual o pareja no deben tener groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize inválido: "+id);
}
assert.equal(forest.subbiomes.find(sub=>sub.id==="forest_tropical").fauna.length,42,"fauna previa de Selva intacta");
assert.equal(allSubbiomes.flatMap(sub=>sub.minerales).length,521,"521 referencias minerales conservadas");
assert.deepEqual(allSubbiomes.filter(sub=>sub.fauna).map(sub=>sub.id),["forest_tropical","forest_cloud","forest_temperate","forest_boreal","forest_subalpine","forest_redwood","forest_wooded_swamp","plains_savanna","plains_prairie","plains_steppe"],"los siete bosques, Sabana, Pradera y Estepa cuentan con fauna aprobada");

const tropicalFaunaIds=["jaguar","ocelote","puma","tigre","leopardo","elefante","gorila","jabali","bufaloBosque","gaur","armadillo","pangolin","civeta","raton","lombrices","termitas","hormigas","tarantula","monoCapuchino","ardilla","iguana","guacamaya","loro","tucan","aguilaHarpia","buho","quetzal","caiman","cocodrilo","anaconda","nutria","capibara","bagre","pirana","anguilaElectrica","cangrejoRio","vibora","lagarto","abejas","moscas","aranas","murcielago"];
const tropicalSubbiome=catalog.biomes.find(b=>b.id==="forest").subbiomes.find(s=>s.id==="forest_tropical");
assert.deepEqual(tropicalSubbiome.fauna.map(x=>x.id),tropicalFaunaIds,"42 IDs de Selva deben coincidir con la selección aprobada, sin prefijos");
assert.equal(new Set(tropicalFaunaIds).size,42,"no hay fauna duplicada");
const tropicalFaunaMap=new Map(tropicalSubbiome.fauna.map(x=>[x.id,x.spawn]));
for(const {id,spawn} of tropicalSubbiome.fauna){
 assert(/^[a-z][a-zA-Z0-9]*$/.test(id),"ID de fauna no está en camelCase: "+id);
 assert(Number.isInteger(spawn.min)&&Number.isInteger(spawn.max)&&spawn.min>=1&&spawn.max>=spawn.min,"spawn debe tener mínimo al menos 1: "+id);
 assert(["solitary","pair","group","herd","flock","school","swarm","colony"].includes(spawn.socialMode),"socialMode desconocido: "+id);
 if(["solitary","pair"].includes(spawn.socialMode))assert(!Object.hasOwn(spawn,"groupSize"),"solo/pareja no requieren groupSize: "+id);
 else assert(Number.isInteger(spawn.groupSize?.min)&&Number.isInteger(spawn.groupSize?.max)&&spawn.groupSize.min>=2&&spawn.groupSize.max>=spawn.groupSize.min,"groupSize inválido: "+id);
}
for(const id of ["puma","gorila","aguilaHarpia","quetzal","cocodrilo","anaconda","anguilaElectrica"])
 assert.equal(tropicalFaunaMap.get(id).min,1,"mínimo corregido a uno: "+id);
assert.deepEqual(tropicalFaunaMap.get("jaguar"),{min:2,max:5,socialMode:"solitary"},"no reducir los jaguares aprobados");
assert.deepEqual(tropicalFaunaMap.get("gorila"),{min:1,max:2,socialMode:"group",groupSize:{min:3,max:6}},"conservar tamaño original de grupo de gorilas");
assert.deepEqual(tropicalFaunaMap.get("gaur"),{min:1,max:2,socialMode:"herd",groupSize:{min:2,max:4}},"conservar manada original de gaur");
assert.deepEqual(tropicalFaunaMap.get("hormigas"),{min:3,max:15,socialMode:"colony",groupSize:{min:1000,max:100000}},"conservar colonia de hormigas");
assert.deepEqual(catalog.biomes.flatMap(b=>b.subbiomes).filter(x=>x.fauna).map(x=>x.id),["forest_tropical","forest_cloud","forest_temperate","forest_boreal","forest_subalpine","forest_redwood","forest_wooded_swamp","plains_savanna","plains_prairie","plains_steppe"],"los siete bosques, Sabana, Pradera y Estepa tienen fauna aprobada actualmente");

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
assert.equal(allSubbiomes.filter(x=>x.description).length,23,"los 23 subbiomas deben tener descripción bilingüe");
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
assert(tundraBiome.description.es.includes("Alaska, Canadá y Siberia")&&tundraBiome.description.en.includes("Alaska, Canada and Siberia"),"Tundra ártica debe mantener referencia geográfica");
assert(tundraBiome.description.es.includes("tundra alpina")&&tundraBiome.description.en.includes("alpine tundra"),"Tundra incorpora variante alpina sin nuevo subbioma");
assert.deepEqual(tundraBiome.spawn.required,{
 terrain:"land",elevationLevel:{min:1,max:94},meanAnnualTemperatureC:{min:-25,max:5},
 annualPrecipitationMm:{min:100,max:1200},treeCanopyCoverPercent:{max:10}
},"Tundra conserva las cinco condiciones comunes aprobadas");
assert.deepEqual(tundraBiome.spawn.preferred,{absoluteLatitudeDegrees:{min:0,max:90}},"la latitud general no excluye la tundra alpina");
assert.equal(tundraBiome.regionPlacement.mode,"anyOf","variantes de Tundra son rutas alternativas, no acumulativas");
assert.deepEqual(tundraBiome.regionPlacement.alternatives,[
 {id:"arctic",name:{es:"Tundra ártica",en:"Arctic tundra"},mode:"highLatitude",hemisphere:"north",preferred:{absoluteLatitudeDegrees:{min:60,max:80},elevationLevel:{min:1,max:55}}},
 {id:"alpine",name:{es:"Tundra alpina",en:"Alpine tundra"},mode:"mountainDependent",belt:"aboveLocalTreeline",preferred:{absoluteLatitudeDegrees:{min:0,max:90},elevationLevel:{min:60,max:94}}}
],"Tundra ártica y alpina deben tener emplazamientos diferentes, sin duplicar el subbioma");
assert(!Object.hasOwn(tundraBiome.spawn.required,"permafrostRequired"),"el permafrost no es requisito universal");
assert.deepEqual(tundraBiome.distribution,{targetLandPercent:null,percentBasis:"unavailable",minRegions:2,maxRegions:4},"Tundra debe tener de 2 a 4 masas conectadas aprobadas");
const mountain=catalog.biomes.find(b=>b.id==="mountain");
assert(mountain&&mountain.subbiomes.length===2,"Montaña tiene dos subbiomas");
assert.deepEqual(mountain.subbiomes.map(s=>s.id),["mountain_rocky","mountain_summits"]);
const mountainRocky=mountain.subbiomes[0],mountainSummits=mountain.subbiomes[1];
assert(mountainRocky.description.es.includes("amarillo")&&mountainRocky.description.en.includes("yellow"),"Montaña rocosa corresponde a la zona amarilla");
assert(mountainSummits.description.es.includes("rojo")&&mountainSummits.description.en.includes("red"),"Cumbres corresponde a la zona roja");
assert.deepEqual(mountainRocky.spawn.required,{
 terrain:"land",elevationLevel:{min:25,max:89},slopeDegrees:{min:15,max:90},dominantSurfaceMaterial:"rock_gravel"
},"Montaña rocosa conserva altura, pendiente y roca aprobadas");
assert.deepEqual(mountainRocky.spawn.preferred,{
 elevationLevel:{min:45,max:80},slopeDegrees:{min:20,max:55},absoluteLatitudeDegrees:{min:0,max:90}
},"Preferencias de Montaña rocosa");
assert.deepEqual(mountainRocky.regionPlacement,{mode:"mountainDependent",belt:"exposedRockySlope"},"Montaña rocosa requiere ladera expuesta");
assert.deepEqual(mountainSummits.spawn.required,{terrain:"land",elevationLevel:{min:1,max:100}},"Cumbres usa la escala Evolve completa sin mínimo local inventado");
assert.deepEqual(mountainSummits.spawn.preferred,{absoluteLatitudeDegrees:{min:0,max:90}},"Cumbres sin latitud exclusiva");
assert.deepEqual(mountainSummits.regionPlacement,{mode:"mountainDependent",belt:"localSummit"},"Cumbres deben ser máximos locales del relieve");
for(const sub of mountain.subbiomes){
 assert(!Object.hasOwn(sub,"distribution"),"el número de masas de Montaña depende del terreno y no tiene cuotas: "+sub.id);
 assert(!Object.hasOwn(sub.spawn.required,"meanAnnualTemperatureC"),"no forzar clima frío en todas las montañas: "+sub.id);
 assert(!Object.hasOwn(sub.spawn.required,"annualPrecipitationMm"),"no forzar precipitación en montañas: "+sub.id);
}
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
assert.equal(allSubbiomes.filter(x=>x.description).length,23,"los 23 subbiomas deben tener descripción bilingüe");
assert.equal(allSubbiomes.filter(x=>x.spawn).length,23);
assert.equal(allSubbiomes.filter(x=>!x.spawn).length,0);
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
const scripts=["js/modules/biomes/biome-extras.js","js/modules/resources/resources.js","js/app.js","js/router.js","js/core/catalog-loader.js","js/core/catalog-index.js","js/modules/biomes/biomes.js","js/modules/biomes/biome-detail.js","js/modules/biomes/biome-distribution-chart.js"];
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
assert.equal(tundraChart.defined.length,2,"Tundra debe presentar áreas ártica y alpina separadas");
assert.equal(tundraChart.pending.length,0,"Tundra completa ya no debe figurar pendiente");
assert.deepEqual(Array.from(tundraChart.defined,x=>x.id),["tundra_tundra","tundra_tundra"],"las dos áreas deben pertenecer al mismo subbioma");
assert.deepEqual(Array.from(tundraChart.defined,x=>x.plotId),["tundra_tundra:arctic","tundra_tundra:alpine"],"las áreas deben identificarse de forma independiente");
assert.deepEqual(Array.from(tundraChart.defined,x=>({lat:{min:x.latitude.min,max:x.latitude.max},elev:{min:x.elevation.min,max:x.elevation.max}})),[
 {lat:{min:60,max:80},elev:{min:1,max:55}},
 {lat:{min:0,max:90},elev:{min:60,max:94}}
],"la gráfica debe reflejar dos rutas alternativas, no un rectángulo general falso");
assert(tundraChart.defined.every(x=>x.preferenceRange),"las franjas de Tundra son preferencias, no límites universales");
assert(chartSource.includes("const uniqueDefined=")&&chartSource.includes("sub.plotId||sub.id"),"la selección de un solo subbioma debe mostrar ambas áreas");
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
const mountainChart=chartAPI.getData(mountain);
assert.equal(mountainChart.defined.length,1,"la gráfica solo dibuja la zona medible de Montaña rocosa");
assert.equal(mountainChart.pending.length,0,"los dos subbiomas de Montaña están definidos");
assert.equal(mountainChart.terrainDerived.length,1,"Cumbres debe clasificarse por relieve relativo, no por banda");
assert.equal(mountainChart.defined[0].id,"mountain_rocky");
assert.deepEqual({min:mountainChart.defined[0].elevation.min,max:mountainChart.defined[0].elevation.max},{min:25,max:89},"Montaña rocosa visible 25–89");
assert.deepEqual({min:mountainChart.defined[0].latitude.min,max:mountainChart.defined[0].latitude.max},{min:0,max:90},"Montaña rocosa en cualquier latitud");
assert.equal(mountainChart.terrainDerived[0].id,"mountain_summits");
assert.equal(mountainChart.terrainDerived[0].placement,"localSummit");
assert(!mountainChart.defined.some(s=>s.id==="mountain_summits"),"no dibujar falsa franja 1–100 para Cumbres");
assert(chartSource.includes("t.summitRelative"),"la gráfica debe explicar cumbres derivadas de máximos locales");
assert(chartSource.includes("t.mountainNote"),"la gráfica debe explicar masas derivadas del relieve");
const testPartial={subbiomes:[forest.subbiomes[0],{id:"without_ranges",name:{es:"Sin rangos"}}]};
assert.equal(chartAPI.getData(testPartial).defined.length,1);
assert.equal(chartAPI.getData(testPartial).pending.length,1);
const changed=JSON.parse(JSON.stringify(forest));
changed.subbiomes[0].spawn.preferred.absoluteLatitudeDegrees.max=12;
assert.equal(chartAPI.getData(changed).defined[0].latitude.max,12,"la gráfica debe leer el JSON actualizado");


const resourceViewCode=read("js/modules/resources/resources.js");
const extraCode=read("js/modules/biomes/biome-extras.js");
const loaderNew=read("js/core/catalog-loader.js");
const viewNew=read("js/modules/biomes/biomes.js");
const routerNew=read("js/router.js");
assert(html.includes("js/modules/biomes/biome-extras.js")&&html.includes("js/modules/resources/resources.js"));
assert(loaderNew.includes('fetch("./data/resources/resouce.json"'));
assert(read("js/app.js").includes("await globalThis.EvolveCatalogLoader.loadResources()"));
assert(routerNew.includes("goResources")&&routerNew.includes('args.has("mineral")'));
assert(viewNew.includes('tr("Recursos","Resources")')&&viewNew.includes("EvolveResourcesView.render"));
assert(viewNew.includes("EvolveBiomeExtras.render"));
assert(extraCode.includes("sub.minerales")&&extraCode.includes("sub.fauna"));
assert(extraCode.includes("item.spawn")&&extraCode.includes("a.spawn"));
assert(resourceViewCode.includes("resources?.minerals"));

console.log("PASS: 7 biomas, 23 subbiomas completos; Montaña rocosa y Cumbres sin cuotas de masas");
