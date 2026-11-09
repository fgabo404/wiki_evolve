# L03 — Llanuras de Evolve

**Fecha:** 2026-11-09  
**Repositorio:** `fgabo404/wiki_evolve`, rama `develop`  
**Fuente única:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Alcance y estado

Conservar exactamente cuatro subbiomas existentes de Llanuras:

1. `plains_savanna` — Sabana / Savanna — **definido y aprobado**.
2. `plains_prairie` — Pradera / Prairie — pendiente.
3. `plains_steppe` — Estepa / Steppe — pendiente.
4. `plains_open_wetland` — Humedal abierto (Pantanal) / Open wetland (Pantanal) — pendiente.

No añadir Matorral. **Tundra permanece como bioma independiente**; puede ocupar tanto llanuras como montañas. No asignar `spawn` ni descripciones a los tres subbiomas que aún no se han revisado.

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

La Wiki usa automáticamente el componente existente `js/modules/biomes/biome-distribution-chart.js` para dibujar un rectángulo de **latitud preferida 0–30°** (X) y **altura requerida 1–64** (Y) para Sabana. Pradera, Estepa y Humedal abierto permanecen en el listado de pendientes, sin rangos inventados.

### Referencias ecológicas

- [National Geographic Society — Grassland Biome](https://education.nationalgeographic.org/resource/grassland-biome/): sabanas y praderas, estacionalidad de precipitaciones, pastoreo e incendios.
- [UNEP-WCMC — Serengeti National Park](https://world-heritage-datasheets.unep-wcmc.org/datasheet/output/site/serengeti-national-park/): mosaico de pastos cortos, acacias aisladas, franjas arboladas y lluvias estacionales.
- [National Geographic Society — Grasslands Explained](https://education.nationalgeographic.org/resource/grasslands-explained/): diferencia entre sabanas tropicales y pastizales templados.

## Restricciones de la fase teórica

Esta entrega solo modifica datos declarativos, las etiquetas de la ficha y pruebas de la Wiki. **No modifica `fgabo404/Evolve`, su generador ni la definición ya aprobada de Bosque o Desierto.** La implementación de vegetación, clima, fuego y pastoreo forma parte de un trabajo posterior. Llanuras **no está cerrado** hasta revisar Pradera, Estepa y Humedal abierto.
