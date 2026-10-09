// SIFER360 - Módulo Especializado de Repuestos Automotrices
// Catálogo técnico, referencias cruzadas, compatibilidad vehicular, búsqueda inteligente y SKUs únicos

const REPUESTOS_SEED = [
  {
    "id": "VER-CHEV-001",
    "sku": "00210",
    "nombre": "Barra estabilizadora — bieleta / link",
    "categoria": "Lápiz y Bieletas",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "96275798 / 96391875",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-002",
    "sku": "00211",
    "nombre": "Terminal de dirección izquierdo",
    "categoria": "Dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "93740622 / 93740722",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-003",
    "sku": "00212",
    "nombre": "Terminal de dirección derecho",
    "categoria": "Dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "93740623 / 93740723",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-004",
    "sku": "01860",
    "nombre": "Articulación axial de dirección",
    "categoria": "Dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "96535300",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-005",
    "sku": "01798",
    "nombre": "Meseta / brazo de control izquierdo completo",
    "categoria": "Suspensión",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95479764 / 96815893",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-006",
    "sku": "01799",
    "nombre": "Meseta / brazo de control derecho completo",
    "categoria": "Suspensión",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95479765 / 96815894",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-007",
    "sku": "00204",
    "nombre": "Rótula inferior de suspensión",
    "categoria": "Suspensión",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "96535089",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-008",
    "sku": "02011",
    "nombre": "Buje de suspensión — pequeño",
    "categoria": "Bujes y Gomas",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "96535087",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-009",
    "sku": "02012",
    "nombre": "Buje de suspensión — grande",
    "categoria": "Bujes y Gomas",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "96653381",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-010",
    "sku": "05389",
    "nombre": "Barra estabilizadora",
    "categoria": "Suspensión",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95465758",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-011",
    "sku": "06059",
    "nombre": "Terminal de dirección",
    "categoria": "Dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95218373",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-012",
    "sku": "06061",
    "nombre": "Terminal de dirección",
    "categoria": "Dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95952936",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-013",
    "sku": "04688",
    "nombre": "Articulación axial de dirección",
    "categoria": "Dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "1609213 / 95952929",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-014",
    "sku": "06060",
    "nombre": "Articulación axial de dirección",
    "categoria": "Dirección",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95218372",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-015",
    "sku": "06065",
    "nombre": "Meseta / brazo de control izquierdo completo",
    "categoria": "Suspensión",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95017035",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-016",
    "sku": "06066",
    "nombre": "Meseta / brazo de control derecho completo",
    "categoria": "Suspensión",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95017036",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-017",
    "sku": "04684",
    "nombre": "Rótula de suspensión",
    "categoria": "Suspensión",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "352532 / 95916024",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-018",
    "sku": "06069",
    "nombre": "Buje de suspensión — pequeño",
    "categoria": "Bujes y Gomas",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95228670",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-019",
    "sku": "06070",
    "nombre": "Buje de suspensión — grande",
    "categoria": "Bujes y Gomas",
    "marca": "Referencia publicada — Orjin",
    "codigoOEM": "95217519",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente: https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf. Sin precio ni stock; confirmar ajuste por VIN antes de comprar o instalar.",
    "fuenteUrl": "https://www.orjinautomotive.com/Admin/UploadedFiles/pdf-katalog/CHEVROLET.pdf",
    "fuenteNombre": "Catálogo Orjin Chevrolet — suspensión y dirección",
    "estadoVerificacion": "Referencia OEM publicada en fuente pública; compatibilidad exacta por VIN pendiente",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-020",
    "sku": "GM-25182606",
    "nombre": "Bomba de aceite de motor — GM Genuine Parts",
    "categoria": "Lubricación del Motor",
    "marca": "GM Genuine Parts / ACDelco",
    "codigoOEM": "25182606",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente oficial GM: https://parts.chevrolet.com/product/gm-genuine-parts-oil-pump-25182606. Sin precio local ni stock; confirmar motor, versión y VIN antes de comprar.",
    "fuenteUrl": "https://parts.chevrolet.com/product/gm-genuine-parts-oil-pump-25182606",
    "fuenteNombre": "Chevrolet Parts — GM Genuine Parts",
    "estadoVerificacion": "Referencia y aplicación publicadas por el sitio oficial de Chevrolet; confirmar por VIN",
    "imagen": "/icon.svg"
  },
  {
    "id": "VER-CHEV-021",
    "sku": "GM-96858745",
    "nombre": "Correa de distribución / tiempo — GM Genuine Parts",
    "categoria": "Distribución",
    "marca": "GM Genuine Parts / ACDelco",
    "codigoOEM": "96858745",
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
    "costo": 0,
    "precio": 0,
    "stock": 0,
    "min": 0,
    "ubicacion": "",
    "garantia": "",
    "especificaciones": "Fuente oficial GM: https://parts.chevrolet.com/product/gm-genuine-parts-timing-belt-96858745. Sin precio local ni stock; confirmar motor, versión y VIN antes de comprar.",
    "fuenteUrl": "https://parts.chevrolet.com/product/gm-genuine-parts-timing-belt-96858745",
    "fuenteNombre": "Chevrolet Parts — GM Genuine Parts",
    "estadoVerificacion": "Referencia y aplicación publicadas por el sitio oficial de Chevrolet; confirmar por VIN",
    "imagen": "/icon.svg"
  }
];


let repuestoSubTab = 'catalogo';
let fitmentFilter = { marca: '', modelo: '', anio: '', motor: '', repuesto: '' };

function getRepuestos(){
  if(!Array.isArray(db.repuestos))db.repuestos=[];
  db.repuestos=db.repuestos.filter(r=>{
    const id=String(r.id||''),oem=String(r.codigoOEM||''),sku=String(r.sku||'');
    if(/^AUT-000(?:0[1-9]|1[0-9]|20)$/.test(id))return false;
    if(/^REF-PENDIENTE-|^(OIL-PUMP|ADD-|OIL-PICKUP|OIL-RELIEF|OIL-COOLER|OIL-SWITCH|OIL-DIPSTICK|OIL-CAP)/i.test(oem))return false;
    if(/^SKU-(?:BUJ|GOM|LAP|ROD|BAT|LUC|IGN|RLY)-/i.test(sku))return false;
    return true;
  });
  const known=new Set(db.repuestos.map(r=>String(r.id)));
  REPUESTOS_SEED.forEach(part=>{if(!known.has(part.id))db.repuestos.push(structuredClone(part));});
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
      <h3 style="font-size:13px;margin:10px 0 5px">Referencias registradas (pendientes de validar)</h3>
      ${directRefs.length ? `<div style="display:flex;gap:5px;flex-wrap:wrap">${directRefs.map(ref => `<span style="border:1px solid #e6c875;background:#fff8e8;padding:5px 7px;border-radius:4px"><b>${esc(ref.marca || '')}</b>: ${esc(ref.codigo || '')} <small style="color:#8a5700">· por verificar</small></span>`).join('')}</div>` : '<p style="color:#777">Este repuesto no tiene referencias cruzadas registradas.</p>'}
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
        Esta matriz permite localizar referencias registradas para investigar. La coincidencia de texto o marca no demuestra equivalencia: verifica el código del fabricante, dimensiones, versión y aplicación antes de sustituir.
      </p>

      <table id="crossTable">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Repuesto / Categoría</th>
            <th>Código OEM Principal</th>
            <th>Marca Local</th>
            <th>Referencias registradas (no equivalencias confirmadas)</th>
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
                  `).join('') || '<span style="color:#888;font-size:10px">Sin referencias registradas</span>'}
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
