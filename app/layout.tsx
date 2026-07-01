import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroIA – Riego inteligente para agricultores",
  description: "Asesor de riego y fertilización con inteligencia artificial para pequeños agricultores",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
