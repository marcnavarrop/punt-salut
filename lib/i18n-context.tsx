"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { IDIOMES, TRADUCCIONS, type Idioma } from "@/lib/i18n";

const CLAU_IDIOMA = "puntsalut.idioma";
const IDIOMA_PER_DEFECTE: Idioma = "ca";

let idiomaClient: Idioma | null = null;
const subscriptors = new Set<() => void>();

function esIdioma(valor: string | null): valor is Idioma {
  return valor !== null && (IDIOMES as string[]).includes(valor);
}

function carregarIdiomaClient(): Idioma {
  if (idiomaClient) return idiomaClient;
  try {
    const desat = localStorage.getItem(CLAU_IDIOMA);
    idiomaClient = esIdioma(desat) ? desat : IDIOMA_PER_DEFECTE;
  } catch {
    idiomaClient = IDIOMA_PER_DEFECTE;
  }
  return idiomaClient;
}

function actualitzarIdioma(idioma: Idioma) {
  idiomaClient = idioma;
  try {
    localStorage.setItem(CLAU_IDIOMA, idioma);
  } catch {
    // localStorage no disponible
  }
  subscriptors.forEach((callback) => callback());
}

function subscriure(callback: () => void) {
  subscriptors.add(callback);
  return () => subscriptors.delete(callback);
}

function obtenirSnapshot(): Idioma {
  return carregarIdiomaClient();
}

function obtenirSnapshotServidor(): Idioma {
  return IDIOMA_PER_DEFECTE;
}

interface IdiomaContextValor {
  idioma: Idioma;
  canviarIdioma: (idioma: Idioma) => void;
  t: (clau: string, parametres?: Record<string, string>) => string;
}

const IdiomaContext = createContext<IdiomaContextValor | null>(null);

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const idioma = useSyncExternalStore(
    subscriure,
    obtenirSnapshot,
    obtenirSnapshotServidor
  );

  function t(clau: string, parametres?: Record<string, string>): string {
    const valor = clau
      .split(".")
      .reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object" && part in acc) {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, TRADUCCIONS);

    if (!valor || typeof valor !== "object" || !(idioma in valor)) {
      return clau;
    }

    let text = (valor as Record<Idioma, string>)[idioma];
    if (parametres) {
      for (const [nom, val] of Object.entries(parametres)) {
        text = text.replace(`{${nom}}`, val);
      }
    }
    return text;
  }

  return (
    <IdiomaContext.Provider value={{ idioma, canviarIdioma: actualitzarIdioma, t }}>
      {children}
    </IdiomaContext.Provider>
  );
}

export function useIdioma(): IdiomaContextValor {
  const context = useContext(IdiomaContext);
  if (!context) {
    throw new Error("useIdioma s'ha d'utilitzar dins de <IdiomaProvider>");
  }
  return context;
}
