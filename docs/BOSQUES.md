# D01 — Bosques de Evolve (migrados a wiki_evolve)

**Fecha:** 2026-11-09  
**Rama:** `develop`  
**Origen:** `fgabo404/Evolve`, rama `definitions`, commit `12423b848fdc2a5e5e527673b9566910e0802b39`  
**JSON de trabajo:** [`../data/biomes/biomes.json`](../data/biomes/biomes.json)

## Bosques actuales

| Nombre | ID | Condiciones obligatorias resumidas |
|---|---|---|
| Selva | `forest_tropical` | Tierra, temperatura media anual 20–30 °C, ≥1500 mm de lluvia al año y ≤3 meses secos |
| Bosque templado | `forest_temperate` | Tierra, 4–8 meses con temperatura media mensual >10 °C y lluvia anual ≥450 mm |
| Bosque boreal (taiga) | `forest_boreal` | Tierra, 1–3 meses con temperatura media mensual >10 °C y lluvia anual ≥200 mm |
| Bosque subalpino | `forest_subalpine` | Tierra, 0–700 m por debajo del límite local de árboles, lluvia ≥350 mm/año y pendiente ≤40° |
| Pantano arbolado (Everglades) | `forest_wooded_swamp` | Tierra, suelo saturado durante temporada de crecimiento y agua dulce |

Los cinco conservan `spawn.required` y `spawn.preferred`, y ahora incluyen `description: { es, en }` con una presentación ecológica breve. **Las descripciones y las condiciones completas, incluidas las preferencias, están en el JSON**, y la Wiki elige el idioma adecuado. Los rangos son criterios iniciales del diseño de Evolve, no límites universales de los ecosistemas.

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

Se distinguen de esta referencia los bosques de secuoyas de América del Norte: las secuoyas costeras (`Sequoia sempervirens`) se asocian a bosques templados lluviosos marítimos con niebla, mientras que las secuoyas gigantes (`Sequoiadendron giganteum`) crecen en bosques montanos de coníferas mixtas de Sierra Nevada. **No se ha creado un nuevo subbioma de secuoyas**; se deja su clasificación futura pendiente de revisión de flora o biomas.

Referencias: [European Forests JRC](https://forest.jrc.ec.europa.eu/media/atlas/European_forests_an_ecological_overview.pdf), [NPS Coast Redwood](https://www.nps.gov/articles/000/coast-redwood.htm) y [NPS Giant Sequoia Groves](https://www.nps.gov/seki/planyourvisit/sequoiagroves.htm).
