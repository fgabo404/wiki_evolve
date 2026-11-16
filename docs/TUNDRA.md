# T01 — Tundra de Evolve

**Aprobación final:** 2026-11-16  
**Repositorio:** `fgabo404/wiki_evolve`  
**Rama:** `develop`  
**Catálogo canónico:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Estado: aprobado

**Tundra** sigue siendo un **único bioma y un único subbioma** (`tundra_tundra`), con **dos variantes ecológicas y dos rutas alternativas de emplazamiento**: **tundra ártica** y **tundra alpina**. No se duplican IDs ni se transfiere la tundra alpina a Montaña.

La referencia principal de la **tundra ártica** son **Alaska, Canadá y Siberia**: grandes tierras frías con musgos, líquenes, gramíneas, arbustos enanos, vegetación dispersa y lagunas de deshielo. La **tundra alpina** representa paisajes semejantes por encima del límite local de los árboles en cualquier latitud: praderas rastreras, rocas, nieve estacional y vegetación sin bosques extensos. El **permafrost** puede darse en la tundra ártica, pero no es un requisito universal para la alpina.

## 1. Condiciones comunes aprobadas

| Condición | `spawn.required` |
|---|---|
| Terreno (`terrain`) | `land` |
| Altura Evolve (`elevationLevel`) | **1–94**, escala normalizada de **0 a 100** |
| Temperatura media anual (`meanAnnualTemperatureC`) | **−25 a 5 °C** |
| Precipitación anual (`annualPrecipitationMm`) | **100–1.200 mm** |
| Cobertura de copa (`treeCanopyCoverPercent`) | **máximo 10 %** |

Se amplía el extremo superior de precipitación inicialmente propuesto (800 mm) a **1.200 mm** para no excluir automáticamente tundras alpinas húmedas. Son intervalos de diseño aprobados, no límites universales de la ecología terrestre.

La condición `spawn.preferred.absoluteLatitudeDegrees` se fija en **0–90°**, sin imponer una preferencia global falsa: las **preferencias reales de latitud y altura pertenecen a cada ruta alternativa** de `regionPlacement`.

**No se ha creado un parámetro nuevo de clima, permafrost ni altura en metros.** La altura sigue siendo el nivel de Evolve, no una conversión desde kilómetros.

## 2. Dos rutas de emplazamiento alternativas

La definición declarativa `regionPlacement.mode = "anyOf"` contiene dos alternativas con sus propias preferencias geográficas, **no dos requisitos acumulativos**.

### A. Tundra ártica

| Campo | Regla |
|---|---|
| `id` | `arctic` |
| `mode` | `highLatitude` |
| `hemisphere` | `north` |
| Latitud absoluta preferida | **60–80° N** |
| Altura Evolve preferida | **1–55** |

La geografía del mapa debe identificar el **hemisferio norte** mediante latitud firmada y orientación, mientras que `absoluteLatitudeDegrees` se utiliza para rangos de preferencia. Se favorecen tierras frías del límite septentrional de la taiga, sin exigir montañas altas.

### B. Tundra alpina

| Campo | Regla |
|---|---|
| `id` | `alpine` |
| `mode` | `mountainDependent` |
| `belt` | `aboveLocalTreeline` |
| Latitud absoluta orientativa | **0–90°** |
| Altura Evolve orientativa | **60–94** |

La condición decisiva es estar **por encima del límite local de árboles**, no un nivel fijo de altura. El valor 60–94 sirve para visualizar el patrón preferido, sin declarar que no pueda haber tundra alpina fuera de él si la geografía y el clima son apropiados. El límite arbóreo puede variar con latitud y topografía.

Al compartir un único subbioma, **no se requieren 2–4 masas por variante** ni se necesitan dos tipos diferentes de celda de tundra.

## 3. Distribución (aprobada previamente)

```json
"distribution": {
  "targetLandPercent": null,
  "percentBasis": "unavailable",
  "minRegions": 2,
  "maxRegions": 4
}
```

**Mínimo 2 y máximo 4 masas regionales conectadas** de tundra, **sumando ambas variantes**. Se respetará la conectividad real de los hexágonos y el clima; no se fragmentará una llanura continua ni se inventará tundra en un lugar ecológicamente inviable para cumplir el conteo.

El porcentaje de superficie terrestre sigue pendiente (`targetLandPercent:null`).

## 4. Representación en la Wiki

La gráfica interactiva aparece **debajo de las fichas** y conserva la escala de altura **Evolve 0–100**. Muestra **dos áreas de preferencia diferenciadas** para un mismo subbioma: 
- **Ártica:** 60–80° de latitud absoluta, altura 1–55.
- **Alpina:** 0–90° de latitud absoluta, altura 60–94.

Las áreas son **orientativas**, no requisitos simultáneos ni pruebas directas de que exista tundra a esa altura. Al seleccionar **Tundra**, se destacan **ambas áreas juntas**.

## 5. Relación con los otros biomas

- **Bosque boreal:** tundra ártica aparece en tierras frías más allá del límite arbóreo septentrional.
- **Bosque subalpino:** tundra alpina aparece por encima del límite local de los árboles; no se reutiliza la regla `belowLocalTreeline` del bosque.
- **Montaña:** aporta la geografía elevada para tundra alpina, pero no reemplaza el subbioma Tundra.
- **Polo:** representa hielo marino polar o continente antártico glaciado; Tundra exige vegetación terrestre compatible con el clima.

## 6. Alcance técnico

La definición se guarda en el **catálogo de la Wiki**, no implementa clasificación de hexágonos ni el generador de `fgabo404/Evolve`. `regionPlacement.anyOf` es un **contrato declarativo nuevo de la Wiki** que el futuro Engine deberá interpretar explícitamente; no se presupone soporte automático ni se modifica la lógica existente del generador.

**Estado del catálogo:** **7 biomas**, **23 subbiomas**, **21 completos** y **2 pendientes** (**Montaña rocosa** y **Cumbres**). Tundra queda completamente aprobada y documentada.
