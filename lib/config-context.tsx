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
  nomCentre: string;
  professionals: Professional[];
}

const CONFIG_INICIAL: Config = {
  nomCentre: "Punt Salut Montseny",
  professionals: [
    {
      id: "marc",
      nom: "Marc",
      cognoms: "Soler",
      especialitat: "Fisioterapeuta",
      email: "marc@puntsalutmontseny.cat",
    },
    {
      id: "adria",
      nom: "Adrià",
      cognoms: "Puig",
      especialitat: "Fisioterapeuta",
      email: "adria@puntsalutmontseny.cat",
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

function carregarConfigClient(): Config {
  if (configClient) return configClient;
  try {
    const desada = localStorage.getItem(CLAU_CONFIG);
    configClient = desada ? JSON.parse(desada) : CONFIG_INICIAL;
  } catch {
    configClient = CONFIG_INICIAL;
  }
  if (!localStorage.getItem(CLAU_CONFIG)) {
    desar(configClient!);
  }
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

interface ConfigContextValor {
  nomCentre: string;
  professionals: Professional[];
  actualitzarNomCentre: (nom: string) => void;
  afegirProfessional: (dades: Omit<Professional, "id">) => void;
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

  function actualitzarNomCentre(nom: string) {
    actualitzarConfig({ ...config, nomCentre: nom });
  }

  function afegirProfessional(dades: Omit<Professional, "id">) {
    const nou: Professional = { ...dades, id: crypto.randomUUID() };
    actualitzarConfig({
      ...config,
      professionals: [...config.professionals, nou],
    });
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
        nomCentre: config.nomCentre,
        professionals: config.professionals,
        actualitzarNomCentre,
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
