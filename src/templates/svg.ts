import { esc } from "../lib/text";

/** Maßstab aller Druckvorlagen: 10 Einheiten entsprechen 1 mm. */
export const UNITS_PER_MM = 10;

export interface TextOptions {
  color?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}

export function svgText(font: string, x: number, y: number, size: number, value: string, o: TextOptions = {}): string {
  return (
    `<text x="${x}" y="${y}" font-size="${size}" font-family="${esc(font)}"` +
    (o.weight ? ` font-weight="${o.weight}"` : "") +
    ` fill="${o.color ?? "#1C2830"}"` +
    (o.anchor ? ` text-anchor="${o.anchor}"` : "") +
    `>${esc(value)}</text>`
  );
}

export function svgImage(href: string, x: number, y: number, w: number, h: number, align = "xMinYMid"): string {
  return `<image href="${esc(href)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${align} meet"/>`;
}

export function svgDocument(inner: string, width: number, height: number, label: string, withXmlHeader = false): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" ` +
    `width="${width / UNITS_PER_MM}mm" height="${height / UNITS_PER_MM}mm" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  return withXmlHeader ? `<?xml version="1.0" encoding="UTF-8"?>${svg}` : svg;
}

/** Schnittmarken um ein Rechteck, wie sie Druckereien erwarten. */
export function cropMarks(x: number, y: number, w: number, h: number, length = 40, gap = 10): string {
  const stroke = `stroke="#1D1D1B" stroke-width="1.5"`;
  const corners: [number, number, number, number][] = [
    [x, y, -1, -1],
    [x + w, y, 1, -1],
    [x, y + h, -1, 1],
    [x + w, y + h, 1, 1],
  ];
  return corners
    .map(([cx, cy, dx, dy]) =>
      `<line x1="${cx + dx * gap}" y1="${cy}" x2="${cx + dx * (gap + length)}" y2="${cy}" ${stroke}/>` +
      `<line x1="${cx}" y1="${cy + dy * gap}" x2="${cx}" y2="${cy + dy * (gap + length)}" ${stroke}/>`,
    )
    .join("");
}
