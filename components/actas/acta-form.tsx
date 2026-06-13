"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";

interface Props {
  comunidadId: string;
  onGenerado: (docId: string, contenido: string) => void;
}

export default function ActaForm({ comunidadId, onGenerado }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split("T")[0],
    hora: "19:00",
    lugar: "Sala de reuniones de la comunidad",
    asistentes: "",
    puntosOrdenDia: "1. Aprobación del acta anterior\n2. Estado de cuentas del ejercicio\n3. Aprobación del presupuesto anual\n4. Ruegos y preguntas",
    acuerdosTomados: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/documentos/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "acta", comunidadId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al generar");
      onGenerado(data.id, data.contenido);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Fecha</Label>
          <Input type="date" value={form.fecha} onChange={set("fecha")} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Hora</Label>
          <Input type="time" value={form.hora} onChange={set("hora")} required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Lugar</Label>
          <Input value={form.lugar} onChange={set("lugar")} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Asistentes</Label>
        <Textarea
          value={form.asistentes}
          onChange={set("asistentes")}
          placeholder="María García (1ºA), Juan Martínez (1ºB)…"
          rows={2}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Orden del día</Label>
        <Textarea value={form.puntosOrdenDia} onChange={set("puntosOrdenDia")} rows={4} required />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Acuerdos tomados</Label>
        <Textarea
          value={form.acuerdosTomados}
          onChange={set("acuerdosTomados")}
          placeholder="Describe los acuerdos en texto libre, Claude estructurará el acta…"
          rows={4}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generando con Claude…</> : <><Sparkles className="w-4 h-4" />Generar Acta con IA</>}
      </Button>
    </form>
  );
}
