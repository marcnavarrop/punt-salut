"use client";

import { useState, type FormEvent } from "react";
import { IconX } from "@tabler/icons-react";
import type { Professional } from "@/types";
import { useIdioma } from "@/lib/i18n-context";

export interface DadesProfessionalAdmin {
  nom: string;
  cognoms: string;
  email: string;
  especialitat: string;
  contrasenya?: string;
}

interface FormulariProfessionalAdminProps {
  titol: string;
  etiquetaBoto: string;
  valorsInicials?: Professional;
  onTancar: () => void;
  onDesar: (dades: DadesProfessionalAdmin) => void;
}

const ESTIL_CAMP =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";

export function FormulariProfessionalAdmin({
  titol,
  etiquetaBoto,
  valorsInicials,
  onTancar,
  onDesar,
}: FormulariProfessionalAdminProps) {
  const { t } = useIdioma();
  const esEdicio = Boolean(valorsInicials);
  const [nom, setNom] = useState(valorsInicials?.nom ?? "");
  const [cognoms, setCognoms] = useState(valorsInicials?.cognoms ?? "");
  const [email, setEmail] = useState(valorsInicials?.email ?? "");
  const [especialitat, setEspecialitat] = useState(
    valorsInicials?.especialitat ?? ""
  );
  const [contrasenya, setContrasenya] = useState("");

  function gestionarEnviament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onDesar({
      nom: nom.trim(),
      cognoms: cognoms.trim(),
      email: email.trim(),
      especialitat: especialitat.trim(),
      contrasenya: contrasenya || undefined,
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
            <label className={ESTIL_ETIQUETA}>{t("comu.email")}</label>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={ESTIL_CAMP}
            />
          </div>

          <div>
            <label className={ESTIL_ETIQUETA}>
              {t("configuracio.especialitat")}
            </label>
            <input
              required
              type="text"
              value={especialitat}
              onChange={(event) => setEspecialitat(event.target.value)}
              className={ESTIL_CAMP}
            />
          </div>

          <div>
            <label className={ESTIL_ETIQUETA}>
              {esEdicio
                ? t("admin.contrasenyaNovaOpcional")
                : t("admin.contrasenya")}
            </label>
            <input
              required={!esEdicio}
              type="password"
              value={contrasenya}
              onChange={(event) => setContrasenya(event.target.value)}
              className={ESTIL_CAMP}
            />
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
