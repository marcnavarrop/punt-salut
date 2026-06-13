import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { AuthGuard } from "@/lib/auth-guard";
import { DadesProvider } from "@/lib/dades-context";
import { ConfigProvider } from "@/lib/config-context";
import { IdiomaProvider } from "@/lib/i18n-context";
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
        <IdiomaProvider>
          <AuthProvider>
            <AuthGuard>
              <DadesProvider>
                <ConfigProvider>{children}</ConfigProvider>
              </DadesProvider>
            </AuthGuard>
          </AuthProvider>
        </IdiomaProvider>
      </body>
    </html>
  );
}
