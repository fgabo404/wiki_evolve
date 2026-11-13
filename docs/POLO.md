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
| Subbioma | `polar_north_ice` | **Polo Norte** | **North Pole** | Condiciones pendientes |
| Subbioma | `polar_south_ice` | **Polo Sur** | **South Pole** | Condiciones pendientes |

Se conservan los IDs de subbioma `polar_north_ice` y `polar_south_ice` para no perder referencias previas. Desaparecen como **categorías principales** los IDs `polar_north` y `polar_south`. Los enlaces antiguos de la Wiki que usan `#biome=polar_north` y `#biome=polar_south` conducen a la ficha correspondiente bajo el nuevo bioma Polo.

**No se ha definido `spawn`, descripción ecológica ni `distribution` para los dos subbiomas:** solo la agrupación, sus nombres y la compatibilidad. Nada de esto modifica el generador de `fgabo404/Evolve`.

## Fundamento geográfico que debemos respetar al definirlos

### Polo Norte

El polo geográfico Norte se sitúa **sobre el océano Ártico**, habitualmente cubierto por hielo marino **flotante**. El hielo varía estacionalmente; puede contener placas, grietas y sectores de agua libre. Las grandes masas terrestres de Groenlandia, Canadá o Eurasia pertenecen a la geografía circundante, **no forman una plataforma continental bajo el Polo Norte**.

### Polo Sur

El polo geográfico Sur se sitúa **sobre la Antártida**, un continente cubierto por un gran manto de hielo **sobre tierra firme**. Se caracteriza por el casquete continental, grandes altiplanos glaciales y relieve bajo hielo; el hielo marino que rodea la Antártida es una condición distinta del propio polo continental.

Esta diferencia debe conservarse **aunque ambos subbiomas compartan el bioma Polo**. Referencias: [NASA — Arctic and Antarctic Sea Ice: How Are They Different?](https://science.nasa.gov/earth/climate-change/arctic-and-antarctic-sea-ice-how-are-they-different/); [National Snow and Ice Data Center — Sea Ice](https://nsidc.org/learn/parts-cryosphere/sea-ice).

## Escala de elevación y condiciones pendientes

**La altura de Evolve es siempre 0–100**: el valor 0 referencia el nivel del mar; las elevaciones terrestres ocupan niveles relativos hasta 100. **No equivale a metros**. La profundidad oceánica, cuando sea relevante, se expresará por separado en metros y no cambiará la escala de altura.

En el siguiente diseño se definirán **uno por uno**, con aprobación explícita:

- Apariencia y referencia geográfica de cada polo.
- Terreno (océano cubierto por hielo marino frente a continente glaciado), latitud absoluta, temperatura y las variables existentes que correspondan.
- Requisitos de altura 0–100 cuando aplique, y posibles reglas de emplazamiento polar; sin inventar valores por el simple hecho de agruparlos.
- Mínimo y máximo de masas conectadas y porcentaje de superficie, si hay referencia comparable.
- Interacción futura con Marino, Tundra y Montaña, sin implementar Engine.

La gráfica reutilizable de cada bioma permanece visible debajo de las fichas; los subbiomas polares **aparecerán como pendientes** hasta aprobar rangos reales. No dibujar rectángulos arbitrarios de latitud/altura.

## Invariantes del catálogo

El catálogo contiene **7 biomas principales**, **23 subbiomas** en total, **18** con reglas declarativas y **5** pendientes: Polo Norte, Polo Sur, Tundra, Montaña rocosa y Cumbres. Bosque, Desierto, Llanuras y Marino quedan intactos.
