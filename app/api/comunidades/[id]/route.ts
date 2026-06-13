import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const data = await req.json();
    const comunidad = await prisma.comunidad.findFirst({
      where: { id: params.id, userId: session!.user.id },
    });
    if (!comunidad) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    const updated = await prisma.comunidad.update({
      where: { id: params.id },
      data: {
        nombre: data.nombre?.trim() ?? comunidad.nombre,
        direccion: data.direccion?.trim() ?? comunidad.direccion,
        numViviendas: data.numViviendas !== undefined ? parseInt(data.numViviendas) : comunidad.numViviendas,
        cif: data.cif?.trim() ?? comunidad.cif,
        iban: data.iban?.trim() ?? comunidad.iban,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[patch-comunidad]", err);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const comunidad = await prisma.comunidad.findFirst({
      where: { id: params.id, userId: session!.user.id },
    });
    if (!comunidad) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    await prisma.comunidad.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[delete-comunidad]", err);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
