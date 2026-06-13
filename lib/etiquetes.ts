// Etiquetes, colors i icones compartides per a badges de tot el projecte
import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconInfoCircle,
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import type {
  EstatPacient,
  Evolucio,
  FasePacient,
  SeveritatDeteccioIA,
  TipusDeteccioIA,
} from "@/types";

export type { Evolucio };

export const ESTAT_PACIENT_ETIQUETES: Record<EstatPacient, string> = {
  actiu: "Actiu",
  "alta temporal": "Alta temporal",
  "fase aguda": "Fase aguda",
};

export const ESTAT_PACIENT_ESTILS: Record<
  EstatPacient,
  { badge: string; dot: string }
> = {
  actiu: {
    badge:
      "inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700",
    dot: "h-1.5 w-1.5 rounded-full bg-brand-500",
  },
  "alta temporal": {
    badge:
      "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500",
    dot: "h-1.5 w-1.5 rounded-full bg-slate-400",
  },
  "fase aguda": {
    badge:
      "inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700",
    dot: "h-1.5 w-1.5 rounded-full bg-orange-500",
  },
};

export const AVATAR_ESTILS: Record<EstatPacient, string> = {
  actiu: "bg-brand-600",
  "alta temporal": "bg-slate-400",
  "fase aguda": "bg-brand-600",
};

export const FASE_ETIQUETES: Record<FasePacient, string> = {
  agut: "Agut",
  subagut: "Subagut",
  cronic: "Crònic",
};

export const FASE_ESTILS: Record<FasePacient, string> = {
  agut: "rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-rose-100",
  subagut:
    "rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 ring-1 ring-sky-100",
  cronic:
    "rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-100",
};

export const TIPUS_DETECCIO_ETIQUETES: Record<TipusDeteccioIA, string> = {
  kinesiofobia: "Kinesiofòbia",
  catastrofitzacio: "Catastrofització",
  milloraDetectada: "Millora detectada",
  alertaClinica: "Alerta clínica",
  suggeriment: "Suggeriment",
};

export const SEVERITAT_ESTILS: Record<SeveritatDeteccioIA, string> = {
  info: "bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/20",
  warning: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/10",
  alert: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
};

export const SEVERITAT_ICONES: Record<SeveritatDeteccioIA, typeof IconInfoCircle> = {
  info: IconInfoCircle,
  warning: IconAlertTriangle,
  alert: IconAlertOctagon,
};

export const EVOLUCIO_ETIQUETES: Record<Evolucio, string> = {
  millora: "Millora",
  estable: "Estable",
  empitjora: "Empitjora",
};

export const EVOLUCIO_ESTILS: Record<Evolucio, string> = {
  millora:
    "inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700",
  estable:
    "inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500",
  empitjora:
    "inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700",
};

export const EVOLUCIO_ICONES: Record<Evolucio, typeof IconTrendingUp> = {
  millora: IconTrendingUp,
  estable: IconMinus,
  empitjora: IconTrendingDown,
};
