// Utilitats compartides per formatar dades de pacients i sessions
import type { Idioma } from "@/lib/i18n";

export type FormatData = "llarg" | "curt";

// Preferències globals de format, sincronitzades des de les dades del
// centre per <AplicaPreferencies>. Es guarden a nivell de mòdul perquè
// formatData es pugui cridar des de qualsevol lloc (inclòs l'export a PDF).
let formatActiu: FormatData = "llarg";
let localeActiu = "ca-ES";

export function establirFormatData(format: FormatData) {
  formatActiu = format;
}

export function establirLocaleData(idioma: Idioma) {
  localeActiu = idioma === "es" ? "es-ES" : "ca-ES";
}

export function calcularEdat(dataNaixement: string): number {
  const naixement = new Date(dataNaixement);
  const avui = new Date();
  let edat = avui.getFullYear() - naixement.getFullYear();
  const encaraNoHaFetAnys =
    avui.getMonth() < naixement.getMonth() ||
    (avui.getMonth() === naixement.getMonth() &&
      avui.getDate() < naixement.getDate());
  if (encaraNoHaFetAnys) edat--;
  return edat;
}

export function formatData(data: string): string {
  const d = new Date(data);
  if (formatActiu === "curt") {
    return d.toLocaleDateString(localeActiu, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  return d.toLocaleDateString(localeActiu, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Exemple del format actiu (per a la previsualització a Preferències),
 * sense dependre de l'estat global del mòdul.
 */
export function exempleFormatData(
  data: string,
  format: FormatData,
  idioma: Idioma
): string {
  const locale = idioma === "es" ? "es-ES" : "ca-ES";
  const d = new Date(data);
  if (format === "curt") {
    return d.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function dataAvui(): string {
  return new Date().toISOString().slice(0, 10);
}
