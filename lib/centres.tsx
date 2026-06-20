"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Idioma } from "@/lib/i18n";
import type { FormatData } from "@/lib/data-utils";

const CLAU_CENTRES = "voltamed.centres";

export interface Centre {
  id: string;
  nom: string;
  logo: string;
  logoUrl?: string;
  colorPrincipal: string;
  horari?: string;
  idiomaPerDefecte?: Idioma;
  formatData?: FormatData;
}

export const CENTRES_INICIALS: Centre[] = [
  {
    id: "punt-salut-montseny",
    nom: "Punt Salut Montseny",
    logo: "PSM",
    logoUrl: "/logos/punt-salut-montseny.png",
    colorPrincipal: "#16a34a",
  },
  {
    id: "clinica-exemple",
    nom: "Clínica Exemple",
    logo: "CE",
    colorPrincipal: "#2563eb",
  },
];

const centresServidor: Centre[] = CENTRES_INICIALS;

let centresClient: Centre[] | null = null;
const subscriptors = new Set<() => void>();

function desar(centres: Centre[]) {
  try {
    localStorage.setItem(CLAU_CENTRES, JSON.stringify(centres));
  } catch {
    // localStorage no disponible
  }
}

function migrarCentre(centre: Centre): Centre {
  if (centre.logoUrl) return centre;
  const referencia = CENTRES_INICIALS.find((c) => c.id === centre.id);
  return referencia?.logoUrl ? { ...centre, logoUrl: referencia.logoUrl } : centre;
}

function carregarCentresClient(): Centre[] {
  if (centresClient) return centresClient;
  try {
    const desats = localStorage.getItem(CLAU_CENTRES);
    const centres: Centre[] = desats ? JSON.parse(desats) : CENTRES_INICIALS;
    centresClient = centres.map(migrarCentre);
  } catch {
    centresClient = CENTRES_INICIALS;
  }
  desar(centresClient!);
  return centresClient!;
}

function actualitzarCentres(nousCentres: Centre[]) {
  centresClient = nousCentres;
  desar(nousCentres);
  subscriptors.forEach((callback) => callback());
}

function subscriure(callback: () => void) {
  subscriptors.add(callback);
  return () => subscriptors.delete(callback);
}

function obtenirSnapshot(): Centre[] {
  return carregarCentresClient();
}

function obtenirSnapshotServidor(): Centre[] {
  return centresServidor;
}

interface CentresContextValor {
  centres: Centre[];
  obtenirCentre: (id: string) => Centre | undefined;
  actualitzarNomCentre: (id: string, nom: string) => void;
  afegirCentre: (dades: Centre) => void;
  actualitzarCentre: (id: string, dades: Omit<Centre, "id">) => void;
  eliminarCentre: (id: string) => void;
}

const CentresContext = createContext<CentresContextValor | null>(null);

export function CentresProvider({ children }: { children: ReactNode }) {
  const centres = useSyncExternalStore(
    subscriure,
    obtenirSnapshot,
    obtenirSnapshotServidor
  );

  function obtenirCentre(id: string): Centre | undefined {
    return centres.find((centre) => centre.id === id);
  }

  function actualitzarNomCentre(id: string, nom: string) {
    actualitzarCentres(
      centres.map((centre) => (centre.id === id ? { ...centre, nom } : centre))
    );
  }

  function afegirCentre(dades: Centre) {
    actualitzarCentres([...centres, dades]);
  }

  function actualitzarCentre(id: string, dades: Omit<Centre, "id">) {
    actualitzarCentres(
      centres.map((centre) => (centre.id === id ? { ...dades, id } : centre))
    );
  }

  function eliminarCentre(id: string) {
    actualitzarCentres(centres.filter((centre) => centre.id !== id));
  }

  return (
    <CentresContext.Provider
      value={{
        centres,
        obtenirCentre,
        actualitzarNomCentre,
        afegirCentre,
        actualitzarCentre,
        eliminarCentre,
      }}
    >
      {children}
    </CentresContext.Provider>
  );
}

export function useCentres(): CentresContextValor {
  const context = useContext(CentresContext);
  if (!context) {
    throw new Error("useCentres s'ha d'utilitzar dins de <CentresProvider>");
  }
  return context;
}
