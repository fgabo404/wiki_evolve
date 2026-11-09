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
| Bosque subalpino | `forest_subalpine` | Tierra, 0–700 m por debajo del límite local de árboles, lluvia ≥350 mm/año y pendiente ≤40° |
| Bosque de secuoyas | `forest_redwood` | Tierra, temperatura media anual 8–18 °C, lluvia ≥750 mm/año y niebla costera frecuente | 
| Pantano arbolado (Everglades) | `forest_wooded_swamp` | Tierra, suelo saturado durante temporada de crecimiento y agua dulce |

Los siete conservan `spawn.required` y `spawn.preferred`, e incluyen `description: { es, en }` con una presentación ecológica breve. **Las descripciones y las condiciones completas, incluidas las preferencias, están en el JSON**, y la Wiki elige el idioma adecuado. Los rangos son criterios iniciales del diseño de Evolve, no límites universales de los ecosistemas.

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
- Los otros 16 subbiomas siguen sin `spawn`.

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
| `elevationMeters` | `preferred` | 0–900 m |
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
| `elevationMeters` | `preferred` | 400–2800 m |

**Justificación del diseño:** la presencia recurrente de nubes a nivel del dosel es la condición ecológica distintiva; la altitud, la lluvia y la temperatura no deben imponerse como umbrales universales, pues varían con la ubicación, los vientos y el relieve. Los intervalos `preferred` son estimaciones iniciales ajustables para Evolve. El nuevo indicador `cloudImmersionFrequent` es conceptual y aún no está disponible en Engine; su cómputo futuro deberá tener en cuenta viento, relieve y condensación. Debe evitarse la clasificación automática de cualquier zona húmeda de selva como bosque nuboso.

**Manglar:** ya existe como `marine_mangrove` dentro del bioma `marine` (Marino). **No se crea ningún manglar forestal ni se modifica la definición marítima existente**.

**Fuentes:** [USGS — Do mountain clouds exist because of upwind forests?](https://www.usgs.gov/news/do-mountain-clouds-exist-because-upwind-forests), [The climate of cloud forests — GOV.UK](https://www.gov.uk/research-for-development-outputs/the-climate-of-cloud-forests), [Hydroclimatic and ecophysiological basis of cloud forest distributions](https://pmc.ncbi.nlm.nih.gov/articles/PMC3997648/) y [Fog precipitation in a cloud forest of Guatemala](https://www.sciencedirect.com/science/article/pii/S0378112703005139).
