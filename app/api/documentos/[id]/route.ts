import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const { contenido } = await req.json();

    // Verify ownership via comunidad.userId
    const documento = await prisma.documento.findFirst({
      where: { id: params.id, comunidad: { userId: session!.user.id } },
    });
    if (!documento) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const updated = await prisma.documento.update({
      where: { id: params.id },
      data: { contenido },
    });

    return NextResponse.json({ id: updated.id });
  } catch (err) {
    console.error("[patch-documento]", err);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const documento = await prisma.documento.findFirst({
      where: { id: params.id, comunidad: { userId: session!.user.id } },
    });
    if (!documento) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    await prisma.documento.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[delete-documento]", err);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
