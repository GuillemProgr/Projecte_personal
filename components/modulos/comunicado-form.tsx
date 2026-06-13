"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface Props { comunidadId: string; onGenerado: (id: string, contenido: string) => void; }

const CATEGORIAS = ["Obras", "Avería", "Recordatorio de pago", "Normas de convivencia", "Información general", "Otro"];

export default function ComunicadoForm({ comunidadId, onGenerado }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // "categoria" en lugar de "tipo" para no colisionar con el discriminador "tipo: comunicado"
  const [form, setForm] = useState({
    asunto: "", categoria: "Información general", mensaje: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("/api/documentos/generar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        // "tipo" es el discriminador del router; "categoria" va como dato del comunicado
        body: JSON.stringify({ tipo: "comunicado", comunidadId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al generar");
      onGenerado(data.id, data.contenido);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Tipo de comunicado</Label>
          <select
            value={form.categoria}
            onChange={set("categoria")}
            className="flex h-10 w-full rounded-xl border border-input bg-white px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            {CATEGORIAS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Fecha</Label>
          <Input type="date" value={form.fecha} onChange={set("fecha")} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Asunto</Label>
        <Input value={form.asunto} onChange={set("asunto")} placeholder="Ej: Corte de agua el viernes 20 de junio" required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Contenido del mensaje</Label>
        <Textarea
          value={form.mensaje} onChange={set("mensaje")}
          placeholder="Escribe aquí la información que quieres comunicar a los vecinos…"
          rows={5} required
        />
      </div>
      {error && <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generando…</> : <><Sparkles className="w-4 h-4" />Generar Comunicado</>}
      </Button>
    </form>
  );
}
