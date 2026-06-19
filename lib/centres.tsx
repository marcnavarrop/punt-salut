"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const CLAU_CENTRES = "voltamed.centres";

export interface Centre {
  id: string;
  nom: string;
  logo: string;
  colorPrincipal: string;
}

export const CENTRES_INICIALS: Centre[] = [
  {
    id: "punt-salut-montseny",
    nom: "Punt Salut Montseny",
    logo: "PSM",
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

function carregarCentresClient(): Centre[] {
  if (centresClient) return centresClient;
  try {
    const desats = localStorage.getItem(CLAU_CENTRES);
    centresClient = desats ? JSON.parse(desats) : CENTRES_INICIALS;
  } catch {
    centresClient = CENTRES_INICIALS;
  }
  if (!localStorage.getItem(CLAU_CENTRES)) {
    desar(centresClient!);
  }
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

  return (
    <CentresContext.Provider
      value={{ centres, obtenirCentre, actualitzarNomCentre }}
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
