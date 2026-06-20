// Transcripció en temps real amb Deepgram des del navegador.
//
// Flux: el client demana un JWT temporal a /api/deepgram (que el genera al
// servidor amb la DEEPGRAM_API_KEY), captura l'àudio del micròfon amb
// MediaRecorder i l'envia per WebSocket a Deepgram, rebent la transcripció
// en streaming. La API key real no surt mai del servidor.

export type IdiomaTranscripcio = "ca" | "es";

export type TipusErrorTranscripcio =
  | "permis-microfon"
  | "sense-suport"
  | "connexio"
  | "desconegut";

export interface ErrorTranscripcio {
  tipus: TipusErrorTranscripcio;
  detall?: unknown;
}

export interface OpcionsTranscripcio {
  idioma: IdiomaTranscripcio;
  /** Resultat provisional (es va reescrivint mentre es parla). */
  onParcial: (text: string) => void;
  /** Segment consolidat (no canviarà). */
  onFinal: (text: string) => void;
  onError: (error: ErrorTranscripcio) => void;
  /** Es crida quan la connexió queda oberta i comença la captura. */
  onObert?: () => void;
}

export interface ControladorTranscripcio {
  aturar: () => void;
}

const MIME_TYPES_PREFERITS = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
];

/**
 * Inicia una sessió de transcripció en temps real. Retorna un controlador
 * amb `aturar()` per parar el micròfon i tancar la connexió.
 *
 * Llança si no es pot començar (sense permís de micròfon, sense token…),
 * però sempre crida abans `onError` amb el tipus concret perquè la UI pugui
 * mostrar un missatge sense trencar l'aplicació.
 */
export async function iniciarTranscripcio(
  opcions: OpcionsTranscripcio
): Promise<ControladorTranscripcio> {
  const { idioma, onParcial, onFinal, onError, onObert } = opcions;

  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia ||
    typeof MediaRecorder === "undefined"
  ) {
    onError({ tipus: "sense-suport" });
    throw new Error("El navegador no suporta la captura d'àudio.");
  }

  // 1) Permís i captura del micròfon.
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    onError({ tipus: "permis-microfon", detall: error });
    throw error;
  }

  // 2) Token temporal del servidor.
  let accessToken: string;
  try {
    const res = await fetch("/api/deepgram", { method: "POST" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const dades = (await res.json()) as { access_token?: string };
    if (!dades.access_token) throw new Error("Resposta sense token");
    accessToken = dades.access_token;
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    onError({ tipus: "connexio", detall: error });
    throw error;
  }

  // 3) WebSocket de streaming amb Deepgram (auth via subprotocol amb el JWT).
  const params = new URLSearchParams({
    model: "nova-2",
    language: idioma,
    interim_results: "true",
    smart_format: "true",
    punctuate: "true",
  });
  // El JWT temporal s'autentica amb el subprotocol "bearer" (el subprotocol
  // "token" és per a la API key crua, que mai enviem al navegador).
  const ws = new WebSocket(
    `wss://api.deepgram.com/v1/listen?${params.toString()}`,
    ["bearer", accessToken]
  );

  const mimeType = MIME_TYPES_PREFERITS.find((tipus) =>
    MediaRecorder.isTypeSupported(tipus)
  );

  let recorder: MediaRecorder | null = null;
  let aturat = false;

  function alliberarMicrofon() {
    try {
      if (recorder && recorder.state !== "inactive") recorder.stop();
    } catch {
      // ignora
    }
    stream.getTracks().forEach((track) => track.stop());
  }

  ws.onopen = () => {
    if (aturat) return;
    recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        ws.send(event.data);
      }
    };
    // Enviem chunks cada 250 ms per a una latència baixa.
    recorder.start(250);
    onObert?.();
  };

  ws.onmessage = (event) => {
    let missatge: {
      type?: string;
      is_final?: boolean;
      channel?: { alternatives?: { transcript?: string }[] };
    };
    try {
      missatge = JSON.parse(event.data as string);
    } catch {
      return; // metadades o keep-alives no-JSON
    }
    if (missatge.type && missatge.type !== "Results") return;
    const text = missatge.channel?.alternatives?.[0]?.transcript ?? "";
    if (!text) return;
    if (missatge.is_final) onFinal(text);
    else onParcial(text);
  };

  ws.onerror = () => {
    if (!aturat) onError({ tipus: "connexio" });
  };

  function aturar() {
    if (aturat) return;
    aturat = true;
    alliberarMicrofon();
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "CloseStream" }));
      }
      ws.close();
    } catch {
      // ignora
    }
  }

  return { aturar };
}
