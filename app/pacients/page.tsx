"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconActivity,
  IconLogout,
  IconPlus,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import {
  AVATAR_ESTILS,
  ESTAT_PACIENT_ESTILS,
  ESTAT_PACIENT_ETIQUETES,
  FASE_ETIQUETES,
  FASE_ESTILS,
} from "@/lib/etiquetes";
import { calcularEdat } from "@/lib/data-utils";
import { useRequereSessio } from "@/lib/auth-context";
import { CarregantSessio } from "@/lib/auth-guard";
import { useDades } from "@/lib/dades-context";
import { FormulariNouPacient } from "./FormulariNouPacient";

function inicials(nom: string, cognoms: string): string {
  return `${nom[0]}${cognoms[0]}`.toUpperCase();
}

export default function PacientsPage() {
  const { pacients, afegirPacient } = useDades();
  const { sessio, carregat, tancarSessio } = useRequereSessio();
  const router = useRouter();
  const [cerca, setCerca] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  function gestionarTancarSessio() {
    tancarSessio();
    router.replace("/login");
  }

  if (!carregat || !sessio) {
    return <CarregantSessio />;
  }

  const cercaNormalitzada = cerca.trim().toLowerCase();
  const pacientsFiltrats = pacients.filter((pacient) => {
    const text = `${pacient.nom} ${pacient.cognoms} ${pacient.diagnostic}`.toLowerCase();
    return text.includes(cercaNormalitzada);
  });

  const pacientsActius = pacients.filter((p) => p.estat === "actiu").length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Navegació lateral */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-slate-50/60 sm:flex">
        <div className="flex items-center gap-2.5 px-5 py-[18px]">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white shadow-sm">
            <IconActivity className="h-4 w-4" />
          </div>
          <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-slate-900">
            Punt Salut
          </span>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 pt-1">
          <Link
            href="/pacients"
            className="flex items-center gap-2.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-brand-700 shadow-sm ring-1 ring-slate-200/70"
          >
            <IconUsers className="h-[17px] w-[17px] text-brand-600" />
            Pacients
          </Link>
          {/* Espai per a futures seccions */}
          <span className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-800">
            <IconSettings className="h-[17px] w-[17px]" />
            Configuració
          </span>
        </nav>

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
            title="Tancar sessió"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <IconLogout className="h-[15px] w-[15px]" />
          </button>
        </div>
      </aside>

      {/* Contingut principal */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-7 py-4">
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
              Punt Salut Montseny
            </h1>
            <p className="text-[13px] text-slate-400">Assistent clínic</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
              <span className="font-semibold text-slate-800 tabular-nums">
                {pacientsActius}
              </span>{" "}
              pacients actius
            </div>
            <button
              type="button"
              onClick={() => setMostrarModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              <IconPlus className="h-[15px] w-[15px]" />
              Nou pacient
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
              placeholder="Cerca per nom o diagnòstic…"
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
                        {calcularEdat(pacient.dataNaixement)} anys
                      </p>
                    </div>
                  </div>
                  <span className={ESTAT_PACIENT_ESTILS[pacient.estat].badge}>
                    <span className={ESTAT_PACIENT_ESTILS[pacient.estat].dot} />
                    {ESTAT_PACIENT_ETIQUETES[pacient.estat]}
                  </span>
                </div>
                <p className="mt-3.5 text-[13px] text-slate-600">
                  {pacient.diagnostic}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className={FASE_ESTILS[pacient.fase]}>
                    {FASE_ETIQUETES[pacient.fase]}
                  </span>
                </div>
              </Link>
            ))}

            {pacientsFiltrats.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-slate-400">
                No s&apos;ha trobat cap pacient amb aquest criteri.
              </p>
            )}
          </div>
        </div>
      </div>

      {mostrarModal && (
        <FormulariNouPacient
          onTancar={() => setMostrarModal(false)}
          onCrear={(dades) => {
            afegirPacient(dades);
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
}
