import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "FincaIA — Gestión de Comunidades con IA",
  description: "Administra tu comunidad de propietarios con inteligencia artificial. Genera actas, convocatorias, cartas y consulta la LPH al instante.",
  openGraph: {
    title: "FincaIA — Gestión de Comunidades con IA",
    description: "Genera actas, convocatorias y documentos legales para tu comunidad en segundos.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
