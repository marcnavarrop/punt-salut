import { NextResponse } from "next/server";
import { DeepgramClient } from "@deepgram/sdk";

// La crida amb la DEEPGRAM_API_KEY només s'executa al servidor. El client
// del navegador rep un JWT temporal (TTL curt) per obrir el WebSocket de
// streaming directament amb Deepgram, sense que la key surti mai del servidor.
export const runtime = "nodejs";

const TTL_SEGONS = 60;

export async function POST() {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey || apiKey === "enganxa_aquí_la_teva_key") {
    return NextResponse.json(
      { error: "deepgram-no-configurat" },
      { status: 500 }
    );
  }

  try {
    const deepgram = new DeepgramClient({ apiKey });
    const resposta = await deepgram.auth.v1.tokens.grant({
      ttl_seconds: TTL_SEGONS,
    });

    if (!resposta.access_token) {
      return NextResponse.json({ error: "token-buit" }, { status: 502 });
    }

    return NextResponse.json({
      access_token: resposta.access_token,
      expires_in: resposta.expires_in ?? TTL_SEGONS,
    });
  } catch (error) {
    console.error("Error generant el token temporal de Deepgram:", error);
    return NextResponse.json({ error: "token-error" }, { status: 502 });
  }
}
