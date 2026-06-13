export interface MorosidadInput {
  propietarioNombre: string;
  piso: string;
  importeTotal: string;
  mesesImpagados: string;
  fechaReclamacion: string;
  comunidadNombre: string;
  comunidadDireccion: string;
}

const FORMATO = `
REGLAS DE FORMATO — OBLIGATORIAS:
- NO uses ningún carácter decorativo ASCII: ━ ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ═ ║ ni similares.
- NO dibujes tablas con caracteres de línea. Si necesitas mostrar importes, usa un listado simple con guiones.
- Separa secciones con una línea en blanco y el título de sección en MAYÚSCULAS seguido de dos puntos en una línea propia.
- Los párrafos se separan con una línea en blanco.
- Las listas usan "- " al principio de cada ítem.
- El texto debe poder leerse cómodamente en un documento Word sin decoración adicional.`;

export function buildMorosidadPrompt(input: MorosidadInput): string {
  return `Eres un abogado experto en Ley de Propiedad Horizontal española (LPH Ley 49/1960 y modificaciones).

Redacta una carta de reclamación de deuda por morosidad en comunidad de propietarios.

DATOS:
- Comunidad: ${input.comunidadNombre}
- Dirección: ${input.comunidadDireccion}
- Propietario moroso: ${input.propietarioNombre}, ${input.piso}
- Importe adeudado: ${input.importeTotal} €
- Período impagado: ${input.mesesImpagados}
- Fecha de la carta: ${input.fechaReclamacion}

La carta debe incluir:
1. Encabezado con remitente y destinatario
2. Detalle de la deuda (importe y período)
3. Base legal: art. 9.1.e) LPH (obligación de pago) y art. 21 LPH (procedimiento monitorio)
4. Requerimiento de pago en 30 días naturales
5. Advertencia de acciones legales en caso de impago
6. Cierre con firma del Presidente y Administrador
${FORMATO}

Responde ÚNICAMENTE con este XML sin texto adicional:

<documento>
  <titulo>CARTA DE RECLAMACIÓN DE DEUDA — ${input.comunidadNombre}</titulo>
  <cuerpo>
[TEXTO COMPLETO AQUÍ, párrafos separados por líneas en blanco, sin decoración ASCII]
  </cuerpo>
</documento>`;
}
