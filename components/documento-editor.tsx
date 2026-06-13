"use client";

import { useState } from "react";
import { Download, Pencil, Check } from "lucide-react";

interface Props {
  docId: string;
  contenidoInicial: string;
}

// Limpia caracteres ASCII decorativos que Claude a veces genera
function sanitize(raw: string): string {
  return raw
    .split("\n")
    .map(line => {
      const trimmed = line.trim();
      // Líneas que son SOLO decoración (sin ninguna letra o dígito útil)
      if (trimmed.length >= 4 && /^[━─═╔╗╚╝║╠╣╦╩╬┌┐└┘├┤┬┴┼│\s]+$/.test(trimmed)) return "";
      // Líneas tipo "──── TITULO ────" o "── I. OBJETO ──": extrae el texto del centro
      // Usamos \p{L} para no excluir encabezados que empiezan con dígito o romano
      const headingMatch = line.match(/^[─━═\-\s]{3,}(.{3,}?)[─━═\-\s]{3,}$/u);
      if (headingMatch && /\p{L}/u.test(headingMatch[1])) return headingMatch[1].trim();
      // Celdas de tablas ASCII: "│ texto │ texto │" → "texto — texto"
      if (line.includes("│")) {
        const cells = line.split("│").map(s => s.trim()).filter(s => s && !/^[-─┼┬┴━]+$/.test(s));
        if (cells.length > 0) return cells.join("  —  ");
        return "";
      }
      return line;
    })
    .join("\n");
}

type LineType = "heading" | "subheading" | "listitem" | "empty" | "text";

function classifyLine(line: string): LineType {
  const t = line.trim();
  if (!t) return "empty";
  if (t.startsWith("- ") || t.startsWith("• ")) return "listitem";
  // All-caps headings (e.g. "FUNDAMENTO JURÍDICO:", "I. OBJETO")
  if (/^[IVX]+\.\s+[A-ZÁÉÍÓÚÑÜ\s]{3,}$/.test(t)) return "heading";
  if (/^[0-9]+[º°]?\s*[\.\)]\s+[A-ZÁÉÍÓÚÑÜ\s]{3,}$/.test(t)) return "heading";
  if (t === t.toUpperCase() && t.length > 3 && t.length < 120 && /[A-ZÁÉÍÓÚÑÜ]{4,}/.test(t)) return "heading";
  // Numbered sub-items or lead lines
  if (/^[a-z]\)\s/.test(t) || /^[0-9]+\.\s/.test(t)) return "subheading";
  return "text";
}

function DocumentRenderer({ contenido }: { contenido: string }) {
  const lines = sanitize(contenido).split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const t = raw.trim();
    const type = classifyLine(raw);

    if (type === "empty") {
      // skip consecutive empties
      if (i === 0 || classifyLine(lines[i - 1]) !== "empty") {
        elements.push(<div key={key++} className="h-3" />);
      }
      continue;
    }

    if (type === "heading") {
      elements.push(
        <div key={key++} className="mt-6 mb-2">
          <p
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: "#6B7280", letterSpacing: "0.12em" }}
          >
            {t.replace(/:$/, "")}
          </p>
          <div className="mt-1.5 h-px" style={{ background: "linear-gradient(90deg,#E5E7EB,transparent)" }} />
        </div>
      );
      continue;
    }

    if (type === "subheading") {
      elements.push(
        <p key={key++} className="font-semibold text-[13px] mt-3 mb-1" style={{ color: "#111827" }}>
          {t}
        </p>
      );
      continue;
    }

    if (type === "listitem") {
      const text = t.replace(/^[-•]\s+/, "");
      elements.push(
        <div key={key++} className="flex gap-2.5 my-1">
          <span className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#9CA3AF" }} />
          <p className="text-[13.5px] leading-[1.7]" style={{ color: "#374151" }}>{text}</p>
        </div>
      );
      continue;
    }

    // Regular text — detect if it's a header line like "Madrid, 13 de junio…" or signature
    const isSignature = /^_{4,}/.test(t) || /^(EL PRESIDENTE|EL ADMINISTRADOR|Fdo\.|D\.|Dña\.)/i.test(t);
    const isMeta = /^(REMITENTE|DESTINATARIO|ASUNTO|DE:|PARA:|LUGAR:|FECHA:)/i.test(t);
    const isDate = /^(Madrid|Barcelona|Valencia|Sevilla|Bilbao|Zaragoza),?\s+\d/.test(t);

    if (isSignature) {
      elements.push(
        <p key={key++} className="text-[12.5px] mt-2" style={{ color: "#6B7280", fontStyle: "italic" }}>{t}</p>
      );
      continue;
    }

    if (isMeta) {
      const [label, ...rest] = t.split(":");
      elements.push(
        <p key={key++} className="text-[13px] my-0.5">
          <span className="font-semibold" style={{ color: "#111827" }}>{label}:</span>
          <span style={{ color: "#374151" }}>{rest.join(":")}</span>
        </p>
      );
      continue;
    }

    if (isDate) {
      elements.push(
        <p key={key++} className="text-[13px] my-1" style={{ color: "#6B7280" }}>{t}</p>
      );
      continue;
    }

    elements.push(
      <p
        key={key++}
        className="text-[13.5px] leading-[1.75]"
        style={{ color: "#1F2937", textAlign: "justify" }}
      >
        {t}
      </p>
    );
  }

  return <>{elements}</>;
}

