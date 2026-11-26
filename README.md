# RIPNDRIP — web

Sitio de la marca (HTML + CSS + JavaScript) con un formulario de contacto
que envía correos —y adjuntos— mediante **Resend**, usando una función de
**Vercel** en `api/enviar.js`.

## Estructura (la de la guía)

```
ripndrip-web/
├── api/
│   ├── enviar.js        ← servidor: recibe el formulario y llama a Resend
│   └── instagram-feed.js ← servidor: consulta las publicaciones de Instagram
├── public/              ← el sitio que ve el visitante
│   ├── index.html
│   ├── tienda.html
│   ├── producto.html
│   ├── carrito.html
│   ├── nosotros.html
│   ├── contacto.html
│   ├── css/styles.css
│   ├── js/data.js
│   ├── js/app.js
│   └── img/
├── package.json
└── README.md
```

## 1. Instalar dependencias

```bash
npm install
```

Instala `resend` y `formidable`.

## 2. Probar en local

La función `/api/enviar` solo existe dentro de Vercel. El sitio **no funciona
abriendo el HTML con doble clic ni con Live Server**.

```bash
npx vercel dev
```

- La primera vez te pedirá iniciar sesión y vincular el proyecto.
- Copia `.env.example` a `.env.local` y completa `RESEND_API_KEY`,
  `DESTINO_EMAIL` y `REMITENTE_EMAIL` (también puedes ejecutar
  `npx vercel env pull` si ya las creaste en Vercel).
- Abre la URL que muestre la terminal (normalmente <http://localhost:3000>).

## 3. Publicar en Vercel

1. Sube el proyecto a GitHub.
2. En <https://vercel.com/new>, importa el repositorio.
3. Framework Preset: **Other**. Build Command: vacío (Skip Build).
   Output Directory: `public` (Vercel lo detecta solo).
4. Antes o después del primer deploy, crea las variables en
   **Settings → Environment Variables** (Production y Preview):

| Variable | Valor |
|---|---|
| `RESEND_API_KEY` | Llave de Resend (`re_...`) |
| `DESTINO_EMAIL` | Correo que recibe los mensajes |
| `REMITENTE_EMAIL` | `onboarding@resend.dev` (pruebas) |

5. Si creaste las variables después del deploy, haz **Redeploy**.

## 4. Configurar Resend

1. Crea una cuenta en <https://resend.com>.
2. **API Keys → Create API Key** → permiso **Sending access**.
3. Copia la llave (solo se muestra una vez).
4. Para las primeras pruebas:
   - `REMITENTE_EMAIL=onboarding@resend.dev`
   - `DESTINO_EMAIL` debe ser **el mismo correo con el que creaste la cuenta**.

⚠️ Sin un dominio verificado, Resend solo entrega correos de prueba a la
dirección de tu propia cuenta. Para recibir mensajes en el correo real de la
marca hay que verificar un dominio en <https://resend.com/domains> y usar,
por ejemplo, `REMITENTE_EMAIL=contacto@ripndrip.com`.

## 5. Qué envía el formulario

`public/contacto.html` → `POST /api/enviar` (multipart/form-data):

| Campo | Obligatorio |
|---|---|
| `nombre` | Sí |
| `correo` | Sí |
| `asunto` | No |
| `mensaje` | Sí |
| `archivos` | No (hasta 5 archivos, 3 MB en total, PDF/JPG/PNG/WEBP) |

`api/enviar.js` valida todo, adjunta los archivos y llama a Resend con
`replyTo` = correo del visitante, así puedes responderle directo.

Si el mensaje viene del carrito (`contacto.html?pedido=1`), el texto ya
incluye las prendas, tallas y el total.

## 6. Dónde editar el contenido

| Archivo | Qué contiene |
|---|---|
| `public/js/data.js` | Productos, precios, categorías, configuración del Hero y `CONTACTO.endpoint` |
| `public/js/app.js` | Carrito, páginas y envío del formulario |
| `public/css/styles.css` | Diseño (colores en `:root`) |
| `public/img/logo.png` | Logo oficial |


## 7. Feed de Instagram dentro de la tienda

El botón flotante de Instagram abre una ventana dentro de RIPNDRIP. El contenido se solicita desde `api/instagram-feed.js`; el token nunca se envía al navegador.

### Requisitos de Meta

1. La cuenta `@ripndrip.oficial` debe ser profesional (Empresa o Creador). La API de Instagram con inicio de sesión de Instagram no necesita una página de Facebook vinculada.
2. Crea una aplicación en [Meta for Developers](https://developers.facebook.com/) y agrega el producto **Instagram** con **Instagram Login**.
3. Configura el inicio de sesión comercial de Instagram y solicita el permiso `instagram_business_basic`. Para un feed de solo lectura no se necesitan permisos de publicación, mensajes ni comentarios.
4. Autoriza la cuenta RIPNDRIP y genera un token de usuario de Instagram de larga duración.
5. En Vercel → Settings → Environment Variables agrega:

| Variable | Valor |
|---|---|
| `INSTAGRAM_ACCESS_TOKEN` | Token de acceso largo de la cuenta RIPNDRIP |
| `INSTAGRAM_API_VERSION` | `v26.0` (puede actualizarse cuando Meta publique otra versión) |

6. Haz Redeploy después de guardar las variables.

La ruta `/api/instagram-feed` consulta las últimas 12 publicaciones con `instagram_business_basic`, devuelve únicamente los campos necesarios para la galería y almacena la respuesta en caché durante cinco minutos. Si falta el token, la tienda muestra un estado informativo y conserva el enlace al perfil; no se inventan publicaciones de muestra.

**Mantenimiento del token:** revisa su vigencia en el panel de Meta y renuévalo antes de que expire; actualiza `INSTAGRAM_ACCESS_TOKEN` en Vercel y vuelve a desplegar. No copies el token a `data.js`, `app.js`, HTML ni al repositorio.

Documentación oficial: [Instagram API con Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/) · [Cambios de Instagram API](https://developers.facebook.com/docs/instagram/platform/instagram-api/changelog/) · [Versiones de Graph API](https://developers.facebook.com/docs/graph-api/changelog/versions/).
