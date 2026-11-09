"use strict";
globalThis.EvolveCatalogLoader={
  async load(){
    const response=await fetch("./data/biomes/biomes.json",{cache:"no-store"});
    if(!response.ok)throw Error("No se pudo leer biomes.json (HTTP "+response.status+")");
    const result=await response.json();
    if(!result||!Array.isArray(result.biomes))throw Error("biomes.json debe contener un arreglo biomes");
    return result;
  }
};
