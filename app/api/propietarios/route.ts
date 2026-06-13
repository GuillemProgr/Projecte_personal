import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession();
  if (error) return error;

  try {
    const { comunidadId, nombre, piso, coeficiente, email, telefono } = await req.json();
    if (!comunidadId || !nombre?.trim() || !piso?.trim()) {
      return NextResponse.json({ error: "comunidadId, nombre y piso son obligatorios" }, { status: 400 });
    }

    // Verify community belongs to user
    const comunidad = await prisma.comunidad.findFirst({
      where: { id: comunidadId, userId: session!.user.id },
    });
    if (!comunidad) return NextResponse.json({ error: "Comunidad no encontrada" }, { status: 404 });

    const propietario = await prisma.propietario.create({
      data: {
        nombre: nombre.trim(),
        piso: piso.trim(),
        coeficiente: parseFloat(coeficiente) || 0,
        email: email?.trim() || null,
        telefono: telefono?.trim() || null,
        comunidadId,
      },
    });

    return NextResponse.json(propietario, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un propietario en ese piso" }, { status: 409 });
    }
    console.error("[post-propietario]", err);
    return NextResponse.json({ error: "Error al crear el propietario" }, { status: 500 });
  }
}
