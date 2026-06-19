"use client";

import { useState } from "react";
import {
  IconBuildingHospital,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { useRequereSessio } from "@/lib/auth-context";
import { CarregantSessio } from "@/lib/auth-guard";
import { useConfig } from "@/lib/config-context";
import { useCentres } from "@/lib/centres";
import { useIdioma } from "@/lib/i18n-context";
import { Sidebar } from "@/components/Sidebar";
import { DadesCentre } from "./DadesCentre";
import { PerfilProfessional } from "./PerfilProfessional";
import { ProfessionalsCentre } from "./ProfessionalsCentre";

type Pestanya = "perfil" | "centre" | "professionals";

export default function ConfiguracioPage() {
  const { t } = useIdioma();
  const { sessio, carregat } = useRequereSessio();
  const { professionals } = useConfig();
  const { obtenirCentre } = useCentres();

  const [pestanya, setPestanya] = useState<Pestanya>("perfil");

  if (!carregat || !sessio) {
    return <CarregantSessio />;
  }

  const centre = obtenirCentre(sessio.centreId);
  const perfilPropi =
    professionals.find((professional) => professional.id === sessio.id) ??
    sessio;

  const PESTANYES: { id: Pestanya; etiqueta: string; icona: typeof IconUserCircle }[] = [
    { id: "perfil", etiqueta: t("configuracio.elMeuPerfil"), icona: IconUserCircle },
    { id: "centre", etiqueta: t("configuracio.dadesCentre"), icona: IconBuildingHospital },
    { id: "professionals", etiqueta: t("configuracio.professionals"), icona: IconUsers },
  ];

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

        {/* Pestanyes */}
        <div className="border-b border-slate-200 bg-white px-4 sm:px-7">
          <nav className="flex gap-1 overflow-x-auto">
            {PESTANYES.map((p) => {
              const Icona = p.icona;
              const activa = pestanya === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPestanya(p.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-[13px] font-medium transition ${
                    activa
                      ? "border-brand-600 text-brand-700"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icona className="h-[15px] w-[15px]" />
                  {p.etiqueta}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 bg-slate-50/40 px-4 py-5 sm:px-7 sm:py-6">
          {pestanya === "perfil" && (
            <PerfilProfessional professional={perfilPropi} />
          )}
          {pestanya === "centre" && centre && <DadesCentre centre={centre} />}
          {pestanya === "professionals" && (
            <ProfessionalsCentre centreId={sessio.centreId} />
          )}
        </div>
      </div>
    </div>
  );
}
