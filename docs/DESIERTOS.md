# D02 — Desiertos de Evolve

**Fecha:** 2026-11-09  
**Repositorio:** `fgabo404/wiki_evolve`  
**Rama:** `develop`  
**Catálogo:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Alcance

Se mantienen exactamente los tres subbiomas ya presentes: arenoso (dunas), rocoso (cañones y mesetas) y salar. No se agrega un cuarto «desierto frío», ya que el clima cálido o frío puede variar en los tres paisajes. Se completan las descripciones `es` y `en` y las condiciones declarativas `spawn.required` y `spawn.preferred`.

Siguiendo el estándar aprobado para Bosque:

- **Altura:** `spawn.required.elevationLevel`, obligatoria, nivel de relieve de Evolve 0–100; no equivale directamente a metros.
- **Latitud:** `spawn.preferred.absoluteLatitudeDegrees`, preferida, grados absolutos 0–90° (ambos hemisferios).
- **Aridez:** `spawn.required.annualPrecipitationMm.max = 250`, criterio de diseño basado en el límite clásico de tierras áridas; la realidad también depende de la evapotranspiración.
- **Material y forma:** condiciones geológicas diferenciadoras, declarativas; el nuevo motor todavía no las calcula.

## Subbiomas aprobados para la fase teórica

| Nombre (ES / EN) | ID | Altura requerida | Latitud preferida | Precipitación requerida | Material superficial requerido |
|---|---|---:|---:|---:|---|
| Arenoso (dunas) / Sandy (dunes) | `desert_sandy` | **1–64** | 10–40° | ≤250 mm/año | `sand` |
| Rocoso (cañones y mesetas) / Rocky (canyons and plateaus) | `desert_rocky` | **1–84** | 15–50° | ≤250 mm/año | `rock_gravel` |
| Salar / Salt flat | `desert_salt_flat` | **1–74** | 15–45° | ≤250 mm/año | `salt_crust` |

Los intervalos de altura y latitud son **propuestas de diseño para Evolve** basadas en los paisajes objetivo, no límites científicos absolutos. Los límites superiores evitan colocar los paisajes en las cumbres del nivel 85+ en el sistema de relieve histórico usado como referencia; deben revisarse con el nuevo generador. La latitud preferida no impide la aparición fuera de ese intervalo si las otras condiciones son apropiadas.

### Desierto arenoso — `desert_sandy`

Referencia visual: los **ergs del Sahara** y otros mares de dunas.

- `required`: terreno terrestre; altura 1–64; lluvia ≤250 mm/año; `dominantSurfaceMaterial: "sand"`; `aeolianDuneField: true`.
- `preferred`: lluvia 0–150 mm/año; temperatura media anual 10–35 °C; latitud absoluta 10–40°.
- La arena depositada por el viento y la presencia de dunas distinguen este paisaje de un desierto arenoso plano. La temperatura preferida no excluye dunas en climas fríos.

### Desierto rocoso — `desert_rocky`

Referencia visual: **Atacama**, con la posibilidad de ambientes fríos como el **Gobi**.

- `required`: terreno terrestre; altura 1–84; lluvia ≤250 mm/año; `dominantSurfaceMaterial: "rock_gravel"`.
- `preferred`: lluvia 0–150 mm/año; temperatura media anual −5 a 30 °C; pendiente 0–35°; latitud absoluta 15–50°.
- El material rocoso y la grava son definitorios. Los cañones, mesetas, roquedos y laderas son **formas de relieve posibles**, no requisitos universales.

### Salar — `desert_salt_flat`

Referencia visual: **Salar de Uyuni** (Bolivia), sin limitar el subbioma a ese país.

- `required`: terreno terrestre; altura 1–74; lluvia ≤250 mm/año; `dominantSurfaceMaterial: "salt_crust"`; `endorheicBasin: true`; pendiente ≤5°.
- `preferred`: lluvia 0–150 mm/año; temperatura media anual −5 a 30 °C; pendiente 0–2°; latitud absoluta 15–45°.
- Se forma en cuencas sin salida al mar; el agua puede llegar estacionalmente y evaporarse, acumulando sal. La planitud y la costra evaporítica diferencian el salar del desierto arenoso y rocoso.

## Contrato conceptual del terreno

Los nuevos campos geológicos son declarativos y **no están implementados** en el nuevo generador de Evolve:

| Campo | Valores usados | Interpretación |
|---|---|---|
| `dominantSurfaceMaterial` | `sand`, `rock_gravel`, `salt_crust` | Material superficial dominante de la celda |
| `aeolianDuneField` | `true` | La celda forma parte de un campo de dunas formado por el viento |
| `endorheicBasin` | `true` | La celda pertenece a una cuenca hidrográfica cerrada, sin drenaje externo |

El material debe calcularse a partir de geología/sedimentos y el relieve de procesos geomorfológicos cuando corresponda. **No debe inferirse `sand` solo por temperatura ni `salt_crust` solo por precipitaciones bajas**. En una futura implementación habrá que definir clasificación de superficies, erosión, transporte y depositación, drenaje y evaporación. Se conserva el catálogo como **diseño teórico** y no se modifica `Evolve`.

## Gráfica interactiva

La vista de **Desierto** de la Wiki utiliza automáticamente el componente genérico `js/modules/biomes/biome-distribution-chart.js`. Debe mostrar tres áreas en el plano:

- Eje X: latitud absoluta 0–90° (preferencia).
- Eje Y: altura Evolve 0–100 (requisito).
- Selector y leyenda bilingües, sin valores duplicados fuera del JSON.

Los solapamientos indican posibles regiones comunes de latitud y altura; el clima, el material y la geología resuelven la clasificación real.

## Fuentes de referencia

- [USGS — What Is a Desert?](https://pubs.usgs.gov/gip/deserts/what/): aridez, desiertos fríos y calientes, rocas, gravas y arena.
- [USGS — Desert Features](https://pubs.usgs.gov/gip/deserts/features/): dunas, rocas, gravas, salares y demás formas.
- [Utah Geological Survey — Bonneville Salt Flats](https://geology.utah.gov/map-pub/survey-notes/geosights/bonneville-salt-flats/): costras salinas, evaporación y cuencas cerradas.
- [National Geographic — Deserts Explained](https://education.nationalgeographic.org/resource/deserts-explained/): desiertos fríos, calientes y diversidad de superficies.
