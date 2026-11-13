# M01 — Marino de Evolve

**Fecha:** 2026-11-10  
**Rama:** `develop`  
**Catálogo canónico:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Estado de revisión

| ID | Subbioma | Estado |
|---|---|---|
| `marine_reef` | Arrecife | **Aprobado** |
| `marine_estuary_littoral` | Estuario o litoral | **Aprobado** |
| `marine_mangrove` | Manglar | **Aprobado** |
| `marine_open_ocean` | Océano abierto (alta mar) | Pendiente |

**Alcance:** se han definido Arrecife, Estuario o litoral y Manglar sin subdividir el catálogo ni modificar el generador de `fgabo404/Evolve`. Océano abierto permanece pendiente.

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

La gráfica SVG reutilizable sigue situada debajo del contenido. Para el bioma **Marino**, cambia el eje vertical a **profundidad física en metros**, positiva hacia abajo. El eje horizontal sigue siendo latitud absoluta 0–90°. Arrecife se dibuja entre 0–30° y 0–50 m. Para biomas terrestres, la gráfica conserva la **altura Evolve 0–100**. Estuario o litoral se dibuja entre 0–90° y 0–50 m; Manglar se dibuja entre 0–30° y 0–5 m. Alta mar permanece sin rectángulo hasta que se defina.

## 6. Límites de esta fase

- Es una **definición de diseño**, todavía no implementada en Engine.
- No se modifica el subbioma pendiente (Océano abierto) ni otros grupos de biomas.
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
- **Manglar:** definido como bosque intermareal tropical y subtropical; prevalece su identidad forestal y de mareas sobre la apariencia de costa rocosa de Estuario. La prioridad entre estas categorías se resolverá en el futuro sistema de clasificación, sin imponer ahora una jerarquía no aprobada.

La gráfica existente muestra **tres rectángulos** para Marino: Arrecife, Estuario o litoral y Manglar. Ambos usan la misma escala física de profundidad en metros y latitud absoluta. No se modifica la gráfica de biomas terrestres ni se añade imagen PNG.

### 5. Estado técnico

Definición **declarativa** del catálogo y documentación de la Wiki. No implica que Engine calcule salinidad, batimetría, conectividad costera o clasificadores de desembocaduras. La adaptación del generador y la posible división posterior de litorales/estuarios quedan fuera de esta aprobación.


## Manglar — `marine_mangrove` (aprobado 2026-11-13)

### 1. Apariencia y referencias

**Referencia principal: Sundarbans, Bangladesh e India.** Se busca un gran bosque verde intermareal surcado por canales sinuosos, ríos de marea, bancos de lodo e islas con vegetación arbórea densa. Como variante visual se admiten **raíces aéreas prominentes** similares a las de manglares tropicales de Florida, aguas someras y franjas forestales alrededor de bahías protegidas e islas.

El color del agua puede variar entre pardo y turquesa por condiciones locales; no se crean subbiomas nuevos. Manglar sigue dentro de **Marino** y no debe duplicarse bajo Bosque.

### 2. Condiciones de aparición

| Parámetro | `spawn.required` | `spawn.preferred` |
|---|---|---|
| Terreno (`terrain`) | `water` | — |
| Profundidad costera (`waterDepthMeters`) | **0–5 m** | **0–2 m** |
| Salinidad del agua (`waterSalinityPpt`) | **0–40 ‰** | **5–30 ‰** |
| Temperatura media anual (`meanAnnualTemperatureC`) | **20–30 °C** | **24–28 °C** |
| Latitud absoluta (`absoluteLatitudeDegrees`) | — | **0–30°** |
| Precipitación atmosférica | Sin requisito universal | — |

Se reutiliza el contrato ya introducido para Arrecife y Estuario. **Los únicos parámetros marinos nuevos en el catálogo siguen siendo profundidad y salinidad**; el resto usa nombres compartidos con los biomas anteriores. Estos valores son rangos de diseño, no límites ecológicos universales.

**Interpretación crítica de profundidad:** el manglar crece sobre **sustrato intermareal**, expuesto o inundado según las mareas. El rango físico 0–5 m representa un entorno costero somero en el hexágono y **no significa árboles sumergidos permanentemente bajo cinco metros de agua**. Cuando Engine disponga de nivel de marea y topografía litoral deberán refinarse los criterios, sin reescribir por ahora las reglas aprobadas.

### 3. Distribución geográfica

Favorecer grandes deltas, estuarios, costas protegidas, bahías someras y franjas de islas tropicales. Esos emplazamientos se reconocerán a partir de la forma del litoral, los ríos y la conectividad del mundo, **sin añadir campos nuevos en `spawn`**. La latitud 0–30° es **preferida**, no un límite global rígido: pueden existir manglares subtropicales fuera de ella cuando el clima lo permite.

### 4. Masas conectadas y porcentaje

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 2,
  "maxRegions": 6
}
```

Se aprueban **2–6 sistemas regionales** conectados en mundos con condiciones adecuadas. Una gran masa puede representar un sistema deltaico como Sundarbans y otra una franja costera o insular. No se inventan masas en regiones inviables ni se fija un tamaño artificial de cada bosque. El porcentaje oceánico permanece sin definir; `targetLandPercent:null` es el campo común heredado por compatibilidad y **no debe interpretarse como porcentaje terrestre de Manglar**.

### 5. Comparación

| Característica | Manglar | Estuario o litoral | Pantano arbolado |
|---|---|---|---|
| Apariencia | Bosque costero con raíces adaptadas | Costas rocosas/arenosas, bahías, desembocaduras | Bosques de humedal |
| Régimen del agua | Mareas e inundación intermareal | Oleaje, mareas, mezcla fluvial | Saturación o inundación de agua dulce |
| Entorno preferido | Costas y deltas tropicales | Costas de todo el mundo | Depresiones y humedales terrestres |
| Clasificación | Marino | Marino | Bosque |
| Masas | **2–6** | 1–8, provisional | 1–2 |

### 6. Visualización y estado técnico

La gráfica SVG reutilizable de Marino muestra ahora Arrecife, Estuario o litoral y Manglar. Manglar aparece en latitudes preferidas **0–30°** y profundidad requerida **0–5 m**, con profundidad positiva hacia abajo. No requiere cambios en la gráfica ni en los campos de la ficha bilingüe: `waterDepthMeters` y `waterSalinityPpt` ya tienen etiquetas/unidades.

**Solo definición teórica:** el nuevo Engine aún no calcula la hidrología intermareal ni genera este bosque. No se introducen tipos, parámetros ni subbiomas extra.
