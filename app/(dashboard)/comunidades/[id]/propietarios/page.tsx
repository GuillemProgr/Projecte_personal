import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import PropietariosClient from "./propietarios-client";

export default async function PropietariosPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const comunidad = await prisma.comunidad.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { propietarios: { orderBy: { piso: "asc" } } },
  });
  if (!comunidad) redirect("/comunidades");

  return <PropietariosClient comunidad={comunidad} propietariosIniciales={comunidad.propietarios} />;
}
