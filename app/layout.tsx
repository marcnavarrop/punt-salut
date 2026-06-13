import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DadesProvider } from "@/lib/dades-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Punt Salut Montseny",
  description: "Assistent clínic per a fisioteràpia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-100 font-sans text-slate-900">
        <DadesProvider>{children}</DadesProvider>
      </body>
    </html>
  );
}
