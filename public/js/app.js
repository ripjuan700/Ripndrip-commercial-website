"use strict";
/* ====================================================================
   app.js — LÓGICA DEL SITIO (no necesitas editar este archivo, salvo
   la función enviarCorreo() del final si usas otro servicio de correo).
   Los datos (prendas, imágenes, textos) están en js/data.js
   ==================================================================== */

document.documentElement.classList.add("js");

/* ---------- UTILIDADES ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const precio = n => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
const porId  = id => PRODUCTOS.find(p => p.id === id);
const esc    = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ====================================================================
   1. CARRITO  (se guarda en localStorage para que no se pierda al recargar)
   ==================================================================== */
const CLAVE_CARRITO = "ripndrip_carrito";
const MAX_POR_ITEM  = 10;

function leerCarrito() {
  try { return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || []; }
  catch (e) { return []; }
}
function guardarCarrito() {
  try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
}

let carrito = leerCarrito().filter(i => porId(i.id));

const totalCarrito  = () => carrito.reduce((s, i) => s + porId(i.id).precio * i.cantidad, 0);
const cuentaCarrito = () => carrito.reduce((s, i) => s + i.cantidad, 0);

function agregar(id, talla, cantidad = 1) {
  const existe = carrito.find(i => i.id === id && i.talla === talla);
  if (existe) existe.cantidad = Math.min(MAX_POR_ITEM, existe.cantidad + cantidad);
  else carrito.push({ id, talla, cantidad: Math.min(MAX_POR_ITEM, cantidad) });
  actualizarCarrito();
}
function cambiarCantidad(id, talla, delta) {
  const it = carrito.find(i => i.id === id && i.talla === talla);
  if (!it) return;
  it.cantidad = Math.min(MAX_POR_ITEM, it.cantidad + delta);
  if (it.cantidad <= 0) carrito = carrito.filter(i => i !== it);
  actualizarCarrito();
}
function quitar(id, talla) {
  carrito = carrito.filter(i => !(i.id === id && i.talla === talla));
  actualizarCarrito();
}
function vaciar() {
  carrito = [];
  actualizarCarrito();
}

function actualizarCarrito() {
  guardarCarrito();
  const badge = $("#badge");
  if (badge) badge.textContent = cuentaCarrito();
  renderDrawer();
  renderPaginaCarrito();
}

/* Fila de una prenda dentro del carrito (panel lateral y página de carrito) */
function itemHTML(i) {
  const p = porId(i.id);
  const datos = `data-id="${esc(i.id)}" data-talla="${esc(i.talla)}"`;
  return `
  <div class="item">
    <a href="producto.html?id=${esc(p.id)}" class="item-img">${imagenHTML(p.imagen, p.nombre)}</a>
    <div class="item-info">
      <a class="item-nombre" href="producto.html?id=${esc(p.id)}">${esc(p.nombre)}</a>
      <span class="mono item-talla">Talla ${esc(i.talla)}</span>
      <div class="cant">
        <button ${datos} data-accion="menos" aria-label="Quitar una unidad">−</button>
        <span>${i.cantidad}</span>
        <button ${datos} data-accion="mas" aria-label="Agregar una unidad">+</button>
      </div>
    </div>
    <div class="item-der">
      <span class="mono precio">${precio(p.precio * i.cantidad)}</span>
      <button class="link-quitar" ${datos} data-accion="quitar">Quitar</button>
    </div>
  </div>`;
}

function renderDrawer() {
  const lista = $("#drawer-lista"), total = $("#drawer-total"), pie = $("#drawer-pie");
  if (!lista) return;
  if (!carrito.length) {
    lista.innerHTML = `<div class="vacio"><p>Tu carrito está vacío.</p><a class="btn" href="tienda.html">Ir a la tienda</a></div>`;
    pie.hidden = true;
    return;
  }
  lista.innerHTML = carrito.map(itemHTML).join("");
  total.textContent = precio(totalCarrito());
  pie.hidden = false;
}

