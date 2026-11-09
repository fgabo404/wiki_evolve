# L03 — Llanuras de Evolve

**Fecha:** 2026-11-09  
**Repositorio:** `fgabo404/wiki_evolve`, rama `develop`  
**Fuente única:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Alcance y estado

Conservar exactamente cuatro subbiomas existentes de Llanuras:

1. `plains_savanna` — Sabana / Savanna — **definido y aprobado**.
2. `plains_prairie` — Pradera / Prairie — **definido y aprobado**.
3. `plains_steppe` — Estepa / Steppe — pendiente.
4. `plains_open_wetland` — Humedal abierto (Pantanal) / Open wetland (Pantanal) — pendiente.

No añadir Matorral. **Tundra permanece como bioma independiente**; puede ocupar tanto llanuras como montañas. No asignar `spawn` ni descripciones a Estepa y Humedal abierto mientras permanezcan sin revisar.

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
- La combinación de aridez estacional, calor y vegetación abierta diferencia la sabana de la selva, de los pastizales templados aún no definidos y del desierto. En las zonas de transición puede haber solapamientos: la prioridad de clasificación será una decisión posterior del motor.

### Gráfica de distribución

La Wiki usa automáticamente el componente existente `js/modules/biomes/biome-distribution-chart.js` para dibujar un rectángulo de **latitud preferida 0–30°** (X) y **altura requerida 1–64** (Y) para Sabana. Pradera ahora se representa con latitud preferida 30–60° y altura requerida 1–64. Estepa y Humedal abierto permanecen pendientes y sin rangos inventados.

### Referencias ecológicas

- [National Geographic Society — Grassland Biome](https://education.nationalgeographic.org/resource/grassland-biome/): sabanas y praderas, estacionalidad de precipitaciones, pastoreo e incendios.
- [UNEP-WCMC — Serengeti National Park](https://world-heritage-datasheets.unep-wcmc.org/datasheet/output/site/serengeti-national-park/): mosaico de pastos cortos, acacias aisladas, franjas arboladas y lluvias estacionales.
- [National Geographic Society — Grasslands Explained](https://education.nationalgeographic.org/resource/grasslands-explained/): diferencia entre sabanas tropicales y pastizales templados.

## Restricciones de la fase teórica

Esta entrega solo modifica datos declarativos, las etiquetas de la ficha y pruebas de la Wiki. **No modifica `fgabo404/Evolve`, su generador ni la definición ya aprobada de Bosque o Desierto.** La implementación de vegetación, clima, fuego y pastoreo forma parte de un trabajo posterior. Llanuras **no está cerrado** hasta revisar Estepa y Humedal abierto.

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

**Pradera** queda definida por separado con porcentaje terrestre pendiente de diferenciar de Estepa. **Estepa y Humedal abierto** no reciben porcentajes ni conteos por defecto mientras estén pendientes de revisión. El motor nuevo de Evolve no se modifica.

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

**Gráfica:** la vista reutilizable trazará automáticamente Pradera con latitud preferida 30–60° y altura requerida 1–64 junto a Sabana. Estepa y Humedal abierto continúan pendientes.

**Referencias:** [FAO, Grasslands of the World: South American temperate grasslands](https://www.fao.org/4/y8344e/y8344e0g.htm); [National Geographic, Grassland Biome](https://education.nationalgeographic.org/resource/grassland-biome/).
