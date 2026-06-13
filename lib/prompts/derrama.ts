export interface DerramaInput {
  importeTotal: string;
  descripcionObra: string;
  plazoMeses: string;
  fechaInicio: string;
  comunidadNombre: string;
  comunidadDireccion: string;
  propietarios: Array<{ nombre: string; piso: string; coeficiente: number }>;
}

const FORMATO = `
REGLAS DE FORMATO — OBLIGATORIAS:
- NO uses caracteres decorativos ASCII (━ ─ │ ┌ ┐ etc.).
- NO dibujes tablas ASCII. Para la tabla de cuotas, usa un listado simple con este formato por línea:
  "Piso Xº X — Nombre Apellido: XXX,XX € total / XX,XX € al mes"
- Párrafos separados por línea en blanco.
- Secciones con título en MAYÚSCULAS en línea propia.`;

export function buildDerramaPrompt(input: DerramaInput): string {
  const total = parseFloat(input.importeTotal) || 0;
  const plazo = Math.max(parseInt(input.plazoMeses) || 1, 1);
  const totalCoef = input.propietarios.reduce((s, p) => s + p.coeficiente, 0);
  const baseCoef = totalCoef > 0 ? totalCoef : 1;

  const listaCuotas = input.propietarios
    .map(p => {
      const cuotaTotal = ((p.coeficiente / baseCoef) * total).toFixed(2);
      const cuotaMes = (parseFloat(cuotaTotal) / plazo).toFixed(2);
      return `Piso ${p.piso} — ${p.nombre}: ${cuotaTotal} € total / ${cuotaMes} € al mes`;
    })
    .join("\n");

  return `Eres un administrador de fincas experto. Redacta la carta de comunicación de derrama extraordinaria.

DATOS:
- Comunidad: ${input.comunidadNombre} — ${input.comunidadDireccion}
- Obra: ${input.descripcionObra}
- Importe total aprobado: ${input.importeTotal} €
- Plazo: ${input.plazoMeses} meses desde ${input.fechaInicio}

CUOTAS POR PROPIETARIO (ya calculadas, inclúyelas exactamente así):
${listaCuotas}

La carta debe incluir: motivo y acuerdo de junta que aprueba la derrama (art. 9.1.e LPH), tabla de cuotas en formato listado simple, IBAN bancario para el pago (dejar como "IBAN: ES__ ____"), consecuencias del impago (art. 21 LPH), cierre con firmas.
${FORMATO}

Responde ÚNICAMENTE con este XML:

<documento>
  <titulo>COMUNICACIÓN DE DERRAMA EXTRAORDINARIA</titulo>
  <cuerpo>
[TEXTO COMPLETO AQUÍ]
  </cuerpo>
</documento>`;
}
