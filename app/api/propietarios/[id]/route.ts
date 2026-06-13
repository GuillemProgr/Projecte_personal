import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const existing = await prisma.propietario.findFirst({
      where: { id: params.id, comunidad: { userId: session!.user.id } },
    });
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const data = await req.json();
    const updated = await prisma.propietario.update({
      where: { id: params.id },
      data: {
        nombre: data.nombre?.trim() ?? existing.nombre,
        piso: data.piso?.trim() ?? existing.piso,
        coeficiente: data.coeficiente !== undefined ? parseFloat(data.coeficiente) : existing.coeficiente,
        email: data.email?.trim() ?? existing.email,
        telefono: data.telefono?.trim() ?? existing.telefono,
        moroso: data.moroso !== undefined ? Boolean(data.moroso) : existing.moroso,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[patch-propietario]", err);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const existing = await prisma.propietario.findFirst({
      where: { id: params.id, comunidad: { userId: session!.user.id } },
    });
    if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    await prisma.propietario.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[delete-propietario]", err);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
