export interface ActaInput {
  fecha: string;
  hora: string;
  lugar: string;
  asistentes: string;
  puntosOrdenDia: string;
  acuerdosTomados: string;
  comunidadNombre: string;
  comunidadDireccion: string;
  propietarios: Array<{ nombre: string; piso: string; coeficiente: number }>;
}

const FORMATO = `
REGLAS DE FORMATO — OBLIGATORIAS:
- NO uses ningún carácter decorativo ASCII: ━ ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ═ ║ ni similares.
- NO dibujes tablas con caracteres de línea.
- Las secciones se encabezan con su título en MAYÚSCULAS en una línea propia, seguido de línea en blanco.
- Los párrafos se separan con una línea en blanco.
- Las listas usan "- " al principio de cada ítem.
- Tono formal, redacción fluida, sin decoración tipográfica innecesaria.`;

export function buildActaSystemPrompt(): string {
  return `Eres un experto administrador de fincas colegiado con más de 20 años de experiencia y profundo conocimiento de la Ley de Propiedad Horizontal española (Ley 49/1960, modificada por Ley 8/1999). Redactas actas formalmente correctas citando artículos exactos de la LPH. Respondes ÚNICAMENTE con el XML solicitado, sin texto adicional antes ni después.`;
}

export function buildActaUserPrompt(input: ActaInput): string {
  const propietariosList = input.propietarios
    .map(p => `- ${p.piso}: ${p.nombre} (coeficiente: ${p.coeficiente}%)`)
    .join("\n");

  return `Redacta el acta de la junta de propietarios con los siguientes datos:

COMUNIDAD: ${input.comunidadNombre} — ${input.comunidadDireccion}

PROPIETARIOS:
${propietariosList}

JUNTA: ${input.fecha} a las ${input.hora} en ${input.lugar}
ASISTENTES: ${input.asistentes}

ORDEN DEL DÍA:
${input.puntosOrdenDia}

ACUERDOS TOMADOS:
${input.acuerdosTomados}

El acta debe incluir: encabezado, constitución de la junta, desarrollo de cada punto con artículos LPH aplicables, acuerdos adoptados con resultado de votación, cierre y firmas.
${FORMATO}

Responde ÚNICAMENTE con este XML:

<acta>
  <titulo>ACTA DE JUNTA DE PROPIETARIOS</titulo>
  <comunidad>${input.comunidadNombre}</comunidad>
  <fecha>${input.fecha}</fecha>
  <cuerpo>
[TEXTO COMPLETO AQUÍ]
  </cuerpo>
</acta>`;
}
