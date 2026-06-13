"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface Props { comunidadId: string; onGenerado: (id: string, contenido: string) => void; }

export default function DerramaForm({ comunidadId, onGenerado }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    importeTotal: "", descripcionObra: "", plazoMeses: "6",
    fechaInicio: new Date().toISOString().split("T")[0],
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch("/api/documentos/generar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "derrama", comunidadId, ...form }),
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
          <Label className="text-xs text-muted-foreground">Importe total aprobado (€)</Label>
          <Input type="number" value={form.importeTotal} onChange={set("importeTotal")} placeholder="12000" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Plazo de pago (meses)</Label>
          <Input type="number" value={form.plazoMeses} onChange={set("plazoMeses")} min="1" max="60" required />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">Fecha de inicio de pagos</Label>
          <Input type="date" value={form.fechaInicio} onChange={set("fechaInicio")} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Descripción de la obra</Label>
        <Textarea
          value={form.descripcionObra} onChange={set("descripcionObra")}
          placeholder="Ej: Rehabilitación de fachada principal del edificio, aprobada en Junta del 10 de junio de 2026…"
          rows={3} required
        />
      </div>
      {error && <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Calculando y generando…</> : <><Sparkles className="w-4 h-4" />Calcular Derrama y Generar Carta</>}
      </Button>
    </form>
  );
}
