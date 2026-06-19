"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import {
  IconActivity,
  IconAlertCircle,
  IconLock,
  IconLogout,
  IconMail,
  IconPencil,
  IconPlus,
  IconStethoscope,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { useCentres, type Centre } from "@/lib/centres";
import { useConfig } from "@/lib/config-context";
import { useCredencials } from "@/lib/auth-context";
import { useTotesDades } from "@/lib/dades-context";
import { useIdioma } from "@/lib/i18n-context";
import { CarregantSessio } from "@/lib/auth-guard";
import { LogoCentre } from "@/components/LogoCentre";
import { ModalConfirmacio } from "@/components/ModalConfirmacio";
import type { Professional } from "@/types";
import { FormulariCentre } from "./FormulariCentre";
import {
  FormulariProfessionalAdmin,
  type DadesProfessionalAdmin,
} from "./FormulariProfessionalAdmin";

const CLAU_ADMIN_SESSIO = "voltamed.admin-sessio";
const ADMIN_EMAIL = "admin@voltamed.com";
const ADMIN_CONTRASENYA = "admin1234";

let sessioAdminClient: boolean | undefined = undefined;
const subscriptors = new Set<() => void>();

function carregarSessioAdminClient(): boolean {
  if (sessioAdminClient !== undefined) return sessioAdminClient;
  try {
    sessioAdminClient = localStorage.getItem(CLAU_ADMIN_SESSIO) === "true";
  } catch {
    sessioAdminClient = false;
  }
  return sessioAdminClient;
}

function actualitzarSessioAdmin(actiu: boolean) {
  sessioAdminClient = actiu;
  try {
    if (actiu) {
      localStorage.setItem(CLAU_ADMIN_SESSIO, "true");
    } else {
      localStorage.removeItem(CLAU_ADMIN_SESSIO);
    }
  } catch {
    // localStorage no disponible
  }
  subscriptors.forEach((callback) => callback());
}

function subscriure(callback: () => void) {
  subscriptors.add(callback);
  return () => subscriptors.delete(callback);
}

function obtenirSnapshot(): boolean | undefined {
  return carregarSessioAdminClient();
}

function obtenirSnapshotServidor(): boolean | undefined {
  return undefined;
}

const ESTIL_CAMP =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";