function renderPaginaCarrito() {
  const cont = $("#carrito-contenido");
  if (!cont) return;
  if (!carrito.length) {
    cont.innerHTML = `<div class="vacio"><p>Tu carrito está vacío.</p><a class="btn" href="tienda.html">Ir a la tienda</a></div>`;
    return;
  }
  cont.innerHTML = `
  <div class="carrito-grid">
    <div class="carrito-lista">${carrito.map(itemHTML).join("")}</div>
    <aside class="resumen">
      <h2 class="display">Resumen</h2>
      <div class="total-fila"><span>Prendas</span><span class="mono">${cuentaCarrito()}</span></div>
      <div class="total-fila total"><span>Total</span><strong class="mono">${precio(totalCarrito())}</strong></div>
      <p class="nota">El pago en línea todavía no está integrado: el pedido se envía desde el formulario de contacto.</p>
      <a class="btn" href="contacto.html?pedido=1">Enviar pedido</a>
      <button class="btn btn-borde" data-accion="vaciar">Vaciar carrito</button>
      <a class="enlace" href="tienda.html">Seguir comprando</a>
    </aside>
  </div>`;
}

/* Un solo "oyente" para todos los botones del carrito (+, −, quitar, vaciar) */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-accion]");
  if (!b) return;
  const { accion, id, talla } = b.dataset;
  if (accion === "mas")    cambiarCantidad(id, talla, 1);
  if (accion === "menos")  cambiarCantidad(id, talla, -1);
  if (accion === "quitar") quitar(id, talla);
  if (accion === "vaciar") vaciar();
});

/* Panel lateral del carrito */
function abrirDrawer() {
  $("#drawer").classList.add("abierto");
  $("#drawer-fondo").classList.add("abierto");
  $("#drawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("sin-scroll");
}
function cerrarDrawer() {
  $("#drawer").classList.remove("abierto");
  $("#drawer-fondo").classList.remove("abierto");
  $("#drawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("sin-scroll");
}

/* Aviso flotante */
function avisar(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("ver");
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => t.classList.remove("ver"), 2600);
}

/* ====================================================================
   2. PIEZAS COMPARTIDAS: imágenes, tarjetas, header y footer
   ==================================================================== */

/* Imagen con "plan B": si el archivo no existe, muestra un recuadro con el
   nombre de la prenda. Así el sitio se ve bien aunque aún no tengas fotos. */
function imagenHTML(src, nombre, extra = "") {
  const vacia = !src;
  const img = vacia ? "" :
    `<img src="${esc(src)}" alt="${esc(nombre)}" loading="lazy" onerror="this.parentElement.classList.add('sin-imagen');this.remove()">`;
  return `<span class="img-wrap${vacia ? " sin-imagen" : ""}" data-nombre="${esc(nombre)}">${img}${extra}</span>`;
}

function tarjetaProducto(p) {
  const img2 = p.imagen2 ? `<img class="img2" src="${esc(p.imagen2)}" alt="" loading="lazy" onerror="this.remove()">` : "";
  return `
  <a class="card reveal" href="producto.html?id=${esc(p.id)}">
    ${imagenHTML(p.imagen, p.nombre, img2)}
    <span class="card-info">
      <span><h3>${esc(p.nombre)}</h3><span class="mono cat-txt">${esc(p.categoria)}</span></span>
      <span class="mono precio">${precio(p.precio)}</span>
    </span>
  </a>`;
}

const PAGINAS = [
  ["index.html",    "Inicio",   "inicio"],
  ["tienda.html",   "Tienda",   "tienda"],
  ["nosotros.html", "Nosotros", "nosotros"],
  ["contacto.html", "Contacto", "contacto"]
];

/* Logo de la marca: img/logo.png (blanco sobre transparente).
   Si el archivo no existe, cae al nombre en texto para no dejar el header vacío. */
const logoHTML = () =>
  `<a class="logo" href="index.html" aria-label="RIPNDRIP, ir al inicio">
    <img class="logo-img" src="img/logo.png" alt="RIPNDRIP" width="1000" height="452" onerror="this.classList.add('logo-roto')">
    <span class="logo-texto" aria-hidden="true">RIPNDRIP</span>
  </a>`;

/* Header, footer y panel del carrito se escriben UNA vez aquí y aparecen en
   todas las páginas. Para cambiar el menú, edita el arreglo PAGINAS de arriba. */
function montarLayout() {
  const pag = document.body.dataset.pagina;
  const activa = pag === "producto" ? "tienda" : pag;

  $("#site-header").innerHTML = `
  <div class="contenedor nav">
    ${logoHTML()}
    <nav id="menu" class="menu" aria-label="Principal">
      ${PAGINAS.map(([href, txt, clave]) =>
        `<a href="${href}"${clave === activa ? ' class="activo" aria-current="page"' : ""}>${txt}</a>`).join("")}
    </nav>
    <div class="acciones">
      <button class="btn-bolsa" id="abrir-carrito" aria-label="Abrir carrito">BAG <span class="badge mono" id="badge">0</span></button>
      <button class="btn-menu" id="btn-menu" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div>`;

  $("#site-footer").innerHTML = `
  <div class="contenedor pie">
    <div>${logoHTML()}<p class="pie-txt">Streetwear independiente.</p></div>
    <nav class="pie-links" aria-label="Pie de página">
      ${PAGINAS.map(([href, txt]) => `<a href="${href}">${txt}</a>`).join("")}
      <a href="carrito.html">Carrito</a>
    </nav>
    <div><a class="pie-ig" href="${esc(MARCA.instagramUrl)}" target="_blank" rel="noopener">Instagram ${esc(MARCA.instagramNombre)}</a></div>
  </div>
  <div class="contenedor copy mono">© ${new Date().getFullYear()} RIPNDRIP</div>`;

  document.body.insertAdjacentHTML("beforeend", `
  <div class="drawer-fondo" id="drawer-fondo"></div>
  <aside class="drawer" id="drawer" aria-label="Carrito de compras" aria-hidden="true">
    <div class="drawer-cab">
      <h2 class="display">Carrito</h2>
      <button id="drawer-cerrar" aria-label="Cerrar carrito">✕</button>
    </div>
    <div class="drawer-lista" id="drawer-lista"></div>
    <div class="drawer-pie" id="drawer-pie">
      <div class="total-fila total"><span>Total</span><strong class="mono" id="drawer-total"></strong></div>
      <a class="btn" href="carrito.html">Ver carrito</a>
    </div>
  </aside>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`);

  /* menú móvil */
  const btn = $("#btn-menu"), menu = $("#menu");
  const cerrarMenu = () => { menu.classList.remove("abierto"); btn.classList.remove("abierto"); btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    btn.classList.toggle("abierto", abierto);
    btn.setAttribute("aria-expanded", String(abierto));
  });
  $$("#menu a").forEach(a => a.addEventListener("click", cerrarMenu));

  /* carrito */
  $("#abrir-carrito").addEventListener("click", abrirDrawer);
  $("#drawer-cerrar").addEventListener("click", cerrarDrawer);
  $("#drawer-fondo").addEventListener("click", cerrarDrawer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") { cerrarDrawer(); cerrarMenu(); } });
}

/* Animación de entrada al hacer scroll */
let observador = null;
function observarReveal() {
  const els = $$(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("visible")); return; }
  observador = observador || new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("visible"); observador.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(e => observador.observe(e));
}

