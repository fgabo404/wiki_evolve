# Montaña — definición de Montaña rocosa y Cumbres

**Fecha de aprobación:** 2026-11-16  
**Repositorio:** `fgabo404/wiki_evolve`, rama `develop`  
**Catálogo:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Estado: dos subbiomas aprobados

El bioma **Montaña** (`mountain`) contiene **exactamente dos subbiomas**:

| Subbioma | ID | Referencia de la fotografía del usuario |
|---|---|---|
| **Montaña rocosa** | `mountain_rocky` | **Círculo amarillo «ROCOSO»**: flancos, paredes y laderas rocosas |
| **Cumbres** | `mountain_summits` | **Círculo rojo «CUMBRE»**: ápices, picos y partes culminantes de las crestas |

Se distinguen por la **posición geomorfológica relativa**, no por nieve, vegetación ni una altitud global que por sí sola determine las cumbres. Una cumbre puede ser rocosa o estar nevada; una ladera rocosa puede tener hielo y plantas dispersas, y ambas pueden formar parte de **una misma cordillera**.

La **altura Evolve** es siempre relativa y normalizada en la escala **0–100**. No convertir estas alturas a metros.

## 1. Montaña rocosa — `mountain_rocky`

**Descripción:** laderas, paredes, flancos y escarpes de roca expuesta; incluye barrancos, estratos, grava y pedreras. Inspiración visual: cordilleras abruptas de las Montañas Rocosas y los Andes. No exige temperaturas frías, nieve ni precipitaciones predeterminadas: son rasgos de otras capas ambientales.

| Condición | `spawn.required` | `spawn.preferred` |
|---|---|---|
| Terreno (`terrain`) | `land` | — |
| Altura Evolve (`elevationLevel`) | **25–89** | **45–80** |
| Pendiente (`slopeDegrees`) | **15°–90°** | **20°–55°** |
| Material dominante (`dominantSurfaceMaterial`) | `rock_gravel` | — |
| Latitud absoluta (`absoluteLatitudeDegrees`) | Sin restricción | **0°–90°** |
| Temperatura, precipitación | Sin límite específico | Según clima local |

**Emplazamiento:** `regionPlacement: {mode:"mountainDependent",belt:"exposedRockySlope"}`.

La pendiente y el material rocoso deben coincidir con un **relieve montañoso real**, no con cualquier desierto rocoso o una meseta sin relieve local significativo. Este campo es una política declarativa pendiente de implementación en Engine, no un requisito ejecutado por la Wiki.

## 2. Cumbres — `mountain_summits`

**Descripción:** picos, cimas y crestas altas que culminan una montaña. Se reconocen como **máximos locales del relieve** dentro de cada cordillera. La posición culminante es más importante que un valor absoluto de altura.

| Condición | `spawn.required` | `spawn.preferred` |
|---|---|---|
| Terreno (`terrain`) | `land` | — |
| Altura Evolve (`elevationLevel`) | **1–100** (intervalo de validez global) | **Sin umbral fijo** |
| Latitud absoluta (`absoluteLatitudeDegrees`) | Sin restricción | **0°–90°** |
| Pendiente, temperatura, nieve | Dependientes de la montaña | Sin valor arbitrario |

**Emplazamiento:** `regionPlacement: {mode:"mountainDependent",belt:"localSummit"}`.

La banda 1–100 no significa que cualquier hexágono entre esos niveles sea Cumbres: solo evita inventar un umbral que excluya picos locales de cordilleras bajas. Un hexágono se clasificaría como cumbre únicamente si es un **pico o cresta culminante en comparación con sus vecinos y su unidad montañosa**. Las mesetas altas, por sí solas, no crean automáticamente cumbres; tampoco la nieve las define.

## 3. Regla aprobada: sin masas mínimas ni máximas

**Aprobación explícita:** a diferencia de Bosque, Llanuras y otros biomas, **Montaña rocosa y Cumbres no llevan número mínimo ni número máximo de masas**.

El campo `distribution` se **omite por completo en ambos subbiomas**. No se guardan `minRegions`, `maxRegions`, ni porcentajes de cobertura artificiales. Las masas y la extensión dependen del **sistema de cordilleras, placas, erosión, estructura de elevaciones y máximos topográficos** del mundo que se genere. La cantidad de cumbres depende de cuántas montañas y picos reales produzca ese relieve, no de una cuota de apariciones.

Esto significa **conteo derivado de geografía**, no masas ilimitadas creadas al azar. Si el generador modifica la cantidad de cordilleras o sus formas, cambiará naturalmente el número de laderas rocosas y cumbres.

## 4. Interacción con otros biomas

- **Bosque subalpino** puede ocupar algunas laderas frías por debajo del límite local de árboles; no todas las laderas de una cordillera se clasifican automáticamente como Montaña rocosa.
- **Tundra alpina** puede aparecer por encima del límite local de árboles, si corresponde climáticamente, entre afloramientos y laderas rocosas.
- **Cumbres** y **Montaña rocosa** pueden coexistir en una misma cadena montañosa y encontrarse en hexágonos vecinos.
- **Roca expuesta, pendiente, clima y vegetación** determinan transiciones. La prioridad definitiva de clasificación por hexágono se establecerá cuando se diseñe Engine.

## 5. Representación en la Wiki

La gráfica de latitud y altura continúa **visible abajo**. **Montaña rocosa** muestra su rango de altura Evolve **25–89** y latitud posible **0–90°**; la pendiente, roca y posición en ladera continúan siendo condiciones necesarias y no caben en el gráfico 2D.

**Cumbres no se dibuja como un falso rectángulo de altura 1–100**: se muestra por separado como **categoría derivada de los máximos locales** de las montañas. Así ambos subbiomas se consideran definidos sin dar a entender que todas las alturas son cumbres.

## 6. Alcance

Esta es una definición **declarativa de la Wiki**. `regionPlacement` expresa la relación con el relieve, pero **no implementa aún la geología, la clasificación local de picos ni el generador** de `fgabo404/Evolve`.

**Catálogo resultante:** **7 biomas principales**, **23 subbiomas**, **23 definidos y 0 pendientes**. Se conserva la referencia fotográfica conceptual acordada por el usuario sin introducir cuotas de masas para Montaña.
