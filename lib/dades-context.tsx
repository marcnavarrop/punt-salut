"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Pacient, Sessio } from "@/types";
import { PACIENTS_INICIALS, SESSIONS_INICIALS } from "@/lib/dades-inicials";

const CLAU_PACIENTS = "puntsalut.pacients";
const CLAU_SESSIONS = "puntsalut.sessions";

interface Estat {
  pacients: Pacient[];
  sessions: Sessio[];
}

const estatServidor: Estat = {
  pacients: PACIENTS_INICIALS,
  sessions: SESSIONS_INICIALS,
};

let estatClient: Estat | null = null;
const subscriptors = new Set<() => void>();

function desar(estat: Estat) {
  try {
    localStorage.setItem(CLAU_PACIENTS, JSON.stringify(estat.pacients));
    localStorage.setItem(CLAU_SESSIONS, JSON.stringify(estat.sessions));
  } catch {
    // localStorage no disponible
  }
}

function carregarEstatClient(): Estat {
  if (estatClient) return estatClient;
  try {
    const pacientsDesats = localStorage.getItem(CLAU_PACIENTS);
    const sessionsDesades = localStorage.getItem(CLAU_SESSIONS);
    estatClient = {
      pacients: pacientsDesats
        ? JSON.parse(pacientsDesats)
        : PACIENTS_INICIALS,
      sessions: sessionsDesades
        ? JSON.parse(sessionsDesades)
        : SESSIONS_INICIALS,
    };
  } catch {
    estatClient = { pacients: PACIENTS_INICIALS, sessions: SESSIONS_INICIALS };
  }
  if (
    !localStorage.getItem(CLAU_PACIENTS) ||
    !localStorage.getItem(CLAU_SESSIONS)
  ) {
    desar(estatClient);
  }
  return estatClient;
}

function actualitzarEstat(nouEstat: Estat) {
  estatClient = nouEstat;
  desar(nouEstat);
  subscriptors.forEach((callback) => callback());
}

function subscriure(callback: () => void) {
  subscriptors.add(callback);
  return () => subscriptors.delete(callback);
}

function obtenirSnapshot(): Estat {
  return carregarEstatClient();
}

function obtenirSnapshotServidor(): Estat {
  return estatServidor;
}

interface DadesContextValor {
  pacients: Pacient[];
  sessions: Sessio[];
  afegirPacient: (dades: Omit<Pacient, "id">) => Pacient;
  afegirSessio: (dades: Omit<Sessio, "id">) => Sessio;
  obtenirPacient: (id: string) => Pacient | undefined;
  obtenirSessio: (id: string) => Sessio | undefined;
  obtenirSessionsPacient: (pacientId: string) => Sessio[];
}

const DadesContext = createContext<DadesContextValor | null>(null);

export function DadesProvider({ children }: { children: ReactNode }) {
  const estat = useSyncExternalStore(
    subscriure,
    obtenirSnapshot,
    obtenirSnapshotServidor
  );

  function afegirPacient(dades: Omit<Pacient, "id">): Pacient {
    const nou: Pacient = { ...dades, id: crypto.randomUUID() };
    actualitzarEstat({ ...estat, pacients: [...estat.pacients, nou] });
    return nou;
  }

  function afegirSessio(dades: Omit<Sessio, "id">): Sessio {
    const nova: Sessio = { ...dades, id: crypto.randomUUID() };
    actualitzarEstat({ ...estat, sessions: [...estat.sessions, nova] });
    return nova;
  }

  function obtenirPacient(id: string) {
    return estat.pacients.find((pacient) => pacient.id === id);
  }

  function obtenirSessio(id: string) {
    return estat.sessions.find((sessio) => sessio.id === id);
  }

  function obtenirSessionsPacient(pacientId: string) {
    return estat.sessions
      .filter((sessio) => sessio.pacientId === pacientId)
      .sort((a, b) => b.numero - a.numero);
  }

  return (
    <DadesContext.Provider
      value={{
        pacients: estat.pacients,
        sessions: estat.sessions,
        afegirPacient,
        afegirSessio,
        obtenirPacient,
        obtenirSessio,
        obtenirSessionsPacient,
      }}
    >
      {children}
    </DadesContext.Provider>
  );
}

export function useDades(): DadesContextValor {
  const context = useContext(DadesContext);
  if (!context) {
    throw new Error("useDades s'ha d'utilitzar dins de <DadesProvider>");
  }
  return context;
}
