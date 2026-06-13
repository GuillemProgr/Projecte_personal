"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Users, FileText, ArrowRight, Plus, X, Loader2 } from "lucide-react";

interface Comunidad {
  id: string;
  nombre: string;
  direccion: string;
  _count: { propietarios: number; documentos: number };
}

interface Props { comunidadesIniciales: Comunidad[]; }

function NuevaComunidadModal({ onClose, onCreada }: { onClose: () => void; onCreada: (c: Comunidad) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: "", direccion: "", numViviendas: "", cif: "", iban: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/comunidades", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreada({ ...data, _count: { propietarios: 0, documentos: 0 } });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "#fff", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">Nueva comunidad</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Nombre de la comunidad *</label>
            <input value={form.nombre} onChange={set("nombre")} required
              placeholder="Residencial Los Pinos"
              className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Dirección *</label>
            <input value={form.direccion} onChange={set("direccion")} required
              placeholder="Calle Mayor, 12 - 28001 Madrid"
              className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Nº de viviendas</label>
              <input value={form.numViviendas} onChange={set("numViviendas")} type="number" min="0"
                placeholder="12"
                className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">CIF</label>
              <input value={form.cif} onChange={set("cif")}
                placeholder="H12345678"
                className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">IBAN bancario</label>
            <input value={form.iban} onChange={set("iban")}
              placeholder="ES12 1234 5678 9012 3456 7890"
              className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-input hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}>
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" />Creando…</span> : "Crear comunidad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ComunidadesClient({ comunidadesIniciales }: Props) {
  const [comunidades, setComunidades] = useState<Comunidad[]>(comunidadesIniciales);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-full">
      {showModal && (
        <NuevaComunidadModal
          onClose={() => setShowModal(false)}
          onCreada={c => setComunidades(p => [c, ...p])}
        />
      )}

      {/* Header */}
      <div className="px-10 pt-10 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Panel de administración
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Mis Comunidades</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {comunidades.length} {comunidades.length === 1 ? "comunidad gestionada" : "comunidades gestionadas"}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
          >
            <Plus className="w-4 h-4" />
            Nueva Comunidad
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-10 pb-10">
        {comunidades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border bg-card/60">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.12),rgba(14,165,233,0.12))" }}
            >
              <Building2 className="w-7 h-7 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Sin comunidades todavía</p>
            <p className="text-sm text-muted-foreground mt-1">Crea tu primera comunidad para empezar</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
            >
              <Plus className="w-4 h-4" />
              Crear primera comunidad
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comunidades.map((c) => (
              <Link key={c.id} href={`/comunidades/${c.id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border/60 p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
                  <div
                    className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)" }}
                  />
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: "linear-gradient(135deg,rgba(34,197,94,0.15),rgba(14,165,233,0.1))" }}
                    >
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="font-semibold text-base text-foreground leading-snug">{c.nombre}</h2>
                    <p className="text-xs text-muted-foreground mt-1 mb-5">{c.direccion}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />{c._count.propietarios}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <FileText className="w-3.5 h-3.5" />{c._count.documentos}
                        </span>
                      </div>
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0"
                        style={{ background: "rgba(34,197,94,0.1)" }}
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
