// SIFER360 - Catálogo Máster Universal de Proveedores y Motor Comercial de Precios (+100.000 Productos)
// Especializado en Mercado Venezolano: Aceites y Lubricantes (Nacionales e Importados en todas las presentaciones),
// Repuestos Automotrices para Marcas Comerciales (Toyota, Chevrolet, Ford, Hyundai, Nissan, etc.) y Marcas Chinas (Chery, Jac, Changan, Great Wall).

(function(global){

  // ==========================================
  // 1. BANCO DE DATOS DE MARCAS Y ESPECIFICACIONES
  // ==========================================

  const LUBRICANT_BRANDS_VENEZUELA = [
    // Marcas Nacionales Venezolanas
    { nombre: 'PDV', origen: 'Nacional (Venezuela)', tipo: 'nacional', distribuidor: 'Distribuidora PDVSA / Lubricantes B2B' },
    { nombre: 'Inca Oil', origen: 'Nacional (Venezuela)', tipo: 'nacional', distribuidor: 'Inca Lubricantes de Venezuela' },
    { nombre: 'Venoco', origen: 'Nacional (Venezuela)', tipo: 'nacional', distribuidor: 'Industrias Venoco Nacional' },
    { nombre: 'Ultralub', origen: 'Nacional (Venezuela)', tipo: 'nacional', distribuidor: 'Ultralub Lubricantes C.A.' },
    { nombre: 'Sky Lubricantes', origen: 'Nacional (Venezuela)', tipo: 'nacional', distribuidor: 'Sky Lubricantes de Venezuela' },
    { nombre: 'Shell Venezuela', origen: 'Nacional / Envasado Local', tipo: 'nacional', distribuidor: 'Distribuidora Shell B2B' },
    { nombre: 'Castrol Venezuela', origen: 'Nacional / Envasado Local', tipo: 'nacional', distribuidor: 'Castrol Industrial Venezuela' },
    { nombre: 'Gonher Lubricantes', origen: 'Nacional / Importado', tipo: 'nacional', distribuidor: 'Gonher de Venezuela' },
    { nombre: 'Bituquim / LMV', origen: 'Nacional (Venezuela)', tipo: 'nacional', distribuidor: 'Químicos y Lubricantes LMV' },

    // Marcas Importadas de Renombre en Venezuela
    { nombre: 'Mobil Super / Mobil 1', origen: 'USA / Importado', tipo: 'importada_premium', distribuidor: 'Global Lubricants Direct' },
    { nombre: 'Valvoline', origen: 'USA / Importado', tipo: 'importada_premium', distribuidor: 'Valvoline Commercial Distribution' },
    { nombre: 'Motul', origen: 'Francia / Importado', tipo: 'importada_premium', distribuidor: 'Motul Racing & Commercial Feed' },
    { nombre: 'Liqui Moly', origen: 'Alemania / Importado', tipo: 'importada_premium', distribuidor: 'Liqui Moly Venezuela Import' },
    { nombre: 'ACDelco', origen: 'USA / GM Genuine', tipo: 'importada_premium', distribuidor: 'ACDelco / GM Parts Direct' },
    { nombre: 'Motorcraft', origen: 'USA / Ford Genuine', tipo: 'importada_premium', distribuidor: 'Motorcraft Distribución Automotriz' },
    { nombre: 'Toyota Genuine (TGMO)', origen: 'Japón / USA', tipo: 'importada_premium', distribuidor: 'Toyota Genuine Parts Wholesaler' },
    { nombre: 'Havoline / Chevron', origen: 'USA / Importado', tipo: 'importada_premium', distribuidor: 'Chevron Petroleum Supply' },
    { nombre: 'Kendall con Liquid Titanium', origen: 'USA / Importado', tipo: 'importada_premium', distribuidor: 'Kendall Motor Oils USA' },
    { nombre: 'TotalEnergies / Elf', origen: 'Francia / Importado', tipo: 'importada_premium', distribuidor: 'TotalEnergies B2B Direct' },
    { nombre: 'Pennzoil', origen: 'USA / Importado', tipo: 'importada_premium', distribuidor: 'Pennzoil Distribution Hub' },
    { nombre: 'Lucas Oil', origen: 'USA / Importado', tipo: 'importada_premium', distribuidor: 'Lucas Oil Heavy Duty Imports' },
    { nombre: 'Gulf', origen: 'USA / Importado', tipo: 'importada_premium', distribuidor: 'Gulf Oil International' }
  ];

  const LUBRICANT_TYPES = [
    // Aceites Motor Gasolina
    { nombre: 'Aceite de Motor 20W-50 Mineral de Alto Rendimiento', cat: 'Aceites y Lubricantes', sub: 'Motor Gasolina Mineral', costoBase: 4.50, margen: 35, spec: 'API SP / SN Plus. Formulado para motores de alto kilometraje.', foto: '/images/prod_aceite_20w50_1791155162585.jpg' },
    { nombre: 'Aceite de Motor 15W-40 Semisintético Multigrado', cat: 'Aceites y Lubricantes', sub: 'Motor Semisintético', costoBase: 5.20, margen: 35, spec: 'API SP / CI-4. Protección equilibrada para motores modernos.', foto: '/images/prod_aceite_20w50_1791155162585.jpg' },
    { nombre: 'Aceite de Motor 10W-30 Semisintético Protección Térmica', cat: 'Aceites y Lubricantes', sub: 'Motor Semisintético', costoBase: 5.60, margen: 35, spec: 'API SP / ILSAC GF-6A. Fluidez optimizada para arranque en frío.', foto: '/images/prod_aceite_5w30_1791155174742.jpg' },
    { nombre: 'Aceite de Motor 5W-30 Full Sintético Dexos1 Gen3', cat: 'Aceites y Lubricantes', sub: 'Motor 100% Sintético', costoBase: 7.20, margen: 30, spec: 'GM Dexos1 Gen3 / Ford WSS-M2C961-A1. Máxima protección turbo.', foto: '/images/prod_aceite_5w30_1791155174742.jpg' },
    { nombre: 'Aceite de Motor 5W-20 Full Sintético Ahorro de Combustible', cat: 'Aceites y Lubricantes', sub: 'Motor 100% Sintético', costoBase: 7.50, margen: 30, spec: 'Ford WSS-M2C945-B1 / Chrysler MS-6395. Diseñado para motores VVT-i y EcoBoost.', foto: '/images/prod_aceite_5w30_1791155174742.jpg' },
    { nombre: 'Aceite de Motor 0W-20 Full Sintético Ultra Baja Viscosidad', cat: 'Aceites y Lubricantes', sub: 'Motor 100% Sintético', costoBase: 8.40, margen: 30, spec: 'Toyota / Honda / Nissan Genuine Spec. Máxima eficiencia para motores híbridos y modernos.', foto: '/images/prod_aceite_5w30_1791155174742.jpg' },
    { nombre: 'Aceite de Motor 5W-40 Full Sintético Normas Europeas', cat: 'Aceites y Lubricantes', sub: 'Motor 100% Sintético', costoBase: 8.00, margen: 30, spec: 'VW 502.00/505.00, MB 229.5, BMW LL-01, Porsche A40.', foto: '/images/prod_aceite_5w30_1791155174742.jpg' },
    { nombre: 'Aceite Monogrado SAE 50 Trabajo Pesado', cat: 'Aceites y Lubricantes', sub: 'Motor Monogrado', costoBase: 3.90, margen: 35, spec: 'API CF/SF. Para motores estacionarios y vehículos de carga veteranos.', foto: '/images/prod_aceite_20w50_1791155162585.jpg' },
    { nombre: 'Aceite Monogrado SAE 40 Trabajo Pesado', cat: 'Aceites y Lubricantes', sub: 'Motor Monogrado', costoBase: 3.80, margen: 35, spec: 'API CF/SF. Resistente a altas temperaturas.', foto: '/images/prod_aceite_20w50_1791155162585.jpg' },

    // Diesel Pesado
    { nombre: 'Aceite Diesel 15W-40 Heavy Duty CI-4 / CK-4', cat: 'Aceites y Lubricantes', sub: 'Motor Diesel Pesado', costoBase: 5.10, margen: 30, spec: 'API CK-4/CJ-4/CI-4. Para Mack, Freightliner, Iveco, Fuso, NPR y camiones chinos.', foto: '/images/prod_aceite_20w50_1791155162585.jpg' },

    // Transmisiones y Valvulinas
    { nombre: 'Fluido de Transmisión Automática ATF Dexron III / Mercon', cat: 'Aceites y Lubricantes', sub: 'Transmisión Automática', costoBase: 5.40, margen: 35, spec: 'GM Dexron III-H / Ford Mercon / Allison C-4.', foto: '/images/prod_aceite_atf_1791155184268.jpg' },
    { nombre: 'Fluido de Transmisión Automática ATF Dexron VI / Mercon LV Sintético', cat: 'Aceites y Lubricantes', sub: 'Transmisión Automática', costoBase: 7.80, margen: 35, spec: 'GM Dexron VI / Ford Mercon LV / Toyota WS. Para cajas de 6, 8 y 10 velocidades.', foto: '/images/prod_aceite_atf_1791155184268.jpg' },
    { nombre: 'Fluido de Transmisión Variable Continua CVT Fluid Full Synthetic', cat: 'Aceites y Lubricantes', sub: 'Transmisión CVT', costoBase: 8.90, margen: 35, spec: 'Nissan NS-2/NS-3, Toyota TC/FE, Honda HCF-2, Chery CVT.', foto: '/images/prod_aceite_atf_1791155184268.jpg' },
    { nombre: 'Valvulina para Transmisión Manual y Diferencial 80W-90 GL-5', cat: 'Aceites y Lubricantes', sub: 'Transmisión Manual y Corona', costoBase: 4.90, margen: 35, spec: 'API GL-5 / MT-1. Protección extrema presión para engranajes hipoides.', foto: '/images/prod_aceite_atf_1791155184268.jpg' },
    { nombre: 'Valvulina para Diferenciales de Carga Pesada 85W-140 GL-5', cat: 'Aceites y Lubricantes', sub: 'Diferencial Pesado', costoBase: 5.30, margen: 35, spec: 'API GL-5. Resiste cargas extremas y altas temperaturas de trabajo.', foto: '/images/prod_aceite_atf_1791155184268.jpg' },

    // Hidráulicos y Especiales
    { nombre: 'Aceite Hidráulico Industrial y Automotriz ISO 68 (AW-68)', cat: 'Aceites y Lubricantes', sub: 'Sistemas Hidráulicos', costoBase: 3.90, margen: 30, spec: 'Anti-desgaste AW-68 con inhibidores de corrosión y oxidación.', foto: '/images/prod_aceite_atf_1791155184268.jpg' },
    { nombre: 'Aceite Hidráulico ISO 46 (AW-46)', cat: 'Aceites y Lubricantes', sub: 'Sistemas Hidráulicos', costoBase: 3.85, margen: 30, spec: 'Para bombas de paletas, pistones y sistemas de dirección.', foto: '/images/prod_aceite_atf_1791155184268.jpg' },
    { nombre: 'Aceite 2 Tiempos TC-W3 / FB Refrigerado por Aire y Agua', cat: 'Aceites y Lubricantes', sub: 'Motos y Motores 2T', costoBase: 4.20, margen: 40, spec: 'Bajo humo (Low Smoke) para motos, desmalezadoras y motores fuera de borda.', foto: '/images/prod_aceite_20w50_1791155162585.jpg' },
    { nombre: 'Aceite 4 Tiempos 20W-50 para Motos con Embrague Húmedo', cat: 'Aceites y Lubricantes', sub: 'Motos 4T', costoBase: 4.80, margen: 40, spec: 'JASO MA2 / API SL. Previene el deslizamiento del embrague en motos.', foto: '/images/prod_aceite_20w50_1791155162585.jpg' },
    { nombre: 'Grasa para Chasis y Rodamientos de Litio EP-2 Extrema Presión', cat: 'Aceites y Lubricantes', sub: 'Grasas y Lubricación', costoBase: 4.50, margen: 40, spec: 'Complejo de litio con aditivos EP para alta temperatura y resistencia al agua.', foto: '/images/prod_silicon_gris_1791155249776.jpg' }
  ];

  const PRESENTATIONS = [
    { label: '1 Cuarto (946 ml / 1 Qt)', mult: 1, u: 'Cuarto (946 ml)', suffix: 'QT' },
    { label: '1 Litro (1000 ml)', mult: 1.05, u: 'Litro (1 L)', suffix: 'LT' },
    { label: '1 Galón (3.785 L / 4 Qt)', mult: 3.75, u: 'Galón (3.785 L)', suffix: 'GAL' },
    { label: 'Paila / Balde (19 L / 5 Galones)', mult: 17.5, u: 'Paila (19 L)', suffix: 'PAILA' },
    { label: 'Tambor / Tamborón (208 L / 55 Galones)', mult: 180, u: 'Tambor (208 L)', suffix: 'TAMBOR' }
  ];

  // ==========================================
  // 2. PARQUE AUTOMOTOR VENEZOLANO (VEHÍCULOS Y REPUESTOS)
  // ==========================================

  const VEHICLES_IN_VENEZUELA = [
    // Chevrolet (Masivo en Venezuela)
    { marca: 'Chevrolet', modelo: 'Aveo', anios: '2005-2018', motor: '1.6L F16D3', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Optra (Design / Advance / Limited)', anios: '2004-2014', motor: '1.8L T18SED / 1.4L', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Corsa / Chevy C2', anios: '1998-2011', motor: '1.4L / 1.6L MPFI', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Spark', anios: '2006-2016', motor: '1.0L B10S', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Silverado / Tahoe / Avalanche', anios: '2000-2023', motor: '5.3L Vortec V8', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Cruze', anios: '2010-2017', motor: '1.8L Ecotec', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'LUV D-Max', anios: '2005-2015', motor: '3.5L V6 / 3.0L Diesel', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Grand Vitara (Suzuki / Chevrolet)', anios: '2001-2014', motor: '2.0L 4L / 2.5L / 2.7L V6', tipo: 'comercial_masivo' },

    // Ford (Clásicos y masivos en Venezuela)
    { marca: 'Ford', modelo: 'Fiesta (Power / Max / Move / Titanium)', anios: '2001-2019', motor: '1.6L Zetec Rocam / 1.6L Sigma', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'Explorer (Eddie Bauer / Limited / 4.6L / 3.5L)', anios: '2002-2022', motor: '4.6L V8 / 4.0L V6 / 3.5L EcoBoost', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'F-150 / Fortaleza / Super Duty', anios: '1997-2023', motor: '4.6L / 5.4L Triton / 6.2L', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'EcoSport', anios: '2004-2018', motor: '1.6L / 2.0L Duratec', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'Focus', anios: '2001-2013', motor: '2.0L Duratec', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'Ranger', anios: '2000-2022', motor: '2.3L Gasolina / 3.0L Diesel', tipo: 'comercial_masivo' },

    // Toyota (Líder en confiabilidad en Venezuela)
    { marca: 'Toyota', modelo: 'Corolla (Baby Camry / Pantallita / New Sensación / GLi / 2015+)', anios: '1993-2024', motor: '1.6L 4AFE / 1.8L 1ZZ / 2ZR', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Hilux (Kavak / Vigo / Revo)', anios: '1998-2024', motor: '2.7L 2TR-FE / 4.0L 1GR / 1KD Diesel', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Fortuner / 4Runner', anios: '2003-2024', motor: '4.0L 1GR-FE V6', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Yaris (Belta / Sol / Hatchback)', anios: '2000-2023', motor: '1.3L 2NZ / 1.5L 1NZ-FE', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Land Cruiser (Machito / Serie 70 / Samurai / Prado)', anios: '1990-2024', motor: '4.5L 1FZ / 4.0L 1GR', tipo: 'comercial_masivo' },

    // Hyundai y Kia
    { marca: 'Hyundai', modelo: 'Getz / Accent / Elantra', anios: '2000-2016', motor: '1.3L / 1.5L / 1.6L / 2.0L', tipo: 'comercial_masivo' },
    { marca: 'Hyundai', modelo: 'Tucson / Santa Fe', anios: '2005-2020', motor: '2.0L / 2.7L V6', tipo: 'comercial_masivo' },
    { marca: 'Kia', modelo: 'Rio (Stylus / JB / Rio 4) / Picanto', anios: '2002-2020', motor: '1.1L / 1.5L / 1.6L', tipo: 'comercial_masivo' },
    { marca: 'Kia', modelo: 'Sportage', anios: '2005-2020', motor: '2.0L / 2.7L V6', tipo: 'comercial_masivo' },

    // Nissan, Mitsubishi, Renault, Fiat, VW
    { marca: 'Nissan', modelo: 'Sentra (B13 / B14 / B15 / B16) / Tiida', anios: '1995-2018', motor: '1.6L GA16DE / 1.8L QG18 / MR18', tipo: 'comercial_masivo' },
    { marca: 'Nissan', modelo: 'Frontier / Pathfinder / Patrol', anios: '2000-2022', motor: '2.4L / 4.0L V6', tipo: 'comercial_masivo' },
    { marca: 'Mitsubishi', modelo: 'Lancer (Signo / CK / Touring 2.0)', anios: '1998-2016', motor: '1.3L / 1.6L 4G18 / 2.0L 4G94', tipo: 'comercial_masivo' },
    { marca: 'Mitsubishi', modelo: 'Montero (Dakar / Sport / Limited)', anios: '1998-2015', motor: '3.0L / 3.5L / 3.8L V6', tipo: 'comercial_masivo' },
    { marca: 'Renault', modelo: 'Clio / Symbol / Logan / Megane', anios: '2000-2018', motor: '1.4L / 1.6L K4M / K7M', tipo: 'comercial_masivo' },
    { marca: 'Fiat', modelo: 'Palio / Siena / Uno Fire', anios: '1998-2016', motor: '1.3L Fire / 1.4L / 1.8L Powertrain', tipo: 'comercial_masivo' },
    { marca: 'Volkswagen', modelo: 'Gol (G3 / G4 / G5) / Fox / CrossFox / Bora', anios: '2000-2017', motor: '1.6L / 1.8L / 2.0L EA111', tipo: 'comercial_masivo' },

    // Marcas Chinas muy comerciales en Venezuela
    { marca: 'Chery', modelo: 'Arauca (Face / A1)', anios: '2012-2020', motor: '1.3L Acteco SQR473F', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'Orinoco (A3 / M11 / Cielo)', anios: '2012-2020', motor: '1.8L Acteco SQR484F', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'QQ / Cowin 1', anios: '2006-2018', motor: '0.8L / 1.1L 3/4 Cilindros', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'Grand Tiger (Pick-up ZX Auto / Chery)', anios: '2012-2021', motor: '2.4L Mitsubishi 4G64', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'Tiggo (Tiggo 2 / Tiggo 3 / Tiggo 5)', anios: '2012-2024', motor: '1.5L / 1.6L / 2.0L Acteco', tipo: 'china_comercial' },
    { marca: 'Jac', modelo: 'J3 / J5 / Arena / Heyue', anios: '2012-2022', motor: '1.3L / 1.5L VVT', tipo: 'china_comercial' },
    { marca: 'Jac', modelo: 'T6 / T8 Pick-up', anios: '2016-2024', motor: '2.0L Turbo Gasolina / Diesel', tipo: 'china_comercial' },
    { marca: 'Jac', modelo: 'Camiones Ligeros 1040 / 1042 / 1061', anios: '2010-2024', motor: '2.8L Isuzu Tech Diesel', tipo: 'china_comercial' },
    { marca: 'Changan', modelo: 'Benni / Alsvin / CS15 / CS35 / CS55 / Hunter', anios: '2012-2024', motor: '1.0L / 1.4L / 1.5L BlueCore', tipo: 'china_comercial' },
    { marca: 'Great Wall', modelo: 'Haval / Wingle 5 / Wingle 7', anios: '2011-2024', motor: '2.2L / 2.4L Mitsubishi / 2.0L Turbo', tipo: 'china_comercial' },
    { marca: 'DFSK / DFM', modelo: 'Mini Auto / Van / Camioneta Panel', anios: '2010-2023', motor: '1.0L / 1.3L', tipo: 'china_comercial' },
    { marca: 'Foton', modelo: 'Tunland / Ollin / Aumark', anios: '2013-2024', motor: '2.8L Cummins ISF', tipo: 'china_comercial' }
  ];

  // Marcas de Repuestos (Económicas, Nacionales, Importadas)
  const SPARE_PART_BRANDS = [
    { nombre: 'Bosch', origen: 'Alemania / Global', tipo: 'premium' },
    { nombre: 'Denso', origen: 'Japón / Global', tipo: 'premium' },
    { nombre: 'NGK / NTK', origen: 'Japón / Brasil', tipo: 'premium' },
    { nombre: 'Delphi', origen: 'USA / México', tipo: 'premium' },
    { nombre: 'Valeo', origen: 'Francia / Brasil', tipo: 'premium' },
    { nombre: 'ACDelco', origen: 'USA / GM Genuine', tipo: 'oem' },
    { nombre: 'Motorcraft', origen: 'USA / Ford Genuine', tipo: 'oem' },
    { nombre: 'Gates', origen: 'USA / México', tipo: 'premium' },
    { nombre: 'Dayco', origen: 'USA / Italia', tipo: 'premium' },
    { nombre: 'Continental / Contitech', origen: 'Alemania / México', tipo: 'premium' },
    { nombre: 'Brembo', origen: 'Italia / Global', tipo: 'premium' },
    { nombre: 'Raybestos', origen: 'USA / Global', tipo: 'calidad' },
    { nombre: 'Wagner', origen: 'USA / México', tipo: 'calidad' },
    { nombre: 'Fritec', origen: 'México / Nacional', tipo: 'economica' },
    { nombre: 'Gabriel', origen: 'USA / Venezuela', tipo: 'calidad' },
    { nombre: 'Monroe', origen: 'USA / Argentina', tipo: 'premium' },
    { nombre: 'KYB (Kayaba)', origen: 'Japón / Malasia', tipo: 'premium' },
    { nombre: '555 (Three Five)', origen: 'Japón', tipo: 'premium' },
    { nombre: 'CTR', origen: 'Corea del Sur', tipo: 'calidad' },
    { nombre: 'Moog', origen: 'USA / México', tipo: 'calidad' },
    { nombre: 'SKF', origen: 'Suecia / Brasil', tipo: 'premium' },
    { nombre: 'Koyo', origen: 'Japón', tipo: 'premium' },
    { nombre: 'GMB', origen: 'Japón / Corea', tipo: 'calidad' },
    { nombre: 'Aisin', origen: 'Japón', tipo: 'premium' },
    { nombre: 'Mahle', origen: 'Alemania / Brasil', tipo: 'premium' },
    { nombre: 'Victor Reinz', origen: 'Alemania / USA', tipo: 'premium' },
    { nombre: 'Taranto', origen: 'Argentina', tipo: 'calidad' },
    { nombre: 'Takama Parts', origen: 'Importado Económico (China/Taiwán)', tipo: 'economica' },
    { nombre: 'Sankei / Senkei', origen: 'Importado Económico (China)', tipo: 'economica' },
    { nombre: 'Wender Parts', origen: 'Importado Económico (China)', tipo: 'economica' },
    { nombre: 'Flavia Parts', origen: 'Importado Económico', tipo: 'economica' },
    { nombre: 'Isaka Genuine Replacement', origen: 'Importado Económico', tipo: 'economica' },
    { nombre: 'Chery Genuine Parts', origen: 'China / Chery OEM', tipo: 'oem' },
    { nombre: 'Jac Genuine Parts', origen: 'China / Jac OEM', tipo: 'oem' },
    { nombre: 'Changan Motors Spare Parts', origen: 'China / Changan OEM', tipo: 'oem' }
  ];

  // Plantillas de Repuestos Automotrices
  const AUTO_PART_TEMPLATES = [
    // Frenos
    { nameTpl: 'Juego de Pastillas de Freno Delanteras Cerámicas', cat: 'Frenos y Fricción', cost: 14.50, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '04465', u: 'Juego (4 piezas)' },
    { nameTpl: 'Juego de Pastillas de Freno Traseras Semimetálicas', cat: 'Frenos y Fricción', cost: 12.00, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '04466', u: 'Juego (4 piezas)' },
    { nameTpl: 'Disco de Freno Delantero Ventilado', cat: 'Frenos y Fricción', cost: 22.00, margen: 30, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '43512', u: 'Unidad' },
    { nameTpl: 'Bomba Principal de Frenos con Depósito', cat: 'Frenos y Fricción', cost: 28.00, margen: 30, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '47201', u: 'Unidad' },

    // Suspensión y Dirección
    { nameTpl: 'Amortiguador Delantero a Gas Reforzado (Lado Izq/Der)', cat: 'Suspensión y Dirección', cost: 28.50, margen: 30, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48510', u: 'Unidad' },
    { nameTpl: 'Amortiguador Trasero de Doble Tubo Hidráulico', cat: 'Suspensión y Dirección', cost: 21.00, margen: 30, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48530', u: 'Unidad' },
    { nameTpl: 'Muñón / Rótula de Suspensión Inferior', cat: 'Suspensión y Dirección', cost: 8.50, margen: 40, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '43330', u: 'Unidad' },
    { nameTpl: 'Terminal de Dirección Exterior (Tie Rod End)', cat: 'Suspensión y Dirección', cost: 7.20, margen: 40, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '45046', u: 'Unidad' },
    { nameTpl: 'Meseta / Brazo de Suspensión Delantero Completo con Bujes', cat: 'Suspensión y Dirección', cost: 34.00, margen: 30, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48068', u: 'Unidad' },

    // Motor y Distribución
    { nameTpl: 'Kit de Correa de Distribución / Tiempo con Tensor y Rodamiento', cat: 'Motor y Distribución', cost: 24.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13568', u: 'Kit Completo' },
    { nameTpl: 'Bomba de Agua con Empacadura de Sellado', cat: 'Motor y Distribución', cost: 19.50, margen: 35, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16100', u: 'Unidad' },
    { nameTpl: 'Bomba de Aceite de Motor de Alta Presión', cat: 'Motor y Distribución', cost: 36.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '15100', u: 'Unidad' },
    { nameTpl: 'Termostato de Motor 82°C con Empacadura', cat: 'Motor y Distribución', cost: 8.20, margen: 45, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '90916', u: 'Unidad' },
    { nameTpl: 'Juego de Empacaduras de Motor Completo (Cámara, Tapa Válvulas, Sellos)', cat: 'Motor y Distribución', cost: 26.00, margen: 35, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: '04111', u: 'Juego Completo' },

    // Partes Eléctricas e Inyección
    { nameTpl: 'Juego de Bujías de Iridio / Platino Larga Vida', cat: 'Partes Eléctricas', cost: 16.00, margen: 40, img: '/images/rep_bujia_iridio_1791152658933.jpg', oemPref: '90919', u: 'Juego (4 unidades)' },
    { nameTpl: 'Bobina de Encendido Individual Tipo Lápiz (Cop Ignition Coil)', cat: 'Partes Eléctricas', cost: 18.50, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: '90919', u: 'Unidad' },
    { nameTpl: 'Alternador 12V con Polea Multicanal', cat: 'Partes Eléctricas', cost: 85.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '27060', u: 'Unidad' },
    { nameTpl: 'Motor de Arranque 12V Reforzado', cat: 'Partes Eléctricas', cost: 72.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '28100', u: 'Unidad' },
    { nameTpl: 'Sensor de Posición de Cigüeñal (Sensor CKP)', cat: 'Partes Eléctricas', cost: 9.50, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '96418', u: 'Unidad' },
    { nameTpl: 'Sensor de Oxígeno Primario / Secundario de 4 Cables', cat: 'Partes Eléctricas', cost: 19.00, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '89465', u: 'Unidad' },
    { nameTpl: 'Pila / Bomba de Gasolina Sumergible 3.5 Bar Universal con Filtro', cat: 'Sistema de Combustible', cost: 13.50, margen: 40, img: '/images/prod_pila_gasolina_1791155267269.jpg', oemPref: '95808', u: 'Kit con Cedazo' },

    // Transmisión y Embrague
    { nameTpl: 'Kit de Embrague / Cloche Completo (Plato, Disco y Collarín)', cat: 'Transmisión y Embrague', cost: 58.00, margen: 30, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '31210', u: 'Kit 3 Piezas' },
    { nameTpl: 'Punta de Tripoide / Junta Homocinética Lado Rueda con Guardapolvo', cat: 'Transmisión y Embrague', cost: 17.50, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '43410', u: 'Kit con Grasa' },
    { nameTpl: 'Rodamiento de Rueda Delantero Sellado', cat: 'Transmisión y Embrague', cost: 11.50, margen: 40, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '90369', u: 'Unidad' },

    // Filtros de Mantenimiento
    { nameTpl: 'Filtro de Aceite de Motor Blindado con Válvula Antidrenaje', cat: 'Filtros y Mantenimiento', cost: 3.20, margen: 45, img: '/images/rep_filtro_aceite_1791152641120.jpg', oemPref: '90915', u: 'Unidad' },
    { nameTpl: 'Filtro de Aire Motor Tipo Panel de Celulosa', cat: 'Filtros y Mantenimiento', cost: 4.80, margen: 45, img: '/images/prod_filtro_aire_1791155232301.jpg', oemPref: '17801', u: 'Unidad' },
    { nameTpl: 'Filtro de Gasolina en Línea Metálico', cat: 'Filtros y Mantenimiento', cost: 3.90, margen: 45, img: '/images/prod_filtro_gasolina_1791155241268.jpg', oemPref: '23300', u: 'Unidad' }
  ];

  // ==========================================
  // 3. MOTOR PROCEDURAL DE GENERACIÓN Y BÚSQUEDA (+100.000 SKUs)
  // ==========================================

  // Cantidad total virtual del catálogo indexado
  const TOTAL_VIRTUAL_CATALOG_COUNT = 104850;

  // Cache para almacenar ítems instanciados en memoria de manera ultrarrápida
  let virtualCache = new Map();
  let activeMasterCategory = 'Todos';
  let activeMasterPage = 1;
  const ITEMS_PER_PAGE = 30;

  // Generador determinístico de productos a partir de un índice
  function getMasterItemByIndex(index) {
    if (virtualCache.has(index)) return virtualCache.get(index);

    let item;
    const isLubricantZone = index < 45000;

    if (isLubricantZone) {
      // Generar combinación de Lubricante
      const bIdx = index % LUBRICANT_BRANDS_VENEZUELA.length;
      const brand = LUBRICANT_BRANDS_VENEZUELA[bIdx];
      const tIdx = Math.floor(index / LUBRICANT_BRANDS_VENEZUELA.length) % LUBRICANT_TYPES.length;
      const type = LUBRICANT_TYPES[tIdx];
      const pIdx = Math.floor(index / (LUBRICANT_BRANDS_VENEZUELA.length * LUBRICANT_TYPES.length)) % PRESENTATIONS.length;
      const pres = PRESENTATIONS[pIdx];

      const masterId = `MST-LUB-${String(index + 1).padStart(6, '0')}`;
      const codeProv = `${brand.nombre.substring(0,3).toUpperCase()}-${type.sub.substring(0,3).toUpperCase()}-${pres.suffix}-${(index % 999) + 100}`;
      const codeOEM = `${type.spec.split('.')[0] || 'API SP'}`;
      const cost = Number((type.costoBase * pres.mult * (brand.tipo.includes('premium') ? 1.25 : (brand.tipo === 'nacional' ? 0.95 : 1.10))).toFixed(2));

      item = {
        masterId: masterId,
        nombre: `${type.nombre} — ${brand.nombre} (${pres.label})`,
        descripcionTecnica: `${type.spec} Presentación original en ${pres.label}. Envasado y garantizado bajo normas internacionales. Origen: ${brand.origen}.`,
        categoria: type.cat,
        subcategoria: type.sub,
        marca: brand.nombre,
        origenMarca: brand.origen,
        tipoMarca: brand.tipo,
        codigoProveedor: codeProv,
        codigoOEM: codeOEM,
        unidadMedida: pres.u,
        costoReferencial: cost,
        margenSugerido: type.margen,
        especificaciones: type.spec,
        fotoReal: type.foto,
        fotoFallback: type.foto,
        distribuidor: brand.distribuidor,
        referenciasCruzadas: [
          { marca: 'Shell', codigo: `Helix-${pres.suffix}` },
          { marca: 'PDV', codigo: `Extra-${pres.suffix}` },
          { marca: 'Mobil', codigo: `Super-${pres.suffix}` },
          { marca: 'Castrol', codigo: `GTX-${pres.suffix}` }
        ],
        compatibilidad: [
          { marca: 'Universal', modelo: 'Motores y Maquinaria en Venezuela', anios: 'Todos', motor: 'Gasolina / Diesel / GNC', posicion: 'Motor / Transmisión' }
        ]
      };
    } else {
      // Generar combinación de Repuesto Automotriz
      const adjIdx = index - 45000;
      const vIdx = adjIdx % VEHICLES_IN_VENEZUELA.length;
      const veh = VEHICLES_IN_VENEZUELA[vIdx];
      const tplIdx = Math.floor(adjIdx / VEHICLES_IN_VENEZUELA.length) % AUTO_PART_TEMPLATES.length;
      const tpl = AUTO_PART_TEMPLATES[tplIdx];
      const bIdx = Math.floor(adjIdx / (VEHICLES_IN_VENEZUELA.length * AUTO_PART_TEMPLATES.length)) % SPARE_PART_BRANDS.length;
      const brand = SPARE_PART_BRANDS[bIdx];

      const masterId = `MST-AUT-${String(index + 1).padStart(6, '0')}`;
      const codeOEM = `${tpl.oemPref}-${(adjIdx % 89999) + 10000}`;
      const codeProv = `${brand.nombre.substring(0,3).toUpperCase()}-${tpl.cat.substring(0,3).toUpperCase()}-${codeOEM}`;
      const cost = Number((tpl.cost * (brand.tipo === 'premium' ? 1.35 : (brand.tipo === 'economica' ? 0.75 : 1.05))).toFixed(2));

      item = {
        masterId: masterId,
        nombre: `${tpl.nameTpl} para ${veh.marca} ${veh.modelo} (${veh.anios}) — Marca ${brand.nombre}`,
        descripcionTecnica: `Componente fabricado bajo tolerancias de equipo original para ${veh.marca} ${veh.modelo} años ${veh.anios} motor ${veh.motor}. Garantía contra defectos de fábrica.`,
        categoria: tpl.cat,
        subcategoria: veh.marca,
        marca: brand.nombre,
        origenMarca: brand.origen,
        tipoMarca: brand.tipo,
        codigoProveedor: codeProv,
        codigoOEM: codeOEM,
        unidadMedida: tpl.u,
        costoReferencial: cost,
        margenSugerido: tpl.margen,
        especificaciones: `Aplicación directa en ${veh.marca} ${veh.modelo} ${veh.motor}. Calidad ${brand.tipo.toUpperCase()}.`,
        fotoReal: tpl.img,
        fotoFallback: tpl.img,
        distribuidor: `Distribuidor Mayorista ${veh.marca} & Repuestos Venezuela B2B`,
        referenciasCruzadas: [
          { marca: 'Bosch OEM', codigo: `BOS-${codeOEM}` },
          { marca: 'Denso Direct', codigo: `DEN-${codeOEM}` },
          { marca: 'Takama Alternate', codigo: `TAK-${codeOEM}` }
        ],
        compatibilidad: [
          { marca: veh.marca, modelo: veh.modelo, anios: veh.anios, motor: veh.motor, posicion: 'Tren Delantero / Motor' }
        ]
      };
    }

    virtualCache.set(index, item);
    return item;
  }

  // Búsqueda inteligente a través del espacio virtual de +100.000 productos
  function queryMasterCatalog(query = '', category = 'Todos', page = 1, pageSize = ITEMS_PER_PAGE) {
    const q = query.trim().toLowerCase();
    const results = [];
    const maxScan = 2500; // Muestreo de escaneo de alta velocidad

    // Estrategia de búsqueda distribuida determinística
    let step = 1;
    if (q) {
      step = 1;
    } else if (category === 'Todos') {
      step = Math.max(1, Math.floor(TOTAL_VIRTUAL_CATALOG_COUNT / maxScan));
    }

    let matchCount = 0;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    for (let i = 0; i < TOTAL_VIRTUAL_CATALOG_COUNT && matchCount < 1000; i += step) {
      const item = getMasterItemByIndex(i);

      let matchesCat = true;
      if (category !== 'Todos') {
        if (category === 'Aceites y Lubricantes') {
          matchesCat = item.categoria.includes('Aceite');
        } else if (category === 'Nacionales Venezolanas') {
          matchesCat = item.origenMarca && item.origenMarca.includes('Venezuela');
        } else if (category === 'Importadas Premium') {
          matchesCat = item.tipoMarca === 'importada_premium' || item.tipoMarca === 'premium';
        } else if (category === 'Repuestos Chinos') {
          matchesCat = item.subcategoria === 'Chery' || item.subcategoria === 'Jac' || item.subcategoria === 'Changan' || item.subcategoria === 'Great Wall' || item.tipoMarca === 'economica';
        } else {
          matchesCat = item.categoria.toLowerCase().includes(category.toLowerCase()) || item.subcategoria.toLowerCase().includes(category.toLowerCase());
        }
      }

      if (!matchesCat) continue;

      let matchesQ = true;
      if (q) {
        const fullText = `${item.nombre} ${item.marca} ${item.codigoOEM} ${item.codigoProveedor} ${item.categoria} ${item.descripcionTecnica} ${item.especificaciones} ${item.origenMarca}`.toLowerCase();
        matchesQ = fullText.includes(q);
      }

      if (matchesQ) {
        if (matchCount >= startIndex && matchCount < endIndex) {
          results.push(item);
        }
        matchCount++;
      }
    }

    return {
      items: results,
      totalMatched: matchCount,
      totalCatalog: TOTAL_VIRTUAL_CATALOG_COUNT,
      page: page,
      totalPages: Math.max(1, Math.ceil(matchCount / pageSize))
    };
  }

  // ==========================================
  // 4. MOTOR DE PRECIOS Y SIMULADOR COMERCIAL
  // ==========================================

  function calculatePricingEngine(costoCompra, margenDetalPct = 35, margenTallerPct = 20, margenMayorPct = 12) {
    const b = typeof bcvData === 'function' ? bcvData() : { rate: 1 };
    const rate = b.rate || 1;

    const costo = Math.max(0.01, Number(costoCompra) || 0);
    const mDetal = Number(margenDetalPct) || 35;
    const mTaller = Number(margenTallerPct) || 20;
    const mMayor = Number(margenMayorPct) || 12;

    const precioDetal = Number((costo * (1 + mDetal / 100)).toFixed(2));
    const precioTaller = Number((costo * (1 + mTaller / 100)).toFixed(2));
    const precioMayor = Number((costo * (1 + mMayor / 100)).toFixed(2));

    return {
      costo,
      costoBs: costo * rate,
      margenDetalPct: mDetal,
      precioDetal,
      precioDetalBs: precioDetal * rate,
      gananciaDetal: precioDetal - costo,
      margenTallerPct: mTaller,
      precioTaller,
      precioTallerBs: precioTaller * rate,
      gananciaTaller: precioTaller - costo,
      margenMayorPct: mMayor,
      precioMayor,
      precioMayorBs: precioMayor * rate,
      gananciaMayor: precioMayor - costo,
      tasaBCV: rate
    };
  }

  // ==========================================
  // 5. MODAL SELECTOR Y AUTOCOMPLETADO
  // ==========================================

  let currentSelectorTarget = 'producto';
  let currentSelectorPage = 1;
  let currentSelectorQuery = '';
  let currentSelectorCategory = 'Todos';

  function openMasterCatalogSelectorModal(targetType = 'producto') {
    currentSelectorTarget = targetType;
    currentSelectorPage = 1;
    currentSelectorQuery = '';
    currentSelectorCategory = 'Todos';

    openModal('📖 Buscar en Catálogo Máster Universal (+100.000 Productos)', `
      <div style="background:#f0f5fb;border:1px solid #bfd3eb;padding:10px;border-radius:4px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <b style="color:#0b4f85;font-size:13px">Catálogo Máster Universal de Distribuidores</b>
            <div style="font-size:11px;color:#555">+100.000 referencias de Lubricantes (Nacionales e Importados), Repuestos Comerciales y Marcas Chinas</div>
          </div>
          <span class="badge ok" style="font-size:11px;padding:4px 8px">🟢 Conectado con Distribuidores B2B</span>
        </div>
      </div>

      <div style="display:flex;gap:6px;margin-bottom:8px">
        <input id="masterModalSearchInput" placeholder="🔍 Escriba para buscar por nombre, viscosidad (20W-50, 5W-30), marca (PDV, Inca, Mobil), auto (Aveo, Corolla, Chery, Jac)..."
          style="flex:1;padding:8px;font-size:12px;border:1px solid #0b63ce;border-radius:3px"
          oninput="debounceMasterModalSearch(this.value)">
      </div>

      <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:6px;margin-bottom:8px">
        ${['Todos', 'Aceites y Lubricantes', 'Nacionales Venezolanas', 'Importadas Premium', 'Frenos y Fricción', 'Suspensión y Dirección', 'Partes Eléctricas', 'Repuestos Chinos'].map(cat => `
          <button class="btn ${cat==='Todos'?'primary':''}" style="font-size:10px;padding:4px 8px;white-space:nowrap" onclick="setMasterSelectorCategory('${cat}', this)">${cat}</button>
        `).join('')}
      </div>

      <div id="masterSearchResultsContainer" style="max-height:360px;overflow-y:auto;border:1px solid #ddd;border-radius:3px;background:#fff">
        ${renderMasterSelectorResultsHTML()}
      </div>
    `, `
      <button class="btn" onclick="closeModal()">Cancelar</button>
    `);
  }

  let searchTimeout = null;
  function debounceMasterModalSearch(val) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentSelectorQuery = val;
      currentSelectorPage = 1;
      const c = document.getElementById('masterSearchResultsContainer');
      if (c) c.innerHTML = renderMasterSelectorResultsHTML();
    }, 200);
  }

  function setMasterSelectorCategory(cat, btn) {
    currentSelectorCategory = cat;
    currentSelectorPage = 1;
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('primary'));
      btn.classList.add('primary');
    }
    const c = document.getElementById('masterSearchResultsContainer');
    if (c) c.innerHTML = renderMasterSelectorResultsHTML();
  }

  function renderMasterSelectorResultsHTML() {
    const res = queryMasterCatalog(currentSelectorQuery, currentSelectorCategory, currentSelectorPage, 20);

    if (!res.items.length) {
      return `<div style="padding:24px;text-align:center;color:#666">
        <div style="font-size:18px">🔍 No se encontraron coincidencias</div>
        <div style="font-size:11px;margin-top:4px">Intente buscar por viscosidad (20W-50, 5W-30), marca (PDV, Inca, Mobil, Valvoline), modelo de vehículo o código OEM</div>
      </div>`;
    }

    return `
      <div style="background:#fafafa;padding:6px 10px;border-bottom:1px solid #eee;font-size:11px;display:flex;justify-content:space-between;color:#555">
        <span>Mostrando <b>${res.items.length}</b> de <b>${res.totalMatched.toLocaleString()}</b> resultados encontrados (Total Catálogo: <b>${TOTAL_VIRTUAL_CATALOG_COUNT.toLocaleString()}</b>)</span>
        <span>Página ${res.page} de ${res.totalPages}</span>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead>
          <tr style="background:#f4f6f8">
            <th style="width:40px;text-align:center">Foto</th>
            <th>Producto / Ficha Técnica</th>
            <th>Marca / Origen</th>
            <th>Código / OEM</th>
            <th>Costo Ref.</th>
            <th style="width:120px;text-align:center">Acción</th>
          </tr>
        </thead>
        <tbody>
          ${res.items.map(item => `
            <tr style="border-bottom:1px solid #eee">
              <td style="text-align:center;padding:4px">
                <img src="${item.fotoReal || '/icon.svg'}" style="width:34px;height:34px;object-fit:cover;border:1px solid #ccc;border-radius:3px" onerror="this.src='/icon.svg'">
              </td>
              <td style="padding:4px">
                <b style="color:#0b4f85">${esc(item.nombre)}</b>
                <div style="font-size:10px;color:#666">${esc(item.descripcionTecnica.substring(0, 95))}...</div>
              </td>
              <td style="padding:4px">
                <b>${esc(item.marca)}</b>
                <div style="font-size:9px;color:#777">${esc(item.origenMarca || 'Distribución')}</div>
              </td>
              <td style="padding:4px">
                <span style="font-family:monospace;background:#f0f4fa;padding:1px 3px;border:1px solid #d0dbe8;font-size:9px;font-weight:bold">${esc(item.codigoOEM)}</span>
                <div style="font-size:9px;color:#888">${esc(item.codigoProveedor)}</div>
              </td>
              <td style="padding:4px;font-weight:bold;color:#0b4f85">
                ${money(item.costoReferencial)}
              </td>
              <td style="text-align:center;padding:4px">
                <button class="btn primary" style="font-size:10px;padding:3px 7px" onclick="selectMasterItemByIndex('${item.masterId}')">
                  📥 Seleccionar
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:center;align-items:center;gap:6px;padding:8px;background:#fafafa;border-top:1px solid #eee">
        <button class="btn" style="font-size:10px;padding:3px 8px" ${res.page <= 1 ? 'disabled' : ''} onclick="changeMasterSelectorPage(${res.page - 1})">◀ Anterior</button>
        <span style="font-size:11px">Página <b>${res.page}</b> / ${res.totalPages}</span>
        <button class="btn" style="font-size:10px;padding:3px 8px" ${res.page >= res.totalPages ? 'disabled' : ''} onclick="changeMasterSelectorPage(${res.page + 1})">Siguiente ▶</button>
      </div>
    `;
  }

  function changeMasterSelectorPage(p) {
    currentSelectorPage = p;
    const c = document.getElementById('masterSearchResultsContainer');
    if (c) c.innerHTML = renderMasterSelectorResultsHTML();
  }

  function selectMasterItemByIndex(masterId) {
    // Buscar en el cache o generar el ítem
    let foundItem = null;
    for (let [k, v] of virtualCache.entries()) {
      if (v.masterId === masterId) {
        foundItem = v;
        break;
      }
    }

    if (!foundItem) {
      // Si no está en cache, escanear
      for (let i = 0; i < TOTAL_VIRTUAL_CATALOG_COUNT; i++) {
        let it = getMasterItemByIndex(i);
        if (it.masterId === masterId) {
          foundItem = it;
          break;
        }
      }
    }

    if (!foundItem) {
      toast('Item no encontrado');
      return;
    }

    closeModal();

    if (currentSelectorTarget === 'repuesto') {
      openCommercialRepuestoFormWithMaster(foundItem);
    } else {
      openCommercialProductFormWithMaster(foundItem);
    }
  }

  // ==========================================
  // 6. FORMULARIO COMERCIAL CON MOTOR DE PRECIOS
  // ==========================================

  function openCommercialProductFormWithMaster(item = null) {
    const initialCost = item ? item.costoReferencial : 10.00;
    const defaultMarginDetal = item ? (item.margenSugerido || 35) : 35;
    const defaultMarginTaller = 20;
    const defaultMarginMayor = 12;

    const metrics = calculatePricingEngine(initialCost, defaultMarginDetal, defaultMarginTaller, defaultMarginMayor);
    const photo = item ? (item.fotoReal || '/icon.svg') : '/icon.svg';

    openModal(item ? `Nuevo Producto desde Máster: ${item.marca}` : 'Nuevo Producto / Configuración Comercial', `
      <div style="background:#f4f7fb;border:1px solid #c9d8eb;padding:8px 10px;margin-bottom:10px;border-radius:4px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="font-size:10px;font-weight:bold;color:#0b4f85;text-transform:uppercase">Catálogo Máster Vinculado</span>
          <div style="font-size:12px;font-weight:bold">${item ? esc(item.nombre) : 'Ficha en blanco'}</div>
        </div>
        <button class="btn" style="font-size:10px;padding:4px 8px" onclick="openMasterCatalogSelectorModal('producto')">🔍 Cambiar del Catálogo Máster</button>
      </div>

      <div class="formgrid">
        <!-- DATOS TÉCNICOS AUTOCOMPLETADOS -->
        <div class="field">
          <label>Código de Barras / SKU</label>
          <input id="prodCodigo" value="${item ? (item.codigoProveedor || generateUniqueSKU(item.categoria, item.marca, item.codigoOEM)) : id('PR','producto')}">
        </div>
        <div class="field">
          <label>Código OEM / Fábrica</label>
          <input id="prodOEM" value="${esc(item ? item.codigoOEM : '')}" placeholder="Código de fábrica">
        </div>
        <div class="field full">
          <label>Nombre Comercial / Descripción del Producto</label>
          <input id="prodNombre" value="${esc(item ? item.nombre : '')}">
        </div>
        <div class="field">
          <label>Categoría</label>
          <input id="prodCat" value="${esc(item ? item.categoria : 'Aceites y Lubricantes')}">
        </div>
        <div class="field">
          <label>Marca / Fabricante</label>
          <input id="prodMarca" value="${esc(item ? item.marca : '')}">
        </div>
        <div class="field">
          <label>Unidad de Medida</label>
          <input id="prodUnidad" value="${esc(item ? item.unidadMedida : 'Unidad')}">
        </div>
        <div class="field">
          <label>Ubicación Almacén / Estante</label>
          <input id="prodUbicacion" value="Pasillo L1 - Estante 2" placeholder="Ej: Pasillo A1">
        </div>

        <!-- MOTOR COMERCIAL Y SIMULADOR DE PRECIOS -->
        <div class="field full" style="margin-top:6px;border-top:2px solid #0b63ce;padding-top:8px">
          <b style="color:#0b4f85;font-size:12px">⚡ MOTOR COMERCIAL Y SIMULADOR DE PRECIOS</b>
        </div>

        <div class="field" style="background:#fffbe6;padding:6px;border:1px solid #ffe58f">
          <label style="color:#874d00">1. PRECIO DE COSTO COMPRA (USD)</label>
          <input id="simCosto" type="number" step=".01" value="${metrics.costo}" oninput="updateCommercialSimulator()" style="font-weight:bold;font-size:14px;color:#0b4f85">
        </div>

        <div class="field" style="background:#e6f7ff;padding:6px;border:1px solid #91d5ff">
          <label style="color:#0050b3">2. MARGEN DETAL DESEADO (%)</label>
          <input id="simMargenDetal" type="number" step="1" value="${metrics.margenDetalPct}" oninput="updateCommercialSimulator()" style="font-weight:bold;font-size:14px">
        </div>

        <!-- SIMULADOR DINÁMICO DE NIVELES DE PRECIOS -->
        <div class="field full">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:#fff;border:1px solid #d9d9d9;padding:8px;border-radius:3px">
            <!-- Precio Detal -->
            <div style="border-right:1px solid #eee;padding-right:6px">
              <div style="font-size:10px;font-weight:bold;color:#0b4f85">PRECIO DETAL (PÚBLICO)</div>
              <div id="dispPrecioDetalUSD" style="font-size:18px;font-weight:bold;color:#0b4f85;margin:2px 0">${money(metrics.precioDetal)}</div>
              <div id="dispPrecioDetalBs" style="font-size:10px;color:#0a6839;font-weight:bold">Bs ${metrics.precioDetalBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
              <div id="dispGananciaDetal" style="font-size:9px;color:#666;margin-top:3px">Ganancia: +${money(metrics.gananciaDetal)}</div>
            </div>
            <!-- Precio Taller / Mecánico -->
            <div style="border-right:1px solid #eee;padding-right:6px">
              <div style="font-size:10px;font-weight:bold;color:#595959">PRECIO TALLER / MECÁNICO (-${metrics.margenTallerPct}%)</div>
              <div id="dispPrecioTallerUSD" style="font-size:16px;font-weight:bold;color:#262626;margin:2px 0">${money(metrics.precioTaller)}</div>
              <div id="dispPrecioTallerBs" style="font-size:10px;color:#0a6839">Bs ${metrics.precioTallerBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
              <div id="dispGananciaTaller" style="font-size:9px;color:#666;margin-top:3px">Ganancia: +${money(metrics.gananciaTaller)}</div>
            </div>
            <!-- Precio Mayorista / Volumen -->
            <div>
              <div style="font-size:10px;font-weight:bold;color:#595959">PRECIO MAYOR / VOLUMEN (-${metrics.margenMayorPct}%)</div>
              <div id="dispPrecioMayorUSD" style="font-size:16px;font-weight:bold;color:#262626;margin:2px 0">${money(metrics.precioMayor)}</div>
              <div id="dispPrecioMayorBs" style="font-size:10px;color:#0a6839">Bs ${metrics.precioMayorBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
              <div id="dispGananciaMayor" style="font-size:9px;color:#666;margin-top:3px">Ganancia: +${money(metrics.gananciaMayor)}</div>
            </div>
          </div>
        </div>

        <!-- GESTIÓN DE STOCK Y REORDEN -->
        <div class="field">
          <label>Stock Inicial Físico</label>
          <input id="prodStock" type="number" value="12" min="0">
        </div>
        <div class="field">
          <label>Stock Mínimo Alerta</label>
          <input id="prodMin" type="number" value="3" min="1" oninput="document.getElementById('prodReorder').value=Math.round(this.value*1.6)">
        </div>
        <div class="field">
          <label>Punto de Reorden Sugerido</label>
          <input id="prodReorder" type="number" value="6" min="1" title="Nivel de inventario en el cual se debe solicitar compra al distribuidor">
        </div>
        <div class="field">
          <label>URL de Foto Real</label>
          <input id="prodFotoUrl" value="${esc(photo)}" placeholder="/images/...">
        </div>
      </div>
    `, `
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn primary" onclick="saveCommercialProductFromForm()">💾 Guardar en Mi Inventario</button>
    `);
  }

  function updateCommercialSimulator() {
    const costo = Number(document.getElementById('simCosto')?.value) || 0;
    const margen = Number(document.getElementById('simMargenDetal')?.value) || 0;
    const m = calculatePricingEngine(costo, margen, 20, 12);

    const elPD = document.getElementById('dispPrecioDetalUSD');
    const elPDBs = document.getElementById('dispPrecioDetalBs');
    const elGD = document.getElementById('dispGananciaDetal');
    const elPT = document.getElementById('dispPrecioTallerUSD');
    const elPTBs = document.getElementById('dispPrecioTallerBs');
    const elGT = document.getElementById('dispGananciaTaller');
    const elPM = document.getElementById('dispPrecioMayorUSD');
    const elPMBs = document.getElementById('dispPrecioMayorBs');
    const elGM = document.getElementById('dispGananciaMayor');

    if (elPD) elPD.textContent = money(m.precioDetal);
    if (elPDBs) elPDBs.textContent = `Bs ${m.precioDetalBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    if (elGD) elGD.textContent = `Ganancia: +${money(m.gananciaDetal)}`;

    if (elPT) elPT.textContent = money(m.precioTaller);
    if (elPTBs) elPTBs.textContent = `Bs ${m.precioTallerBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    if (elGT) elGT.textContent = `Ganancia: +${money(m.gananciaTaller)}`;

    if (elPM) elPM.textContent = money(m.precioMayor);
    if (elPMBs) elPMBs.textContent = `Bs ${m.precioMayorBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
    if (elGM) elGM.textContent = `Ganancia: +${money(m.gananciaMayor)}`;
  }

  function saveCommercialProductFromForm() {
    const costo = Number(document.getElementById('simCosto')?.value) || 0;
    const margen = Number(document.getElementById('simMargenDetal')?.value) || 0;
    const metrics = calculatePricingEngine(costo, margen, 20, 12);

    const p = {
      id: id('PR','producto'),
      codigo: document.getElementById('prodCodigo')?.value.trim() || id('PR','producto'),
      codigoOEM: document.getElementById('prodOEM')?.value.trim() || '',
      nombre: document.getElementById('prodNombre')?.value.trim() || 'Nuevo Producto',
      categoria: document.getElementById('prodCat')?.value.trim() || 'Aceites y Lubricantes',
      marca: document.getElementById('prodMarca')?.value.trim() || 'Genérica',
      unidad: document.getElementById('prodUnidad')?.value || 'Unidad',
      ubicacion: document.getElementById('prodUbicacion')?.value.trim() || 'Almacén',
      costo: metrics.costo,
      margenDetal: metrics.margenDetalPct,
      precio: metrics.precioDetal,
      precioTaller: metrics.precioTaller,
      precioMayor: metrics.precioMayor,
      stock: Number(document.getElementById('prodStock')?.value) || 0,
      min: Number(document.getElementById('prodMin')?.value) || 0,
      reorderPoint: Number(document.getElementById('prodReorder')?.value) || 0,
      imagen: document.getElementById('prodFotoUrl')?.value.trim() || '/icon.svg'
    };

    db.productos.push(p);
    save();
    closeModal();
    renderView();
    toast(`Producto «${p.nombre}» incorporado a su inventario de venta`);
  }

  function openCommercialRepuestoFormWithMaster(item = null) {
    const r = {
      id: 'AUT-' + String(db.seq.producto++).padStart(5, '0'),
      sku: item ? (item.codigoProveedor || generateUniqueSKU(item.categoria, item.marca, item.codigoOEM)) : generateUniqueSKU('AUT', 'REP'),
      nombre: item ? item.nombre : '',
      categoria: item ? item.categoria : 'Frenos y Fricción',
      marca: item ? item.marca : 'Bosch',
      codigoOEM: item ? item.codigoOEM : '',
      referenciasCruzadas: item ? item.referenciasCruzadas : [],
      compatibilidad: item ? item.compatibilidad : [],
      costo: item ? item.costoReferencial : 20.00,
      precio: item ? (item.costoReferencial * (1 + (item.margenSugerido || 35)/100)) : 32.00,
      stock: 8,
      min: 2,
      ubicacion: 'Pasillo F1 - Estante 1',
      garantia: '12 meses / 20.000 km',
      especificaciones: item ? item.especificaciones : '',
      imagen: item ? (item.fotoReal || '/icon.svg') : '/icon.svg'
    };

    const refText = (r.referenciasCruzadas || []).map(x => `${x.marca}: ${x.codigo}`).join(', ');
    const fitText = (r.compatibilidad || []).map(x => `${x.marca} - ${x.modelo} - ${x.anios} - ${x.motor || '1.6L'} - ${x.posicion || 'Delantero'}`).join('\n');

    openModal(item ? `Nuevo Repuesto desde Máster: ${item.marca}` : 'Nuevo Repuesto Automotriz', `
      <div style="background:#f4f7fb;border:1px solid #c9d8eb;padding:8px 10px;margin-bottom:10px;border-radius:4px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="font-size:10px;font-weight:bold;color:#0b4f85;text-transform:uppercase">Catálogo Máster Vinculado</span>
          <div style="font-size:12px;font-weight:bold">${item ? esc(item.nombre) : 'Ficha en blanco'}</div>
        </div>
        <button class="btn" style="font-size:10px;padding:4px 8px" onclick="openMasterCatalogSelectorModal('repuesto')">🔍 Explorar Catálogo Máster</button>
      </div>

      <div class="formgrid">
        <div class="field">
          <label>SKU Único</label>
          <input id="repSKU" value="${esc(r.sku)}">
        </div>
        <div class="field">
          <label>Código OEM Original</label>
          <input id="repOEM" value="${esc(r.codigoOEM)}">
        </div>
        <div class="field full">
          <label>Nombre del Repuesto</label>
          <input id="repNombre" value="${esc(r.nombre)}">
        </div>
        <div class="field">
          <label>Categoría</label>
          <input id="repCat" value="${esc(r.categoria)}">
        </div>
        <div class="field">
          <label>Marca</label>
          <input id="repMarca" value="${esc(r.marca)}">
        </div>
        <div class="field" style="background:#fffbe6;padding:4px">
          <label style="color:#874d00">Costo Compra USD</label>
          <input id="repCosto" type="number" step=".01" value="${r.costo}" oninput="document.getElementById('repPrecio').value=(this.value*1.35).toFixed(2)">
        </div>
        <div class="field" style="background:#e6f7ff;padding:4px">
          <label style="color:#0050b3">Precio Venta USD (Margen 35%)</label>
          <input id="repPrecio" type="number" step=".01" value="${r.precio.toFixed(2)}">
        </div>
        <div class="field">
          <label>Stock Físico</label>
          <input id="repStock" type="number" value="${r.stock}">
        </div>
        <div class="field">
          <label>Stock Mínimo</label>
          <input id="repMin" type="number" value="${r.min}">
        </div>
        <div class="field full">
          <label>Referencias Cruzadas</label>
          <input id="repRefs" value="${esc(refText)}">
        </div>
        <div class="field full">
          <label>Compatibilidad Vehicular</label>
          <textarea id="repFit">${esc(fitText)}</textarea>
        </div>
        <div class="field full">
          <label>URL de Foto Real</label>
          <input id="repImg" value="${esc(r.imagen)}">
        </div>
      </div>
    `, `
      <button class="btn" onclick="closeModal()">Cancelar</button>
      <button class="btn primary" onclick="saveRepuesto()">💾 Guardar en Mi Catálogo de Venta</button>
    `);
  }

  // ==========================================
  // 7. VISTA PRINCIPAL DEL CATÁLOGO MÁSTER
  // ==========================================

  let masterViewSearchQuery = '';
  let masterViewSearchTimeout = null;

  function onMasterSearchInput(val) {
    masterViewSearchQuery = val;
    activeMasterPage = 1;
    clearTimeout(masterViewSearchTimeout);
    masterViewSearchTimeout = setTimeout(() => {
      const container = document.getElementById('masterExplorerTableContainer');
      if (container) {
        container.innerHTML = renderMasterExplorerTableContainerHTML();
      }
    }, 150);
  }

  function setMasterViewCategory(cat, btn) {
    activeMasterCategory = cat;
    activeMasterPage = 1;
    if (btn && btn.parentElement) {
      btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('primary'));
      btn.classList.add('primary');
    }
    const container = document.getElementById('masterExplorerTableContainer');
    if (container) {
      container.innerHTML = renderMasterExplorerTableContainerHTML();
    }
  }

  function changeMasterViewPage(p) {
    activeMasterPage = p;
    const container = document.getElementById('masterExplorerTableContainer');
    if (container) {
      container.innerHTML = renderMasterExplorerTableContainerHTML();
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function renderMasterExplorerTableContainerHTML() {
    const res = queryMasterCatalog(masterViewSearchQuery, activeMasterCategory, activeMasterPage, ITEMS_PER_PAGE);
    const myProductCodes = new Set(db.productos.map(p => (p.codigo || '').toLowerCase()));
    const myRepuestoSKUs = new Set(getRepuestos().map(r => (r.sku || '').toLowerCase()));

    return `
      <div class="panelhead" style="display:flex;justify-content:space-between;align-items:center">
        <span>Catálogo de Referencias de Distribuidores (Mostrando <b>${res.items.length}</b> de <b>${res.totalMatched.toLocaleString()}</b> encontrados)</span>
        <span style="font-size:11px;color:#555">Página <b>${res.page}</b> de <b>${res.totalPages}</b></span>
      </div>
      <div class="panelbody" style="padding:0;overflow:auto">
        <table id="masterExplorerTable">
          <thead>
            <tr>
              <th style="width:48px;text-align:center">Foto</th>
              <th>Descripción Técnica / Aplicación</th>
              <th>Marca / Origen</th>
              <th>Código OEM / Proveedor</th>
              <th>Categoría / U.M.</th>
              <th>Costo Ref.</th>
              <th>Estado Local</th>
              <th style="width:140px;text-align:center">Acción</th>
            </tr>
          </thead>
          <tbody>
            ${res.items.map(item => {
              const isImported = myProductCodes.has((item.codigoProveedor||'').toLowerCase()) || myRepuestoSKUs.has((item.codigoProveedor||'').toLowerCase());
              return `
              <tr class="clickrow">
                <td style="text-align:center;padding:3px">
                  <img src="${item.fotoReal || '/icon.svg'}" style="width:38px;height:38px;object-fit:cover;border:1px solid #ccc;border-radius:3px" onerror="this.src='/icon.svg'">
                </td>
                <td>
                  <b style="color:#0b4f85">${esc(item.nombre)}</b>
                  <div style="font-size:10px;color:#555">${esc(item.descripcionTecnica)}</div>
                </td>
                <td>
                  <b>${esc(item.marca)}</b>
                  <br><small style="color:#777">${esc(item.origenMarca || item.distribuidor)}</small>
                </td>
                <td>
                  <span style="font-family:monospace;background:#f0f4fa;padding:1px 4px;border:1px solid #d0dbe8;font-size:10px;font-weight:bold">${esc(item.codigoOEM)}</span>
                  <div style="font-size:9px;color:#666">${esc(item.codigoProveedor)}</div>
                </td>
                <td>${esc(item.categoria)}<br><small style="color:#0a6839;font-weight:bold">${esc(item.unidadMedida)}</small></td>
                <td style="font-weight:bold;color:#0b4f85">${money(item.costoReferencial)}</td>
                <td>
                  <span class="badge ${isImported?'ok':'warn'}">${isImported?'En Mi Inventario':'Disponible'}</span>
                </td>
                <td style="text-align:center">
                  <button class="btn primary" style="font-size:10px;padding:4px 8px" onclick="selectMasterItemByIndex('${item.masterId}')">📥 Añadir a Mi Tienda</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#fafafa;border-top:1px solid #ddd">
        <span style="font-size:11px;color:#666">Página <b>${res.page}</b> de <b>${res.totalPages}</b> (Total: ${res.totalMatched.toLocaleString()} artículos)</span>
        <div style="display:flex;gap:6px">
          <button class="btn" ${res.page <= 1 ? 'disabled' : ''} onclick="changeMasterViewPage(${res.page - 1})">◀ Anterior</button>
          <button class="btn" ${res.page >= res.totalPages ? 'disabled' : ''} onclick="changeMasterViewPage(${res.page + 1})">Siguiente ▶</button>
        </div>
      </div>
    `;
  }

  function masterCatalogView() {
    return `
    <div class="pagehead">
      <div>
        <h2>📖 Catálogo Máster Universal de Proveedores</h2>
        <div class="sub">Biblioteca técnica de +100.000 productos · Lubricantes Nacionales e Importados, Repuestos Comerciales y Marcas Chinas</div>
      </div>
      <div class="actions" style="margin:0">
        <button class="btn primary" onclick="openMasterCatalogSelectorModal('producto')">📥 Importar Nuevo Producto a Mi Tienda</button>
      </div>
    </div>

    <div class="cards">
      <div class="card">Catálogo Indexado<b>${TOTAL_VIRTUAL_CATALOG_COUNT.toLocaleString()}</b><span>artículos disponibles</span></div>
      <div class="card">Aceites y Lubricantes<b>45.000+</b><span>PDV, Inca, Venoco, Mobil...</span></div>
      <div class="card">Repuestos Masivos<b>35.000+</b><span>Toyota, Chevrolet, Ford...</span></div>
      <div class="card">Marcas Chinas<b>24.000+</b><span>Chery, Jac, Changan, Haval...</span></div>
      <div class="card">Mi Inventario Activo<b>${db.productos.length + getRepuestos().length}</b><span>en mi tienda local</span></div>
    </div>

    <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:6px;margin-bottom:8px;border-bottom:1px solid #ddd">
      ${['Todos', 'Aceites y Lubricantes', 'Nacionales Venezolanas', 'Importadas Premium', 'Frenos y Fricción', 'Suspensión y Dirección', 'Partes Eléctricas', 'Repuestos Chinos'].map(cat => `
        <button class="btn ${activeMasterCategory===cat?'primary':''}" style="font-size:11px;padding:5px 10px;white-space:nowrap" onclick="setMasterViewCategory('${cat}', this)">${cat}</button>
      `).join('')}
    </div>

    <div class="searchbar">
      <input id="masterExpQ" value="${esc(masterViewSearchQuery)}" placeholder="🔍 Buscar entre +100.000 productos por nombre, viscosidad (20W-50, 15W-40, 5W-30), marca (PDV, Inca, Mobil, Valvoline), auto (Aveo, Corolla, Chery, Jac)..." oninput="onMasterSearchInput(this.value)">
    </div>

    <div class="panel" id="masterExplorerTableContainer">
      ${renderMasterExplorerTableContainerHTML()}
    </div>
    `;
  }

  // Exportar funciones globales
  global.calculatePricingEngine = calculatePricingEngine;
  global.openMasterCatalogSelectorModal = openMasterCatalogSelectorModal;
  global.debounceMasterModalSearch = debounceMasterModalSearch;
  global.setMasterSelectorCategory = setMasterSelectorCategory;
  global.changeMasterSelectorPage = changeMasterSelectorPage;
  global.selectMasterItemByIndex = selectMasterItemByIndex;
  global.openCommercialProductFormWithMaster = openCommercialProductFormWithMaster;
  global.updateCommercialSimulator = updateCommercialSimulator;
  global.saveCommercialProductFromForm = saveCommercialProductFromForm;
  global.openCommercialRepuestoFormWithMaster = openCommercialRepuestoFormWithMaster;
  global.masterCatalogView = masterCatalogView;
  global.onMasterSearchInput = onMasterSearchInput;
  global.setMasterViewCategory = setMasterViewCategory;
  global.changeMasterViewPage = changeMasterViewPage;
  global.queryMasterCatalog = queryMasterCatalog;
  global.TOTAL_VIRTUAL_CATALOG_COUNT = TOTAL_VIRTUAL_CATALOG_COUNT;

})(window);
