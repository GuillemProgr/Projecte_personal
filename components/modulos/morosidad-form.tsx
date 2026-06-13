"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";

interface Props { comunidadId: string; onGenerado: (id: string, contenido: string) => void; }

export default function MorosidadForm({ comunidadId, onGenerado }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    propietarioNombre: "", piso: "", importeTotal: "", mesesImpagados: "",
    fechaReclamacion: new Date().toISOString().split("T")[0],
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("/api/documentos/generar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "morosidad", comunidadId, ...form }),
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
          <Label className="text-xs text-muted-foreground">Nombre del propietario</Label>
          <Input value={form.propietarioNombre} onChange={set("propietarioNombre")} placeholder="María García López" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Piso / Puerta</Label>
          <Input value={form.piso} onChange={set("piso")} placeholder="1º A" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Importe adeudado (€)</Label>
          <Input type="number" value={form.importeTotal} onChange={set("importeTotal")} placeholder="450.00" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Período impagado</Label>
          <Input value={form.mesesImpagados} onChange={set("mesesImpagados")} placeholder="enero, febrero y marzo 2026" required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">Fecha de la carta</Label>
          <Input type="date" value={form.fechaReclamacion} onChange={set("fechaReclamacion")} required />
        </div>
      </div>
      {error && <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generando…</> : <><Sparkles className="w-4 h-4" />Generar Carta de Morosidad</>}
      </Button>
    </form>
  );
}
