# P01 — Polo de Evolve

**Fecha:** 2026-11-13  
**Repositorio:** `fgabo404/wiki_evolve`  
**Rama:** `develop`  
**Catálogo oficial:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Decisión estructural aprobada

Se agrupan los dos biomas antiguos **Polo Norte** y **Polo Sur** en **un único bioma principal llamado Polo**, con **exactamente dos subbiomas**. La unificación de la categoría **no supone** que ambos compartan terreno, condiciones de aparición o forma geográfica.

| Nivel | ID estable | Nombre en español | Nombre en inglés | Estado de definición |
|---|---|---|---|---|
| Bioma | `polar` | **Polo** | **Pole** | Estructura aprobada |
| Subbioma | `polar_north_ice` | **Polo Norte** | **North Pole** | **Aprobado** |
| Subbioma | `polar_south_ice` | **Polo Sur** | **South Pole** | Condiciones pendientes |

Se conservan los IDs de subbioma `polar_north_ice` y `polar_south_ice` para no perder referencias previas. Desaparecen como **categorías principales** los IDs `polar_north` y `polar_south`. Los enlaces antiguos de la Wiki que usan `#biome=polar_north` y `#biome=polar_south` conducen a la ficha correspondiente bajo el nuevo bioma Polo.

**Polo Norte ya tiene `spawn`, descripción ecológica y `distribution` aprobados. Polo Sur permanece sin condiciones aprobadas.** Nada de esto modifica el generador de `fgabo404/Evolve`.

## Fundamento geográfico que debemos respetar al definirlos

### Polo Norte

El polo geográfico Norte se sitúa **sobre el océano Ártico**, habitualmente cubierto por hielo marino **flotante**. El hielo varía estacionalmente; puede contener placas, grietas y sectores de agua libre. Las grandes masas terrestres de Groenlandia, Canadá o Eurasia pertenecen a la geografía circundante, **no forman una plataforma continental bajo el Polo Norte**.

### Polo Sur

El polo geográfico Sur se sitúa **sobre la Antártida**, un continente cubierto por un gran manto de hielo **sobre tierra firme**. Se caracteriza por el casquete continental, grandes altiplanos glaciales y relieve bajo hielo; el hielo marino que rodea la Antártida es una condición distinta del propio polo continental.

Esta diferencia debe conservarse **aunque ambos subbiomas compartan el bioma Polo**. Referencias: [NASA — Arctic and Antarctic Sea Ice: How Are They Different?](https://science.nasa.gov/earth/climate-change/arctic-and-antarctic-sea-ice-how-are-they-different/); [National Snow and Ice Data Center — Sea Ice](https://nsidc.org/learn/parts-cryosphere/sea-ice).

## Escala de elevación y condiciones pendientes

**La altura de Evolve es siempre 0–100**: el valor 0 referencia el nivel del mar; las elevaciones terrestres ocupan niveles relativos hasta 100. **No equivale a metros**. La profundidad oceánica, cuando sea relevante, se expresará por separado en metros y no cambiará la escala de altura.

Las reglas de Polo Norte ya han sido aprobadas. Para Polo Sur se definirán, con aprobación explícita:

- Apariencia y referencia geográfica de cada polo.
- Terreno (océano cubierto por hielo marino frente a continente glaciado), latitud absoluta, temperatura y las variables existentes que correspondan.
- Requisitos de altura 0–100 cuando aplique, y posibles reglas de emplazamiento polar; sin inventar valores por el simple hecho de agruparlos.
- Mínimo y máximo de masas conectadas y porcentaje de superficie, si hay referencia comparable.
- Interacción futura con Marino, Tundra y Montaña, sin implementar Engine.

La gráfica reutilizable permanece al pie de las fichas. La visualización polar debe distinguir la profundidad oceánica en metros del Polo Norte y la altura de tierra 0–100 que corresponderá al Polo Sur; no proyectar ambos en un mismo eje vertical incompatible. Esta adaptación visual queda pendiente de diseño y no altera el catálogo aprobado.

## Invariantes del catálogo

El catálogo contiene **7 biomas principales**, **23 subbiomas** en total, **19** con reglas declarativas y **4** pendientes: Polo Sur, Tundra, Montaña rocosa y Cumbres. Bosque, Desierto, Llanuras y Marino quedan intactos.

## Polo Norte — `polar_north_ice` (aprobado 2026-11-13)

### Aspecto geográfico

La referencia principal es el **océano Ártico real**: una gran masa de hielo marino flotante, con placas irregulares, crestas de presión, grietas y canales de agua oscura. El hielo puede expandirse o retraerse con las estaciones, fenómeno pendiente de implementar.

**Ubicación única: la parte superior del mapa, en el hemisferio norte.** La región debe estar centrada alrededor del extremo más septentrional de la geografía, no dispersarse como islas de hielo por otras partes del mundo. No se confunde con las tierras de Groenlandia, Canadá, Siberia ni con el futuro hielo continental del Polo Sur. No se contabilizan cada placa, grieta o canal como masas separadas.

### Condiciones aprobadas

| Campo reutilizado | `spawn.required` | `spawn.preferred` |
|---|---|---|
| `terrain` | `water` | — |
| `waterDepthMeters` | 0–6.000 m | — |
| `waterSalinityPpt` | 25–35 ‰ | 30–34 ‰ |
| `meanAnnualTemperatureC` | −2 a 1 °C | −2 a 0 °C |
| `absoluteLatitudeDegrees` | — | 75°–90° |

Se utilizan **solamente campos ya compartidos por Marino**. La latitud absoluta 75°–90° es una preferencia, no identifica el signo del hemisferio. La regla obligatoria de estar **al norte y arriba del mapa** es una **restricción de emplazamiento geográfico del generador**, que deberá consultar la latitud firmada y la orientación del mundo, sin crear en esta fase un campo `spawn` nuevo.

El Polo Norte se clasifica como `terrain: water`. Su superficie oceánica está al **nivel 0 de Evolve**, mientras la profundidad `waterDepthMeters` representa **metros hacia abajo** y **nunca valores de altura**. El límite 6.000 m describe un rango de diseño amplio para el océano Ártico, no la altitud de la capa de hielo.

### Distribución

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 1,
  "maxRegions": 1
}
```

**Mínimo 1 y máximo 1 masa**: una sola masa regional de hexágonos conectados, anclada en la zona norte del mundo. El valor no autoriza inventar hielo marino sobre tierra ni forzar clima polar inexistente en un mundo incompatible: debe respetar la geografía generada. El porcentaje de superficie permanece pendiente y no se interpreta como cuota de tierra por usar el campo heredado `targetLandPercent`.

### Interacción futura

- Con Marino: el agua bajo hielo conserva su condición oceánica; la prioridad de clasificación del hielo frente al océano abierto se diseñará con el Engine.
- Con el Polo Sur: Norte = **hielo sobre agua**; Sur = **hielo sobre continente**.
- Estacionalidad: expansión y retroceso de hielo pendientes de incorporar, sin subbiomas adicionales.

La definición es **declarativa y aún no ejecutada en Engine**.
