import Link from "next/link";
import {
  Building2, FileText, AlertTriangle, CalendarDays,
  Megaphone, Calculator, MessageSquare, ArrowRight,
  Check, Zap, Shield, Clock,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileText, color: "#6366F1",
    title: "Actas de Junta",
    desc: "Genera actas completas y legales en 30 segundos. Incluye asistentes, acuerdos y referencias exactas a la LPH.",
  },
  {
    icon: AlertTriangle, color: "#EF4444",
    title: "Cartas de Morosidad",
    desc: "Reclamaciones de deuda con fundamento legal sólido. Cita el artículo 21 LPH automáticamente.",
  },
  {
    icon: CalendarDays, color: "#8B5CF6",
    title: "Convocatorias",
    desc: "Primera y segunda convocatoria según el artículo 16 LPH. Con todos los puntos del orden del día.",
  },
  {
    icon: Megaphone, color: "#F59E0B",
    title: "Comunicados",
    desc: "Circulares para obras, averías, normas de convivencia. Formato profesional listo para distribuir.",
  },
  {
    icon: Calculator, color: "#10B981",
    title: "Derramas",
    desc: "Calcula automáticamente la cuota de cada propietario según su coeficiente y genera la carta informativa.",
  },
  {
    icon: MessageSquare, color: "#0EA5E9",
    title: "Chat Legal LPH",
    desc: "Resuelve cualquier duda sobre propiedad horizontal. Claude cita los artículos exactos de la ley.",
  },
];

const PLANES = [
  {
    name: "Gratis", price: "0€", period: "/mes",
    desc: "Para empezar sin compromiso",
    color: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    features: ["1 comunidad", "10 documentos/mes", "Chat legal básico", "Export Word"],
    cta: "Crear cuenta gratis", href: "/login", highlight: false,
  },
  {
    name: "Pro", price: "29€", period: "/mes",
    desc: "Para administradores activos",
    color: "linear-gradient(135deg,rgba(22,163,74,0.15),rgba(14,165,233,0.1))",
    border: "rgba(34,197,94,0.3)",
    features: ["Comunidades ilimitadas", "Documentos ilimitados", "Chat legal avanzado", "Export Word + PDF", "Historial completo", "Soporte prioritario"],
    cta: "Empezar prueba gratis", href: "/login", highlight: true,
  },
  {
    name: "Empresa", price: "99€", period: "/mes",
    desc: "Para gestorías y despachos",
    color: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.08)",
    features: ["Todo de Pro", "Hasta 50 usuarios", "API de integración", "SLA garantizado", "Onboarding dedicado", "Facturación personalizada"],
    cta: "Contactar ventas", href: "mailto:hola@fincaia.es", highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: "#080816", color: "white", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 h-16" style={{ background: "rgba(8,8,22,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}>
            <Building2 className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <span className="font-bold text-lg tracking-tight">FincaIA</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
          <a href="#precios" className="hover:text-white transition-colors">Precios</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 rounded-xl transition-colors hover:bg-white/5" style={{ color: "rgba(255,255,255,0.6)" }}>
            Iniciar sesión
          </Link>
          <Link href="/login" className="text-sm px-4 py-2 rounded-xl font-medium text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}>
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-32 text-center">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]" style={{ background: "radial-gradient(ellipse, rgba(22,163,74,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px]" style={{ background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px]" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="relative max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)", color: "#4ade80" }}
          >
            <Zap className="w-3 h-3" />
            Powered by Claude AI · Ley de Propiedad Horizontal
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
            style={{ background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            Gestiona tu comunidad<br />
            <span style={{ background: "linear-gradient(135deg,#22c55e,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              con inteligencia artificial
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Genera actas, convocatorias, cartas de morosidad y comunicados en segundos.
            Claude AI cita los artículos exactos de la LPH — sin errores, sin plantillas.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)", boxShadow: "0 0 40px rgba(22,163,74,0.3)" }}
            >
              Empezar gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium transition-all hover:bg-white/8"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
            >
              Ver funcionalidades
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16 pt-12" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { value: "30 seg", label: "para generar un acta" },
              { value: "6", label: "módulos de IA incluidos" },
              { value: "100%", label: "conforme a la LPH" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold" style={{ background: "linear-gradient(135deg,#22c55e,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(34,197,94,0.8)" }}>Funcionalidades</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas para tu comunidad</h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Seis módulos de IA especializados en la gestión de comunidades de propietarios según la legislación española.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-24" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(14,165,233,0.8)" }}>Cómo funciona</p>
            <h2 className="text-3xl md:text-4xl font-bold">De cero a documento legal en 3 pasos</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", icon: Building2, color: "#22c55e", title: "Crea tu comunidad", desc: "Añade los datos de la comunidad y los propietarios con sus coeficientes de participación." },
              { step: "02", icon: Zap, color: "#0ea5e9", title: "Elige el módulo", desc: "Selecciona qué documento necesitas: acta, convocatoria, carta de morosidad…" },
              { step: "03", icon: FileText, color: "#8b5cf6", title: "Descarga en Word", desc: "Claude genera el documento completo. Descárgalo en Word, edítalo y fírmalo." },
            ].map(s => (
              <div key={s.step} className="relative">
                <div className="text-6xl font-black mb-4 select-none" style={{ color: "rgba(255,255,255,0.04)" }}>{s.step}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section id="precios" className="px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "rgba(34,197,94,0.8)" }}>Precios</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sin sorpresas, sin letra pequeña</h2>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.45)" }}>Cancela cuando quieras. Sin permanencia.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANES.map(plan => (
            <div
              key={plan.name}
              className="rounded-2xl p-7 flex flex-col relative"
              style={{
                background: plan.color,
                border: `1px solid ${plan.border}`,
                boxShadow: plan.highlight ? "0 0 60px rgba(22,163,74,0.15)" : undefined,
              }}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
                >
                  Más popular
                </div>
              )}
              <div className="mb-6">
                <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-sm mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.period}</span>
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{plan.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                    <Check className="w-4 h-4 shrink-0" style={{ color: "#22c55e" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="block text-center py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={plan.highlight
                  ? { background: "linear-gradient(135deg,#16a34a,#0ea5e9)", color: "white" }
                  : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-6 py-24">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,rgba(22,163,74,0.12),rgba(14,165,233,0.08))", border: "1px solid rgba(22,163,74,0.2)" }}
        >
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center top, rgba(22,163,74,0.1) 0%, transparent 60%)" }} />
          <div className="relative">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-5 h-5" style={{ color: "#22c55e" }} />
              <span className="text-sm" style={{ color: "#4ade80" }}>Sin tarjeta de crédito · Gratis para empezar</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para modernizar tu comunidad?</h2>
            <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
              Únete a los administradores que ya ahorran horas cada mes con FincaIA.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)", boxShadow: "0 0 40px rgba(22,163,74,0.3)" }}
            >
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-8 py-10" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#22c55e,#0ea5e9)" }}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">FincaIA</span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            © 2025 FincaIA · Gestión de comunidades con IA · Madrid, España
          </p>
          <div className="flex items-center gap-5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Link href="/legal" className="hover:text-white transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <a href="mailto:hola@fincaia.es" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