export default function AdminPage() {
  const { t } = useIdioma();
  const { centres, afegirCentre, actualitzarCentre, eliminarCentre } =
    useCentres();
  const {
    professionals,
    afegirProfessional,
    actualitzarProfessional,
    eliminarProfessional,
  } = useConfig();
  const { afegirCredencial, actualitzarCredencial, eliminarCredencial } =
    useCredencials();
  const { pacients } = useTotesDades();

  const sessioRaw = useSyncExternalStore(
    subscriure,
    obtenirSnapshot,
    obtenirSnapshotServidor
  );
  const [email, setEmail] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [error, setError] = useState("");

  const [centreFormulari, setCentreFormulari] = useState<
    "nou" | Centre | null
  >(null);
  const [centreEliminar, setCentreEliminar] = useState<Centre | null>(null);
  const [professionalFormulari, setProfessionalFormulari] = useState<{
    centreId: string;
    professional?: Professional;
  } | null>(null);
  const [professionalEliminar, setProfessionalEliminar] =
    useState<Professional | null>(null);

  const carregat = sessioRaw !== undefined;
  const sessioActiva = sessioRaw === true;

  if (!carregat) {
    return <CarregantSessio />;
  }

  function gestionarEnviament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      contrasenya === ADMIN_CONTRASENYA
    ) {
      setError("");
      actualitzarSessioAdmin(true);
    } else {
      setError(t("login.errorCredencials"));
    }
  }

  function gestionarDesarProfessional(centreId: string, dades: DadesProfessionalAdmin) {
    const usuari = dades.email.split("@")[0].toLowerCase();
    if (professionalFormulari?.professional) {
      const id = professionalFormulari.professional.id;
      actualitzarProfessional(id, {
        nom: dades.nom,
        cognoms: dades.cognoms,
        email: dades.email,
        especialitat: dades.especialitat,
        centreId,
      });
      actualitzarCredencial(id, {
        usuari,
        ...(dades.contrasenya ? { contrasenya: dades.contrasenya } : {}),
      });
    } else {
      const nou = afegirProfessional({
        nom: dades.nom,
        cognoms: dades.cognoms,
        email: dades.email,
        especialitat: dades.especialitat,
        centreId,
      });
      afegirCredencial(nou.id, usuari, dades.contrasenya ?? "");
    }
    setProfessionalFormulari(null);
  }

  function gestionarEliminarProfessional(professional: Professional) {
    eliminarProfessional(professional.id);
    eliminarCredencial(professional.id);
    setProfessionalEliminar(null);
  }

  if (!sessioActiva) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-2.5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
              <IconActivity className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-[17px] font-semibold tracking-tight text-slate-900">
                Voltamed
              </p>
              <p className="text-[13px] text-slate-400">
                {t("admin.iniciaSessio")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="text-[15px] font-semibold tracking-tight text-slate-900">
              {t("admin.iniciaSessio")}
            </h1>

            <form onSubmit={gestionarEnviament} className="mt-4 space-y-3">
              <div>
                <label className={ESTIL_ETIQUETA}>{t("comu.email")}</label>
                <div className="relative">
                  <IconMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="text"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@voltamed.com"
                    className={ESTIL_CAMP}
                  />
                </div>
              </div>

              <div>
                <label className={ESTIL_ETIQUETA}>
                  {t("login.contrasenya")}
                </label>
                <div className="relative">
                  <IconLock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="password"
                    autoComplete="current-password"
                    value={contrasenya}
                    onChange={(event) => setContrasenya(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    placeholder="••••••"
                    className={ESTIL_CAMP}
                  />
                </div>
              </div>

              {error && (
                <p className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700 ring-1 ring-red-100">
                  <IconAlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
              >
                {t("login.entrar")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
              {t("admin.titol")}
            </h1>
            <p className="text-[13px] text-slate-400">{t("admin.subtitol")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCentreFormulari("nou")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              <IconPlus className="h-[15px] w-[15px]" />
              {t("admin.nouCentre")}
            </button>
            <button
              type="button"
              onClick={() => actualitzarSessioAdmin(false)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <IconLogout className="h-[15px] w-[15px]" />
              {t("sidebar.tancarSessio")}
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {centres.map((centre) => {
            const professionalsCentre = professionals.filter(
              (professional) => professional.centreId === centre.id
            );
            const pacientsCentre = pacients.filter(
              (pacient) => pacient.centreId === centre.id
            );

            return (
              <div
                key={centre.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <LogoCentre
                      centre={centre}
                      className="h-10 w-10 shrink-0 rounded-lg text-[13px] font-semibold"
                    />
                    <div className="min-w-0 leading-tight">
                      <p className="text-[14px] font-semibold text-slate-900">
                        {centre.nom}
                      </p>
                      <p className="text-[12px] text-slate-400">
                        {centre.id} · {pacientsCentre.length} {t("admin.pacients")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCentreFormulari(centre)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      title={t("comu.editar")}
                    >
                      <IconPencil className="h-[15px] w-[15px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCentreEliminar(centre)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      title={t("comu.eliminar")}
                    >
                      <IconTrash className="h-[15px] w-[15px]" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <IconUsers className="h-4 w-4 text-brand-500" />
                      <h2 className="text-[13px] font-semibold tracking-tight text-slate-700">
                        {t("admin.professionals")}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setProfessionalFormulari({ centreId: centre.id })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      <IconPlus className="h-[13px] w-[13px]" />
                      {t("admin.nouProfessionalCentre")}
                    </button>
                  </div>

                  {professionalsCentre.length === 0 ? (
                    <p className="text-[13px] text-slate-400">
                      {t("admin.capProfessional")}
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {professionalsCentre.map((professional) => (
                        <div
                          key={professional.id}
                          className="flex flex-wrap items-center justify-between gap-3 py-2.5"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-[12px] font-semibold text-white">
                              {professional.nom[0]}
                              {professional.cognoms[0]}
                            </div>
                            <div className="min-w-0 leading-tight">
                              <p className="text-[13px] font-medium text-slate-900">
                                {professional.nom} {professional.cognoms}
                              </p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-3 text-[12px] text-slate-400">
                                <span className="inline-flex items-center gap-1">
                                  <IconMail className="h-3 w-3" />
                                  {professional.email}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                  <IconStethoscope className="h-3 w-3" />
                                  {professional.especialitat}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                setProfessionalFormulari({
                                  centreId: centre.id,
                                  professional,
                                })
                              }
                              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              title={t("comu.editar")}
                            >
                              <IconPencil className="h-[15px] w-[15px]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProfessionalEliminar(professional)}
                              className="grid h-8 w-8 place-items-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                              title={t("comu.eliminar")}
                            >
                              <IconTrash className="h-[15px] w-[15px]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {centreFormulari && (
        <FormulariCentre
          titol={
            centreFormulari === "nou" ? t("admin.nouCentre") : t("admin.editarCentre")
          }
          etiquetaBoto={
            centreFormulari === "nou" ? t("admin.crearCentre") : t("comu.desarCanvis")
          }
          valorsInicials={
            centreFormulari === "nou" ? undefined : centreFormulari
          }
          slugsExistents={centres.map((c) => c.id)}
          onTancar={() => setCentreFormulari(null)}
          onDesar={(dades) => {
            if (centreFormulari === "nou") {
              afegirCentre(dades);
            } else {
              actualitzarCentre(dades.id, {
                nom: dades.nom,
                logo: dades.logo,
                logoUrl: dades.logoUrl,
                colorPrincipal: dades.colorPrincipal,
              });
            }
            setCentreFormulari(null);
          }}
        />
      )}

      {centreEliminar && (
        <ModalConfirmacio
          titol={t("admin.confirmarEliminarCentreTitol")}
          missatge={t("admin.confirmarEliminarCentreMissatge", {
            nom: centreEliminar.nom,
            pacients: String(
              pacients.filter((p) => p.centreId === centreEliminar.id).length
            ),
            professionals: String(
              professionals.filter((p) => p.centreId === centreEliminar.id)
                .length
            ),
          })}
          etiquetaConfirmar={t("comu.eliminar")}
          etiquetaCancelar={t("comu.cancelar")}
          onCancelar={() => setCentreEliminar(null)}
          onConfirmar={() => {
            eliminarCentre(centreEliminar.id);
            setCentreEliminar(null);
          }}
        />
      )}

      {professionalFormulari && (
        <FormulariProfessionalAdmin
          titol={
            professionalFormulari.professional
              ? t("configuracio.editarProfessional")
              : t("configuracio.nouProfessional")
          }
          etiquetaBoto={
            professionalFormulari.professional
              ? t("comu.desarCanvis")
              : t("configuracio.crearProfessional")
          }
          valorsInicials={professionalFormulari.professional}
          onTancar={() => setProfessionalFormulari(null)}
          onDesar={(dades) =>
            gestionarDesarProfessional(professionalFormulari.centreId, dades)
          }
        />
      )}

      {professionalEliminar && (
        <ModalConfirmacio
          titol={t("configuracio.confirmarEliminarTitol")}
          missatge={t("admin.confirmarEliminarProfessionalMissatge", {
            nom: `${professionalEliminar.nom} ${professionalEliminar.cognoms}`,
          })}
          etiquetaConfirmar={t("comu.eliminar")}
          etiquetaCancelar={t("comu.cancelar")}
          onCancelar={() => setProfessionalEliminar(null)}
          onConfirmar={() => gestionarEliminarProfessional(professionalEliminar)}
        />
      )}
    </div>
  );
}
