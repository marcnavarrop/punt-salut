"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import {
  IconActivity,
  IconAlertCircle,
  IconLock,
  IconLogout,
  IconMail,
  IconUsers,
} from "@tabler/icons-react";
import { useCentres } from "@/lib/centres";
import { useConfig } from "@/lib/config-context";
import { useIdioma } from "@/lib/i18n-context";
import { CarregantSessio } from "@/lib/auth-guard";

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
  const { centres } = useCentres();
  const { professionals } = useConfig();
  const sessioRaw = useSyncExternalStore(
    subscriure,
    obtenirSnapshot,
    obtenirSnapshotServidor
  );
  const [email, setEmail] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [error, setError] = useState("");

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
              {t("admin.titol")}
            </h1>
            <p className="text-[13px] text-slate-400">{t("admin.subtitol")}</p>
          </div>
          <button
            type="button"
            onClick={() => actualitzarSessioAdmin(false)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <IconLogout className="h-[15px] w-[15px]" />
            {t("sidebar.tancarSessio")}
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {centres.map((centre) => {
            const professionalsCentre = professionals.filter(
              (professional) => professional.centreId === centre.id
            );

            return (
              <div
                key={centre.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[13px] font-semibold text-white"
                    style={{ backgroundColor: centre.colorPrincipal }}
                  >
                    {centre.logo}
                  </div>
                  <div className="leading-tight">
                    <p className="text-[14px] font-semibold text-slate-900">
                      {centre.nom}
                    </p>
                    <p className="text-[12px] text-slate-400">{centre.id}</p>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="mb-2 flex items-center gap-2">
                    <IconUsers className="h-4 w-4 text-brand-500" />
                    <h2 className="text-[13px] font-semibold tracking-tight text-slate-700">
                      {t("admin.professionals")}
                    </h2>
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
                          className="flex items-center gap-3 py-2.5"
                        >
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-[12px] font-semibold text-white">
                            {professional.nom[0]}
                            {professional.cognoms[0]}
                          </div>
                          <div className="leading-tight">
                            <p className="text-[13px] font-medium text-slate-900">
                              {professional.nom} {professional.cognoms}
                            </p>
                            <p className="text-[12px] text-slate-400">
                              {professional.email} ·{" "}
                              {professional.especialitat}
                            </p>
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
    </div>
  );
}
