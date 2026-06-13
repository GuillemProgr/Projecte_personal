"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Send, Loader2, Scale, ChevronRight, Sparkles } from "lucide-react";

interface Mensaje { id: string; rol: "user" | "assistant"; contenido: string; }

const SUGERENCIAS = [
  "¿Cuántos votos necesito para aprobar una derrama?",
  "¿Puede un propietario moroso votar en junta?",
  "¿Qué plazo tengo para reclamar una deuda comunitaria?",
  "¿Cómo se convoca una junta extraordinaria?",
];

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [iniciando, setIniciando] = useState(true);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch(`/api/chat?comunidadId=${id}`)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMensajes(d); })
      .catch(() => {})
      .finally(() => setIniciando(false));
  }, [id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensajes, loading]);

  const enviar = async (texto?: string) => {
    const pregunta = (texto ?? input).trim();
    if (!pregunta || loading) return;
    setInput("");
    setLoading(true);
    setErrorEnvio(null);
    setMensajes(p => [...p, { id: Date.now().toString(), rol: "user", contenido: pregunta }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comunidadId: id, pregunta }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
      setMensajes(p => [...p, { id: data.id, rol: "assistant", contenido: data.contenido }]);
    } catch (err) {
      setErrorEnvio(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  return (
    <div className="flex flex-col h-screen min-h-0">
      {/* Header dark */}
      <div
        className="shrink-0 px-10 pt-7 pb-6"
        style={{ background: "linear-gradient(135deg,#080816,#0a0e1a)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
          <Link href="/comunidades" className="hover:text-white transition-colors">Comunidades</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/comunidades/${id}`} className="hover:text-white transition-colors">Panel</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: "rgba(255,255,255,0.7)" }}>Chat Legal</span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(14,165,233,0.2)", border: "1px solid rgba(14,165,233,0.3)" }}
          >
            <Scale className="w-5 h-5" style={{ color: "#38BDF8" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Chat Legal LPH</h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Consultas sobre propiedad horizontal · cita artículos exactos
            </p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-10 py-6">
        {iniciando ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : mensajes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-5 max-w-lg mx-auto text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,rgba(14,165,233,0.15),rgba(99,102,241,0.15))", border: "1px solid rgba(14,165,233,0.2)" }}
            >
              <Sparkles className="w-7 h-7" style={{ color: "#38BDF8" }} />
            </div>
            <div>
              <p className="font-semibold text-base">Experto en Ley de Propiedad Horizontal</p>
              <p className="text-sm text-muted-foreground mt-1.5">
                Pregunta sobre quórum, derramas, morosidad, obras… Claude cita los artículos exactos de la LPH.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {SUGERENCIAS.map(s => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="text-left text-sm px-4 py-3 rounded-xl transition-all duration-150 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(0,0,0,0.03)",
                    border: "1px solid rgba(0,0,0,0.07)",
                    color: "#374151"
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5 max-w-2xl mx-auto">
            {mensajes.map(m => (
              <div key={m.id} className={`flex gap-3 ${m.rol === "user" ? "justify-end" : "justify-start"}`}>
                {m.rol === "assistant" && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.2)" }}
                  >
                    <Scale className="w-4 h-4" style={{ color: "#38BDF8" }} />
                  </div>
                )}
                <div
                  className="max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed"
                  style={m.rol === "user"
                    ? { background: "linear-gradient(135deg,#16a34a,#0ea5e9)", color: "white", borderBottomRightRadius: 4 }
                    : { background: "white", border: "1px solid rgba(0,0,0,0.07)", color: "#111827", borderBottomLeftRadius: 4 }
                  }
                >
                  {m.contenido.split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(14,165,233,0.12)", border: "1px solid rgba(14,165,233,0.2)" }}>
                  <Scale className="w-4 h-4" style={{ color: "#38BDF8" }} />
                </div>
                <div className="bg-white border border-black/7 rounded-2xl rounded-bl-[4px] px-5 py-4 flex items-center gap-1">
                  {[0, 150, 300].map(delay => (
                    <div
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: "#9CA3AF", animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="shrink-0 px-10 py-4"
        style={{ borderTop: "1px solid rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}
      >
        {errorEnvio && (
          <p className="text-xs text-red-500 text-center mb-2 max-w-2xl mx-auto">{errorEnvio}</p>
        )}
        <div className="flex gap-3 items-end max-w-2xl mx-auto">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Pregunta sobre la LPH… (Enter para enviar)"
            rows={1}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              background: "white",
              minHeight: 44,
              maxHeight: 120,
            }}
          />
          <button
            onClick={() => enviar()}
            disabled={loading || !input.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#16a34a,#0ea5e9)" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
