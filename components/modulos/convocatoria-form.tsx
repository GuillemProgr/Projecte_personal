"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface Props { comunidadId: string; onGenerado: (id: string, contenido: string) => void; }

export default function ConvocatoriaForm({ comunidadId, onGenerado }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    fechaPrimera: today, horaPrimera: "19:00",
    fechaSegunda: today, horaSegunda: "19:30",
    lugar: "Sala de reuniones de la comunidad",
    ordenDia: "1. Aprobación del acta anterior\n2. Estado de cuentas\n3. Presupuesto anual\n4. Ruegos y preguntas",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("/api/documentos/generar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "convocatoria", comunidadId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al generar");
      onGenerado(data.id, data.contenido);
    } catch (err) { setError(err instanceof Error ? err.message : "Error"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Primera convocatoria</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Fecha</Label>
            <Input type="date" value={form.fechaPrimera} onChange={set("fechaPrimera")} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Hora</Label>
            <Input type="time" value={form.horaPrimera} onChange={set("horaPrimera")} required />
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-3">Segunda convocatoria</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Fecha</Label>
            <Input type="date" value={form.fechaSegunda} onChange={set("fechaSegunda")} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Hora</Label>
            <Input type="time" value={form.horaSegunda} onChange={set("horaSegunda")} required />
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Lugar</Label>
        <Input value={form.lugar} onChange={set("lugar")} required />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Orden del día</Label>
        <Textarea value={form.ordenDia} onChange={set("ordenDia")} rows={4} required />
      </div>
      {error && <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generando…</> : <><Sparkles className="w-4 h-4" />Generar Convocatoria</>}
      </Button>
    </form>
  );
}
