// Simulació de les respostes de la Claude API per a l'anàlisi de sessions
import type { DeteccioIA, Evolucio, ResumEstructurat } from "@/types";

export interface AnalisiTranscripcio {
  resumEstructurat: ResumEstructurat;
  deteccionsIA: DeteccioIA[];
  citaDestacada: string;
  keywordsEmpoderament: string[];
  evolucio: Evolucio;
  eva: number;
}

type Escenari = Evolucio;

const EVA_PER_ESCENARI: Record<Escenari, number> = {
  millora: 3,
  estable: 5,
  empitjora: 7,
};

interface EscenariDades {
  resumEstructurat: ResumEstructurat;
  deteccionsIA: DeteccioIA[];
  citesDestacades: string[];
  keywordsEmpoderament: string[];
}

const ESCENARIS: Record<Escenari, EscenariDades> = {
  millora: {
    resumEstructurat: {
      motivConsulta:
        "Sessió de seguiment per valorar l'evolució del dolor lumbar i la resposta al pla d'exercicis.",
      dolor:
        "El dolor ha disminuït de manera notable, situant-se en un EVA de 2-3/10, sense irradiació cap a l'extremitat inferior.",
      aspecteEmocional:
        "La pacient es mostra optimista i amb més confiança en el seu cos, encara que manté certa precaució davant moviments bruscos.",
      valoracioFuncional:
        "Millora clara en la tolerància a la sedestació prolongada, la marxa i les activitats de la vida diària.",
      pendents: [
        "Progressar la càrrega en els exercicis de control motor.",
        "Introduir exercicis funcionals més exigents.",
        "Revisar l'adherència al pla domiciliari a la propera sessió.",
      ],
    },
    deteccionsIA: [
      {
        tipus: "milloraDetectada",
        descripcio:
          "Reducció de l'EVA de 5/10 a 2-3/10 en les dues últimes sessions.",
        severitat: "info",
      },
      {
        tipus: "kinesiofobia",
        descripcio:
          "Encara presenta certa por al moviment en flexions completes, tot i la millora general.",
        severitat: "info",
      },
      {
        tipus: "suggeriment",
        descripcio:
          "Es recomana augmentar progressivament la intensitat dels exercicis de força.",
        severitat: "info",
      },
    ],
    citesDestacades: [
      "Avui m'he llevat del llit sense necessitar agafar-me a res, fa setmanes que no em passava.",
      "Noto que tinc més confiança per moure'm, ja no penso tant en el dolor.",
    ],
    keywordsEmpoderament: [
      "confiança",
      "autonomia",
      "progrés",
      "constància",
      "control",
    ],
  },
  estable: {
    resumEstructurat: {
      motivConsulta:
        "Sessió de seguiment per valorar l'evolució del dolor lumbar i ajustar el pla de tractament.",
      dolor:
        "El dolor es manté similar a la sessió anterior, amb un EVA de 4-5/10, de caràcter intermitent.",
      aspecteEmocional:
        "La pacient expressa certa frustració per la lentitud de la millora, però manté l'adherència al tractament.",
      valoracioFuncional:
        "Es manté el nivell funcional previ, sense canvis significatius en les activitats de la vida diària.",
      pendents: [
        "Revisar la tècnica d'execució dels exercicis domiciliaris.",
        "Valorar si cal ajustar la intensitat o la freqüència del tractament.",
        "Explorar factors externs (estrès, son) que puguin influir en el dolor.",
      ],
    },
    deteccionsIA: [
      {
        tipus: "catastrofitzacio",
        descripcio:
          "La pacient expressa pensaments com 'no sé si això es curarà mai', indicant certa catastrofització.",
        severitat: "warning",
      },
      {
        tipus: "kinesiofobia",
        descripcio:
          "Manté l'evitació de certs moviments per por a empitjorar el dolor.",
        severitat: "warning",
      },
      {
        tipus: "suggeriment",
        descripcio:
          "Es recomana reforçar l'educació en neurociència del dolor per reduir la por al moviment.",
        severitat: "info",
      },
    ],
    citesDestacades: [
      "Alguns dies em sento igual que al principi, no sé si això acabarà millorant mai.",
      "Faig els exercicis, però no sé si els estic fent bé.",
    ],
    keywordsEmpoderament: [
      "paciència",
      "adherència",
      "comprensió",
      "gestió",
      "constància",
    ],
  },
  empitjora: {
    resumEstructurat: {
      motivConsulta:
        "Sessió de seguiment per valorar un increment del dolor lumbar referit per la pacient.",
      dolor:
        "El dolor ha augmentat respecte la sessió anterior, amb un EVA de 6-7/10, i apareix irradiació puntual cap al maluc.",
      aspecteEmocional:
        "La pacient es mostra preocupada i desanimada per l'empitjorament, amb por d'haver fet malbé la feina feta fins ara.",
      valoracioFuncional:
        "Disminució de la tolerància a la sedestació i augment de la rigidesa matinal.",
      pendents: [
        "Valorar amb el professional referent la necessitat de revisió o imatge complementària.",
        "Adaptar el pla d'exercicis reduint temporalment la càrrega.",
        "Fer un seguiment estret de l'evolució del dolor en els propers dies.",
      ],
    },
    deteccionsIA: [
      {
        tipus: "alertaClinica",
        descripcio:
          "Increment significatiu de l'EVA (de 3-4/10 a 6-7/10) amb nova irradiació cap al maluc; es recomana valoració per part del professional referent.",
        severitat: "alert",
      },
      {
        tipus: "catastrofitzacio",
        descripcio:
          "La pacient verbalitza pensaments com 'he fet un pas enrere i no sé si em recuperaré', indicant catastrofització.",
        severitat: "warning",
      },
      {
        tipus: "kinesiofobia",
        descripcio:
          "Augment de l'evitació del moviment per por a agreujar el dolor.",
        severitat: "warning",
      },
    ],
    citesDestacades: [
      "Aquests dies el dolor m'ha tornat amb molta força, fins i tot em costa aixecar-me del llit.",
      "Tinc por d'haver-ho espatllat tot i tornar a estar com al principi.",
    ],
    keywordsEmpoderament: [
      "cautela",
      "comunicació",
      "ajust",
      "seguiment",
      "suport",
    ],
  },
};

