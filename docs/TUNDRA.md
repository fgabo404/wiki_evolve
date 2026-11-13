# T01 — Tundra de Evolve

**Fecha:** 2026-11-13  
**Rama:** `develop`  
**Catálogo canónico:** [`data/biomes/biomes.json`](../data/biomes/biomes.json)

## Decisión de alcance aprobada

**Tundra es un único bioma con un único subbioma**, `tundra_tundra` (`Tundra` en español e inglés), que **incluye dos variantes ecológicas de aparición, tundra ártica y tundra alpina**. Se ha aprobado agrupar ambas; **no** se crean nuevos IDs ni se reasigna la tundra alpina exclusivamente a Montaña.

La tundra ártica se inspira principalmente en las regiones frías de **Alaska, Canadá y Siberia**, donde domina la vegetación baja, los musgos, líquenes, hierbas y arbustos pequeños. La tundra alpina representa ambientes similares **por encima del límite local de los árboles** en montañas, incluso a latitudes menores.

### Dos vías para un mismo subbioma

1. **Tundra ártica:** emplazamiento en tierras frías de latitudes altas, cerca de la transición con el dominio polar y al norte de muchos bosques boreales.
2. **Tundra alpina:** emplazamiento montañoso de altura suficiente para situarse por encima del límite local de árboles, determinado por clima, elevación y latitud del propio sistema montañoso.

Las vías son **alternativas**, no condiciones que deban cumplirse simultáneamente. Por tanto, **no establecer un rango de latitud ártico como requisito obligatorio para toda la tundra** ni exigir altitudes de alta montaña a las tundras árticas de tierras bajas.

Se conserva la escala oficial de **altura Evolve 0–100**. Ninguna equivalencia de altura en metros reales queda aprobada.

### Interacción con otros biomas

- **Polo:** representa hielo polar marino o continental; tundra mantiene vegetación y se encuentra en tierra apropiada.
- **Bosque boreal/subalpino:** la tundra ártica puede aparecer más allá del bosque boreal; la alpina, por encima del límite local de árboles.
- **Montaña:** proporciona el relieve que hace posible la variante alpina, pero no se sustituye el subbioma Tundra por un nuevo subbioma de Montaña. El orden de clasificación de hexágonos se decidirá al implementar el generador.

### Rangos de diseño aún no aprobados

En la exploración anterior se propusieron, **a título preliminar**:

| Parámetro | Propuesta pendiente de aprobación |
|---|---|
| Terreno | Tierra |
| Altura normalizada Evolve | 1–94 |
| Altura preferida | 1–55 (para zonas árticas, no debe excluir la alpina) |
| Latitud preferida | 60°–80° (para tundra ártica, no obligatoria para la alpina) |
| Temperatura media anual | −25 a 5 °C |
| Precipitación anual | 100–800 mm |
| Cobertura de árboles | Máximo 10 % |
| Número de masas | 2–6, **por revisar** |
| Porcentaje terrestre | Pendiente, sin inventar cifra |

Estos valores **todavía no se deben considerar definitivos**, porque las dos vías requieren una lógica de emplazamiento mutuamente alternativa. En particular, una única preferencia de altura 1–55 puede entrar en conflicto con la variante alpina. Es necesario acordar cómo aplicar condiciones comunes y condiciones específicas de variante antes de registrar un `spawn` definitivo.

### Estado del repositorio

La aprobación de este turno afecta **solo al alcance del subbioma y a sus dos variantes**. `tundra_tundra` permanece sin `spawn` ni `distribution` aprobados en el catálogo hasta revisar los rangos y masas. Por ello el contador se mantiene en **7 biomas, 23 subbiomas, 20 definidos y 3 pendientes**. No se modifica `fgabo404/Evolve` ni se generan nuevos subbiomas.
