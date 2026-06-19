"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Pacient, Sessio } from "@/types";
import { PACIENTS_INICIALS, SESSIONS_INICIALS } from "@/lib/dades-inicials";
import { useAuth } from "@/lib/auth-context";

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
  afegirPacient: (dades: Omit<Pacient, "id" | "centreId">) => Pacient;
  actualitzarPacient: (
    id: string,
    dades: Omit<Pacient, "id" | "centreId">
  ) => void;
  eliminarPacient: (id: string) => void;
  afegirSessio: (dades: Omit<Sessio, "id" | "centreId">) => Sessio;
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
  const { sessio } = useAuth();
  const centreId = sessio?.centreId;

  const pacients = estat.pacients.filter(
    (pacient) => pacient.centreId === centreId
  );
  const sessions = estat.sessions.filter(
    (sessioRegistre) => sessioRegistre.centreId === centreId
  );

  function afegirPacient(dades: Omit<Pacient, "id" | "centreId">): Pacient {
    const nou: Pacient = {
      ...dades,
      id: crypto.randomUUID(),
      centreId: centreId ?? "",
    };
    actualitzarEstat({ ...estat, pacients: [...estat.pacients, nou] });
    return nou;
  }

  function actualitzarPacient(
    id: string,
    dades: Omit<Pacient, "id" | "centreId">
  ) {
    actualitzarEstat({
      ...estat,
      pacients: estat.pacients.map((pacient) =>
        pacient.id === id
          ? { ...dades, id, centreId: pacient.centreId }
          : pacient
      ),
    });
  }

  function eliminarPacient(id: string) {
    actualitzarEstat({
      ...estat,
      pacients: estat.pacients.filter((pacient) => pacient.id !== id),
      sessions: estat.sessions.filter((sessio) => sessio.pacientId !== id),
    });
  }

  function afegirSessio(dades: Omit<Sessio, "id" | "centreId">): Sessio {
    const pacient = estat.pacients.find((p) => p.id === dades.pacientId);
    const nova: Sessio = {
      ...dades,
      id: crypto.randomUUID(),
      centreId: pacient?.centreId ?? centreId ?? "",
    };
    actualitzarEstat({ ...estat, sessions: [...estat.sessions, nova] });
    return nova;
  }

  function obtenirPacient(id: string) {
    return pacients.find((pacient) => pacient.id === id);
  }

  function obtenirSessio(id: string) {
    return sessions.find((sessio) => sessio.id === id);
  }

  function obtenirSessionsPacient(pacientId: string) {
    return sessions
      .filter((sessio) => sessio.pacientId === pacientId)
      .sort((a, b) => b.numero - a.numero);
  }

  return (
    <DadesContext.Provider
      value={{
        pacients,
        sessions,
        afegirPacient,
        actualitzarPacient,
        eliminarPacient,
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
