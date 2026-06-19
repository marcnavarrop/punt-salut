"use client";

import { useState } from "react";
import {
  IconMail,
  IconPencil,
  IconPlus,
  IconStethoscope,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { useRequereSessio } from "@/lib/auth-context";
import { CarregantSessio } from "@/lib/auth-guard";
import { useConfig } from "@/lib/config-context";
import { useCentres } from "@/lib/centres";
import { useIdioma } from "@/lib/i18n-context";
import { Sidebar } from "@/components/Sidebar";
import { ModalConfirmacio } from "@/components/ModalConfirmacio";
import type { Professional } from "@/types";
import { FormulariProfessional } from "./FormulariProfessional";
import { DadesCentre } from "./DadesCentre";

export default function ConfiguracioPage() {
  const { t } = useIdioma();
  const { sessio, carregat } = useRequereSessio();
  const {
    professionals,
    afegirProfessional,
    actualitzarProfessional,
    eliminarProfessional,
  } = useConfig();
  const { obtenirCentre } = useCentres();

  const [mostrarFormulari, setMostrarFormulari] = useState(false);
  const [professionalEdicio, setProfessionalEdicio] = useState<
    Professional | undefined
  >(undefined);
  const [professionalEliminar, setProfessionalEliminar] = useState<
    Professional | null
  >(null);

  if (!carregat || !sessio) {
    return <CarregantSessio />;
  }

  const centre = obtenirCentre(sessio.centreId);
  const professionalsCentre = professionals.filter(
    (professional) => professional.centreId === sessio.centreId
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 pl-16 sm:px-7 sm:py-4 sm:pl-7">
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
              {t("configuracio.titol")}
            </h1>
            <p className="text-[13px] text-slate-400">
              {t("configuracio.subtitol")}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-slate-50/40 px-4 py-5 sm:px-7 sm:py-6">
          {/* Dades del centre */}
          {centre && <DadesCentre centre={centre} />}

          {/* Professionals */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <IconUsers className="h-4 w-4 text-brand-500" />
                <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
                  {t("configuracio.professionals")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfessionalEdicio(undefined);
                  setMostrarFormulari(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
              >
                <IconPlus className="h-[15px] w-[15px]" />
                {t("configuracio.nouProfessional")}
              </button>
            </div>

            {professionalsCentre.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center text-[13px] text-slate-400">
                {t("configuracio.capProfessional")}
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {professionalsCentre.map((professional) => (
                  <div
                    key={professional.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-[13px] font-semibold text-white">
                        {professional.nom[0]}
                        {professional.cognoms[0]}
                      </div>
                      <div className="min-w-0 leading-tight">
                        <p className="text-[13px] font-medium text-slate-900">
                          {professional.nom} {professional.cognoms}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[12px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <IconMail className="h-3 w-3" />
                            {professional.email}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <IconStethoscope className="h-3 w-3" />
                            {professional.especialitat}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setProfessionalEdicio(professional);
                          setMostrarFormulari(true);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        title={t("comu.editar")}
                      >
                        <IconPencil className="h-[15px] w-[15px]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfessionalEliminar(professional)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                        title={t("comu.eliminar")}
                      >
                        <IconTrash className="h-[15px] w-[15px]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mostrarFormulari && (
        <FormulariProfessional
          titol={
            professionalEdicio
              ? t("configuracio.editarProfessional")
              : t("configuracio.nouProfessional")
          }
          etiquetaBoto={
            professionalEdicio
              ? t("comu.desarCanvis")
              : t("configuracio.crearProfessional")
          }
          valorsInicials={professionalEdicio}
          onTancar={() => setMostrarFormulari(false)}
          onDesar={(dades) => {
            if (professionalEdicio) {
              actualitzarProfessional(professionalEdicio.id, {
                ...dades,
                centreId: professionalEdicio.centreId,
              });
            } else {
              afegirProfessional({ ...dades, centreId: sessio.centreId });
            }
            setMostrarFormulari(false);
          }}
        />
      )}

      {professionalEliminar && (
        <ModalConfirmacio
          titol={t("configuracio.confirmarEliminarTitol")}
          missatge={t("configuracio.confirmarEliminarMissatge", {
            nom: `${professionalEliminar.nom} ${professionalEliminar.cognoms}`,
          })}
          etiquetaConfirmar={t("comu.eliminar")}
          etiquetaCancelar={t("comu.cancelar")}
          onCancelar={() => setProfessionalEliminar(null)}
          onConfirmar={() => {
            eliminarProfessional(professionalEliminar.id);
            setProfessionalEliminar(null);
          }}
        />
      )}
    </div>
  );
}
