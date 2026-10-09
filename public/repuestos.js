// SIFER360 - Módulo Especializado de Repuestos Automotrices
// Catálogo técnico, referencias cruzadas, compatibilidad vehicular, búsqueda inteligente y SKUs únicos

const REPUESTOS_SEED = [
  // 1. Bujes y Gomas
  {
    id: 'AUT-00001',
    sku: 'SKU-BUJ-555-48655',
    nombre: 'Buje de Meseta Delantera Inferior Grande (Tijera)',
    categoria: 'Bujes y Gomas',
    marca: '555 (Three Five)',
    codigoOEM: '48655-12170 / 48655-02050',
    referenciasCruzadas: [
      { marca: 'CTR', codigo: 'CVT-44' },
      { marca: 'Moog', codigo: 'K200780' },
      { marca: 'Febest', codigo: 'TAB-003' },
      { marca: 'Takama', codigo: 'TK-48655' }
    ],
    compatibilidad: [
      { marca: 'Toyota', modelo: 'Corolla (Baby Camry / Pantallita / New Sensación)', anios: '1998-2014', motor: '1.6L 4AFE / 1.8L 1ZZ-FE', posicion: 'Meseta Delantera Inferior' },
      { marca: 'Toyota', modelo: 'Yaris (Belta / Sol)', anios: '2000-2018', motor: '1.3L 2NZ / 1.5L 1NZ-FE', posicion: 'Meseta Delantera' },
      { marca: 'Toyota', modelo: 'Matrix', anios: '2003-2013', motor: '1.8L 1ZZ', posicion: 'Meseta Delantera' }
    ],
    costo: 5.20,
    precio: 9.50,
    stock: 24,
    min: 6,
    ubicacion: 'Pasillo B1 - Estante 2',
    garantia: '12 meses / 20.000 km',
    especificaciones: 'Caucho natural vulcanizado de alta resiliencia. Casquillo de acero zincado antioxidante.',
    imagen: '/images/rep_amortiguador_1791152649395.jpg'
  },
  {
    id: 'AUT-00002',
    sku: 'SKU-GOM-CTR-54813',
    nombre: 'Goma / Buje de Barra Estabilizadora Delantera',
    categoria: 'Bujes y Gomas',
    marca: 'CTR',
    codigoOEM: '96535154 / 54813-25000',
    referenciasCruzadas: [
      { marca: 'ACDelco', codigo: '93740710' },
      { marca: 'Takama', codigo: 'TK-GM965' },
      { marca: 'Moog', codigo: 'K200812' }
    ],
    compatibilidad: [
      { marca: 'Chevrolet', modelo: 'Aveo (3P / 4P / 5P / Speed)', anios: '2005-2018', motor: '1.6L F16D3', posicion: 'Barra Estabilizadora Delantera' },
      { marca: 'Chevrolet', modelo: 'Optra (Design / Advance / Limited)', anios: '2004-2014', motor: '1.8L T18SED', posicion: 'Barra Estabilizadora' },
      { marca: 'Daewoo', modelo: 'Kalos / Lanos', anios: '2000-2008', motor: '1.5L / 1.6L', posicion: 'Barra Estabilizadora' }
    ],
    costo: 2.80,
    precio: 5.50,
    stock: 36,
    min: 8,
    ubicacion: 'Pasillo B1 - Estante 3',
    garantia: '6 meses',
    especificaciones: 'Par de gomas abrazadera de 19mm en elastómero de alta fricción antiruido.',
    imagen: '/images/rep_amortiguador_1791152649395.jpg'
  },

  // 2. Lápiz y Bieletas
  {
    id: 'AUT-00003',
    sku: 'SKU-LAP-555-48820',
    nombre: 'Lápiz Estabilizador Delantero / Bieleta de Suspensión',
    categoria: 'Lápiz y Bieletas',
    marca: '555 (Three Five)',
    codigoOEM: '48820-47010 / 48820-02030',
    referenciasCruzadas: [
      { marca: 'CTR', codigo: 'CLT-29' },
      { marca: 'Moog', codigo: 'K80230' },
      { marca: 'Sankei', codigo: 'SL-3640' },
      { marca: 'Febest', codigo: '0123-001' }
    ],
    compatibilidad: [
      { marca: 'Toyota', modelo: 'Corolla', anios: '2003-2022', motor: '1.8L 1ZZ-FE / 2ZR-FE', posicion: 'Delantero Derecho e Izquierdo' },
      { marca: 'Toyota', modelo: 'Prius', anios: '2004-2018', motor: '1.5L / 1.8L Hybrid', posicion: 'Delantero' },
      { marca: 'Toyota', modelo: 'Yaris', anios: '2006-2020', motor: '1.5L 1NZ-FE', posicion: 'Delantero' }
    ],
    costo: 8.50,
    precio: 15.00,
    stock: 18,
    min: 4,
    ubicacion: 'Pasillo S2 - Estante 1',
    garantia: '12 meses / 30.000 km',
    especificaciones: 'Rótula sellada con grasa sintética de larga duración y tuercas de seguridad autofrenantes.',
    imagen: '/images/rep_amortiguador_1791152649395.jpg'
  },
  {
    id: 'AUT-00004',
    sku: 'SKU-LAP-MOO-2S61',
    nombre: 'Lápiz Estabilizador Delantero Reforzado (Par)',
    categoria: 'Lápiz y Bieletas',
    marca: 'Moog',
    codigoOEM: '2S61-3B438-AD / 1146150',
    referenciasCruzadas: [
      { marca: 'CTR', codigo: 'CLF-10' },
      { marca: 'Motorcraft', codigo: 'MEF-11' },
      { marca: 'Takama', codigo: 'TK-FIE02' }
    ],
    compatibilidad: [
      { marca: 'Ford', modelo: 'Fiesta (Power / Max / Move / Titanium)', anios: '2002-2018', motor: '1.6L Zetec Rocam', posicion: 'Barra Delantera' },
      { marca: 'Ford', modelo: 'EcoSport', anios: '2004-2017', motor: '1.6L / 2.0L', posicion: 'Barra Delantera' },
      { marca: 'Ford', modelo: 'Ka', anios: '2005-2014', motor: '1.6L Rocam', posicion: 'Barra Delantera' }
    ],
    costo: 7.90,
    precio: 14.00,
    stock: 16,
    min: 4,
    ubicacion: 'Pasillo S2 - Estante 2',
    garantia: '12 meses',
    especificaciones: 'Vástago de acero forjado de 10mm con rótulas de polímero autolubricado.',
    imagen: '/images/rep_amortiguador_1791152649395.jpg'
  },

  // 3. Rodamientos y Baleros
  {
    id: 'AUT-00005',
    sku: 'SKU-ROD-KOY-90369',
    nombre: 'Rodamiento de Rueda Delantero Sellado DAC3872',
    categoria: 'Rodamientos',
    marca: 'Koyo',
    codigoOEM: '90369-38022 / 90369-38021',
    referenciasCruzadas: [
      { marca: 'SKF', codigo: 'VKBA 3984' },
      { marca: 'NSK', codigo: '38BWD26' },
      { marca: 'NTN', codigo: 'DE08A45' },
      { marca: 'GMB', codigo: 'GH038022' }
    ],
    compatibilidad: [
      { marca: 'Toyota', modelo: 'Corolla (Baby Camry / Pantallita / New Sensación)', anios: '1993-2014', motor: '1.6L / 1.8L', posicion: 'Maza Rueda Delantera' },
      { marca: 'Toyota', modelo: 'Yaris', anios: '2000-2018', motor: '1.3L / 1.5L', posicion: 'Delantero' },
      { marca: 'Geely', modelo: 'CK / MK', anios: '2008-2016', motor: '1.5L', posicion: 'Delantero' }
    ],
    costo: 13.50,
    precio: 24.00,
    stock: 14,
    min: 4,
    ubicacion: 'Pasillo R2 - Estante 1',
    garantia: '12 meses / 40.000 km',
    especificaciones: 'Medidas: 38mm x 72mm x 37mm. Doble hilera angular con sellos de goma 2RS.',
    imagen: '/images/rep_kit_embrague_1791152677700.jpg'
  },

  // 4. Baterías Automotrices
  {
    id: 'AUT-00006',
    sku: 'SKU-BAT-DUN-24R800',
    nombre: 'Batería Automotriz Duncan 24R (800 AMP) Libre de Mantenimiento',
    categoria: 'Baterías',
    marca: 'Duncan Baterías',
    codigoOEM: 'DUN-24R-800 / BCI-24R',
    referenciasCruzadas: [
      { marca: 'Fulgor', codigo: 'FUL-24R' },
      { marca: 'Titan', codigo: 'TT-24R-800' },
      { marca: 'Willard', codigo: 'W-24R' },
      { marca: 'ACDelco', codigo: 'AC-24R' }
    ],
    compatibilidad: [
      { marca: 'Chevrolet', modelo: 'Aveo / Optra / Cruze / Silverado', anios: '2000-2024', motor: '1.6L / 1.8L / 5.3L', posicion: 'Compartimiento Batería' },
      { marca: 'Toyota', modelo: 'Corolla / Yaris / Hilux / Fortuner', anios: '2000-2024', motor: '1.8L / 2.7L / 4.0L', posicion: 'Compartimiento Batería' },
      { marca: 'Ford', modelo: 'Fiesta / EcoSport / Explorer / F-150', anios: '2000-2024', motor: '1.6L / 2.0L / 4.6L', posicion: 'Compartimiento Batería' },
      { marca: 'Chery', modelo: 'Orinoco / Tiggo / Arauca', anios: '2010-2024', motor: '1.3L / 1.8L / 2.0L', posicion: 'Compartimiento Batería' }
    ],
    costo: 72.00,
    precio: 98.00,
    stock: 8,
    min: 2,
    ubicacion: 'Área Baterías - Almacén Central',
    garantia: '12 meses con certificado de garantía nacional',
    especificaciones: 'Capacidad 800 AMP arranque en frío (CCA 600A). Terminales cónicos estándar SAE, polaridad derecha (+) R.',
    imagen: '/images/prod_alternador_12v_1791155201792.jpg'
  },

  // 5. Luces de Faros y Stop
  {
    id: 'AUT-00007',
    sku: 'SKU-LUC-OSR-H46055',
    nombre: 'Bombillo Halógeno H4 12V 60/55W Bilux Luz Alta/Baja Original',
    categoria: 'Luces y Faros',
    marca: 'Osram Automotive Lighting',
    codigoOEM: '90981-13058 / 64193',
    referenciasCruzadas: [
      { marca: 'Philips', codigo: '12342' },
      { marca: 'Hella', codigo: '8GJ 002 525-131' },
      { marca: 'Flosser', codigo: '2040' },
      { marca: 'Bosch', codigo: '1987301001' }
    ],
    compatibilidad: [
      { marca: 'Toyota', modelo: 'Corolla / Hilux / Machito / Yaris', anios: '1995-2022', motor: 'Todos', posicion: 'Faro Delantero Principal' },
      { marca: 'Chevrolet', modelo: 'Corsa / Spark / Aveo 3P / Luv D-Max', anios: '1998-2018', motor: 'Todos', posicion: 'Faro Principal' },
      { marca: 'Ford', modelo: 'Fiesta Power / Ka / EcoSport', anios: '2001-2015', motor: 'Todos', posicion: 'Faro Principal' },
      { marca: 'Chery', modelo: 'Arauca / QQ / Grand Tiger', anios: '2006-2022', motor: 'Todos', posicion: 'Faro Principal' }
    ],
    costo: 2.30,
    precio: 4.80,
    stock: 45,
    min: 10,
    ubicacion: 'Vitrina Iluminación V1',
    garantia: '6 meses',
    especificaciones: 'Base P43t. Flujo luminoso 1650/1000 lúmenes. Cristal de cuarzo UV bloqueador.',
    imagen: '/images/prod_alternador_12v_1791155201792.jpg'
  },
  {
    id: 'AUT-00008',
    sku: 'SKU-LUC-PHI-1157',
    nombre: 'Bombillo 1157 2 Contactos 12V (Freno/Stop y Posición) Patas Desparejas',
    categoria: 'Luces y Faros',
    marca: 'Philips Automotive',
    codigoOEM: '1157 / BAY15D / P21/5W',
    referenciasCruzadas: [
      { marca: 'Osram', codigo: '7528' },
      { marca: 'Hella', codigo: '8GD 002 078-121' },
      { marca: 'Flosser', codigo: '2112' }
    ],
    compatibilidad: [
      { marca: 'Universal', modelo: 'Vehículos con faros de stop convencionales', anios: 'Todos', motor: 'Gasolina / Diesel', posicion: 'Stop Trasero / Cocuyo' }
    ],
    costo: 0.70,
    precio: 1.60,
    stock: 90,
    min: 20,
    ubicacion: 'Vitrina Iluminación V2',
    garantia: '3 meses',
    especificaciones: 'Casquillo metálico BAY15D con dos filamentos (21W para freno y 5W para luz de noche).',
    imagen: '/images/prod_alternador_12v_1791155201792.jpg'
  },

  // 6. Cilindros de Ignición y Switcheras
  {
    id: 'AUT-00009',
    sku: 'SKU-IGN-GEN-90050',
    nombre: 'Cilindro de Switchera de Ignición y Encendido con 2 Llaves',
    categoria: 'Cilindros de Ignición',
    marca: 'ACDelco',
    codigoOEM: '90050843 / 90050844',
    referenciasCruzadas: [
      { marca: 'Valeo', codigo: '252522' },
      { marca: 'Takama', codigo: 'TK-SW900' }
    ],
    compatibilidad: [
      { marca: 'Chevrolet', modelo: 'Corsa / Chevy C2 / Montana', anios: '1998-2012', motor: '1.4L / 1.6L / 1.8L', posicion: 'Columna de Dirección' },
      { marca: 'Chevrolet', modelo: 'Astra', anios: '2000-2006', motor: '1.8L / 2.0L', posicion: 'Columna de Dirección' }
    ],
    costo: 11.50,
    precio: 21.00,
    stock: 7,
    min: 2,
    ubicacion: 'Pasillo E2 - Estante 1',
    garantia: '12 meses',
    especificaciones: 'Cuerpo de zamak de precisión con 6 pines de combinación y par de llaves con logo.',
    imagen: '/images/prod_bobina_encendido_1791155210560.jpg'
  },

  // 7. Relex y Relés Automotrices
  {
    id: 'AUT-00010',
    sku: 'SKU-RLY-BOS-0332',
    nombre: 'Relex Automotriz Universal 12V 4 Pines 40A Reforzado',
    categoria: 'Relex y Relés',
    marca: 'Bosch',
    codigoOEM: '0 332 019 150 / 90987-02006',
    referenciasCruzadas: [
      { marca: 'Hella', codigo: '4RA 933 791-061' },
      { marca: 'Denso', codigo: '056700-5260' },
      { marca: 'Omron', codigo: 'G8HN-1C4T-RJ' },
      { marca: 'Flosser', codigo: '2240' }
    ],
    compatibilidad: [
      { marca: 'Universal', modelo: 'Electroventilador, Bomba Gasolina, Faros Halógenos, Corneta', anios: 'Todos', motor: 'Todos', posicion: 'Fusilera / Ramal Eléctrico' }
    ],
    costo: 2.40,
    precio: 4.95,
    stock: 42,
    min: 10,
    ubicacion: 'Vitrina Eléctricos E1',
    garantia: '12 meses',
    especificaciones: 'Contactos de plata-óxido de estaño (AgSnO2) resistentes a la soldadura y chisporroteo eléctrico. Soporta 40 Amperios continuos.',
    imagen: '/images/prod_sensor_ckp_1791152221865.jpg'
  },

  // 8. Mangueras Automotrices
  {
    id: 'AUT-00011',
    sku: 'SKU-MAN-GAT-16571',
    nombre: 'Manguera Superior de Radiador en EPDM Reforzada',
    categoria: 'Mangueras',
    marca: 'Gates',
    codigoOEM: '16571-0D050 / 16571-22080',
    referenciasCruzadas: [
      { marca: 'Dayco', codigo: '71928' },
      { marca: 'Continental', codigo: '66184' },
      { marca: 'Cauplas', codigo: '4821' }
    ],
    compatibilidad: [
      { marca: 'Toyota', modelo: 'Corolla (Pantallita / New Sensación / GLi)', anios: '2003-2015', motor: '1.8L 1ZZ-FE / 2.0L 2ZR', posicion: 'Radiador a Motor (Superior)' },
      { marca: 'Toyota', modelo: 'Matrix', anios: '2003-2012', motor: '1.8L', posicion: 'Radiador Superior' }
    ],
    costo: 6.50,
    precio: 12.80,
    stock: 11,
    min: 3,
    ubicacion: 'Pasillo M1 - Estante 3',
    garantia: '12 meses',
    especificaciones: 'Construcción EPDM sintético resistente a la degradación electroquímica (ECR) y temperaturas de -40°C a 135°C.',
    imagen: '/images/rep_bomba_agua_1791152689068.jpg'
  },

  // 9. Frenos y Fricción
  {
    id: 'AUT-00012',
    sku: 'SKU-FRE-BOS-04465',
    nombre: 'Pastillas de Freno Delanteras Cerámicas Premium',
    categoria: 'Frenos y Fricción',
    marca: 'Bosch',
    codigoOEM: '04465-02220 / 04465-47070',
    referenciasCruzadas: [
      { marca: 'Brembo', codigo: 'P83082' },
      { marca: 'Ferodo', codigo: 'FDB1641' },
      { marca: 'TRW', codigo: 'GDB3425' },
      { marca: 'ACDelco', codigo: '17D1210' },
      { marca: 'Wagner', codigo: 'QC1210' }
    ],
    compatibilidad: [
      { marca: 'Toyota', modelo: 'Corolla', anios: '2008-2022', motor: '1.8L 2ZR-FE / 2.0L 3ZR', posicion: 'Eje Delantero' },
      { marca: 'Toyota', modelo: 'Yaris', anios: '2010-2020', motor: '1.5L 1NZ-FE', posicion: 'Eje Delantero' },
      { marca: 'Toyota', modelo: 'Matrix', anios: '2009-2014', motor: '1.8L 2ZR-FE', posicion: 'Eje Delantero' }
    ],
    costo: 26.50,
    precio: 42.00,
    stock: 14,
    min: 4,
    ubicacion: 'Pasillo F1 - Estante 2',
    garantia: '12 meses / 20.000 km',
    especificaciones: 'Compuesto cerámico bajo en polvo. Incluye láminas antiruido y clips de sujeción. Espesor: 17.5mm.',
    imagen: '/images/rep_pastillas_freno_1791152631245.jpg'
  },

  // 10. Filtración
  {
    id: 'AUT-00013',
    sku: 'SKU-FIL-DEN-90915',
    nombre: 'Filtro de Aceite Blindado Sintético Alto Flujo',
    categoria: 'Filtros y Mantenimiento',
    marca: 'Denso',
    codigoOEM: '90915-YZZD2 / 90915-YZZD4',
    referenciasCruzadas: [
      { marca: 'Mann-Filter', codigo: 'W 68/3' },
      { marca: 'Wix', codigo: '51394' },
      { marca: 'Fram', codigo: 'PH4967' },
      { marca: 'Bosch', codigo: '0986AF0059' }
    ],
    compatibilidad: [
      { marca: 'Toyota', modelo: 'Corolla', anios: '2002-2024', motor: '1.6L / 1.8L / 2.0L', posicion: 'Motor' },
      { marca: 'Toyota', modelo: 'Yaris', anios: '2006-2023', motor: '1.3L / 1.5L', posicion: 'Motor' },
      { marca: 'Toyota', modelo: 'RAV4', anios: '2001-2019', motor: '2.0L / 2.4L / 2.5L', posicion: 'Motor' },
      { marca: 'Chevrolet', modelo: 'Tracker', anios: '2013-2021', motor: '1.8L Ecotec', posicion: 'Motor' }
    ],
    costo: 4.20,
    precio: 7.95,
    stock: 48,
    min: 12,
    ubicacion: 'Pasillo F2 - Estante 1',
    garantia: '10.000 km o 6 meses',
    especificaciones: 'Válvula anti-drenaje de silicona. Eficiencia de filtrado del 99% a 20 micras. Rosca 3/4-16 UNF.',
    imagen: '/images/rep_filtro_aceite_1791152641120.jpg'
  },

  // 11. Suspensión y Dirección
  {
    id: 'AUT-00014',
    sku: 'SKU-SUS-MON-72145',
    nombre: 'Amortiguador Delantero a Gas Nitro-Cell Reforzado',
    categoria: 'Suspensión y Dirección',
    marca: 'Monroe',
    codigoOEM: '96407819 / 96407820',
    referenciasCruzadas: [
      { marca: 'KYB', codigo: '333418' },
      { marca: 'Gabriel', codigo: 'G54160' },
      { marca: 'Sachs', codigo: '313533' },
      { marca: 'ACDelco', codigo: '19374021' }
    ],
    compatibilidad: [
      { marca: 'Chevrolet', modelo: 'Aveo', anios: '2005-2019', motor: '1.6L F16D3 DOHC', posicion: 'Delantero Derecho/Izq' },
      { marca: 'Chevrolet', modelo: 'Optra', anios: '2004-2013', motor: '1.8L / 2.0L', posicion: 'Delantero' }
    ],
    costo: 35.00,
    precio: 58.00,
    stock: 9,
    min: 2,
    ubicacion: 'Pasillo S1 - Estante 4',
    garantia: '24 meses / 40.000 km',
    especificaciones: 'Vástago cromado templado por inducción. Fluido hidráulico para todo clima (-40°C a 120°C).',
    imagen: '/images/rep_amortiguador_1791152649395.jpg'
  },

  // 12. Encendido y Eléctrico
  {
    id: 'AUT-00015',
    sku: 'SKU-IGN-NGK-7098',
    nombre: 'Bujía de Iridio Laser Spark Alta Eficiencia',
    categoria: 'Partes Eléctricas',
    marca: 'NGK / NTK',
    codigoOEM: '22401-ED815 / 12290-R40-A01',
    referenciasCruzadas: [
      { marca: 'Denso', codigo: 'IK20TT' },
      { marca: 'Bosch', codigo: 'FR7NPP332' },
      { marca: 'Champion', codigo: '9006' },
      { marca: 'ACDelco', codigo: '41-110' }
    ],
    compatibilidad: [
      { marca: 'Nissan', modelo: 'Tiida', anios: '2007-2018', motor: '1.8L MR18DE', posicion: 'Culata' },
      { marca: 'Nissan', modelo: 'Sentra', anios: '2007-2020', motor: '2.0L MR20DE', posicion: 'Culata' },
      { marca: 'Nissan', modelo: 'Versa', anios: '2012-2022', motor: '1.6L HR16DE', posicion: 'Culata' },
      { marca: 'Honda', modelo: 'Civic', anios: '2006-2016', motor: '1.8L R18A1', posicion: 'Culata' }
    ],
    costo: 6.80,
    precio: 13.50,
    stock: 28,
    min: 8,
    ubicacion: 'Pasillo E1 - Estante 3',
    garantia: '80.000 km vida útil garantizada',
    especificaciones: 'Punta ultrafina de 0.6mm de iridio soldado por láser. Mayor inflamabilidad y respuesta de aceleración.',
    imagen: '/images/rep_bujia_iridio_1791152658933.jpg'
  },

  // 13. Motor y Distribución
  {
    id: 'AUT-00016',
    sku: 'SKU-MOT-GAT-9543',
    nombre: 'Kit de Correa de Distribución y Rodamiento Tensor',
    categoria: 'Motor / Distribución',
    marca: 'Gates',
    codigoOEM: '2S6Q-8B596-AA / 0831.V3',
    referenciasCruzadas: [
      { marca: 'Continental / Contitech', codigo: 'CT1092K1' },
      { marca: 'Dayco', codigo: 'KTB493' },
      { marca: 'SKF', codigo: 'VKMA 03254' },
      { marca: 'INA', codigo: '530 0379 10' }
    ],
    compatibilidad: [
      { marca: 'Ford', modelo: 'Fiesta', anios: '2004-2015', motor: '1.6L Rocam / Zetec', posicion: 'Distribución' },
      { marca: 'Ford', modelo: 'EcoSport', anios: '2004-2018', motor: '1.6L / 2.0L Duratec', posicion: 'Distribución' },
      { marca: 'Ford', modelo: 'Ka', anios: '2005-2013', motor: '1.6L', posicion: 'Distribución' }
    ],
    costo: 38.00,
    precio: 68.00,
    stock: 7,
    min: 2,
    ubicacion: 'Pasillo M2 - Estante 2',
    garantia: '60.000 km / 2 años',
    especificaciones: 'Compuesto HNBR resistente a altas temperaturas y aceite. Tensor automático de rodamiento reforzado.',
    imagen: '/images/rep_correa_distribucion_1791152666979.jpg'
  },

  // 14. Embrague y Transmisión
  {
    id: 'AUT-00017',
    sku: 'SKU-TRA-VAL-82631',
    nombre: 'Kit de Embrague Completo (Disco, Plato y Collarín)',
    categoria: 'Embrague / Transmisión',
    marca: 'Valeo',
    codigoOEM: '41100-23135 / 41200-23135',
    referenciasCruzadas: [
      { marca: 'LuK', codigo: '622 3145 00' },
      { marca: 'Sachs', codigo: '3000 951 098' },
      { marca: 'Exedy', codigo: 'HYK2044' },
      { marca: 'Aisin', codigo: 'KH-024' }
    ],
    compatibilidad: [
      { marca: 'Hyundai', modelo: 'Elantra', anios: '2007-2017', motor: '1.6L / 2.0L Beta', posicion: 'Caja Manual' },
      { marca: 'Hyundai', modelo: 'Accent', anios: '2006-2016', motor: '1.4L / 1.6L Alpha', posicion: 'Caja Manual' },
      { marca: 'Kia', modelo: 'Rio', anios: '2006-2017', motor: '1.4L / 1.6L', posicion: 'Caja Manual' },
      { marca: 'Kia', modelo: 'Cerato', anios: '2008-2015', motor: '1.6L / 2.0L', posicion: 'Caja Manual' }
    ],
    costo: 78.00,
    precio: 135.00,
    stock: 5,
    min: 2,
    ubicacion: 'Pasillo T1 - Estante 1',
    garantia: '12 meses sin límite de kilometraje',
    especificaciones: 'Diámetro: 215mm, 20 estrías. Resortes helicoidales progresivos para absorción de vibraciones.',
    imagen: '/images/rep_kit_embrague_1791152677700.jpg'
  },

  // 15. Refrigeración
  {
    id: 'AUT-00018',
    sku: 'SKU-REF-GMB-1209',
    nombre: 'Bomba de Agua con Empacadura Reforzada',
    categoria: 'Refrigeración',
    marca: 'GMB',
    codigoOEM: '96352650 / 96352648',
    referenciasCruzadas: [
      { marca: 'Airtex', codigo: 'AW9354' },
      { marca: 'Dolz', codigo: 'D211' },
      { marca: 'Gates', codigo: 'WP0098' },
      { marca: 'ACDelco', codigo: '252-840' }
    ],
    compatibilidad: [
      { marca: 'Chevrolet', modelo: 'Corsa', anios: '1998-2012', motor: '1.3L / 1.4L / 1.6L MPFI', posicion: 'Bloque Motor' },
      { marca: 'Chevrolet', modelo: 'Chevy C2', anios: '2004-2012', motor: '1.6L', posicion: 'Bloque Motor' },
      { marca: 'Chevrolet', modelo: 'Meriva', anios: '2004-2009', motor: '1.8L', posicion: 'Bloque Motor' }
    ],
    costo: 19.50,
    precio: 34.00,
    stock: 12,
    min: 3,
    ubicacion: 'Pasillo R1 - Estante 3',
    garantia: '12 meses / 25.000 km',
    especificaciones: 'Rotor de aleación fundida de alta eficiencia de caudal. Sello mecánico cerámico de carbón.',
    imagen: '/images/rep_bomba_agua_1791152689068.jpg'
  }
];


