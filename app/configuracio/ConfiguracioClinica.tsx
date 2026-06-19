"use client";

import { IconCalendarRepeat, IconStethoscope } from "@tabler/icons-react";
import { useConfig } from "@/lib/config-context";
import { useIdioma } from "@/lib/i18n-context";
import { ListaEditable } from "./ListaEditable";

interface ConfiguracioClinicaProps {
  centreId: string;
}

export function ConfiguracioClinica({ centreId }: ConfiguracioClinicaProps) {
  const { t } = useIdioma();
  const {
    diagnostics,
    afegirDiagnostic,
    actualitzarDiagnostic,
    eliminarDiagnostic,
    frequencies,
    afegirFrequencia,
    actualitzarFrequencia,
    eliminarFrequencia,
  } = useConfig();

  const diagnosticsCentre = diagnostics.filter((d) => d.centreId === centreId);
  const frequenciesCentre = frequencies.filter((f) => f.centreId === centreId);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <IconStethoscope className="h-4 w-4 text-brand-500" />
          <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
            {t("configuracio.diagnosticsHabituals")}
          </h2>
        </div>
        <p className="mb-3 text-[12px] text-slate-400">
          {t("configuracio.diagnosticsAjuda")}
        </p>
        <ListaEditable
          items={diagnosticsCentre}
          placeholderAfegir={t("configuracio.afegirDiagnostic")}
          capItem={t("configuracio.capDiagnostic")}
          onAfegir={(nom) => afegirDiagnostic(centreId, nom)}
          onActualitzar={actualitzarDiagnostic}
          onEliminar={eliminarDiagnostic}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <IconCalendarRepeat className="h-4 w-4 text-brand-500" />
          <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
            {t("configuracio.frequenciesHabituals")}
          </h2>
        </div>
        <p className="mb-3 text-[12px] text-slate-400">
          {t("configuracio.frequenciesAjuda")}
        </p>
        <ListaEditable
          items={frequenciesCentre}
          placeholderAfegir={t("configuracio.afegirFrequencia")}
          capItem={t("configuracio.capFrequencia")}
          onAfegir={(nom) => afegirFrequencia(centreId, nom)}
          onActualitzar={actualitzarFrequencia}
          onEliminar={eliminarFrequencia}
        />
      </div>
    </div>
  );
}
