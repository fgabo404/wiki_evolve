# L03 — Llanuras de Evolve

**Fecha:** 2026-11-09  
**Repositorio:** `fgabo404/wiki_evolve`, rama `develop`  
**Fuente única:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Alcance y estado

Conservar exactamente cuatro subbiomas existentes de Llanuras:

1. `plains_savanna` — Sabana / Savanna — **definido y aprobado**.
2. `plains_prairie` — Pradera / Prairie — **definido y aprobado**.
3. `plains_steppe` — Estepa / Steppe — **definido y aprobado**.
4. `plains_open_wetland` — Humedal abierto (Pantanal) / Open wetland (Pantanal) — **definido y aprobado**.

No añadir Matorral. **Tundra permanece como bioma independiente**; puede ocupar tanto llanuras como montañas. Los cuatro subbiomas de Llanuras tienen `description.es/en`, `spawn.required`, `spawn.preferred` y `distribution` aprobados.

## Sabana — `plains_savanna`

### Identidad visual aprobada

- **Referencia principal: Serengeti (Tanzania).** Pastizales abiertos dorados en época seca y verdes en época lluviosa, acacias aisladas, horizontes amplios y colinas suaves.
- **Referencia principal: Masái Mara (Kenia).** Amplias llanuras herbáceas, ondulaciones del terreno, árboles espaciados y variación estacional del follaje.
- **Variante regional: Cerrado brasileño.** Hierbas dominantes con arbustos y árboles más bajos, irregulares o retorcidos. No se debe confundir con bosque cerrado.
- **Variante regional: sabanas del norte de Australia.** Pastizales con eucaliptos dispersos y marcada estacionalidad de lluvias.

Todas pertenecen al **mismo subbioma**. En el futuro, especies de árboles, color y altura de la hierba, pastoreo y régimen de incendios podrán modificar el aspecto visual sin generar nuevos subbiomas. Las sabanas también pueden tener muy pocos árboles; no se exige que cada celda tenga al menos uno. Los incendios naturales son factores ecológicos importantes, **no condiciones obligatorias de spawn**.

### Condiciones declarativas

| Parámetro | Obligatorio (`required`) | Preferido (`preferred`) |
|---|---|---|
| Terreno | `land` | — |
| Altura normalizada de Evolve | **1–64** | — |
| Latitud absoluta | — | **0–30°** |
| Temperatura media anual | **≥18 °C** | **20–30 °C** |
| Precipitación anual | **400–1800 mm/año** | **650–1300 mm/año** |
| Meses secos al año | **3–8** con umbral de 60 mm/mes | — |
| Dominancia de vegetación herbácea | `herbaceousVegetationDominant: true` | — |
| Cobertura de copas de árboles | **≤40 %** | **5–30 %** |

**Importante:** los rangos numéricos son **decisiones provisionales de diseño de Evolve**, no leyes naturales ni valores universales para todas las sabanas terrestres. Las referencias principales se interpretan ecológica y visualmente; no deben reproducirse como fronteras continentales.

- `elevationLevel` usa enteros 0–100, **no metros**; 0 queda reservado como nivel oceánico en esta definición terrestre.
- `absoluteLatitudeDegrees` usa grados absolutos y **es una preferencia**, nunca un filtro duro o una limitación de origen geográfico.
- `dryMonthsPerYear.dryMonthThresholdMm` usa el mismo contrato declarativo de Selva para identificar meses secos, con un valor de referencia de 60 mm.
- `herbaceousVegetationDominant` y `treeCanopyCoverPercent` son **campos conceptuales nuevos**, sin cálculo ni intérprete en el nuevo Engine. La cobertura de copas describe proporción de terreno cubierta por proyección de copas, no número de árboles. El máximo 40 % permite sabanas abiertas, y las más arboladas pueden requerir una clasificación futura adicional.
- La combinación de aridez estacional, calor y vegetación abierta diferencia la sabana de la selva, de los pastizales templados y del desierto. En las zonas de transición puede haber solapamientos: la prioridad de clasificación será una decisión posterior del motor.

### Gráfica de distribución

La Wiki usa automáticamente el componente existente `js/modules/biomes/biome-distribution-chart.js` para dibujar los cuatro subbiomas: Sabana (0–30°, altura 1–64), Pradera (30–60°, altura 1–64), Estepa (30–60°, altura 1–74) y Humedal abierto (10–25°, altura 1–38). El eje de latitud indica **preferencia**, no exclusión; la altura es un límite requerido.

### Referencias ecológicas

