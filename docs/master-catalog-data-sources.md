# Fuentes gratuitas y abiertas del Catálogo Máster de SIFER

## Política obligatoria: sin servicios de pago

SIFER no debe llamar, integrar ni depender de APIs que cobren, consuman créditos de prueba que luego requieran pago, exijan suscripción o condicionen el funcionamiento a un plan comercial. No configurar claves de proveedores comerciales ni hacer llamadas masivas a endpoints de pago.

## Datos abiertos de vehículos

- **VehiclesDB:** https://github.com/vehiclesdb/vehiclesdb — datos abiertos de marcas, modelos y tipos de vehículos con licencia CC BY 4.0. La integración debe conservar la versión usada y mostrar la atribución visible «Vehicle data by VehiclesDB (vehiclesdb.com)». Revisar también el archivo de atribución del release porque pueden aplicar avisos de fuentes upstream.
- **NHTSA vPIC:** https://vpic.nhtsa.dot.gov/api/ — API pública gratuita útil para identificar marcas, modelos y años; su cobertura es principalmente de vehículos asociados al mercado estadounidense, por lo que no cubre por sí sola todo el parque automotor venezolano.
- **MeterApp vehicle-db:** https://github.com/MeterApp/vehicle-db — evaluar por fuente las licencias y condiciones antes de importar o redistribuir cualquier subconjunto.
- **Auto Care ACES/PIES:** https://www.autocare.org/data-standards — estándares de normalización; la publicación de un estándar no implica que las bases de datos comerciales compatibles con él sean gratuitas.

## Datos de repuestos y referencias cruzadas

No se ha identificado una base abierta que permita afirmar que existen tres millones de referencias reales de repuestos, con compatibilidad completa, licencia comercial clara y cobertura mundial, disponible gratuitamente para integrar y redistribuir. Por tanto:

- No usar la muestra de fapi-dev/auto-parts-cross-reference: su propio archivo de licencia restringe el uso comercial y la redistribución de esos datos.
- No llamar al API de FAPI ni integrar su clave: puede consumir créditos y no satisface la política de coste cero.
- Priorizar catálogos oficiales de fabricantes publicados sin restricciones incompatibles, documentación técnica con términos claros y bases de datos con licencias verificadas.
- Guardar fuente, licencia, versión, fecha de consulta y nivel de verificación por registro.
- No inventar referencias, precios, stock ni compatibilidades para completar cifras.

## Separación del inventario

El Catálogo Máster sirve para buscar, revisar referencias y seleccionar/importar productos. La consulta nunca debe crear automáticamente productos ni cantidades en inventario. El inventario operativo, los SKU, los costes, las existencias y los movimientos deben seguir persistiendo en Turso.

## Estado de cobertura

El código de búsqueda remota no significa que se haya importado un catálogo masivo. No declarar tres millones de referencias cargadas hasta que una importación autorizada haya finalizado y se hayan comprobado los recuentos, duplicados, licencias y cobertura por categoría, marca, modelo y año.

## Plan de implementación sin coste

1. Importar por lotes una versión fijada del dataset abierto de vehículos y conservar su atribución.
2. Mantener los datos de vehículos en tablas/archivos separados de los artículos de repuesto.
3. Añadir importadores sólo para conjuntos de repuestos con licencia compatible con uso comercial y redistribución.
4. Validar registros, deduplicar por referencias y fabricante, y hacer pruebas de rendimiento antes de aumentar el volumen.
5. Si una fuente gratuita no aporta una pieza o compatibilidad, mostrar «sin referencia verificada» en lugar de fabricar un resultado.