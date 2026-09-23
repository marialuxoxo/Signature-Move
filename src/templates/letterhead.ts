import type { Brand, LayoutStyle, Person } from "../types";
import { getFont } from "../lib/fonts";
import { svgImage, svgText } from "./svg";

/** DIN A4, 210 × 297 mm. */
export const A4_W = 2100;
export const A4_H = 2970;

/**
 * Briefkopf nach DIN 5008, Form B.
 * Anschriftfeld ab 45 mm von oben und 20 mm von links, Falzmarken bei 105 mm und 210 mm,
 * Lochmarke bei 148,5 mm. Alle Werte in Zehntelmillimetern.
 */
export function letterhead(person: Person, brand: Brand, style: LayoutStyle = brand.style, date = new Date()): string {
  const f = getFont(brand.font).stack;
  const main = brand.mainColor;
  const accent = brand.accentColor;
  const grey = "#6A7479";
  const out: string[] = [`<rect width="${A4_W}" height="${A4_H}" fill="#FFFFFF"/>`];

  if (style === "kante") out.push(`<rect width="${A4_W}" height="40" fill="${main}"/><rect y="40" width="${A4_W}" height="10" fill="${accent}"/>`);
  out.push(svgImage(brand.logo, 1250, 120, 650, 220, "xMaxYMid"));
  if (style === "klar") out.push(`<rect x="250" y="330" width="120" height="8" fill="${accent}"/>`);

  // Falz- und Lochmarken
  out.push(
    `<rect x="50" y="1049" width="60" height="3" fill="#9AA3A7"/>` +
      `<rect x="50" y="2099" width="60" height="3" fill="#9AA3A7"/>` +
      `<rect x="50" y="1484" width="90" height="3" fill="#9AA3A7"/>`,
  );

  // Rücksendeangabe und Anschriftfeld
  out.push(svgText(f, 250, 560, 24, `${brand.name}, ${brand.street}, ${brand.city}`, { color: grey }));
  out.push(`<rect x="250" y="572" width="780" height="2" fill="#C9D0CE"/>`);
  ["[Empfänger]", "[Straße Hausnummer]", "[PLZ Ort]"].forEach((l, i) => out.push(svgText(f, 250, 680 + i * 50, 36, l, { color: "#9AA3A7" })));

  // Informationsblock
  const info: [string, string][] = [
    ["Ihr Ansprechpartner", person.name],
    ["Telefon", person.phone || brand.phone],
    ["E-Mail", person.email],
    ["Datum", date.toLocaleDateString("de-DE")],
  ];
  info.forEach(([label, value], i) => {
    out.push(svgText(f, 1250, 560 + i * 72, 22, label, { color: grey }));
    out.push(svgText(f, 1250, 590 + i * 72, 28, value));
  });

  // Platzhalter für Betreff und Text
  out.push(svgText(f, 250, 1030, 38, "[Betreff]", { weight: 700 }));
  out.push(svgText(f, 250, 1140, 34, "Sehr geehrte Damen und Herren,", { color: "#333333" }));
  [1600, 1550, 1620, 1480, 1590, 1100, 1600, 1520, 900].forEach((w, i) =>
    out.push(`<rect x="250" y="${1200 + i * 62}" width="${w}" height="18" rx="9" fill="#E7EAE9"/>`),
  );
  out.push(svgText(f, 250, 1880, 34, "Mit freundlichen Grüßen", { color: "#333333" }));
  out.push(svgText(f, 250, 2040, 34, person.name, { color: "#333333" }));
  out.push(svgText(f, 250, 2084, 26, person.role, { color: grey }));

  // Fußzeile mit Pflichtangaben
  out.push(`<rect x="250" y="2690" width="1650" height="${style === "ruhig" ? 2 : 5}" fill="${style === "ruhig" ? "#C9D0CE" : main}"/>`);
  const columns: string[][] = [
    [brand.name, brand.street, brand.city],
    [`Telefon ${brand.phone}`, brand.web, brand.emergency ? `Notdienst ${brand.emergency}` : ""],
    [brand.ceo ? `Geschäftsführung: ${brand.ceo}` : "", brand.register, brand.vat ? `USt-IdNr. ${brand.vat}` : ""],
    brand.bank.split(", "),
  ];
  const xs = [250, 670, 1090, 1510];
  columns.forEach((col, ci) =>
    col.filter(Boolean).forEach((line, li) => out.push(svgText(f, xs[ci], 2760 + li * 36, 22, line, { color: "#5E676C" }))),
  );

  return out.join("");
}
