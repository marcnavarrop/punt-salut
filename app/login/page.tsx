"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconActivity, IconAlertCircle, IconLock, IconMail } from "@tabler/icons-react";
import { useAuth } from "@/lib/auth-context";

const ESTIL_CAMP =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-[13px] text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15";

const ESTIL_ETIQUETA = "text-[12px] font-medium text-slate-500";

export default function LoginPage() {
  const router = useRouter();
  const { iniciarSessio } = useAuth();
  const [email, setEmail] = useState("");
  const [contrasenya, setContrasenya] = useState("");
  const [error, setError] = useState("");

  function gestionarEnviament(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const usuari = email.trim().split("@")[0];
    if (iniciarSessio(usuari, contrasenya)) {
      setError("");
      router.replace("/pacients");
    } else {
      setError("Email o contrasenya incorrectes.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2.5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
            <IconActivity className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-[17px] font-semibold tracking-tight text-slate-900">
              Punt Salut Montseny
            </p>
            <p className="text-[13px] text-slate-400">Assistent clínic</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-[15px] font-semibold tracking-tight text-slate-900">
            Inicia sessió
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Accedeix amb el teu compte de professional.
          </p>

          <form onSubmit={gestionarEnviament} className="mt-4 space-y-3">
            <div>
              <label className={ESTIL_ETIQUETA}>Email</label>
              <div className="relative">
                <IconMail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="text"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="marc@puntsalutmontseny.cat"
                  className={ESTIL_CAMP}
                />
              </div>
            </div>

            <div>
              <label className={ESTIL_ETIQUETA}>Contrasenya</label>
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
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
