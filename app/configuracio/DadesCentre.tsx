"use client";

import { useState, type ChangeEvent } from "react";
import { IconBuildingHospital, IconUpload } from "@tabler/icons-react";
import { useCentres, type Centre } from "@/lib/centres";
import { useIdioma } from "@/lib/i18n-context";
import { LogoCentre } from "@/components/LogoCentre";

interface DadesCentreProps {
  centre: Centre;
}

const MIDA_MAXIMA_LOGO = 2 * 1024 * 1024; // 2 MB

const PALETA_COLORS = [
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#dc2626",
  "#0d9488",
  "#475569",
];

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";

export function DadesCentre({ centre }: DadesCentreProps) {
  const { t } = useIdioma();
  const { actualitzarCentre } = useCentres();

  const [nom, setNom] = useState(centre.nom);
  const [logoUrl, setLogoUrl] = useState(centre.logoUrl ?? "");
  const [colorPrincipal, setColorPrincipal] = useState(centre.colorPrincipal);
  const [horari, setHorari] = useState(centre.horari ?? "");
  const [errorLogo, setErrorLogo] = useState("");

  const haCanviat =
    nom.trim() !== centre.nom ||
    logoUrl !== (centre.logoUrl ?? "") ||
    colorPrincipal !== centre.colorPrincipal ||
    horari.trim() !== (centre.horari ?? "");

  function gestionarPujarLogo(event: ChangeEvent<HTMLInputElement>) {
    const fitxer = event.target.files?.[0];
    if (!fitxer) return;
    if (fitxer.size > MIDA_MAXIMA_LOGO) {
      setErrorLogo(t("configuracio.logoMassaGran"));
      return;
    }
    setErrorLogo("");
    const lector = new FileReader();
    lector.onload = () => setLogoUrl(lector.result as string);
    lector.readAsDataURL(fitxer);
  }

  function gestionarDesar() {
    actualitzarCentre(centre.id, {
      nom: nom.trim(),
      logo: centre.logo,
      logoUrl: logoUrl || undefined,
      colorPrincipal,
      horari: horari.trim() || undefined,
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <IconBuildingHospital className="h-4 w-4 text-brand-500" />
        <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
          {t("configuracio.dadesCentre")}
        </h2>
      </div>

      <div className="max-w-md space-y-4">
        <div>
          <label className={ESTIL_ETIQUETA}>{t("configuracio.nomCentre")}</label>
          <input
            type="text"
            value={nom}
            onChange={(event) => setNom(event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <div>
          <label className={ESTIL_ETIQUETA}>{t("configuracio.logoCentre")}</label>
          <div className="mt-1 flex items-center gap-3">
            <LogoCentre
              centre={{ ...centre, logoUrl }}
              className="h-12 w-12 shrink-0 rounded-lg text-sm font-semibold"
            />
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50">
              <IconUpload className="h-[15px] w-[15px]" />
              {t("configuracio.pujarLogo")}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={gestionarPujarLogo}
              />
            </label>
          </div>
          {errorLogo && (
            <p className="mt-1 text-[12px] text-red-600">{errorLogo}</p>
          )}
        </div>

        <div>
          <label className={ESTIL_ETIQUETA}>{t("configuracio.colorCentre")}</label>
          <div className="mt-1.5 flex items-center gap-2">
            {PALETA_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setColorPrincipal(color)}
                style={{ backgroundColor: color }}
                className={`h-7 w-7 shrink-0 rounded-full ring-2 ring-offset-2 transition ${
                  colorPrincipal.toLowerCase() === color.toLowerCase()
                    ? "ring-slate-400"
                    : "ring-transparent hover:ring-slate-200"
                }`}
                aria-label={color}
              />
            ))}
            <input
              type="color"
              value={colorPrincipal}
              onChange={(event) => setColorPrincipal(event.target.value)}
              className="h-7 w-7 shrink-0 cursor-pointer rounded-full border border-slate-200 bg-white p-0.5"
            />
          </div>
        </div>

        <div>
          <label className={ESTIL_ETIQUETA}>
            {t("configuracio.horariObertura")}
          </label>
          <input
            type="text"
            value={horari}
            onChange={(event) => setHorari(event.target.value)}
            placeholder={t("configuracio.horariPlaceholder")}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <button
          type="button"
          disabled={!haCanviat || !nom.trim()}
          onClick={gestionarDesar}
          className="rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("comu.desarCanvis")}
        </button>
      </div>
    </div>
  );
}