let repuestoSubTab = 'catalogo';
let fitmentFilter = { marca: '', modelo: '', anio: '', motor: '', repuesto: '' };

function getRepuestos(){
  if (!Array.isArray(db.repuestos)) {
    db.repuestos = structuredClone(REPUESTOS_SEED);
  } else {
    // Si la base de datos de repuestos tiene menos items que el seed expandido, combinamos los nuevos
    if (db.repuestos.length < REPUESTOS_SEED.length) {
      const existingIds = new Set(db.repuestos.map(r => r.id));
      REPUESTOS_SEED.forEach(s => {
        if (!existingIds.has(s.id)) {
          db.repuestos.push(structuredClone(s));
        }
      });
    }
  }
  return db.repuestos;
}


function generateUniqueSKU(categoria = 'GEN', marca = 'REP', codigoOEM = ''){
  const catCode = categoria.substring(0, 3).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const marCode = marca.substring(0, 3).toUpperCase();
  const cleanOEM = codigoOEM.replace(/[^A-Z0-9]/gi, '').substring(0, 5).toUpperCase();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  
  let candidate = `SKU-${catCode}-${marCode}-${cleanOEM || randomSuffix}`;
  
  const repuestos = getRepuestos();
  let collision = repuestos.some(r => r.sku === candidate);
  if (collision) {
    candidate += '-' + Math.floor(10 + Math.random() * 90);
  }
  return candidate;
}

