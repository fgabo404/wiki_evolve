# D01 — Bosques de Evolve (migrados a wiki_evolve)

**Fecha:** 2026-11-09  
**Rama:** `develop`  
**Origen:** `fgabo404/Evolve`, rama `definitions`, commit `12423b848fdc2a5e5e527673b9566910e0802b39`  
**JSON de trabajo:** [`../data/biomes/biomes.json`](../data/biomes/biomes.json)

## Bosques actuales

| Nombre | ID | Condiciones obligatorias resumidas |
|---|---|---|
| Selva | `forest_tropical` | Tierra, temperatura media anual 20–30 °C, ≥1500 mm de lluvia al año y ≤3 meses secos |
| Bosque nuboso | `forest_cloud` | Tierra e inmersión frecuente en nubes bajas y niebla; clima húmedo de montaña, con altitud y lluvias como preferencias |
| Bosque templado | `forest_temperate` | Tierra, 4–8 meses con temperatura media mensual >10 °C y lluvia anual ≥450 mm |
| Bosque boreal (taiga) | `forest_boreal` | Tierra, 1–3 meses con temperatura media mensual >10 °C y lluvia anual ≥200 mm |
| Bosque subalpino | `forest_subalpine` | Tierra, nivel de altura 65–84, 0–700 m por debajo del límite local de árboles, lluvia ≥350 mm/año y pendiente ≤40° |
| Bosque de secuoyas | `forest_redwood` | Tierra, temperatura media anual 8–18 °C, lluvia ≥750 mm/año y niebla costera frecuente | 
| Pantano arbolado (Everglades) | `forest_wooded_swamp` | Tierra, suelo saturado durante temporada de crecimiento y agua dulce |

Los siete incluyen `spawn.required.elevationLevel` en una escala **0–100**, además de `spawn.preferred` y `description: { es, en }` con una presentación ecológica breve. **Las descripciones y las condiciones completas, incluidas las preferencias, están en el JSON**, y la Wiki elige el idioma adecuado. Los rangos son criterios iniciales del diseño de Evolve, no límites universales de los ecosistemas.

## Referencia visual de la cordillera

La imagen aportada por el director presenta esta secuencia deseada: **Bosque subalpino → Montaña rocosa → Cumbres**. En el sector inferior aparecen masas de coníferas; más arriba predominan laderas y paredes de roca, y en lo alto hay cumbres con roca o nieve.

- `forest_subalpine`: franja forestada fría bajo el límite local de crecimiento arbóreo, habitual en montañas como Banff.
- `mountain_rocky`: roca expuesta y laderas donde no domina la vegetación arbórea.
- `mountain_summits`: zonas de mayor elevación, con nieve/hielo si el clima lo permite.

Se usa **Bosque subalpino**, y no «bosque alpino», porque la franja alpina está normalmente por encima del límite del arbolado.

## Trabajo pendiente

- La métrica `distanceBelowLocalTreelineMeters` aún no la calcula el motor, y requiere determinación climática local de la línea de árboles.
- Sigue pendiente resolver los solapamientos y la prioridad frente a Templado, Boreal y Montaña rocosa.
- Las preferencias no deben usarse como condiciones excluyentes.
- `forest_subtropical` se retiró expresamente; su ID no se recicla.
- Después de completar también los tres desiertos, quedan 13 subbiomas del catálogo sin `spawn`. (En la fase inicial de Bosque eran 16).

**Gestión:** los futuros cambios del catálogo de Bosque se realizarán en `wiki_evolve/develop`. La copia antigua de `Evolve/definitions` no se modifica por esta migración; ambos repositorios son independientes.

## Referencia visual aprobada: Bosque templado de estilo europeo (2026-11-09)

`forest_temperate` conserva su identificador, su nombre bilingüe y todas las reglas de `spawn`. Su descripción bilingüe se ha enfocado en **bosques caducifolios y mixtos de Europa central y occidental**, con hayas, robles y cambios visibles entre estaciones. **Es una referencia estética y de vegetación, no una restricción geográfica a Europa**: el mismo paisaje podrá darse en otras regiones con clima y vegetación similares.