- [National Geographic Society — Grassland Biome](https://education.nationalgeographic.org/resource/grassland-biome/): sabanas y praderas, estacionalidad de precipitaciones, pastoreo e incendios.
- [UNEP-WCMC — Serengeti National Park](https://world-heritage-datasheets.unep-wcmc.org/datasheet/output/site/serengeti-national-park/): mosaico de pastos cortos, acacias aisladas, franjas arboladas y lluvias estacionales.
- [National Geographic Society — Grasslands Explained](https://education.nationalgeographic.org/resource/grasslands-explained/): diferencia entre sabanas tropicales y pastizales templados.

## Restricciones de la fase teórica

Esta entrega solo modifica datos declarativos, las etiquetas de la ficha y pruebas de la Wiki. **No modifica `fgabo404/Evolve`, su generador ni las definiciones aprobadas de Bosque o Desierto.** La implementación de vegetación, clima, hidrología, inundaciones, fuego y pastoreo forma parte de un trabajo posterior. Las cuatro fichas teóricas de Llanuras están definidas; esto no implica que Engine las implemente.

## Distribución territorial de Sabana (2026-11-09)

**Aprobado:** se conserva `spawn.preferred.absoluteLatitudeDegrees: 0–30°` como **preferencia**, no requisito; `spawn.required.elevationLevel: 1–64` continúa obligatorio. El bioma ocupa preliminarmente `targetLandPercent: 13.8`, calculado respecto de **todos los hexágonos terrestres** de cualquier tamaño de mapa; debe formar **entre 2 y 4 masas conectadas** del mismo subbioma.

```json
"distribution": {
  "targetLandPercent": 13.8,
  "percentBasis": "earthProxy",
  "minRegions": 2,
  "maxRegions": 4
}
```

**Procedencia y cautela:** 13,8 % es una **aproximación** inspirada en una estimación amplia de *sabanas y sabanas arboladas* de la Tierra. No es una superficie mundial exclusiva y exactamente idéntica al subbioma Sabana de Evolve; puede solaparse con ciertas formaciones forestales o abiertos de otras taxonomías. Debe reconciliarse más adelante con las cuotas de Bosque, Desierto y otras Llanuras antes de usarse como suma mundial obligatoria. El número de masas es un **límite de diseño**, no una cifra global observada. Los 2–4 componentes conectados de hexágonos pueden variar en tamaño y deben respetar clima, estación seca, vegetación y altura ya aprobados.

**Pradera** queda definida por separado con porcentaje terrestre pendiente de diferenciar de Estepa. **Estepa y Humedal abierto** mantienen el porcentaje terrestre `null`, pero ya tienen conteos aprobados: Estepa **2–4 masas** y Pantanal **exactamente 1 masa si aparece**. El motor nuevo de Evolve no se modifica.

## Pradera — `plains_prairie` (2026-11-09, aprobado)

**Identidad visual:** pastizales templados de las Grandes Llanuras de Norteamérica (especialmente pradera de hierba alta) y las Pampas argentinas. Horizontes amplios, relieve plano o suavemente ondulado, hierbas verdes en estación de crecimiento y doradas en periodos secos o fríos, con árboles muy escasos. La altura de la hierba puede variar regionalmente y entre estaciones. Pradera se distingue de **Sabana** por el régimen templado y de **Estepa** por su humedad relativamente mayor.

**Contrato declarativo:**

| Parámetro | `required` | `preferred` |
|---|---|---|
| Terreno | `land` | — |
| Altura Evolve normalizada | **1–64** | — |
| Latitud absoluta | — | **30–60°** |
| Temperatura media anual | **2–20 °C** | — |
| Precipitación anual | **450–1200 mm/año** | — |
| Dominancia herbácea | `herbaceousVegetationDominant: true` | — |
| Cobertura de copas | **máximo 10 %** | — |
| Pendiente | — | **0–10°** (aproximación a terreno plano/suavemente ondulado) |

La pendiente preferida 0–10° es una **heurística de diseño** para concretar la apariencia aprobada; no excluye absolutamente praderas sobre laderas y no forma parte de `spawn.required`. Los demás rangos son decisiones de diseño de Evolve, no límites naturales universales.

**Distribución y masas:**

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 2,
  "maxRegions": 4
}
```

El porcentaje terrestre permanece **pendiente de estimación exclusiva** (`null` no significa 0 %). La referencia aproximada del **8,3 %** que estamos utilizando incluye conjuntamente praderas, estepas y otros pastizales no arbolados, así que **no puede atribuirse íntegramente a Pradera**. Se evaluará junto con Estepa para evitar duplicidades. En cambio, los límites de **2–4 masas conectadas** sí están aprobados por planeta, independientemente del tamaño de la cuadrícula.

**Gráfica:** la vista reutilizable traza automáticamente los cuatro subbiomas desde el catálogo. Pradera conserva latitud preferida 30–60° y altura requerida 1–64.

**Referencias:** [FAO, Grasslands of the World: South American temperate grasslands](https://www.fao.org/4/y8344e/y8344e0g.htm); [National Geographic, Grassland Biome](https://education.nationalgeographic.org/resource/grassland-biome/).

## Estepa — `plains_steppe` (2026-11-09, aprobado)

### 1. Apariencia

- **Referencia principal: Mongolia y Asia Central.** Horizontes muy abiertos, hierbas bajas resistentes a la sequía, colinas suaves y pastos verdes en época de crecimiento, dorados u ocres en periodos secos.
- **Variante regional: Patagonia argentina.** Estepa más fría y seca, con vegetación dispersa, arbustos bajos y suelos pedregosos.
- Frente a Pradera, la cobertura herbácea es menos densa y la precipitación es más baja. No se crean subbiomas diferentes para Mongolia y Patagonia.

### 2. Condiciones de aparición

| Parámetro | `required` | `preferred` |
|---|---|---|
| Terreno | `land` | — |
| Altura Evolve | **1–74** | — |
| Latitud absoluta | — | **30–60°** |
| Temperatura media anual | **−10 a 15 °C** | — |
| Precipitación anual | **150–500 mm** | **200–400 mm** |
| Vegetación herbácea dominante | `true` | — |
| Cobertura de copas arbóreas | **≤10 %** | — |
| Emplazamiento climático | — | Interior continental **o** sombra orográfica (`interiorOrRainShadow: true`) |

La preferencia de interiores continentales o sombras de lluvia es **disyuntiva**: basta con que se dé uno de esos contextos; no se exige estar a la vez lejos de la costa y bajo el efecto de una cordillera. No se impone una montaña bajo la celda. Relieve visual preferido: llanuras, mesetas y colinas suaves, sin inventar un umbral de pendiente obligatorio.

### 3. Distribución y masas

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 2,
  "maxRegions": 4
}
```

Las **2–4 masas** son regiones conectadas sujetas a condiciones de aparición y tamaño del mundo, no áreas ni formas geográficas prefijadas. La cuota terrestre continúa pendiente de separar de Pradera y otros pastizales templados, por lo que no se reutiliza íntegramente una estadística conjunta. Latitud es preferencia; altura 1–74 es un límite obligatorio.

## Humedal abierto (Pantanal) — `plains_open_wetland` (2026-11-09, aprobado)

### 1. Apariencia

- **Referencia principal y aprobada: Pantanal brasileño.** Extensas llanuras inundables, pastos verdes, lagunas poco profundas, canales fluviales e islas pequeñas de árboles y arbustos.
- El sistema natural se extiende también por Bolivia y Paraguay, pero Brasil determina la identidad visual principal del subbioma.
- En época húmeda el agua cubre amplias superficies; en época seca quedan pastizales y algunas lagunas/canales persistentes.
- Predomina la vegetación herbácea y acuática; no se confunde con Pantano arbolado, que tiene árboles dominantes.

### 2. Condiciones de aparición

| Parámetro | `required` | `preferred` |
|---|---|---|
| Terreno | `land` | — |
| Altura Evolve | **1–38** | **1–20** |
| Latitud absoluta | — | **10–25°** |
| Latitud excepcional | No se convierte en límite obligatorio | **0–30°** solo como posibilidad climática documentada |
| Temperatura media anual | **20–28 °C** | — |
| Precipitación anual | **900–1700 mm** | **1100–1500 mm** |
| Vegetación herbácea dominante | `true` | — |
| Cobertura de copas de árboles | — | **≤20 %** |
| Influencia fluvial / llanura aluvial | `fluvialFloodplainInfluence: true` | — |
| Drenaje lento | `slowDrainage: true` | — |
| Inundación estacional recurrente | `seasonalFlooding: true` | — |

**No basta con lluvia abundante**. La condición distintiva es la hidrología: un sistema de cuencas y ríos que puede desbordar sobre una llanura casi plana, con acumulación temporal de agua y drenaje lento. No requiere cercanía a la costa. La categoría visual no cambia entre estaciones; un futuro sistema visual podrá mostrar superficies inundadas o pastizales secos, pero todavía no se ha implementado.

`fluvialFloodplainInfluence`, `slowDrainage`, `seasonalFlooding` e `interiorOrRainShadow` (Estepa) son **conceptos declarativos nuevos**, no métricas ya calculadas por Engine. La capacidad hidrológica y la clasificación de sus umbrales quedan pendientes para la implementación del nuevo generador. La latitud excepcional 0–30° se documenta como posibilidad y **no amplía artificialmente el rectángulo preferido** de la gráfica.

### 3. Distribución y masa única

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 1,
  "maxRegions": 1
}
```

**Decisión explícita del diseño: una sola masa continua de Pantanal por mundo (1–1)**, si existe una cuenca viable. No deben colocarse manchas aisladas para satisfacer el mínimo en mapas sin condiciones hidrológicas adecuadas. La extensión depende de la cuenca, el relieve y el agua, no de un tamaño fijo ni de un porcentaje terrestre inventado.

### 4. Comparación y estado

| Característica | Pradera | Estepa | Humedal abierto | Pantano arbolado |
|---|---|---|---|---|
| Vegetación | Pasto denso | Pasto bajo disperso | Pastos húmedos y plantas acuáticas | Árboles dominantes |
| Agua | Moderada | Semiárida | Inundaciones recurrentes | Saturación o inundación frecuente |
| Relieve | Llanuras/ondulaciones | Llanuras/mesetas | Llanuras aluviales casi planas | Depresiones y zonas anegadas |
| Altura Evolve | 1–64 | 1–74 | 1–38 | 1–20 |
| Masas | 2–4 | 2–4 | **1–1** | 1–2 |

Los rangos son aproximaciones de diseño y no límites ecológicos universales. **Llanuras queda definida teóricamente; el Engine no consume estas nuevas reglas todavía.**
