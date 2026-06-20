"use client";

import { useState } from "react";
import { IconCircleCheck, IconSettings2 } from "@tabler/icons-react";
import { useCentres, type Centre } from "@/lib/centres";
import { useIdioma } from "@/lib/i18n-context";
import { exempleFormatData, type FormatData } from "@/lib/data-utils";
import { IDIOMES, type Idioma } from "@/lib/i18n";

interface PreferenciesProps {
  centre: Centre;
}

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";
const DATA_EXEMPLE = "2026-03-15";

const NOMS_IDIOMA: Record<Idioma, string> = {
  ca: "Català",
  es: "Castellà",
};

export function Preferencies({ centre }: PreferenciesProps) {
  const { t, idioma } = useIdioma();
  const { actualitzarCentre } = useCentres();

  const [idiomaPerDefecte, setIdiomaPerDefecte] = useState<Idioma>(
    centre.idiomaPerDefecte ?? "ca"
  );
  const [formatData, setFormatData] = useState<FormatData>(
    centre.formatData ?? "llarg"
  );
  const [confirmacio, setConfirmacio] = useState(false);

  const haCanviat =
    idiomaPerDefecte !== (centre.idiomaPerDefecte ?? "ca") ||
    formatData !== (centre.formatData ?? "llarg");

  function gestionarDesar() {
    actualitzarCentre(centre.id, {
      nom: centre.nom,
      logo: centre.logo,
      logoUrl: centre.logoUrl,
      colorPrincipal: centre.colorPrincipal,
      horari: centre.horari,
      idiomaPerDefecte,
      formatData,
    });
    setConfirmacio(true);
    setTimeout(() => setConfirmacio(false), 2500);
  }

  const formats: { id: FormatData; etiqueta: string }[] = [
    {
      id: "llarg",
      etiqueta: exempleFormatData(DATA_EXEMPLE, "llarg", idioma),
    },
    {
      id: "curt",
      etiqueta: exempleFormatData(DATA_EXEMPLE, "curt", idioma),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <IconSettings2 className="h-4 w-4 text-brand-500" />
        <h2 className="text-[14px] font-semibold tracking-tight text-slate-900">
          {t("configuracio.preferencies")}
        </h2>
      </div>

      <div className="max-w-md space-y-5">
        <div>
          <label className={ESTIL_ETIQUETA}>
            {t("configuracio.idiomaPerDefecte")}
          </label>
          <p className="mb-2 text-[12px] text-slate-400">
            {t("configuracio.idiomaPerDefecteAjuda")}
          </p>
          <div className="flex gap-2">
            {IDIOMES.map((opcio) => (
              <button
                key={opcio}
                type="button"
                onClick={() => setIdiomaPerDefecte(opcio)}
                className={`flex-1 rounded-lg border px-3 py-2 text-[13px] font-medium transition ${
                  idiomaPerDefecte === opcio
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {NOMS_IDIOMA[opcio]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={ESTIL_ETIQUETA}>
            {t("configuracio.formatData")}
          </label>
          <p className="mb-2 text-[12px] text-slate-400">
            {t("configuracio.formatDataAjuda")}
          </p>
          <div className="space-y-2">
            {formats.map((opcio) => (
              <button
                key={opcio.id}
                type="button"
                onClick={() => setFormatData(opcio.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[13px] transition ${
                  formatData === opcio.id
                    ? "border-brand-500 bg-brand-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                    formatData === opcio.id
                      ? "border-brand-600"
                      : "border-slate-300"
                  }`}
                >
                  {formatData === opcio.id && (
                    <span className="h-2 w-2 rounded-full bg-brand-600" />
                  )}
                </span>
                <span className="font-medium text-slate-700">
                  {opcio.etiqueta}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!haCanviat}
            onClick={gestionarDesar}
            className="rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("comu.desarCanvis")}
          </button>
          {confirmacio && (
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-700">
              <IconCircleCheck className="h-4 w-4" />
              {t("configuracio.canvisDesats")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
