"use client";

import { useState, type ChangeEvent } from "react";
import { IconAlertCircle, IconCircleCheck, IconUpload, IconUserCircle } from "@tabler/icons-react";
import type { Professional } from "@/types";
import { useAuth, useCredencials } from "@/lib/auth-context";
import { useConfig } from "@/lib/config-context";
import { useIdioma } from "@/lib/i18n-context";

interface PerfilProfessionalProps {
  professional: Professional;
}

const MIDA_MAXIMA_FOTO = 2 * 1024 * 1024; // 2 MB

const ESTIL_CAMP =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";

export function PerfilProfessional({ professional }: PerfilProfessionalProps) {
  const { t } = useIdioma();
  const { actualitzarProfessional } = useConfig();
  const { actualitzarCredencial } = useCredencials();
  const { actualitzarPerfilSessio } = useAuth();

  const [nom, setNom] = useState(professional.nom);
  const [cognoms, setCognoms] = useState(professional.cognoms);
  const [especialitat, setEspecialitat] = useState(professional.especialitat);
  const [fotoUrl, setFotoUrl] = useState(professional.fotoUrl ?? "");
  const [errorFoto, setErrorFoto] = useState("");
  const [confirmacioDades, setConfirmacioDades] = useState(false);

  const [contrasenyaNova, setContrasenyaNova] = useState("");
  const [confirmarContrasenya, setConfirmarContrasenya] = useState("");
  const [errorContrasenya, setErrorContrasenya] = useState("");
  const [confirmacioContrasenya, setConfirmacioContrasenya] = useState(false);

  const haCanviatDades =
    nom.trim() !== professional.nom ||
    cognoms.trim() !== professional.cognoms ||
    especialitat.trim() !== professional.especialitat ||
    fotoUrl !== (professional.fotoUrl ?? "");

  function gestionarPujarFoto(event: ChangeEvent<HTMLInputElement>) {
    const fitxer = event.target.files?.[0];
    if (!fitxer) return;
    if (fitxer.size > MIDA_MAXIMA_FOTO) {
      setErrorFoto(t("configuracio.fotoMassaGran"));
      return;
    }
    setErrorFoto("");
    const lector = new FileReader();
    lector.onload = () => setFotoUrl(lector.result as string);
    lector.readAsDataURL(fitxer);
  }

  function gestionarDesarDades() {
    const dades = {
      nom: nom.trim(),
      cognoms: cognoms.trim(),
      especialitat: especialitat.trim(),
      email: professional.email,
      centreId: professional.centreId,
      fotoUrl: fotoUrl || undefined,
    };
    actualitzarProfessional(professional.id, dades);
    actualitzarPerfilSessio(dades);
    setConfirmacioDades(true);
    setTimeout(() => setConfirmacioDades(false), 2500);
  }

  function gestionarCanviarContrasenya() {
    if (!contrasenyaNova || contrasenyaNova.length < 4) {
      setErrorContrasenya(t("configuracio.contrasenyaMassaCurta"));
      return;
    }
    if (contrasenyaNova !== confirmarContrasenya) {
      setErrorContrasenya(t("configuracio.contrasenyesNoCoincideixen"));
      return;
    }
    setErrorContrasenya("");
    actualitzarCredencial(professional.id, { contrasenya: contrasenyaNova });
    setContrasenyaNova("");
    setConfirmarContrasenya("");
    setConfirmacioContrasenya(true);
    setTimeout(() => setConfirmacioContrasenya(false), 2500);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <IconUserCircle className="h-4 w-4 text-brand-500" />
        <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
          {t("configuracio.elMeuPerfil")}
        </h2>
      </div>

      <div className="max-w-md space-y-4">
        <div>
          <label className={ESTIL_ETIQUETA}>{t("configuracio.fotoPerfil")}</label>
          <div className="mt-1 flex items-center gap-3">
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt={`${nom} ${cognoms}`}
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                {nom[0]}
                {cognoms[0]}
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50">
              <IconUpload className="h-[15px] w-[15px]" />
              {t("configuracio.pujarFoto")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={gestionarPujarFoto}
              />
            </label>
          </div>
          {errorFoto && <p className="mt-1 text-[12px] text-red-600">{errorFoto}</p>}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={ESTIL_ETIQUETA}>{t("comu.nom")}</label>
            <input
              type="text"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              className={ESTIL_CAMP}
            />
          </div>
          <div>
            <label className={ESTIL_ETIQUETA}>{t("comu.cognoms")}</label>
            <input
              type="text"
              value={cognoms}
              onChange={(event) => setCognoms(event.target.value)}
              className={ESTIL_CAMP}
            />
          </div>
        </div>

        <div>
          <label className={ESTIL_ETIQUETA}>{t("configuracio.especialitat")}</label>
          <input
            type="text"
            value={especialitat}
            onChange={(event) => setEspecialitat(event.target.value)}
            className={ESTIL_CAMP}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!haCanviatDades || !nom.trim() || !cognoms.trim()}
            onClick={gestionarDesarDades}
            className="rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("comu.desarCanvis")}
          </button>
          {confirmacioDades && (
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-700">
              <IconCircleCheck className="h-4 w-4" />
              {t("configuracio.canvisDesats")}
            </span>
          )}
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className={ESTIL_ETIQUETA}>{t("configuracio.canviarContrasenya")}</p>
          <div className="mt-1.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={ESTIL_ETIQUETA}>{t("admin.contrasenya")}</label>
              <input
                type="password"
                value={contrasenyaNova}
                onChange={(event) => setContrasenyaNova(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
            <div>
              <label className={ESTIL_ETIQUETA}>
                {t("configuracio.confirmarContrasenya")}
              </label>
              <input
                type="password"
                value={confirmarContrasenya}
                onChange={(event) => setConfirmarContrasenya(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
          </div>

          {errorContrasenya && (
            <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700 ring-1 ring-red-100">
              <IconAlertCircle className="h-4 w-4 shrink-0" />
              {errorContrasenya}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={!contrasenyaNova || !confirmarContrasenya}
              onClick={gestionarCanviarContrasenya}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("configuracio.actualitzarContrasenya")}
            </button>
            {confirmacioContrasenya && (
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-700">
                <IconCircleCheck className="h-4 w-4" />
                {t("configuracio.contrasenyaActualitzada")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
