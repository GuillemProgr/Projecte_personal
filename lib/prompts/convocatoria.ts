export interface ConvocatoriaInput {
  fechaPrimera: string;
  horaPrimera: string;
  fechaSegunda: string;
  horaSegunda: string;
  lugar: string;
  ordenDia: string;
  comunidadNombre: string;
  comunidadDireccion: string;
}

const FORMATO = `
REGLAS DE FORMATO — OBLIGATORIAS:
- NO uses caracteres decorativos ASCII (━ ─ │ ┌ ┐ etc.).
- Secciones con título en MAYÚSCULAS en línea propia.
- Párrafos separados por línea en blanco.
- Listas con "- " al inicio de cada ítem.`;

export function buildConvocatoriaPrompt(input: ConvocatoriaInput): string {
  return `Eres un experto administrador de fincas. Redacta una convocatoria formal de Junta de Propietarios.

DATOS:
- Comunidad: ${input.comunidadNombre} — ${input.comunidadDireccion}
- Primera convocatoria: ${input.fechaPrimera} a las ${input.horaPrimera}
- Segunda convocatoria: ${input.fechaSegunda} a las ${input.horaSegunda}
- Lugar: ${input.lugar}
- Orden del día: ${input.ordenDia}

Incluye: encabezado con datos de la comunidad, cuerpo con primera y segunda convocatoria, orden del día numerado, referencias al art. 16 LPH (convocatoria), art. 17 LPH (quórum) y art. 15 LPH (delegación de voto), cierre con firma del Presidente.
${FORMATO}

Responde ÚNICAMENTE con este XML:

<documento>
  <titulo>CONVOCATORIA DE JUNTA DE PROPIETARIOS</titulo>
  <cuerpo>
[TEXTO COMPLETO AQUÍ]
  </cuerpo>
</documento>`;
}
