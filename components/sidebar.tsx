"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Building2, Home, FileText, AlertTriangle,
  CalendarDays, Megaphone, Calculator, MessageSquare,
  Settings, LogOut, ChevronDown,
} from "lucide-react";
import { useState } from "react";

const NAV_MAIN = [
  { href: "/comunidades", icon: Home, label: "Comunidades" },
  { href: "/ajustes", icon: Settings, label: "Ajustes" },
];

const NAV_MODULOS = [
  { icon: FileText,      label: "Actas" },
  { icon: AlertTriangle, label: "Morosidad" },
  { icon: CalendarDays,  label: "Convocatorias" },
  { icon: Megaphone,     label: "Comunicados" },
  { icon: Calculator,    label: "Derramas" },
  { icon: MessageSquare, label: "Chat Legal" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const initials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : session?.user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <style>{`
        .nav-link { color: rgba(255,255,255,0.45); transition: color 0.15s, background 0.15s; }
        .nav-link:hover { color: #fff !important; background: rgba(255,255,255,0.07) !important; }
        .nav-link.active { color: #fff !important; background: rgba(255,255,255,0.1) !important; }
      `}</style>

      <aside
        className="w-[220px] shrink-0 flex flex-col"
        style={{ background: "#0C0C14", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/comunidades" className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#22c55e,#0ea5e9)" }}
            >
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-white">FincaIA</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV_MAIN.map(({ href, icon: Icon, label }) => (
            <Link
              key={label} href={href}
              className={`nav-link flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${pathname === href || pathname.startsWith(href + "/") ? "active" : ""}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          ))}

          <div className="pt-6 pb-2 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
              Módulos IA
            </p>
          </div>

          {NAV_MODULOS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm select-none"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(p => !p)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/5"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                {session?.user?.image
                  ? <img src={session.user.image} className="w-7 h-7 rounded-lg object-cover" alt="" />
                  : initials
                }
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-white truncate">{session?.user?.name ?? "Usuario"}</p>
                <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{session?.user?.email}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
            </button>

            {userMenuOpen && (
              <div
                className="absolute bottom-full left-0 right-0 mb-1 rounded-xl overflow-hidden"
                style={{ background: "#1a1a28", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 -8px 32px rgba(0,0,0,0.4)" }}
              >
                <Link
                  href="/ajustes"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:bg-white/5"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  <Settings className="w-4 h-4" />
                  Ajustes de cuenta
                </Link>
                <div className="mx-3 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:bg-white/5"
                  style={{ color: "rgba(239,68,68,0.7)" }}
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
