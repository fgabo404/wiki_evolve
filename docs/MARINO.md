# M01 — Marino de Evolve

**Fecha:** 2026-11-10  
**Rama:** `develop`  
**Catálogo canónico:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Estado de revisión

| ID | Subbioma | Estado |
|---|---|---|
| `marine_reef` | Arrecife | **Aprobado** |
| `marine_estuary_littoral` | Estuario o litoral | **Aprobado** |
| `marine_mangrove` | Manglar | Pendiente |
| `marine_open_ocean` | Océano abierto (alta mar) | Pendiente |

**Alcance:** se han definido Arrecife y Estuario o litoral sin subdividir el catálogo ni modificar el generador de `fgabo404/Evolve`. Manglar y Océano abierto permanecen pendientes.

## 1. Apariencia de Arrecife

**Referencia principal: Gran Barrera de Coral (Australia).** Aguas turquesas en lagunas someras, plataformas coralinas, canales y bordes de arrecife; bajo el agua, corales ramificados y masivos, peces tropicales y formaciones irregulares. Se preservan los arrecifes **costeros, de barrera y atolones** como variantes geográficas del mismo subbioma (también pueden existir arrecifes de parche). Una gran masa regional no implica un único coral ni un arrecife individual continuo a escala real.

Se excluyen por ahora los hábitats de coral de aguas profundas y frías: no son la referencia visual o ecológica aprobada. El crecimiento, blanqueamiento y deterioro del arrecife serían estados futuros, no nuevos parámetros ni subbiomas.

## 2. Condiciones de aparición

| Parámetro | `spawn.required` | `spawn.preferred` |
|---|---|---|
| Terreno (`terrain`) | `water` | — |
| **Profundidad del agua (`waterDepthMeters`)** | **0–50 m** | **0–30 m** |
| **Salinidad del agua (`waterSalinityPpt`)** | **32–42 ‰ (partes por mil)** | — |
| Temperatura media anual (`meanAnnualTemperatureC`) | **20–30 °C** | **23–29 °C** |
| Latitud absoluta (`absoluteLatitudeDegrees`) | — | **0–30°** |

**Contrato de parámetros:** los únicos campos nuevos respecto a los demás biomas son `waterDepthMeters` y `waterSalinityPpt`. Los restantes reutilizan `terrain`, `meanAnnualTemperatureC` y `absoluteLatitudeDegrees`. En celdas acuáticas, `meanAnnualTemperatureC` representa la temperatura media del agua de superficie o del entorno marino relevante, no un nuevo campo de temperatura atmosférica. Esta interpretación debe precisarse cuando Engine implemente el modelo térmico oceánico.

- **Profundidad:** metros positivos desde la superficie del agua hacia abajo; no equivale a `elevationLevel` terrestre (escala normalizada 0–100), que **no** se asigna a Arrecife. No se define todavía una escala marina normalizada.
- **Salinidad:** partes por mil (‰), no porcentajes ni fracciones decimales. Los valores son una aproximación de diseño para arrecifes tropicales, no una regla universal para todo tipo de coral.
- **Latitud:** 0–30° es una **preferencia** para ambos hemisferios, no un filtro excluyente. Una zona subtropical más lejana (hasta aproximadamente 35°) podría ser posible si las condiciones térmicas y marinas lo permiten; no se crea un nuevo límite de latitud obligatorio.
- **Otros factores:** luz, claridad, sedimentación, sustrato estable y circulación de agua son notas ecológicas, **no** campos nuevos de `spawn` en esta fase. Tampoco se exige un rango de precipitaciones atmosféricas.

## 3. Distribución geográfica

Pueden aparecer arrecifes a lo largo de costas tropicales, alrededor de islas y en plataformas submarinas; las barreras coralinas pueden quedar separadas de la costa por lagunas. Los atolones también pueden aparecer lejos de continentes, asociados a antiguos edificios volcánicos sumergidos.

Esta variedad geográfica **no genera categorías separadas**. La latitud, temperatura, salinidad y profundidad deben ser suficientes para la definición declarativa inicial, sin introducir por ahora campos especiales para atolones, sustratos o luz.

