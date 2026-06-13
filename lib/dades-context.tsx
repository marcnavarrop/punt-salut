"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Pacient, Sessio } from "@/types";
import { PACIENTS_INICIALS, SESSIONS_INICIALS } from "@/lib/dades-inicials";

interface DadesContextValor {
  pacients: Pacient[];
  sessions: Sessio[];
  afegirPacient: (dades: Omit<Pacient, "id">) => Pacient;
  afegirSessio: (dades: Omit<Sessio, "id">) => Sessio;
  obtenirPacient: (id: string) => Pacient | undefined;
  obtenirSessionsPacient: (pacientId: string) => Sessio[];
}

const DadesContext = createContext<DadesContextValor | null>(null);

export function DadesProvider({ children }: { children: ReactNode }) {
  const [pacients, setPacients] = useState<Pacient[]>(PACIENTS_INICIALS);
  const [sessions, setSessions] = useState<Sessio[]>(SESSIONS_INICIALS);

  function afegirPacient(dades: Omit<Pacient, "id">): Pacient {
    const nou: Pacient = { ...dades, id: crypto.randomUUID() };
    setPacients((prev) => [...prev, nou]);
    return nou;
  }

  function afegirSessio(dades: Omit<Sessio, "id">): Sessio {
    const nova: Sessio = { ...dades, id: crypto.randomUUID() };
    setSessions((prev) => [...prev, nova]);
    return nova;
  }

  function obtenirPacient(id: string) {
    return pacients.find((pacient) => pacient.id === id);
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
        afegirSessio,
        obtenirPacient,
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