export default function DocumentoEditor({ docId, contenidoInicial }: Props) {
  const [contenido, setContenido] = useState(contenidoInicial);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  const guardar = async () => {
    if (guardando) return;
    setGuardando(true);
    setErrorGuardar(null);
    try {
      const res = await fetch(`/api/documentos/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Error ${res.status}`);
      }
      setEditando(false);
    } catch (err) {
      setErrorGuardar(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const exportar = async () => {
    setExportando(true);
    try {
      const res = await fetch(`/api/documentos/${docId}/export`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `documento-${docId.slice(0, 8)}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-xl"
        style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p className="text-xs text-muted-foreground">
          {editando ? "Modo edición — texto libre" : "Vista previa del documento"}
        </p>
        <div className="flex items-center gap-2">
          {editando ? (
            <>
              {errorGuardar && (
                <span className="text-xs text-red-500 mr-1">{errorGuardar}</span>
              )}
              <button
                onClick={guardar}
                disabled={guardando}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <Check className="w-3.5 h-3.5" />
                {guardando ? "Guardando…" : "Guardar"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ border: "1px solid rgba(0,0,0,0.08)" }}
            >
              <Pencil className="w-3.5 h-3.5" />
              Editar texto
            </button>
          )}
          <button
            onClick={exportar}
            disabled={exportando}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
          >
            <Download className="w-3.5 h-3.5" />
            {exportando ? "Generando…" : "Exportar Word"}
          </button>
        </div>
      </div>

      {/* Document canvas */}
      <div className="rounded-2xl p-5" style={{ background: "#E8E9EB", minHeight: 560 }}>
        <div
          className="max-w-[700px] mx-auto rounded-xl overflow-hidden"
          style={{ background: "#FFFFFF", boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}
        >
          {editando ? (
            <textarea
              value={contenido}
              onChange={e => setContenido(e.target.value)}
              className="w-full min-h-[520px] p-10 text-sm leading-relaxed resize-none focus:outline-none font-mono"
              style={{ color: "#374151" }}
            />
          ) : (
            <div className="px-12 py-10">
              <DocumentRenderer contenido={contenido} />

              {/* Signature area */}
              <div className="mt-12 pt-6 grid grid-cols-2 gap-8" style={{ borderTop: "1px solid #F3F4F6" }}>
                <div>
                  <div className="h-8 mb-2" style={{ borderBottom: "1px solid #D1D5DB" }} />
                  <p className="text-[11px]" style={{ color: "#9CA3AF" }}>El Presidente de la Comunidad</p>
                </div>
                <div>
                  <div className="h-8 mb-2" style={{ borderBottom: "1px solid #D1D5DB" }} />
                  <p className="text-[11px]" style={{ color: "#9CA3AF" }}>El Administrador de Fincas</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
