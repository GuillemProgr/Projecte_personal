import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";
import { buildActaSystemPrompt, buildActaUserPrompt } from "@/lib/prompts/acta";
import { buildMorosidadPrompt } from "@/lib/prompts/morosidad";
import { buildConvocatoriaPrompt } from "@/lib/prompts/convocatoria";
import { buildComunicadoPrompt } from "@/lib/prompts/comunicado";
import { buildDerramaPrompt } from "@/lib/prompts/derrama";
import { requireSession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function parseXmlCuerpo(xml: string): string {
  const m = xml.match(/<cuerpo>([\s\S]*?)<\/cuerpo>/i);
  return m ? m[1].trim() : xml.trim();
}

async function llamarClaude(system: string | null, prompt: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    ...(system ? { system } : {}),
    messages: [{ role: "user", content: prompt }],
  });
  const block = msg.content.find(b => b.type === "text");
  return block?.type === "text" ? block.text : "";
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
    const body = await req.json();
    const { tipo, comunidadId, ...datos } = body;

    const comunidad = await prisma.comunidad.findFirst({
      where: { id: comunidadId, userId: session!.user.id },
      include: { propietarios: true },
    });
    if (!comunidad) return NextResponse.json({ error: "Comunidad no encontrada" }, { status: 404 });

    const propietarios = comunidad.propietarios.map(p => ({
      nombre: p.nombre, piso: p.piso, coeficiente: p.coeficiente,
    }));

    let rawXml = "";
    let titulo = "";

    switch (tipo) {
      case "acta": {
        rawXml = await llamarClaude(
          buildActaSystemPrompt(),
          buildActaUserPrompt({ ...datos, comunidadNombre: comunidad.nombre, comunidadDireccion: comunidad.direccion, propietarios })
        );
        titulo = `Acta Junta ${comunidad.nombre} — ${datos.fecha}`;
        break;
      }
      case "morosidad": {
        rawXml = await llamarClaude(null, buildMorosidadPrompt({
          ...datos, comunidadNombre: comunidad.nombre, comunidadDireccion: comunidad.direccion,
        }));
        titulo = `Carta Morosidad — ${datos.propietarioNombre} (${datos.piso})`;
        break;
      }
      case "convocatoria": {
        rawXml = await llamarClaude(null, buildConvocatoriaPrompt({
          ...datos, comunidadNombre: comunidad.nombre, comunidadDireccion: comunidad.direccion,
        }));
        titulo = `Convocatoria Junta ${comunidad.nombre} — ${datos.fechaPrimera}`;
        break;
      }
      case "comunicado": {
        rawXml = await llamarClaude(null, buildComunicadoPrompt({
          ...datos, comunidadNombre: comunidad.nombre, comunidadDireccion: comunidad.direccion,
        }));
        titulo = `Comunicado — ${datos.asunto}`;
        break;
      }
      case "derrama": {
        rawXml = await llamarClaude(null, buildDerramaPrompt({
          ...datos, comunidadNombre: comunidad.nombre, comunidadDireccion: comunidad.direccion, propietarios,
        }));
        titulo = `Derrama — ${datos.descripcionObra.slice(0, 40)}…`;
        break;
      }
      default:
        return NextResponse.json({ error: `Tipo '${tipo}' no soportado` }, { status: 400 });
    }

    const contenido = parseXmlCuerpo(rawXml) || rawXml;

    const documento = await prisma.documento.create({
      data: { tipo, titulo, inputJson: JSON.stringify(body), contenido, comunidadId },
    });

    return NextResponse.json({ id: documento.id, contenido: documento.contenido });
  } catch (err) {
    console.error("[generar]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error interno" }, { status: 500 });
  }
}
