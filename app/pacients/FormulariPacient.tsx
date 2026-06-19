"use client";

import { useState, type FormEvent } from "react";
import { IconX } from "@tabler/icons-react";
import type { FasePacient, Pacient } from "@/types";
import { etiquetaFase } from "@/lib/etiquetes";
import { dataAvui } from "@/lib/data-utils";
import { useConfig } from "@/lib/config-context";
import { useIdioma } from "@/lib/i18n-context";

interface FormulariPacientProps {
  titol: string;
  etiquetaBoto: string;
  centreId: string;
  valorsInicials?: Pacient;
  onTancar: () => void;
  onDesar: (dades: Omit<Pacient, "id" | "centreId">) => void;
}

const FASES: FasePacient[] = ["agut", "subagut", "cronic"];

const ESTIL_CAMP =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";

export function FormulariPacient({
  titol,
  etiquetaBoto,
  centreId,
  valorsInicials,
  onTancar,
  onDesar,
}: FormulariPacientProps) {
  const { idioma, t } = useIdioma();
  const { diagnostics, frequencies } = useConfig();
  const [nom, setNom] = useState(valorsInicials?.nom ?? "");
  const [cognoms, setCognoms] = useState(valorsInicials?.cognoms ?? "");
  const [dataNaixement, setDataNaixement] = useState(
    valorsInicials?.dataNaixement ?? ""
  );
  const [telefon, setTelefon] = useState(valorsInicials?.telefon ?? "");
  const [email, setEmail] = useState(valorsInicials?.email ?? "");
  const [diagnostic, setDiagnostic] = useState(
    valorsInicials?.diagnostic ?? ""
  );
  const [fase, setFase] = useState<FasePacient>(
    valorsInicials?.fase ?? "agut"
  );
  const [profesionalAssignat, setProfesionalAssignat] = useState(
    valorsInicials?.profesionalAssignat ?? "Marc Soler, fisioterapeuta"
  );
  const [frequencia, setFrequencia] = useState(
    valorsInicials?.frequencia ?? ""
  );

  const diagnosticsCentre = diagnostics.filter((d) => d.centreId === centreId);
  const frequenciesCentre = frequencies.filter((f) => f.centreId === centreId);

  function gestionarEnviament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onDesar({
      nom: nom.trim(),
      cognoms: cognoms.trim(),
      dataNaixement,
      telefon: telefon.trim(),
      email: email.trim(),
      diagnostic: diagnostic.trim(),
      fase,
      profesionalAssignat: profesionalAssignat.trim(),
      estat: valorsInicials?.estat ?? "actiu",
      dataInici: valorsInicials?.dataInici ?? dataAvui(),
      properaSessio: valorsInicials?.properaSessio,
      frequencia: frequencia || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            {titol}
          </h2>
          <button
            type="button"
            onClick={onTancar}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={gestionarEnviament} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={ESTIL_ETIQUETA}>{t("comu.nom")}</label>
              <input
                required
                type="text"
                value={nom}
                onChange={(event) => setNom(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
            <div>
              <label className={ESTIL_ETIQUETA}>{t("comu.cognoms")}</label>
              <input
                required
                type="text"
                value={cognoms}
                onChange={(event) => setCognoms(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
          </div>

          <div>
            <label className={ESTIL_ETIQUETA}>{t("comu.dataNaixement")}</label>
            <input
              required
              type="date"
              value={dataNaixement}
              onChange={(event) => setDataNaixement(event.target.value)}
              className={ESTIL_CAMP}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={ESTIL_ETIQUETA}>{t("comu.telefon")}</label>
              <input
                required
                type="tel"
                value={telefon}
                onChange={(event) => setTelefon(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
            <div>
              <label className={ESTIL_ETIQUETA}>{t("comu.email")}</label>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
          </div>

          <div>
            <label className={ESTIL_ETIQUETA}>{t("pacientDetall.diagnostic")}</label>
            <input
              required
              type="text"
              list="diagnostics-habituals"
              value={diagnostic}
              onChange={(event) => setDiagnostic(event.target.value)}
              className={ESTIL_CAMP}
            />
            <datalist id="diagnostics-habituals">
              {diagnosticsCentre.map((d) => (
                <option key={d.id} value={d.nom} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={ESTIL_ETIQUETA}>{t("formulariPacient.faseClinica")}</label>
              <select
                value={fase}
                onChange={(event) =>
                  setFase(event.target.value as FasePacient)
                }
                className={ESTIL_CAMP}
              >
                {FASES.map((f) => (
                  <option key={f} value={f}>
                    {etiquetaFase(f, idioma)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={ESTIL_ETIQUETA}>
                {t("formulariPacient.professionalAssignat")}
              </label>
              <input
                required
                type="text"
                value={profesionalAssignat}
                onChange={(event) =>
                  setProfesionalAssignat(event.target.value)
                }
                className={ESTIL_CAMP}
              />
            </div>
          </div>

          <div>
            <label className={ESTIL_ETIQUETA}>{t("formulariPacient.frequencia")}</label>
            <select
              value={frequencia}
              onChange={(event) => setFrequencia(event.target.value)}
              className={ESTIL_CAMP}
            >
              <option value="">{t("formulariPacient.senseFrequencia")}</option>
              {frequenciesCentre.map((f) => (
                <option key={f.id} value={f.nom}>
                  {f.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onTancar}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {t("comu.cancelar")}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              {etiquetaBoto}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
