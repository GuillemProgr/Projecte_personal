export interface ComunicadoInput {
  asunto: string;
  categoria: string;
  mensaje: string;
  fecha: string;
  comunidadNombre: string;
  comunidadDireccion: string;
}

const FORMATO = `
REGLAS DE FORMATO — OBLIGATORIAS:
- NO uses caracteres decorativos ASCII (━ ─ │ ┌ ┐ etc.).
- Párrafos separados por línea en blanco.
- Listas con "- " al inicio de cada ítem.
- Tono formal pero cercano.`;

export function buildComunicadoPrompt(input: ComunicadoInput): string {
  return `Eres un administrador de fincas profesional. Redacta una circular formal para los vecinos.

DATOS:
- Comunidad: ${input.comunidadNombre} — ${input.comunidadDireccion}
- Tipo: ${input.categoria}
- Asunto: ${input.asunto}
- Fecha: ${input.fecha}
- Contenido: ${input.mensaje}

Incluye: membrete con datos de la comunidad, fecha, asunto en negrita, cuerpo con la información de forma clara y estructurada, cierre con firma del Administrador/Presidente.
${FORMATO}

Responde ÚNICAMENTE con este XML:

<documento>
  <titulo>COMUNICADO A PROPIETARIOS</titulo>
  <cuerpo>
[TEXTO COMPLETO AQUÍ]
  </cuerpo>
</documento>`;
}
