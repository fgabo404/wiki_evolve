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

**Estado actual (2026-11-09):** 8 biomas y 23 subbiomas. Los **7 bosques**, los **3 desiertos**, los **4 subbiomas de Llanuras** y los **4 subbiomas de Marino** cuentan con `name` y `description` bilingües (`es`/`en`) además de `spawn.required` y `spawn.preferred`; la Wiki muestra la descripción según el idioma seleccionado. Los **5 subbiomas restantes** siguen pendientes de definición. Bosque subtropical permanece retirado.

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

**Estado del catálogo:** 8 biomas y 23 subbiomas; 7 bosques, 3 desiertos, los 4 subbiomas de Llanuras y los 4 subbiomas de Marino con definición; 5 subbiomas pendientes. **Desierto: definición teórica cerrada**, con Sahara/Rub al-Jali para Arenoso, Atacama/Canyonlands para Rocoso y Salar de Uyuni como referencia principal del Salar. La integración en el nuevo motor sigue pendiente. Ver [docs/DESIERTOS.md](docs/DESIERTOS.md) para valores y variables geológicas conceptuales que no implementa todavía Engine.

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