// Interfaz Principal del Módulo de Repuestos
function repuestosView(){
  const repuestos = getRepuestos();
  const totalStock = repuestos.reduce((s, r) => s + (r.stock || 0), 0);
  const totalRefCruzadas = repuestos.reduce((s, r) => s + (r.referenciasCruzadas?.length || 0), 0);
  const totalFitments = repuestos.reduce((s, r) => s + (r.compatibilidad?.length || 0), 0);

  return `
  <div class="pagehead">
    <div>
      <h2>🚗 Gestión Integral de Repuestos Automotrices</h2>
      <div class="sub">Catálogo técnico multicriterio · Búsqueda por palabras claves · Referencias cruzadas · Compatibilidad vehicular</div>
    </div>
    <div class="actions" style="margin:0">
      <button class="btn" onclick="openMasterCatalogSelectorModal('repuesto')">📖 Buscar en Catálogo Máster (+2.000.000)</button>
      <button class="btn primary" onclick="openRepuestoModal()">➕ Nuevo Repuesto</button>
    </div>
  </div>

  <div class="cards">
    <div class="card">Repuestos registrados<b>${repuestos.length}</b><span>existencias gestionadas aquí</span></div>
    <div class="card">Stock Físico Local<b>${totalStock}</b><span>unidades en almacén</span></div>
    <div class="card">Referencias Cruzadas<b>${totalRefCruzadas}</b><span>códigos y marcas cruzadas</span></div>
    <div class="card">Fitments Vehiculares<b>${totalFitments}</b><span>modelos de autos mapeados</span></div>
  </div>

  <div style="display:flex;gap:4px;border-bottom:1px solid #aaa;margin-bottom:10px;background:#ededed;padding:4px 6px">
    <button class="btn ${repuestoSubTab==='catalogo'?'primary':''}" onclick="repuestoSubTab='catalogo';renderView()">📦 Repuestos registrados</button>
    <button class="btn ${repuestoSubTab==='buscador_vehiculo'?'primary':''}" onclick="repuestoSubTab='buscador_vehiculo';renderView()">🚘 Buscador por Vehículo (Fitment)</button>
    <button class="btn ${repuestoSubTab==='referencias_cruzadas'?'primary':''}" onclick="repuestoSubTab='referencias_cruzadas';renderView()">🔗 Matriz de Referencias Cruzadas</button>
  </div>

  ${renderRepuestoSubTabContent()}
  `;
}

