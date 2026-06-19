"use client";

import { useState } from "react";
import Link from "next/link";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import {
  AVATAR_ESTILS,
  ESTAT_PACIENT_ESTILS,
  FASE_ESTILS,
  etiquetaEstatPacient,
  etiquetaFase,
} from "@/lib/etiquetes";
import { calcularEdat } from "@/lib/data-utils";
import { useRequereSessio } from "@/lib/auth-context";
import { CarregantSessio } from "@/lib/auth-guard";
import { useDades } from "@/lib/dades-context";
import { useCentres } from "@/lib/centres";
import { useIdioma } from "@/lib/i18n-context";
import { Sidebar } from "@/components/Sidebar";
import { FormulariPacient } from "./FormulariPacient";

function inicials(nom: string, cognoms: string): string {
  return `${nom[0]}${cognoms[0]}`.toUpperCase();
}

export default function PacientsPage() {
  const { pacients, afegirPacient } = useDades();
  const { obtenirCentre } = useCentres();
  const { idioma, t } = useIdioma();
  const { sessio, carregat } = useRequereSessio();
  const [cerca, setCerca] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!carregat || !sessio) {
    return <CarregantSessio />;
  }

  const centre = obtenirCentre(sessio.centreId);

  const cercaNormalitzada = cerca.trim().toLowerCase();
  const pacientsFiltrats = pacients.filter((pacient) => {
    const text = `${pacient.nom} ${pacient.cognoms} ${pacient.diagnostic}`.toLowerCase();
    return text.includes(cercaNormalitzada);
  });

  const pacientsActius = pacients.filter((p) => p.estat === "actiu").length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      {/* Contingut principal */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-4">
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
              {centre?.nom}
            </h1>
            <p className="text-[13px] text-slate-400">
              {t("pacients.assistentClinic")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
              <span className="font-semibold text-slate-800 tabular-nums">
                {pacientsActius}
              </span>{" "}
              {t("pacients.pacientsActius")}
            </div>
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              <IconPlus className="h-[15px] w-[15px]" />
              {t("pacients.nouPacient")}
            </button>
          </div>
        </div>

        {/* Contingut */}
        <div className="flex-1 bg-slate-50/40 px-7 py-6">
          {/* Cerca */}
          <div className="relative mb-5 max-w-md">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={cerca}
              onChange={(event) => setCerca(event.target.value)}
              placeholder={t("pacients.cercaPlaceholder")}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[13px] text-slate-700 placeholder:text-slate-400 shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>

          {/* Grid de targetes de pacients */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {pacientsFiltrats.map((pacient) => (
              <Link
                key={pacient.id}
                href={`/pacients/${pacient.id}`}
                className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid h-10 w-10 place-items-center rounded-full text-[13px] font-semibold text-white ${AVATAR_ESTILS[pacient.estat]}`}
                    >
                      {inicials(pacient.nom, pacient.cognoms)}
                    </div>
                    <div className="leading-tight">
                      <p className="text-[14px] font-semibold text-slate-900">
                        {pacient.nom} {pacient.cognoms}
                      </p>
                      <p className="text-[12px] text-slate-400 tabular-nums">
                        {calcularEdat(pacient.dataNaixement)} {t("comu.anys")}
                      </p>
                    </div>
                  </div>
                  <span className={ESTAT_PACIENT_ESTILS[pacient.estat].badge}>
                    <span className={ESTAT_PACIENT_ESTILS[pacient.estat].dot} />
                    {etiquetaEstatPacient(pacient.estat, idioma)}
                  </span>
                </div>
                <p className="mt-3.5 text-[13px] text-slate-600">
                  {pacient.diagnostic}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className={FASE_ESTILS[pacient.fase]}>
                    {etiquetaFase(pacient.fase, idioma)}
                  </span>
                </div>
              </Link>
            ))}

            {pacientsFiltrats.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-slate-400">
                {t("pacients.capResultat")}
              </p>
            )}
          </div>
        </div>
      </div>

      {mostrarModal && (
        <FormulariPacient
          titol={t("formulariPacient.nouPacientTitol")}
          etiquetaBoto={t("formulariPacient.crearPacient")}
          onTancar={() => setMostrarModal(false)}
          onDesar={(dades) => {
            afegirPacient(dades);
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
}
