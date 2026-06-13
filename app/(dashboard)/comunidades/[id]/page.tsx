import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  FileText, AlertTriangle, CalendarDays, Megaphone,
  Calculator, MessageSquare, Clock, Users, ArrowRight, ChevronRight,
} from "lucide-react";

const MODULOS = [
  { id: "actas",         label: "Actas de Junta",        desc: "Actas formales con referencias LPH exactas",  icon: FileText,      from: "#3B82F6", to: "#6366F1" },
  { id: "morosos",       label: "Carta de Morosidad",    desc: "Reclamación de cuotas con base legal",         icon: AlertTriangle, from: "#EF4444", to: "#F97316" },
  { id: "convocatorias", label: "Convocatoria de Junta", desc: "Primera y segunda convocatoria (art. 16 LPH)", icon: CalendarDays,  from: "#8B5CF6", to: "#A78BFA" },
  { id: "comunicados",   label: "Comunicado a Vecinos",  desc: "Circulares para obras, averías e información", icon: Megaphone,     from: "#F59E0B", to: "#FBBF24" },
  { id: "derramas",      label: "Cálculo de Derrama",    desc: "Cuota por propietario + carta informativa",    icon: Calculator,    from: "#10B981", to: "#34D399" },
  { id: "chat",          label: "Chat Legal LPH",        desc: "Consultas con IA sobre propiedad horizontal",  icon: MessageSquare, from: "#0EA5E9", to: "#38BDF8" },
];

async function getComunidad(id: string, userId: string) {
  return prisma.comunidad.findFirst({
    where: { id, userId },
    include: {
      propietarios: { orderBy: { piso: "asc" } },
      documentos: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ComunidadPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const comunidad = await getComunidad(params.id, session.user.id);
  if (!comunidad) notFound();

  return (
    <div className="min-h-full">
      {/* ── Hero Banner ── */}
      <div
        className="relative overflow-hidden px-10 pt-10 pb-10"
        style={{ background: "linear-gradient(135deg, #0C0C14 0%, #0D2818 50%, #0C0C14 100%)" }}
      >
        {/* Glow effects */}
        <div
          className="absolute top-0 left-1/3 w-96 h-48 rounded-full -translate-y-1/2 opacity-30"
          style={{ background: "radial-gradient(circle, #22c55e 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="absolute top-0 right-1/4 w-64 h-32 rounded-full -translate-y-1/3 opacity-20"
          style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)", filter: "blur(30px)" }}
        />

        <div className="relative">
          <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Link href="/comunidades" className="hover:text-white transition-colors">Comunidades</Link>
            <ChevronRight className="w-3 h-3" />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{comunidad.nombre}</span>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight">{comunidad.nombre}</h1>
          <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>{comunidad.direccion}</p>

          <div className="flex items-center gap-3 mt-5 flex-wrap">
            <Link
              href={`/comunidades/${comunidad.id}/propietarios`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:bg-white/15"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <Users className="w-3 h-3" />
              {comunidad.propietarios.length} propietarios
            </Link>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <FileText className="w-3 h-3" />
              {comunidad.documentos.length} documentos
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 pt-8 pb-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_260px]">

          {/* ── Módulos ── */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Módulos de IA
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {MODULOS.map((m) => {
                const Icon = m.icon;
                return (
                  <Link key={m.id} href={`/comunidades/${comunidad.id}/${m.id}`} className="group block">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 transition-all duration-200 hover:border-transparent hover:shadow-lg hover:-translate-y-0.5"
                      style={{ ["--hover-shadow" as string]: `0 8px 30px rgba(0,0,0,0.08)` }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{ background: `linear-gradient(135deg, ${m.from}20, ${m.to}20)` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: m.from }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground leading-tight">{m.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{m.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Propietarios */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Propietarios
              </p>
              <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">
                {comunidad.propietarios.map((p, i) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-4 py-3 text-sm"
                    style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                  >
                    <div>
                      <p className="font-medium text-xs">{p.piso}</p>
                      <p className="text-[11px] text-muted-foreground">{p.nombre}</p>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a" }}
                    >
                      {p.coeficiente}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentos recientes */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Últimos documentos
              </p>
              {comunidad.documentos.length === 0 ? (
                <div className="rounded-2xl bg-card border border-border/60 px-4 py-6 text-center">
                  <p className="text-xs text-muted-foreground">Sin documentos aún</p>
                </div>
              ) : (
                <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">
                  {comunidad.documentos.map((doc, i) => (
                    <div
                      key={doc.id}
                      className="px-4 py-3"
                      style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.05)" : "none" }}
                    >
                      <p className="text-xs font-medium leading-tight truncate">{doc.titulo}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {new Date(doc.createdAt).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
