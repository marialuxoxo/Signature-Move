import type { Brand, LayoutStyle, Person } from "../types";
import { getFont } from "../lib/fonts";
import { readableOnWhite, INK } from "../lib/colors";
import { esc } from "../lib/text";

/**
 * Baut eine E-Mail-Signatur als HTML.
 * Bewusst mit Tabellen und Inline-Styles, weil Outlook und andere Mailprogramme
 * modernes CSS nur eingeschränkt verstehen.
 */
export function signatureHtml(person: Person, brand: Brand, style: LayoutStyle = brand.style): string {
  const font = getFont(brand.font).stack.replace(/"/g, "'");
  const main = readableOnWhite(brand.mainColor);
  const accent = brand.accentColor;

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
  const address = `${esc(brand.name)}<br>${esc(brand.street)}, ${esc(brand.city)}`;

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

  const logo = (w: number) =>
    `<img src="${esc(brand.logo)}" alt="${esc(brand.name)}" width="${w}" style="display:block;width:${w}px;height:auto;border:0">`;
  const base = `font-family:${font};font-size:13px;line-height:1.5;color:#2B2B2B`;
  const name = (size: number, weight: number) =>
    `<div style="font-size:${size}px;font-weight:${weight};color:${INK}">${esc(person.name)}</div>`;

  if (style === "kante") {
    return (
      `<table cellpadding="0" cellspacing="0" border="0" style="${base};border-top:4px solid ${accent}">` +
      `<tr><td colspan="2" style="padding-top:12px">${name(16, 700)}<div style="color:${main};font-weight:600">${esc(person.role)}</div></td></tr>` +
      `<tr><td style="padding-top:10px;padding-right:22px;vertical-align:top">${phones}<br>${mail}</td>` +
      `<td style="padding-top:10px;vertical-align:top">${address}<br>${web}</td></tr>` +
      `<tr><td colspan="2" style="padding-top:12px">${logo(120)}</td></tr>` +
      emergency + legal + `</table>`
    );
  }

  if (style === "ruhig") {
    return (
      `<table cellpadding="0" cellspacing="0" border="0" style="${base}"><tr><td colspan="2">` +
      `${name(15, 600)}<div style="color:#5E676C">${esc(person.role)}</div>` +
      `<div style="margin-top:8px">${phones}<br>${mail}</div>` +
      `<div style="margin-top:8px;color:#5E676C">${address}<br>${web}</div></td></tr>` +
      `<tr><td colspan="2" style="padding-top:12px">${logo(96)}</td></tr>` +
      emergency + legal + `</table>`
    );
  }

  return (
    `<table cellpadding="0" cellspacing="0" border="0" style="${base}"><tr>` +
    `<td style="padding-right:18px;vertical-align:top">${logo(120)}</td>` +
    `<td style="border-left:2px solid ${main};padding-left:18px;vertical-align:top">` +
    `${name(16, 700)}<div style="color:${main};font-weight:600">${esc(person.role)}</div>` +
    `<div style="margin-top:8px">${phones}<br>${mail}</div>` +
    `<div style="margin-top:8px">${address}<br>${web}</div></td></tr>` +
    emergency + legal + `</table>`
  );
}

/** Komplettes HTML-Dokument mit Signatur, zum Herunterladen. */
export function signatureDocument(person: Person, brand: Brand, style?: LayoutStyle): string {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Signatur ${esc(person.name)}</title></head><body>${signatureHtml(person, brand, style)}</body></html>`;
}
