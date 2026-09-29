/*
  Platzhalter für Personen ohne Porträtfoto. Nur in der Vorschau, nie in fertigen Dateien.
*/

const BG = "#E5E5EA";
const FG = "#AEAEB2";

/** Graue Silhouette als SVG-Bausteine, passend in einen Kreis um (cx, cy) mit Radius r. */
export function silhouetteSvg(cx: number, cy: number, r: number, clipId: string): string {
  return (
    `<defs><clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${BG}"/>` +
    `<g clip-path="url(#${clipId})">` +
    `<circle cx="${cx}" cy="${cy - r * 0.2}" r="${r * 0.34}" fill="${FG}"/>` +
    `<ellipse cx="${cx}" cy="${cy + r * 0.78}" rx="${r * 0.66}" ry="${r * 0.5}" fill="${FG}"/>` +
    `</g>`
  );
}

/** Dieselbe Silhouette als Bildadresse, für die HTML-Signatur. */
export const PHOTO_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${silhouetteSvg(50, 50, 50, "p")}</svg>`);
