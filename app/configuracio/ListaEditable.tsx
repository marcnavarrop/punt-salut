"use client";

import { useState, type FormEvent } from "react";
import { IconCheck, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import type { ItemHabitual } from "@/lib/config-context";
import { useIdioma } from "@/lib/i18n-context";

interface ListaEditableProps {
  items: ItemHabitual[];
  placeholderAfegir: string;
  capItem: string;
  onAfegir: (nom: string) => void;
  onActualitzar: (id: string, nom: string) => void;
  onEliminar: (id: string) => void;
}

const ESTIL_CAMP =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

export function ListaEditable({
  items,
  placeholderAfegir,
  capItem,
  onAfegir,
  onActualitzar,
  onEliminar,
}: ListaEditableProps) {
  const { t } = useIdioma();
  const [nouValor, setNouValor] = useState("");
  const [edicioId, setEdicioId] = useState<string | null>(null);
  const [edicioValor, setEdicioValor] = useState("");

  function gestionarAfegir(event: FormEvent) {
    event.preventDefault();
    const valor = nouValor.trim();
    if (!valor) return;
    onAfegir(valor);
    setNouValor("");
  }

  function iniciarEdicio(item: ItemHabitual) {
    setEdicioId(item.id);
    setEdicioValor(item.nom);
  }

  function confirmarEdicio() {
    const valor = edicioValor.trim();
    if (valor && edicioId) {
      onActualitzar(edicioId, valor);
    }
    setEdicioId(null);
  }

  return (
    <div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-200 bg-white/60 px-3 py-4 text-center text-[12px] text-slate-400">
          {capItem}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 py-2">
              {edicioId === item.id ? (
                <>
                  <input
                    autoFocus
                    type="text"
                    value={edicioValor}
                    onChange={(event) => setEdicioValor(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") confirmarEdicio();
                      if (event.key === "Escape") setEdicioId(null);
                    }}
                    className={ESTIL_CAMP}
                  />
                  <button
                    type="button"
                    onClick={confirmarEdicio}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-brand-600 transition hover:bg-brand-50"
                    title={t("comu.desar")}
                  >
                    <IconCheck className="h-[15px] w-[15px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEdicioId(null)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100"
                    title={t("comu.cancelar")}
                  >
                    <IconX className="h-[15px] w-[15px]" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-[13px] text-slate-700">{item.nom}</span>
                  <button
                    type="button"
                    onClick={() => iniciarEdicio(item)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    title={t("comu.editar")}
                  >
                    <IconPencil className="h-[15px] w-[15px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEliminar(item.id)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
                    title={t("comu.eliminar")}
                  >
                    <IconTrash className="h-[15px] w-[15px]" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={gestionarAfegir} className="mt-3 flex gap-2">
        <input
          type="text"
          value={nouValor}
          onChange={(event) => setNouValor(event.target.value)}
          placeholder={placeholderAfegir}
          className={ESTIL_CAMP}
        />
        <button
          type="submit"
          disabled={!nouValor.trim()}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconPlus className="h-[15px] w-[15px]" />
        </button>
      </form>
    </div>
  );
}
