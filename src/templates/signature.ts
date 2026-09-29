import type { Brand, LayoutStyle, Person, RenderOptions, SignatureLayout, SignaturePhotoLayout } from "../types";
import { getFont } from "../lib/fonts";
import { readableOnWhite, INK } from "../lib/colors";
import { esc } from "../lib/text";
import { PHOTO_PLACEHOLDER } from "./photo";

/**
 * Baut eine E-Mail-Signatur als HTML.
 * Bewusst mit Tabellen und Inline-Styles, weil Outlook und andere Mailprogramme
 * modernes CSS nur eingeschränkt verstehen.
 *
 * Der Stil bestimmt Linien und Farben, die Position bestimmt, wo das Logo sitzt.
 * Das Porträtfoto sitzt links, rechts oder über dem Text der Person.
 */
export function signatureHtml(
  person: Person,
  brand: Brand,
  style: LayoutStyle = brand.style,
  pos: SignatureLayout = brand.logoPos?.signature ?? "left",
  opts: RenderOptions = {},
  photoPos: SignaturePhotoLayout = brand.photoPos?.signature ?? "none",
): string {
  const font = getFont(brand.font).stack.replace(/"/g, "'");
  const main = readableOnWhite(brand.mainColor);
  const accent = brand.accentColor;
  const quiet = style === "ruhig";

  const phones = [person.phone && `T ${esc(person.phone)}`, person.mobile && `M ${esc(person.mobile)}`]
    .filter(Boolean)
    .join("&nbsp;&nbsp;|&nbsp;&nbsp;");
  const mail = person.email
    ? `<a href="mailto:${esc(person.email)}" style="color:${main};text-decoration:none">${esc(person.email)}</a>`
    : "";
  const webHref = brand.web.replace(/^https?:\/\//, "");
  const web = brand.web
    ? `<a href="https://${esc(webHref)}" style="color:${main};text-decoration:none">${esc(brand.web)}</a>`
    : "";

  const logoWidth = quiet ? 96 : 120;
  const logo = `<img src="${esc(brand.logo)}" alt="${esc(brand.name)}" width="${logoWidth}" style="display:block;width:${logoWidth}px;height:auto;border:0">`;

  const text =
    `<div style="font-size:16px;font-weight:${quiet ? 600 : 700};color:${INK}">${esc(person.name)}</div>` +
    `<div style="color:${quiet ? "#5E676C" : main};font-weight:${quiet ? 400 : 600}">${esc(person.role)}</div>` +
    `<div style="margin-top:8px">${phones}${phones && mail ? "<br>" : ""}${mail}</div>` +
    `<div style="margin-top:8px${quiet ? ";color:#5E676C" : ""}">${esc(brand.name)}<br>${esc(brand.street)}, ${esc(brand.city)}${web ? "<br>" + web : ""}</div>`;

  const base = `font-family:${font};font-size:13px;line-height:1.5;color:#2B2B2B`;

  // Porträtfoto neben oder über dem Text. Ohne Foto nur in der Vorschau ein Platzhalter.
  const photoSrc = person.photo || (opts.placeholder ? PHOTO_PLACEHOLDER : "");
  let personBlock = text;
  if (photoSrc && photoPos !== "none") {
    const photo = `<img src="${esc(photoSrc)}" alt="${esc(person.name)}" width="72" height="72" style="display:block;width:72px;height:72px;border:0;border-radius:36px">`;
    if (photoPos === "top") {
      personBlock = `${photo}<div style="height:10px;line-height:10px;font-size:0">&nbsp;</div>${text}`;
    } else {
      const photoCell = `<td style="vertical-align:top;padding-${photoPos === "left" ? "right" : "left"}:14px">${photo}</td>`;
      const textCell = `<td style="vertical-align:top">${text}</td>`;
      personBlock = `<table cellpadding="0" cellspacing="0" border="0" style="${base}"><tr>${photoPos === "left" ? photoCell + textCell : textCell + photoCell}</tr></table>`;
    }
  }

  // Trennlinie zwischen Logo und Text, je nach Stil
  const rule = style === "kante" ? `3px solid ${accent}` : quiet ? "1px solid #D5D8DC" : `2px solid ${main}`;
  const topBorder = style === "kante" ? `;border-top:4px solid ${accent}` : "";
  const firstPad = style === "kante" ? "padding-top:12px;" : "";

  let body: string;
  if (pos === "left" || pos === "right") {
    const side = pos === "left" ? "left" : "right";
    const logoCell = `<td style="${firstPad}vertical-align:top;padding-${pos === "left" ? "right" : "left"}:18px">${logo}</td>`;
    const textCell = `<td style="${firstPad}vertical-align:top;border-${side}:${rule};padding-${side}:18px">${personBlock}</td>`;
    body = `<tr>${pos === "left" ? logoCell + textCell : textCell + logoCell}</tr>`;
  } else {
    const logoRow = `<tr><td colspan="2" style="${pos === "top" ? firstPad : ""}">${logo}</td></tr>`;
    const ruleRow = `<tr><td colspan="2" style="padding:12px 0"><div style="width:48px;height:0;line-height:0;font-size:0;border-top:${rule}"></div></td></tr>`;
    const textRow = `<tr><td colspan="2" style="${pos === "bottom" ? firstPad : ""}">${personBlock}</td></tr>`;
    body = pos === "top" ? logoRow + ruleRow + textRow : textRow + ruleRow + logoRow;
  }

  const emergency = brand.emergency
    ? `<tr><td colspan="2" style="padding-top:10px;font-size:12.5px;color:#333333">` +
      `<span style="display:inline-block;width:8px;height:8px;border-radius:4px;background:${accent};margin-right:6px"></span>` +
      `Notdienst außerhalb der Bürozeiten: <b>${esc(brand.emergency)}</b></td></tr>`
    : "";

  const legalParts = [
    esc(brand.name),
    brand.ceo && `Geschäftsführung: ${esc(brand.ceo)}`,
    esc(brand.register),
    brand.vat && `USt-IdNr. ${esc(brand.vat)}`,
  ].filter(Boolean);
  const legal = `<tr><td colspan="2" style="padding-top:10px;font-size:10.5px;line-height:1.4;color:#7A8286">${legalParts.join(", ")}</td></tr>`;

  return `<table cellpadding="0" cellspacing="0" border="0" style="${base}${topBorder}">${body}${emergency}${legal}</table>`;
}

/** Komplettes HTML-Dokument mit Signatur, zum Herunterladen. */
export function signatureDocument(person: Person, brand: Brand, style?: LayoutStyle, pos?: SignatureLayout): string {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Signatur ${esc(person.name)}</title></head><body>${signatureHtml(person, brand, style, pos)}</body></html>`;
}
