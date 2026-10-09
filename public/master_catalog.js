// SIFER360 - Catálogo técnico de repuestos con referencias OEM publicadas
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

const VERIFIED_MASTER_CATALOG = [
  {
    "masterId": "MST-VER-0001",
    "nombre": "Barra estabilizadora — bieleta / link",
    "categoria": "Lápiz y Bieletas",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "00210",
    "codigoOEM": "96275798 / 96391875",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Referencias OE 96275798 y 96391875 publicadas en catálogo Orjin para suspensión Chevrolet Aveo T200/T250. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "bieleta lapiz link barra estabilizadora suspension aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Barra estabilizadora"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0002",
    "nombre": "Terminal de dirección izquierdo",
    "categoria": "Dirección",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "00211",
    "codigoOEM": "93740622 / 93740722",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Referencias OE 93740622 y 93740722 publicadas en catálogo Orjin para la familia Aveo T200/T250. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "terminal direccion tie rod end izquierdo aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Dirección izquierda"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0003",
    "nombre": "Terminal de dirección derecho",
    "categoria": "Dirección",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "00212",
    "codigoOEM": "93740623 / 93740723",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Referencias OE 93740623 y 93740723 publicadas en catálogo Orjin para la familia Aveo T200/T250. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "terminal direccion tie rod end derecho aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Dirección derecha"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0004",
    "nombre": "Articulación axial de dirección",
    "categoria": "Dirección",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "01860",
    "codigoOEM": "96535300",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 96535300 publicado en catálogo Orjin; cotejar dimensiones y variante con la pieza. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "axial direccion barra axial aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Dirección"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0005",
    "nombre": "Meseta / brazo de control izquierdo completo",
    "categoria": "Suspensión",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "01798",
    "codigoOEM": "95479764 / 96815893",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Referencias OE 95479764 y 96815893 publicadas en catálogo Orjin para brazo de control izquierdo. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "meseta tijera brazo control suspension izquierda aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Delantera izquierda"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0006",
    "nombre": "Meseta / brazo de control derecho completo",
    "categoria": "Suspensión",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "01799",
    "codigoOEM": "95479765 / 96815894",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Referencias OE 95479765 y 96815894 publicadas en catálogo Orjin para brazo de control derecho. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "meseta tijera brazo control suspension derecha aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Delantera derecha"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0007",
    "nombre": "Rótula inferior de suspensión",
    "categoria": "Suspensión",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "00204",
    "codigoOEM": "96535089",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 96535089 publicado en catálogo Orjin para rótula de suspensión. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "rotula inferior suspension ball joint aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Suspensión delantera"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0008",
    "nombre": "Buje de suspensión — pequeño",
    "categoria": "Bujes y Gomas",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "02011",
    "codigoOEM": "96535087",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 96535087 publicado en catálogo Orjin como buje pequeño. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "buje goma meseta suspension pequeno aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Suspensión"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0009",
    "nombre": "Buje de suspensión — grande",
    "categoria": "Bujes y Gomas",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "02012",
    "codigoOEM": "96653381",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 96653381 publicado en catálogo Orjin como buje grande. Aplicación exacta, versión y lado deben confirmarse por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "buje goma meseta suspension grande aveo",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T200 / T250",
        "anios": "Según versión del catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Suspensión"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0010",
    "nombre": "Barra estabilizadora",
    "categoria": "Suspensión",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "05389",
    "codigoOEM": "95465758",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 95465758 publicado para Chevrolet Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "barra estabilizadora aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Delantera"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0011",
    "nombre": "Terminal de dirección",
    "categoria": "Dirección",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "06059",
    "codigoOEM": "95218373",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 95218373 publicado para Chevrolet Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "terminal direccion aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Dirección"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0012",
    "nombre": "Terminal de dirección",
    "categoria": "Dirección",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "06061",
    "codigoOEM": "95952936",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 95952936 publicado para Chevrolet Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "terminal direccion aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Dirección"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0013",
    "nombre": "Articulación axial de dirección",
    "categoria": "Dirección",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "04688",
    "codigoOEM": "1609213 / 95952929",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Referencias 1609213 y 95952929 publicadas para articulación axial Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "axial direccion aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Dirección"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0014",
    "nombre": "Articulación axial de dirección",
    "categoria": "Dirección",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "06060",
    "codigoOEM": "95218372",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 95218372 publicado para articulación axial Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "axial direccion aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Dirección"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0015",
    "nombre": "Meseta / brazo de control izquierdo completo",
    "categoria": "Suspensión",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "06065",
    "codigoOEM": "95017035",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 95017035 publicado para brazo de control izquierdo Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "meseta brazo control izquierda aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Delantera izquierda"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0016",
    "nombre": "Meseta / brazo de control derecho completo",
    "categoria": "Suspensión",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "06066",
    "codigoOEM": "95017036",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 95017036 publicado para brazo de control derecho Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "meseta brazo control derecha aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Delantera derecha"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0017",
    "nombre": "Rótula de suspensión",
    "categoria": "Suspensión",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "04684",
    "codigoOEM": "352532 / 95916024",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Referencias 352532 y 95916024 publicadas para rótula Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "rotula suspension aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Suspensión"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0018",
    "nombre": "Buje de suspensión — pequeño",
    "categoria": "Bujes y Gomas",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "06069",
    "codigoOEM": "95228670",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 95228670 publicado para buje pequeño Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "buje suspension pequeno aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Suspensión"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "masterId": "MST-VER-0019",
    "nombre": "Buje de suspensión — grande",
    "categoria": "Bujes y Gomas",
    "subcategoria": "Suspensión y dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoProveedor": "06070",
    "codigoOEM": "95217519",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "OE 95217519 publicado para buje grande Aveo T300. Confirmar versión exacta por VIN.",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "estadoCompatibilidad": "REFERENCIA PUBLICADA — CONFIRMAR POR VIN",
    "palabrasClave": "buje suspension grande aveo t300",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo T300",
        "anios": "03/2011 en adelante según catálogo",
        "motor": "Confirmar por VIN",
        "posicion": "Suspensión"
      }
    ],
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente"
  },
  {
    "nombre": "Bomba de aceite de motor — GM Genuine Parts",
    "categoria": "Lubricación del Motor",
    "subcategoria": "Motor",
    "marca": "GM Genuine Parts / ACDelco",
    "codigoProveedor": "GM-25182606",
    "codigoOEM": "25182606",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Bomba de aceite original GM. La página oficial de Chevrolet indica aplicación Aveo Hatchback/Sedan LS/LT, años 2004–2008.",
    "especificaciones": "Fuente oficial GM: https://parts.chevrolet.com/product/gm-genuine-parts-oil-pump-25182606. Sin precio local ni stock; confirmar motor, versión y VIN antes de comprar.",
    "estadoCompatibilidad": "APLICACIÓN PUBLICADA POR GM — confirmar VIN",
    "palabrasClave": "bomba de aceite bomba aceite oil pump aveo lubricacion motor 25182606",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo Hatchback / Sedan LS, LT",
        "anios": "2004–2008 según GM",
        "motor": "Confirmar por VIN",
        "posicion": "Lubricación del motor"
      }
    ],
    "fuenteUrl": "https://parts.chevrolet.com/product/gm-genuine-parts-oil-pump-25182606",
    "fuenteNombre": "Chevrolet Parts — GM Genuine Parts",
    "estadoVerificacion": "Referencia y aplicación publicadas por el sitio oficial de Chevrolet; confirmar por VIN",
    "masterId": "MST-VER-0020"
  },
  {
    "nombre": "Correa de distribución / tiempo — GM Genuine Parts",
    "categoria": "Distribución",
    "subcategoria": "Motor",
    "marca": "GM Genuine Parts / ACDelco",
    "codigoProveedor": "GM-96858745",
    "codigoOEM": "96858745",
    "unidadMedida": "Unidad",
    "costoReferencial": 0,
    "margenSugerido": 0,
    "descripcionTecnica": "Correa de distribución original GM. La página oficial de Chevrolet indica aplicación Aveo Hatchback/Sedan LS/LT/Base, años 2004–2010.",
    "especificaciones": "Fuente oficial GM: https://parts.chevrolet.com/product/gm-genuine-parts-timing-belt-96858745. Sin precio local ni stock; confirmar motor, versión y VIN antes de comprar.",
    "estadoCompatibilidad": "APLICACIÓN PUBLICADA POR GM — confirmar VIN",
    "palabrasClave": "correa de tiempo correa de distribucion timing belt kit distribucion aveo 96858745",
    "referenciasCruzadas": [],
    "compatibilidad": [
      {
        "marca": "Chevrolet",
        "modelo": "Aveo Hatchback / Sedan LS, LT, Base",
        "anios": "2004–2010 según GM",
        "motor": "Confirmar por VIN",
        "posicion": "Distribución del motor"
      }
    ],
    "fuenteUrl": "https://parts.chevrolet.com/product/gm-genuine-parts-timing-belt-96858745",
    "fuenteNombre": "Chevrolet Parts — GM Genuine Parts",
    "estadoVerificacion": "Referencia y aplicación publicadas por el sitio oficial de Chevrolet; confirmar por VIN",
    "masterId": "MST-VER-0021"
  }
];
  const TOTAL_VIRTUAL_CATALOG_COUNT = VERIFIED_MASTER_CATALOG.length;
  let virtualCache = new Map();
  let activeMasterCategory = 'Todos';
  let activeMasterPage = 1;
  const ITEMS_PER_PAGE = 30;
  function getMasterItemByIndex(index) {
    const i=Number(index);
    if(!Number.isInteger(i)||i<0||i>=VERIFIED_MASTER_CATALOG.length)return null;
    return VERIFIED_MASTER_CATALOG[i];
  }
  function queryMasterCatalog(query = '', category = 'Todos', page = 1, pageSize = ITEMS_PER_PAGE) {
    const q=normalizeSearchText(query||''),cat=String(category||'Todos'),terms=q.split(/\\s+/).filter(Boolean);
    const all=VERIFIED_MASTER_CATALOG.filter(item=>{
      const searchable=normalizeSearchText([item.nombre,item.descripcionTecnica,item.especificaciones,item.palabrasClave,item.marca,item.codigoOEM,item.codigoProveedor,item.categoria,item.subcategoria,...(item.compatibilidad||[]).flatMap(c=>[c.marca,c.modelo,c.anios,c.motor,c.posicion])].join(' '));
      const categoryMatch=cat==='Todos'||cat==='Referencias verificadas'||normalizeSearchText(item.categoria).includes(normalizeSearchText(cat));
      return categoryMatch&&terms.every(t=>searchable.includes(t));
    });
    const safePage=Math.max(1,Number(page)||1),safeSize=Math.max(1,Number(pageSize)||ITEMS_PER_PAGE),start=(safePage-1)*safeSize;
    return {items:all.slice(start,start+safeSize),totalMatched:all.length,totalCatalog:VERIFIED_MASTER_CATALOG.length,page:safePage,totalPages:Math.max(1,Math.ceil(all.length/safeSize))};
  }

  // ==========================================
  // 4. MOTOR DE PRECIOS Y SIMULADOR COMERCIAL
  // ==========================================

  function calculatePricingEngine(costoCompra, margenDetalPct = 35, margenTallerPct = 20, margenMayorPct = 12) {
    const b = typeof bcvData === 'function' ? bcvData() : { rate: 1 };
    const rate = b.rate || 1;

    const costo = Math.max(0, Number(costoCompra) || 0);
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

  const MASTER_CATEGORY_TABS = ['Todos','Lápiz y Bieletas','Dirección','Suspensión','Bujes y Gomas','Lubricación del Motor','Distribución'];

  function openMasterCatalogSelectorModal(targetType = 'producto') {
    currentSelectorTarget = targetType;
    currentSelectorPage = 1;
    currentSelectorQuery = '';
    currentSelectorCategory = 'Todos';

    openModal('📖 Buscar en Catálogo de Referencias OEM (referencias OEM publicadas Productos)', `
      <div style="background:#f0f5fb;border:1px solid #bfd3eb;padding:10px;border-radius:4px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <b style="color:#0b4f85;font-size:13px">Catálogo técnico de referencias OEM publicadas</b>
            <div style="font-size:11px;color:#555">Búsqueda inteligente por palabras claves: Motor, Pistones, Tiempo, Radiadores, Inyección, Sensores, Bujes, Gomas, Lápiz, Rodamientos, Baterías, Faros/Stop, Cilindros, Relex, Mangueras, Cloche, Aceites y Marcas Nacionales/Importadas</div>
          </div>
          <span class="badge ok" style="font-size:11px;padding:4px 8px">🟢 Conectado con referencias OEM publicadas SKUs B2B</span>
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
    // volver a recorrer hasta 9 registros y congelar el hilo principal.
    if (!foundItem) {
      const match = /^MST-VER-(\d+)$/.exec(String(masterId || ''));
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
    const baseCost = item ? (Number(item.costoReferencial)||0) : 0;
    const defMargin = item ? (Number(item.margenSugerido)||0) : 0;
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
          <span style="font-size:10px;font-weight:bold;color:#0b4f85;text-transform:uppercase">Catálogo técnico con fuente</span>
          <div style="font-size:12px;font-weight:bold">${item ? esc(item.nombre) : 'Producto manual'}</div>
        </div>
        <button class="btn" style="font-size:10px;padding:4px 8px" onclick="openMasterCatalogSelectorModal('producto')">🔍 Buscar referencias OEM (referencias OEM publicadas)</button>
      </div>
      ${item ? '<div style="background:#fff7e6;border:1px solid #e6c875;color:#754c00;padding:8px;margin-bottom:10px;border-radius:4px;font-size:11px"><b>Atención:</b> Referencia OEM publicada en fuente pública. Confirma aplicación exacta por VIN antes de comprar o instalar.</div>' : ''}
      ${item && item.fuenteUrl ? '<div style="font-size:11px;margin:6px 0;padding:8px;background:#eef7ff;border:1px solid #bfd3eb"><b>Fuente documental:</b> <a href="'+esc(item.fuenteUrl)+'" target="_blank" rel="noopener">Abrir catálogo de origen</a><br><span>'+esc(item.estadoVerificacion||'Confirmar aplicación por VIN')+'</span></div><input type="hidden" id="prodFuenteUrl" value="'+esc(item.fuenteUrl)+'"><input type="hidden" id="prodEstadoVerificacion" value="'+esc(item.estadoVerificacion||'')+'">' : ''}
      <div class="formgrid">
        <div class="field">
          <label>Código de Barras / SKU</label>
          <input id="prodCodigo" value="${esc(code)}">
        </div>
        <div class="field">
          <label>Código referencial / OEM por verificar</label>
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
          <input id="prodStock" type="number" value="0" min="0">
        </div>
        <div class="field">
          <label>Stock Mínimo</label>
          <input id="prodMin" type="number" value="0" min="0" oninput="document.getElementById('prodReorder').value=Math.round(this.value*1.6)">
        </div>
        <div class="field">
          <label>Punto de Reorden Sugerido</label>
          <input id="prodReorder" type="number" value="0" min="0" title="Nivel de inventario en el cual se debe solicitar compra al distribuidor">
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
      fuenteUrl: document.getElementById('prodFuenteUrl')?.value || '',
      estadoVerificacion: document.getElementById('prodEstadoVerificacion')?.value || '',
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
      costo: item ? (Number(item.costoReferencial)||0) : 0,
      precio: item ? (Number(item.costoReferencial)||0) * (1 + (Number(item.margenSugerido)||0)/100) : 0,
      stock: 0,
      min: 0,
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
          <span style="font-size:10px;font-weight:bold;color:#0b4f85;text-transform:uppercase">Catálogo técnico con fuente</span>
          <div style="font-size:12px;font-weight:bold">${item ? esc(item.nombre) : 'Ficha en blanco'}</div>
        </div>
        <button class="btn" style="font-size:10px;padding:4px 8px" onclick="openMasterCatalogSelectorModal('repuesto')">🔍 Explorar Catálogo Máster (referencias OEM publicadas)</button>
      </div>
      ${item ? '<div style="background:#fff7e6;border:1px solid #e6c875;color:#754c00;padding:8px;margin-bottom:10px;border-radius:4px;font-size:11px"><b>Atención:</b> Referencia OEM publicada en fuente pública; confirma aplicación exacta por VIN antes de comprar o instalar.</div>' : ''}

      <div class="formgrid">
        <div class="field">
          <label>SKU Único</label>
          <input id="repSKU" value="${esc(r.sku)}">
        </div>
        <div class="field">
          <label>Código referencial / OEM por verificar</label>
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
        <span>Resultados referenciales (mostrando <b>${res.items.length}</b> de <b>${res.totalMatched.toLocaleString()}</b> encontrados)</span>
        <span style="font-size:11px;color:#555">Página <b>${res.page}</b> de <b>${res.totalPages}</b></span>
      </div>
      <div class="panelbody" style="padding:0;overflow:auto">
        <table id="masterExplorerTable">
          <thead>
            <tr>
              <th style="width:48px;text-align:center">Foto</th>
              <th>Descripción Técnica / Aplicación</th>
              <th>Marca / Origen</th>
              <th>Código referencial / proveedor</th>
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
                  <div style="margin-top:4px"><span class="badge warn">REFERENCIA GENERADA · NO VALIDADA POR OEM</span></div>
                </td>
                <td>
                  <b>${esc(item.marca)}</b>
                  <br><small style="color:#777">${esc(item.origenMarca || item.distribuidor)}</small>
                </td>
                <td>
                  <span style="font-family:monospace;background:#fff7e6;padding:1px 4px;border:1px solid #e6c875;font-size:10px;font-weight:bold">${esc(item.codigoOEM)}</span>
                  <div style="font-size:9px;color:#8a5700">Código referencial no validado</div>
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
        <span style="font-size:11px;color:#666">Página <b>${res.page}</b> de <b>${res.totalPages}</b> (Total: ${res.totalMatched.toLocaleString()} coincidencias referenciales)</span>
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
        <h2>📖 Catálogo de Referencias OEM Publicadas</h2>
        <div class="sub">Referencias con fuente pública para suspensión/dirección de Aveo T200/T250/T300 y componentes GM de aceite/distribución. No se inventan precios ni existencias; confirma aplicación por VIN.</div>
      </div>
      <div class="actions" style="margin:0">
        <button class="btn primary" onclick="openMasterCatalogSelectorModal('producto')">📥 Importar referencia a inventario</button>
      </div>
    </div>

    <div class="cards">
      <div class="card">Referencias OEM publicadas<b>${TOTAL_VIRTUAL_CATALOG_COUNT.toLocaleString()}</b><span>con fuente pública; confirmar ajuste por VIN</span></div>
      <div class="card">Aplicación<b>Aveo T200/T250/T300</b><span>confirmar variante por VIN</span></div>
      <div class="card">Precios<b>No cargados</b><span>sin precios ficticios</span></div>
      <div class="card">Existencias<b>0 en catálogo</b><span>no equivale a stock de tienda</span></div>
      <div class="card">Fuente<b>Catálogo Orjin</b><span>referencias publicadas en PDF</span></div>
      <div class="card">Mi Inventario Activo<b>${db.productos.length + getRepuestos().length}</b><span>en mi tienda local</span></div>
    </div>

    <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:6px;margin-bottom:8px;border-bottom:1px solid #ddd">
      ${MASTER_CATEGORY_TABS.map(cat => `
        <button class="btn ${activeMasterCategory===cat?'primary':''}" style="font-size:11px;padding:5px 10px;white-space:nowrap" onclick="setMasterViewCategory('${cat}', this)">${cat}</button>
      `).join('')}
    </div>

    <div class="searchbar">
      <input id="masterExpQ" value="${esc(masterViewSearchQuery)}" placeholder="🔍 Buscar por pieza, referencia OEM o versión (ej.: terminal Aveo T300, 96535089, buje Aveo)..." oninput="onMasterSearchInput(this.value)">
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