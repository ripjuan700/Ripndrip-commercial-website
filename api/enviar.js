import { Resend } from "resend";
import { formidable } from "formidable";
import fs from "node:fs/promises";
import path from "node:path";

export const config = {
  api: {
    bodyParser: false
  }
};

const TIPOS_PERMITIDOS = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

const TAMANO_MAXIMO = 3 * 1024 * 1024;

function escaparHTML(valor = "") {
  return String(valor).replace(/[&<>"']/g, (caracter) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);
}

function obtenerCampo(valor) {
  return Array.isArray(valor) ? valor[0] : valor;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Método no permitido."
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.DESTINO_EMAIL;
  const remitente = process.env.REMITENTE_EMAIL;

  if (!apiKey || !destino || !remitente) {
    console.error("Falta configurar RESEND_API_KEY, DESTINO_EMAIL o REMITENTE_EMAIL.");
    return res.status(500).json({
      success: false,
      message: "El envío de correo no está configurado en el servidor."
    });
  }

  try {
    const form = formidable({
      multiples: true,
      maxFiles: 5,
      maxFileSize: TAMANO_MAXIMO,
      maxTotalFileSize: TAMANO_MAXIMO,
      allowEmptyFiles: false
    });

    const [fields, files] = await form.parse(req);

    const nombre = obtenerCampo(fields.nombre);
    const correo = obtenerCampo(fields.correo);
    const telefono = obtenerCampo(fields.telefono);
    const asunto = obtenerCampo(fields.asunto);
    const mensaje = obtenerCampo(fields.mensaje);

    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({
        success: false,
        message: "Completa los campos obligatorios."
      });
    }

    if (
      typeof correo !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
    ) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico no es válido."
      });
    }

    const listaArchivos = files.archivos
      ? Array.isArray(files.archivos)
        ? files.archivos
        : [files.archivos]
      : [];

    if (listaArchivos.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Puedes adjuntar máximo 5 archivos."
      });
    }

    const totalBytes = listaArchivos.reduce(
      (total, archivo) => total + archivo.size,
      0
    );

    if (totalBytes > TAMANO_MAXIMO) {
      return res.status(400).json({
        success: false,
        message: "Los archivos superan el límite de 3 MB."
      });
    }

    const adjuntos = [];

    for (const archivo of listaArchivos) {
      const extension = path.extname(
        archivo.originalFilename || ""
      ).toLowerCase();

      const tipoEsperado = TIPOS_PERMITIDOS[extension];

      if (!tipoEsperado || archivo.mimetype !== tipoEsperado) {
        return res.status(400).json({
          success: false,
          message: "Solo se permiten PDF, JPG, PNG y WEBP."
        });
      }

      const contenido = await fs.readFile(archivo.filepath);

      adjuntos.push({
        filename: path.basename(archivo.originalFilename),
        content: contenido.toString("base64")
      });
    }

    const resend = new Resend(apiKey);

    const asuntoLimpio = String(asunto || "")
      .replace(/[\r\n]+/g, " ")
      .trim()
      .slice(0, 150);

    const { data, error } = await resend.emails.send({
      from: remitente,
      to: [destino],
      replyTo: correo,
      subject: asuntoLimpio || `Nuevo formulario de ${nombre}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#111">
          <h2 style="margin:0 0 4px">Nuevo mensaje desde RIPNDRIP</h2>
          <p style="margin:0 0 24px;color:#666;font-size:13px">Formulario de contacto de la web</p>

          <p><strong>Nombre:</strong> ${escaparHTML(nombre)}</p>
          <p><strong>Correo:</strong> ${escaparHTML(correo)}</p>
          <p><strong>Teléfono:</strong> ${escaparHTML(telefono || "No indicado")}</p>
          <p><strong>Asunto:</strong> ${escaparHTML(asuntoLimpio || "Sin asunto")}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${escaparHTML(mensaje).replace(/\n/g, "<br>")}</p>
          <p><strong>Archivos adjuntos:</strong> ${adjuntos.length}</p>
        </div>
      `,
      attachments: adjuntos
    });

    if (error) {
      console.error("Error de Resend:", error);
      return res.status(500).json({
        success: false,
        message: "No se pudo enviar el correo."
      });
    }

    console.log("Correo enviado:", data?.id);

    return res.status(200).json({
      success: true,
      message: "Formulario enviado correctamente."
    });
  } catch (error) {
    console.error("Error en el formulario:", error);

    if (error?.code === 1015) {
      return res.status(400).json({
        success: false,
        message: "Puedes adjuntar máximo 5 archivos."
      });
    }

    if (error?.code === 1009 || error?.code === 1016) {
      return res.status(400).json({
        success: false,
        message: "Los archivos superan el límite de 3 MB."
      });
    }

    return res.status(400).json({
      success: false,
      message:
        "No se pudo procesar el formulario. Revisa los archivos e inténtalo nuevamente."
    });
  }
}