/* ====================================================================
   3. PÁGINA: INICIO (carrusel, lo nuevo, drop, categorías)
   ==================================================================== */
function iniciarInicio() {
  /* --- carrusel --- */
  const cont = $("#hero-slides"), puntosCont = $("#hero-puntos"), hero = $(".hero");
  cont.innerHTML = HERO_SLIDES.map((s, i) => `
    <article class="slide${i === 0 ? " activa" : ""}" aria-label="Slide ${i + 1} de ${HERO_SLIDES.length}">
      ${imagenHTML(s.imagen, s.titulo)}
      <span class="slide-overlay"></span>
      <div class="contenedor slide-contenido">
        <div class="slide-texto">
          <span class="etiqueta mono">${esc(s.etiqueta)}</span>
          <p class="slide-titulo display">${esc(s.titulo)}</p>
          <p class="slide-desc">${esc(s.texto)}</p>
          <a class="btn" href="${esc(s.enlace)}">${esc(s.boton)}</a>
        </div>
      </div>
    </article>`).join("");
  puntosCont.innerHTML = HERO_SLIDES.map((_, i) =>
    `<button class="punto${i === 0 ? " activo" : ""}" data-i="${i}" aria-label="Ir al slide ${i + 1}"></button>`).join("");

  const slides = $$(".slide", cont), puntos = $$(".punto", puntosCont);
  let actual = 0, reloj = null;
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function irA(n) {
    slides[actual].classList.remove("activa");
    puntos[actual].classList.remove("activo");
    actual = (n + slides.length) % slides.length;
    slides[actual].classList.add("activa");
    puntos[actual].classList.add("activo");
  }
  const parar  = () => clearInterval(reloj);
  const iniciar = () => { parar(); if (!sinMovimiento && slides.length > 1) reloj = setInterval(() => irA(actual + 1), 6000); };

  $("#hero-prev").addEventListener("click", () => { irA(actual - 1); iniciar(); });
  $("#hero-next").addEventListener("click", () => { irA(actual + 1); iniciar(); });
  puntosCont.addEventListener("click", e => { const b = e.target.closest(".punto"); if (b) { irA(+b.dataset.i); iniciar(); } });
  hero.addEventListener("mouseenter", parar);
  hero.addEventListener("mouseleave", iniciar);

  let x0 = null;   // deslizar con el dedo en móvil
  hero.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) { irA(actual + (dx < 0 ? 1 : -1)); iniciar(); }
    x0 = null;
  });
  iniciar();

  /* --- lo nuevo --- */
  $("#grid-destacados").innerHTML = PRODUCTOS.filter(p => p.destacado).slice(0, 4).map(tarjetaProducto).join("");

  /* --- drop destacado --- */
  const pd = porId(DROP.productoId);
  if (pd) {
    $("#drop-destacado").innerHTML = `
      <div class="drop-img">${imagenHTML(pd.imagen, pd.nombre)}</div>
      <div class="drop-texto">
        <span class="etiqueta mono">${esc(DROP.etiqueta)}</span>
        <h2 class="display">${esc(DROP.titulo)}</h2>
        <p>${esc(DROP.texto)}</p>
        <p class="mono precio-grande">${precio(pd.precio)}</p>
        <div class="fila-btn">
          <a class="btn" href="producto.html?id=${esc(pd.id)}">Ver prenda</a>
          <a class="btn btn-borde" href="tienda.html">Ver tienda</a>
        </div>
      </div>`;
  }

  /* --- categorías --- */
  $("#cats").innerHTML = CATEGORIAS.map(c =>
    `<a class="cat" href="tienda.html?cat=${encodeURIComponent(c)}">${esc(c)} <span aria-hidden="true">→</span></a>`).join("");
}

