# wiki_evolve — Wiki de biomas

Wiki independiente de solo lectura. **El catálogo de trabajo es `data/biomes/biomes.json`, mantenido en este repositorio.** Se migraron las definiciones aprobadas de Bosque desde [Evolve / definitions](https://github.com/fgabo404/Evolve/blob/definitions/GEvolve.Definitions/Biomas/biomes.json), commit `12423b848fdc2a5e5e527673b9566910e0802b39`, incluyendo Bosque subalpino y retirando Bosque subtropical. Los demás biomas permanecen sin cambios.

## Abrir con VS Code Live Server

1. Abre la carpeta del repositorio en VS Code.
2. Haz clic derecho en `index.html` → **Open with Live Server**.
3. El navegador carga `data/biomes/biomes.json` directamente a través de `fetch()`.

También funciona en **GitHub Pages** configurando `develop` / `(root)`.

> Abrir `index.html` con doble clic (`file://`) ya no está soportado, porque el navegador suele bloquear la lectura local de JSON por `fetch()`.

## Organización

- `index.html`: interfaz inicial.
- `assets/css/`: estilos.
- `js/app.js`, `js/router.js`: inicio y navegación.
- `js/core/catalog-loader.js`: lectura HTTP del JSON; sin copias offline.
- `js/core/catalog-index.js`: índice de biomas y subbiomas.
- `js/modules/biomes/`: listado y reglas de aparición.
- `data/biomes/biomes.json`: único catálogo de datos que lee la Wiki.
- `tests/biomes.test.js`: validación con Node.js.
- `docs/BOSQUES.md`: criterios, transición montañosa y decisiones migradas.

## Actualizar biomas

Edita `data/biomes/biomes.json`, guarda y recarga la Wiki. Live Server normalmente recarga la pestaña automáticamente. No necesitas editar HTML, regenerar scripts ni mantener copias del JSON.

Para comprobar la estructura y la sintaxis: `node tests/biomes.test.js`.

**Nota:** los próximos cambios del catálogo de Bosque se realizarán en `wiki_evolve/develop`. Evolve conserva una copia separada por compatibilidad y **no hay sincronización automática**. Esta Wiki no modifica el motor.

**Estado actual (2026-11-09):** 8 biomas y 23 subbiomas. Los siete bosques, incluidos **Bosque de secuoyas** (`forest_redwood`) y **Bosque nuboso** (`forest_cloud`), cuentan con `name` y `description` bilingües (`es`/`en`) además de `spawn.required` y `spawn.preferred`; la Wiki muestra la descripción según el idioma seleccionado. Los otros 16 subbiomas siguen sin `spawn` ni `description` hasta su revisión. Bosque subtropical permanece retirado.

**Criterio visual de Bosque templado (2026-11-09):** se representa como bosque europeo caducifolio o mixto, con hayas, robles y cambios estacionales; esto no restringe la aparición del subbioma a Europa. Su `spawn` no cambió. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

**Bosque de secuoyas:** define los bosques de secuoyas costeras y añade la condición teórica `coastalFogFrequent` y la distancia costera preferida `distanceToCoastKm`. Estos nuevos factores aún no están implementados en el motor y solo se muestran en la Wiki. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

**Bosque nuboso:** se distingue por `cloudImmersionFrequent` y prefiere condiciones de montaña húmeda. Esta métrica es teórica y no se calcula todavía en Engine. El Manglar (`marine_mangrove`) sigue exclusivamente bajo el bioma Marino. Ver [docs/BOSQUES.md](docs/BOSQUES.md).
