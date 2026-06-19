"use client";

import { useState } from "react";
import {
  IconBuildingHospital,
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

export default function ConfiguracioPage() {
  const { t } = useIdioma();
  const { sessio, carregat } = useRequereSessio();
  const {
    professionals,
    afegirProfessional,
    actualitzarProfessional,
    eliminarProfessional,
  } = useConfig();
  const { obtenirCentre, actualitzarNomCentre } = useCentres();

  const [nomCentreDraft, setNomCentreDraft] = useState<string | null>(null);
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
  const nomCentreEdicio = nomCentreDraft ?? centre?.nom ?? "";
  const professionalsCentre = professionals.filter(
    (professional) => professional.centreId === sessio.centreId
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-4">
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
              {t("configuracio.titol")}
            </h1>
            <p className="text-[13px] text-slate-400">
              {t("configuracio.subtitol")}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-slate-50/40 px-7 py-6">
          {/* Dades del centre */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <IconBuildingHospital className="h-4 w-4 text-brand-500" />
              <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
                {t("configuracio.dadesCentre")}
              </h2>
            </div>
            <div className="max-w-md">
              <label className="text-[12px] font-medium text-slate-500">
                {t("configuracio.nomCentre")}
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={nomCentreEdicio}
                  onChange={(event) => setNomCentreDraft(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
                />
                <button
                  type="button"
                  disabled={
                    !nomCentreEdicio.trim() || nomCentreEdicio === centre?.nom
                  }
                  onClick={() => {
                    actualitzarNomCentre(sessio.centreId, nomCentreEdicio.trim());
                    setNomCentreDraft(null);
                  }}
                  className="shrink-0 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t("comu.desar")}
                </button>
              </div>
            </div>
          </div>

          {/* Professionals */}
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
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
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-[13px] font-semibold text-white">
                        {professional.nom[0]}
                        {professional.cognoms[0]}
                      </div>
                      <div className="leading-tight">
                        <p className="text-[13px] font-medium text-slate-900">
                          {professional.nom} {professional.cognoms}
                        </p>
                        <div className="mt-0.5 flex items-center gap-3 text-[12px] text-slate-400">
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
