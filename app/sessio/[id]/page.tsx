"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconBulb,
  IconDeviceFloppy,
  IconMessageQuestion,
  IconPencil,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
  IconQuote,
} from "@tabler/icons-react";
import {
  analitzarTranscripcio,
  generarPreguntesSeguentSessio,
  type AnalisiTranscripcio,
} from "@/lib/ai-simulada";
import { SEVERITAT_ESTILS, SEVERITAT_ICONES, etiquetaDeteccio } from "@/lib/etiquetes";
import { useRequereSessio } from "@/lib/auth-context";
import { CarregantSessio } from "@/lib/auth-guard";
import { useDades } from "@/lib/dades-context";
import { dataAvui } from "@/lib/data-utils";
import { useIdioma } from "@/lib/i18n-context";
import {
  iniciarTranscripcio,
  type ControladorTranscripcio,
  type TipusErrorTranscripcio,
} from "@/lib/deepgram";

const SEGONS_PER_ANALISI = 15;
const INTERVAL_DETECCIO_MS = 500;

const CLAU_ERROR_TRANSCRIPCIO: Record<TipusErrorTranscripcio, string> = {
  "permis-microfon": "sessio.errorMicrofon",
  "sense-suport": "sessio.errorSenseSuport",
  connexio: "sessio.errorConnexioTranscripcio",
  desconegut: "sessio.errorConnexioTranscripcio",
};

function formatTemps(totalSegons: number): string {
  const minuts = Math.floor(totalSegons / 60);
  const segons = totalSegons % 60;
  return `${String(minuts).padStart(2, "0")}:${String(segons).padStart(2, "0")}`;
}

