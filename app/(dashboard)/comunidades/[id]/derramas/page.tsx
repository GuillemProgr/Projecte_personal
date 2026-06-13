"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DerramaForm from "@/components/modulos/derrama-form";
import DocumentoEditor from "@/components/documento-editor";
import { Calculator, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";

export default function DerramasPage() {
  const { id } = useParams<{ id: string }>();
  const [docId, setDocId] = useState<string | null>(null);
  const [contenido, setContenido] = useState("");

  return (
    <div className="min-h-full">
      <div className="px-10 pt-8 pb-8" style={{ background: "linear-gradient(135deg,#071a0e,#091f11)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          <Link href="/comunidades" className="hover:text-white transition-colors">Comunidades</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/comunidades/${id}`} className="hover:text-white transition-colors">Panel</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Derramas</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)" }}>
            <Calculator className="w-5 h-5" style={{ color: "#6EE7B7" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Cálculo de Derrama</h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Cuota por propietario según coeficiente + carta</p>
          </div>
        </div>
      </div>
      <div className="px-10 py-8 max-w-3xl">
        {!docId ? (
          <div className="rounded-2xl bg-card border border-border/60 p-7">
            <DerramaForm comunidadId={id} onGenerado={(i, c) => { setDocId(i); setContenido(c); }} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#16a34a" }}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Derrama calculada. Revisa la tabla y exporta a Word.
            </div>
            <DocumentoEditor docId={docId} contenidoInicial={contenido} />
            <button onClick={() => { setDocId(null); setContenido(""); }} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Nueva derrama
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
