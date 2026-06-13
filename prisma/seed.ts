import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROPIETARIOS_DEMO = [
  { piso: "1º A", nombre: "María García López",    coeficiente: 18.5, email: "maria@example.com" },
  { piso: "1º B", nombre: "Juan Martínez Ruiz",    coeficiente: 16.2, email: "juan@example.com" },
  { piso: "2º A", nombre: "Carmen Sánchez Pérez",  coeficiente: 17.8 },
  { piso: "2º B", nombre: "Antonio Fernández Gil", coeficiente: 15.9 },
  { piso: "3º A", nombre: "Lucía Torres Moreno",   coeficiente: 16.4 },
  { piso: "3º B", nombre: "Roberto Díaz Castro",   coeficiente: 15.2 },
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@fincaia.es" },
    update: {},
    create: { email: "demo@fincaia.es", name: "Administrador Demo", plan: "pro" },
  });

  const comunidad = await prisma.comunidad.upsert({
    where: { id: "comunidad-demo-1" },
    update: { nombre: "Residencial Los Olivos", direccion: "Calle Mayor, 12 - 28001 Madrid" },
    create: {
      id: "comunidad-demo-1",
      nombre: "Residencial Los Olivos",
      direccion: "Calle Mayor, 12 - 28001 Madrid",
      numViviendas: 6,
      userId: user.id,
    },
  });

  // Upsert each propietario by (comunidadId + piso) to avoid duplicates on re-run
  for (const p of PROPIETARIOS_DEMO) {
    await prisma.propietario.upsert({
      where: { comunidadId_piso: { comunidadId: comunidad.id, piso: p.piso } },
      update: { nombre: p.nombre, coeficiente: p.coeficiente },
      create: { ...p, comunidadId: comunidad.id },
    });
  }

  console.log(`✅ Seed completado:`);
  console.log(`   Usuario: ${user.email}`);
  console.log(`   Comunidad: ${comunidad.nombre} (id: ${comunidad.id})`);
  console.log(`   Propietarios: ${PROPIETARIOS_DEMO.length}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
