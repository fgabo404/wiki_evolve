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
| Subbioma | `polar_south_ice` | **Polo Sur** | **South Pole** | **Aprobado** |

Se conservan los IDs de subbioma `polar_north_ice` y `polar_south_ice` para no perder referencias previas. Desaparecen como **categorías principales** los IDs `polar_north` y `polar_south`. Los enlaces antiguos de la Wiki que usan `#biome=polar_north` y `#biome=polar_south` conducen a la ficha correspondiente bajo el nuevo bioma Polo.

**Ambos subbiomas polares tienen `spawn`, descripción y `distribution` aprobados.** Nada de esto modifica el generador de `fgabo404/Evolve`.

## Fundamento geográfico que debemos respetar al definirlos

### Polo Norte

El polo geográfico Norte se sitúa **sobre el océano Ártico**, habitualmente cubierto por hielo marino **flotante**. El hielo varía estacionalmente; puede contener placas, grietas y sectores de agua libre. Las grandes masas terrestres de Groenlandia, Canadá o Eurasia pertenecen a la geografía circundante, **no forman una plataforma continental bajo el Polo Norte**.

### Polo Sur

El polo geográfico Sur se sitúa **sobre la Antártida**, un continente cubierto por un gran manto de hielo **sobre tierra firme**. Se caracteriza por el casquete continental, grandes altiplanos glaciales y relieve bajo hielo; el hielo marino que rodea la Antártida es una condición distinta del propio polo continental.

Esta diferencia debe conservarse **aunque ambos subbiomas compartan el bioma Polo**. Referencias: [NASA — Arctic and Antarctic Sea Ice: How Are They Different?](https://science.nasa.gov/earth/climate-change/arctic-and-antarctic-sea-ice-how-are-they-different/); [National Snow and Ice Data Center — Sea Ice](https://nsidc.org/learn/parts-cryosphere/sea-ice).

## Escala de elevación de Evolve

**La altura de Evolve es siempre 0–100**: el valor 0 referencia el nivel del mar; las elevaciones terrestres ocupan niveles relativos hasta 100. **No equivale a metros**. La profundidad oceánica, cuando sea relevante, se expresará por separado en metros y no cambiará la escala de altura.

Las condiciones de ambos polos ya están aprobadas y se documentan a continuación. La futura implementación deberá respetar la geografía hemisférica, las características del hielo y la escala oficial. Los porcentajes comparables de superficie siguen sin definir y las reglas de emplazamiento no se ejecutan todavía en Engine.

La gráfica reutilizable permanece al pie de las fichas. La visualización polar **distingue dos paneles**: profundidad oceánica en metros para Polo Norte y altura terrestre 0–100 para Polo Sur, sin mezclar ambos ejes incompatibles. Polo Norte aparece con latitud 75–90° y profundidad requerida 0–6.000 m; Polo Sur con latitud 65–90° y elevación requerida 1–100. Ambos están definidos.

## Invariantes del catálogo

El catálogo contiene **7 biomas principales**, **23 subbiomas** en total, **20** con reglas declarativas y **3** pendientes: Tundra, Montaña rocosa y Cumbres. Bosque, Desierto, Llanuras y Marino quedan intactos.

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

## Polo Sur — `polar_south_ice` (aprobado 2026-11-13)

### Apariencia y emplazamiento

**Referencia: continente antártico real.** Una gran masa de tierra firme cubierta por una capa de hielo persistente, con meseta polar elevada, nieve barrida por el viento, glaciares, relieves montañosos emergentes y costas de acantilados glaciales. Las cumbres y plataformas glaciares son variaciones geográficas de Polo Sur, no subbiomas nuevos.

**Ubicación única: parte inferior del mapa, hemisferio sur.** La Antártida se representa como una **única masa continental conectada**. En contraste con el Polo Norte, no es hielo marino flotante. La regla hemisférica requiere la latitud **firmada** de cada hexágono o una orientación polar inequívoca; los grados absolutos por sí solos no distinguen el norte del sur.

### Condiciones aprobadas (sin campos nuevos)

| Campo del catálogo | `spawn.required` | `spawn.preferred` |
|---|---|---|
| `terrain` | `land` | — |
| `elevationLevel` | **1–100** | **25–75** |
| `meanAnnualTemperatureC` | **−60 a 0 °C** | **−55 a −15 °C** |
| `absoluteLatitudeDegrees` | — | **65°–90°** |
| Precipitación anual | Sin condición obligatoria | — |

La elevación `elevationLevel` sigue la **escala normalizada 0–100 de Evolve** (nivel del mar = 0), **nunca una conversión automática de metros físicos**. El rango preferido 25–75 representa una sugerencia de mesetas continentales relativamente elevadas, no una asignación de metros de la Antártida a un nivel concreto. Las regiones costeras de menor altura y las montañas de mayor altura siguen permitidas por el rango requerido 1–100.

La persistencia del hielo terrestre distingue a Polo Sur de otras montañas o tundras frías, pero **todavía no se añade un campo `spawn` nuevo** para hielo glaciar o latitud firmada. Es una regla física y geográfica pendiente de implementación en Engine, sin alterar el diseño aprobado.

### Distribución conectada

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 1,
  "maxRegions": 1
}
```

**Exactamente una masa continental polar**, situada abajo del mapa. El contorno puede ser irregular (penínsulas, bahías, glaciales), y dentro de esa masa habrá distintos relieves, pero **no se crean otros continentes polares aislados** para alcanzar un conteo. La generación debe respetar la topología y el clima del tipo de mundo; la Wiki es declarativa y no ejecuta esta política.

La cuota de superficie terrestre permanece pendiente: `targetLandPercent:null` no asigna porcentaje.

### Diferencia final y gráfica

| Condición | Polo Norte | Polo Sur |
|---|---|---|
| Terreno | Océano (`water`) | Continente (`land`) |
| Cubierta de hielo | Marino flotante | Continental permanente |
| Hemisferio | Norte, parte superior | Sur, parte inferior |
| Eje vertical de Wiki | Profundidad en metros | Elevación Evolve 0–100 |
| Latitud preferida | 75–90° | 65–90° |
| Masas conectadas | **1** | **1** |

El componente reutilizable de distribución de Polo presenta **dos gráficas independientes**, una por subbioma, para no confundir profundidad del mar con altitud terrestre. Ambas permanecen en la parte inferior de la interfaz.

### Pendiente de implementación

La Wiki conserva condiciones aprobadas de diseño. Engine todavía debe modelar la presencia de continente antártico, clima frío persistente, espesor de hielo, morfología de costas, topología de una sola masa, altitudes normalizadas y regla de hemisferios. Ninguno de esos sistemas se implementa en esta modificación.
