/** Maskiert Text für HTML und SVG. */
export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Macht aus einem Namen einen Dateinamen, z. B. "Sabine Krämer" zu "sabine-kraemer". */
export function slug(value: string): string {
  const s = String(value ?? "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "datei";
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
