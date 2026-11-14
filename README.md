# RIPNDRIP — web

Sitio de la marca (HTML + CSS + JavaScript) con un formulario de contacto
que envía correos —y adjuntos— mediante **Resend**, usando una función de
**Vercel** en `api/enviar.js`.

## Estructura (la de la guía)

```
ripndrip-web/
├── api/
│   └── enviar.js        ← servidor: recibe el formulario y llama a Resend
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
| `public/js/data.js` | Productos, precios, categorías, banners y `CONTACTO.endpoint` |
| `public/js/app.js` | Carrito, páginas y envío del formulario |
| `public/css/styles.css` | Diseño (colores en `:root`) |
| `public/img/logo.png` | Logo oficial |