const PREGUNTES_SEGUENT_SESSIO = [
  "Com ha evolucionat el dolor des de l'última sessió?",
  "Has pogut fer els exercicis pautats a casa? Amb quina freqüència?",
  "Hi ha algun moviment o activitat que encara et generi por o inseguretat?",
  "Com valoraries la teva qualitat del son aquesta setmana?",
  "Has notat algun canvi en les activitats de la vida diària, com vestir-te, caminar o asseure't?",
  "En una escala del 0 al 10, com et trobes a nivell emocional respecte al procés de recuperació?",
  "Hi ha algun moment del dia en què el dolor sigui més intens?",
  "Has tingut algun episodi d'increment sobtat del dolor des de la darrera visita?",
  "Quins exercicis et resulten més difícils o incòmodes de fer?",
];

function triarEscenari(): Escenari {
  const escenaris: Escenari[] = ["millora", "estable", "empitjora"];
  return escenaris[Math.floor(Math.random() * escenaris.length)];
}

function triarAleatoris<T>(elements: T[], quantitat: number): T[] {
  const copia = [...elements];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, quantitat);
}

/**
 * Simula l'anàlisi d'una transcripció de sessió per part de la Claude API.
 */
export function analitzarTranscripcio(text: string): AnalisiTranscripcio {
  const nomEscenari = triarEscenari();
  const escenari = ESCENARIS[nomEscenari];
  const indexCita = text.length % escenari.citesDestacades.length;

  return {
    resumEstructurat: escenari.resumEstructurat,
    deteccionsIA: escenari.deteccionsIA,
    citaDestacada: escenari.citesDestacades[indexCita],
    keywordsEmpoderament: escenari.keywordsEmpoderament,
    evolucio: nomEscenari,
    eva: EVA_PER_ESCENARI[nomEscenari],
  };
}

/**
 * Simula la generació de preguntes suggerides per a la propera sessió.
 */
export function generarPreguntesSeguentSessio(): string[] {
  return triarAleatoris(PREGUNTES_SEGUENT_SESSIO, 3);
}
