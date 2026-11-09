# wiki_evolve — Wiki de biomas

Wiki independiente de solo lectura. Fuente de las definiciones: [Evolve / definitions](https://github.com/fgabo404/Evolve/blob/definitions/GEvolve.Definitions/Biomas/biomes.json).

## Abrir
Haz doble clic en **index.html**. Funciona desde `file://`, sin instalar nada ni iniciar servidores. Para usar GitHub Pages, habilita Pages con la rama deseada y la carpeta `/(root)`.

## Organización
- `index.html`: interfaz inicial.
- `assets/css/`: estilos migrados de la Wiki del juego, más estilos específicos.
- `js/app.js`, `router.js`: arranque y navegación.
- `js/core/`: lectura offline e índice.
- `js/modules/biomes/`: listado y reglas de spawn.
- `data/biomes/biomes.json`: copia del JSON aprobado de `Evolve/definitions`.
- `data/offline/catalogs.js`: copia para navegador sin servidor.
- `scripts/build-offline.js`: regenera el archivo offline.
- `tests/biomes.test.js`: valida datos y sintaxis con Node.js.

## Actualizar
Tras copiar el JSON nuevo a `data/biomes/biomes.json`, ejecuta `node scripts/build-offline.js` y `node tests/biomes.test.js`. Mantén ambos archivos de datos sincronizados.

**Alcance:** 8 biomas, 21 subbiomas, reglas definidas en cinco bosques. Los demás requisitos siguen pendientes. La Wiki no modifica mecánicas del motor.
