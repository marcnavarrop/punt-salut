"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Professional } from "@/types";

const CLAU_CONFIG = "puntsalut.config";

interface Config {
  professionals: Professional[];
}

const CONFIG_INICIAL: Config = {
  professionals: [
    {
      id: "marc",
      centreId: "punt-salut-montseny",
      nom: "Marc",
      cognoms: "Soler",
      especialitat: "Fisioterapeuta",
      email: "marc@puntsalutmontseny.cat",
    },
    {
      id: "adria",
      centreId: "punt-salut-montseny",
      nom: "Adrià",
      cognoms: "Puig",
      especialitat: "Fisioterapeuta",
      email: "adria@puntsalutmontseny.cat",
    },
    {
      id: "laura",
      centreId: "clinica-exemple",
      nom: "Laura",
      cognoms: "Ferrer",
      especialitat: "Fisioterapeuta",
      email: "laura@clinicaexemple.cat",
    },
  ],
};

const configServidor: Config = CONFIG_INICIAL;

let configClient: Config | null = null;
const subscriptors = new Set<() => void>();

function desar(config: Config) {
  try {
    localStorage.setItem(CLAU_CONFIG, JSON.stringify(config));
  } catch {
    // localStorage no disponible
  }
}

function migrarCentreIdProfessional(professional: Professional): Professional {
  if (professional.centreId) return professional;
  const referencia = CONFIG_INICIAL.professionals.find(
    (p) => p.id === professional.id
  );
  return {
    ...professional,
    centreId: referencia?.centreId ?? "punt-salut-montseny",
  };
}

function carregarConfigClient(): Config {
  if (configClient) return configClient;
  try {
    const desada = localStorage.getItem(CLAU_CONFIG);
    const config: Config = desada ? JSON.parse(desada) : CONFIG_INICIAL;
    configClient = {
      ...config,
      professionals: config.professionals.map(migrarCentreIdProfessional),
    };
  } catch {
    configClient = CONFIG_INICIAL;
  }
  desar(configClient!);
  return configClient!;
}

function actualitzarConfig(novaConfig: Config) {
  configClient = novaConfig;
  desar(novaConfig);
  subscriptors.forEach((callback) => callback());
}

function subscriure(callback: () => void) {
  subscriptors.add(callback);
  return () => subscriptors.delete(callback);
}

function obtenirSnapshot(): Config {
  return carregarConfigClient();
}

function obtenirSnapshotServidor(): Config {
  return configServidor;
}

/**
 * Lectura directa (no reactiva) dels professionals actuals, per a ús fora
 * de components React (p. ex. comprovar credencials en iniciar sessió).
 */
export function obtenirProfessionals(): Professional[] {
  return carregarConfigClient().professionals;
}

interface ConfigContextValor {
  professionals: Professional[];
  afegirProfessional: (dades: Omit<Professional, "id">) => Professional;
  actualitzarProfessional: (id: string, dades: Omit<Professional, "id">) => void;
  eliminarProfessional: (id: string) => void;
}

const ConfigContext = createContext<ConfigContextValor | null>(null);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const config = useSyncExternalStore(
    subscriure,
    obtenirSnapshot,
    obtenirSnapshotServidor
  );

  function afegirProfessional(dades: Omit<Professional, "id">): Professional {
    const nou: Professional = { ...dades, id: crypto.randomUUID() };
    actualitzarConfig({
      ...config,
      professionals: [...config.professionals, nou],
    });
    return nou;
  }

  function actualitzarProfessional(id: string, dades: Omit<Professional, "id">) {
    actualitzarConfig({
      ...config,
      professionals: config.professionals.map((professional) =>
        professional.id === id ? { ...dades, id } : professional
      ),
    });
  }

  function eliminarProfessional(id: string) {
    actualitzarConfig({
      ...config,
      professionals: config.professionals.filter(
        (professional) => professional.id !== id
      ),
    });
  }

  return (
    <ConfigContext.Provider
      value={{
        professionals: config.professionals,
        afegirProfessional,
        actualitzarProfessional,
        eliminarProfessional,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig(): ConfigContextValor {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig s'ha d'utilitzar dins de <ConfigProvider>");
  }
  return context;
}
