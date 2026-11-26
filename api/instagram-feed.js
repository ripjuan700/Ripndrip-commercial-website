/**
 * Feed público de RIPNDRIP mediante Instagram API with Instagram Login.
 * El access token permanece en el servidor (variable de entorno de Vercel).
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ success: false, message: "Método no permitido." });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!accessToken) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json({
      success: false,
      configured: false,
      message: "El feed de Instagram aún no está configurado en el servidor."
    });
  }

  const version = process.env.INSTAGRAM_API_VERSION || "v26.0";
  if (!/^v\d+\.\d+$/.test(version)) {
    return res.status(500).json({ success: false, message: "La versión de Instagram API no es válida." });
  }

  try {
    const url = new URL(`https://graph.instagram.com/${version}/me/media`);
    url.searchParams.set("fields", "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp");
    url.searchParams.set("limit", "12");
    url.searchParams.set("access_token", accessToken);

    const respuesta = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000)
    });
    const resultado = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok || resultado.error) {
      console.error("Instagram API respondió con error:", {
        status: respuesta.status,
        code: resultado?.error?.code,
        type: resultado?.error?.type
      });
      res.setHeader("Cache-Control", "no-store");
      return res.status(502).json({
        success: false,
        configured: true,
        message: "Instagram no pudo entregar las publicaciones. Comprueba el token y el permiso instagram_business_basic."
      });
    }

    const data = (Array.isArray(resultado.data) ? resultado.data : [])
      .filter(post => post && post.id && post.permalink && (post.media_url || post.thumbnail_url))
      .slice(0, 12)
      .map(post => ({
        id: String(post.id),
        caption: typeof post.caption === "string" ? post.caption.slice(0, 500) : "",
        media_type: post.media_type || "IMAGE",
        media_url: post.media_url || null,
        thumbnail_url: post.thumbnail_url || null,
        permalink: post.permalink,
        timestamp: post.timestamp || null
      }));

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error consultando Instagram API:", error?.name || "UnknownError");
    res.setHeader("Cache-Control", "no-store");
    return res.status(502).json({
      success: false,
      configured: true,
      message: "No fue posible conectar con Instagram en este momento."
    });
  }
}
