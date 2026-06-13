import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
} from "docx";

export async function generarDocxActa(
  titulo: string,
  comunidad: string,
  fecha: string,
  cuerpo: string
): Promise<Buffer> {
  const lineas = cuerpo.split(/\n\n+/);

  const parrafos = lineas.map((linea) => {
    const texto = linea.trim();
    if (!texto) return new Paragraph({});

    const esTitulo =
      texto.toUpperCase() === texto && texto.length < 80 && texto.length > 5;

    if (esTitulo) {
      return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { before: 300, after: 100 },
        children: [new TextRun({ text: texto, bold: true, size: 24 })],
      });
    }

    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 120, after: 120 },
      children: [new TextRun({ text: texto, size: 22 })],
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "COMUNIDAD DE PROPIETARIOS",
                bold: true,
                size: 28,
                allCaps: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({ text: comunidad, bold: true, size: 26 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "2D6A4F" },
            },
            children: [new TextRun({ text: fecha, size: 22, color: "555555" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: titulo,
                bold: true,
                size: 30,
                allCaps: true,
              }),
            ],
          }),
          ...parrafos,
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}
