"use strict";
(async()=>{
  const notice=document.getElementById("notice");
  try{
    const catalog=await globalThis.EvolveCatalogLoader.load();
    const resources=await globalThis.EvolveCatalogLoader.loadResources();
    const idx=globalThis.EvolveCatalogIndex(catalog);
    let view;
    const router=globalThis.EvolveRouter(idx,route=>view.show(route));
    view=globalThis.EvolveBiomesView(idx,router,resources);
    view.show(router.current());
  }catch(error){
    notice.hidden=false;
    notice.textContent="Error al cargar catálogos: "+error.message+
      (location.protocol==="file:"?" Abre index.html con Live Server de VS Code o GitHub Pages.":"");
    console.error(error);
  }
})();
