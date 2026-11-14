/* ====================================================================
   data.js — AQUÍ EDITAS TODO EL CONTENIDO DEL SITIO
   ====================================================================

   🖼️  CÓMO PONER TUS IMÁGENES (paso a paso)

   1. Guarda tus fotos en estas carpetas:
        img/productos/   → fotos de las prendas
        img/hero/        → banners del carrusel de la página de inicio
   2. Más abajo, en cada prenda y en cada slide, busca las líneas marcadas
      con  ⬅ REEMPLAZAR  y cambia la ruta por el nombre real de tu archivo.
        Ejemplo:   imagen: "img/productos/mi-jean.jpg"
   3. "imagen2" es una segunda foto (aparece al pasar el mouse y en la
      galería de la prenda). Si no la tienes, déjala como  ""
   4. Mientras una imagen no exista, el sitio muestra un recuadro con el
      nombre de la prenda: no se rompe nada.

   Medidas recomendadas:
     • Prendas:            900 × 1200 px  (vertical, proporción 3:4)
     • Banners del inicio: 1600 × 900 px  (horizontal, proporción 16:9)

   ⚠️  Los nombres, precios, tallas y textos de abajo son EJEMPLOS.
       Cámbialos por los reales de RIPNDRIP.
   ==================================================================== */


/* ---------- 1. CATEGORÍAS (se usan en filtros y en el inicio) ---------- */
const CATEGORIAS = ["Jeans", "Camisetas", "Buzos", "Accesorios"];


/* ---------- 2. CARRUSEL DE LA PÁGINA DE INICIO ----------
   Puedes agregar o quitar slides copiando/borrando un bloque { ... } */
const HERO_SLIDES = [
  {
    etiqueta: "NUEVO DROP",
    titulo:   "RIP THE NORM.",
    texto:    "Streetwear con actitud. Explora la colección.",
    imagen:   "img/hero/banner-1.jpg",          // ⬅ REEMPLAZAR (1600×900)
    enlace:   "tienda.html",
    boton:    "Ver tienda"
  },
  {
    etiqueta: "CAMISETAS",
    titulo:   "WEAR THE STATIC.",
    texto:    "Gráfica con carácter para todos los días.",
    imagen:   "img/hero/banner-2.jpg",          // ⬅ REEMPLAZAR (1600×900)
    enlace:   "tienda.html?cat=Camisetas",
    boton:    "Ver camisetas"
  },
  {
    etiqueta: "JEANS",
    titulo:   "DRIP OR DROWN.",
    texto:    "Los jeans que definen la marca.",
    imagen:   "img/hero/banner-3.jpg",          // ⬅ REEMPLAZAR (1600×900)
    enlace:   "tienda.html?cat=Jeans",
    boton:    "Ver jeans"
  }
];


/* ---------- 3. PRODUCTOS ----------
   id          → único, sin espacios ni tildes (se usa en la URL)
   categoria   → debe ser una de CATEGORIAS
   precio      → número en pesos, sin puntos (189000 = $189.000)
   tallas      → lista de tallas; usa ["Única"] si no aplica
   destacado   → true = aparece en "Lo nuevo" del inicio              */
const PRODUCTOS = [
  {
    id: "ghost-denim",
    nombre: "Ghost Denim Oversize",
    categoria: "Jeans",
    precio: 189000,
    tallas: ["28", "30", "32", "34"],
    descripcion: "Jean de corte amplio de la colección RIPNDRIP.",
    imagen:  "img/productos/ghost-denim-1.jpg",   // ⬅ REEMPLAZAR (900×1200)
    imagen2: "img/productos/ghost-denim-2.jpg",   // ⬅ REEMPLAZAR o dejar ""
    destacado: true
  },
  {
    id: "toxic-cargo",
    nombre: "Toxic Green Cargo",
    categoria: "Jeans",
    precio: 199000,
    tallas: ["28", "30", "32", "34"],
    descripcion: "Pantalón cargo con detalles en verde.",
    imagen:  "img/productos/toxic-cargo-1.jpg",   // ⬅ REEMPLAZAR (900×1200)
    imagen2: "",                                  // ⬅ REEMPLAZAR o dejar ""
    destacado: true
  },
  {
    id: "blackout-tee",
    nombre: "Blackout Tee",
    categoria: "Camisetas",
    precio: 79000,
    tallas: ["S", "M", "L", "XL"],
    descripcion: "Camiseta negra con gráfica RIPNDRIP.",
    imagen:  "img/productos/blackout-tee-1.jpg",  // ⬅ REEMPLAZAR (900×1200)
    imagen2: "img/productos/blackout-tee-2.jpg",  // ⬅ REEMPLAZAR o dejar ""
    destacado: true
  },
  {
    id: "static-tee",
    nombre: "Static Tee",
    categoria: "Camisetas",
    precio: 85000,
    tallas: ["S", "M", "L", "XL"],
    descripcion: "Camiseta de corte relajado con estampado frontal.",
    imagen:  "img/productos/static-tee-1.jpg",    // ⬅ REEMPLAZAR (900×1200)
    imagen2: "",                                  // ⬅ REEMPLAZAR o dejar ""
    destacado: true
  },
  {
    id: "rip-hoodie",
    nombre: "Rip Hoodie",
    categoria: "Buzos",
    precio: 159000,
    tallas: ["S", "M", "L", "XL"],
    descripcion: "Buzo con capota y logo de la marca.",
    imagen:  "img/productos/rip-hoodie-1.jpg",    // ⬅ REEMPLAZAR (900×1200)
    imagen2: "",                                  // ⬅ REEMPLAZAR o dejar ""
    destacado: false
  },
  {
    id: "barcode-cap",
    nombre: "Barcode Cap",
    categoria: "Accesorios",
    precio: 59000,
    tallas: ["Única"],
    descripcion: "Gorra con el código de barras de RIPNDRIP.",
    imagen:  "img/productos/barcode-cap-1.jpg",   // ⬅ REEMPLAZAR (900×1200)
    imagen2: "",                                  // ⬅ REEMPLAZAR o dejar ""
    destacado: false
  }
];


/* ---------- 4. DROP DESTACADO (bloque grande del inicio) ----------
   productoId debe coincidir con el "id" de una prenda de arriba.
   La imagen que se muestra es la "imagen" de esa prenda.               */
const DROP = {
  productoId: "ghost-denim",
  etiqueta:   "DROP DESTACADO",
  titulo:     "GHOST DENIM",
  texto:      "La pieza que no puede faltar en tu rotación."
};


/* ---------- 5. FORMULARIO DE CONTACTO (envío de correo con Resend) ----------
   El correo NO se envía desde el navegador: lo envía la función
   api/enviar.js de Vercel usando la API key guardada en las variables
   de entorno (así la llave nunca queda pública en el sitio).

   Variables que debes crear en Vercel → Settings → Environment Variables:
     RESEND_API_KEY    → llave de resend.com ("re_...")
     DESTINO_EMAIL     → correo que recibe los mensajes
     REMITENTE_EMAIL   → onboarding@resend.dev (para pruebas)

   Para probar en tu computador:  npx vercel dev
   Si abres el HTML con doble clic o con Live Server, /api/enviar no
   existirá y el formulario no podrá enviar nada.                        */
const CONTACTO = {
  endpoint: "/api/enviar"
};


/* ---------- 6. DATOS DE LA MARCA ---------- */
const MARCA = {
  instagramUrl:    "https://www.instagram.com/ripndrip.oficial",
  instagramNombre: "@ripndrip.oficial"
};
