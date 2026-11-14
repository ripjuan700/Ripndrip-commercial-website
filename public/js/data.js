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
    id: "ride-the-lightning-tee",
    nombre: "Ride the Lightning Tee",
    categoria: "Camisetas",
    precio: 95000,
    tallas: ["S", "M", "L", "XL"],
    descripcion: "Camiseta negra de lavado ácido con gráfica de rayos y calaveras, estética metal de los 80. Corte relajado.",
    imagen:  "img/productos/ride-the-lightning-tee-1.jpg",
    imagen2: "",
    destacado: false
  },
  {
    id: "smoke-break-tee",
    nombre: "Smoke Break Tee",
    categoria: "Camisetas",
    precio: 95000,
    tallas: ["S", "M", "L", "XL"],
    descripcion: "Camiseta negra de lavado ácido con gráfica vintage de botas, humo y tipografía roja. Corte relajado y caída oversize.",
    imagen:  "img/productos/smoke-break-tee-1.jpg",
    imagen2: "",
    destacado: false
  },
  {
    id: "hell-trio-tee",
    nombre: "Hell Trio Tee",
    categoria: "Camisetas",
    precio: 92000,
    tallas: ["S", "M", "L", "XL"],
    descripcion: "Camiseta negra de lavado ácido con gráfica de calaveras cornudas en amarillo y rojo. Estampado de gran formato al pecho.",
    imagen:  "img/productos/hell-trio-tee-1.jpg",
    imagen2: "",
    destacado: false
  },
  {
    id: "ghost-denim",
    nombre: "Ghost Cargo Denim",
    categoria: "Jeans",
    precio: 209000,
    tallas: ["28", "30", "32", "34"],
    descripcion: "Jean cargo de mezclilla azul desgastada con bolsillos laterales de gran formato, pierna ancha y caída recta. Tiro alto, costuras contrastadas y acabado lavado a la piedra.",
    imagen:  "img/productos/ghost-denim-1.jpg",
    imagen2: "",
    destacado: true
  },
  {
    id: "haze-cargo",
    nombre: "Haze Cargo",
    categoria: "Jeans",
    precio: 199000,
    tallas: ["28", "30", "32", "34"],
    descripcion: "Cargo negro de gabardina resistente con estampado de hojas en verde neón. Bolsillos utilitarios con tachuelas, cierre lateral y cadena metálica desmontable. Pierna ancha y bajo ajustable.",
    imagen:  "img/productos/haze-cargo-1.jpg",
    imagen2: "",
    destacado: true
  },
  {
    id: "midnight-hoodie",
    nombre: "Midnight Zip Hoodie",
    categoria: "Buzos",
    precio: 229000,
    tallas: ["S", "M", "L", "XL"],
    descripcion: "Buzo con capota y cierre completo en felpa desgastada negra. Gráfica «Midnight» en plata con calavera, huesos y detalles en violeta, estampada al frente y en las mangas. Corte oversize con puños y cintura acanalados.",
    imagen:  "img/productos/midnight-hoodie-1.jpg",
    imagen2: "",
    destacado: true
  },
  {
    id: "winged-skull-hoodie",
    nombre: "Winged Skull Zip Hoodie",
    categoria: "Buzos",
    precio: 239000,
    tallas: ["S", "M", "L", "XL"],
    descripcion: "Buzo negro de lavado ácido con capota doble y cierre metálico. Calavera alada con tipografía gótica y acentos rojos, ilustración de gran formato al frente y en las mangas. Felpa pesada y caída amplia.",
    imagen:  "img/productos/winged-skull-hoodie-1.jpg",
    imagen2: "",
    destacado: true
  },
  {
    id: "burdeos-cap",
    nombre: "Burdeos Metal Cap",
    categoria: "Accesorios",
    precio: 59000,
    tallas: ["Única"],
    descripcion: "Gorra de sarga burdeos lavada al ácido con logo bordado en blanco. Seis paneles, visera curva y cierre trasero ajustable.",
    imagen:  "img/productos/burdeos-cap-1.jpg",
    imagen2: "",
    destacado: false
  }
];


/* ---------- 4. DROP DESTACADO (bloque grande del inicio) ----------
   productoId debe coincidir con el "id" de una prenda de arriba.
   La imagen que se muestra es la "imagen" de esa prenda.               */
const DROP = {
  productoId: "midnight-hoodie",
  etiqueta:   "DROP DESTACADO",
  titulo:     "MIDNIGHT",
  texto:      "Calavera, plata y violeta sobre negro lavado. El zip hoodie más pesado del drop."
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
