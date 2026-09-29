import type { Brand, CardLayout, CardPhotoLayout, LayoutStyle, Person, RenderOptions } from "../types";
import { getFont } from "../lib/fonts";
import { readableOnWhite, textOn } from "../lib/colors";
import { cropMarks, svgDocument, svgImage, svgText } from "./svg";
import { silhouetteSvg } from "./photo";
import { esc } from "../lib/text";

/** Visitenkarte im Standardformat 85 × 55 mm. */
export const CARD_W = 850;
export const CARD_H = 550;

/**
 * Vorderseite. Der Stil bestimmt die Gestaltung (Linie, farbige Kante oder nichts),
 * die Position bestimmt, wo das Logo sitzt. Das Porträtfoto sitzt links oder rechts vom Text.
 */
export function cardFront(
  person: Person,
  brand: Brand,
  style: LayoutStyle = brand.style,
  pos: CardLayout = brand.logoPos?.card ?? "top",
  opts: RenderOptions = {},
  photoPos: CardPhotoLayout = brand.photoPos?.card ?? "none",
): string {
  const f = getFont(brand.font).stack;
  const main = brand.mainColor;
  const accent = brand.accentColor;
  const quiet = style === "ruhig";
  const roleColor = quiet ? "#5E676C" : readableOnWhite(main);
  const contact = [
    person.phone && `T  ${person.phone}`,
    person.mobile && `M  ${person.mobile}`,
    person.email,
    brand.web,
  ].filter(Boolean) as string[];

  const parts: string[] = [`<rect width="${CARD_W}" height="${CARD_H}" fill="#FFFFFF"/>`];
  if (style === "kante") {
    parts.push(`<rect width="110" height="${CARD_H}" fill="${main}"/><rect x="110" width="10" height="${CARD_H}" fill="${accent}"/>`);
  }

  // Foto nur, wenn eins da ist, oder als Platzhalter in der Vorschau
  const hasPhoto = photoPos !== "none" && Boolean(person.photo || opts.placeholder);
  const photo = (cx: number, cy: number, r: number) =>
    person.photo
      ? `<image href="${esc(person.photo)}" x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" preserveAspectRatio="xMidYMid slice"/>`
      : silhouetteSvg(cx, cy, r, "mw-card-photo");

  const x0 = style === "kante" ? 170 : 70;
  // Foto links schiebt den Text nach rechts
  const photoLeft = hasPhoto && photoPos === "left";
  const photoRight = hasPhoto && photoPos === "right";

  const layout = (x: number) => ({
    accentBar: (y: number) => (style === "klar" ? `<rect x="${x}" y="${y}" width="60" height="6" fill="${accent}"/>` : ""),
    name: (y: number, size: number) => svgText(f, x, y, size, person.name, { weight: quiet ? 600 : 700 }),
    role: (y: number, size: number) => svgText(f, x, y, size, person.role, { color: roleColor, weight: quiet ? 400 : 600 }),
    lines: (y: number, step: number, size: number) =>
      contact.map((c, i) => svgText(f, x, y + i * step, size, c, { color: "#333333" })).join(""),
  });

  if (pos === "bottom") {
    const x = photoLeft ? x0 + 170 : x0;
    const t = layout(x);
    parts.push(t.accentBar(58), t.name(130, 44), t.role(174, 28), t.lines(250, 34, 24));
    if (photoLeft) parts.push(photo(x0 + 70, 180, 70));
    if (photoRight) parts.push(photo(710, 180, 70));
    parts.push(svgImage(brand.logo, 560, 400, 230, 90, "xMaxYMid"));
  } else if (pos === "right") {
    const divider = style === "kante" ? { c: accent, w: 4 } : quiet ? { c: "#D5D8DC", w: 2 } : { c: readableOnWhite(main), w: 3 };
    const x = photoLeft ? x0 + 120 : x0;
    const t = layout(x);
    const small = photoLeft ? 19 : 22;
    parts.push(t.accentBar(118), t.name(190, photoLeft ? 36 : 40), t.role(232, photoLeft ? 24 : 26), t.lines(300, 30, small));
    if (photoLeft) parts.push(photo(x0 + 50, 250, 50));
    const dividerX = photoLeft ? 600 : 560;
    parts.push(`<rect x="${dividerX}" y="80" width="${divider.w}" height="390" fill="${divider.c}"/>`);
    if (photoRight) {
      // Foto über dem Logo in der rechten Spalte
      parts.push(photo(700, 185, 70));
      parts.push(svgImage(brand.logo, 590, 300, 220, 130, "xMidYMid"));
    } else {
      parts.push(svgImage(brand.logo, dividerX + 25, 180, CARD_W - dividerX - 60, 190, "xMidYMid"));
    }
  } else {
    parts.push(svgImage(brand.logo, x0, 55, 320, 100));
    const x = photoLeft ? x0 + 170 : x0;
    const t = layout(x);
    parts.push(t.accentBar(205), t.name(270, 46), t.role(314, 28), t.lines(385, 34, 24));
    if (photoLeft) parts.push(photo(x0 + 70, 330, 70));
    if (photoRight) parts.push(photo(710, 330, 70));
  }
  return parts.join("");
}

export function cardBack(brand: Brand, style: LayoutStyle = brand.style): string {
  const f = getFont(brand.font).stack;
  const main = brand.mainColor;
  const on = textOn(main);

  if (style === "ruhig") {
    return (
      `<rect width="${CARD_W}" height="${CARD_H}" fill="#FFFFFF"/>` +
      svgImage(brand.logo, 175, 165, 500, 160, "xMidYMid") +
      svgText(f, 425, 420, 24, brand.claim, { color: "#5E676C", anchor: "middle" })
    );
  }
  // Lange Firmennamen werden kleiner gesetzt, damit sie auf die Karte passen.
  const nameSize = Math.min(50, Math.round(1350 / Math.max(1, brand.name.length)));
  const band = style === "kante" ? `<rect width="${CARD_W}" height="14" fill="${brand.accentColor}"/>` : `<rect y="500" width="${CARD_W}" height="50" fill="${brand.accentColor}"/>`;
  return (
    `<rect width="${CARD_W}" height="${CARD_H}" fill="${main}"/>` +
    band +
    svgText(f, 425, 255, nameSize, brand.name, { color: on, weight: 700, anchor: "middle" }) +
    svgText(f, 425, 315, 28, brand.claim, { color: on, anchor: "middle" }) +
    svgText(f, 425, 395, 24, `${brand.street}, ${brand.city}`, { color: on, anchor: "middle" })
  );
}

/** Druckbogen mit Vorder- und Rückseite nebeneinander, inklusive Schnittmarken. */
export function cardSheet(person: Person, brand: Brand, style?: LayoutStyle): string {
  const m = 60;
  const x2 = m * 2 + CARD_W + 50;
  const w = x2 + CARD_W + m;
  const h = CARD_H + m * 2;
  const inner =
    `<rect width="${w}" height="${h}" fill="#FFFFFF"/>` +
    `<g transform="translate(${m},${m})">${cardFront(person, brand, style)}</g>` +
    `<g transform="translate(${x2},${m})">${cardBack(brand, style)}</g>` +
    cropMarks(m, m, CARD_W, CARD_H) +
    cropMarks(x2, m, CARD_W, CARD_H);
  return svgDocument(inner, w, h, "Visitenkarte Druckbogen", true);
}
