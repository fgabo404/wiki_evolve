"use strict";
(async()=>{
  const notice=document.getElementById("notice");
  try{
    const catalog=await globalThis.EvolveCatalogLoader.load();
    const idx=globalThis.EvolveCatalogIndex(catalog);
    let view;
    const router=globalThis.EvolveRouter(idx,route=>view.show(route));
    view=globalThis.EvolveBiomesView(idx,router);
    view.show(router.current());
  }catch(error){
    notice.hidden=false;
    notice.textContent="Error al cargar biomas: "+error.message+
      (location.protocol==="file:"?" Abre index.html con Live Server de VS Code o GitHub Pages.":"");
    console.error(error);
  }
})();
