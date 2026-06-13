"use client";

import { use } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendar,
  IconFileDownload,
  IconNotes,
  IconQuote,
  IconUserCheck,
} from "@tabler/icons-react";
import { useDades } from "@/lib/dades-context";
import { formatData } from "@/lib/data-utils";
import { exportarSessioPDF } from "@/lib/exportar-pdf";
import {
  EVOLUCIO_ESTILS,
  EVOLUCIO_ETIQUETES,
  EVOLUCIO_ICONES,
  SEVERITAT_ESTILS,
  SEVERITAT_ICONES,
  TIPUS_DETECCIO_ETIQUETES,
} from "@/lib/etiquetes";

export default function DetallSessioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { obtenirSessio, obtenirPacient } = useDades();

  const sessio = obtenirSessio(id);
  const pacient = sessio ? obtenirPacient(sessio.pacientId) : undefined;

  if (!sessio || !pacient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50/40">
        <p className="text-[14px] text-slate-500">Sessió no trobada.</p>
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
  const IconEvolucio = EVOLUCIO_ICONES[sessio.evolucio];
  const liniesTranscripcio = sessio.transcripcio?.split("\n") ?? [];

  return (
    <div className="min-h-screen bg-slate-50/40">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-7 py-3.5">
        <Link
          href={`/pacients/${pacient.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <IconArrowLeft className="h-4 w-4" />
          Tornar a la fitxa
        </Link>
        <button
          type="button"
          onClick={() => exportarSessioPDF(pacient, sessio)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
        >
          <IconFileDownload className="h-[15px] w-[15px]" />
          Exportar PDF
        </button>
      </div>

      <main className="mx-auto max-w-3xl px-7 py-6">
        {/* Capçalera de la sessió */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                {nomComplet} · Sessió {sessio.numero}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-slate-500">
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <IconCalendar className="h-[15px] w-[15px] text-slate-400" />
                  {formatData(sessio.data)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconUserCheck className="h-[15px] w-[15px] text-slate-400" />
                  {pacient.profesionalAssignat}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 tabular-nums">
                EVA {sessio.eva}/10
              </span>
              <span className={EVOLUCIO_ESTILS[sessio.evolucio]}>
                <IconEvolucio className="h-3 w-3" />
                {EVOLUCIO_ETIQUETES[sessio.evolucio]}
              </span>
            </div>
          </div>
        </div>

        {/* Resum estructurat */}
        {sessio.resumEstructurat && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
              Resum estructurat
            </h2>
            <dl className="mt-3 space-y-3 text-[13px]">
              <div>
                <dt className="font-medium text-slate-900">
                  Motiu de consulta
                </dt>
                <dd className="mt-0.5 text-slate-600">
                  {sessio.resumEstructurat.motivConsulta}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Dolor</dt>
                <dd className="mt-0.5 text-slate-600">
                  {sessio.resumEstructurat.dolor}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">
                  Aspecte emocional
                </dt>
                <dd className="mt-0.5 text-slate-600">
                  {sessio.resumEstructurat.aspecteEmocional}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">
                  Valoració funcional
                </dt>
                <dd className="mt-0.5 text-slate-600">
                  {sessio.resumEstructurat.valoracioFuncional}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-red-700">Pendents</dt>
                <dd className="mt-0.5">
                  <ul className="list-inside list-disc space-y-1 text-red-600">
                    {sessio.resumEstructurat.pendents.map((pendent, index) => (
                      <li key={index}>{pendent}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        )}

        {/* Deteccions de la IA */}
        {sessio.deteccionsIA && sessio.deteccionsIA.length > 0 && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
              Deteccions de la IA
            </h2>
            <ul className="mt-3 space-y-3">
              {sessio.deteccionsIA.map((deteccio, index) => {
                const IconSeveritat = SEVERITAT_ICONES[deteccio.severitat];
                return (
                  <li key={index} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 shrink-0 rounded-full p-1 ${SEVERITAT_ESTILS[deteccio.severitat]}`}
                    >
                      <IconSeveritat className="h-4 w-4" />
                    </span>
                    <div>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${SEVERITAT_ESTILS[deteccio.severitat]}`}
                      >
                        {TIPUS_DETECCIO_ETIQUETES[deteccio.tipus]}
                      </span>
                      <p className="mt-1 text-[13px] text-slate-600">
                        {deteccio.descripcio}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Transcripció completa */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight text-slate-900">
            <IconNotes className="h-4 w-4 text-slate-400" />
            Transcripció completa
          </h2>
          {liniesTranscripcio.length === 0 ? (
            <p className="mt-3 text-[13px] text-slate-400">
              No hi ha transcripció disponible per a aquesta sessió.
            </p>
          ) : (
            <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-700">
              {liniesTranscripcio.map((linia, index) => (
                <p key={index}>{linia}</p>
              ))}
            </div>
          )}
        </div>

        {sessio.previewResum && !sessio.resumEstructurat && (
          <blockquote className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-[13px] text-brand-800 italic">
            <IconQuote className="mt-0.5 h-4 w-4 shrink-0" />
            {sessio.previewResum}
          </blockquote>
        )}

        <div className="mt-6">
          <Link
            href={`/pacients/${pacient.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <IconArrowLeft className="h-4 w-4" />
            Tornar a la fitxa
          </Link>
        </div>
      </main>
    </div>
  );
}
