import type { Brand, LayoutStyle, Person } from "../types";
import { getFont } from "../lib/fonts";
import { readableOnWhite, textOn } from "../lib/colors";
import { cropMarks, svgDocument, svgImage, svgText } from "./svg";

/** Visitenkarte im Standardformat 85 × 55 mm. */
export const CARD_W = 850;
export const CARD_H = 550;

export function cardFront(person: Person, brand: Brand, style: LayoutStyle = brand.style): string {
  const f = getFont(brand.font).stack;
  const main = brand.mainColor;
  const accent = brand.accentColor;
  const contact = [
    person.phone && `T  ${person.phone}`,
    person.mobile && `M  ${person.mobile}`,
    person.email,
    brand.web,
  ].filter(Boolean) as string[];
  const parts: string[] = [`<rect width="${CARD_W}" height="${CARD_H}" fill="#FFFFFF"/>`];

  if (style === "kante") {
    parts.push(`<rect width="110" height="${CARD_H}" fill="${main}"/><rect x="110" width="10" height="${CARD_H}" fill="${accent}"/>`);
    parts.push(svgImage(brand.logo, 170, 50, 300, 90));
    parts.push(svgText(f, 170, 250, 46, person.name, { weight: 700 }));
    parts.push(svgText(f, 170, 300, 30, person.role, { color: readableOnWhite(main), weight: 600 }));
    contact.forEach((c, i) => parts.push(svgText(f, 170, 380 + i * 36, 26, c, { color: "#333333" })));
  } else if (style === "ruhig") {
    parts.push(svgText(f, 70, 120, 44, person.name, { weight: 600 }));
    parts.push(svgText(f, 70, 166, 28, person.role, { color: "#5E676C" }));
    contact.forEach((c, i) => parts.push(svgText(f, 70, 300 + i * 36, 26, c, { color: "#333333" })));
    parts.push(svgImage(brand.logo, 560, 410, 230, 80, "xMaxYMid"));
  } else {
    parts.push(svgImage(brand.logo, 70, 55, 320, 100));
    parts.push(`<rect x="70" y="205" width="60" height="6" fill="${accent}"/>`);
    parts.push(svgText(f, 70, 270, 46, person.name, { weight: 700 }));
    parts.push(svgText(f, 70, 314, 28, person.role, { color: readableOnWhite(main), weight: 600 }));
    contact.forEach((c, i) => parts.push(svgText(f, 70, 385 + i * 34, 24, c, { color: "#333333" })));
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