## 4. Masas y porcentaje

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 4,
  "maxRegions": 8
}
```

Se proponen **4–8 masas regionales conectadas** en mundos con condiciones marinas apropiadas, siguiendo el contrato de distribución utilizado por los demás biomas. Son regiones de hexágonos, no una cantidad de colonias de coral, y el tamaño puede variar según la cuadrícula. No se deben forzar arrecifes a aparecer en aguas inviables.

**Porcentaje de océano pendiente:** el campo heredado `targetLandPercent` se conserva **nulo exclusivamente por compatibilidad estructural**. No representa un porcentaje terrestre del arrecife. Antes de usar cuotas de superficie marina, se deberá acordar un denominador oceánico o un contrato genérico que no cambie retroactivamente los valores terrestres.

## 5. Gráfica y presentación de la Wiki

La ficha de Arrecife muestra los mismos grupos `required` y `preferred` de los biomas terrestres; los campos adicionales muestran unidades **m** y **‰** con etiquetas bilingües.

La gráfica SVG reutilizable sigue situada debajo del contenido. Para el bioma **Marino**, cambia el eje vertical a **profundidad física en metros**, positiva hacia abajo. El eje horizontal sigue siendo latitud absoluta 0–90°. Arrecife se dibuja entre 0–30° y 0–50 m. Para biomas terrestres, la gráfica conserva la **altura Evolve 0–100**. Estuario o litoral también se dibuja entre 0–90° y 0–50 m. Manglar y Alta mar permanecen sin rectángulos mientras no tengan definiciones.

## 6. Límites de esta fase

- Es una **definición de diseño**, todavía no implementada en Engine.
- No se modifican los subbiomas pendientes (Manglar y Océano abierto) ni otros grupos de biomas.
- La exactitud de profundidad física, salinidad y temperatura dependerá de que el generador calcule esos campos.
- El comportamiento estacional o dinámico del coral queda para etapas futuras.


## Estuario o litoral — `marine_estuary_littoral` (aprobado 2026-11-12)

### 1. Apariencia

**Referencia visual principal: costa rocosa.** Costas con rocas expuestas al oleaje, acantilados, pozas de marea, algas, aguas someras y pequeñas ensenadas. **Costas arenosas, bahías y marismas** son variantes geográficas y visuales del mismo subbioma, no subdivisiones adicionales.

**Referencia estuarina: bahía de Chesapeake (Estados Unidos).** Desembocaduras, canales, marismas y mezcla variable de agua dulce fluvial y agua salada marina. Los ambientes estuarinos y litorales se **combinan deliberadamente en un solo subbioma** por la resolución actual de la cuadrícula de Evolve.

### 2. Condiciones de aparición

| Parámetro | `spawn.required` | `spawn.preferred` |
|---|---|---|
| Terreno (`terrain`) | `water` | — |
| Profundidad (`waterDepthMeters`) | **0–50 m** | **0–20 m** |
| Salinidad (`waterSalinityPpt`) | **0–40 ‰** | — |
| Temperatura media anual del agua (`meanAnnualTemperatureC`) | **−2 a 35 °C** | — |
| Latitud absoluta (`absoluteLatitudeDegrees`) | — | **0–90°** (distribución global) |
| Precipitación atmosférica | Sin límite establecido | — |

Los **únicos parámetros marinos añadidos** a la estructura habitual siguen siendo `waterDepthMeters` y `waterSalinityPpt`, reutilizados desde Arrecife. Terreno, temperatura y latitud usan las claves comunes. Estos rangos son aproximaciones de diseño: estuarios tropicales y costas frías pueden coexistir dentro de la misma categoría. Salinidad 0–40 ‰ evita excluir el agua poco salina de desembocaduras y las costas con salinidad oceánica ordinaria.

**Regla de emplazamiento geográfico, sin campo nuevo:** la celda marina debe encontrarse junto a una costa continental o insular o en una desembocadura reconocible. Esta condición será inferida de la geometría costera, conectividad de hexágonos y red fluvial en el motor futuro; **no se añade** un indicador propio de proximidad costera, estuario, distancia a costa ni sedimentos dentro de `spawn`. El mero cumplimiento de temperatura, profundidad y salinidad sin costa cercana **no convierte automáticamente** un punto del océano abierto en litoral.

### 3. Distribución geográfica y masas

Se prefieren **franjas costeras continuas** que puedan rodear grandes continentes y archipiélagos. No subdividir artificialmente un litoral continuo solo para alcanzar un número de masas.

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 1,
  "maxRegions": 8
}
```

**1–8** es la **propuesta preliminar** de cantidad de regiones conectadas en mundos con zonas costeras adecuadas, no una medida empírica de la Tierra. Si el trazado natural crea más regiones en un mundo de muchas islas, el límite deberá reconsiderarse durante el diseño del generador: está prohibido romper o unir arbitrariamente costas reales para cumplirlo. Un mundo con condiciones inviables tampoco debe generar una franja ficticia para satisfacer el mínimo. La superficie oceánica permanece pendiente y no se inventa un porcentaje.

### 4. Comparación con Arrecife y representación

- **Arrecife:** preferencia tropical 0–30°; corales tropicales y atolones; salinidad 32–42 ‰ y condiciones térmicas cálidas. Puede solaparse espacialmente con zonas costeras apropiadas.
- **Estuario o litoral:** distribución latitudinal mundial 0–90°, mezcla amplia de salinidades, costas rocosas o arenosas y desembocaduras, sin requerir coral.
- **Manglar:** pendiente de definición. La prioridad entre estas categorías se resolverá en el futuro sistema de clasificación, sin imponer ahora una jerarquía no aprobada.

La gráfica existente muestra **dos rectángulos** para Marino: Arrecife y Estuario o litoral. Ambos usan la misma escala física de profundidad en metros y latitud absoluta. No se modifica la gráfica de biomas terrestres ni se añade imagen PNG.

### 5. Estado técnico

Definición **declarativa** del catálogo y documentación de la Wiki. No implica que Engine calcule salinidad, batimetría, conectividad costera o clasificadores de desembocaduras. La adaptación del generador y la posible división posterior de litorales/estuarios quedan fuera de esta aprobación.
