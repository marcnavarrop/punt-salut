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
import { obtenirProfessionals } from "@/lib/config-context";

const CLAU_SESSIO = "puntsalut.sessio";
const CLAU_CREDENCIALS = "puntsalut.credencials";

export interface Credencial {
  professionalId: string;
  usuari: string;
  contrasenya: string;
}

const CREDENCIALS_INICIALS: Credencial[] = [
  { professionalId: "marc", usuari: "marc", contrasenya: "1234" },
  { professionalId: "adria", usuari: "adria", contrasenya: "1234" },
  { professionalId: "laura", usuari: "laura", contrasenya: "1234" },
];

const credencialsServidor: Credencial[] = CREDENCIALS_INICIALS;

let credencialsClient: Credencial[] | null = null;
const subscriptorsCredencials = new Set<() => void>();

function desarCredencials(credencials: Credencial[]) {
  try {
    localStorage.setItem(CLAU_CREDENCIALS, JSON.stringify(credencials));
  } catch {
    // localStorage no disponible
  }
}

function carregarCredencialsClient(): Credencial[] {
  if (credencialsClient) return credencialsClient;
  try {
    const desades = localStorage.getItem(CLAU_CREDENCIALS);
    credencialsClient = desades ? JSON.parse(desades) : CREDENCIALS_INICIALS;
  } catch {
    credencialsClient = CREDENCIALS_INICIALS;
  }
  if (!localStorage.getItem(CLAU_CREDENCIALS)) {
    desarCredencials(credencialsClient!);
  }
  return credencialsClient!;
}

function actualitzarCredencials(noves: Credencial[]) {
  credencialsClient = noves;
  desarCredencials(noves);
  subscriptorsCredencials.forEach((callback) => callback());
}

function subscriureCredencials(callback: () => void) {
  subscriptorsCredencials.add(callback);
  return () => subscriptorsCredencials.delete(callback);
}

function obtenirSnapshotCredencials(): Credencial[] {
  return carregarCredencialsClient();
}

function obtenirSnapshotServidorCredencials(): Credencial[] {
  return credencialsServidor;
}

interface CredencialsContextValor {
  credencials: Credencial[];
  afegirCredencial: (
    professionalId: string,
    usuari: string,
    contrasenya: string
  ) => void;
  actualitzarCredencial: (
    professionalId: string,
    dades: { usuari?: string; contrasenya?: string }
  ) => void;
  eliminarCredencial: (professionalId: string) => void;
}

export function useCredencials(): CredencialsContextValor {
  const credencials = useSyncExternalStore(
    subscriureCredencials,
    obtenirSnapshotCredencials,
    obtenirSnapshotServidorCredencials
  );

  function afegirCredencial(
    professionalId: string,
    usuari: string,
    contrasenya: string
  ) {
    actualitzarCredencials([
      ...credencials,
      { professionalId, usuari, contrasenya },
    ]);
  }

  function actualitzarCredencial(
    professionalId: string,
    dades: { usuari?: string; contrasenya?: string }
  ) {
    actualitzarCredencials(
      credencials.map((credencial) =>
        credencial.professionalId === professionalId
          ? { ...credencial, ...dades }
          : credencial
      )
    );
  }

  function eliminarCredencial(professionalId: string) {
    actualitzarCredencials(
      credencials.filter(
        (credencial) => credencial.professionalId !== professionalId
      )
    );
  }

  return {
    credencials,
    afegirCredencial,
    actualitzarCredencial,
    eliminarCredencial,
  };
}

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
  actualitzarPerfilSessio: (dades: Partial<Professional>) => void;
}

const AuthContext = createContext<AuthContextValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const sessio = useSyncExternalStore(
    subscriure,
    obtenirSnapshot,
    obtenirSnapshotServidor
  );

  function iniciarSessio(usuari: string, contrasenya: string): boolean {
    const credencial = carregarCredencialsClient().find(
      (c) =>
        c.usuari.toLowerCase() === usuari.trim().toLowerCase() &&
        c.contrasenya === contrasenya
    );
    if (!credencial) return false;
    const professional = obtenirProfessionals().find(
      (p) => p.id === credencial.professionalId
    );
    if (!professional) return false;
    actualitzarSessio(professional);
    return true;
  }

  function tancarSessio() {
    actualitzarSessio(null);
  }

  function actualitzarPerfilSessio(dades: Partial<Professional>) {
    if (!sessio) return;
    actualitzarSessio({ ...sessio, ...dades });
  }

  return (
    <AuthContext.Provider
      value={{
        sessio: sessio ?? null,
        carregat: sessio !== undefined,
        iniciarSessio,
        tancarSessio,
        actualitzarPerfilSessio,
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
