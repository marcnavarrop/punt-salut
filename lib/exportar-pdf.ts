import { jsPDF } from "jspdf";
import type { Pacient, Sessio } from "@/types";
import { formatData } from "@/lib/data-utils";
import { EVOLUCIO_ETIQUETES, TIPUS_DETECCIO_ETIQUETES } from "@/lib/etiquetes";

const MARGE = 14;
const AMPLADA_PAGINA = 210;
const ALCADA_PAGINA = 297;
const AMPLADA_TEXT = AMPLADA_PAGINA - MARGE * 2;

export function exportarSessioPDF(pacient: Pacient, sessio: Sessio): void {
  const doc = new jsPDF();
  let y = 20;

  function saltarLinia(espai: number) {
    y += espai;
    if (y > ALCADA_PAGINA - MARGE) {
      doc.addPage();
      y = 20;
    }
  }

  function afegirTitol(text: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(text, MARGE, y);
    saltarLinia(7);
  }

  function afegirParagraf(etiqueta: string, contingut: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(etiqueta, MARGE, y);
    saltarLinia(5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const linies: string[] = doc.splitTextToSize(contingut, AMPLADA_TEXT);
    doc.text(linies, MARGE, y);
    saltarLinia(linies.length * 5 + 4);
  }

  // Capçalera amb el logo de text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(22, 163, 74);
  doc.text("Punt Salut Montseny", MARGE, y);
  saltarLinia(8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text("Informe de sessió", MARGE, y);
  saltarLinia(8);

  doc.setDrawColor(226, 232, 240);
  doc.line(MARGE, y, AMPLADA_PAGINA - MARGE, y);
  saltarLinia(8);

  // Dades generals
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`Pacient: ${pacient.nom} ${pacient.cognoms}`, MARGE, y);
  saltarLinia(6);
  doc.text(`Diagnòstic: ${pacient.diagnostic}`, MARGE, y);
  saltarLinia(6);
  doc.text(`Sessió: ${sessio.numero}`, MARGE, y);
  saltarLinia(6);
  doc.text(`Data: ${formatData(sessio.data)}`, MARGE, y);
  saltarLinia(6);
  doc.text(`Professional: ${pacient.profesionalAssignat}`, MARGE, y);
  saltarLinia(6);
  doc.text(
    `EVA: ${sessio.eva}/10  ·  Evolució: ${EVOLUCIO_ETIQUETES[sessio.evolucio]}`,
    MARGE,
    y
  );
  saltarLinia(10);

  if (sessio.resumEstructurat) {
    afegirTitol("Resum estructurat");
    afegirParagraf("Motiu de consulta", sessio.resumEstructurat.motivConsulta);
    afegirParagraf("Dolor", sessio.resumEstructurat.dolor);
    afegirParagraf(
      "Aspecte emocional",
      sessio.resumEstructurat.aspecteEmocional
    );
    afegirParagraf(
      "Valoració funcional",
      sessio.resumEstructurat.valoracioFuncional
    );
    afegirParagraf(
      "Pendents",
      sessio.resumEstructurat.pendents.map((p) => `· ${p}`).join("\n")
    );
    saltarLinia(2);
  }

  if (sessio.deteccionsIA && sessio.deteccionsIA.length > 0) {
    afegirTitol("Deteccions de la IA");
    sessio.deteccionsIA.forEach((deteccio) => {
      afegirParagraf(
        TIPUS_DETECCIO_ETIQUETES[deteccio.tipus],
        deteccio.descripcio
      );
    });
  }

  const diacritics = /[̀-ͯ]/g;
  const nomFitxer = `sessio-${sessio.numero}-${pacient.nom}-${pacient.cognoms}`
    .toLowerCase()
    .normalize("NFD")
    .replace(diacritics, "")
    .replace(/[^a-z0-9]+/g, "-");

  doc.save(`${nomFitxer}.pdf`);
}
