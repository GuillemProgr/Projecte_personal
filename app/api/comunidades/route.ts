import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function GET() {
  const { session, error } = await requireSession();
  if (error) return error;

  const comunidades = await prisma.comunidad.findMany({
    where: { userId: session!.user.id },
    include: { _count: { select: { propietarios: true, documentos: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comunidades);
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const { nombre, direccion, numViviendas, cif, iban } = await req.json();
    if (!nombre?.trim() || !direccion?.trim()) {
      return NextResponse.json({ error: "Nombre y dirección son obligatorios" }, { status: 400 });
    }

    const comunidad = await prisma.comunidad.create({
      data: {
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        numViviendas: parseInt(numViviendas) || 0,
        cif: cif?.trim() || null,
        iban: iban?.trim() || null,
        userId: session!.user.id,
      },
    });

    return NextResponse.json(comunidad, { status: 201 });
  } catch (err) {
    console.error("[post-comunidad]", err);
    return NextResponse.json({ error: "Error al crear la comunidad" }, { status: 500 });
  }
}
