"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Building2, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const res = await signIn("credentials", {
      email: form.email, password: form.password, redirect: false,
    });
    if (res?.error) { setError("Email o contraseña incorrectos"); setLoading(false); return; }
    router.push("/comunidades");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      // Auto-login after register
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/comunidades");
    } catch { setError("Error al crear la cuenta"); setLoading(false); }
  };

  const handleGoogle = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/comunidades" });
  };

  const callbackError = params.get("error");

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg,#080816 0%,#0a0e1a 50%,#06101a 100%)" }}
    >
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-14">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
          >
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">FincaIA</span>
        </div>

        <div>
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(22,163,74,0.8)" }}>
              La plataforma que lo cambia todo
            </p>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Gestiona tu comunidad<br />con inteligencia artificial
            </h1>
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Genera actas, convocatorias, cartas de morosidad y comunicados en segundos.
              Con cita exacta de la Ley de Propiedad Horizontal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Actas de junta", desc: "Generadas en 30 seg" },
              { label: "Chat legal LPH", desc: "Respuestas con artículos" },
              { label: "Cartas de morosos", desc: "Formato oficial" },
              { label: "Export Word", desc: "Listo para firmar" },
            ].map(f => (
              <div
                key={f.label}
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-sm font-medium text-white">{f.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © 2025 FincaIA · Todos los derechos reservados
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
            >
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">FincaIA</span>
          </div>

          {/* Tabs */}
          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {(["login", "register"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(null); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={tab === t
                  ? { background: "rgba(255,255,255,0.1)", color: "white" }
                  : { color: "rgba(255,255,255,0.4)" }
                }
              >
                {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            ))}
          </div>

          {(error || callbackError) && (
            <div
              className="rounded-xl px-4 py-3 mb-5 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#FCA5A5" }}
            >
              {error ?? "Error de autenticación. Inténtalo de nuevo."}
            </div>
          )}

          <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Nombre completo
                </label>
                <input
                  type="text" value={form.name} onChange={set("name")} required
                  placeholder="Juan García"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Email
              </label>
              <input
                type="email" value={form.email} onChange={set("email")} required
                placeholder="admin@mifinca.es"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} required
                  placeholder={tab === "register" ? "Mínimo 8 caracteres" : "••••••••"}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <button
                  type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Cargando…</span>
                : tab === "login" ? "Entrar" : "Crear cuenta gratis"
              }
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>o continúa con</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <button
            onClick={handleGoogle} disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-3 transition-all hover:bg-white/10 disabled:opacity-60"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.25)" }}>
            Al continuar aceptas nuestros{" "}
            <Link href="/legal" className="underline hover:text-white/50 transition-colors">términos de uso</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
