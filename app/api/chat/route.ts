import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";
import { requireSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY no está configurada en las variables de entorno");
}
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `Eres un experto en Ley de Propiedad Horizontal española (LPH, Ley 49/1960 y sus modificaciones posteriores, especialmente la Ley 8/1999).

Cuando respondas:
- Cita SIEMPRE el artículo exacto de la LPH que aplica (ej: "según el art. 9.1.e) LPH...")
- Si hay jurisprudencia relevante del Tribunal Supremo, menciónala
- Responde en español formal pero claro y comprensible para no juristas
- Si la pregunta tiene matices que dependen de los estatutos de la comunidad, indícalo
- Sé preciso y conciso: no más de 3-4 párrafos por respuesta`;

export async function GET(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const comunidadId = req.nextUrl.searchParams.get("comunidadId");
    if (!comunidadId) return NextResponse.json({ error: "comunidadId requerido" }, { status: 400 });

    // Verify ownership
    const comunidad = await prisma.comunidad.findFirst({
      where: { id: comunidadId, userId: session!.user.id },
    });
    if (!comunidad) return NextResponse.json({ error: "Comunidad no encontrada" }, { status: 404 });

    const mensajes = await prisma.chatMensaje.findMany({
      where: { comunidadId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json(mensajes);
  } catch (err) {
    console.error("[chat-get]", err);
    return NextResponse.json({ error: "Error al cargar mensajes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  const rl = checkRateLimit(session!.user.id);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Demasiadas solicitudes. Inténtalo en ${Math.ceil(rl.retryAfterMs / 1000)}s` },
      { status: 429 }
    );
  }

  try {
    const { comunidadId, pregunta } = await req.json();
    if (!comunidadId || !pregunta?.trim()) {
      return NextResponse.json({ error: "comunidadId y pregunta son obligatorios" }, { status: 400 });
    }

    const comunidad = await prisma.comunidad.findFirst({
      where: { id: comunidadId, userId: session!.user.id },
      include: { propietarios: true },
    });
    if (!comunidad) return NextResponse.json({ error: "Comunidad no encontrada" }, { status: 404 });

    await prisma.chatMensaje.create({
      data: { rol: "user", contenido: pregunta.trim(), comunidadId },
    });

    const historialDesc = await prisma.chatMensaje.findMany({
      where: { comunidadId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const historial = historialDesc.reverse();

    const contextoComunidad = `Comunidad: ${comunidad.nombre}\nDirección: ${comunidad.direccion}\nNúmero de propietarios: ${comunidad.propietarios.length}`;

    const messages = historial.map(m => ({
      role: m.rol as "user" | "assistant",
      content: m.contenido,
    }));

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `${SYSTEM}\n\nCONTEXTO DE LA COMUNIDAD:\n${contextoComunidad}`,
      messages,
    });

    const textBlock = response.content.find(b => b.type === "text");
    const respuesta = textBlock?.type === "text" ? textBlock.text : "No se pudo generar respuesta.";

    const mensajeIA = await prisma.chatMensaje.create({
      data: { rol: "assistant", contenido: respuesta, comunidadId },
    });

    return NextResponse.json({ id: mensajeIA.id, contenido: respuesta });
  } catch (err) {
    console.error("[chat-post]", err);
    return NextResponse.json({ error: "Error al procesar la consulta" }, { status: 500 });
  }
}
