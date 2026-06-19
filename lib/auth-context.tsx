"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Professional } from "@/types";

const CLAU_SESSIO = "puntsalut.sessio";

interface CredencialUsuari {
  usuari: string;
  contrasenya: string;
  professional: Professional;
}

const USUARIS: CredencialUsuari[] = [
  {
    usuari: "marc",
    contrasenya: "1234",
    professional: {
      id: "marc",
      centreId: "punt-salut-montseny",
      nom: "Marc",
      cognoms: "Soler",
      especialitat: "Fisioterapeuta",
      email: "marc@puntsalutmontseny.cat",
    },
  },
  {
    usuari: "adria",
    contrasenya: "1234",
    professional: {
      id: "adria",
      centreId: "punt-salut-montseny",
      nom: "Adrià",
      cognoms: "Puig",
      especialitat: "Fisioterapeuta",
      email: "adria@puntsalutmontseny.cat",
    },
  },
  {
    usuari: "laura",
    contrasenya: "1234",
    professional: {
      id: "laura",
      centreId: "clinica-exemple",
      nom: "Laura",
      cognoms: "Ferrer",
      especialitat: "Fisioterapeuta",
      email: "laura@clinicaexemple.cat",
    },
  },
];

let sessioClient: Professional | null | undefined = undefined;
const subscriptors = new Set<() => void>();

function carregarSessioClient(): Professional | null {
  if (sessioClient !== undefined) return sessioClient;
  try {
    const desada = localStorage.getItem(CLAU_SESSIO);
    sessioClient = desada ? (JSON.parse(desada) as Professional) : null;
  } catch {
    sessioClient = null;
  }
  return sessioClient;
}

function actualitzarSessio(professional: Professional | null) {
  sessioClient = professional;
  try {
    if (professional) {
      localStorage.setItem(CLAU_SESSIO, JSON.stringify(professional));
    } else {
      localStorage.removeItem(CLAU_SESSIO);
    }
  } catch {
    // localStorage no disponible
  }
  subscriptors.forEach((callback) => callback());
}

function subscriure(callback: () => void) {
  subscriptors.add(callback);
  return () => subscriptors.delete(callback);
}

function obtenirSnapshot(): Professional | null {
  return carregarSessioClient();
}

function obtenirSnapshotServidor(): Professional | null | undefined {
  return undefined;
}

interface AuthContextValor {
  sessio: Professional | null;
  carregat: boolean;
  iniciarSessio: (usuari: string, contrasenya: string) => boolean;
  tancarSessio: () => void;
}

const AuthContext = createContext<AuthContextValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const sessio = useSyncExternalStore(
    subscriure,
    obtenirSnapshot,
    obtenirSnapshotServidor
  );

  function iniciarSessio(usuari: string, contrasenya: string): boolean {
    const credencial = USUARIS.find(
      (u) =>
        u.usuari.toLowerCase() === usuari.trim().toLowerCase() &&
        u.contrasenya === contrasenya
    );
    if (!credencial) return false;
    actualitzarSessio(credencial.professional);
    return true;
  }

  function tancarSessio() {
    actualitzarSessio(null);
  }

  return (
    <AuthContext.Provider
      value={{
        sessio: sessio ?? null,
        carregat: sessio !== undefined,
        iniciarSessio,
        tancarSessio,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValor {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth s'ha d'utilitzar dins de <AuthProvider>");
  }
  return context;
}

/**
 * Comprova al client si hi ha una sessió activa a localStorage.
 * Si no n'hi ha, redirigeix a /login. Cal cridar-lo des de pàgines
 * protegides ("use client").
 */
export function useRequereSessio(): AuthContextValor {
  const auth = useAuth();
  const router = useRouter();
  const { sessio, carregat } = auth;

  useEffect(() => {
    if (carregat && !sessio) {
      router.replace("/login");
    }
  }, [carregat, sessio, router]);

  return auth;
}
