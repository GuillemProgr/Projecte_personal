"use client";

import { useState } from "react";
import { User, Lock, Bell, Shield, Check, Loader2 } from "lucide-react";

interface UserInfo { id: string; name?: string | null; email?: string | null; image?: string | null; }

export default function AjustesClient({ user }: { user: UserInfo }) {
  const [name, setName] = useState(user.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // placeholder until user update API
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-full p-10 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Configuración</p>
        <h1 className="text-3xl font-bold tracking-tight">Ajustes de cuenta</h1>
      </div>

      {/* Profile */}
      <section className="rounded-2xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <User className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold">Perfil</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Nombre</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              className="w-full rounded-xl border border-input px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
            <input
              value={user.email ?? ""} disabled
              className="w-full rounded-xl border border-input px-4 py-2.5 text-sm bg-muted text-muted-foreground"
            />
          </div>

          <div className="pt-1">
            <button
              onClick={save} disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
            >
              {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Guardando…</>
                : saved ? <><Check className="w-3.5 h-3.5" />Guardado</>
                : "Guardar cambios"}
            </button>
          </div>
        </div>
      </section>

      {/* Plan */}
      <section className="rounded-2xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold">Plan y facturación</h2>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
          <div>
            <p className="font-semibold text-sm">Plan Free</p>
            <p className="text-xs text-muted-foreground mt-0.5">Hasta 10 documentos al mes · 1 comunidad</p>
          </div>
          <button
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
          >
            Mejorar plan
          </button>
        </div>
      </section>

      {/* Notificaciones */}
      <section className="rounded-2xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold">Notificaciones</h2>
        </div>
        <p className="text-sm text-muted-foreground">Próximamente — notificaciones por email cuando se generen documentos.</p>
      </section>

      {/* Seguridad */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold">Seguridad</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Cambia tu contraseña o gestiona los accesos con Google.</p>
        <button className="px-4 py-2.5 rounded-xl text-sm font-medium border border-input hover:bg-muted transition-colors">
          Cambiar contraseña
        </button>
      </section>
    </div>
  );
}
