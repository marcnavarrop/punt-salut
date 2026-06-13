"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const RUTA_LOGIN = "/login";

export function CarregantSessio() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
    </div>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { sessio, carregat } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const esRutaLogin = pathname === RUTA_LOGIN;

  useEffect(() => {
    if (!carregat) return;
    if (!sessio && !esRutaLogin) {
      router.replace(RUTA_LOGIN);
    } else if (sessio && esRutaLogin) {
      router.replace("/pacients");
    }
  }, [carregat, sessio, esRutaLogin, router]);

  if (!carregat || (!sessio && !esRutaLogin) || (sessio && esRutaLogin)) {
    return <CarregantSessio />;
  }

  return <>{children}</>;
}
