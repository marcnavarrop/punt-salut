// Genera una paleta de tons (50-900) a partir d'un únic color base,
// mesclant-lo amb blanc (tons clars) o negre (tons foscos).

type RGB = [number, number, number];

const BLANC: RGB = [255, 255, 255];
const NEGRE: RGB = [0, 0, 0];

function clamp255(valor: number): number {
  return Math.min(255, Math.max(0, Math.round(valor)));
}

function hexARgb(hex: string): RGB {
  const net = hex.replace("#", "");
  const completa = net.length === 3 ? net.split("").map((c) => c + c).join("") : net;
  const enter = parseInt(completa, 16);
  return [(enter >> 16) & 255, (enter >> 8) & 255, enter & 255];
}

function rgbAHex([r, g, b]: RGB): string {
  return `#${[r, g, b].map((v) => clamp255(v).toString(16).padStart(2, "0")).join("")}`;
}

function mesclar(hex: string, objectiu: RGB, ratio: number): string {
  const [r, g, b] = hexARgb(hex);
  const [tr, tg, tb] = objectiu;
  return rgbAHex([
    r + (tr - r) * ratio,
    g + (tg - g) * ratio,
    b + (tb - b) * ratio,
  ]);
}

const RATIS_CLARS: Record<string, number> = {
  "50": 0.95,
  "100": 0.88,
  "200": 0.74,
  "300": 0.58,
  "400": 0.32,
  "500": 0.14,
};

const RATIS_FOSCOS: Record<string, number> = {
  "700": 0.13,
  "800": 0.28,
  "900": 0.42,
};

export function esHexValid(valor: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(valor);
}

export function generarPaletaBrand(colorBase: string): Record<string, string> {
  if (!esHexValid(colorBase)) return {};
  const paleta: Record<string, string> = { "600": colorBase };
  for (const [to, ratio] of Object.entries(RATIS_CLARS)) {
    paleta[to] = mesclar(colorBase, BLANC, ratio);
  }
  for (const [to, ratio] of Object.entries(RATIS_FOSCOS)) {
    paleta[to] = mesclar(colorBase, NEGRE, ratio);
  }
  return paleta;
}

export function aplicarPaletaBrand(colorBase: string): void {
  if (typeof document === "undefined") return;
  const paleta = generarPaletaBrand(colorBase);
  for (const [to, hex] of Object.entries(paleta)) {
    document.documentElement.style.setProperty(`--brand-${to}`, hex);
  }
}
