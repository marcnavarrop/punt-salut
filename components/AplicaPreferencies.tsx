"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useCentres } from "@/lib/centres";
import { useIdioma, establirIdiomaPerDefecte } from "@/lib/i18n-context";
import { establirFormatData, establirLocaleData } from "@/lib/data-utils";

/**
 * Aplica globalment les preferències del centre del professional
 * autenticat: format de data, locale i idioma per defecte.
 */
export function AplicaPreferencies() {
  const { sessio } = useAuth();
  const { obtenirCentre } = useCentres();
  const { idioma } = useIdioma();

  const centre = sessio ? obtenirCentre(sessio.centreId) : undefined;
  const formatData = centre?.formatData ?? "llarg";
  const idiomaPerDefecte = centre?.idiomaPerDefecte;

  // Assignacions idempotents de mòdul: s'apliquen durant el render perquè
  // formatData() ja en tingui el valor correcte quan rendin les pàgines.
  establirFormatData(formatData);
  establirLocaleData(idioma);

  useEffect(() => {
    if (idiomaPerDefecte) {
      establirIdiomaPerDefecte(idiomaPerDefecte);
    }
  }, [idiomaPerDefecte]);

  return null;
}
