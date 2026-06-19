"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCentres } from "@/lib/centres";
import { aplicarPaletaBrand, esHexValid } from "@/lib/color-utils";

/**
 * Aplica els accents de color del centre del professional autenticat
 * com a variables CSS, perquè les utilitats "brand" de Tailwind
 * reflecteixin el colorPrincipal de cada centre sense recompilar.
 */
export function TemaCentre() {
  const { sessio } = useAuth();
  const { obtenirCentre } = useCentres();
  const colorPrincipal = sessio
    ? obtenirCentre(sessio.centreId)?.colorPrincipal
    : undefined;

  useEffect(() => {
    if (colorPrincipal && esHexValid(colorPrincipal)) {
      aplicarPaletaBrand(colorPrincipal);
    }
  }, [colorPrincipal]);

  return null;
}
