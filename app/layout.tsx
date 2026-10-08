import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatterbot",
  description: "Chatbot con Next.js y la API de Google Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
