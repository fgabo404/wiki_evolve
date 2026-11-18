# wiki_evolve — Wiki de biomas

Wiki independiente de solo lectura. **El catálogo de trabajo es `data/biomes/biomes.json`, mantenido en este repositorio.** Se migraron las definiciones aprobadas de Bosque desde [Evolve / definitions](https://github.com/fgabo404/Evolve/blob/definitions/GEvolve.Definitions/Biomas/biomes.json), commit `12423b848fdc2a5e5e527673b9566910e0802b39`, incluyendo Bosque subalpino y retirando Bosque subtropical. Desde aquella migración, los restantes biomas también han sido definidos progresivamente en este catálogo.

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

**Estado actual (2026-11-16):** 7 biomas y 23 subbiomas. Los **7 bosques**, los **3 desiertos**, los **4 subbiomas de Llanuras** y los **4 subbiomas de Marino** cuentan con `name` y `description` bilingües (`es`/`en`) además de `spawn.required` y `spawn.preferred`; la Wiki muestra la descripción según el idioma seleccionado. **Los 23 subbiomas ya tienen definición declarativa**; queda pendiente su implementación en Engine. Bosque subtropical permanece retirado.

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

**Estado del catálogo:** 7 biomas y 23 subbiomas; 7 bosques, 3 desiertos, los 4 subbiomas de Llanuras, los 4 subbiomas de Marino, ambos Polos, Tundra y los dos subbiomas de Montaña con definición; **0 subbiomas pendientes**. **Desierto: definición teórica cerrada**, con Sahara/Rub al-Jali para Arenoso, Atacama/Canyonlands para Rocoso y Salar de Uyuni como referencia principal del Salar. La integración en el nuevo motor sigue pendiente. Ver [docs/DESIERTOS.md](docs/DESIERTOS.md) para valores y variables geológicas conceptuales que no implementa todavía Engine.

## Llanuras — revisión gradual (2026-11-09)

El catálogo conserva los cuatro subbiomas aprobados: **Sabana**, **Pradera**, **Estepa** y **Humedal abierto (Pantanal)**. Sabana toma Serengeti y Masái Mara como referencia; Pradera, las Grandes Llanuras y Pampas; Estepa, Mongolia/Asia Central y Patagonia; Humedal abierto, principalmente el Pantanal brasileño. Todos cuentan con descripción bilingüe y condiciones declarativas. La gráfica SVG muestra las cuatro áreas según sus latitudes preferidas y alturas requeridas, siempre debajo de las fichas. Los rangos son decisiones de diseño, no implementación en Engine.

Ver [docs/LLANURAS.md](docs/LLANURAS.md).

## Referencias porcentuales de Bosque y masas conectadas (2026-11-09)

Los siete bosques incorporan `distribution` sin alterar sus reglas `spawn`: `targetLandPercent` (porcentaje preliminar sobre celdas terrestres), `percentBasis` (origen/cautela de la cifra), `minRegions` y `maxRegions` (límites de **regiones hexagonales conectadas**, no tamaño fijo). Selva requiere 2–3 masas; Templado 2–4; Boreal (taiga) 1–3; Pantano arbolado 1–2; Redwood exactamente 1. Nuboso y Subalpino conservan un mínimo de una masa y máximo indefinido, pero ahora declaran `regionPlacement` dependiente de cordilleras (`humidMontane` y `belowLocalTreeline`), con latitud y clima locales. Las referencias de porcentajes proceden de estimaciones reales de diferentes ámbitos, con incertidumbre; **Bosque subalpino queda `null` porque no hay porcentaje global comparable**, y el valor de Redwood es histórico. Estos porcentajes **no se pueden sumar como cobertura forestal exclusiva** sin resolver solapamientos y subtipos ausentes. La definición del reparto final pertenece al nuevo generador. La ficha de la Wiki muestra los campos bilingües. Ver [docs/BOSQUES.md](docs/BOSQUES.md).

## Distribución porcentual de Desiertos (2026-11-09)

Los tres subbiomas de Desierto incorporan `distribution` (porcentaje preliminar de hexágonos terrestres y mínimos/máximos de masas conectadas): **Arenoso 3,9 %, 2–4 masas**; **Rocoso 9,8 % como referencia inferior de grava desértica, 2–4 masas**; **Salar 0,008 % como equivalente a un solo Uyuni, una única masa**. Estos porcentajes son referencias de distinto alcance y no una cobertura mundial exclusiva. Las condiciones `spawn` permanecen idénticas y el Engine no las ejecuta todavía. Ver [docs/DESIERTOS.md](docs/DESIERTOS.md).

## Llanuras — Sabana, cuota terrestre y masas (2026-11-09)

Sabana tiene aprobado `distribution.targetLandPercent: 13.8` como referencia provisional de superficie **terrestre** (no cuota del mapa total), y `minRegions: 2`, `maxRegions: 4` para contar masas hexagonales conectadas. Se conserva la latitud absoluta **preferida 0–30°** y altura **obligatoria 1–64**. Pradera, Estepa y Pantanal ya están definidos y conservan porcentajes terrestres pendientes (`null`); no se ejecutan estas cuotas en Engine. Ver [docs/LLANURAS.md](docs/LLANURAS.md).

## Llanuras — Pradera aprobada (2026-11-09)

Pradera (`plains_prairie`) ahora incluye descripción bilingüe de las Grandes Llanuras de Norteamérica y Pampas argentinas, altura requerida de Evolve **1–64**, latitud absoluta preferida **30–60°**, temperatura media anual **2–20 °C**, precipitaciones **450–1200 mm**, predominio herbáceo y cobertura arbórea **≤10 %**. Pendiente **0–10°** es una preferencia de terreno plano/ondulado. Su bloque `distribution` fija **2–4 masas** y mantiene `targetLandPercent:null` hasta distinguir de Estepa la cuota real de pastizal templado. La gráfica genérica muestra los cuatro subbiomas de Llanuras. No se cambia el Engine. Ver [docs/LLANURAS.md](docs/LLANURAS.md).

## Llanuras — Estepa y Pantanal aprobados (2026-11-09)

**Estepa** (`plains_steppe`) adopta Mongolia y Asia Central como referencia principal, con una variante patagónica. Altura requerida **1–74**, latitud preferida **30–60°**, temperatura **−10 a 15 °C**, precipitación **150–500 mm** (preferida 200–400 mm), hierbas dominantes y cobertura arbórea **≤10 %**. Prefiere interiores continentales **o** sombras orográficas. `distribution`: porcentaje terrestre pendiente y **2–4 masas conectadas**.

**Humedal abierto (Pantanal)** (`plains_open_wetland`) adopta el **Pantanal brasileño** como referencia visual principal, con grandes pastizales inundables, lagunas y canales. Altura requerida **1–38** (preferida 1–20), latitud preferida **10–25°**, temperatura **20–28 °C**, precipitación **900–1700 mm** (preferida 1100–1500 mm), influencia de llanura fluvial, drenaje lento e inundación estacional. `distribution`: porcentaje terrestre pendiente y **mínimo 1, máximo 1 masa conectada si las condiciones permiten el bioma**.

Las nuevas condiciones geográficas e hidrológicas son declarativas; la implementación de la hidrología y los cambios visuales por estación permanece pendiente en Engine. La gráfica existente incorpora automáticamente ambos rectángulos, sin imágenes PNG ni rangos codificados. Ver [docs/LLANURAS.md](docs/LLANURAS.md).

## Marino — Arrecife aprobado (2026-11-10)

**Arrecife** (`marine_reef`) utiliza la **Gran Barrera de Coral de Australia** como referencia principal e incluye arrecifes costeros, de barrera y atolones dentro del mismo subbioma. **Solamente añade dos parámetros nuevos**, `waterDepthMeters` (profundidad real **0–50 m**, preferida **0–30 m**) y `waterSalinityPpt` (**32–42 ‰**). Reutiliza las condiciones comunes de terreno (`water`), temperatura media anual (**20–30 °C**, preferida **23–29 °C**) y latitud absoluta preferida (**0–30°**). Tiene **4–8 masas regionales** y porcentaje de superficie oceánica pendiente. El campo heredado `targetLandPercent:null` no representa cuota terrestre marina ni fija una cuota oceánica.

La gráfica SVG de Marino usa **latitud absoluta y profundidad en metros**, con profundidad creciente hacia abajo; los biomas terrestres conservan sus ejes anteriores de latitud y altura Evolve 0–100. La ficha muestra unidades de profundidad y salinidad en ambos idiomas. **Estuario o litoral** y **Manglar** ya están aprobados; **los cuatro subbiomas de Marino están aprobados**. Nada de esto se ejecuta en el generador todavía. Ver [docs/MARINO.md](docs/MARINO.md).

## Marino — Estuario o litoral aprobado (2026-11-12)

**Estuario o litoral** (`marine_estuary_littoral`) combina ambos ambientes debido a la resolución actual de la cuadrícula. Su **referencia visual principal es la costa rocosa**; incluye playas arenosas y bahías como variantes, y conserva la bahía de Chesapeake como referencia estuarina. Reutiliza los mismos parámetros ya existentes de Arrecife: `waterDepthMeters` (0–50 m, preferida 0–20 m), `waterSalinityPpt` (0–40 ‰), `meanAnnualTemperatureC` (−2 a 35 °C), `terrain: water` y latitud preferida 0–90°.

Se generan **franjas costeras continuas**, incluso alrededor de continentes completos, en zonas marinas junto a tierra o desembocaduras; la geografía se deriva de la cuadrícula y los ríos sin un campo nuevo de `spawn`. El conteo **1–8 masas conectadas es provisional** y nunca obliga a cortar artificialmente una franja de costa. El porcentaje oceánico permanece pendiente (`targetLandPercent: null` por compatibilidad). La gráfica marina existente incorpora automáticamente su rango de profundidad. Las reglas son declarativas y aún no se implementan en Engine. Ver [docs/MARINO.md](docs/MARINO.md).

## Marino — Manglar aprobado (2026-11-13)

**Manglar** (`marine_mangrove`) utiliza **Sundarbans, Bangladesh e India** como referencia principal: bosques verdes intermareales, deltas con canales sinuosos, lodo e islas arboladas. Los manglares de raíces aéreas y las franjas forestales de bahías e islas son variantes visuales, no subbiomas diferentes. Prefiere ambientes costeros tropicales y subtropicales protegidos, en particular deltas, estuarios y bahías. El terreno se representa en el catálogo actual como `water`, aunque los árboles realmente crecen en sustrato intermareal y **no bajo inmersión permanente**.

Reutiliza **exclusivamente los dos parámetros marinos nuevos existentes**, profundidad (`waterDepthMeters`: **0–5 m**, preferida **0–2 m**) y salinidad (`waterSalinityPpt`: **0–40 ‰**, preferida **5–30 ‰**), junto a terreno, temperatura media (**20–30 °C**, preferida **24–28 °C**) y latitud absoluta preferida (**0–30°**). Tiene **2–6 masas regionales** y porcentaje oceánico pendiente (`targetLandPercent:null` del contrato compartido, no cuota de tierra). La gráfica marina añade automáticamente su área de latitud y profundidad; **Océano abierto** ya fue aprobado y Marino está completo. Se documenta sin introducir lógica nueva en Engine. Ver [docs/MARINO.md](docs/MARINO.md).

## Marino — Océano abierto aprobado y categoría completada (2026-11-13)

**Océano abierto (alta mar)** (`marine_open_ocean`) toma el **océano Pacífico** como referencia principal: enormes extensiones de agua azul, con variaciones tropicales, templadas y frías dentro de un solo subbioma. Se conserva `terrain: water`, `waterDepthMeters` **0–11.000 m** (preferido **200–6.000 m**), `waterSalinityPpt` **30–40 ‰** (preferido **33–37 ‰**), temperatura media del agua superficial **−2 a 32 °C** y latitud preferida global **0–90°**. Las zonas pelágicas según profundidad son referencias ecológicas futuras, no nuevos subbiomas.

Su `distribution` conserva porcentaje oceánico pendiente y **1–3 masas**, prefiriendo **una sola gran masa conectada** cuando la geografía permite que los océanos se comuniquen. No se dividen artificialmente el Pacífico, Atlántico e Índico ni se fuerzan regiones para cumplir conteos. La ubicación lejos de las costas procede del mapa y no introduce campos de `spawn` adicionales.

**La categoría Marino queda totalmente definida en la Wiki (4/4)**. La gráfica interactiva usa latitud y profundidad física, con eje vertical **no lineal** en presencia de océanos profundos: el tramo somero 0–50 m ocupa el 40 % de la altura visual para conservar visibles Arrecife, Estuario y Manglar; las profundidades restantes ocupan el 60 %. Los biomas terrestres conservan su escala normalizada 0–100. Todas las reglas siguen siendo **declarativas y no implementadas en Engine**. Ver [docs/MARINO.md](docs/MARINO.md).

## Escala de altura oficial y profundidad marina (2026-11-13)

**El sistema de altura del mundo siempre utiliza niveles normalizados de 0 a 100**: 0 es la referencia del nivel del mar y 1–100 son alturas terrestres relativas, **no metros**. El parámetro marino `waterDepthMeters` permanece separado y expresa profundidad física en metros positivos hacia abajo; por ejemplo, los 11.000 m del Océano abierto **no son una altura Evolve de 11.000**. La gráfica de latitud/profundidad marina es una visualización especializada y **no reemplaza la escala oficial de altura 0–100**. No se establece ninguna conversión adicional ni se cambian los rangos aprobados. Ver [docs/MARINO.md](docs/MARINO.md).

## Polo — categoría unificada Norte y Sur (2026-11-13)

Los antiguos biomas principales **Polo Norte** y **Polo Sur** se agrupan bajo **un solo bioma: Polo** (`polar`), con **exactamente dos subbiomas: Polo Norte** (`polar_north_ice`) y **Polo Sur** (`polar_south_ice`). Los IDs de subbioma se conservan; solo cambian su categoría padre y sus etiquetas visibles. Los enlaces antiguos `#biome=polar_north` y `#biome=polar_south` se redirigen a las fichas correspondientes.

**No se han asignado condiciones de aparición sin aprobar.** El Polo Norte se encuentra sobre el océano Ártico y tiene hielo marino flotante; el Polo Sur se ubica sobre la Antártida continental cubierta de hielo terrestre. Ambos polos tienen condiciones y distribución aprobadas: una masa oceánica helada al norte y una masa continental helada al sur. **La altura del mundo sigue siendo la escala 0–100**, no metros. El gráfico inferior presenta dos vistas: profundidad marina para Polo Norte y altura terrestre Evolve 0–100 para Polo Sur, ambos definidos. Se conservan **23 subbiomas**, con **23 definidos y 0 pendientes**. El nuevo generador de `fgabo404/Evolve` no se modifica. Ver [docs/POLO.md](docs/POLO.md).

## Polo Norte — única masa de hielo arriba del mapa (2026-11-13)

**Polo Norte** (`polar_north_ice`) se inspira en el **océano Ártico**, cubierto por hielo marino flotante con grietas, placas y canales de agua. Se aprueba **exactamente una masa** regional: `minRegions:1` y `maxRegions:1`, ubicada en el **extremo superior del mapa, hemisferio norte**. No se consideran masas separadas las placas individuales ni se permite trasladar esa región al hemisferio sur. El emplazamiento norte es una regla geográfica pendiente de implementación; la latitud absoluta preferida 75–90° por sí sola no distingue hemisferios.

Reutiliza parámetros existentes: `terrain:water`, profundidad del fondo **0–6.000 m**, salinidad **25–35 ‰** (preferida **30–34 ‰**), temperatura media superficial del agua **−2 a 1 °C** (preferida **−2 a 0 °C**) y latitud absoluta preferida **75–90°**. La **altura Evolve sigue siendo 0–100**; la profundidad es un parámetro marino independiente, en metros. La Wiki utiliza una gráfica de profundidad para Norte y una gráfica separada de altura Evolve para Sur, ambos aprobados. **23 subbiomas definidos y 0 pendientes**. Ver [docs/POLO.md](docs/POLO.md).

## Polo Sur — único continente polar abajo del mapa (2026-11-13)

**Polo Sur** (`polar_south_ice`) se inspira en la **Antártida real**, con una sola masa continental conectada y cubierta por hielo terrestre permanente en el **extremo inferior del mapa, hemisferio sur**. A diferencia del Polo Norte, el terreno requerido es `land`, con elevación normalizada Evolve `elevationLevel` **1–100** (preferida **25–75**), temperatura media anual **−60 a 0 °C** (preferida **−55 a −15 °C**) y latitud absoluta preferida **65–90°**. No se confunden los metros reales de la Antártida con los niveles Evolve **0–100**.

La distribución queda fijada en `minRegions:1` y `maxRegions:1`, con superficie terrestre porcentual pendiente (`targetLandPercent:null`). La cobertura de hielo continental persistente y la ubicación sur serán verificadas por el futuro generador a partir de clima y geografía; **no se inventan campos nuevos de `spawn` ni se implementa Engine**. La gráfica polar de la Wiki distingue dos paneles: profundidad oceánica para Norte y altura Evolve para Sur. **Bioma Polo completo (2/2). Montaña rocosa y Cumbres también están definidas.** Ver [docs/POLO.md](docs/POLO.md).

## Tundra — definición completa: variantes ártica y alpina (2026-11-16)

**Tundra** (`tundra_tundra`) se mantiene como **un solo subbioma** que incluirá tanto la **tundra ártica** (Alaska, Canadá, Siberia) como la **tundra alpina** (terrenos montañosos por encima del límite local de árboles, incluso en latitudes menores). Son **dos vías alternativas de aparición**, no dos subbiomas ni dos requisitos obligatorios a la vez. Las altitudes se mantienen en niveles de Evolve **0–100**. El subbioma ya tiene condiciones comunes aprobadas: altura **Evolve 1–94** (escala global **0–100**), temperatura **−25 a 5 °C**, precipitación anual **100–1.200 mm**, cobertura arbórea **≤10 %**, y distribución de **2–4 masas** en total, con porcentaje terrestre pendiente. Se conserva una ruta **ártica** (latitud preferida **60–80° N**, altura **1–55**) o una ruta **alpina** (sobre el límite arbóreo local, latitud posible **0–90°**, altura orientativa **60–94**) en un solo subbioma. La gráfica muestra las dos áreas alternativas y destaca ambas al seleccionar Tundra. **23 subbiomas definidos y 0 pendientes**; no se modifica Engine. Ver [docs/TUNDRA.md](docs/TUNDRA.md).

## Montaña — Rocosa y Cumbres definidas sin cuotas de masas (2026-11-16)

La **referencia visual aportada por el usuario** define los dos subbiomas existentes del bioma Montaña: **Montaña rocosa** (`mountain_rocky`) corresponde a las **laderas, paredes y flancos de roca expuesta** (círculo amarillo «ROCOSO»); **Cumbres** (`mountain_summits`) corresponde a las **zonas culminantes o picos de la cordillera** (círculo rojo «CUMBRE»). Se distinguen por su **posición y geomorfología local**, no solo por altura, hielo o nieve. Pueden coexistir dentro de una misma cordillera. La altura Evolve continúa en **0–100**. Las laderas de **Montaña rocosa** tienen altura Evolve **25–89**, preferida **45–80**, pendiente **15–90°**, preferida **20–55°**, y roca/grava como material dominante. **Cumbres** se identifica por **máximos locales de las montañas**, sin imponer una altura de corte uniforme. **No hay mínimos ni máximos de masas para ninguno:** las regiones se derivan de la geografía montañosa. El catálogo tiene **23 definidos y 0 pendientes**. No se modifica Engine. Ver [docs/MONTANA.md](docs/MONTANA.md).

## Fauna — Selva tropical (2026-11-18)

Se han aprobado **42 registros de fauna** para **Selva** (`forest_tropical`), directamente en el atributo `fauna` de su subbioma dentro de [`data/biomes/biomes.json`](data/biomes/biomes.json). Cada registro contiene `id` en **camelCase** (sin prefijo de categoría) y `spawn: {min,max,socialMode}`; los modos sociales `group`, `herd`, `flock`, `colony`, `school` y `swarm` incorporan `groupSize: {min,max}`, mientras `solitary` y `pair` no lo requieren.

**Regla aprobada:** `spawn.min >= 1` para todos los animales incluidos; los únicos mínimos originales que eran 0 se ajustaron a 1 (**puma, gorila, águila arpía, quetzal, cocodrilo, anaconda y anguila eléctrica**). Todos los máximos, demás mínimos, modos sociales y tamaños de grupo se conservaron tal como los aprobó el usuario. Las cifras cuentan **apariciones por masa conectada de Selva**, no necesariamente individuos: `groupSize` indica cuántos individuos conforman cada aparición agrupada. Los requisitos locales de agua y otros microhábitats se definirán en una fase posterior; esta declaración no implementa movilidad, simulación de colonias ni el generador.

**Alcance:** fauna de Selva exclusivamente. Los demás subbiomas no heredan la lista. Los detalles globales de recursos se reservarán para un futuro `resources.json`; por ahora no se han creado definiciones de recursos ni IDs con prefijo `fauna_`.

## Minerales — 23 subbiomas y catálogo global (2026-11-18)

La Wiki registra la **posibilidad geológica de generar minerales en los 23 subbiomas** mediante el atributo directo `minerales` en [`data/biomes/biomes.json`](data/biomes/biomes.json). Se han distribuido **521 referencias** pertenecientes a **55 minerales distintos**, con IDs `camelCase` reutilizados y sin prefijo de categoría. **Estas son propuestas iniciales de generación para el juego, no tablas científicas universales de abundancia o profundidad.** El catálogo de detalles generales, sin distinción de subbioma, está en [`data/resources/resouce.json`](data/resources/resouce.json), bajo la clave raíz `minerals`. Se mantiene la grafía **`resouce.json` solicitada**, no `resources.json`.

Cada entrada `minerales[]` contiene:
- `id`: referencia al mineral del catálogo global.
- `spawn.min` / `spawn.max`: número de **yacimientos posibles por masa conectada del subbioma**, sujeto a geología compatible; **mínimo 1 solo si existen condiciones geológicas aptas**.
- `spawn.surface.outcrop`: si puede haber afloramiento superficial; `surface.min` / `surface.max`: número de afloramientos **del total de yacimientos**, no depósitos extra.
- `spawn.underground.min` / `spawn.underground.max`: intervalo de profundidad normalizado **de −20 a 0**, donde cada nivel equivale a **100 metros**, y **−20 = 2 km**. El valor numéricamente menor indica mayor profundidad. Son intervalos de diseño, no la profundidad obligatoria o universal de formación mineral. Se miden **bajo la superficie local** (o bajo el fondo marino donde corresponda), independientemente de la altura Evolve 0–100.

Para los subbiomas de **agua** (Marino y Polo Norte), se registran minerales del sustrato oceánico, estuarino o arrecifal y se deja `surface.outcrop:false` para evitar confundir el fondo del agua con afloramientos visibles en tierra. Un futuro contrato técnico podrá distinguir **afloramiento del lecho marino** si se necesita representar ese fenómeno. Los depósitos minerales son **geológicos**, no cuotas forzadas por el clima: la ausencia de las condiciones requeridas permite **cero depósitos efectivos**, pese a `spawn.min>=1` como rango condicional. La distribución concreta por tipo de roca, formación, cuenca, profundidad y tectónica sigue pendiente del generador.

**No se alteraron las 42 entradas de fauna aprobadas en Selva**, el número de biomas/subbiomas ni las condiciones climáticas y de terreno. Los datos de flora y las fichas detalladas de recursos adicionales se decidirán en otra etapa.
