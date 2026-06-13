import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ComunidadesClient from "./comunidades-client";

async function getComunidades(userId: string) {
  return prisma.comunidad.findMany({
    where: { userId },
    include: { _count: { select: { propietarios: true, documentos: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ComunidadesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const comunidades = await getComunidades(session.user.id);

  return <ComunidadesClient comunidadesIniciales={comunidades} />;
}
