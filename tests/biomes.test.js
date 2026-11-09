"use strict";const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");const read=p=>fs.readFileSync(require("node:path").join(__dirname,"..",p),"utf8");const b=JSON.parse(read("data/biomes/biomes.json"));const ctx={};vm.runInNewContext(read("data/offline/catalogs.js"),ctx);assert.deepEqual(JSON.parse(JSON.stringify(ctx.EvolveOfflineCatalogs.biomes)),b);assert.equal(b.biomes.length,8);const all=b.biomes.flatMap(x=>x.subbiomes);assert.equal(all.length,21);assert.equal(all.filter(x=>x.spawn).length,5);for(const p of ["js/app.js","js/router.js","js/core/catalog-loader.js","js/core/catalog-index.js","js/modules/biomes/biomes.js","js/modules/biomes/biome-detail.js"])new vm.Script(read(p));const s=all.find(x=>x.id==="forest_tropical");assert.equal(s.spawn.required.dryMonthsPerYear.dryMonthThresholdMm,60);assert(read("index.html").includes('id="categories"'));
const navSource=read("js/modules/biomes/biomes.js");
assert(navSource.includes("wiki-nav-heading"));
assert(navSource.includes("wiki-biome-tree"));
assert(!navSource.includes("wiki-subbiome-tree"),"subbiomes must appear only in the main list");
assert(navSource.includes("aria-expanded"));
assert(navSource.includes("router.go(biome.id)"),"clicking a biome opens its main-page list");
assert(navSource.includes("router.go(b.id,sub.id)"),"main-page subbiomes remain selectable");
console.log("PASS: 8 biomes, 21 subbiomes, offline sync, JS syntax, hierarchical sidebar");