/* ====================================================================
   4. PÁGINA: TIENDA (filtros por categoría y orden por precio)
   ==================================================================== */
function iniciarTienda() {
  const params = new URLSearchParams(location.search);
  let cat = CATEGORIAS.includes(params.get("cat")) ? params.get("cat") : "Todas";
  let orden = "recientes";
  const filtros = $("#filtros"), grid = $("#grid-tienda"), cuenta = $("#cuenta"), selOrden = $("#orden");

  filtros.innerHTML = ["Todas", ...CATEGORIAS].map(c =>
    `<button class="chip${c === cat ? " activo" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");

  function pintar() {
    const lista = PRODUCTOS.filter(p => cat === "Todas" || p.categoria === cat);
    if (orden === "menor") lista.sort((a, b) => a.precio - b.precio);
    if (orden === "mayor") lista.sort((a, b) => b.precio - a.precio);
    cuenta.textContent = `${lista.length} ${lista.length === 1 ? "prenda" : "prendas"}`;
    grid.innerHTML = lista.map(tarjetaProducto).join("") || `<p class="vacio">No hay prendas en esta categoría.</p>`;
    observarReveal();
  }
  filtros.addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    cat = b.dataset.cat;
    $$(".chip", filtros).forEach(c => c.classList.toggle("activo", c === b));
    pintar();
  });
  selOrden.addEventListener("change", () => { orden = selOrden.value; pintar(); });
  pintar();
}

/* ====================================================================
   5. PÁGINA: PRODUCTO (detalle de una prenda, se abre con ?id=...)
   ==================================================================== */
function iniciarProducto() {
  const cont = $("#detalle");
  const p = porId(new URLSearchParams(location.search).get("id"));
  if (!p) {
    cont.innerHTML = `<div class="contenedor vacio"><p>No encontramos esa prenda.</p><a class="btn" href="tienda.html">Volver a la tienda</a></div>`;
    return;
  }
  document.title = `${p.nombre} — RIPNDRIP`;

  let talla = p.tallas.length === 1 ? p.tallas[0] : null;
  let cant = 1;
  const fotos = [p.imagen, p.imagen2].filter(Boolean);
  if (!fotos.length) fotos.push("");

  cont.innerHTML = `
  <div class="contenedor detalle">
    <div class="galeria">
      <div class="galeria-principal" id="foto-principal">${imagenHTML(fotos[0], p.nombre)}</div>
      ${fotos.length > 1 ? `<div class="miniaturas">${fotos.map((f, i) =>
        `<button class="mini${i === 0 ? " activo" : ""}" data-i="${i}" aria-label="Ver foto ${i + 1}">${imagenHTML(f, p.nombre)}</button>`).join("")}</div>` : ""}
    </div>
    <div class="detalle-info">
      <nav class="migas mono" aria-label="Ruta"><a href="tienda.html">Tienda</a> / <a href="tienda.html?cat=${encodeURIComponent(p.categoria)}">${esc(p.categoria)}</a></nav>
      <h1 class="display">${esc(p.nombre)}</h1>
      <p class="mono precio-grande">${precio(p.precio)}</p>
      <p class="desc">${esc(p.descripcion)}</p>
      <div class="bloque">
        <span class="mono rotulo">TALLA</span>
        <div class="tallas" id="tallas">${p.tallas.map(t =>
          `<button class="talla${t === talla ? " activo" : ""}" data-talla="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      </div>
      <div class="bloque">
        <span class="mono rotulo">CANTIDAD</span>
        <div class="cant cant-grande">
          <button id="menos" aria-label="Menos">−</button><span id="cant">1</span><button id="mas" aria-label="Más">+</button>
        </div>
      </div>
      <button class="btn btn-grande" id="agregar">Agregar al carrito</button>
      <p class="mono ref">REF: ${esc(p.id.toUpperCase())}</p>
    </div>
  </div>
  <section class="seccion">
    <div class="contenedor">
      <div class="seccion-cab"><h2 class="display">También te puede gustar</h2></div>
      <div class="grid-prod" id="relacionados"></div>
    </div>
  </section>`;

  /* fotos */
  $$(".mini").forEach(b => b.addEventListener("click", () => {
    $("#foto-principal").innerHTML = imagenHTML(fotos[+b.dataset.i], p.nombre);
    $$(".mini").forEach(m => m.classList.toggle("activo", m === b));
  }));
  /* tallas */
  $("#tallas").addEventListener("click", e => {
    const b = e.target.closest(".talla");
    if (!b) return;
    talla = b.dataset.talla;
    $$(".talla").forEach(t => t.classList.toggle("activo", t === b));
  });
  /* cantidad */
  $("#menos").addEventListener("click", () => { cant = Math.max(1, cant - 1); $("#cant").textContent = cant; });
  $("#mas").addEventListener("click",   () => { cant = Math.min(MAX_POR_ITEM, cant + 1); $("#cant").textContent = cant; });
  /* agregar */
  $("#agregar").addEventListener("click", () => {
    if (!talla) { avisar("Elige una talla primero"); $("#tallas").classList.add("falta"); return; }
    $("#tallas").classList.remove("falta");
    agregar(p.id, talla, cant);
    avisar(`${p.nombre} agregado al carrito`);
    abrirDrawer();
  });

  /* relacionados: misma categoría primero, luego el resto */
  const otros = PRODUCTOS.filter(x => x.id !== p.id);
  const rel = [...otros.filter(x => x.categoria === p.categoria), ...otros.filter(x => x.categoria !== p.categoria)].slice(0, 4);
  $("#relacionados").innerHTML = rel.map(tarjetaProducto).join("");
}

/* ====================================================================
   6. PÁGINA: CARRITO (la lista se pinta en renderPaginaCarrito)
   ==================================================================== */
function iniciarCarrito() { renderPaginaCarrito(); }

/* ====================================================================
   7. PÁGINA: CONTACTO (formulario que envía un correo)
   ==================================================================== */
function resumenPedido() {
  const lineas = carrito.map(i => {
    const p = porId(i.id);
    return `- ${i.cantidad} x ${p.nombre} (talla ${i.talla}) — ${precio(p.precio * i.cantidad)}`;
  });
  return `Hola, quiero hacer este pedido:\n\n${lineas.join("\n")}\n\nTotal: ${precio(totalCarrito())}\n\nMis datos de contacto: `;
}

function iniciarContacto() {
  const form = $("#form-contacto"), estado = $("#form-estado"), btn = $("#form-enviar");
  const inputArchivos = $("#archivos"), listaArchivos = $("#lista-archivos");
  const esPedido = new URLSearchParams(location.search).get("pedido") === "1" && carrito.length > 0;
  if (esPedido) {
    form.elements.mensaje.value = resumenPedido();
    form.elements.asunto.value = "Pedido desde la web";
  }

  const mostrar = (txt, tipo) => { estado.textContent = txt; estado.className = "form-estado " + (tipo || ""); };

  /* --- adjuntos: mismas reglas que api/enviar.js --- */
  const MAX_ARCHIVOS = 5;
  const MAX_TAMANO   = 3 * 1024 * 1024;
  const EXTENSIONES  = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
  const TIPOS        = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

  function validarArchivos(archivos) {
    if (archivos.length > MAX_ARCHIVOS) return "Puedes adjuntar máximo 5 archivos.";
    let pesoTotal = 0;
    for (const archivo of archivos) {
      const extension = archivo.name.slice(archivo.name.lastIndexOf(".")).toLowerCase();
      if (!EXTENSIONES.includes(extension) || !TIPOS.includes(archivo.type)) {
        return "Archivo no permitido: " + archivo.name;
      }
      pesoTotal += archivo.size;
    }
    if (pesoTotal > MAX_TAMANO) return "Los archivos superan el límite de 3 MB en total.";
    return null;
  }

  function pintarArchivos() {
    if (!listaArchivos) return;
    listaArchivos.innerHTML = "";
    [...inputArchivos.files].forEach(archivo => {
      const fila = document.createElement("div");
      fila.className = "archivo-item mono";
      const nombre = document.createElement("span");
      nombre.textContent = archivo.name;
      const peso = document.createElement("strong");
      peso.textContent = (archivo.size / 1024).toFixed(1) + " KB";
      fila.append(nombre, peso);
      listaArchivos.appendChild(fila);
    });
  }

  if (inputArchivos) {
    inputArchivos.addEventListener("change", () => {
      const archivos = [...inputArchivos.files];
      const errorArchivos = validarArchivos(archivos);
      if (errorArchivos) {
        inputArchivos.value = "";
        listaArchivos.innerHTML = "";
        mostrar(errorArchivos, "error");
        return;
      }
      mostrar("");
      pintarArchivos();
    });
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (!CONTACTO || !CONTACTO.endpoint) {
      mostrar("El envío de correo aún no está configurado. Revisa la sección CONTACTO en js/data.js.", "error");
      return;
    }

    const archivos = inputArchivos ? [...inputArchivos.files] : [];
    const errorArchivos = validarArchivos(archivos);
    if (errorArchivos) { mostrar(errorArchivos, "error"); return; }

    btn.disabled = true;
    btn.textContent = "Enviando…";
    mostrar("Estamos enviando tu mensaje. Espera un momento.", "info");
    try {
      await enviarCorreo(form, archivos);
      mostrar("¡Mensaje enviado! Gracias por escribirnos.", "ok");
      form.reset();
      pintarArchivos();
      if (esPedido) vaciar();
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      mostrar(err.message || "No se pudo enviar el mensaje. Inténtalo de nuevo en un momento.", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Enviar mensaje";
    }
  });
}

/* ---------------------------------------------------------------------
   Envía el formulario (multipart) a api/enviar.js, la función de Vercel
   que habla con Resend. Si cambias de backend, solo ajusta
   CONTACTO.endpoint en js/data.js.
   --------------------------------------------------------------------- */
async function enviarCorreo(form, archivos = []) {
  const datos = new FormData();
  datos.append("nombre",  form.elements.nombre.value.trim());
  datos.append("correo",  (form.elements.correo.value || "").trim());
  datos.append("telefono", (form.elements.telefono ? form.elements.telefono.value : "").trim());
  datos.append("asunto",  form.elements.asunto.value.trim());
  datos.append("mensaje", form.elements.mensaje.value.trim());
  archivos.forEach(archivo => datos.append("archivos", archivo));

  let r;
  try {
    r = await fetch(CONTACTO.endpoint, { method: "POST", body: datos });
  } catch (e) {
    throw new Error("No hay conexión con el servidor de correo. Abre el sitio desde Vercel o con `npx vercel dev`.");
  }

  const resp = await r.json().catch(() => ({}));
  if (r.status === 404) {
    throw new Error("No se encontró el servicio de correo. Abre el sitio con `npx vercel dev` o desde la URL de Vercel.");
  }
  if (!r.ok || !resp.success) throw new Error(resp.message || "No se pudo enviar el mensaje.");
  return resp;
}

/* ====================================================================
   ARRANQUE: según la página (data-pagina del <body>) se inicia lo que toca
   ==================================================================== */
const INICIADORES = {
  inicio:   iniciarInicio,
  tienda:   iniciarTienda,
  producto: iniciarProducto,
  carrito:  iniciarCarrito,
  contacto: iniciarContacto
};

document.addEventListener("DOMContentLoaded", () => {
  montarLayout();
  actualizarCarrito();
  const iniciar = INICIADORES[document.body.dataset.pagina];
  if (iniciar) iniciar();
  observarReveal();
});
