"use client";

import { useState, type FormEvent } from "react";
import { IconX } from "@tabler/icons-react";
import type { FasePacient, Pacient } from "@/types";
import { FASE_ETIQUETES } from "@/lib/etiquetes";
import { dataAvui } from "@/lib/data-utils";

interface FormulariNouPacientProps {
  onTancar: () => void;
  onCrear: (dades: Omit<Pacient, "id">) => void;
}

const FASES: FasePacient[] = ["agut", "subagut", "cronic"];

const ESTIL_CAMP =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";

export function FormulariNouPacient({
  onTancar,
  onCrear,
}: FormulariNouPacientProps) {
  const [nom, setNom] = useState("");
  const [cognoms, setCognoms] = useState("");
  const [dataNaixement, setDataNaixement] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [diagnostic, setDiagnostic] = useState("");
  const [fase, setFase] = useState<FasePacient>("agut");
  const [profesionalAssignat, setProfesionalAssignat] = useState(
    "Marc Soler, fisioterapeuta"
  );

  function gestionarEnviament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCrear({
      nom: nom.trim(),
      cognoms: cognoms.trim(),
      dataNaixement,
      telefon: telefon.trim(),
      email: email.trim(),
      diagnostic: diagnostic.trim(),
      fase,
      profesionalAssignat: profesionalAssignat.trim(),
      estat: "actiu",
      dataInici: dataAvui(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
            Nou pacient
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ESTIL_ETIQUETA}>Nom</label>
              <input
                required
                type="text"
                value={nom}
                onChange={(event) => setNom(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
            <div>
              <label className={ESTIL_ETIQUETA}>Cognoms</label>
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
            <label className={ESTIL_ETIQUETA}>Data de naixement</label>
            <input
              required
              type="date"
              value={dataNaixement}
              onChange={(event) => setDataNaixement(event.target.value)}
              className={ESTIL_CAMP}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ESTIL_ETIQUETA}>Telèfon</label>
              <input
                required
                type="tel"
                value={telefon}
                onChange={(event) => setTelefon(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
            <div>
              <label className={ESTIL_ETIQUETA}>Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={ESTIL_CAMP}
              />
            </div>
          </div>

          <div>
            <label className={ESTIL_ETIQUETA}>Diagnòstic</label>
            <input
              required
              type="text"
              value={diagnostic}
              onChange={(event) => setDiagnostic(event.target.value)}
              className={ESTIL_CAMP}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ESTIL_ETIQUETA}>Fase clínica</label>
              <select
                value={fase}
                onChange={(event) =>
                  setFase(event.target.value as FasePacient)
                }
                className={ESTIL_CAMP}
              >
                {FASES.map((f) => (
                  <option key={f} value={f}>
                    {FASE_ETIQUETES[f]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={ESTIL_ETIQUETA}>Professional assignat</label>
              <input
                required
                type="text"
                value={profesionalAssignat}
                onChange={(event) =>
                  setProfesionalAssignat(event.target.value)
                }
                className={ESTIL_CAMP}
              />
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onTancar}
              className="rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              Crear pacient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
