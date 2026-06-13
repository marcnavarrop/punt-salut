"use client";

import { use } from "react";
import Link from "next/link";
import {
  IconActivity,
  IconAlertTriangle,
  IconArrowLeft,
  IconCalendar,
  IconMail,
  IconMicrophone,
  IconPhone,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
import { useDades } from "@/lib/dades-context";
import { calcularEdat, formatData } from "@/lib/data-utils";
import {
  ESTAT_PACIENT_ESTILS,
  ESTAT_PACIENT_ETIQUETES,
  EVOLUCIO_ESTILS,
  EVOLUCIO_ETIQUETES,
  EVOLUCIO_ICONES,
  FASE_ESTILS,
  FASE_ETIQUETES,
} from "@/lib/etiquetes";

export default function PacientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { obtenirPacient, obtenirSessionsPacient } = useDades();

  const pacient = obtenirPacient(id);
  const sessions = obtenirSessionsPacient(id);

  if (!pacient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50/40">
        <p className="text-[14px] text-slate-500">Pacient no trobat.</p>
        <Link
          href="/pacients"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
        >
          <IconArrowLeft className="h-4 w-4" />
          Tornar a pacients
        </Link>
      </div>
    );
  }

  const nomComplet = `${pacient.nom} ${pacient.cognoms}`;
  const inicials = `${pacient.nom[0]}${pacient.cognoms[0]}`;
  const edat = calcularEdat(pacient.dataNaixement);
  const kinesiofobiaDetectada = sessions.some((sessio) =>
    sessio.deteccionsIA?.some((deteccio) => deteccio.tipus === "kinesiofobia")
  );
  const ultimaSessio = sessions[0];

  return (
    <div className="min-h-screen bg-slate-50/40">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-7 py-3.5">
        <Link
          href="/pacients"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <IconArrowLeft className="h-4 w-4" />
          Tornar a pacients
        </Link>
        <Link
          href={`/sessio/${id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
        >
          <IconMicrophone className="h-[15px] w-[15px]" />
          Nova sessió
        </Link>
      </div>

      <main className="mx-auto max-w-5xl px-7 py-6">
        {/* Capçalera del pacient */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brand-600 text-xl font-semibold text-white">
              {inicials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  {nomComplet}
                </h1>
                <span className={ESTAT_PACIENT_ESTILS[pacient.estat].badge}>
                  <span className={ESTAT_PACIENT_ESTILS[pacient.estat].dot} />
                  {ESTAT_PACIENT_ETIQUETES[pacient.estat]}
                </span>
                <span className={FASE_ESTILS[pacient.fase]}>
                  {FASE_ETIQUETES[pacient.fase]}
                </span>
                {kinesiofobiaDetectada && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700 ring-1 ring-orange-100">
                    <IconAlertTriangle className="h-3 w-3" />
                    Kinesiofòbia detectada
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-slate-500 tabular-nums">
                {edat} anys · {pacient.diagnostic}
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <IconUserCheck className="h-[15px] w-[15px] text-slate-400" />
                  {pacient.profesionalAssignat}
                </span>
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <IconPhone className="h-[15px] w-[15px] text-slate-400" />
                  {pacient.telefon}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconMail className="h-[15px] w-[15px] text-slate-400" />
                  {pacient.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconCalendar className="h-[15px] w-[15px] text-slate-400" />
                  Pacient des de {formatData(pacient.dataInici)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dades personals i resum clínic */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <IconUser className="h-4 w-4 text-slate-400" />
              <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
                Dades personals
              </h2>
            </div>
            <dl className="divide-y divide-slate-100 text-[13px]">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-500">Data de naixement</dt>
                <dd className="font-medium text-slate-800 tabular-nums">
                  {formatData(pacient.dataNaixement)}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-500">Telèfon</dt>
                <dd className="font-medium text-slate-800 tabular-nums">
                  {pacient.telefon}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium text-slate-800">
                  {pacient.email}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-500">Diagnòstic</dt>
                <dd className="font-medium text-slate-800">
                  {pacient.diagnostic}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <IconActivity className="h-4 w-4 text-brand-500" />
              <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
                Resum clínic
              </h2>
            </div>
            <dl className="divide-y divide-slate-100 text-[13px]">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-500">EVA actual</dt>
                <dd className="inline-flex items-center gap-2">
                  {ultimaSessio ? (
                    <>
                      <span className="font-semibold text-brand-700 tabular-nums">
                        {ultimaSessio.eva} / 10
                      </span>
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                        <span
                          className="block h-full rounded-full bg-brand-500"
                          style={{ width: `${ultimaSessio.eva * 10}%` }}
                        />
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-slate-400">—</span>
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-500">Última sessió</dt>
                <dd className="font-medium text-slate-800 tabular-nums">
                  {ultimaSessio ? formatData(ultimaSessio.data) : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-500">Propera sessió</dt>
                <dd className="font-medium text-slate-800 tabular-nums">
                  {pacient.properaSessio
                    ? formatData(pacient.properaSessio)
                    : "Pendent de programar"}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-500">Freqüència</dt>
                <dd className="font-medium text-slate-800">
                  {pacient.frequencia ?? "Pendent de definir"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Historial de sessions */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
              Historial de sessions
            </h2>
            <span className="text-[12px] text-slate-400 tabular-nums">
              {sessions.length} sessions
            </span>
          </div>
          {sessions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center text-[13px] text-slate-400">
              Encara no hi ha sessions registrades per a aquest pacient.
            </p>
          ) : (
            <div className="space-y-2.5">
              {sessions.map((sessio) => {
                const esInicial = sessio.numero === 1;
                const IconEvolucio = EVOLUCIO_ICONES[sessio.evolucio];
                return (
                  <article
                    key={sessio.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[12px] text-slate-400">
                          <IconCalendar className="h-[13px] w-[13px]" />
                          <span className="tabular-nums">
                            {formatData(sessio.data)}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-medium text-slate-500">
                            Sessió {sessio.numero}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[14px] font-medium text-slate-900">
                          {sessio.titol}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                          {sessio.previewResum}
                        </p>
                        {sessio.deteccionsIA && sessio.deteccionsIA.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {sessio.deteccionsIA.map((deteccio, index) => (
                              <span
                                key={index}
                                className="rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700 ring-1 ring-orange-100"
                              >
                                {deteccio.descripcio}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 tabular-nums">
                          EVA {sessio.eva}/10
                        </span>
                        {esInicial ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            Inicial
                          </span>
                        ) : (
                          <span className={EVOLUCIO_ESTILS[sessio.evolucio]}>
                            <IconEvolucio className="h-3 w-3" />
                            {EVOLUCIO_ETIQUETES[sessio.evolucio]}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
