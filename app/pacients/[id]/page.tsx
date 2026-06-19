"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconActivity,
  IconAlertTriangle,
  IconArrowLeft,
  IconCalendar,
  IconMail,
  IconMicrophone,
  IconPencil,
  IconPhone,
  IconTrash,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
import { useRequereSessio } from "@/lib/auth-context";
import { CarregantSessio } from "@/lib/auth-guard";
import { useDades } from "@/lib/dades-context";
import { calcularEdat, formatData } from "@/lib/data-utils";
import {
  ESTAT_PACIENT_ESTILS,
  EVOLUCIO_ESTILS,
  EVOLUCIO_ICONES,
  FASE_ESTILS,
  etiquetaEstatPacient,
  etiquetaEvolucio,
  etiquetaFase,
} from "@/lib/etiquetes";
import { useIdioma } from "@/lib/i18n-context";
import { ModalConfirmacio } from "@/components/ModalConfirmacio";
import { FormulariPacient } from "../FormulariPacient";

export default function PacientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { idioma, t } = useIdioma();
  const { sessio, carregat } = useRequereSessio();
  const { obtenirPacient, obtenirSessionsPacient, actualitzarPacient, eliminarPacient } =
    useDades();
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const pacient = obtenirPacient(id);
  const sessions = obtenirSessionsPacient(id);

  if (!carregat || !sessio) {
    return <CarregantSessio />;
  }

  if (!pacient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50/40">
        <p className="text-[14px] text-slate-500">
          {t("pacientDetall.pacientNoTrobat")}
        </p>
        <Link
          href="/pacients"
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
        >
          <IconArrowLeft className="h-4 w-4" />
          {t("pacientDetall.tornarAPacients")}
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
      <div className="flex flex-col gap-2.5 border-b border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-3.5">
        <Link
          href="/pacients"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <IconArrowLeft className="h-4 w-4" />
          {t("pacientDetall.tornarAPacients")}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMostrarEditar(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <IconPencil className="h-[15px] w-[15px]" />
            {t("pacientDetall.editar")}
          </button>
          <button
            type="button"
            onClick={() => setMostrarEliminar(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3.5 py-2 text-[13px] font-medium text-red-600 transition hover:bg-red-50"
          >
            <IconTrash className="h-[15px] w-[15px]" />
            {t("pacientDetall.eliminarPacient")}
          </button>
          <Link
            href={`/sessio/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            <IconMicrophone className="h-[15px] w-[15px]" />
            {t("pacientDetall.novaSessio")}
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-5 sm:px-7 sm:py-6">
        {/* Capçalera del pacient */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-600 text-lg font-semibold text-white sm:h-16 sm:w-16 sm:text-xl">
              {inicials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  {nomComplet}
                </h1>
                <span className={ESTAT_PACIENT_ESTILS[pacient.estat].badge}>
                  <span className={ESTAT_PACIENT_ESTILS[pacient.estat].dot} />
                  {etiquetaEstatPacient(pacient.estat, idioma)}
                </span>
                <span className={FASE_ESTILS[pacient.fase]}>
                  {etiquetaFase(pacient.fase, idioma)}
                </span>
                {kinesiofobiaDetectada && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700 ring-1 ring-orange-100">
                    <IconAlertTriangle className="h-3 w-3" />
                    {t("pacientDetall.kinesiofobiaDetectada")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] text-slate-500 tabular-nums">
                {edat} {t("comu.anys")} · {pacient.diagnostic}
              </p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-600">
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
                  {t("pacientDetall.pacientDesDe")} {formatData(pacient.dataInici)}
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
                {t("pacientDetall.dadesPersonals")}
              </h2>
            </div>
            <dl className="divide-y divide-slate-100 text-[13px]">
              <div className="flex flex-wrap items-center justify-between gap-1 py-2.5">
                <dt className="text-slate-500">{t("comu.dataNaixement")}</dt>
                <dd className="font-medium text-slate-800 tabular-nums">
                  {formatData(pacient.dataNaixement)}
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 py-2.5">
                <dt className="text-slate-500">{t("comu.telefon")}</dt>
                <dd className="font-medium text-slate-800 tabular-nums">
                  {pacient.telefon}
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 py-2.5">
                <dt className="text-slate-500">{t("comu.email")}</dt>
                <dd className="font-medium text-slate-800">
                  {pacient.email}
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 py-2.5">
                <dt className="text-slate-500">{t("pacientDetall.diagnostic")}</dt>
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
                {t("pacientDetall.resumClinic")}
              </h2>
            </div>
            <dl className="divide-y divide-slate-100 text-[13px]">
              <div className="flex flex-wrap items-center justify-between gap-1 py-2.5">
                <dt className="text-slate-500">{t("pacientDetall.evaActual")}</dt>
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
              <div className="flex flex-wrap items-center justify-between gap-1 py-2.5">
                <dt className="text-slate-500">{t("pacientDetall.ultimaSessio")}</dt>
                <dd className="font-medium text-slate-800 tabular-nums">
                  {ultimaSessio ? formatData(ultimaSessio.data) : "—"}
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 py-2.5">
                <dt className="text-slate-500">{t("pacientDetall.properaSessio")}</dt>
                <dd className="font-medium text-slate-800 tabular-nums">
                  {pacient.properaSessio
                    ? formatData(pacient.properaSessio)
                    : t("pacientDetall.pendentProgramar")}
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 py-2.5">
                <dt className="text-slate-500">{t("pacientDetall.frequencia")}</dt>
                <dd className="font-medium text-slate-800">
                  {pacient.frequencia ?? t("pacientDetall.pendentDefinir")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Historial de sessions */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
              {t("pacientDetall.historialSessions")}
            </h2>
            <span className="text-[12px] text-slate-400 tabular-nums">
              {sessions.length} {t("pacientDetall.sessions")}
            </span>
          </div>
          {sessions.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-6 text-center text-[13px] text-slate-400">
              {t("pacientDetall.capSessio")}
            </p>
          ) : (
            <div className="space-y-2.5">
              {sessions.map((sessio) => {
                const esInicial = sessio.numero === 1;
                const IconEvolucio = EVOLUCIO_ICONES[sessio.evolucio];
                return (
                  <Link
                    key={sessio.id}
                    href={`/sessio/detall/${sessio.id}`}
                    className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[12px] text-slate-400">
                          <IconCalendar className="h-[13px] w-[13px]" />
                          <span className="tabular-nums">
                            {formatData(sessio.data)}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="font-medium text-slate-500">
                            {t("pacientDetall.sessioNum")} {sessio.numero}
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
                            {t("pacientDetall.inicial")}
                          </span>
                        ) : (
                          <span className={EVOLUCIO_ESTILS[sessio.evolucio]}>
                            <IconEvolucio className="h-3 w-3" />
                            {etiquetaEvolucio(sessio.evolucio, idioma)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {mostrarEditar && (
        <FormulariPacient
          titol={t("formulariPacient.editarPacientTitol")}
          etiquetaBoto={t("comu.desarCanvis")}
          valorsInicials={pacient}
          onTancar={() => setMostrarEditar(false)}
          onDesar={(dades) => {
            actualitzarPacient(id, dades);
            setMostrarEditar(false);
          }}
        />
      )}

      {mostrarEliminar && (
        <ModalConfirmacio
          titol={t("pacientDetall.confirmarEliminarTitol")}
          missatge={t("pacientDetall.confirmarEliminarMissatge", { nom: nomComplet })}
          etiquetaConfirmar={t("comu.eliminar")}
          etiquetaCancelar={t("comu.cancelar")}
          onCancelar={() => setMostrarEliminar(false)}
          onConfirmar={() => {
            eliminarPacient(id);
            router.push("/pacients");
          }}
        />
      )}
    </div>
  );
}
