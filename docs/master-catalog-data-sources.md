# Fuentes y conexión del Catálogo Máster de SIFER

## FAPI: búsqueda de artículos y referencias cruzadas

Documentación oficial publicada por el proveedor: https://github.com/fapi-dev/catalog-openapi
Especificación OpenAPI: https://github.com/fapi-dev/catalog-openapi/blob/main/openapi.yml

SIFER incorpora el proxy `GET /api/fapi-catalog`, que solo se conecta al host fijo `https://fapi.iisis.ru/fapi/v2`. La clave nunca se envía al navegador ni se acepta como parámetro.

### Configuración en Vercel (Production)

Añadir la variable de entorno:
- `FAPI_API_KEY`: clave emitida en https://id.iisis.ru/

No colocar claves en GitHub, en el código cliente ni en parámetros de URL. Después de guardar la variable, desplegar de nuevo producción y probar con una referencia conocida.

### Modos admitidos

- `/api/fapi-catalog?mode=product&q=10100`: consulta de artículo/número de pieza.
- `/api/fapi-catalog?mode=analog&q=10100`: equivalencias del artículo.
- `/api/fapi-catalog?mode=manufacturers`: marcas disponibles.
- `/api/fapi-catalog?mode=usage`: plan, créditos y estado de cuenta.

El proveedor cobra/consume créditos según el plan y endpoint; revisar primero `mode=usage`. No usar llamadas masivas sin revisar precio, límites y autorización.

## Fuentes abiertas de vehículos

- VehiclesDB: https://github.com/vehiclesdb/vehiclesdb — dataset de vehículos CC BY 4.0; SIFER debe mostrar atribución visible “Vehicle data by VehiclesDB (vehiclesdb.com)” y guardar la versión del dataset.
- MeterApp vehicle-db: https://github.com/MeterApp/vehicle-db — datos consolidados con procedencia y licencias por fuente; revisar términos upstream y redistribución antes de copiar datos.
- NHTSA vPIC: https://vpic.nhtsa.dot.gov/api/ — API pública para enriquecer marca/modelo/año, principalmente con cobertura estadounidense.
- Auto Care ACES/PIES: https://www.autocare.org/data-standards — estándares para normalizar compatibilidad y atributos; no confundir estándares públicos con bases comerciales licenciadas.

## Restricciones de datos

La muestra pública FAPI no es una base libre para redistribución; su repositorio indica que el uso comercial y la redistribución de la muestra están prohibidos. Usar la API con clave válida o adquirir un conjunto con licencia apropiada. No extraer datos saltándose autenticación, límites, controles anti-bot o condiciones de uso.

La consulta FAPI no crea artículos de inventario. El usuario debe seleccionar e importar expresamente el producto; existencias, SKU y movimientos siguen siendo datos operativos separados.

## Estado de carga

Esta integración no significa que se hayan importado 3.000.000 de artículos. Es un proxy de consulta remota. Para un catálogo local masivo se necesita un archivo autorizado o contrato de datos, un proceso de importación por lotes y verificación de duplicados, cobertura y licencia.
