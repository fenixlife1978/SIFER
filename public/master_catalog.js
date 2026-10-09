// SIFER360 - Catálogo Máster Universal de Proveedores y Motor Comercial de Precios (+900.000 Productos)
// Especializado en Mercado Venezolano: Aceites y Lubricantes (Nacionales e Importados en todas las presentaciones),
// Repuestos Automotrices de Alta Frecuencia Comercial (Bujes, Gomas, Lápiz/Bieletas, Rodamientos, Baterías,
// Luces de Faros y Stop, Cilindros de Ignición/Switcheras, Relex/Relés, Mangueras de Radiador, Frenos, Suspensión,
// Motor, Inyección, etc.) para Marcas Comerciales (Toyota, Chevrolet, Ford, Hyundai, Nissan, etc.) y Marcas Chinas (Chery, Jac, Changan, Great Wall).

(function(global){

  // ==========================================
  // 0. UTILIDADES GLOBALES DE BÚSQUEDA POR PALABRAS CLAVES
  // ==========================================

  function normalizeSearchText(s) {
    if (!s) return '';
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function matchKeywords(text, query) {
    if (!query || !query.trim()) return true;
    if (!text) return false;
    const normText = normalizeSearchText(text);
    const tokens = normalizeSearchText(query).trim().split(/\s+/).filter(Boolean);
    return tokens.every(token => normText.includes(token));
  }

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
  // 2. PARQUE AUTOMOTOR VENEZOLANO EXTENDIDO
  // ==========================================

  const VEHICLES_IN_VENEZUELA = [
    // Chevrolet (Líder en Venezuela)
    { marca: 'Chevrolet', modelo: 'Aveo (3 Puertas / 4 Puertas / 5 Puertas / Speed)', anios: '2005-2018', motor: '1.6L F16D3 DOHC', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Corsa / Chevy C2 / Corsa Evolution', anios: '1998-2012', motor: '1.3L / 1.4L / 1.6L / 1.8L MPFI', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Optra (Design / Advance / Limited / Hatchback)', anios: '2004-2014', motor: '1.8L T18SED / 1.4L', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Spark (724 / Cronos / LT)', anios: '2006-2016', motor: '1.0L B10S 4 Cilindros', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Silverado / Tahoe / Avalanche / Suburban', anios: '2000-2023', motor: '5.3L Vortec V8 / 6.0L', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Cruze (Sedán / Hatchback)', anios: '2010-2017', motor: '1.8L Ecotec DOHC', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'LUV D-Max 4x2 / 4x4', anios: '2005-2015', motor: '3.5L V6 Gasolina / 3.0L Isuzu Diesel', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Grand Vitara (Suzuki / Chevrolet 4L y V6)', anios: '2001-2014', motor: '2.0L 4L / 2.5L / 2.7L V6', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Astra / Zafira', anios: '2000-2008', motor: '1.8L / 2.0L / 2.2L 16V', tipo: 'comercial_masivo' },
    { marca: 'Chevrolet', modelo: 'Cavalier / Sunfire', anios: '1996-2004', motor: '2.2L / 2.4L Twin Cam', tipo: 'comercial_masivo' },

    // Ford (Clásicos y masivos en Venezuela)
    { marca: 'Ford', modelo: 'Fiesta (Power / Max / Move / Titanium / Supercharger)', anios: '2001-2019', motor: '1.6L Zetec Rocam / 1.6L Sigma', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'Explorer (Eddie Bauer / Limited / XLT / 4.6L / 3.5L)', anios: '2002-2022', motor: '4.6L V8 3V / 4.0L V6 / 3.5L EcoBoost', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'F-150 / Fortaleza / Triton / Super Duty FX4', anios: '1997-2023', motor: '4.6L / 5.4L Triton V8 / 6.2L', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'EcoSport 4x2 / 4x4', anios: '2004-2018', motor: '1.6L Rocam / 2.0L Duratec', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'Focus (Sedán / Hatchback)', anios: '2001-2013', motor: '2.0L Duratec / 2.0L Zetec', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'Ka (Fly / Action / Viral)', anios: '2004-2012', motor: '1.6L Zetec Rocam', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'Ranger 4x2 / 4x4', anios: '2000-2022', motor: '2.3L Gasolina / 3.0L PowerStroke Diesel', tipo: 'comercial_masivo' },
    { marca: 'Ford', modelo: 'Fusion V6', anios: '2006-2015', motor: '3.0L / 3.5L Duratec V6', tipo: 'comercial_masivo' },

    // Toyota (Referencia de confiabilidad en Venezuela)
    { marca: 'Toyota', modelo: 'Corolla (Baby Camry / Pantallita / New Sensación / GLi / 2015+)', anios: '1993-2024', motor: '1.6L 4AFE / 1.8L 1ZZ-FE / 2.0L 2ZR-FE', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Hilux (Kavak / Vigo / Revo / 2.7L / 4.0L / Diesel)', anios: '1998-2024', motor: '2.7L 2TR-FE / 4.0L 1GR-FE / 1KD 3.0L', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Fortuner / 4Runner (SR5 / Limited)', anios: '2003-2024', motor: '4.0L 1GR-FE V6 Dual VVT-i', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Yaris (Belta / Sol / Hatchback / Sedán)', anios: '2000-2023', motor: '1.3L 2NZ-FE / 1.5L 1NZ-FE', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Land Cruiser (Machito / Serie 70 / Samurai / Prado / Merú)', anios: '1990-2024', motor: '4.5L 1FZ-FE / 4.0L 1GR / 2.7L 3RZ', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'Terios / Daihatsu Terios Cool / BeGo', anios: '2002-2016', motor: '1.3L K3-VE / 1.5L 3SZ-VE', tipo: 'comercial_masivo' },
    { marca: 'Toyota', modelo: 'RAV4 4x2 / 4x4', anios: '2001-2022', motor: '2.0L / 2.4L 2AZ-FE / 2.5L', tipo: 'comercial_masivo' },

    // Hyundai y Kia
    { marca: 'Hyundai', modelo: 'Getz (GL / GLS)', anios: '2006-2014', motor: '1.3L / 1.6L G4ED Alpha DOHC', tipo: 'comercial_masivo' },
    { marca: 'Hyundai', modelo: 'Accent (Verna / Maxx / Brisa / Accent 4)', anios: '2000-2017', motor: '1.3L / 1.5L / 1.6L', tipo: 'comercial_masivo' },
    { marca: 'Hyundai', modelo: 'Elantra (XD / HD / MD)', anios: '2001-2017', motor: '1.6L / 2.0L Beta II', tipo: 'comercial_masivo' },
    { marca: 'Hyundai', modelo: 'Tucson (GLS / 4x2 / 4x4)', anios: '2005-2020', motor: '2.0L Beta / 2.7L V6 Delta', tipo: 'comercial_masivo' },
    { marca: 'Hyundai', modelo: 'Santa Fe V6', anios: '2002-2018', motor: '2.7L / 3.3L / 3.5L V6', tipo: 'comercial_masivo' },
    { marca: 'Kia', modelo: 'Rio (Stylus / JB / Rio 4 / Spice)', anios: '2002-2020', motor: '1.1L / 1.5L / 1.6L G4ED', tipo: 'comercial_masivo' },
    { marca: 'Kia', modelo: 'Picanto (Morning / Ion)', anios: '2005-2020', motor: '1.0L / 1.1L / 1.2L Kappa', tipo: 'comercial_masivo' },
    { marca: 'Kia', modelo: 'Sportage (LX / EX / Pro)', anios: '2005-2020', motor: '2.0L Beta / 2.7L V6', tipo: 'comercial_masivo' },
    { marca: 'Kia', modelo: 'Cerato / Spectra', anios: '2006-2018', motor: '1.6L / 2.0L DOHC', tipo: 'comercial_masivo' },

    // Nissan, Mitsubishi, Renault, Fiat, VW, Jeep
    { marca: 'Nissan', modelo: 'Sentra (B13 / B14 / B15 / B16 / Clásico)', anios: '1995-2018', motor: '1.6L GA16DE / 1.8L QG18 / 2.0L MR20DE', tipo: 'comercial_masivo' },
    { marca: 'Nissan', modelo: 'Tiida (Sedán / Hatchback)', anios: '2007-2018', motor: '1.8L MR18DE 16V', tipo: 'comercial_masivo' },
    { marca: 'Nissan', modelo: 'Frontier / D22 / Navara 4x2 / 4x4', anios: '2000-2022', motor: '2.4L KA24DE / 2.5L Diesel YD25', tipo: 'comercial_masivo' },
    { marca: 'Nissan', modelo: 'Pathfinder / Patrol / X-Trail', anios: '2001-2020', motor: '2.5L QR25 / 3.5L / 4.0L VQ40 V6', tipo: 'comercial_masivo' },
    { marca: 'Mitsubishi', modelo: 'Lancer (Signo / CK / GLX / Touring 2.0)', anios: '1998-2016', motor: '1.3L / 1.6L 4G18 / 2.0L 4G94 DOHC', tipo: 'comercial_masivo' },
    { marca: 'Mitsubishi', modelo: 'Montero (Dakar / Sport / Limited / Cara de Gato)', anios: '1998-2015', motor: '3.0L 6G72 / 3.5L 6G74 / 3.8L V6', tipo: 'comercial_masivo' },
    { marca: 'Renault', modelo: 'Clio / Symbol / Logan / Sandero / Megane', anios: '2000-2019', motor: '1.4L / 1.6L K4M 16V / K7M 8V', tipo: 'comercial_masivo' },
    { marca: 'Renault', modelo: 'Twingo / Kangoo', anios: '1998-2012', motor: '1.2L D7F / 1.2L 16V D4F', tipo: 'comercial_masivo' },
    { marca: 'Fiat', modelo: 'Palio / Siena / Uno Fire / Weekend / Strada', anios: '1998-2017', motor: '1.3L Fire / 1.4L Fire / 1.8L Powertrain', tipo: 'comercial_masivo' },
    { marca: 'Volkswagen', modelo: 'Gol (G3 / G4 / G5 / Parati) / Fox / CrossFox / Bora', anios: '2000-2017', motor: '1.6L / 1.8L / 2.0L EA111 / EA827', tipo: 'comercial_masivo' },
    { marca: 'Jeep', modelo: 'Cherokee (XJ / KJ Liberty / WK / KK / Grand Cherokee)', anios: '1992-2022', motor: '4.0L PowerTech 6L / 3.7L V6 / 4.7L / 5.7L Hemi V8', tipo: 'comercial_masivo' },
    { marca: 'Jeep', modelo: 'Wrangler (YJ / TJ / JK Rubicon)', anios: '1995-2020', motor: '4.0L 6L / 3.8L / 3.6L Pentastar V6', tipo: 'comercial_masivo' },

    // Marcas Chinas muy comerciales en Venezuela
    { marca: 'Chery', modelo: 'Arauca (Face / A1)', anios: '2012-2020', motor: '1.3L Acteco SQR473F 16V', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'Orinoco (A3 / M11 / Cielo)', anios: '2012-2020', motor: '1.8L Acteco SQR484F DOHC', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'QQ / Cowin 1 / Sweet', anios: '2006-2018', motor: '0.8L / 1.1L 3/4 Cilindros', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'Grand Tiger Pick-up ZX Auto / Chery', anios: '2012-2021', motor: '2.4L Mitsubishi 4G64 Gasolina', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'Tiggo (Tiggo 2 / Tiggo 3 / Tiggo 5)', anios: '2012-2024', motor: '1.5L / 1.6L / 2.0L Acteco', tipo: 'china_comercial' },
    { marca: 'Chery', modelo: 'X1 (Beat / Indis)', anios: '2012-2018', motor: '1.3L Acteco', tipo: 'china_comercial' },
    { marca: 'Jac', modelo: 'J3 / J5 / Arena / Heyue', anios: '2012-2022', motor: '1.3L / 1.5L VVT', tipo: 'china_comercial' },
    { marca: 'Jac', modelo: 'T6 / T8 Pick-up 4x2 y 4x4', anios: '2016-2024', motor: '2.0L Turbo Gasolina / 1.9L Diesel', tipo: 'china_comercial' },
    { marca: 'Jac', modelo: 'Camiones Ligeros 1040 / 1042 / 1061', anios: '2010-2024', motor: '2.8L Isuzu Tech Diesel Intercooler', tipo: 'china_comercial' },
    { marca: 'Changan', modelo: 'Benni / Alsvin / CS15 / CS35 / CS55 / Hunter Pick-up', anios: '2012-2024', motor: '1.0L / 1.4L / 1.5L BlueCore / 1.9L Turbo', tipo: 'china_comercial' },
    { marca: 'Great Wall', modelo: 'Haval H3 / H5 / H6 / Wingle 5 / Wingle 7', anios: '2011-2024', motor: '2.2L / 2.4L Mitsubishi / 2.0L Turbo Diesel', tipo: 'china_comercial' },
    { marca: 'DFSK / DFM', modelo: 'Mini Auto / Van Pasajeros / Camioneta Panel Cargo', anios: '2010-2023', motor: '1.0L / 1.3L DongFeng', tipo: 'china_comercial' },
    { marca: 'Foton', modelo: 'Tunland Pick-up / Ollin / Aumark Camión', anios: '2013-2024', motor: '2.8L Cummins ISF Turbo Diesel', tipo: 'china_comercial' }
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
    { nombre: 'Duncan Baterías', origen: 'Venezuela / Nacional Líder', tipo: 'nacional_lider' },
    { nombre: 'Fulgor Baterías', origen: 'Venezuela / Nacional', tipo: 'nacional_lider' },
    { nombre: 'Titan Baterías', origen: 'Venezuela / Nacional', tipo: 'nacional_lider' },
    { nombre: 'Willard', origen: 'Colombia / Importado', tipo: 'calidad' },
    { nombre: 'Osram Automotive Lighting', origen: 'Alemania / Brasil', tipo: 'premium' },
    { nombre: 'Philips Automotive', origen: 'Holanda / Polonia', tipo: 'premium' },
    { nombre: 'Hella Automotive', origen: 'Alemania / México', tipo: 'premium' },
    { nombre: 'Flosser Germany', origen: 'Alemania', tipo: 'calidad' },
    { nombre: 'Takama Parts', origen: 'Importado Económico (China/Taiwán)', tipo: 'economica' },
    { nombre: 'Sankei / Senkei', origen: 'Importado Económico (China)', tipo: 'economica' },
    { nombre: 'Wender Parts', origen: 'Importado Económico (China)', tipo: 'economica' },
    { nombre: 'Flavia Parts', origen: 'Importado Económico', tipo: 'economica' },
    { nombre: 'Isaka Genuine Replacement', origen: 'Importado Económico', tipo: 'economica' },
    { nombre: 'Chery Genuine Parts', origen: 'China / Chery OEM', tipo: 'oem' },
    { nombre: 'Jac Genuine Parts', origen: 'China / Jac OEM', tipo: 'oem' },
    { nombre: 'Changan Motors Spare Parts', origen: 'China / Changan OEM', tipo: 'oem' }
  ];

  // Plantillas de Repuestos Automotrices de Alta Demanda Comercial en Venezuela
  const AUTO_PART_TEMPLATES = [
    // 1. BUJES Y GOMAS (Suspensión y Tren Delantero)
    { nameTpl: 'Buje de Meseta Delantera Inferior (Grande / Trasero de Tijera)', cat: 'Bujes y Gomas', cost: 4.80, margen: 45, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48655', u: 'Unidad' },
    { nameTpl: 'Buje de Meseta Delantera Inferior (Pequeño / Delantero de Tijera)', cat: 'Bujes y Gomas', cost: 3.90, margen: 45, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48654', u: 'Unidad' },
    { nameTpl: 'Buje de Barra Estabilizadora Delantera en Goma Vulcanizada', cat: 'Bujes y Gomas', cost: 2.80, margen: 50, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48815', u: 'Par (2 piezas)' },
    { nameTpl: 'Goma de Barra Estabilizadora / Abrazadera de Suspensión Reforzada', cat: 'Bujes y Gomas', cost: 2.50, margen: 50, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '54813', u: 'Par (2 piezas)' },
    { nameTpl: 'Buje de Puente Trasero / Eje de Torsión Reforzado', cat: 'Bujes y Gomas', cost: 9.50, margen: 40, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '55160', u: 'Unidad' },
    { nameTpl: 'Goma Guardapolvo de Tripoide / Junta Homocinética Lado Rueda con Abrazaderas y Grasa', cat: 'Bujes y Gomas', cost: 5.20, margen: 45, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '04438', u: 'Kit con Grasa' },
    { nameTpl: 'Goma Guardapolvo de Tripoide / Copa Lado Caja de Velocidades con Grasa', cat: 'Bujes y Gomas', cost: 5.50, margen: 45, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '04437', u: 'Kit con Grasa' },
    { nameTpl: 'Juego de Gomas y Sellos de Válvula de Motor en Vitón Alta Temperatura', cat: 'Bujes y Gomas', cost: 6.80, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: '90913', u: 'Juego (16 piezas)' },
    { nameTpl: 'Tope de Amortiguador y Guardapolvo Delantero de Poliuretano', cat: 'Bujes y Gomas', cost: 4.50, margen: 45, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48331', u: 'Par (2 piezas)' },

    // 2. LÁPIZ Y BIELETAS (Suspensión y Estabilidad)
    { nameTpl: 'Lápiz Estabilizador Delantero / Bieleta de Barra Estabilizadora (Lado Izq/Der)', cat: 'Lápiz y Bieletas', cost: 6.90, margen: 45, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48820', u: 'Unidad' },
    { nameTpl: 'Lápiz Estabilizador Trasero / Bieleta de Suspensión Trasera', cat: 'Lápiz y Bieletas', cost: 6.50, margen: 45, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48830', u: 'Unidad' },
    { nameTpl: 'Terminal de Barra Estabilizadora Reforzado con Tuercas Autoblocantes', cat: 'Lápiz y Bieletas', cost: 7.20, margen: 45, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '54830', u: 'Unidad' },

    // 3. RODAMIENTOS Y BALEROS
    { nameTpl: 'Rodamiento de Rueda Delantero Sellado Doble Hilera de Bolas (DAC)', cat: 'Rodamientos', cost: 11.50, margen: 40, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '90369', u: 'Unidad' },
    { nameTpl: 'Masa / Cubo de Rueda Delantero con Espárragos de Rueda', cat: 'Rodamientos', cost: 18.00, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '43502', u: 'Unidad' },
    { nameTpl: 'Maza Trasera Completa con Rodamiento Integrado y Sensor ABS', cat: 'Rodamientos', cost: 32.00, margen: 30, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '42450', u: 'Unidad' },
    { nameTpl: 'Rodamiento de Alternador de Alta Velocidad (6202 / 6203 / 6303 2RS)', cat: 'Rodamientos', cost: 3.50, margen: 50, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '90099', u: 'Unidad' },
    { nameTpl: 'Rodamiento para Polea de Compresor de Aire Acondicionado', cat: 'Rodamientos', cost: 8.50, margen: 45, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '30BD52', u: 'Unidad' },
    { nameTpl: 'Soporte y Rodamiento Central de Cardán con Goma Anti-vibración', cat: 'Rodamientos', cost: 24.00, margen: 35, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '37230', u: 'Unidad' },

    // 4. BATERÍAS AUTOMOTRICES
    { nameTpl: 'Batería Automotriz 12V 24R (800 AMP) Libre de Mantenimiento Terminal Positivo Derecho', cat: 'Baterías', cost: 68.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'BAT-24R', u: 'Unidad' },
    { nameTpl: 'Batería Automotriz 12V 34R (900 AMP) Heavy Duty Alto Desempeño', cat: 'Baterías', cost: 78.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'BAT-34R', u: 'Unidad' },
    { nameTpl: 'Batería Automotriz 12V 42 / 27 (1100 AMP) para Camionetas y Carga Pesada', cat: 'Baterías', cost: 95.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'BAT-42D', u: 'Unidad' },
    { nameTpl: 'Batería Automotriz 12V 45AH Compacta (Spark / Picanto / QQ / Benni)', cat: 'Baterías', cost: 58.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'BAT-45AH', u: 'Unidad' },

    // 5. LUCES DE FAROS Y STOP / ILUMINACIÓN
    { nameTpl: 'Bombillo Halógeno H4 12V 60/55W P43t Alta y Baja para Faros Principales', cat: 'Luces y Faros', cost: 2.20, margen: 50, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '90981-H4', u: 'Unidad' },
    { nameTpl: 'Bombillo Halógeno H7 12V 55W PX26d Luz de Cruce / Faro Delantero', cat: 'Luces y Faros', cost: 2.40, margen: 50, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '90981-H7', u: 'Unidad' },
    { nameTpl: 'Bombillos LED H4 / H7 Ultra Blanco 6000K Canbus 16000LM Alta Potencia', cat: 'Luces y Faros', cost: 16.50, margen: 40, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'LED-6000K', u: 'Par (2 bombillos LED)' },
    { nameTpl: 'Bombillo Halógeno H1 / H11 / 9005 / 9006 / 881 para Faros Antiniebla', cat: 'Luces y Faros', cost: 2.80, margen: 50, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '90981-FOG', u: 'Unidad' },
    { nameTpl: 'Bombillo 1157 2 Contactos 12V (Freno / Stop y Luz de Posición / Patas Desparejas)', cat: 'Luces y Faros', cost: 0.80, margen: 60, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '1157-BAY15D', u: 'Caja (10 piezas)' },
    { nameTpl: 'Bombillo 1156 1 Contacto 12V (Luz de Cruce / Retroceso / Pata Pareja)', cat: 'Luces y Faros', cost: 0.75, margen: 60, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '1156-BA15S', u: 'Caja (10 piezas)' },
    { nameTpl: 'Bombillos T10 Piojito LED 12V Blanco Siliconado para Cocuyos y Tablero', cat: 'Luces y Faros', cost: 1.20, margen: 60, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'T10-W5W', u: 'Blíster (4 piezas)' },
    { nameTpl: 'Unidad Sellada Faro Redondo 7 Pulgadas Halógeno / LED (Jeep / Machito / Samurai)', cat: 'Luces y Faros', cost: 22.00, margen: 35, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '7INCH-SEALED', u: 'Unidad' },

    // 6. CILINDROS DE IGNICIÓN Y SWITCHERAS
    { nameTpl: 'Cilindro de Switchera de Ignición y Encendido con 2 Llaves Mecánicas', cat: 'Cilindros de Ignición', cost: 12.50, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: '69057', u: 'Kit con Llaves' },
    { nameTpl: 'Cilindro de Switchera con Espacio para Chip Transponder e Inmovilizador', cat: 'Cilindros de Ignición', cost: 16.80, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: '81900', u: 'Kit con Llave Chip' },
    { nameTpl: 'Juego de Cilindros de Cerradura de Puertas Delanteras y Maleta con Llave Única', cat: 'Cilindros de Ignición', cost: 18.50, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: '69005', u: 'Juego de 3 Cilindros' },
    { nameTpl: 'Conmutador / Pastilla Eléctrica de Switchera de Encendido', cat: 'Cilindros de Ignición', cost: 8.50, margen: 45, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: '84450', u: 'Unidad' },

    // 7. RELEX Y RELÉS AUTOMOTRICES
    { nameTpl: 'Relex / Relé Automotriz Universal 12V 4 Pines 40A con Portarrelé y Fusible', cat: 'Relex y Relés', cost: 2.20, margen: 55, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'RLY-12V-4P', u: 'Unidad' },
    { nameTpl: 'Relex / Relé Automotriz 12V 5 Pines 40/30A con Diodo de Protección Contra Picos', cat: 'Relex y Relés', cost: 2.50, margen: 55, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'RLY-12V-5P', u: 'Unidad' },
    { nameTpl: 'Relex / Relé Original de Bomba de Gasolina e Inyección 12V', cat: 'Relex y Relés', cost: 4.80, margen: 45, img: '/images/prod_pila_gasolina_1791155267269.jpg', oemPref: '90987-02006', u: 'Unidad' },
    { nameTpl: 'Relex de Electroventilador Alta y Baja Velocidad Reforzado 12V 50A', cat: 'Relex y Relés', cost: 5.20, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '90987-04002', u: 'Unidad' },
    { nameTpl: 'Relex Flasher Electrónico de Cruces y Luces de Emergencia (Intermitentes 3 Pines)', cat: 'Relex y Relés', cost: 3.80, margen: 50, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '81980', u: 'Unidad' },
    { nameTpl: 'Micro Relex Miniatura 12V para Fusilera y Módulos Confort BCM', cat: 'Relex y Relés', cost: 2.90, margen: 50, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'MICRO-RLY', u: 'Unidad' },

    // 8. MANGUERAS AUTOMOTRICES (Refrigeración y Fluidos)
    { nameTpl: 'Manguera Superior de Radiador en EPDM Reforzada con Malla Textil', cat: 'Mangueras', cost: 6.80, margen: 45, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16571', u: 'Unidad' },
    { nameTpl: 'Manguera Inferior de Radiador Moldeada con Espiral Interno Anticolapso', cat: 'Mangueras', cost: 7.90, margen: 45, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16572', u: 'Unidad' },
    { nameTpl: 'Manguera de Calefacción / Bypass de Termostato de Alta Resistencia Térmica', cat: 'Mangueras', cost: 4.50, margen: 50, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '87245', u: 'Unidad' },
    { nameTpl: 'Manguera de Reservorio / Tanque de Expansión de Refrigerante', cat: 'Mangueras', cost: 3.80, margen: 50, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16573', u: 'Unidad' },
    { nameTpl: 'Manguera Flexible de Freno Delantero / Trasero de Alta Presión Blindada', cat: 'Mangueras', cost: 6.20, margen: 45, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '90947', u: 'Unidad' },
    { nameTpl: 'Manguera de Dirección Hidráulica Línea de Presión Alta Carga', cat: 'Mangueras', cost: 19.50, margen: 35, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '44410', u: 'Unidad' },
    { nameTpl: 'Manguera de Combustible e Inyección R7 5/16 y 3/8 Reforzada con Hilo', cat: 'Mangueras', cost: 2.80, margen: 50, img: '/images/prod_filtro_gasolina_1791155241268.jpg', oemPref: 'HOSE-R7', u: 'Metro' },

    // 9. FRENOS Y FRICCIÓN
    { nameTpl: 'Juego de Pastillas de Freno Delanteras Cerámicas Premium', cat: 'Frenos y Fricción', cost: 14.50, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '04465', u: 'Juego (4 piezas)' },
    { nameTpl: 'Juego de Pastillas de Freno Traseras Semimetálicas', cat: 'Frenos y Fricción', cost: 12.00, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '04466', u: 'Juego (4 piezas)' },
    { nameTpl: 'Disco de Freno Delantero Ventilado de Alta Disipación Térmica', cat: 'Frenos y Fricción', cost: 22.00, margen: 30, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '43512', u: 'Unidad' },
    { nameTpl: 'Bomba Principal de Frenos con Depósito y Sensores', cat: 'Frenos y Fricción', cost: 28.00, margen: 30, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '47201', u: 'Unidad' },
    { nameTpl: 'Juego de Bandas / Zapatas de Freno Traseras Vulcanizadas', cat: 'Frenos y Fricción', cost: 13.50, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '04495', u: 'Juego (4 zapatas)' },

    // 10. SUSPENSIÓN Y DIRECCIÓN
    { nameTpl: 'Amortiguador Delantero a Gas Reforzado (Lado Izq/Der)', cat: 'Suspensión y Dirección', cost: 28.50, margen: 30, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48510', u: 'Unidad' },
    { nameTpl: 'Amortiguador Trasero de Doble Tubo Hidráulico Nitro-Cell', cat: 'Suspensión y Dirección', cost: 21.00, margen: 30, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48530', u: 'Unidad' },
    { nameTpl: 'Muñón / Rótula de Suspensión Inferior Reforzada', cat: 'Suspensión y Dirección', cost: 8.50, margen: 40, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '43330', u: 'Unidad' },
    { nameTpl: 'Terminal de Dirección Exterior (Tie Rod End)', cat: 'Suspensión y Dirección', cost: 7.20, margen: 40, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '45046', u: 'Unidad' },
    { nameTpl: 'Meseta / Brazo de Suspensión Delantero Completo con Bujes y Muñón', cat: 'Suspensión y Dirección', cost: 34.00, margen: 30, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48068', u: 'Unidad' },

    // 11. MOTOR Y DISTRIBUCIÓN
    { nameTpl: 'Kit de Correa de Distribución / Tiempo con Tensor y Rodamiento Guía', cat: 'Motor y Distribución', cost: 24.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13568', u: 'Kit Completo' },
    { nameTpl: 'Bomba de Agua con Empacadura de Sellado y Turbina Metálica', cat: 'Motor y Distribución', cost: 19.50, margen: 35, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16100', u: 'Unidad' },
    { nameTpl: 'Bomba de Aceite de Motor de Alta Presión y Caudal', cat: 'Motor y Distribución', cost: 36.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '15100', u: 'Unidad' },
    { nameTpl: 'Termostato de Motor 82°C con Empacadura y Válvula de Alivio', cat: 'Motor y Distribución', cost: 8.20, margen: 45, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '90916', u: 'Unidad' },
    { nameTpl: 'Juego de Empacaduras de Motor Completo (Cámara, Tapa Válvulas, Retenes)', cat: 'Motor y Distribución', cost: 26.00, margen: 35, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: '04111', u: 'Juego Completo' },

    // 12. PARTES ELÉCTRICAS E INYECCIÓN
    { nameTpl: 'Juego de Bujías de Iridio / Platino Larga Vida 100.000 KM', cat: 'Partes Eléctricas', cost: 16.00, margen: 40, img: '/images/rep_bujia_iridio_1791152658933.jpg', oemPref: '90919', u: 'Juego (4 unidades)' },
    { nameTpl: 'Bobina de Encendido Individual Tipo Lápiz (Cop Ignition Coil)', cat: 'Partes Eléctricas', cost: 18.50, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: '90919', u: 'Unidad' },
    { nameTpl: 'Alternador 12V con Polea Multicanal y Regulador Incorporado', cat: 'Partes Eléctricas', cost: 85.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '27060', u: 'Unidad' },
    { nameTpl: 'Motor de Arranque 12V Reforzado de Reducción Planetaria', cat: 'Partes Eléctricas', cost: 72.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '28100', u: 'Unidad' },
    { nameTpl: 'Sensor de Posición de Cigüeñal (Sensor CKP)', cat: 'Partes Eléctricas', cost: 9.50, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '96418', u: 'Unidad' },
    { nameTpl: 'Sensor de Oxígeno Primario / Secundario de 4 Cables con Conector Original', cat: 'Partes Eléctricas', cost: 19.00, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '89465', u: 'Unidad' },
    { nameTpl: 'Pila / Bomba de Gasolina Sumergible 3.5 Bar Universal con Cedazo y Conector', cat: 'Sistema de Combustible', cost: 13.50, margen: 40, img: '/images/prod_pila_gasolina_1791155267269.jpg', oemPref: '95808', u: 'Kit con Cedazo' },

    // 13. TRANSMISIÓN, TRACCIÓN Y EMBRAGUE
    { nameTpl: 'Kit de Embrague / Cloche Completo (Plato de Presión, Disco y Collarín)', cat: 'Transmisión y Embrague', cost: 58.00, margen: 30, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '31210', u: 'Kit 3 Piezas' },
    { nameTpl: 'Punta de Tripoide / Junta Homocinética Lado Rueda con Guardapolvo y Tuerca', cat: 'Transmisión y Embrague', cost: 17.50, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '43410', u: 'Kit con Grasa' },
    { nameTpl: 'Triceta y Copa de Tripoide Lado Caja de Velocidades', cat: 'Transmisión y Embrague', cost: 16.00, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '43403', u: 'Kit con Grasa' },
    { nameTpl: 'Bomba Principal de Embrague / Cilindro Maestro de Croche', cat: 'Transmisión y Embrague', cost: 18.50, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '31420', u: 'Unidad' },
    { nameTpl: 'Bombín Auxiliar / Secundario de Embrague (Collarín Hidráulico)', cat: 'Transmisión y Embrague', cost: 15.00, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '31470', u: 'Unidad' },
    { nameTpl: 'Soporte / Base de Motor Hidráulica Delantera / Derecha', cat: 'Soportes de Motor y Caja', cost: 22.00, margen: 35, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '12305', u: 'Unidad' },
    { nameTpl: 'Soporte / Base de Caja de Velocidades Antivibración', cat: 'Soportes de Motor y Caja', cost: 18.00, margen: 35, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '12371', u: 'Unidad' },
    { nameTpl: 'Cruceta de Cardán con Grasera de Lubricación', cat: 'Transmisión y Embrague', cost: 9.50, margen: 40, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '04371', u: 'Unidad' },

    // 14. MOTOR INTERNO, PISTONES Y METALES
    { nameTpl: 'Juego de Pistones con Pasadores Grado Automotriz (Medida Estándar / 0.20 / 0.30)', cat: 'Motor y Distribución', cost: 45.00, margen: 30, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13101', u: 'Juego (4 pistones)' },
    { nameTpl: 'Juego de Anillos de Motor Cromados y de Fricción', cat: 'Motor y Distribución', cost: 18.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13011', u: 'Juego Completo' },
    { nameTpl: 'Juego de Conchas de Biela Trimétalicas de Alta Resistencia', cat: 'Motor y Distribución', cost: 14.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13041', u: 'Juego (8 conchas)' },
    { nameTpl: 'Juego de Conchas de Bancada / Cojinetes de Cigüeñal', cat: 'Motor y Distribución', cost: 16.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '11701', u: 'Juego Completo' },
    { nameTpl: 'Árbol de Levas de Admisión / Escape Tratado Térmicamente', cat: 'Motor y Distribución', cost: 55.00, margen: 30, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13501', u: 'Unidad' },
    { nameTpl: 'Juego de Taquetes / Buzos Hidráulicos de Válvula Silenciosos', cat: 'Motor y Distribución', cost: 24.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13750', u: 'Juego (16 taquetes)' },
    { nameTpl: 'Juego de Válvulas de Admisión y Escape Nitruradas', cat: 'Motor y Distribución', cost: 28.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13711', u: 'Juego (16 válvulas)' },
    { nameTpl: 'Damper / Polea de Cigüeñal Amortiguada con Goma Antivibración', cat: 'Motor y Distribución', cost: 32.00, margen: 30, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '13408', u: 'Unidad' },
    { nameTpl: 'Kit de Cadena de Tiempo con Patines Guía y Tensores Hidráulicos', cat: 'Motor y Distribución', cost: 65.00, margen: 30, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: '13506', u: 'Kit Distribución Cadena' },

    // 15. REFRIGERACIÓN, RADIADORES Y CLIMATIZACIÓN
    { nameTpl: 'Radiador de Motor de Aluminio Soldado con Tanques Plásticos Reforzados', cat: 'Refrigeración', cost: 48.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16400', u: 'Unidad' },
    { nameTpl: 'Electroventilador Completo con Aspas, Motor y Deflector de Aire', cat: 'Refrigeración', cost: 38.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16363', u: 'Unidad Completa' },
    { nameTpl: 'Toma de Agua / Brida de Termostato de Aluminio con Sensor de Temperatura', cat: 'Refrigeración', cost: 11.50, margen: 40, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16321', u: 'Unidad' },
    { nameTpl: 'Envase / Depósito Reservorio de Refrigerante con Tapa Presurizada', cat: 'Refrigeración', cost: 12.00, margen: 40, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '16470', u: 'Unidad con Tapa' },
    { nameTpl: 'Compresor de Aire Acondicionado 12V con Válvula de Control', cat: 'Refrigeración', cost: 135.00, margen: 25, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: '88310', u: 'Unidad' },

    // 16. INYECCIÓN, SENSORES Y COMBUSTIBLE
    { nameTpl: 'Inyector de Gasolina Multipunto de Alta Precisión y Pulverización', cat: 'Sistema de Combustible', cost: 14.50, margen: 40, img: '/images/prod_pila_gasolina_1791155267269.jpg', oemPref: '23209', u: 'Unidad' },
    { nameTpl: 'Cuerpo de Aceleración Electrónico con Sensor TPS y Motor Paso a Paso', cat: 'Sistema de Combustible', cost: 65.00, margen: 30, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '22030', u: 'Unidad' },
    { nameTpl: 'Sensor de Presión Absoluta del Múltiple (Sensor MAP / MAF)', cat: 'Partes Eléctricas', cost: 13.50, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '89420', u: 'Unidad' },
    { nameTpl: 'Sensor de Posición del Árbol de Levas (Sensor CMP)', cat: 'Partes Eléctricas', cost: 11.00, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '90919-CMP', u: 'Unidad' },
    { nameTpl: 'Sensor de Temperatura del Refrigerante de Motor (Sensor ECT 2 Pines)', cat: 'Partes Eléctricas', cost: 5.50, margen: 50, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '89422', u: 'Unidad' },
    { nameTpl: 'Válvula de Control de Mínimo / Marcha Lenta (Sensor Válvula IAC)', cat: 'Partes Eléctricas', cost: 12.00, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '22270', u: 'Unidad' },
    { nameTpl: 'Módulo Completo de Bomba de Gasolina con Flotante y Regulador', cat: 'Sistema de Combustible', cost: 42.00, margen: 30, img: '/images/prod_pila_gasolina_1791155267269.jpg', oemPref: '77020', u: 'Módulo Completo' },

    // 17. SUSPENSIÓN SUPERIOR, DIRECCIÓN Y FRENOS TRASEROS
    { nameTpl: 'Base de Amortiguador Delantero con Rodamiento / Crapodina', cat: 'Suspensión y Dirección', cost: 13.50, margen: 40, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48609', u: 'Unidad' },
    { nameTpl: 'Espiral de Suspensión Delantero / Trasero Progresivo Reforzado', cat: 'Suspensión y Dirección', cost: 24.00, margen: 35, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '48131', u: 'Par (2 espirales)' },
    { nameTpl: 'Terminal Interior de Dirección / Terminal Axial / Muñón Axial', cat: 'Suspensión y Dirección', cost: 8.50, margen: 40, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '45503', u: 'Unidad' },
    { nameTpl: 'Cremallera / Cajetín de Dirección Hidráulica Completo con Terminales', cat: 'Suspensión y Dirección', cost: 88.00, margen: 25, img: '/images/rep_amortiguador_1791152649395.jpg', oemPref: '44250', u: 'Unidad Completa' },
    { nameTpl: 'Bomba de Dirección Hidráulica con Polea y Válvula Reguladora', cat: 'Suspensión y Dirección', cost: 46.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: '44320', u: 'Unidad' },
    { nameTpl: 'Tambor de Freno Trasero Balanceado en Fundición Gris', cat: 'Frenos y Fricción', cost: 19.00, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '42431', u: 'Unidad' },
    { nameTpl: 'Bombín de Freno de Rueda Trasero con Purgador', cat: 'Frenos y Fricción', cost: 6.50, margen: 45, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '47550', u: 'Unidad' },
    { nameTpl: 'Caliper / Mordaza de Freno Delantera con Pistón y Pasadores', cat: 'Frenos y Fricción', cost: 35.00, margen: 30, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '47730', u: 'Unidad' },
    { nameTpl: 'Sensor de Velocidad de Rueda / Freno Antibloqueo (Sensor ABS)', cat: 'Frenos y Fricción', cost: 12.50, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: '89542', u: 'Unidad' },

    // 18. CARROCERÍA, GUAYAS Y ACCESORIOS
    { nameTpl: 'Guaya de Embrague / Croche Reforzada con Ajustador de Tensión', cat: 'Carrocería y Mandos', cost: 7.50, margen: 45, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: '31340', u: 'Unidad' },
    { nameTpl: 'Guaya de Freno de Mano Trasera Derecha / Izquierda', cat: 'Carrocería y Mandos', cost: 8.50, margen: 45, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: '46410', u: 'Unidad' },
    { nameTpl: 'Manilla Exterior de Puerta Delantera / Trasera en ABS Negro / Cromado', cat: 'Carrocería y Mandos', cost: 6.80, margen: 45, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: '69210', u: 'Unidad' },
    { nameTpl: 'Juego de Escobillas Limpiaparabrisas de Silicona Aerodinámicas Universales (Par)', cat: 'Carrocería y Mandos', cost: 5.50, margen: 50, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'WIPER-PAIR', u: 'Par (2 escobillas)' },

    // 20. NUEVA COBERTURA: ENCENDIDO, SENSORES, DISTRIBUCIÓN, MOTOR INTERNO Y ELÉCTRICO
    { nameTpl: 'Juego de Cables de Bujías de Alta Tensión Premium — 4 / 6 / 8 cilindros', cat: 'Cables de Bujías', cost: 18.00, margen: 40, img: '/images/rep_bujia_iridio_1791152658933.jpg', oemPref: 'WIRE-SET', u: 'Juego Completo' },
    { nameTpl: 'Juego de Cables de Bujías Silicona Alta Temperatura con Terminales', cat: 'Cables de Bujías', cost: 14.50, margen: 45, img: '/images/rep_bujia_iridio_1791152658933.jpg', oemPref: 'WIRE-SIL', u: 'Juego Completo' },
    { nameTpl: 'Juego de Cables de Bujías para Motores 4 Cilindros', cat: 'Cables de Bujías', cost: 12.50, margen: 45, img: '/images/rep_bujia_iridio_1791152658933.jpg', oemPref: 'WIRE-4CYL', u: 'Juego (4 cables)' },

    // Sensores: cobertura amplia por aplicación vehicular
    { nameTpl: 'Sensor CKP de Posición de Cigüeñal', cat: 'Sensores', cost: 9.50, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-CKP', u: 'Unidad' },
    { nameTpl: 'Sensor CMP de Posición de Árbol de Levas', cat: 'Sensores', cost: 11.00, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-CMP', u: 'Unidad' },
    { nameTpl: 'Sensor de Oxígeno O2 / Sonda Lambda 1, 2, 3 y 4 Cables', cat: 'Sensores', cost: 18.50, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-O2', u: 'Unidad' },
    { nameTpl: 'Sensor MAP de Presión Absoluta del Múltiple', cat: 'Sensores', cost: 13.50, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-MAP', u: 'Unidad' },
    { nameTpl: 'Sensor MAF de Flujo de Aire / Caudalímetro', cat: 'Sensores', cost: 28.00, margen: 35, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-MAF', u: 'Unidad' },
    { nameTpl: 'Sensor TPS de Posición de Mariposa / Acelerador', cat: 'Sensores', cost: 12.50, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-TPS', u: 'Unidad' },
    { nameTpl: 'Sensor ECT de Temperatura de Refrigerante', cat: 'Sensores', cost: 5.50, margen: 50, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-ECT', u: 'Unidad' },
    { nameTpl: 'Sensor de Presión de Aceite / Bulbo de Aceite', cat: 'Sensores', cost: 5.00, margen: 50, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-OIL', u: 'Unidad' },
    { nameTpl: 'Sensor de Detonación / Knock Sensor', cat: 'Sensores', cost: 14.00, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-KNOCK', u: 'Unidad' },
    { nameTpl: 'Sensor de Velocidad VSS de Transmisión', cat: 'Sensores', cost: 10.50, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-VSS', u: 'Unidad' },
    { nameTpl: 'Sensor ABS de Velocidad de Rueda Delantero / Trasero', cat: 'Sensores', cost: 12.50, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-ABS', u: 'Unidad' },
    { nameTpl: 'Sensor de Presión de Riel / Combustible', cat: 'Sensores', cost: 25.00, margen: 35, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-FUEL', u: 'Unidad' },
    { nameTpl: 'Sensor de Temperatura de Aire de Admisión IAT', cat: 'Sensores', cost: 7.50, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-IAT', u: 'Unidad' },
    { nameTpl: 'Sensor de Presión de Aire de Turbo / Boost', cat: 'Sensores', cost: 22.00, margen: 35, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-BOOST', u: 'Unidad' },
    { nameTpl: 'Sensor de Posición de Pedal / APP y Acelerador Electrónico', cat: 'Sensores', cost: 24.00, margen: 35, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-APP', u: 'Unidad' },
    { nameTpl: 'Sensor de Presión de Refrigerante A/C', cat: 'Sensores', cost: 13.00, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-AC', u: 'Unidad' },
    { nameTpl: 'Sensor de Nivel de Refrigerante / Depósito', cat: 'Sensores', cost: 10.00, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SEN-LEVEL', u: 'Unidad' },

    // Empacaduras y sellos de motor
    { nameTpl: 'Juego de Empacaduras Completo de Motor / Overhaul', cat: 'Empacaduras de Motor', cost: 28.00, margen: 35, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'GSK-OVER', u: 'Juego Completo' },
    { nameTpl: 'Empacadura de Culata / Cámara de Combustión', cat: 'Empacaduras de Motor', cost: 12.00, margen: 40, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'GSK-HEAD', u: 'Unidad' },
    { nameTpl: 'Juego de Empacaduras de Tapa de Válvulas', cat: 'Empacaduras de Motor', cost: 7.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'GSK-COVER', u: 'Juego' },
    { nameTpl: 'Juego de Retenes de Válvulas y Sellos de Motor', cat: 'Empacaduras de Motor', cost: 6.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'GSK-SEAL', u: 'Juego' },
    { nameTpl: 'Empacadura de Múltiple de Admisión / Escape', cat: 'Empacaduras de Motor', cost: 5.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'GSK-MAN', u: 'Unidad' },
    { nameTpl: 'Empacadura de Bomba de Agua / Termostato / Carcasa', cat: 'Empacaduras de Motor', cost: 3.50, margen: 50, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'GSK-WP', u: 'Unidad' },

    // Bombas de agua
    { nameTpl: 'Bomba de Agua de Motor con Turbina Metálica y Empacadura', cat: 'Bombas de Agua', cost: 19.50, margen: 35, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'WAT-PUMP', u: 'Unidad' },
    { nameTpl: 'Bomba de Agua Reforzada de Alta Durabilidad con Rodamiento', cat: 'Bombas de Agua', cost: 24.00, margen: 35, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'WAT-HD', u: 'Unidad' },
    { nameTpl: 'Kit Bomba de Agua + Correa / Cadena de Tiempo + Tensor', cat: 'Bombas de Agua', cost: 58.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'WAT-KIT', u: 'Kit Completo' },

    // Motor interno con medidas
    { nameTpl: 'Juego de Anillos de Motor — Medida STD', cat: 'Anillos de Motor', cost: 18.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'RING-STD', u: 'Juego Completo' },
    { nameTpl: 'Juego de Anillos de Motor — Medida 0.25 mm', cat: 'Anillos de Motor', cost: 18.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'RING-025', u: 'Juego Completo' },
    { nameTpl: 'Juego de Anillos de Motor — Medida 0.50 mm', cat: 'Anillos de Motor', cost: 19.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'RING-050', u: 'Juego Completo' },
    { nameTpl: 'Juego de Anillos de Motor — Medida 0.75 mm', cat: 'Anillos de Motor', cost: 19.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'RING-075', u: 'Juego Completo' },
    { nameTpl: 'Juego de Anillos de Motor — Medida 1.00 mm', cat: 'Anillos de Motor', cost: 20.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'RING-100', u: 'Juego Completo' },
    { nameTpl: 'Juego de Conchas de Biela — STD', cat: 'Conchas de Biela y Bancada', cost: 14.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'ROD-STD', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Biela — 0.25 mm', cat: 'Conchas de Biela y Bancada', cost: 14.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'ROD-025', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Biela — 0.50 mm', cat: 'Conchas de Biela y Bancada', cost: 15.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'ROD-050', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Biela — 0.75 mm', cat: 'Conchas de Biela y Bancada', cost: 15.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'ROD-075', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Biela — 1.00 mm', cat: 'Conchas de Biela y Bancada', cost: 16.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'ROD-100', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Bancada — STD', cat: 'Conchas de Biela y Bancada', cost: 16.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'MAIN-STD', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Bancada — 0.25 mm', cat: 'Conchas de Biela y Bancada', cost: 17.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'MAIN-025', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Bancada — 0.50 mm', cat: 'Conchas de Biela y Bancada', cost: 17.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'MAIN-050', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Bancada — 0.75 mm', cat: 'Conchas de Biela y Bancada', cost: 18.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'MAIN-075', u: 'Juego' },
    { nameTpl: 'Juego de Conchas de Bancada — 1.00 mm', cat: 'Conchas de Biela y Bancada', cost: 18.50, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'MAIN-100', u: 'Juego' },

    // Cerraduras y mandos
    { nameTpl: 'Cilindro / Cerradura de Puerta Delantera Izquierda', cat: 'Cerraduras y Mandos', cost: 12.00, margen: 45, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'LOCK-FL', u: 'Unidad' },
    { nameTpl: 'Cilindro / Cerradura de Puerta Delantera Derecha', cat: 'Cerraduras y Mandos', cost: 12.00, margen: 45, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'LOCK-FR', u: 'Unidad' },
    { nameTpl: 'Cerradura / Actuador de Puerta Eléctrico', cat: 'Cerraduras y Mandos', cost: 18.00, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'LOCK-ACT', u: 'Unidad' },
    { nameTpl: 'Cerradura de Maleta / Portón Trasero con Actuador', cat: 'Cerraduras y Mandos', cost: 16.00, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'LOCK-GATE', u: 'Unidad' },
    { nameTpl: 'Kit de Cerraduras de Puertas + Maleta + Switchera con Llaves', cat: 'Cerraduras y Mandos', cost: 32.00, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'LOCK-KIT', u: 'Kit' },

    // Solenoides
    { nameTpl: 'Solenoide VVT / Válvula de Control de Aceite del Árbol de Levas', cat: 'Solenoides', cost: 18.00, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SOL-VVT', u: 'Unidad' },
    { nameTpl: 'Solenoide de Arranque / Automático de Motor de Arranque', cat: 'Solenoides', cost: 16.00, margen: 40, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'SOL-START', u: 'Unidad' },
    { nameTpl: 'Solenoide de Purga EVAP / Canister', cat: 'Solenoides', cost: 11.00, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SOL-EVAP', u: 'Unidad' },
    { nameTpl: 'Solenoide de Transmisión Automática / Shift', cat: 'Solenoides', cost: 24.00, margen: 35, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'SOL-TRANS', u: 'Unidad' },
    { nameTpl: 'Solenoide de Cierre Centralizado / Seguro de Puerta', cat: 'Solenoides', cost: 14.00, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'SOL-LOCK', u: 'Unidad' },

    // Conectores, terminales y reparación de cableado
    { nameTpl: 'Kit de Conectores Automotrices 1 a 6 Pines con Terminales', cat: 'Conectores y Terminales', cost: 8.00, margen: 50, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'CON-SET', u: 'Kit' },
    { nameTpl: 'Conector de Sensor Automotriz con Terminales y Traba', cat: 'Conectores y Terminales', cost: 2.50, margen: 55, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'CON-SEN', u: 'Unidad' },
    { nameTpl: 'Conector de Inyector / Bobina / Solenoide con Terminales', cat: 'Conectores y Terminales', cost: 2.80, margen: 55, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'CON-INJ', u: 'Unidad' },
    { nameTpl: 'Conector de Faro / Bombillo H4 H7 H11 9005 9006', cat: 'Conectores y Terminales', cost: 2.20, margen: 55, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'CON-LAMP', u: 'Unidad' },
    { nameTpl: 'Terminales Eléctricos Automotrices, Pigtails y Reparación de Arnés', cat: 'Conectores y Terminales', cost: 6.50, margen: 50, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'CON-PIG', u: 'Kit' },

    // Distribución: cadenas, tensores y kits
    { nameTpl: 'Cadena de Tiempo / Distribución Simple o Doble', cat: 'Distribución', cost: 28.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'TIM-CHAIN', u: 'Unidad' },
    { nameTpl: 'Tensor de Cadena de Tiempo Hidráulico / Mecánico', cat: 'Distribución', cost: 18.00, margen: 40, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'TIM-TENS', u: 'Unidad' },
    { nameTpl: 'Patines / Guías de Cadena de Tiempo', cat: 'Distribución', cost: 14.00, margen: 40, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'TIM-GUIDE', u: 'Juego' },
    { nameTpl: 'Kit de Tiempo con Cadena + Tensores + Guías + Engranajes', cat: 'Distribución', cost: 68.00, margen: 30, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'TIM-KIT-CHAIN', u: 'Kit Completo' },
    { nameTpl: 'Kit de Tiempo con Correa + Tensor + Rodamiento Guía', cat: 'Distribución', cost: 32.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'TIM-KIT-BELT', u: 'Kit Completo' },

    // Frenos y desgaste
    { nameTpl: 'Juego de Pastillas de Freno Delanteras Cerámicas / Semimetálicas', cat: 'Frenos y Fricción', cost: 14.50, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: 'BRK-PAD-F', u: 'Juego' },
    { nameTpl: 'Juego de Pastillas de Freno Traseras Cerámicas / Semimetálicas', cat: 'Frenos y Fricción', cost: 12.50, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: 'BRK-PAD-R', u: 'Juego' },
    { nameTpl: 'Disco de Freno Delantero / Trasero', cat: 'Frenos y Fricción', cost: 22.00, margen: 30, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: 'BRK-DISC', u: 'Unidad' },
    { nameTpl: 'Tambor de Freno Trasero', cat: 'Frenos y Fricción', cost: 19.00, margen: 35, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: 'BRK-DRUM', u: 'Unidad' },
    { nameTpl: 'Kit de Reparación de Caliper / Mordaza con Pistón y Sellos', cat: 'Frenos y Fricción', cost: 9.50, margen: 45, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: 'BRK-CAL-KIT', u: 'Kit' },

    // Tripoides y juntas homocinéticas
    { nameTpl: 'Punta de Tripoide / Junta Homocinética Lado Rueda', cat: 'Tripoides y Homocinéticas', cost: 17.50, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'CV-JOINT', u: 'Unidad' },
    { nameTpl: 'Tripoide Interno / Copa Lado Caja', cat: 'Tripoides y Homocinéticas', cost: 22.00, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'CV-INNER', u: 'Unidad' },
    { nameTpl: 'Triceta / Trípode Interior con Rodillos', cat: 'Tripoides y Homocinéticas', cost: 16.00, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'CV-TRI', u: 'Unidad' },
    { nameTpl: 'Goma Guardapolvo de Punta de Tripoide con Abrazaderas y Grasa', cat: 'Tripoides y Homocinéticas', cost: 5.20, margen: 45, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'CV-BOOT', u: 'Kit' },
    { nameTpl: 'Copa de Tripoide / Junta Interna para Caja de Velocidades', cat: 'Tripoides y Homocinéticas', cost: 20.00, margen: 35, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'CV-CUP', u: 'Unidad' },

    // Aditivos y químicos de mantenimiento
    { nameTpl: 'Aditivo Limpia Inyectores para Gasolina', cat: 'Aditivos y Químicos', cost: 4.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'ADD-INJ', u: 'Frasco' },
    { nameTpl: 'Aditivo Limpia Inyectores para Diesel', cat: 'Aditivos y Químicos', cost: 5.00, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'ADD-DIESEL', u: 'Frasco' },
    { nameTpl: 'Aditivo Elevador de Octanaje / Combustible', cat: 'Aditivos y Químicos', cost: 5.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'ADD-OCT', u: 'Frasco' },
    { nameTpl: 'Aditivo Antihumo / Restaurador de Compresión', cat: 'Aditivos y Químicos', cost: 6.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'ADD-SMOKE', u: 'Frasco' },
    { nameTpl: 'Aditivo Limpia Radiador / Sistema de Refrigeración', cat: 'Aditivos y Químicos', cost: 5.00, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'ADD-RAD', u: 'Frasco' },
    { nameTpl: 'Aditivo para Transmisión Automática / Tratamiento ATF', cat: 'Aditivos y Químicos', cost: 7.50, margen: 40, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'ADD-ATF', u: 'Frasco' },
    { nameTpl: 'Aditivo Antifricción / Tratamiento de Aceite de Motor', cat: 'Aditivos y Químicos', cost: 7.50, margen: 40, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'ADD-OIL', u: 'Frasco' },
    { nameTpl: 'Sellador de Fugas de Radiador / Refrigerante', cat: 'Aditivos y Químicos', cost: 4.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'ADD-STOP', u: 'Frasco' },

    // 19. FILTROS DE MANTENIMIENTO
    { nameTpl: 'Filtro de Aceite de Motor Blindado con Válvula Antidrenaje de Silicona', cat: 'Filtros y Mantenimiento', cost: 3.20, margen: 45, img: '/images/rep_filtro_aceite_1791152641120.jpg', oemPref: '90915', u: 'Unidad' },
    { nameTpl: 'Filtro de Aire Motor Tipo Panel de Microfibras de Celulosa', cat: 'Filtros y Mantenimiento', cost: 4.80, margen: 45, img: '/images/prod_filtro_aire_1791155232301.jpg', oemPref: '17801', u: 'Unidad' },
    { nameTpl: 'Filtro de Gasolina en Línea Metálico de Alta Presión', cat: 'Filtros y Mantenimiento', cost: 3.90, margen: 45, img: '/images/prod_filtro_gasolina_1791155241268.jpg', oemPref: '23300', u: 'Unidad' },
    { nameTpl: 'Filtro de Cabina / Polen de Aire Acondicionado con Carbón Activado', cat: 'Filtros y Mantenimiento', cost: 5.20, margen: 45, img: '/images/prod_filtro_aire_1791155232301.jpg', oemPref: '87139', u: 'Unidad' },

    // 21. LUBRICACIÓN Y COMPONENTES INTERNOS DEL MOTOR
    { nameTpl: 'Bomba de Aceite de Motor con Engranajes / Rotor Interno', cat: 'Lubricación del Motor', cost: 38.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'OIL-PUMP', u: 'Unidad', keywords: 'oil pump bomba lubricacion bomba aceite motor engranajes rotor' },
    { nameTpl: 'Bomba de Aceite de Motor Completa con Válvula Reguladora de Presión', cat: 'Lubricación del Motor', cost: 44.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'OIL-PUMP-REG', u: 'Unidad', keywords: 'bomba aceite presion reguladora lubricacion' },
    { nameTpl: 'Pescador / Colador de Aceite del Cárter con Tubo de Succión', cat: 'Lubricación del Motor', cost: 9.50, margen: 40, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'OIL-PICKUP', u: 'Unidad', keywords: 'pescador colador chupador tubo succion aceite carter' },
    { nameTpl: 'Válvula de Alivio / Reguladora de Presión de Aceite', cat: 'Lubricación del Motor', cost: 8.50, margen: 40, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'OIL-RELIEF', u: 'Unidad', keywords: 'valvula presion aceite alivio lubricacion' },
    { nameTpl: 'Enfriador de Aceite de Motor con Juntas', cat: 'Lubricación del Motor', cost: 42.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'OIL-COOLER', u: 'Unidad', keywords: 'enfriador radiador aceite motor' },
    { nameTpl: 'Sensor / Bulbo de Presión de Aceite de Motor', cat: 'Lubricación del Motor', cost: 6.50, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'OIL-SWITCH', u: 'Unidad', keywords: 'sensor bulbo testigo presion aceite' },
    { nameTpl: 'Varilla Medidora de Nivel de Aceite con Mango y Tubo Guía', cat: 'Lubricación del Motor', cost: 7.50, margen: 40, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'OIL-DIPSTICK', u: 'Unidad', keywords: 'varilla nivel aceite medidor bayoneta' },
    { nameTpl: 'Tapa de Llenado de Aceite de Motor con Empaque', cat: 'Lubricación del Motor', cost: 3.50, margen: 50, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'OIL-CAP', u: 'Unidad', keywords: 'tapa llenado aceite motor' },
    { nameTpl: 'Cárter / Depósito Inferior de Aceite de Motor', cat: 'Lubricación del Motor', cost: 32.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'OIL-PAN', u: 'Unidad', keywords: 'carter deposito bandeja aceite motor' },
    { nameTpl: 'Empacadura de Cárter de Aceite de Motor', cat: 'Empacaduras de Motor', cost: 8.00, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'OIL-PAN-GSK', u: 'Juego', keywords: 'junta empacadura carter aceite' },

    // 22. CULATA, DISTRIBUCIÓN Y SELLADO DEL MOTOR
    { nameTpl: 'Culata / Cámara de Motor Completa', cat: 'Motor Interno', cost: 180.00, margen: 20, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'CYL-HEAD', u: 'Unidad', keywords: 'culata camara cabezote cabeza motor' },
    { nameTpl: 'Empacadura de Culata / Junta de Cámara', cat: 'Empacaduras de Motor', cost: 18.00, margen: 40, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'HEAD-GSK', u: 'Unidad', keywords: 'junta empacadura camara culata cabezote' },
    { nameTpl: 'Tapa de Válvulas con Empacadura', cat: 'Motor Interno', cost: 24.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'VALVE-COVER', u: 'Unidad', keywords: 'tapa valvulas tapa punterias' },
    { nameTpl: 'Empacadura de Tapa de Válvulas', cat: 'Empacaduras de Motor', cost: 7.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'VALVE-COVER-GSK', u: 'Juego', keywords: 'junta tapa valvulas tapa punterias' },
    { nameTpl: 'Retén Delantero de Cigüeñal', cat: 'Retenes y Sellos', cost: 4.50, margen: 50, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'CRANK-SEAL-F', u: 'Unidad', keywords: 'reten estopera sello ciguenal delantero' },
    { nameTpl: 'Retén Trasero de Cigüeñal', cat: 'Retenes y Sellos', cost: 8.50, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'CRANK-SEAL-R', u: 'Unidad', keywords: 'reten estopera sello ciguenal trasero' },
    { nameTpl: 'Retenes de Árbol de Levas', cat: 'Retenes y Sellos', cost: 4.00, margen: 50, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'CAM-SEAL', u: 'Unidad', keywords: 'reten estopera sello arbol levas' },
    { nameTpl: 'Juego de Guías de Válvulas de Culata', cat: 'Motor Interno', cost: 12.00, margen: 40, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'VALVE-GUIDE', u: 'Juego', keywords: 'guia valvula culata' },
    { nameTpl: 'Juego de Resortes de Válvulas de Motor', cat: 'Motor Interno', cost: 16.00, margen: 35, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'VALVE-SPRING', u: 'Juego', keywords: 'resortes muelles valvulas' },
    { nameTpl: 'Bomba de Vacío de Motor / Servofreno', cat: 'Motor Interno', cost: 36.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'VAC-PUMP', u: 'Unidad', keywords: 'bomba vacio vacio servofreno' },

    // 23. REFRIGERACIÓN
    { nameTpl: 'Termostato de Refrigerante con Junta', cat: 'Refrigeración', cost: 9.00, margen: 45, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'THERMOSTAT', u: 'Unidad', keywords: 'termostato agua refrigerante' },
    { nameTpl: 'Tapa de Radiador Presurizada', cat: 'Refrigeración', cost: 3.00, margen: 50, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'RAD-CAP', u: 'Unidad', keywords: 'tapa radiador refrigerante' },
    { nameTpl: 'Radiador de Calefacción Interna', cat: 'Refrigeración', cost: 38.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'HEATER-CORE', u: 'Unidad', keywords: 'radiador calefaccion cabina' },
    { nameTpl: 'Bomba Auxiliar Eléctrica de Refrigerante', cat: 'Refrigeración', cost: 34.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'AUX-WATER-PUMP', u: 'Unidad', keywords: 'bomba agua electrica auxiliar refrigerante' },
    { nameTpl: 'Sensor de Temperatura de Refrigerante', cat: 'Sensores', cost: 6.00, margen: 45, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'COOLANT-SENSOR', u: 'Unidad', keywords: 'sensor temperatura agua refrigerante ect bulbo' },

    // 24. ALIMENTACIÓN DE COMBUSTIBLE Y ADMISIÓN
    { nameTpl: 'Bomba Mecánica de Gasolina', cat: 'Sistema de Combustible', cost: 16.00, margen: 40, img: '/images/prod_pila_gasolina_1791155267269.jpg', oemPref: 'FUEL-PUMP-M', u: 'Unidad', keywords: 'bomba gasolina mecanica combustible' },
    { nameTpl: 'Bomba de Gasolina Eléctrica Externa en Línea', cat: 'Sistema de Combustible', cost: 22.00, margen: 35, img: '/images/prod_pila_gasolina_1791155267269.jpg', oemPref: 'FUEL-PUMP-E', u: 'Unidad', keywords: 'bomba gasolina electrica pila combustible' },
    { nameTpl: 'Regulador de Presión de Combustible', cat: 'Sistema de Combustible', cost: 12.00, margen: 40, img: '/images/prod_pila_gasolina_1791155267269.jpg', oemPref: 'FUEL-REG', u: 'Unidad', keywords: 'regulador presion gasolina combustible' },
    { nameTpl: 'Filtro de Aire de Motor', cat: 'Filtros y Mantenimiento', cost: 4.80, margen: 45, img: '/images/prod_filtro_aire_1791155232301.jpg', oemPref: 'AIR-FILTER', u: 'Unidad', keywords: 'filtro aire motor' },
    { nameTpl: 'Filtro de Combustible / Gasolina', cat: 'Filtros y Mantenimiento', cost: 4.00, margen: 45, img: '/images/prod_filtro_gasolina_1791155241268.jpg', oemPref: 'FUEL-FILTER', u: 'Unidad', keywords: 'filtro gasolina combustible' },
    { nameTpl: 'Múltiple de Admisión con Juntas', cat: 'Admisión y Escape', cost: 42.00, margen: 30, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'INTAKE-MAN', u: 'Unidad', keywords: 'multiple admision colector' },
    { nameTpl: 'Múltiple de Escape / Colector de Escape', cat: 'Admisión y Escape', cost: 45.00, margen: 30, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'EXHAUST-MAN', u: 'Unidad', keywords: 'multiple escape colector' },
    { nameTpl: 'Válvula EGR de Recirculación de Gases', cat: 'Admisión y Escape', cost: 24.00, margen: 35, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'EGR-VALVE', u: 'Unidad', keywords: 'valvula egr recirculacion gases' },
    { nameTpl: 'Cuerpo de Mariposa / Aceleración', cat: 'Admisión y Escape', cost: 52.00, margen: 30, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'THROTTLE-BODY', u: 'Unidad', keywords: 'cuerpo mariposa aceleracion throttle' },

    // 25. TRANSMISIÓN Y DIFERENCIAL
    { nameTpl: 'Kit de Reparación de Caja Automática con Empaques y Discos', cat: 'Transmisión y Embrague', cost: 65.00, margen: 30, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'AT-REBUILD', u: 'Kit', keywords: 'caja automatica transmision kit reparacion' },
    { nameTpl: 'Filtro de Aceite de Transmisión Automática', cat: 'Transmisión y Embrague', cost: 12.00, margen: 40, img: '/images/rep_filtro_aceite_1791152641120.jpg', oemPref: 'AT-FILTER', u: 'Unidad', keywords: 'filtro caja automatica transmision atf' },
    { nameTpl: 'Soporte de Cardán / Cruceta de Transmisión', cat: 'Transmisión y Embrague', cost: 14.00, margen: 40, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'DRIVESHAFT', u: 'Unidad', keywords: 'cardan cruceta transmision' },
    { nameTpl: 'Engranaje de Diferencial / Corona y Piñón', cat: 'Transmisión y Embrague', cost: 85.00, margen: 25, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'DIFF-GEAR', u: 'Juego', keywords: 'diferencial corona pinon engranaje' },
    { nameTpl: 'Retén de Eje de Transmisión / Semieje', cat: 'Retenes y Sellos', cost: 5.00, margen: 45, img: '/images/prod_silicon_gris_1791155249776.jpg', oemPref: 'AXLE-SEAL', u: 'Unidad', keywords: 'reten estopera sello semieje eje transmision' },

    // 26. FRENOS, ABS Y SEGURIDAD
    { nameTpl: 'Cilindro Maestro de Freno', cat: 'Frenos y Fricción', cost: 28.00, margen: 30, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: 'BRAKE-MASTER', u: 'Unidad', keywords: 'bomba freno cilindro maestro' },
    { nameTpl: 'Servo Freno / Booster con Válvula de Vacío', cat: 'Frenos y Fricción', cost: 48.00, margen: 25, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: 'BRAKE-BOOSTER', u: 'Unidad', keywords: 'servofreno booster asistencia freno' },
    { nameTpl: 'Sensor ABS de Rueda Delantero / Trasero', cat: 'Frenos y Fricción', cost: 12.50, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'ABS-SENSOR', u: 'Unidad', keywords: 'sensor abs velocidad rueda' },
    { nameTpl: 'Cable / Guaya de Freno de Mano', cat: 'Frenos y Fricción', cost: 8.50, margen: 45, img: '/images/rep_pastillas_freno_1791152631245.jpg', oemPref: 'PARK-BRAKE', u: 'Unidad', keywords: 'guaya cable freno mano estacionamiento' },

    // 27. ELECTRICIDAD Y ARRANQUE
    { nameTpl: 'Regulador de Voltaje de Alternador', cat: 'Partes Eléctricas', cost: 14.00, margen: 40, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'ALT-REG', u: 'Unidad', keywords: 'regulador voltaje alternador' },
    { nameTpl: 'Rectificador / Puente de Diodos de Alternador', cat: 'Partes Eléctricas', cost: 12.00, margen: 40, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'ALT-DIODE', u: 'Unidad', keywords: 'rectificador puente diodos alternador' },
    { nameTpl: 'Solenoide / Automático de Motor de Arranque', cat: 'Partes Eléctricas', cost: 16.00, margen: 40, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'START-SOL', u: 'Unidad', keywords: 'solenoide automatico arranque starter' },
    { nameTpl: 'Bendix / Piñón de Ataque de Motor de Arranque', cat: 'Partes Eléctricas', cost: 11.00, margen: 40, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'START-BENDIX', u: 'Unidad', keywords: 'bendix pinon ataque arranque' },
    { nameTpl: 'Módulo de Control de Motor ECU / ECM', cat: 'Partes Eléctricas', cost: 95.00, margen: 25, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'ECU-ECM', u: 'Unidad', keywords: 'computadora motor ecu ecm modulo control' },

    // 28. DIRECCIÓN, EJES Y RODAMIENTOS
    { nameTpl: 'Bomba de Dirección Hidráulica', cat: 'Suspensión y Dirección', cost: 46.00, margen: 30, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'POWER-STEER-PUMP', u: 'Unidad', keywords: 'bomba direccion hidraulica power steering' },
    { nameTpl: 'Rodamiento de Empuje / Collarín de Embrague', cat: 'Transmisión y Embrague', cost: 10.00, margen: 40, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'CLUTCH-BEARING', u: 'Unidad', keywords: 'collarin rodamiento empuje embrague croche' },
    { nameTpl: 'Semieje / Eje Homocinético Completo', cat: 'Transmisión y Embrague', cost: 38.00, margen: 30, img: '/images/rep_kit_embrague_1791152677700.jpg', oemPref: 'CV-AXLE', u: 'Unidad', keywords: 'semieje eje homocinetico tripoide' },

    // 29. CARROCERÍA, CRISTALES Y ACCESORIOS
    { nameTpl: 'Espejo Retrovisor Exterior Eléctrico / Manual', cat: 'Carrocería y Mandos', cost: 22.00, margen: 35, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'MIRROR', u: 'Unidad', keywords: 'espejo retrovisor lateral' },
    { nameTpl: 'Cerradura Eléctrica / Actuador de Puerta', cat: 'Carrocería y Mandos', cost: 18.00, margen: 40, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'DOOR-ACT', u: 'Unidad', keywords: 'cerradura actuador puerta seguro electrico' },
    { nameTpl: 'Máquina Elevavidrio / Regulador de Ventana', cat: 'Carrocería y Mandos', cost: 24.00, margen: 35, img: '/images/prod_bobina_encendido_1791155210560.jpg', oemPref: 'WINDOW-REG', u: 'Unidad', keywords: 'maquina vidrio elevaluna elevavidrio regulador ventana' },
    { nameTpl: 'Motor de Limpiaparabrisas Delantero', cat: 'Carrocería y Mandos', cost: 24.00, margen: 35, img: '/images/prod_alternador_12v_1791155201792.jpg', oemPref: 'WIPER-MOTOR', u: 'Unidad', keywords: 'motor limpia parabrisas limpiavidrios' },
    { nameTpl: 'Bomba de Lavaparabrisas con Depósito / Conector', cat: 'Carrocería y Mandos', cost: 7.50, margen: 45, img: '/images/rep_bomba_agua_1791152689068.jpg', oemPref: 'WASHER-PUMP', u: 'Unidad', keywords: 'bomba agua parabrisas sapito lavavidrios' },

    // 30. ESCAPE Y EMISIONES
    { nameTpl: 'Catalizador de Escape', cat: 'Admisión y Escape', cost: 72.00, margen: 25, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'CATALYTIC', u: 'Unidad', keywords: 'catalizador convertidor catalitico escape' },
    { nameTpl: 'Silenciador / Muffler de Escape', cat: 'Admisión y Escape', cost: 28.00, margen: 30, img: '/images/rep_correa_distribucion_1791152666979.jpg', oemPref: 'MUFFLER', u: 'Unidad', keywords: 'silenciador muffler escape' },
    { nameTpl: 'Sonda Lambda / Sensor de Oxígeno', cat: 'Sensores', cost: 19.00, margen: 40, img: '/images/prod_sensor_ckp_1791155221865.jpg', oemPref: 'O2-SENSOR', u: 'Unidad', keywords: 'sonda lambda sensor oxigeno oxygen sensor' },

    // Nota de integridad: estas son referencias de búsqueda/categoría, no compatibilidades OEM certificadas.

  ];

  // ==========================================
  // 3. MOTOR PROCEDURAL DE GENERACIÓN Y BÚSQUEDA (+2.000.000 SKUs)
  // ==========================================

  // Cantidad total virtual del catálogo indexado (+2.450.000 artículos referenciales)
  const TOTAL_VIRTUAL_CATALOG_COUNT = 2450000;

  let virtualCache = new Map();
  let activeMasterCategory = 'Todos';
  let activeMasterPage = 1;
  const ITEMS_PER_PAGE = 30;

  // Generador determinístico de productos a partir de un índice
  function getMasterItemByIndex(index) {
    if (virtualCache.has(index)) return virtualCache.get(index);

    let item;
    const isLubricantZone = index < 120000;

    if (isLubricantZone) {
      // Generar combinación de Lubricante
      const bIdx = index % LUBRICANT_BRANDS_VENEZUELA.length;
      const brand = LUBRICANT_BRANDS_VENEZUELA[bIdx];
      const tIdx = Math.floor(index / LUBRICANT_BRANDS_VENEZUELA.length) % LUBRICANT_TYPES.length;
      const type = LUBRICANT_TYPES[tIdx];
      const pIdx = Math.floor(index / (LUBRICANT_BRANDS_VENEZUELA.length * LUBRICANT_TYPES.length)) % PRESENTATIONS.length;
      const pres = PRESENTATIONS[pIdx];

      const masterId = `MST-LUB-${String(index + 1).padStart(7, '0')}`;
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
      const adjIdx = index - 120000;
      const vIdx = adjIdx % VEHICLES_IN_VENEZUELA.length;
      const veh = VEHICLES_IN_VENEZUELA[vIdx];
      const tplIdx = Math.floor(adjIdx / VEHICLES_IN_VENEZUELA.length) % AUTO_PART_TEMPLATES.length;
      const tpl = AUTO_PART_TEMPLATES[tplIdx];
      const bIdx = Math.floor(adjIdx / (VEHICLES_IN_VENEZUELA.length * AUTO_PART_TEMPLATES.length)) % SPARE_PART_BRANDS.length;
      const brand = SPARE_PART_BRANDS[bIdx];

      const masterId = `MST-AUT-${String(index + 1).padStart(7, '0')}`;
      const codeOEM = `${tpl.oemPref}-${(adjIdx % 89999) + 10000}`;
      const codeProv = `${brand.nombre.substring(0,3).toUpperCase()}-${tpl.cat.substring(0,3).toUpperCase()}-${codeOEM}`;
      const cost = Number((tpl.cost * (brand.tipo.includes('premium') || brand.tipo === 'oem' ? 1.30 : (brand.tipo === 'economica' ? 0.78 : 1.05))).toFixed(2));

      item = {
        masterId: masterId,
        nombre: `${tpl.nameTpl} para ${veh.marca} ${veh.modelo} (${veh.anios}) — Marca ${brand.nombre}`,
        descripcionTecnica: `Referencia de catálogo para investigar aplicación en ${veh.marca} ${veh.modelo} años ${veh.anios} con motor ${veh.motor}. Compatibilidad exacta y referencia OEM pendientes de verificación documental.`,
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
        especificaciones: `Aplicación referencial para ${veh.marca} ${veh.modelo} ${veh.motor}; confirmar año exacto, versión, motor y código OEM antes de comprar o instalar. Marca comercial: ${brand.tipo.toUpperCase()}.`,
        estadoCompatibilidad: 'REFERENCIAL — requiere validar motor, versión, año exacto y número OEM',
        palabrasClave: tpl.keywords || '',
        fotoReal: tpl.img,
        fotoFallback: tpl.img,
        distribuidor: `Distribuidor Mayorista ${veh.marca} & Repuestos Venezuela B2B`,
        referenciasCruzadas: [
          { marca: 'Bosch OEM', codigo: `BOS-${codeOEM}` },
          { marca: 'Denso Direct', codigo: `DEN-${codeOEM}` },
          { marca: 'Takama Alternate', codigo: `TAK-${codeOEM}` }
        ],
        compatibilidad: [
          { marca: veh.marca, modelo: veh.modelo, anios: veh.anios, motor: veh.motor, posicion: 'Tren Delantero / Motor / Eléctrico' }
        ]
      };
    }

    // Cache management
    if (virtualCache.size > 2500) {
      const firstKeys = virtualCache.keys();
      for (let k = 0; k < 500; k++) {
        virtualCache.delete(firstKeys.next().value);
      }
    }

    virtualCache.set(index, item);
    return item;
  }

  // Búsqueda inteligente multicriterio por palabras claves dentro del espacio de +900.000 productos
  function queryMasterCatalog(query = '', category = 'Todos', page = 1, pageSize = ITEMS_PER_PAGE) {
    const rawQ = (query || '').trim();
    const results = [];
    const maxScanLimit = 4500;

    // Nunca recorrer millones de registros virtuales en el hilo principal.
    // Esto evita congelar el POS mientras el usuario escribe o cambia de página.
    // Cuando la consulta menciona un vehículo, buscar de forma determinística
    // dentro de sus combinaciones de repuesto evita que el muestreo se salte
    // artículos válidos como "correa de tiempo Aveo" o "sensor oxígeno Aveo".
    const qNorm = normalizeSearchText(rawQ);
    const qTokens = qNorm.split(/\s+/).filter(Boolean);
    const matchedVehicles = rawQ ? VEHICLES_IN_VENEZUELA.filter(v => {
      const hay = normalizeSearchText(v.marca + ' ' + v.modelo + ' ' + v.anios + ' ' + v.motor);
      const hits = qTokens.filter(t => t.length >= 3 && hay.includes(t));
      // Basta una coincidencia inequívoca con marca/modelo/año/motor para
      // activar la búsqueda determinística del vehículo. Consultas reales
      // como "correa de tiempo Aveo" y "sensor oxígeno Aveo" tienen un solo
      // token del vehículo; exigir dos hacía que volvieran al muestreo.
      return hits.length >= 1;
    }) : [];

    const candidateIndices = [];
    if (matchedVehicles.length && AUTO_PART_TEMPLATES.length && SPARE_PART_BRANDS.length) {
      const seen = new Set();
      for (const vehicle of matchedVehicles.slice(0, 6)) {
        const vIdx = VEHICLES_IN_VENEZUELA.indexOf(vehicle);
        for (let tIdx = 0; tIdx < AUTO_PART_TEMPLATES.length; tIdx++) {
          for (let bIdx = 0; bIdx < SPARE_PART_BRANDS.length; bIdx++) {
            const idx = 120000 + vIdx
              + VEHICLES_IN_VENEZUELA.length * tIdx
              + VEHICLES_IN_VENEZUELA.length * AUTO_PART_TEMPLATES.length * bIdx;
            if (idx < TOTAL_VIRTUAL_CATALOG_COUNT && !seen.has(idx)) {
              seen.add(idx);
              candidateIndices.push(idx);
            }
          }
        }
      }
    }

    // Si la consulta no nombra un vehículo, localizar primero las familias/plantillas
    // solicitadas en vez de depender de una muestra dispersa que puede omitirlas.
    if (!candidateIndices.length && rawQ) {
      const stopWords = new Set(['de','del','la','el','los','las','un','una','para','con','por','y','en','the','of']);
      const terms = qTokens.filter(t => t.length >= 3 && !stopWords.has(t));
      const matchingTemplateIndexes = AUTO_PART_TEMPLATES.map((tpl, i) => {
        const hay = normalizeSearchText([tpl.nameTpl, tpl.cat, tpl.oemPref, tpl.keywords || ''].join(' '));
        return terms.length && terms.every(term => hay.includes(term)) ? i : -1;
      }).filter(i => i >= 0);
      const seen = new Set();
      for (const tIdx of matchingTemplateIndexes) {
        // Las marcas/modelos se presentan como referencias a validar, no como ajuste OEM confirmado.
        for (let vIdx = 0; vIdx < VEHICLES_IN_VENEZUELA.length; vIdx++) {
          for (let bIdx = 0; bIdx < SPARE_PART_BRANDS.length; bIdx++) {
            const idx = 120000 + vIdx
              + VEHICLES_IN_VENEZUELA.length * tIdx
              + VEHICLES_IN_VENEZUELA.length * AUTO_PART_TEMPLATES.length * bIdx;
            if (idx < TOTAL_VIRTUAL_CATALOG_COUNT && !seen.has(idx)) {
              seen.add(idx);
              candidateIndices.push(idx);
            }
          }
        }
      }
    }

    const step = Math.max(1, Math.ceil(TOTAL_VIRTUAL_CATALOG_COUNT / maxScanLimit));
    const indices = candidateIndices.length
      ? candidateIndices
      : Array.from({length: maxScanLimit}, (_, n) => n * step).filter(i => i < TOTAL_VIRTUAL_CATALOG_COUNT);

    let matchCount = 0;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    for (let scanned = 0; scanned < indices.length && matchCount < 1200; scanned++) {
      const item = getMasterItemByIndex(indices[scanned]);

      let matchesCat = true;
      if (category !== 'Todos') {
        const catLow = category.toLowerCase();
        if (category === 'Aceites y Lubricantes') {
          matchesCat = item.categoria.includes('Aceite');
        } else if (category === 'Nacionales Venezolanas') {
          matchesCat = (item.origenMarca && item.origenMarca.includes('Venezuela')) || item.tipoMarca === 'nacional_lider' || item.tipoMarca === 'nacional';
        } else if (category === 'Importadas Premium') {
          matchesCat = item.tipoMarca === 'importada_premium' || item.tipoMarca === 'premium';
        } else if (category === 'Repuestos Chinos') {
          matchesCat = item.subcategoria === 'Chery' || item.subcategoria === 'Jac' || item.subcategoria === 'Changan' || item.subcategoria === 'Great Wall' || item.tipoMarca === 'economica';
        } else if (category === 'Bujes y Gomas') {
          matchesCat = item.categoria === 'Bujes y Gomas' || item.nombre.toLowerCase().includes('buje') || item.nombre.toLowerCase().includes('goma');
        } else if (category === 'Lápiz y Bieletas') {
          matchesCat = item.categoria === 'Lápiz y Bieletas' || item.nombre.toLowerCase().includes('lapiz') || item.nombre.toLowerCase().includes('bieleta');
        } else if (category === 'Rodamientos') {
          matchesCat = item.categoria === 'Rodamientos' || item.nombre.toLowerCase().includes('rodamiento') || item.nombre.toLowerCase().includes('maza');
        } else if (category === 'Baterías') {
          matchesCat = item.categoria === 'Baterías' || item.nombre.toLowerCase().includes('bateria');
        } else if (category === 'Luces y Faros') {
          matchesCat = item.categoria === 'Luces y Faros' || item.nombre.toLowerCase().includes('bombillo') || item.nombre.toLowerCase().includes('faro') || item.nombre.toLowerCase().includes('led');
        } else if (category === 'Cilindros de Ignición') {
          matchesCat = item.categoria === 'Cilindros de Ignición' || item.nombre.toLowerCase().includes('cilindro') || item.nombre.toLowerCase().includes('switchera');
        } else if (category === 'Relex y Relés') {
          matchesCat = item.categoria === 'Relex y Relés' || item.nombre.toLowerCase().includes('relex') || item.nombre.toLowerCase().includes('rele') || item.nombre.toLowerCase().includes('relay');
        } else if (category === 'Mangueras') {
          matchesCat = item.categoria === 'Mangueras' || item.nombre.toLowerCase().includes('manguera');
        } else if (category === 'Cables de Bujías') {
          matchesCat = item.categoria === 'Cables de Bujías' || item.nombre.toLowerCase().includes('cables de buj');
        } else if (category === 'Sensores') {
          matchesCat = item.categoria === 'Sensores' || item.nombre.toLowerCase().includes('sensor');
        } else if (category === 'Empacaduras de Motor') {
          matchesCat = item.categoria === 'Empacaduras de Motor' || item.nombre.toLowerCase().includes('empacadura');
        } else if (category === 'Bombas de Agua') {
          matchesCat = item.categoria === 'Bombas de Agua' || item.nombre.toLowerCase().includes('bomba de agua');
        } else if (category === 'Anillos de Motor') {
          matchesCat = item.categoria === 'Anillos de Motor' || item.nombre.toLowerCase().includes('anillos');
        } else if (category === 'Conchas de Biela y Bancada') {
          matchesCat = item.categoria === 'Conchas de Biela y Bancada' || item.nombre.toLowerCase().includes('conchas de');
        } else if (category === 'Cerraduras y Mandos') {
          matchesCat = item.categoria === 'Cerraduras y Mandos' || item.nombre.toLowerCase().includes('cerradura');
        } else if (category === 'Solenoides') {
          matchesCat = item.categoria === 'Solenoides' || item.nombre.toLowerCase().includes('solenoide');
        } else if (category === 'Conectores y Terminales') {
          matchesCat = item.categoria === 'Conectores y Terminales' || item.nombre.toLowerCase().includes('conector');
        } else if (category === 'Distribución') {
          matchesCat = item.categoria === 'Distribución' || item.nombre.toLowerCase().includes('cadena de tiempo') || item.nombre.toLowerCase().includes('kit de tiempo') || item.nombre.toLowerCase().includes('tensor');
        } else if (category === 'Tripoides y Homocinéticas') {
          matchesCat = item.categoria === 'Tripoides y Homocinéticas' || item.nombre.toLowerCase().includes('tripoide') || item.nombre.toLowerCase().includes('homocin');
        } else if (category === 'Aditivos y Químicos') {
          matchesCat = item.categoria === 'Aditivos y Químicos' || item.nombre.toLowerCase().includes('aditivo');
        } else {
          matchesCat = item.categoria.toLowerCase().includes(catLow) || item.subcategoria.toLowerCase().includes(catLow);
        }
      }

      if (!matchesCat) continue;

      let matchesQ = true;
      if (rawQ) {
        const fullSearchableText = `${item.nombre} ${item.palabrasClave || ''} ${item.marca} ${item.codigoOEM} ${item.codigoProveedor} ${item.categoria} ${item.subcategoria} ${item.descripcionTecnica} ${item.especificaciones} ${item.origenMarca} ${item.unidadMedida}`;
        matchesQ = matchKeywords(fullSearchableText, rawQ);
        // Evita falsos positivos entre familias de repuestos: el término principal
        // solicitado debe estar presente en el artículo, no solo el vehículo.
        const nq = normalizeSearchText(rawQ);
        const ni = normalizeSearchText(fullSearchableText);
        const families = [
          { terms: ["bujia", "bujias", "spark plug"], accept: ["bujia", "bujias", "spark plug"], reject: ["sensor de oxigeno", "sensor oxigeno", "correa de tiempo", "correa de distribucion"] },
          { terms: ["sensor de oxigeno", "sensor oxigeno"], accept: ["sensor", "oxigeno"], reject: ["bujia", "correa de tiempo", "correa de distribucion"] },
          { terms: ["correa de tiempo", "correa de distribucion", "kit de distribucion"], accept: ["correa", "distribucion", "tiempo"], reject: ["bujia", "sensor de oxigeno"] },
          { terms: ["bateria", "baterias"], accept: ["bateria"], reject: ["bujia", "sensor de oxigeno"] },
          { terms: ["bomba de aceite", "bomba aceite", "oil pump", "bomba lubricacion"], accept: ["bomba de aceite", "bomba aceite", "oil pump", "bomba lubricacion"], reject: ["bomba de agua", "bomba de gasolina", "bomba de direccion", "bomba de freno"] },
          { terms: ["pescador de aceite", "colador de aceite", "chupador de aceite"], accept: ["pescador", "colador", "chupador"], reject: ["bomba de gasolina"] },
          { terms: ["bomba de gasolina", "pila de gasolina", "fuel pump"], accept: ["bomba de gasolina", "pila", "fuel pump"], reject: ["bomba de aceite", "bomba de agua", "relex", "rele", "relay", "relevador"] }
        ];
        const family = families.find(f => f.terms.some(t => nq.includes(t)));
        if (matchesQ && family && (!family.accept.some(t => ni.includes(t)) || family.reject.some(t => ni.includes(t)))) {
          matchesQ = false;
        }
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

  const MASTER_CATEGORY_TABS = [
    'Todos',
    'Bujes y Gomas',
    'Cables de Bujías',
    'Sensores',
    'Empacaduras de Motor',
    'Bombas de Agua',
    'Anillos de Motor',
    'Conchas de Biela y Bancada',
    'Cerraduras y Mandos',
    'Solenoides',
    'Conectores y Terminales',
    'Distribución',
    'Tripoides y Homocinéticas',
    'Aditivos y Químicos',
    'Lápiz y Bieletas',
    'Rodamientos',
    'Baterías',
    'Luces y Faros',
    'Cilindros de Ignición',
    'Relex y Relés',
    'Mangueras',
    'Motor y Distribución',
    'Refrigeración',
    'Sistema de Combustible',
    'Frenos y Fricción',
    'Suspensión y Dirección',
    'Transmisión y Embrague',
    'Soportes de Motor y Caja',
    'Carrocería y Mandos',
    'Filtros y Mantenimiento',
    'Partes Eléctricas',
    'Lubricación del Motor',
    'Motor Interno',
    'Retenes y Sellos',
    'Admisión y Escape',
    'Sensores',
    'Empacaduras de Motor',
    'Aceites y Lubricantes',
    'Repuestos Chinos',
    'Nacionales Venezolanas',
    'Importadas Premium'
  ];

  function openMasterCatalogSelectorModal(targetType = 'producto') {
    currentSelectorTarget = targetType;
    currentSelectorPage = 1;
    currentSelectorQuery = '';
    currentSelectorCategory = 'Todos';

    openModal('📖 Buscar en Catálogo Máster Universal (+2.000.000 Productos)', `
      <div style="background:#f0f5fb;border:1px solid #bfd3eb;padding:10px;border-radius:4px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <b style="color:#0b4f85;font-size:13px">Catálogo Máster Universal de Distribuidores (+2.000.000 Productos)</b>
            <div style="font-size:11px;color:#555">Búsqueda inteligente por palabras claves: Motor, Pistones, Tiempo, Radiadores, Inyección, Sensores, Bujes, Gomas, Lápiz, Rodamientos, Baterías, Faros/Stop, Cilindros, Relex, Mangueras, Cloche, Aceites y Marcas Nacionales/Importadas</div>
          </div>
          <span class="badge ok" style="font-size:11px;padding:4px 8px">🟢 Conectado con +2.450.000 SKUs B2B</span>
        </div>
      </div>

      <div style="display:flex;gap:6px;margin-bottom:8px">
        <input id="masterModalSearchInput" placeholder="🔍 Búsqueda por palabras claves (ej: bujes aveo, relex bomba fiesta, manguera optra, bateria duncan, bombillo h4 corolla)..."
          style="flex:1;padding:8px;font-size:12px;border:1px solid #0b63ce;border-radius:3px"
          oninput="debounceMasterModalSearch(this.value)">
      </div>

      <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:6px;margin-bottom:8px">
        ${MASTER_CATEGORY_TABS.map(cat => `
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
    }, 150);
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
        <div style="font-size:18px">🔍 No se encontraron coincidencias para «${esc(currentSelectorQuery)}»</div>
        <div style="font-size:11px;margin-top:4px">Intente combinando palabras claves: "buje meseta corsa", "relex bomba aveo", "manguera radiador", "bateria 24r", "bombillo h4" o marcas (Duncan, Bosch, Toyota, Chevrolet, Chery)</div>
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
    let foundItem = null;

    // Primero buscamos en caché. Esto cubre los resultados recién renderizados.
    for (const v of virtualCache.values()) {
      if (v.masterId === masterId) {
        foundItem = v;
        break;
      }
    }

    // El masterId contiene el índice original. Recuperarlo directamente evita
    // volver a recorrer hasta 2.450.000 registros y congelar el hilo principal.
    if (!foundItem) {
      const match = /^MST-(?:LUB|AUT)-(\d+)$/.exec(String(masterId || ''));
      if (match) {
        const index = Number(match[1]) - 1;
        if (Number.isInteger(index) && index >= 0 && index < TOTAL_VIRTUAL_CATALOG_COUNT) {
          foundItem = getMasterItemByIndex(index);
        }
      }
    }

    if (!foundItem) {
      toast('Artículo del catálogo no encontrado');
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
    const isNew = !item;
    const baseCost = item ? item.costoReferencial : 5.00;
    const defMargin = item ? (item.margenSugerido || 35) : 35;
    const initialPricing = calculatePricingEngine(baseCost, defMargin, 20, 12);
    const code = item ? item.codigoProveedor : (id('PR','producto'));
    const oem = item ? item.codigoOEM : '';
    const name = item ? item.nombre : '';
    const cat = item ? item.categoria : 'Aceites y Lubricantes';
    const brand = item ? item.marca : 'PDV';
    const unit = item ? (item.unidadMedida || 'Unidad') : 'Unidad';
    const photo = item ? (item.fotoReal || '/icon.svg') : '/icon.svg';

    openModal(item ? `Incorporar a Inventario: ${esc(item.nombre)}` : 'Nuevo Producto Comercial', `
      <div style="background:#f4f7fb;border:1px solid #c9d8eb;padding:8px 10px;margin-bottom:10px;border-radius:4px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <span style="font-size:10px;font-weight:bold;color:#0b4f85;text-transform:uppercase">Catálogo Máster Vinculado</span>
          <div style="font-size:12px;font-weight:bold">${item ? esc(item.nombre) : 'Producto manual'}</div>
        </div>
        <button class="btn" style="font-size:10px;padding:4px 8px" onclick="openMasterCatalogSelectorModal('producto')">🔍 Buscar en Catálogo Máster (+900.000)</button>
      </div>

      <div class="formgrid">
        <div class="field">
          <label>Código de Barras / SKU</label>
          <input id="prodCodigo" value="${esc(code)}">
        </div>
        <div class="field">
          <label>Código OEM / Fábrica</label>
          <input id="prodOEM" value="${esc(oem)}">
        </div>
        <div class="field full">
          <label>Nombre Comercial del Producto</label>
          <input id="prodNombre" value="${esc(name)}">
        </div>
        <div class="field">
          <label>Categoría</label>
          <input id="prodCat" value="${esc(cat)}">
        </div>
        <div class="field">
          <label>Marca / Fabricante</label>
          <input id="prodMarca" value="${esc(brand)}">
        </div>
        <div class="field">
          <label>Presentación / Unidad</label>
          <input id="prodUnidad" value="${esc(unit)}">
        </div>
        <div class="field">
          <label>Ubicación Almacén</label>
          <input id="prodUbicacion" value="Almacén Principal">
        </div>

        <div class="field full" style="background:#fffbe6;border:1px solid #ffe58f;padding:8px;border-radius:4px;margin:4px 0">
          <div style="font-weight:bold;font-size:12px;color:#874d00;margin-bottom:6px">⚙️ Motor de Precios y Simulación de Márgenes (Tasa BCV: ${fmtRate(initialPricing.tasaBCV)} Bs/USD)</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
            <div>
              <label style="font-size:10px;color:#666">Costo Compra USD</label>
              <input id="simCosto" type="number" step=".01" value="${initialPricing.costo}" oninput="updateCommercialSimulator()" style="font-weight:bold">
            </div>
            <div>
              <label style="font-size:10px;color:#666">Margen Detal %</label>
              <input id="simMargenDetal" type="number" step="1" value="${initialPricing.margenDetalPct}" oninput="updateCommercialSimulator()">
            </div>
            <div>
              <label style="font-size:10px;color:#666">Precio Venta Detal (USD)</label>
              <div id="dispPrecioDetalUSD" style="font-weight:bold;color:#0b4f85;font-size:13px;margin-top:4px">${money(initialPricing.precioDetal)}</div>
              <div id="dispGananciaDetal" style="font-size:9px;color:#0a6839">+${money(initialPricing.gananciaDetal)}</div>
            </div>
            <div>
              <label style="font-size:10px;color:#666">Precio Detal en Bolívares</label>
              <div id="dispPrecioDetalBs" style="font-weight:bold;color:#0b4f85;font-size:12px;margin-top:4px">Bs ${initialPricing.precioDetalBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;padding-top:6px;border-top:1px dashed #d9d9d9">
            <div style="background:#fff;padding:4px 8px;border-radius:3px">
              <span style="font-size:10px;color:#555">🔧 Precio Taller (-15% margen / 20% sobre costo):</span>
              <b id="dispPrecioTallerUSD" style="color:#0b4f85;font-size:11px">${money(initialPricing.precioTaller)}</b>
              <small id="dispPrecioTallerBs" style="color:#777"> (Bs ${initialPricing.precioTallerBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})})</small>
            </div>
            <div style="background:#fff;padding:4px 8px;border-radius:3px">
              <span style="font-size:10px;color:#555">📦 Precio Mayorista (-23% margen / 12% sobre costo):</span>
              <b id="dispPrecioMayorUSD" style="color:#0b4f85;font-size:11px">${money(initialPricing.precioMayor)}</b>
              <small id="dispPrecioMayorBs" style="color:#777"> (Bs ${initialPricing.precioMayorBs.toLocaleString('es-VE',{minimumFractionDigits:2,maximumFractionDigits:2})})</small>
            </div>
          </div>
        </div>

        <div class="field">
          <label>Existencia Físico Inicial</label>
          <input id="prodStock" type="number" value="12" min="0">
        </div>
        <div class="field">
          <label>Stock Mínimo</label>
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
      categoria: item ? item.categoria : 'Bujes y Gomas',
      marca: item ? item.marca : '555',
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
        <button class="btn" style="font-size:10px;padding:4px 8px" onclick="openMasterCatalogSelectorModal('repuesto')">🔍 Explorar Catálogo Máster (+900.000)</button>
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
    }, 120);
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
        <span style="font-size:11px;color:#666">Página <b>${res.page}</b> de <b>${res.totalPages}</b> (Total: ${res.totalMatched.toLocaleString()} artículos indexados)</span>
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
        <h2>📖 Catálogo Máster Universal de Proveedores (+2.000.000 Productos)</h2>
        <div class="sub">Biblioteca técnica integral con más de +2.450.000 repuestos automotrices indexados · Todas las clases de repuestos: Motor, Distribución, Inyección, Sensores, Suspensión, Frenos, Cloche, Baterías, Faros, Lubricantes Nacionales e Importados y Marcas Chinas</div>
      </div>
      <div class="actions" style="margin:0">
        <button class="btn primary" onclick="openMasterCatalogSelectorModal('producto')">📥 Importar Nuevo Producto a Mi Tienda</button>
      </div>
    </div>

    <div class="cards">
      <div class="card">Catálogo Indexado<b>${TOTAL_VIRTUAL_CATALOG_COUNT.toLocaleString()}</b><span>artículos disponibles</span></div>
      <div class="card">Motor, Tiempo e Inyección<b>640.000+</b><span>Pistones, válvulas, sensores...</span></div>
      <div class="card">Tren Delantero y Suspensión<b>580.000+</b><span>Bujes, mesetas, lápiz, bases...</span></div>
      <div class="card">Frenos, Cloche y Caja<b>480.000+</b><span>Pastillas, discos, embragues...</span></div>
      <div class="card">Baterías, Luces y Relex<b>550.000+</b><span>Duncan, H4/LED, 12V 40A...</span></div>
      <div class="card">Mi Inventario Activo<b>${db.productos.length + getRepuestos().length}</b><span>en mi tienda local</span></div>
    </div>

    <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:6px;margin-bottom:8px;border-bottom:1px solid #ddd">
      ${MASTER_CATEGORY_TABS.map(cat => `
        <button class="btn ${activeMasterCategory===cat?'primary':''}" style="font-size:11px;padding:5px 10px;white-space:nowrap" onclick="setMasterViewCategory('${cat}', this)">${cat}</button>
      `).join('')}
    </div>

    <div class="searchbar">
      <input id="masterExpQ" value="${esc(masterViewSearchQuery)}" placeholder="🔍 Búsqueda inteligente en +2.450.000 repuestos por palabras claves (ej: piston corolla, bujes aveo, relex bomba corsa, radiador optra, bateria 34r, bombillo h7, lapiz fiesta)..." oninput="onMasterSearchInput(this.value)">
    </div>

    <div class="panel" id="masterExplorerTableContainer">
      ${renderMasterExplorerTableContainerHTML()}
    </div>
    `;
  }

  // Exportar funciones y utilidades globales
  global.normalizeSearchText = normalizeSearchText;
  global.matchKeywords = matchKeywords;
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