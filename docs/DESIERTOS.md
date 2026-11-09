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

## Identidad visual aprobada: Desierto arenoso (2026-11-09)

`desert_sandy` mantiene su nombre, ID, `spawn.required` y `spawn.preferred` sin cambios. La descripción bilingüe de la Wiki ya refleja estas referencias:

- **Apariencia principal — Sahara y Rub al-Jali:** extensos mares de arena (*ergs*), horizontes abiertos, dunas doradas de crestas onduladas y patrones eólicos variados.
- **Variación rojiza — Namib:** grandes dunas con arenas rojas o anaranjadas y sombras pronunciadas.
- **Variación continental — Taklamakán:** tonos beige o amarillos, clima continental y posibilidad de inviernos fríos.

No se crean nuevos subbiomas para estas variantes. Las formas de duna (barjanes, lineales, estrelladas, etc.) y los colores de arena dependerán en el futuro del viento, la geología y el transporte de sedimentos; **no se inventan todavía campos ejecutables de color, forma, estación o clima**. El criterio esencial sigue siendo el dominio de arena y la existencia de campos de dunas eólicas. Se conservan temperatura y latitud como preferencias, y altura y aridez como condiciones requeridas.

Esta es una definición visual de diseño; no representa que todas las variantes deban aparecer simultáneamente en una misma celda.

## Identidad visual aprobada: Desierto rocoso (2026-11-09)

`desert_rocky` mantiene su nombre, ID y valores de `spawn.required` / `spawn.preferred` sin cambios. La descripción bilingüe documenta los siguientes paisajes dentro de un único subbioma:

- **Apariencia principal — Atacama (Chile):** crestas erosionadas, formaciones rocosas irregulares y suelos expuestos, con colores grises, ocres y rojizos.
- **Apariencia principal — Canyonlands (Utah, Estados Unidos):** cañones profundos, acantilados, mesetas y paredes de roca; su aparición depende del relieve y de la erosión.
- **Variante continental fría — Gobi (Mongolia y China):** extensiones pedregosas y de grava, colinas áridas y vegetación escasa; posibles inviernos fríos.
- **Variante de llanuras rocosas — hamadas del Sahara:** grandes superficies relativamente planas de roca expuesta y grava, con mesetas y elevaciones ocasionales.

**No todos los desiertos rocosos deben tener cañones, mesetas o acantilados.** La condición esencial del subbioma es una superficie árida dominada por roca o grava. El relieve local, los materiales geológicos y los procesos erosivos determinarán visualmente la variante en el futuro. No se crean nuevos subbiomas ni campos ejecutables para estas formas y colores. Se mantienen la temperatura y la pendiente como preferencias, permitiendo terrenos planos y ambientes fríos.

## Identidad visual aprobada: Salar (2026-11-09)

`desert_salt_flat` utiliza **el Salar de Uyuni, Bolivia, como referencia visual principal y definitiva** del subbioma:

- **Superficie dominante:** una extensa llanura salina blanca, muy plana y de horizonte abierto.
- **Estación seca:** costra de sal blanca y brillante, con posibles patrones poligonales.
- **Tras las lluvias:** una lámina de agua muy somera puede inundar temporalmente parte del salar y producir reflejos de cielo (*efecto espejo*); no es permanente ni cubre necesariamente toda la superficie.
- **Variaciones locales menores:** textura algo más rugosa o tonos claros beige o grisáceos, sin desplazar la identidad blanca y plana de Uyuni.

Se mantiene un **único subbioma** sin crear variantes con ID propio. La presencia de cuenca endorreica, costra salina, aridez y pendiente baja continúa siendo obligatoria; la altura y latitud siguen sus valores declarados. Las estaciones y la lámina superficial de agua son referencias visuales conceptuales, todavía no reglas ejecutables del nuevo motor. La referencia a Uyuni es estética y geomorfológica; no limita la generación a Bolivia.

### Estado de Desierto — definición teórica cerrada

Los tres subbiomas existentes han sido revisados y aprobados:

1. **Arenoso:** Sahara y Rub al-Jali como base; Namib y Taklamakán como variantes.
2. **Rocoso:** Atacama y Canyonlands como base; Gobi y hamadas saharianas como variantes.
3. **Salar:** Uyuni como base, con costra blanca poligonal y espejo estacional.

Cada uno tiene `name` y `description` bilingües, `spawn.required` y `spawn.preferred`, y distribución de latitud y altura disponible en la gráfica SVG reutilizable. **Este cierre corresponde al catálogo teórico de la Wiki, no a la implementación de la generación geológica o climática en Evolve.** No cambiar los valores acordados sin una nueva revisión explícita.

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
