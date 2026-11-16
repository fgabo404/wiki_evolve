# M02 — Montaña de Evolve: referencia visual de Montaña rocosa y Cumbres

**Fecha:** 2026-11-16  
**Rama:** `develop`  
**Catálogo:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Decisión visual aprobada

El bioma principal **Montaña** (`mountain`) tiene **exactamente dos subbiomas** ya existentes: **Montaña rocosa** (`mountain_rocky`) y **Cumbres** (`mountain_summits`). El usuario proporcionó una fotografía anotada de una cordillera con dos círculos. Esta decisión establece cómo diferenciarlos visual y geomorfológicamente; **no aprueba aún rangos numéricos de aparición ni cantidades de masas**.

| Marca en la imagen de referencia | Subbioma | Significado |
|---|---|---|
| **Círculo amarillo «ROCOSO»** | **Montaña rocosa** | **Laderas, paredes y flancos de roca expuesta** situados bajo las crestas, con escarpes, estratos, barrancos y pedreras |
| **Círculo rojo «CUMBRE»** | **Cumbres** | **Parte culminante y más elevada localmente** de una montaña: pico, ápice y zona inmediata de la cresta superior |

La fotografía también incluye glaciares, nieve y vegetación arbórea en primer plano. **Ni la nieve ni la presencia/ausencia de árboles son por sí solas la distinción entre «Montaña rocosa» y «Cumbres».** Una cumbre puede ser rocosa o nevada; una ladera rocosa puede coexistir con nieves, glaciares, bosque subalpino o tundra alpina en la misma cordillera.

### Regla de clasificación propuesta para el futuro generador

- **Montaña rocosa:** importa el **relieve montañoso en pendiente** y el predominio local de roca expuesta, no exclusivamente un umbral fijo de altura.
- **Cumbres:** importa estar en la **posición culminante de una elevación**, de acuerdo con la forma de la montaña y la comparación con sus alrededores. No se debe etiquetar toda la franja de altitud alta como Cumbres, ni confundir una meseta elevada con una sucesión de picos.
- Un sistema montañoso puede contener **ambos subbiomas adyacentes y conectados**, pasando de ladera rocosa a cumbre cerca del punto más alto. No hay que generar una cordillera distinta para cada uno.
- La altura del mundo sigue siendo **la escala normalizada de Evolve 0–100**; la elevación real expresada en metros no cambia esa escala.
- Los biomas vegetales, como Bosque subalpino y Tundra alpina, requieren reglas de transición y clasificación pendientes; la referencia visual no resuelve aún su precedencia a nivel de hexágono.

## Decisiones pendientes para aprobar una por una

1. Rangos de altura normalizada `elevationLevel` para Montaña rocosa y Cumbres, sin perder la condición **relativa** de cumbre.
2. Pendientes, relieve local y material superficial que permitirán clasificar laderas rocosas y máximos locales de cordillera.
3. Distribución: mínimo/máximo de masas y porcentaje terrestre para cada subbioma, sin fragmentaciones artificiales.
4. Condiciones complementarias si se consideran necesarias, procurando reutilizar campos existentes del catálogo.

**No registrar aún `spawn`, `description` ni `distribution` numéricos en las fichas de los dos subbiomas hasta aprobarlos.** El ejemplo anterior de Montaña rocosa (altura 25–89 y 3–6 masas) se mantiene como propuesta pendiente, no como decisión confirmada por esta fotografía.

## Estado

Permanecen **7 biomas**, **23 subbiomas**, **21 completamente definidos** y **2 pendientes**: Montaña rocosa y Cumbres. Esta actualización solo documenta la referencia visual acordada en la Wiki; **no modifica Engine** y no altera las reglas ya aprobadas de Tundra.
