import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generarDocxActa } from "@/lib/docx/acta";
import { requireSession } from "@/lib/session";

const TITULOS: Record<string, string> = {
  acta:         "ACTA DE JUNTA DE PROPIETARIOS",
  morosidad:    "CARTA DE RECLAMACIÓN DE DEUDA",
  convocatoria: "CONVOCATORIA DE JUNTA DE PROPIETARIOS",
  comunicado:   "COMUNICADO A PROPIETARIOS",
  derrama:      "COMUNICACIÓN DE DERRAMA EXTRAORDINARIA",
};

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const documento = await prisma.documento.findFirst({
      where: { id: params.id, comunidad: { userId: session!.user.id } },
      include: { comunidad: true },
    });

    if (!documento) return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
    if (!documento.comunidad) return NextResponse.json({ error: "Comunidad no encontrada" }, { status: 404 });

    const titulo = TITULOS[documento.tipo] ?? "DOCUMENTO";
    const fecha = documento.createdAt.toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });

    const buffer = await generarDocxActa(titulo, documento.comunidad.nombre, fecha, documento.contenido);
    const nombreFichero = `${documento.tipo}-${params.id.slice(0, 8)}.docx`;

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${nombreFichero}"`,
      },
    });
  } catch (err) {
    console.error("[export-docx]", err);
    return NextResponse.json({ error: "Error al generar Word" }, { status: 500 });
  }
}
