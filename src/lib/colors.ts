export type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** Relative Helligkeit nach WCAG. */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis zweier Farben, 1 bis 21. */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export const INK = "#1C2830";
export const WHITE = "#FFFFFF";

/** Textfarbe, die auf einer Hintergrundfarbe am besten lesbar ist. */
export function textOn(background: string): string {
  return contrast(background, WHITE) >= contrast(background, INK) ? WHITE : INK;
}

/** Gibt die Farbe zurück, wenn sie auf Weiß lesbar ist, sonst Dunkelgrau. */
export function readableOnWhite(color: string): string {
  return contrast(color, WHITE) >= 3 ? color : INK;
}

/**
 * Sucht die prägenden Farben in Bildpunkten (RGBA, wie aus canvas.getImageData).
 * Fast weiße und durchsichtige Punkte zählen nicht. Kräftige Farben werden bevorzugt,
 * ähnliche Farben zusammengefasst.
 */
export function pickColors(pixels: Uint8ClampedArray | number[], max = 5): string[] {
  const buckets = new Map<string, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i + 3 < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
    if (a < 128) continue;
    if (r > 235 && g > 235 && b > 235) continue;
    const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
    const o = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    o.n++; o.r += r; o.g += g; o.b += b;
    buckets.set(key, o);
  }
  const list = [...buckets.values()].map((o) => {
    const rgb: Rgb = [o.r / o.n, o.g / o.n, o.b / o.n];
    const mx = Math.max(...rgb), mn = Math.min(...rgb);
    const sat = mx === 0 ? 0 : (mx - mn) / mx;
    return { rgb, n: o.n, score: o.n * (0.35 + sat) };
  });
  list.sort((a, b) => b.score - a.score);

  const out: typeof list = [];
  for (const c of list) {
    if (out.length >= max) break;
    if (c.n <= 2) continue;
    const far = out.every((o) => Math.hypot(c.rgb[0] - o.rgb[0], c.rgb[1] - o.rgb[1], c.rgb[2] - o.rgb[2]) > 70);
    if (far) out.push(c);
  }
  return out.map((c) => rgbToHex(...c.rgb));
}
