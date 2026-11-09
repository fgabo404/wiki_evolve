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

**Estado actual (2026-11-09):** 8 biomas y 23 subbiomas. Los **7 bosques**, los **3 desiertos** y **Sabana** cuentan con `name` y `description` bilingües (`es`/`en`) además de `spawn.required` y `spawn.preferred`; la Wiki muestra la descripción según el idioma seleccionado. Los **12 subbiomas restantes** siguen sin `spawn` ni `description` hasta su revisión. Bosque subtropical permanece retirado.

**Criterio visual de Bosque templado (2026-11-09):** se representa como bosque europeo caducifolio o mixto, con hayas, robles y cambios estacionales; esto no restringe la aparición del subbioma a Europa. Su `spawn` no cambió. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

**Bosque de secuoyas:** define los bosques de secuoyas costeras y añade la condición teórica `coastalFogFrequent` y la distancia costera preferida `distanceToCoastKm`. Estos nuevos factores aún no están implementados en el motor y solo se muestran en la Wiki. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

**Bosque nuboso:** se distingue por `cloudImmersionFrequent` y prefiere condiciones de montaña húmeda. Esta métrica es teórica y no se calcula todavía en Engine. El Manglar (`marine_mangrove`) sigue exclusivamente bajo el bioma Marino. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

**Criterio visual de Bosque boreal (2026-11-09):** taiga de estilo finlandés y canadiense, con coníferas oscuras, musgos, líquenes, lagos, claros y nieve en invierno. Los alerces dorados de Yakutia son una variación estacional. Se actualizó únicamente su descripción bilingüe, sin alterar `spawn`. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

**Altura requerida en Evolve (2026-11-09):** los siete bosques ahora usan `spawn.required.elevationLevel` (enteros en la escala relativa 0–100) en vez de `spawn.preferred.elevationMeters`. El bosque subalpino requiere 65–84 y **no puede aparecer a altura 10**. Los niveles son límites de diseño ajustables al nuevo generador; no equivalen a metros. La restricción separada de distancia física al límite arbóreo permanece pendiente de modelado. Los demás campos se conservaron. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

**Latitud preferida de los bosques (2026-11-09):** los siete subbiomas de Bosque ya incluyen `spawn.preferred.absoluteLatitudeDegrees`. Se agregaron Bosque nuboso 0–30°, Bosque subalpino 30–70°, Bosque de secuoyas 35–43° y Pantano arbolado 20–35°; los valores anteriores de Selva, Templado y Boreal permanecen intactos. Son preferencias latitudinales absolutas para ambos hemisferios, nunca filtros obligatorios; `spawn.required.elevationLevel` 0–100 continúa siendo obligatorio. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

## Gráfica de distribución geográfica

En la vista principal de cada bioma, el componente reutilizable `js/modules/biomes/biome-distribution-chart.js` muestra una gráfica SVG interactiva de **latitud absoluta (0°–90°)** frente a **altura de Evolve (0–100)**, debajo del listado de subbiomas y del panel de detalles, incluso al abrir una ficha.

Los rectángulos se generan exclusivamente con `spawn.required.elevationLevel.{min,max}` (altura obligatoria) y `spawn.preferred.absoluteLatitudeDegrees.{min,max}` (latitud preferida) del JSON cargado. Se pueden destacar subbiomas desde el selector, la leyenda o sus áreas. El idioma de la Wiki controla etiquetas y nombres; los subbiomas incompletos se muestran como pendientes. Ninguna altura o latitud de Bosque está codificada en el componente.

La gráfica es una referencia ambiental, no una predicción exacta de aparición. Requiere Live Server o GitHub Pages y se actualiza al recargar tras editar `data/biomes/biomes.json`.

## Desierto — tres subbiomas definidos (2026-11-09)

Los tres subbiomas existentes de Desierto (`desert_sandy`, `desert_rocky`, `desert_salt_flat`) ya tienen `description.es/en`, `spawn.required` y `spawn.preferred`. Altura obligatoria `elevationLevel` (0–100), latitud absoluta preferida, aridez obligatoria por precipitación máxima anual de 250 mm y material superficial distintivo. Se conservan variantes frías mediante temperatura preferida, no obligatoria. La misma gráfica SVG reutilizable ahora dibuja automáticamente los tres desiertos.

**Estado del catálogo:** 8 biomas y 23 subbiomas; 7 bosques y 3 desiertos con definiciones completas, 12 subbiomas pendientes (Sabana de Llanuras ya definida). **Desierto: definición teórica cerrada**, con Sahara/Rub al-Jali para Arenoso, Atacama/Canyonlands para Rocoso y Salar de Uyuni como referencia principal del Salar. La integración en el nuevo motor sigue pendiente. Ver [docs/DESIERTOS.md](docs/DESIERTOS.md) para valores y variables geológicas conceptuales que no implementa todavía Engine.

## Llanuras — revisión gradual (2026-11-09)

El catálogo conserva los cuatro subbiomas: Sabana, Pradera, Estepa y Humedal abierto (Pantanal). **Sabana** (`plains_savanna`) es el primer subbioma aprobado, inspirado en Serengeti y Masái Mara como paisaje principal, y con variantes de Cerrado y Australia. Cuenta con descripción bilingüe, clima cálido, estación seca y lluviosa, cobertura de árboles abierta, `elevationLevel` obligatorio 1–64 y latitud preferida 0–30°. La gráfica de distribución SVG muestra su área y marca los otros tres subbiomas como pendientes. Los rangos son decisiones de diseño, no implementación en Engine.

Ver [docs/LLANURAS.md](docs/LLANURAS.md).

## Referencias porcentuales de Bosque y masas conectadas (2026-11-09)

Los siete bosques incorporan `distribution` sin alterar sus reglas `spawn`: `targetLandPercent` (porcentaje preliminar sobre celdas terrestres), `percentBasis` (origen/cautela de la cifra), `minRegions` y `maxRegions` (límites de **regiones hexagonales conectadas**, no tamaño fijo). Selva requiere 2–3 masas; Templado 2–4; Boreal (taiga) 1–3; Pantano arbolado 1–2; Redwood exactamente 1. Nuboso y Subalpino conservan un mínimo de una masa y máximo indefinido, pero ahora declaran `regionPlacement` dependiente de cordilleras (`humidMontane` y `belowLocalTreeline`), con latitud y clima locales. Las referencias de porcentajes proceden de estimaciones reales de diferentes ámbitos, con incertidumbre; **Bosque subalpino queda `null` porque no hay porcentaje global comparable**, y el valor de Redwood es histórico. Estos porcentajes **no se pueden sumar como cobertura forestal exclusiva** sin resolver solapamientos y subtipos ausentes. La definición del reparto final pertenece al nuevo generador. La ficha de la Wiki muestra los campos bilingües. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

## Distribución porcentual de Desiertos (2026-11-09)

Los tres subbiomas de Desierto incorporan `distribution` (porcentaje preliminar de hexágonos terrestres y mínimos/máximos de masas conectadas): **Arenoso 3,9 %, 2–4 masas**; **Rocoso 9,8 % como referencia inferior de grava desértica, 2–4 masas**; **Salar 0,008 % como equivalente a un solo Uyuni, una única masa**. Estos porcentajes son referencias de distinto alcance y no una cobertura mundial exclusiva. Las condiciones `spawn` permanecen idénticas y el Engine no las ejecuta todavía. Ver [docs/DESIERTOS.md](docs/DESIERTOS.md).
