"use client";

import { IconAlertTriangle } from "@tabler/icons-react";

interface ModalConfirmacioProps {
  titol: string;
  missatge: string;
  etiquetaConfirmar: string;
  etiquetaCancelar: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacio({
  titol,
  missatge,
  etiquetaConfirmar,
  etiquetaCancelar,
  onConfirmar,
  onCancelar,
}: ModalConfirmacioProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
            <IconAlertTriangle className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
              {titol}
            </h2>
            <p className="mt-1 text-[13px] text-slate-500">{missatge}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {etiquetaCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="rounded-lg bg-red-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-red-700"
          >
            {etiquetaConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
