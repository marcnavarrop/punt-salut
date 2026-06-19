"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconLogout,
  IconMenu2,
  IconSettings,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { useAuth } from "@/lib/auth-context";
import { useCentres } from "@/lib/centres";
import { useIdioma } from "@/lib/i18n-context";
import { IDIOMES, type Idioma } from "@/lib/i18n";
import { LogoCentre } from "@/components/LogoCentre";

export function Sidebar() {
  const { sessio, tancarSessio } = useAuth();
  const { obtenirCentre } = useCentres();
  const centre = sessio ? obtenirCentre(sessio.centreId) : undefined;
  const { idioma, canviarIdioma, t } = useIdioma();
  const router = useRouter();
  const pathname = usePathname();
  const [obert, setObert] = useState(false);

  function gestionarTancarSessio() {
    tancarSessio();
    router.replace("/login");
  }

  const enllacActiu =
    "flex items-center gap-2.5 rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-brand-700 shadow-sm ring-1 ring-slate-200/70";
  const enllacInactiu =
    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-800";

  return (
    <>
      {/* Botó hamburguesa (només mòbil) */}
      <button
        type="button"
        onClick={() => setObert(true)}
        className="fixed left-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm sm:hidden"
      >
        <IconMenu2 className="h-5 w-5" />
      </button>

      {/* Fons fosc en obrir el menú a mòbil */}
      {obert && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setObert(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col border-r border-slate-200 bg-slate-50/60 transition-transform duration-200 sm:static sm:z-auto sm:w-60 sm:max-w-none sm:translate-x-0 ${
          obert ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2.5 px-5 py-[18px]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <LogoCentre
              centre={centre}
              className="h-7 w-7 shrink-0 rounded-lg text-[11px] font-semibold shadow-sm"
            />
            <span className="truncate whitespace-nowrap text-[15px] font-semibold tracking-tight text-slate-900">
              {centre?.nom}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setObert(false)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 sm:hidden"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 pt-1">
          <Link
            href="/pacients"
            onClick={() => setObert(false)}
            className={
              pathname.startsWith("/pacients") ? enllacActiu : enllacInactiu
            }
          >
            <IconUsers
              className={`h-[17px] w-[17px] ${
                pathname.startsWith("/pacients") ? "text-brand-600" : ""
              }`}
            />
            {t("sidebar.pacients")}
          </Link>
          <Link
            href="/configuracio"
            onClick={() => setObert(false)}
            className={
              pathname.startsWith("/configuracio") ? enllacActiu : enllacInactiu
            }
          >
            <IconSettings
              className={`h-[17px] w-[17px] ${
                pathname.startsWith("/configuracio") ? "text-brand-600" : ""
              }`}
            />
            {t("sidebar.configuracio")}
          </Link>
        </nav>

        {/* Selector d'idioma */}
        <div className="mt-3 flex items-center gap-1 px-3">
          {IDIOMES.map((opcio: Idioma) => (
            <button
              key={opcio}
              type="button"
              onClick={() => canviarIdioma(opcio)}
              className={`flex-1 rounded-lg px-2 py-1.5 text-[12px] font-semibold uppercase tracking-wide transition ${
                idioma === opcio
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-white text-slate-400 ring-1 ring-slate-200 hover:text-slate-600"
              }`}
            >
              {opcio}
            </button>
          ))}
        </div>

        {/* User chip */}
        <div className="mt-auto m-3 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-semibold text-white">
            {sessio ? `${sessio.nom[0]}${sessio.cognoms[0]}` : ""}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-medium text-slate-800">
              {sessio ? `${sessio.nom} ${sessio.cognoms}` : ""}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {sessio?.especialitat}
            </p>
          </div>
          <button
            type="button"
            onClick={gestionarTancarSessio}
            title={t("sidebar.tancarSessio")}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <IconLogout className="h-[15px] w-[15px]" />
          </button>
        </div>
      </aside>
    </>
  );
}
