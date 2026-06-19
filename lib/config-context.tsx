"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Professional } from "@/types";

const CLAU_CONFIG = "puntsalut.config";

export interface ItemHabitual {
  id: string;
  centreId: string;
  nom: string;
}

interface Config {
  professionals: Professional[];
  diagnostics: ItemHabitual[];
  frequencies: ItemHabitual[];
}

const DIAGNOSTICS_INICIALS: ItemHabitual[] = [
  { id: "d1", centreId: "punt-salut-montseny", nom: "Dolor lumbar crònic" },
  { id: "d2", centreId: "punt-salut-montseny", nom: "Postoperatori de genoll" },
  { id: "d3", centreId: "punt-salut-montseny", nom: "Ictus · rehabilitació" },
  { id: "d4", centreId: "punt-salut-montseny", nom: "Cervicàlgia" },
  { id: "d5", centreId: "punt-salut-montseny", nom: "Esquinç de turmell" },
  { id: "d6", centreId: "clinica-exemple", nom: "Tendinitis de l'espatlla" },
];

const FREQUENCIES_INICIALS: ItemHabitual[] = [
  { id: "f1", centreId: "punt-salut-montseny", nom: "Setmanal" },
  { id: "f2", centreId: "punt-salut-montseny", nom: "2 cops per setmana" },
  { id: "f3", centreId: "punt-salut-montseny", nom: "3 cops per setmana" },
  { id: "f4", centreId: "punt-salut-montseny", nom: "Quinzenal" },
  { id: "f5", centreId: "punt-salut-montseny", nom: "Mensual" },
  { id: "f6", centreId: "punt-salut-montseny", nom: "Segons evolució" },
  { id: "f7", centreId: "clinica-exemple", nom: "Setmanal" },
  { id: "f8", centreId: "clinica-exemple", nom: "Segons evolució" },
];

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
  diagnostics: DIAGNOSTICS_INICIALS,
  frequencies: FREQUENCIES_INICIALS,
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
    const config: Partial<Config> = desada ? JSON.parse(desada) : CONFIG_INICIAL;
    configClient = {
      professionals: (config.professionals ?? CONFIG_INICIAL.professionals).map(
        migrarCentreIdProfessional
      ),
      diagnostics: config.diagnostics ?? DIAGNOSTICS_INICIALS,
      frequencies: config.frequencies ?? FREQUENCIES_INICIALS,
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
  diagnostics: ItemHabitual[];
  afegirDiagnostic: (centreId: string, nom: string) => void;
  actualitzarDiagnostic: (id: string, nom: string) => void;
  eliminarDiagnostic: (id: string) => void;
  frequencies: ItemHabitual[];
  afegirFrequencia: (centreId: string, nom: string) => void;
  actualitzarFrequencia: (id: string, nom: string) => void;
  eliminarFrequencia: (id: string) => void;
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

  function afegirDiagnostic(centreId: string, nom: string) {
    actualitzarConfig({
      ...config,
      diagnostics: [...config.diagnostics, { id: crypto.randomUUID(), centreId, nom }],
    });
  }

  function actualitzarDiagnostic(id: string, nom: string) {
    actualitzarConfig({
      ...config,
      diagnostics: config.diagnostics.map((item) =>
        item.id === id ? { ...item, nom } : item
      ),
    });
  }

  function eliminarDiagnostic(id: string) {
    actualitzarConfig({
      ...config,
      diagnostics: config.diagnostics.filter((item) => item.id !== id),
    });
  }

  function afegirFrequencia(centreId: string, nom: string) {
    actualitzarConfig({
      ...config,
      frequencies: [...config.frequencies, { id: crypto.randomUUID(), centreId, nom }],
    });
  }

  function actualitzarFrequencia(id: string, nom: string) {
    actualitzarConfig({
      ...config,
      frequencies: config.frequencies.map((item) =>
        item.id === id ? { ...item, nom } : item
      ),
    });
  }

  function eliminarFrequencia(id: string) {
    actualitzarConfig({
      ...config,
      frequencies: config.frequencies.filter((item) => item.id !== id),
    });
  }

  return (
    <ConfigContext.Provider
      value={{
        professionals: config.professionals,
        afegirProfessional,
        actualitzarProfessional,
        eliminarProfessional,
        diagnostics: config.diagnostics,
        afegirDiagnostic,
        actualitzarDiagnostic,
        eliminarDiagnostic,
        frequencies: config.frequencies,
        afegirFrequencia,
        actualitzarFrequencia,
        eliminarFrequencia,
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