export default function SessioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { idioma, t } = useIdioma();
  const { sessio, carregat } = useRequereSessio();
  const { obtenirPacient, obtenirSessionsPacient, afegirSessio } = useDades();

  const pacient = obtenirPacient(id);
  const sessionsExistents = obtenirSessionsPacient(id);
  const numeroSessio = sessionsExistents.length + 1;
  const pacientNom = pacient
    ? `${pacient.nom} ${pacient.cognoms}`
    : t("sessio.pacientPerDefecte");

  const [isRecording, setIsRecording] = useState(false);
  const [connectant, setConnectant] = useState(false);
  const [segons, setSegons] = useState(0);
  const [transcripcioFinal, setTranscripcioFinal] = useState("");
  const [transcripcioParcial, setTranscripcioParcial] = useState("");
  const [errorTranscripcio, setErrorTranscripcio] = useState<string | null>(
    null
  );
  const [analisi, setAnalisi] = useState<AnalisiTranscripcio | null>(null);
  const [deteccionsVisibles, setDeteccionsVisibles] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [preguntesSeguentSessio] = useState(() =>
    generarPreguntesSeguentSessio()
  );

  const controladorRef = useRef<ControladorTranscripcio | null>(null);

  const data = new Date().toLocaleDateString(idioma === "es" ? "es-ES" : "ca-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Comptador de temps
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => setSegons((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Anàlisi de la IA als 15 segons de gravació (sobre el text real)
  useEffect(() => {
    if (!isRecording) return;
    if (analisi) return;
    if (segons < SEGONS_PER_ANALISI) return;
    const timeout = setTimeout(() => {
      setAnalisi(analitzarTranscripcio(transcripcioFinal));
    }, 0);
    return () => clearTimeout(timeout);
  }, [isRecording, analisi, segons, transcripcioFinal]);

  // Aparició progressiva de les deteccions, amb animació
  useEffect(() => {
    if (!analisi) return;
    if (deteccionsVisibles >= analisi.deteccionsIA.length) return;
    const timeout = setTimeout(
      () => setDeteccionsVisibles((n) => n + 1),
      INTERVAL_DETECCIO_MS
    );
    return () => clearTimeout(timeout);
  }, [analisi, deteccionsVisibles]);

  // Atura el micròfon i la connexió si es desmunta la pàgina
  useEffect(() => {
    return () => controladorRef.current?.aturar();
  }, []);

  function aturarTranscripcio() {
    controladorRef.current?.aturar();
    controladorRef.current = null;
    setTranscripcioParcial("");
  }

  async function comencarTranscripcio() {
    setErrorTranscripcio(null);
    setConnectant(true);
    try {
      const controlador = await iniciarTranscripcio({
        idioma: idioma === "es" ? "es" : "ca",
        onParcial: (text) => setTranscripcioParcial(text),
        onFinal: (text) => {
          setTranscripcioFinal((prev) => (prev ? `${prev} ${text}` : text));
          setTranscripcioParcial("");
        },
        onError: (error) => {
          setErrorTranscripcio(t(CLAU_ERROR_TRANSCRIPCIO[error.tipus]));
          setIsRecording(false);
          setConnectant(false);
          controladorRef.current = null;
        },
        onObert: () => {
          setConnectant(false);
          setIsRecording(true);
        },
      });
      controladorRef.current = controlador;
    } catch {
      // onError ja ha informat la UI; no trenquem la sessió.
      setConnectant(false);
    }
  }

  function alternarGravacio() {
    if (connectant) return;
    if (isRecording) {
      aturarTranscripcio();
      setIsRecording(false);
    } else {
      void comencarTranscripcio();
    }
  }

  function gestionarFinalitzar() {
    aturarTranscripcio();
    setIsRecording(false);
    if (!analisi) {
      const resultat = analitzarTranscripcio(transcripcioFinal);
      setAnalisi(resultat);
      setDeteccionsVisibles(resultat.deteccionsIA.length);
    }
    setMostrarModal(true);
  }

  function gestionarDesar() {
    if (!analisi) return;
    afegirSessio({
      pacientId: id,
      numero: numeroSessio,
      data: dataAvui(),
      titol: analisi.resumEstructurat.motivConsulta,
      previewResum: analisi.resumEstructurat.dolor,
      evolucio: analisi.evolucio,
      eva: analisi.eva,
      transcripcio: transcripcioFinal,
      resumEstructurat: analisi.resumEstructurat,
      deteccionsIA: analisi.deteccionsIA,
    });
    router.push(`/pacients/${id}`);
  }

  if (!carregat || !sessio) {
    return <CarregantSessio />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900">
              {pacientNom} · Sessió {numeroSessio}
            </h1>
            <p className="text-sm text-slate-400 capitalize">{data}</p>
          </div>
          <div className="flex w-full shrink-0 gap-2 sm:w-auto">
            <Link
              href={`/pacients/${id}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex-none sm:py-2"
            >
              <IconArrowLeft className="h-4 w-4" />
              {t("sessio.tornarFitxa")}
            </Link>
            <button
              type="button"
              onClick={gestionarFinalitzar}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 sm:flex-none sm:py-2"
            >
              <IconPlayerStop className="h-4 w-4" />
              {t("sessio.finalitzarSessio")}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-3">
        {/* Panel de gravació */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 transition ${
                isRecording ? "bg-red-50" : "bg-slate-50"
              }`}
            >
              <span className="relative flex h-4 w-4">
                {isRecording && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-4 w-4 rounded-full ${
                    isRecording ? "bg-red-500" : "bg-slate-300"
                  }`}
                />
              </span>
              <span
                className={`text-sm font-semibold tracking-wide ${
                  isRecording ? "text-red-700" : "text-slate-500"
                }`}
              >
                {isRecording ? t("sessio.gravant") : t("sessio.enPausa")}
              </span>
              <span className="font-mono text-lg font-semibold text-slate-900">
                {formatTemps(segons)}
              </span>
            </div>
            <button
              type="button"
              onClick={alternarGravacio}
              disabled={connectant}
              className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-2 ${
                isRecording
                  ? "bg-slate-600 hover:bg-slate-700"
                  : "bg-brand-600 hover:bg-brand-700"
              }`}
            >
              {isRecording ? (
                <IconPlayerPause className="h-4 w-4" />
              ) : (
                <IconPlayerPlay className="h-4 w-4" />
              )}
              {connectant
                ? t("sessio.connectant")
                : isRecording
                  ? t("sessio.pausarGravacio")
                  : t("sessio.iniciarGravacio")}
            </button>
          </div>

          {errorTranscripcio && (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-[13px] font-medium text-amber-800 ring-1 ring-amber-100">
              <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {errorTranscripcio}
            </p>
          )}

          <div className="mt-6">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              {t("sessio.transcripcioTempsReal")}
            </h2>
            <div className="mt-2 h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 sm:h-96">
              {!transcripcioFinal && !transcripcioParcial ? (
                <p className="text-slate-400">
                  {t("sessio.transcripcioEspera")}
                </p>
              ) : (
                <p className="whitespace-pre-wrap">
                  {transcripcioFinal}
                  {transcripcioParcial && (
                    <span className="text-slate-400">
                      {transcripcioFinal ? " " : ""}
                      {transcripcioParcial}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Columna d'anàlisi */}
        <div className="flex flex-col gap-4">
          {/* Anàlisi intel·ligent */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              {t("sessio.analisiIntelligent")}
            </h2>
            {!analisi ? (
              <p className="mt-3 text-sm text-slate-400">
                {t("sessio.analisiEspera", { segons: String(SEGONS_PER_ANALISI) })}
              </p>
            ) : (
              <>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analisi.deteccionsIA.map((deteccio, index) => (
                    <span
                      key={index}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITAT_ESTILS[deteccio.severitat]}`}
                    >
                      {etiquetaDeteccio(deteccio.tipus, idioma)}
                    </span>
                  ))}
                </div>
                <ul className="mt-4 space-y-3">
                  {analisi.deteccionsIA
                    .slice(0, deteccionsVisibles)
                    .map((deteccio, index) => {
                      const IconSeveritat =
                        SEVERITAT_ICONES[deteccio.severitat];
                      return (
                        <li
                          key={index}
                          className="flex items-start gap-3 fade-in-up"
                        >
                          <span
                            className={`mt-0.5 shrink-0 rounded-full p-1 ${SEVERITAT_ESTILS[deteccio.severitat]}`}
                          >
                            <IconSeveritat className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {etiquetaDeteccio(deteccio.tipus, idioma)}
                            </p>
                            <p className="text-sm text-slate-600">
                              {deteccio.descripcio}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </>
            )}
          </section>

          {/* Resum estructurat */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              {t("comu.resumEstructurat")}
            </h2>
            {!analisi ? (
              <p className="mt-3 text-sm text-slate-400">
                {t("sessio.resumEspera")}
              </p>
            ) : (
              <dl className="mt-3 space-y-3 text-sm fade-in-up">
                <div>
                  <dt className="font-medium text-slate-900">
                    {t("comu.motiuConsulta")}
                  </dt>
                  <dd className="mt-0.5 text-slate-600">
                    {analisi.resumEstructurat.motivConsulta}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">{t("comu.dolor")}</dt>
                  <dd className="mt-0.5 text-slate-600">
                    {analisi.resumEstructurat.dolor}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">
                    {t("comu.aspecteEmocional")}
                  </dt>
                  <dd className="mt-0.5 text-slate-600">
                    {analisi.resumEstructurat.aspecteEmocional}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">
                    {t("comu.valoracioFuncional")}
                  </dt>
                  <dd className="mt-0.5 text-slate-600">
                    {analisi.resumEstructurat.valoracioFuncional}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-red-700">{t("comu.pendents")}</dt>
                  <dd className="mt-0.5">
                    <ul className="list-inside list-disc space-y-1 text-red-600">
                      {analisi.resumEstructurat.pendents.map(
                        (pendent, index) => <li key={index}>{pendent}</li>
                      )}
                    </ul>
                  </dd>
                </div>
              </dl>
            )}
          </section>

          {/* Preguntes per a la propera sessió */}
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900">
              <IconBulb className="h-4 w-4 text-brand-600" />
              {t("sessio.preguntesSeguentSessio")}
            </h2>
            <ul className="mt-3 space-y-2">
              {preguntesSeguentSessio.map((pregunta, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <IconMessageQuestion className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                  {pregunta}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Modal de confirmació de finalització */}
      {mostrarModal && analisi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
            <div className="flex items-center gap-2">
              <IconDeviceFloppy className="h-5 w-5 text-brand-600" />
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                {t("sessio.resumFinalSessio")}
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {pacientNom} · Sessió {numeroSessio} · {t("sessio.durada")}{" "}
              {formatTemps(segons)}
            </p>

            <blockquote className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-800 italic">
              <IconQuote className="mt-0.5 h-4 w-4 shrink-0" />
              &quot;{analisi.citaDestacada}&quot;
            </blockquote>

            <dl className="mt-4 max-h-64 space-y-3 overflow-y-auto text-sm">
              <div>
                <dt className="font-medium text-slate-900">
                  {t("comu.motiuConsulta")}
                </dt>
                <dd className="mt-0.5 text-slate-600">
                  {analisi.resumEstructurat.motivConsulta}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">{t("comu.dolor")}</dt>
                <dd className="mt-0.5 text-slate-600">
                  {analisi.resumEstructurat.dolor}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">
                  {t("comu.aspecteEmocional")}
                </dt>
                <dd className="mt-0.5 text-slate-600">
                  {analisi.resumEstructurat.aspecteEmocional}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">
                  {t("comu.valoracioFuncional")}
                </dt>
                <dd className="mt-0.5 text-slate-600">
                  {analisi.resumEstructurat.valoracioFuncional}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-red-700">{t("comu.pendents")}</dt>
                <dd className="mt-0.5">
                  <ul className="list-inside list-disc space-y-1 text-red-600">
                    {analisi.resumEstructurat.pendents.map(
                      (pendent, index) => <li key={index}>{pendent}</li>
                    )}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {analisi.keywordsEmpoderament.map((keyword, index) => (
                <span
                  key={index}
                  className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 ring-1 ring-inset ring-brand-600/20"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:py-2"
              >
                <IconPencil className="h-4 w-4" />
                {t("sessio.continuarEditant")}
              </button>
              <button
                type="button"
                onClick={gestionarDesar}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 sm:py-2"
              >
                <IconDeviceFloppy className="h-4 w-4" />
                {t("sessio.desarSessio")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