Se distinguen de esta referencia los bosques de secuoyas de América del Norte: las secuoyas costeras (`Sequoia sempervirens`) se asocian a bosques templados lluviosos marítimos con niebla, mientras que las secuoyas gigantes (`Sequoiadendron giganteum`) crecen en bosques montanos de coníferas mixtas de Sierra Nevada. **Se creó posteriormente `forest_redwood` para las secuoyas costeras**, sin modificar `forest_temperate`; la clasificación específica de secuoyas gigantes se deja pendiente.

Referencias: [European Forests JRC](https://forest.jrc.ec.europa.eu/media/atlas/European_forests_an_ecological_overview.pdf), [NPS Coast Redwood](https://www.nps.gov/articles/000/coast-redwood.htm) y [NPS Giant Sequoia Groves](https://www.nps.gov/seki/planyourvisit/sequoiagroves.htm).

## Nuevo subbioma: Bosque de secuoyas / Redwood Forest (2026-11-09)

**ID:** `forest_redwood`. Forma parte de **Bosque (`forest`)**, no constituye un noveno bioma principal. Se mantiene la misma estructura `id`, `name` (es/en), `description` (es/en) y `spawn.required` / `spawn.preferred`.

Representa en primer lugar los bosques de **secuoyas costeras** (`Sequoia sempervirens`) del litoral del Pacífico, cuya humedad depende de lluvia invernal y niebla estival. No es sinónimo de todos los bosques de coníferas ni incluye automáticamente los rodales de secuoyas gigantes de Sierra Nevada.

| Campo | Tipo | Valor |
|---|---|---|
| `terrain` | `required` | `land` |
| `meanAnnualTemperatureC` | `required` | 8–18 °C |
| `annualPrecipitationMm` | `required` | ≥750 mm/año |
| `coastalFogFrequent` | `required` | `true` |
| `elevationLevel` | `required` | 1–35 (escala Evolve 0–100) |
| `annualPrecipitationMm` | `preferred` | 1200–2500 mm/año |
| `meanAnnualRelativeHumidityPercent` | `preferred` | 75–95 % |
| `distanceToCoastKm` | `preferred` | 0–80 km |

**Nota de diseño:** los valores numéricos son intervalos iniciales para Evolve, no límites universales; la precipitación sola no explica estos bosques. `coastalFogFrequent` es un indicador booleano conceptual de niebla marítima frecuente durante la estación seca. Su cálculo, así como la distancia costera en una costa compleja y la distinción frente a `forest_temperate`, **no están implementados**. No se añaden nuevas especies a la flora por ahora.

**Fuentes:** [California State Parks — About Coast Redwoods](https://www.parks.ca.gov/?page_id=22257), [UC ANR — Coast Redwood](https://ucanr.edu/site/forest-research-and-outreach/coast-redwood-sequoia-sempervirens), [USFS — Coast Redwood](https://research.fs.usda.gov/feis/species-reviews/seqsem) y [NPS — Redwood Weather](https://www.nps.gov/redw/planyourvisit/weather.htm).

## Nuevo subbioma: Bosque nuboso / Cloud Forest (2026-11-09)

**ID:** `forest_cloud`. Es el séptimo subbioma del bioma `forest`, con `name.es`, `name.en`, `description.es`, `description.en`, `spawn.required` y `spawn.preferred`.

**Referencia natural:** bosques nubosos tropicales de montaña, como los de Monteverde (Costa Rica) o Sierra de las Minas (Guatemala). La característica determinante es la exposición recurrente de la vegetación a nubes bajas y niebla orográfica, que aporta humedad por interceptación. Abundan epífitas, musgos, helechos y bromelias.

| Campo | Nivel | Valor inicial |
|---|---|---|
| `terrain` | `required` | `land` |
| `cloudImmersionFrequent` | `required` | `true` |
| `meanAnnualTemperatureC` | `preferred` | 10–22 °C |
| `annualPrecipitationMm` | `preferred` | 1200–3500 mm/año |
| `meanAnnualRelativeHumidityPercent` | `preferred` | 80–100 % |
| `elevationLevel` | `required` | 25–74 (escala Evolve 0–100) |

**Justificación del diseño:** la presencia recurrente de nubes a nivel del dosel es la condición ecológica distintiva; la lluvia y la temperatura no deben imponerse como umbrales universales, pues varían con la ubicación, los vientos y el relieve. El nivel de altura 25–74 sí es ahora una condición obligatoria del diseño de Evolve, no un rango universal en metros. Los intervalos `preferred` son estimaciones iniciales ajustables para Evolve. El nuevo indicador `cloudImmersionFrequent` es conceptual y aún no está disponible en Engine; su cómputo futuro deberá tener en cuenta viento, relieve y condensación. Debe evitarse la clasificación automática de cualquier zona húmeda de selva como bosque nuboso.

**Manglar:** ya existe como `marine_mangrove` dentro del bioma `marine` (Marino). **No se crea ningún manglar forestal ni se modifica la definición marítima existente**.

**Fuentes:** [USGS — Do mountain clouds exist because of upwind forests?](https://www.usgs.gov/news/do-mountain-clouds-exist-because-upwind-forests), [The climate of cloud forests — GOV.UK](https://www.gov.uk/research-for-development-outputs/the-climate-of-cloud-forests), [Hydroclimatic and ecophysiological basis of cloud forest distributions](https://pmc.ncbi.nlm.nih.gov/articles/PMC3997648/) y [Fog precipitation in a cloud forest of Guatemala](https://www.sciencedirect.com/science/article/pii/S0378112703005139).

## Referencia visual aprobada: Bosque boreal / Taiga (2026-11-09)

`forest_boreal` conserva `id`, nombre bilingüe, estructura y **todas** las condiciones `spawn.required` y `spawn.preferred`; se actualizan únicamente las descripciones `es` y `en`.

**Referencia principal:** taiga de Finlandia y Canadá, con pinos, abetos y píceas altos y oscuros, suelo de musgos y líquenes, claros naturales, lagos dispersos, nieve invernal y veranos cortos. Se busca una silueta de coníferas y paisaje frío septentrional. Esta es una referencia estética, no una limitación a esos países.

**Variación estacional:** en regiones de taiga de Siberia oriental, como Yakutia, destacan alerces que se vuelven dorados en otoño y pierden sus agujas. Esto constituye una variación del mismo subbioma, **sin crear un nuevo ID** ni imponer alerces en toda la taiga.

**Diferencia frente a Bosque subalpino:** la taiga se determina por el clima boreal de las regiones frías del norte; el bosque subalpino aparece cerca del límite local de árboles en las montañas. Son paisajes que pueden compartir coníferas, pero tienen criterios ambientales distintos.

**Pendiente para la fase de flora y estaciones:** asociar especies de pinos, abetos, píceas, musgos y alerces a la vegetación regional y sus colores de otoño. No se añaden mecánicas estacionales ni se modifica Engine.

## Altura obligatoria: escala de Evolve 0–100 (2026-11-09)

El director aprobó sustituir los rangos **preferidos en metros** por un **rango obligatorio de altura de Evolve** para los siete bosques. El único campo de altitud del `spawn` pasa a ser `spawn.required.elevationLevel`, con enteros de 0 a 100, inclusive. Fuera del intervalo `required`, **el subbioma no puede aparecer**, aunque todas las demás variables sean favorables.

| Subbioma | `spawn.required.elevationLevel` |
|---|---:|
| Selva (`forest_tropical`) | 1–50 |
| Bosque nuboso (`forest_cloud`) | 25–74 |
| Bosque templado (`forest_temperate`) | 1–64 |
| Bosque boreal (`forest_boreal`) | 1–55 |
| Bosque subalpino (`forest_subalpine`) | **65–84** |
| Bosque de secuoyas (`forest_redwood`) | 1–35 |
| Pantano arbolado (`forest_wooded_swamp`) | 1–20 |

**Origen de los umbrales:** propuesta inicial de diseño relativa a las formas del relieve de Evolve. Las reglas históricas aisladas en `Evolve/worldgenerationold` situaban la montaña inclinada desde nivel 65 y la cumbre infranqueable desde 85; eso inspira el intervalo subalpino 65–84, **pero no reactiva ni vincula el nuevo motor a ese código**. Cuando se diseñe la elevación canónica en el nuevo generador, estos números deberán validarse contra su distribución y contra el solapamiento con Montaña rocosa.

**No equivale a metros.** La escala 0–100 es un índice normalizado del relieve del mundo, no una magnitud geográfica con un factor fijo de conversión a metros. Por ello se eliminaron todas las `spawn.preferred.elevationMeters` forestales en vez de aplicar una falsa regla como «1 nivel = 30 m». Se mantiene `terrain: land` en todos los bosques; el 0 se reserva en esta propuesta como referencia del mar, de modo que los bosques inician desde nivel 1.

**Nota sobre línea de árboles:** `forest_subalpine` conserva la restricción distinta `distanceBelowLocalTreelineMeters: { min: 0, max: 700 }` hasta diseñar cómo representar esa distancia física respecto al límite arbóreo local en un generador que solo usa altura normalizada. No es una segunda altitud absoluta y sigue pendiente de implementación. En ningún caso puede anular `elevationLevel: 65–84`: un bosque subalpino en altura 10 está prohibido.

**Conservación:** temperatura, lluvia, humedad, pendientes, latitud, niebla, agua dulce, y descripciones bilingües permanecen sin cambios. Los restantes 16 subbiomas siguen sin `spawn` y el manglar continúa en Marino. El motor de `Evolve` no se modifica durante esta fase teórica.

## Latitud preferida de todos los bosques (2026-11-09)

El director aprobó completar `spawn.preferred.absoluteLatitudeDegrees` para los cuatro bosques que aún no tenían latitud. La latitud **sigue siendo preferida, no obligatoria**; `spawn.required.elevationLevel` (0–100) continúa siendo obligatorio y no se modifica.

| Subbioma | Latitud absoluta preferida (0–90°) | Estado |
|---|---:|---|
| Selva (`forest_tropical`) | 0–23,5° | Existente, sin cambios |
| Bosque nuboso (`forest_cloud`) | 0–30° | Añadida |
| Bosque templado (`forest_temperate`) | 30–60° | Existente, sin cambios |
| Bosque boreal (`forest_boreal`) | 50–75° | Existente, sin cambios |
| Bosque subalpino (`forest_subalpine`) | 30–70° | Añadida |
| Bosque de secuoyas (`forest_redwood`) | 35–43° | Añadida |
| Pantano arbolado (`forest_wooded_swamp`) | 20–35° | Añadida |

**Criterio:** estos intervalos orientan la selección cuando coinciden varios biomas. No constituyen filtros duros; el motor futuro deberá valorar también relieve, humedad, clima y condiciones obligatorias. `absoluteLatitudeDegrees` usa la distancia angular al ecuador, idéntica para latitudes N/S; una preferencia de 35–43° no significa que la secuoya costera sea nativa de ambos hemisferios. La distribución biogeográfica de flora y hemisferios se modelará aparte.

**Referencias:** para `forest_cloud` se priorizan montañas tropicales y subtropicales (0–30°) con niebla frecuente: [NatureServe, Tropical Montane Rainforest](https://explorer.natureserve.org/Taxon/ELEMENT_GLOBAL.2.1298972/Tropical_Montane_Rainforest_Ecobiome). Para `forest_subalpine` (30–70°), se prioriza estéticamente la taiga montana templada/fría tipo Banff; la línea de árboles también existe en montañas tropicales, que no quedan excluidas por una preferencia: [Nature Education, Global Treeline Position](https://www.nature.com/scitable/knowledge/library/global-treeline-position-15897370/). Para `forest_redwood`, la franja preferida de 35–43° engloba su área nativa costera de aproximadamente 35,7–42,2°N: [USFS, Silvics of North America: Redwood](https://research.fs.usda.gov/silvics/redwood). `forest_wooded_swamp` prefiere 20–35° como generalización subtropical del ejemplo Everglades: [USDA NRCS, Subtropical Freshwater Forested Wetlands of Everglades](https://edit.sc.egov.usda.gov/catalogs/esd/156A/F156AY210FL). Estos cuatro intervalos son **decisiones de diseño para Evolve**, no límites científicos.

No se modificaron las condiciones de altura, temperatura, niebla, precipitación, pendiente, humedad ni la clasificación del manglar marino.


## Distribución porcentual terrestre y número de masas (2026-11-09)

**Nuevo contrato preliminar del catálogo:** `distribution` es independiente de `spawn`. Se refiere a **celdas terrestres de la cuadrícula hexagonal**, no a superficie en metros ni a km². Este diseño no se ha implementado en `fgabo404/Evolve` ni impone cuotas sobre la Wiki.

- `targetLandPercent`: objetivo preliminar de porcentaje **sobre todas las celdas terrestres del planeta**, independientemente del tamaño de la cuadrícula. `null` significa **ausencia de una estimación global defendible**, no 0 %.
- `percentBasis`: procedencia del valor: `earthProxy` (aproximación a partir de una categoría o inventario terrestre real), `historicalEarthProxy` (extensión histórica de un ecosistema) o `unavailable` (estimación global no disponible).
- `minRegions`: cantidad mínima de **masas conectadas** del subbioma en el planeta.
- `maxRegions`: máximo de masas conectadas; `null` significa *sin máximo definido*.
- Una masa es un **componente conexo de celdas hexagonales del mismo subbioma**, según la vecindad del grid y su topología (incluido cierre longitudinal si aplica). **No equivale al número de hexágonos** de esa masa.

### Referencias preliminares y límites de masas

| Subbioma | `targetLandPercent` | Origen y limitación | Mín. masas | Máx. masas |
|---|---:|---|---:|---:|
| Selva | **8,8 %** | Aproximación: 1 140 millones ha de bosque en zona de selva tropical según IPCC (2020) divididos por tierra mundial del Banco Mundial (~129,76 millones km², 2023). No es exactamente el área del subbioma Evolve. | **2** | **3** |
| Bosque nuboso | **0,165 %** | Aproximación: 214 630 km² de bosques nubosos tropicales reportados en síntesis científica (estimación histórica). | 1 | Sin límite |
| Bosque templado | **5,4 %** | Aproximación: 17 % del bosque mundial en zona templada × 31,81 % de cobertura forestal terrestre. Zona climática ≠ subbioma Evolve. | **2** | **4** |
| Bosque boreal (taiga) | **8,9 %** | Aproximación: 28 % del bosque mundial en zona boreal × 31,81 % de cobertura forestal terrestre. | 1 | Sin límite |
| Bosque subalpino | **Pendiente (`null`)** | No se encontró una estadística global exclusiva y comparable de bosque subalpino. No inventar un porcentaje ni confundirlo con *todos* los bosques de montaña. | 1 | Sin límite |
| Redwood | **0,006 %** | Referencia **histórica**, ≈2 millones de acres de bosque maduro costero original (NPS) / tierra mundial; no representa superficie actual ni regiones continuas reales. | **1** | **1** |
| Pantano arbolado | **0,9 %** | Aproximación: 1,17 millones km² de bosques pantanosos/inundables, estimación global reportada por Ramsar con alta incertidumbre y posible solapamiento. | **1** | **2** |

**Advertencia científica imprescindible:** estos siete porcentajes **no constituyen una partición global exclusiva del 31,81 % forestal**. Las fuentes usan años, definiciones y áreas de referencia diferentes: el bosque nuboso puede contarse dentro de selvas tropicales; Redwood dentro del bosque templado; subalpino dentro del templado/boreal; pantanos arbolados dentro de otras categorías. Además, existen bosques subtropicales y tipos no diferenciados en el catálogo. **No sumar estos porcentajes para exigir un presupuesto total del planeta sin antes definir una reclasificación exclusiva.** En la fase del nuevo generador se normalizarán las cuotas compatibles y se resolverán explícitamente las clases solapadas, respetando el presupuesto de tierra y otras categorías de bioma.

**Regiones conectadas aprobadas:** Selva debe formar entre **2 y 3 masas**; Bosque templado entre **2 y 4**; Pantano arbolado entre **1 y 2**; Redwood **exactamente 1**. Bosque nuboso, subalpino y boreal conservan mínimo provisional de una región y máximo pendiente de definición. Una masa de Redwood puede tener varios hexágonos, cuyo número escala con el tamaño del mapa. Al generar, hay que comprobar que el porcentaje se pueda representar y que existan lugares ambientalmente compatibles; no colocar biomas en zonas imposibles únicamente para cerrar cuotas.

**Fuentes y metodología:**

- [FAO, FRA 2025: 31,81 % de tierra con bosque](https://www.fao.org/sustainable-development-goals-data-portal/data/indicators/indicator-1511---forest-area-as-a-percentage-of-total-land-area/en).
- [FAO, FRA 2025, cobertura mundial y distribución climática](https://www.fao.org/interactive/2025/forest-resources-assessment/en/).
- [FAO, FRA 2020: bosques por dominios climáticos](https://www.fao.org/interactive/forest-resources-assessment/2020/en/).
- [IPCC AR6, tropical forests, tabla CCP7.1](https://www.ipcc.ch/report/ar6/wg2/chapter/ccp7/).
- [Scatena et al., tropical montane cloud forests, ~215 000 km²](https://pmc.ncbi.nlm.nih.gov/articles/PMC3997648/).
- [NPS, extensión histórica de bosques maduros Redwood](https://www.nps.gov/muwo/learn/nature/old-growth.htm).
- [Ramsar, Global Wetland Outlook, extensión de bosques pantanosos](https://www.ramsar.org/sites/default/files/documents/library/gwo_technical_note_status_e.pdf).
- [Banco Mundial, área mundial de tierra ~129,76 millones de km² (2023)](https://data.worldbank.org/indicator/AG.LND.TOTL.K2?locations=1W).
- [Forest Service, características de bosques subalpinos](https://research.fs.usda.gov/treesearch/52158).

## Criterios pendientes para bosque nuboso, subalpino y boreal (propuesta, no aprobada)

**No modificar `distribution` ni `spawn` de estas tres categorías hasta que el usuario apruebe el contrato.** Se estudia un sistema de regiones dependientes de sistemas montañosos y clima local, manteniendo el contador de masas como componentes conectados de la cuadrícula.

- **Nuboso:** permitir bosques en franjas montanas húmedas frecuentemente inmersas en nubes; favorecido en latitudes tropicales/subtropicales y en laderas expuestas a humedad orográfica. No asignar una masa por montaña automáticamente: una misma cordillera puede contener varias masas fragmentadas, y una montaña seca puede no contener ninguna.
- **Subalpino:** ubicar los bosques justo por debajo de la línea local de árboles, en zonas montañosas frías; preferir latitudes templadas o altas, sin prohibir bosques de límite arbóreo tropicales si el clima lo permite. La latitud modifica las cotas térmicas y la línea de árboles, pero no sustituye temperatura, humedad ni relieve.
- **Boreal:** priorizar grandes bandas de bosque frío hacia latitudes altas, vinculadas a condiciones térmicas y continuidad territorial; **no depende de existir montañas**. El número de masas puede ser pequeño y mayoritariamente continuo, pero todavía no se fija máximo.

El bosque nuboso tropical y el subalpino pueden coexistir en una misma cadena montañosa en diferentes altitudes. También pueden existir otros bosques montanos intermedios; no forzar una transición directa si los requisitos ecológicos no se cumplen. Las restricciones actuales de altura 25–74 (nuboso) y 65–84 (subalpino), la latitud preferida y las condiciones de niebla/línea de árboles permanecen intactas. En la nueva generación habrá que evaluar montaña/cordillera, humedad orográfica, temperatura y línea de árboles local antes de asignar sectores de bosque.

Referencias de ecología y zonación: [Körner et al., pisos bioclimáticos montañosos dependientes de la latitud](https://link.springer.com/article/10.1007/s00035-011-0094-4); [FAO, ecosistemas montanos y subalpinos](https://www.fao.org/fileadmin/templates/mountain_partnership/doc/ipromo_1_motta.pdf); [UNECE, banda boreal circumpolar](https://unece.org/forests/boreal-forests).
