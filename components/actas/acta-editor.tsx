"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Download, Edit3, Check, FileText } from "lucide-react";

interface Props {
  docId: string;
  contenidoInicial: string;
}

export default function ActaEditor({ docId, contenidoInicial }: Props) {
  const [contenido, setContenido] = useState(contenidoInicial);
  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [exportando, setExportando] = useState(false);

  const guardarCambios = async () => {
    await fetch(`/api/documentos/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenido }),
    });
    setGuardado(true);
    setEditando(false);
    setTimeout(() => setGuardado(false), 2000);
  };

  const exportarWord = async () => {
    setExportando(true);
    try {
      const res = await fetch(`/api/documentos/${docId}/export`);
      if (!res.ok) throw new Error("Error al exportar");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `acta-${docId.slice(0, 8)}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Acta generada — puedes editarla antes de exportar</span>
        </div>
        <div className="flex gap-2">
          {editando ? (
            <Button size="sm" variant="outline" onClick={guardarCambios} className="gap-1.5">
              <Check className="w-3.5 h-3.5" />
              {guardado ? "Guardado" : "Guardar cambios"}
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditando(true)}
              className="gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar
            </Button>
          )}
          <Button size="sm" onClick={exportarWord} disabled={exportando} className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            {exportando ? "Generando Word..." : "Exportar a Word"}
          </Button>
        </div>
      </div>

      {editando ? (
        <Textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={30}
          className="font-mono text-sm resize-none"
        />
      ) : (
        <div className="rounded-lg border bg-card p-6 min-h-[500px] whitespace-pre-wrap text-sm leading-relaxed font-mono">
          {contenido}
        </div>
      )}
    </div>
  );
}