function renderRepuestoSubTabContent(){
  if (repuestoSubTab === 'buscador_vehiculo') return renderFitmentSearchTab();
  if (repuestoSubTab === 'referencias_cruzadas') return renderCrossReferenceTab();
  return renderCatalogTab();
}

// 1. Tab Catálogo
function renderCatalogTab(){
  const repuestos = getRepuestos();
  const b = bcvData();
  const rate = b.rate || 1;

  // Extraer categorías y marcas únicas existentes
  const categoriasUnicas = Array.from(new Set(repuestos.map(r => r.categoria).filter(Boolean))).sort();
  const marcasUnicas = Array.from(new Set(repuestos.map(r => r.marca).filter(Boolean))).sort();

  return `
  <div class="searchbar" style="display:grid;grid-template-columns:1fr 190px 180px auto;gap:6px">
    <input id="repuestoQ" placeholder="🔍 Búsqueda por palabras claves (ej: bujes aveo, lapiz fiesta, bateria duncan, bombillo h4, manguera optra, relex 12v, 04465, bosch)..." oninput="filterRepuestosTable()">
    <select id="repuestoCatFilter" onchange="filterRepuestosTable()">
      <option value="">Todas las Categorías</option>
      ${categoriasUnicas.map(cat => `<option value="${esc(cat)}">${esc(cat)}</option>`).join('')}
    </select>
    <select id="repuestoMarcaFilter" onchange="filterRepuestosTable()">
      <option value="">Todas las Marcas</option>
      ${marcasUnicas.map(mar => `<option value="${esc(mar)}">${esc(mar)}</option>`).join('')}
    </select>
    <button class="btn" onclick="openSKUGeneratorBatchModal()">✨ Asignar SKUs</button>
  </div>

  <div class="panel">
    <div class="panelhead" style="display:flex;justify-content:space-between;align-items:center">
      <span>Listado de Repuestos Registrados (Búsqueda por palabras claves en nombre, SKU, OEM, marcas y vehículos)</span>
      <span style="font-size:11px;color:#555">Tasa BCV de cálculo: <b>${fmtRate(rate)} Bs/USD</b></span>
    </div>
    <div class="panelbody" style="padding:0;overflow:auto">
      <table id="repuestosTable">
        <thead>
          <tr>
            <th style="width:48px;text-align:center">Foto</th>
            <th style="width:140px">SKU / ID</th>
            <th>Repuesto / Categoría / Marca</th>
            <th>Código OEM</th>
            <th>Referencias Cruzadas</th>
            <th>Compatibilidad Vehicular</th>
            <th style="text-align:center">Stock</th>
            <th style="text-align:right">Precio USD / Bs</th>
            <th style="width:120px;text-align:center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${repuestos.map(r => {
                    const priceBs = (r.precio * rate);
            const refPreview = (r.referenciasCruzadas || []).map(x => `<b>${esc(x.marca)}:</b> ${esc(x.codigo)}`).slice(0, 3).join(' · ');
            const fitPreview = (r.compatibilidad || []).map(x => `${esc(x.marca)} ${esc(x.modelo)} (${x.anios})`).slice(0, 2).join(', ');
            
            return `
            <tr class="clickrow" data-cat="${esc(r.categoria)}" data-brand="${esc(r.marca)}">
              <td style="text-align:center;padding:3px">
                <img src="${r.imagen || '/icon.svg'}" alt="${esc(r.nombre)}" style="width:38px;height:38px;object-fit:cover;border:1px solid #ccc;border-radius:3px;cursor:pointer" onclick="viewPhotoZoom('${r.id}')" title="Clic para ampliar foto de alta resolución" onerror="this.src='/icon.svg'">
              </td>
              <td>
                <span style="font-family:monospace;font-weight:bold;color:#0b4f85">${esc(r.sku)}</span>
                <div style="font-size:9px;color:#777">${r.id} · ${esc(r.ubicacion || 'Almacén')}</div>
              </td>
              <td>
                <b>${esc(r.nombre)}</b>
                <div style="font-size:10px;color:#555">Marca: <b>${esc(r.marca)}</b> · Cat: <span style="color:#0b4f85;font-weight:600">${esc(r.categoria)}</span></div>
              </td>
              <td>
                <span style="font-family:monospace;font-weight:700;background:#f0f4fa;padding:1px 4px;border:1px solid #d0dbe8;font-size:10px">${esc(r.codigoOEM || 'N/A')}</span>
              </td>
              <td style="font-size:10px;max-width:170px">
                <div>${refPreview || 'Sin referencias'}</div>
                ${r.referenciasCruzadas?.length > 3 ? `<span style="font-size:9px;color:#0873d1">+${r.referenciasCruzadas.length - 3} más</span>` : ''}
              </td>
              <td style="font-size:10px;max-width:180px">
                <div style="color:#0a6839;font-weight:600">${fitPreview || 'Universal'}</div>
                ${r.compatibilidad?.length > 2 ? `<span style="font-size:9px;color:#666">+${r.compatibilidad.length - 2} autos más</span>` : ''}
              </td>
              <td style="text-align:center">
                <span class="badge ${r.stock <= r.min ? 'bad' : 'ok'}"><b>${r.stock}</b> local</span>
              </td>
              <td style="text-align:right">
                <div style="font-weight:bold">${money(r.precio)}</div>
                <div style="font-size:9px;color:#0b4f85">Bs ${priceBs.toLocaleString('es-VE', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
              </td>
              <td style="text-align:center">
                <div style="display:flex;gap:3px;justify-content:center">
                  <button class="btn" style="padding:2px 5px;font-size:10px" onclick="openRepuestoDetail('${r.id}')" title="Ver ficha técnica">👁️</button>
                  <button class="btn" style="padding:2px 5px;font-size:10px" onclick="openRepuestoModal('${r.id}')" title="Editar">✎</button>
                  <button class="btn green" style="padding:2px 5px;font-size:10px" onclick="venderRepuestoEnPOS('${r.id}')" title="Cargar y vender en POS">🛒</button>
                </div>
              </td>
            </tr>`;
          }).join('') || '<tr><td colspan="9" style="text-align:center;padding:20px">No hay repuestos registrados en el catálogo.</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>`;
}

// Filtro inteligente en vivo de catálogo por palabras claves
function filterRepuestosTable(){
  const rawQ = (document.getElementById('repuestoQ')?.value || '').trim();
  const cat = (document.getElementById('repuestoCatFilter')?.value || '').toLowerCase();
  const mar = (document.getElementById('repuestoMarcaFilter')?.value || '').toLowerCase();
  const rows = document.querySelectorAll('#repuestosTable tbody tr');
  
  rows.forEach(r => {
    const text = r.textContent;
    const matchQ = typeof matchKeywords === 'function' ? matchKeywords(text, rawQ) : (!rawQ || text.toLowerCase().includes(rawQ.toLowerCase()));
    const rowCat = (r.getAttribute('data-cat') || text).toLowerCase();
    const rowBrand = (r.getAttribute('data-brand') || text).toLowerCase();
    const matchCat = !cat || rowCat.includes(cat);
    const matchMar = !mar || rowBrand.includes(mar);
    r.style.display = (matchQ && matchCat && matchMar) ? '' : 'none';
  });
}

// 2. Tab Buscador por Vehículo (Fitment)
function renderFitmentSearchTab(){
  const repuestos = getRepuestos();
  
  // Extraer marcas y modelos únicos
  const marcasVehiculos = new Set();
  const modelosVehiculos = new Set();
  
  repuestos.forEach(r => {
    (r.compatibilidad || []).forEach(c => {
      if (c.marca) marcasVehiculos.add(c.marca);
      if (!fitmentFilter.marca || c.marca.toLowerCase() === fitmentFilter.marca.toLowerCase()) {
        if (c.modelo) modelosVehiculos.add(c.modelo);
      }
    });
  });

  const matchingParts = repuestos.filter(r => {
    const partQuery=String(fitmentFilter.repuesto||'').trim().toLowerCase();
    const partHay=[r.nombre,r.sku,r.codigoOEM,r.marca,r.categoria,r.descripcion,r.especificaciones].filter(Boolean).join(' ').toLowerCase();
    if(partQuery && !partHay.includes(partQuery)) return false;
    if (!fitmentFilter.marca && !fitmentFilter.modelo && !fitmentFilter.anio && !fitmentFilter.motor) return true;
    return (r.compatibilidad || []).some(c => {
      const matchMarca = !fitmentFilter.marca || c.marca.toLowerCase() === fitmentFilter.marca.toLowerCase();
      const matchModelo = !fitmentFilter.modelo || c.modelo.toLowerCase().includes(fitmentFilter.modelo.toLowerCase());
      const matchAnio = !fitmentFilter.anio || c.anios.includes(fitmentFilter.anio);
      const matchMotor = !fitmentFilter.motor || [c.motor,c.posicion,c.sistema].filter(Boolean).join(' ').toLowerCase().includes(fitmentFilter.motor.toLowerCase());
      return matchMarca && matchModelo && matchAnio && matchMotor;
    });
  });

  return `
  <div class="panel">
    <div class="panelhead" style="background:#0b63ce;color:#fff">🚘 Selector de Compatibilidad Vehicular (Filtro por Auto)</div>
    <div class="panelbody" style="background:#f9fbfe">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;align-items:flex-end">
        <div class="field">
          <label>Buscar repuesto</label>
          <input id="fitRepuesto" placeholder="Nombre, SKU, OEM o marca del repuesto..." value="${esc(fitmentFilter.repuesto||"")}" oninput="fitmentFilter.repuesto=this.value;renderView()">
        </div>
        <div class="field">
          <label>1. Marca del Auto</label>
          <select id="fitMarca" onchange="fitmentFilter.marca=this.value;renderView()">
            <option value="">-- Todas las Marcas --</option>
            ${Array.from(marcasVehiculos).sort().map(m => `<option ${fitmentFilter.marca===m?'selected':''}>${m}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>2. Modelo</label>
          <select id="fitModelo" onchange="fitmentFilter.modelo=this.value;renderView()">
            <option value="">-- Todos los Modelos --</option>
            ${Array.from(modelosVehiculos).sort().map(m => `<option ${fitmentFilter.modelo===m?'selected':''}>${m}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>3. Año de Fabricación</label>
          <input id="fitAnio" placeholder="Ej: 2015, 2018..." value="${fitmentFilter.anio}" oninput="fitmentFilter.anio=this.value;renderView()">
        </div>
        <div class="field">
          <label>4. Posición / Sistema</label>
          <input id="fitMotor" placeholder="Ej: Delantero, Motor..." value="${esc(fitmentFilter.motor||"")}" oninput="fitmentFilter.motor=this.value;renderView()">
        </div>
        <div>
          <button class="btn" onclick="fitmentFilter={marca:'',modelo:'',anio:'',motor:'',repuesto:''};renderView()">Limpiar Filtros</button>
        </div>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="panelhead">
      <b>Repuestos Compatibles Encontrados (${matchingParts.length})</b> ${fitmentFilter.marca ? `para <b>${fitmentFilter.marca} ${fitmentFilter.modelo} ${fitmentFilter.anio}</b>` : ''}
    </div>
    <div class="panelbody" style="padding:0">
      <table id="fitmentResultsTable">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Repuesto</th>
            <th>Marca Repuesto</th>
            <th>OEM</th>
            <th>Especificación Fitment</th>
            <th>Stock</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${matchingParts.map(r => {
            const fitMatch = (r.compatibilidad || []).filter(c => !fitmentFilter.marca || c.marca.toLowerCase() === fitmentFilter.marca.toLowerCase());
            return `
            <tr>
              <td><span style="font-family:monospace;font-weight:bold;color:#0b4f85">${esc(r.sku)}</span></td>
              <td><b>${esc(r.nombre)}</b><br><small style="color:#666">${esc(r.categoria)}</small></td>
              <td><b>${esc(r.marca)}</b></td>
              <td><span style="font-family:monospace;font-size:10px">${esc(r.codigoOEM)}</span></td>
              <td style="font-size:10px;color:#0b4f85">
                ${fitMatch.map(f => `<div><b>${esc(f.marca)} ${esc(f.modelo)}</b> (${f.anios}) · <i>${esc(f.posicion)}</i></div>`).join('')}
              </td>
              <td><span class="badge ${r.stock<=r.min?'bad':'ok'}">${r.stock} disp.</span></td>
              <td><b>${money(r.precio)}</b></td>
              <td style="text-align:right;white-space:nowrap">
                <button class="btn" title="Ver referencias cruzadas de este repuesto" aria-label="Ver referencias cruzadas de ${esc(r.nombre)}" style="font-size:14px;min-width:38px;padding:7px" onclick="openFitmentCrossReference('${r.id}')">🔁</button>
                <button class="btn primary" style="font-size:10px" onclick="venderRepuestoEnPOS('${r.id}')">🛒 Cargar al POS</button>
              </td>
            </tr>`;
          }).join('') || '<tr><td colspan="8" style="padding:20px;text-align:center">No se encontraron repuestos compatibles para esta selección vehicular.</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>`;
}

// Abre referencias directas y posibles alternativas que comparten aplicación vehicular.
function openFitmentCrossReference(id){
  const repuestos = getRepuestos();
  const r = repuestos.find(x => String(x.id) === String(id));
  if (!r) return;

  const fits = Array.isArray(r.compatibilidad) ? r.compatibilidad : [];
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const sameApplication = (a, b) => {
    const brandA = normalize(a.marca), brandB = normalize(b.marca);
    const modelA = normalize(a.modelo), modelB = normalize(b.modelo);
    if (!brandA || !brandB || brandA !== brandB || !modelA || !modelB) return false;
    return modelA === modelB || modelA.includes(modelB) || modelB.includes(modelA);
  };
  const alternatives = repuestos.filter(candidate => {
    if (String(candidate.id) === String(r.id)) return false;
    const candidateFits = Array.isArray(candidate.compatibilidad) ? candidate.compatibilidad : [];
    return fits.some(fit => candidateFits.some(other => sameApplication(fit, other)));
  }).slice(0, 30);
  const directRefs = Array.isArray(r.referenciasCruzadas) ? r.referenciasCruzadas : [];

  openModal('Referencias y alternativas · ' + (r.nombre || r.sku), `
    <div style="font-size:12px">
      <div style="padding:8px;background:#f4f8ff;border:1px solid #d4e2f5;border-radius:5px;margin-bottom:10px">
        <b>${esc(r.nombre || 'Repuesto')}</b><br>
        <span>SKU: ${esc(r.sku || 'N/D')} · OEM: ${esc(r.codigoOEM || 'N/D')}</span>
      </div>
      <h3 style="font-size:13px;margin:10px 0 5px">Referencias cruzadas registradas</h3>
      ${directRefs.length ? `<div style="display:flex;gap:5px;flex-wrap:wrap">${directRefs.map(ref => `<span style="border:1px solid #ccd6e2;background:#f8fafc;padding:5px 7px;border-radius:4px"><b>${esc(ref.marca || '')}</b>: ${esc(ref.codigo || '')}</span>`).join('')}</div>` : '<p style="color:#777">Este repuesto no tiene referencias cruzadas registradas.</p>'}
      <h3 style="font-size:13px;margin:14px 0 5px">Otros repuestos con aplicación vehicular coincidente (${alternatives.length})</h3>
      <p style="color:#666;font-size:11px;margin:0 0 7px">Son candidatos para revisar, no equivalencias técnicas confirmadas. Verifica OEM, medidas y especificaciones antes de sustituir.</p>
      ${alternatives.length ? `<div style="overflow:auto;max-height:260px"><table style="width:100%;font-size:11px"><thead><tr><th>Repuesto</th><th>Marca / OEM</th><th>Stock</th><th>Precio</th><th></th></tr></thead><tbody>${alternatives.map(candidate => `<tr><td><b>${esc(candidate.nombre || '')}</b><br><small>${esc(candidate.sku || '')}</small></td><td>${esc(candidate.marca || '')}<br><small>${esc(candidate.codigoOEM || '')}</small></td><td>${Number(candidate.stock) || 0}</td><td>${money(Number(candidate.precio) || 0)}</td><td><button class="btn" style="font-size:10px;padding:5px" onclick="openRepuestoDetail('${String(candidate.id).replace(/'/g, '&#39;')}')">Ficha</button></td></tr>`).join('')}</tbody></table></div>` : '<p style="color:#777">No hay otros repuestos con vehículo y modelo coincidentes en los datos registrados.</p>'}
    </div>
  `, '<button class="btn" onclick="closeModal()">Cerrar</button>');
}

window.openFitmentCrossReference = openFitmentCrossReference;

// 3. Tab Referencias Cruzadas
function renderCrossReferenceTab(){
  const repuestos = getRepuestos();

  return `
  <div class="panel">
    <div class="panelhead">Buscador Universal de Referencias Cruzadas (Intercambiabilidad de Códigos)</div>
    <div class="panelbody">
      <div class="searchbar">
        <input id="crossQ" placeholder="Escriba código OEM o código de cualquier fabricante (ej: 04465, P83082, 51394, W68/3, 96407819, 333418, 24R, H4)..." oninput="filterTable(this,'crossTable')">
      </div>
      <p style="font-size:11px;color:#666;margin:4px 0 10px">
        Esta matriz permite encontrar repuestos equivalentes de diferentes marcas cuando no se cuenta con el código OEM original.
      </p>

      <table id="crossTable">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Repuesto / Categoría</th>
            <th>Código OEM Principal</th>
            <th>Marca Local</th>
            <th>Marcas Alternativas y Códigos Cruzados</th>
            <th>Stock Local</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${repuestos.map(r => `
            <tr>
              <td><span style="font-family:monospace;font-weight:bold;color:#0b4f85">${esc(r.sku)}</span></td>
              <td><b>${esc(r.nombre)}</b><br><small style="color:#666">${esc(r.categoria)}</small></td>
              <td><span style="font-family:monospace;background:#f0f4fa;padding:2px 4px;border:1px solid #d0dbe8;font-size:11px;font-weight:bold">${esc(r.codigoOEM)}</span></td>
              <td><b>${esc(r.marca)}</b></td>
              <td>
                <div style="display:flex;gap:4px;flex-wrap:wrap">
                  ${(r.referenciasCruzadas || []).map(ref => `
                    <span style="font-size:10px;background:#f5f5f5;border:1px solid #ccc;padding:1px 5px;border-radius:3px">
                      <b>${esc(ref.marca)}:</b> <span style="font-family:monospace">${esc(ref.codigo)}</span>
                    </span>
                  `).join('') || '<span style="color:#888;font-size:10px">Sin equivalencias</span>'}
                </div>
              </td>
              <td><span class="badge ${r.stock<=r.min?'bad':'ok'}">${r.stock} un.</span></td>
              <td><b>${money(r.precio)}</b></td>
              <td><button class="btn" style="font-size:10px" onclick="openRepuestoDetail('${r.id}')">Ficha</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}



// Modales y Acciones del Módulo de Repuestos

function viewPhotoZoom(id){
  const r = getRepuestos().find(x => x.id === id);
  if (!r) return;
  openModal(`Foto Referencial — ${r.sku}`, `
    <div style="text-align:center;padding:10px">
      <img src="${r.imagen || '/icon.svg'}" alt="${esc(r.nombre)}" style="max-width:100%;max-height:360px;object-fit:contain;border:1px solid #ddd;border-radius:4px" onerror="this.src='/icon.svg'">
      <div style="font-weight:bold;margin-top:8px;font-size:14px">${esc(r.nombre)}</div>
      <div style="font-size:11px;color:#555">Marca: ${esc(r.marca)} · OEM: ${esc(r.codigoOEM)}</div>
      <div style="margin-top:10px">
        <button class="btn" onclick="openPhotoPickerModal('${r.id}')">📷 Cambiar o Cargar Foto</button>
      </div>
    </div>
  `, `<button class="btn" onclick="closeModal()">Cerrar</button>`);
}

function openPhotoPickerModal(id){
  const r = getRepuestos().find(x => x.id === id);
  if (!r) return;
  
  openModal('Cargar Foto Referencial', `
    <div class="formgrid">
      <div class="field full">
        <label>URL de Foto en Alta Resolución</label>
        <input id="imgUrlInput" value="${esc(r.imagen || '')}" placeholder="https://..." oninput="document.getElementById('previewPickImg').src=this.value">
      </div>
      <div class="field full">
        <label>O Seleccionar Archivo Local (PNG, JPG, SVG)</label>
        <input type="file" id="fileImgInput" accept="image/*" onchange="handleImageFileUpload(this)">
      </div>
      <div class="field full">
        <label>Tomar Foto con la Cámara</label>
        <input type="file" id="cameraImgInput" accept="image/*" capture="environment" onchange="handleImageFileUpload(this)">
        <div style="font-size:10px;color:#666;margin-top:4px">En teléfonos y tabletas abrirá la cámara del dispositivo para tomar la foto directamente.</div>
      </div>
      <div class="field full" style="text-align:center;padding:10px;background:#fafafa;border:1px solid #ddd">
        <div style="font-size:10px;color:#666;margin-bottom:5px">Vista previa:</div>
        <img id="previewPickImg" src="${r.imagen || '/icon.svg'}" style="max-height:120px;max-width:100%;object-fit:contain" onerror="this.src='/icon.svg'">
      </div>
    </div>
  `, `
    <button class="btn" onclick="closeModal()">Cancelar</button>
    <button class="btn primary" onclick="saveRepuestoPhoto('${r.id}')">Guardar Foto</button>
  `);
}

function handleImageFileUpload(input){
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target?.result;
    if (dataUrl) {
      document.getElementById('imgUrlInput').value = dataUrl;
      document.getElementById('previewPickImg').src = dataUrl;
    }
  };
  reader.readAsDataURL(file);
}

function saveRepuestoPhoto(id){
  const r = getRepuestos().find(x => x.id === id);
  if (!r) return;
  r.imagen = document.getElementById('imgUrlInput')?.value || '';
  save();
  closeModal();
  renderView();
  toast('Foto actualizada correctamente');
}

function openRepuestoDetail(id){
  const r = getRepuestos().find(x => x.id === id);
  if (!r) return;
  const b = bcvData();
  const rate = b.rate || 1;
  const priceBs = r.precio * rate;

  openModal(`Ficha Técnica: ${r.sku}`, `
    <div style="display:grid;grid-template-columns:180px 1fr;gap:14px">
      <div>
        <img src="${r.imagen || '/icon.svg'}" style="width:100%;height:140px;object-fit:cover;border:1px solid #ccc;border-radius:4px" onerror="this.src='/icon.svg'">
        <div style="margin-top:8px;font-size:11px;background:#f5f5f5;padding:6px;border:1px solid #ddd">
          <div><b>SKU:</b> ${esc(r.sku)}</div>
          <div><b>Ubicación:</b> ${esc(r.ubicacion || 'Almacén')}</div>
          <div><b>Garantía:</b> ${esc(r.garantia || 'N/A')}</div>
        </div>
      </div>
      <div>
        <h3 style="margin:0 0 4px;font-size:15px">${esc(r.nombre)}</h3>
        <div style="font-size:11px;color:#555;margin-bottom:8px">Marca: <b>${esc(r.marca)}</b> · Categoría: <b>${esc(r.categoria)}</b></div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;background:#f9fbfe;padding:8px;border:1px solid #d0e0f5">
          <div>
            <div style="font-size:10px;color:#666">PRECIO USD</div>
            <div style="font-size:18px;font-weight:bold;color:#0b4f85">${money(r.precio)}</div>
          </div>
          <div>
            <div style="font-size:10px;color:#666">PRECIO EN BOLÍVARES (BCV)</div>
            <div style="font-size:16px;font-weight:bold;color:#0a6839">Bs ${priceBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
          </div>
        </div>

        <div style="font-size:11px;margin-bottom:6px">
          <b>Código OEM Original:</b> <span style="font-family:monospace;background:#eee;padding:1px 4px">${esc(r.codigoOEM)}</span>
        </div>

        <div style="font-size:11px;margin-bottom:6px">
          <b>Especificaciones:</b> ${esc(r.especificaciones || 'Estándar')}
        </div>

        <div style="font-size:11px;margin-top:8px">
          <b>Referencias Cruzadas Directas:</b>
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:2px">
            ${(r.referenciasCruzadas || []).map(x => `<span style="background:#eee;border:1px solid #ccc;padding:1px 5px;font-size:10px;border-radius:3px"><b>${esc(x.marca)}:</b> ${esc(x.codigo)}</span>`).join('')}
          </div>
        </div>

        <div style="font-size:11px;margin-top:8px">
          <b>Vehículos Compatibles (Fitment):</b>
          <div style="max-height:90px;overflow:auto;font-size:10px;background:#fafafa;border:1px solid #ddd;padding:4px;margin-top:2px">
            ${(r.compatibilidad || []).map(x => `<div>• <b>${esc(x.marca)} ${esc(x.modelo)}</b> (${x.anios}) - Motor: ${esc(x.motor)} [${esc(x.posicion)}]</div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn" onclick="closeModal()">Cerrar</button>
    <button class="btn" onclick="openPhotoPickerModal('${r.id}')">📷 Cambiar Foto</button>
    <button class="btn primary" onclick="venderRepuestoEnPOS('${r.id}')">🛒 Cargar en POS</button>
  `);
}

function openRepuestoModal(id){
  const repuestos = getRepuestos();
  const r = id ? repuestos.find(x => x.id === id) : {
    id: '',
    sku: '',
    nombre: '',
    categoria: 'Bujes y Gomas',
    marca: '555',
    codigoOEM: '',
    referenciasCruzadas: [],
    compatibilidad: [],
    costo: 0,
    precio: 0,
    stock: 0,
    min: 2,
    ubicacion: 'Pasillo A1',
    garantia: '12 meses',
    especificaciones: '',
    imagen: ''
  };

  const refText = (r.referenciasCruzadas || []).map(x => `${x.marca}: ${x.codigo}`).join(', ');
  const fitText = (r.compatibilidad || []).map(x => `${x.marca} - ${x.modelo} - ${x.anios} - ${x.motor || '1.6L'} - ${x.posicion || 'Delantero'}`).join('\n');

  openModal(id ? 'Editar Repuesto Automotriz' : 'Nuevo Repuesto Automotriz', `
    <div class="formgrid">
      <div class="field">
        <label>SKU Único del Repuesto</label>
        <div style="display:flex;gap:4px">
          <input id="repSKU" value="${esc(r.sku || generateUniqueSKU(r.categoria, r.marca, r.codigoOEM))}">
          <button class="btn" style="padding:4px 6px;font-size:10px" onclick="document.getElementById('repSKU').value=generateUniqueSKU(document.getElementById('repCat').value, document.getElementById('repMarca').value, document.getElementById('repOEM').value)">✨ Auto</button>
        </div>
      </div>
      <div class="field">
        <label>Código OEM Original del Fabricante</label>
        <input id="repOEM" value="${esc(r.codigoOEM)}" placeholder="Ej: 04465-02220">
      </div>
      <div class="field full">
        <label>Descripción / Nombre del Repuesto</label>
        <input id="repNombre" value="${esc(r.nombre)}" placeholder="Ej: Buje de Meseta Delantera Inferior">
      </div>
      <div class="field">
        <label>Categoría</label>
        <select id="repCat">
          <option ${r.categoria==='Bujes y Gomas'?'selected':''}>Bujes y Gomas</option>
          <option ${r.categoria==='Lápiz y Bieletas'?'selected':''}>Lápiz y Bieletas</option>
          <option ${r.categoria==='Rodamientos'?'selected':''}>Rodamientos</option>
          <option ${r.categoria==='Baterías'?'selected':''}>Baterías</option>
          <option ${r.categoria==='Luces y Faros'?'selected':''}>Luces y Faros</option>
          <option ${r.categoria==='Cilindros de Ignición'?'selected':''}>Cilindros de Ignición</option>
          <option ${r.categoria==='Relex y Relés'?'selected':''}>Relex y Relés</option>
          <option ${r.categoria==='Mangueras'?'selected':''}>Mangueras</option>
          <option ${r.categoria==='Frenos y Fricción'?'selected':''}>Frenos y Fricción</option>
          <option ${r.categoria==='Filtros y Mantenimiento'?'selected':''}>Filtros y Mantenimiento</option>
          <option ${r.categoria==='Suspensión y Dirección'?'selected':''}>Suspensión y Dirección</option>
          <option ${r.categoria==='Partes Eléctricas'?'selected':''}>Partes Eléctricas</option>
          <option ${r.categoria==='Motor / Distribución'?'selected':''}>Motor / Distribución</option>
          <option ${r.categoria==='Embrague / Transmisión'?'selected':''}>Embrague / Transmisión</option>
          <option ${r.categoria==='Refrigeración'?'selected':''}>Refrigeración</option>
        </select>
      </div>
      <div class="field">
        <label>Marca del Repuesto</label>
        <input id="repMarca" value="${esc(r.marca)}" placeholder="Ej: Bosch, Denso, 555, Monroe, Duncan...">
      </div>
      <div class="field">
        <label>Costo USD</label>
        <input id="repCosto" type="number" step=".01" value="${r.costo}">
      </div>
      <div class="field">
        <label>Precio Venta USD</label>
        <input id="repPrecio" type="number" step=".01" value="${r.precio}">
      </div>
      <div class="field">
        <label>Existencia Local</label>
        <input id="repStock" type="number" value="${r.stock}">
      </div>
      <div class="field">
        <label>Stock Mínimo</label>
        <input id="repMin" type="number" value="${r.min}">
      </div>
      <div class="field">
        <label>Ubicación Almacén</label>
        <input id="repUbicacion" value="${esc(r.ubicacion)}">
      </div>
      <div class="field">
        <label>Garantía</label>
        <input id="repGarantia" value="${esc(r.garantia)}">
      </div>
      <div class="field full">
        <label>Referencias Cruzadas (Formato: Marca: Código, Marca: Código)</label>
        <input id="repRefs" value="${esc(refText)}" placeholder="Ej: Brembo: P83082, CTR: CVT-44, Moog: K200780">
      </div>
      <div class="field full">
        <label>Compatibilidad Vehicular (Una línea por vehículo: Marca - Modelo - Años - Motor - Posición)</label>
        <textarea id="repFit" placeholder="Toyota - Corolla - 2008-2020 - 1.8L - Delantero&#10;Chevrolet - Aveo - 2005-2018 - 1.6L - Delantero">${esc(fitText)}</textarea>
      </div>
      <div class="field full">
        <label>URL de Imagen Referencial</label>
        <input id="repImg" value="${esc(r.imagen)}" placeholder="https://...">
      </div>
    </div>
  `, `
    <button class="btn" onclick="closeModal()">Cancelar</button>
    <button class="btn primary" onclick="saveRepuesto('${id || ''}')">Guardar Repuesto</button>
  `);
}

function saveRepuesto(id){
  const repuestos = getRepuestos();
  let r = id ? repuestos.find(x => x.id === id) : { id: 'AUT-' + String(db.seq.producto++).padStart(5, '0') };
  
  // Parsear referencias cruzadas
  const rawRefs = document.getElementById('repRefs')?.value || '';
  const parsedRefs = rawRefs.split(',').map(s => {
    const parts = s.split(':');
    if (parts.length >= 2) {
      return { marca: parts[0].trim(), codigo: parts[1].trim() };
    }
    return null;
  }).filter(Boolean);

  // Parsear compatibilidad vehicular
  const rawFit = document.getElementById('repFit')?.value || '';
  const parsedFit = rawFit.split('\n').map(line => {
    const p = line.split('-').map(x => x.trim());
    if (p.length >= 2) {
      return {
        marca: p[0] || 'Universal',
        modelo: p[1] || 'Varios',
        anios: p[2] || 'Todos',
        motor: p[3] || 'Gasolina',
        posicion: p[4] || 'General'
      };
    }
    return null;
  }).filter(Boolean);

  Object.assign(r, {
    sku: document.getElementById('repSKU').value.trim() || generateUniqueSKU('AUT', 'REP'),
    codigoOEM: document.getElementById('repOEM').value.trim(),
    nombre: document.getElementById('repNombre').value.trim(),
    categoria: document.getElementById('repCat').value,
    marca: document.getElementById('repMarca').value.trim(),
    costo: Number(document.getElementById('repCosto').value) || 0,
    precio: Number(document.getElementById('repPrecio').value) || 0,
    stock: Number(document.getElementById('repStock').value) || 0,
    min: Number(document.getElementById('repMin').value) || 0,
    ubicacion: document.getElementById('repUbicacion').value.trim(),
    garantia: document.getElementById('repGarantia').value.trim(),
    referenciasCruzadas: parsedRefs,
    compatibilidad: parsedFit,
    imagen: document.getElementById('repImg').value.trim()
  });

  if (!id) {
    repuestos.push(r);
  }
  
  save();
  closeModal();
  renderView();
  toast('Repuesto automotriz guardado con éxito');
}

// Cargar y vender repuesto en POS
function venderRepuestoEnPOS(id){
  const r = getRepuestos().find(x => x.id === id);
  if (!r) return;
  if (r.stock <= 0) {
    toast('Advertencia: El repuesto tiene stock local en 0 (puede solicitarse a distribuidor)');
  }
  
  let line = cart.find(x => x.id === r.id);
  if (line) {
    line.qty++;
  } else {
    cart.push({
      id: r.id,
      nombre: r.nombre,
      sku: r.sku,
      qty: 1,
      price: r.precio,
      disc: 0
    });
  }
  
  closeModal();
  go('pos');
  toast('Repuesto ' + r.sku + ' añadido a la venta POS');
}

// Modal para asignación por lote de SKUs
function openSKUGeneratorBatchModal(){
  const repuestos = getRepuestos();
  openModal('Generador y Verificador de SKUs Únicos', `
    <div style="padding:5px">
      <p style="font-size:12px">El sistema generará o normalizará los SKUs de todos los repuestos asegurando unicidad basada en categoría, marca y correlativo.</p>
      <table style="margin-top:8px">
        <thead>
          <tr>
            <th>Repuesto</th>
            <th>Marca</th>
            <th>OEM</th>
            <th>SKU Propuesto</th>
          </tr>
        </thead>
        <tbody>
          ${repuestos.map(r => `
            <tr>
              <td>${esc(r.nombre)}</td>
              <td>${esc(r.marca)}</td>
              <td>${esc(r.codigoOEM)}</td>
              <td><span style="font-family:monospace;font-weight:bold;color:#0b4f85">${generateUniqueSKU(r.categoria, r.marca, r.codigoOEM)}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `, `
    <button class="btn" onclick="closeModal()">Cerrar</button>
    <button class="btn primary" onclick="applyBatchSKUs()">Aplicar a Todos</button>
  `);
}

function applyBatchSKUs(){
  const repuestos = getRepuestos();
  repuestos.forEach(r => {
    if (!r.sku || r.sku.startsWith('AUT-')) {
      r.sku = generateUniqueSKU(r.categoria, r.marca, r.codigoOEM);
    }
  });
  save();
  closeModal();
  renderView();
  toast('SKUs normalizados y asociados a todos los repuestos');
}

// Exponer funciones globales
window.getRepuestos = getRepuestos;window.generateUniqueSKU = generateUniqueSKU;
window.repuestosView = repuestosView;
window.filterRepuestosTable = filterRepuestosTable;
window.viewPhotoZoom = viewPhotoZoom;
window.openPhotoPickerModal = openPhotoPickerModal;
window.saveRepuestoPhoto = saveRepuestoPhoto;
window.openRepuestoDetail = openRepuestoDetail;
window.openRepuestoModal = openRepuestoModal;
window.saveRepuesto = saveRepuesto;
window.venderRepuestoEnPOS = venderRepuestoEnPOS;
window.openSKUGeneratorBatchModal = openSKUGeneratorBatchModal;
window.applyBatchSKUs = applyBatchSKUs;
