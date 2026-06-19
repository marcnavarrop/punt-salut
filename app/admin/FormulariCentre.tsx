"use client";

import { useState, type FormEvent } from "react";
import { IconX } from "@tabler/icons-react";
import type { Centre } from "@/lib/centres";
import { useIdioma } from "@/lib/i18n-context";

interface FormulariCentreProps {
  titol: string;
  etiquetaBoto: string;
  valorsInicials?: Centre;
  slugsExistents: string[];
  onTancar: () => void;
  onDesar: (dades: Centre) => void;
}

const ESTIL_CAMP =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";

function generarSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function FormulariCentre({
  titol,
  etiquetaBoto,
  valorsInicials,
  slugsExistents,
  onTancar,
  onDesar,
}: FormulariCentreProps) {
  const { t } = useIdioma();
  const esEdicio = Boolean(valorsInicials);
  const [nom, setNom] = useState(valorsInicials?.nom ?? "");
  const [slug, setSlug] = useState(valorsInicials?.id ?? "");
  const [slugTocat, setSlugTocat] = useState(esEdicio);
  const [colorPrincipal, setColorPrincipal] = useState(
    valorsInicials?.colorPrincipal ?? "#16a34a"
  );
  const [logoUrl, setLogoUrl] = useState(valorsInicials?.logoUrl ?? "");
  const [error, setError] = useState("");

  function gestionarCanviNom(valor: string) {
    setNom(valor);
    if (!slugTocat) setSlug(generarSlug(valor));
  }

  function gestionarEnviament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const slugNet = generarSlug(slug);
    if (!slugNet) {
      setError(t("admin.slug"));
      return;
    }
    if (!esEdicio && slugsExistents.includes(slugNet)) {
      setError(t("admin.slugDuplicat"));
      return;
    }
    setError("");
    onDesar({
      id: slugNet,
      nom: nom.trim(),
      logo: nom.trim().slice(0, 2).toUpperCase(),
      logoUrl: logoUrl.trim() || undefined,
      colorPrincipal,
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
          <div>
            <label className={ESTIL_ETIQUETA}>{t("configuracio.nomCentre")}</label>
            <input
              required
              type="text"
              value={nom}
              onChange={(event) => gestionarCanviNom(event.target.value)}
              className={ESTIL_CAMP}
            />
          </div>

          <div>
            <label className={ESTIL_ETIQUETA}>{t("admin.slug")}</label>
            <input
              required
              type="text"
              value={slug}
              disabled={esEdicio}
              onChange={(event) => {
                setSlugTocat(true);
                setSlug(generarSlug(event.target.value));
              }}
              className={`${ESTIL_CAMP} ${esEdicio ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""}`}
            />
            <p className="mt-1 text-[11px] text-slate-400">{t("admin.slugAjuda")}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={ESTIL_ETIQUETA}>{t("admin.colorPrincipal")}</label>
              <input
                type="color"
                value={colorPrincipal}
                onChange={(event) => setColorPrincipal(event.target.value)}
                className="mt-1 h-[34px] w-full rounded-lg border border-slate-200 bg-white px-1"
              />
            </div>
            <div>
              <label className={ESTIL_ETIQUETA}>{t("admin.logoUrlOpcional")}</label>
              <input
                type="text"
                value={logoUrl}
                placeholder="/logos/exemple.png"
                onChange={(event) => setLogoUrl(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] font-medium text-red-700 ring-1 ring-red-100">
              {error}
            </p>
          )}

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
