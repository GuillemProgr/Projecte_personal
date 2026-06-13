"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Pencil, Trash2, X, Loader2, Users, AlertCircle } from "lucide-react";

interface Propietario {
  id: string; nombre: string; piso: string; coeficiente: number;
  email: string | null; telefono: string | null; moroso: boolean;
}
interface Comunidad { id: string; nombre: string; direccion: string; }

const EMPTY_FORM = { nombre: "", piso: "", coeficiente: "", email: "", telefono: "", moroso: false };

function PropietarioModal({
  comunidadId, editando, onClose, onGuardado,
}: {
  comunidadId: string;
  editando: Propietario | null;
  onClose: () => void;
  onGuardado: (p: Propietario) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(editando
    ? { nombre: editando.nombre, piso: editando.piso, coeficiente: String(editando.coeficiente), email: editando.email ?? "", telefono: editando.telefono ?? "", moroso: editando.moroso }
    : EMPTY_FORM
  );

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const url = editando ? `/api/propietarios/${editando.id}` : "/api/propietarios";
      const method = editando ? "PATCH" : "POST";
      const body = editando ? form : { ...form, comunidadId };
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onGuardado(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 bg-white" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{editando ? "Editar propietario" : "Nuevo propietario"}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/5"><X className="w-4 h-4 text-muted-foreground" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Nombre completo *</label>
              <input value={form.nombre} onChange={set("nombre")} required placeholder="Ana García" className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Piso *</label>
              <input value={form.piso} onChange={set("piso")} required placeholder="1º A" className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Coeficiente (%)</label>
            <input value={form.coeficiente} onChange={set("coeficiente")} type="number" step="0.01" placeholder="16.50" className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Email</label>
              <input value={form.email} onChange={set("email")} type="email" placeholder="ana@email.com" className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Teléfono</label>
              <input value={form.telefono} onChange={set("telefono")} placeholder="612 345 678" className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.moroso} onChange={e => setForm(p => ({ ...p, moroso: e.target.checked }))} className="rounded" />
            <span className="text-sm text-muted-foreground">Marcar como moroso</span>
          </label>
          {error && <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-input hover:bg-muted">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}>
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" />Guardando…</span> : editando ? "Guardar cambios" : "Añadir propietario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PropietariosClient({ comunidad, propietariosIniciales }: { comunidad: Comunidad; propietariosIniciales: Propietario[] }) {
  const [propietarios, setPropietarios] = useState<Propietario[]>(propietariosIniciales);
  const [modal, setModal] = useState<{ open: boolean; editando: Propietario | null }>({ open: false, editando: null });
  const [eliminando, setEliminando] = useState<string | null>(null);

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este propietario? Se borrarán todos sus datos.")) return;
    setEliminando(id);
    try {
      const res = await fetch(`/api/propietarios/${id}`, { method: "DELETE" });
      if (res.ok) setPropietarios(p => p.filter(x => x.id !== id));
    } finally { setEliminando(null); }
  };

  const onGuardado = (p: Propietario) => {
    setPropietarios(prev => {
      const idx = prev.findIndex(x => x.id === p.id);
      if (idx >= 0) { const copy = [...prev]; copy[idx] = p; return copy; }
      return [...prev, p];
    });
  };

  const totalCoef = propietarios.reduce((s, p) => s + p.coeficiente, 0);

  return (
    <div className="min-h-full">
      {modal.open && (
        <PropietarioModal
          comunidadId={comunidad.id}
          editando={modal.editando}
          onClose={() => setModal({ open: false, editando: null })}
          onGuardado={onGuardado}
        />
      )}

      {/* Header */}
      <div
        className="px-10 pt-7 pb-6"
        style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
          <Link href="/comunidades" className="hover:text-white transition-colors">Comunidades</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/comunidades/${comunidad.id}`} className="hover:text-white transition-colors">{comunidad.nombre}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Propietarios</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
              <Users className="w-5 h-5" style={{ color: "#818CF8" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Propietarios</h1>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                {propietarios.length} propietarios · coef. total: {totalCoef.toFixed(2)}%
              </p>
            </div>
          </div>
          <button
            onClick={() => setModal({ open: true, editando: null })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
          >
            <Plus className="w-4 h-4" /> Añadir propietario
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-10">
        {propietarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border">
            <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="font-medium text-muted-foreground">Sin propietarios</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Añade los propietarios de esta comunidad</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Piso</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Nombre</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground">Coef.</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-muted-foreground">Estado</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody>
                {propietarios.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.05)" : undefined }}
                    className="hover:bg-black/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-muted-foreground">{p.piso}</td>
                    <td className="px-5 py-3.5 font-medium">{p.nombre}</td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{p.email ?? "—"}</td>
                    <td className="px-5 py-3.5 text-right font-mono text-xs">{p.coeficiente.toFixed(2)}%</td>
                    <td className="px-5 py-3.5 text-center">
                      {p.moroso ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                          <AlertCircle className="w-3 h-3" /> Moroso
                        </span>
                      ) : (
                        <span className="inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.1)", color: "#16a34a" }}>
                          Al día
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setModal({ open: true, editando: p })} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors">
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button onClick={() => eliminar(p.id)} disabled={eliminando === p.id} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40">
                          {eliminando === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" /> : <Trash2 className="w-3.5 h-3.5 text-red-400" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
