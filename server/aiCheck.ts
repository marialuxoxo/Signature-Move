import type { AiCheckResult, Brand, LayoutStyle } from "../src/types";
import { FONTS, getFont } from "../src/lib/fonts";
import { contrast } from "../src/lib/colors";

export type BrandInput = Omit<Brand, "logo" | "swatches">;

const STYLES: LayoutStyle[] = ["klar", "kante", "ruhig"];

/** Baut die Anweisung für Claude. Alle Daten aus dem Formular kommen hier hinein. */
export function buildPrompt(brand: BrandInput, withImage: boolean): string {
  return [
    "Du prüfst die Markengrundlagen einer deutschen Firma für einen Generator von E-Mail-Signaturen, Visitenkarten und Briefköpfen.",
    `Firma: ${brand.name}`,
    `Claim: ${brand.claim || "(keiner)"}`,
    `Hauptfarbe: ${brand.mainColor} (Kontrast zu Weiß: ${contrast(brand.mainColor, "#FFFFFF").toFixed(1)}:1)`,
    `Akzentfarbe: ${brand.accentColor} (Kontrast zu Weiß: ${contrast(brand.accentColor, "#FFFFFF").toFixed(1)}:1)`,
    withImage ? "Das Logo liegt als Bild bei." : "Ein Logo liegt nicht bei.",
    `Aktuelle Schrift: ${getFont(brand.font).name}`,
    `Wählbare Schriften: ${FONTS.map((f) => f.name).join(", ")}`,
    "Wählbare Gestaltungen: klar (Logo links, Farblinie), kante (farbige Kante, kräftig), ruhig (zurückhaltend, viel Weißraum).",
    "Schreibe auf Deutsch, einfach und ohne Fachbegriffe, ohne Gedankenstriche.",
    "Antworte nur mit JSON in genau dieser Form, ohne weiteren Text:",
    '{"einschaetzung":"2 Sätze zur Marke","farben":"1 Satz zu Lesbarkeit und Kontrast","schrift":"eine der wählbaren Schriften","schrift_grund":"1 kurzer Satz","stil":"klar|kante|ruhig","stil_grund":"1 kurzer Satz","claims":["3 kurze Claim-Vorschläge, je höchstens 5 Wörter"]}',
  ].join("\n");
}

/** Liest die Antwort tolerant ein: reines JSON, JSON im Codeblock oder JSON mit etwas Text drumherum. */
export function parseAiResult(text: string): AiCheckResult {
  let raw = text.trim();
  const fence = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) raw = fence[1].trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("Keine JSON-Antwort erhalten");
  const data = JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>;

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const stil = STYLES.includes(data.stil as LayoutStyle) ? (data.stil as LayoutStyle) : "klar";
  return {
    einschaetzung: str(data.einschaetzung),
    farben: str(data.farben),
    schrift: str(data.schrift),
    schrift_grund: str(data.schrift_grund),
    stil,
    stil_grund: str(data.stil_grund),
    claims: Array.isArray(data.claims) ? data.claims.map(str).filter(Boolean).slice(0, 3) : [],
  };
}

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Prüft die Eingabe aus dem Browser, bevor sie an Claude geht. */
export function validateBrand(input: unknown): BrandInput | null {
  if (!input || typeof input !== "object") return null;
  const b = input as Record<string, unknown>;
  if (typeof b.name !== "string" || !b.name.trim()) return null;
  if (typeof b.mainColor !== "string" || !HEX.test(b.mainColor)) return null;
  if (typeof b.accentColor !== "string" || !HEX.test(b.accentColor)) return null;
  const s = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");
  return {
    name: s(b.name),
    claim: s(b.claim),
    street: s(b.street),
    city: s(b.city),
    phone: s(b.phone),
    web: s(b.web),
    emergency: s(b.emergency),
    ceo: s(b.ceo),
    register: s(b.register),
    vat: s(b.vat),
    bank: s(b.bank),
    mainColor: b.mainColor,
    accentColor: b.accentColor,
    font: FONTS.some((f) => f.id === b.font) ? (b.font as BrandInput["font"]) : FONTS[0].id,
    style: STYLES.includes(b.style as LayoutStyle) ? (b.style as LayoutStyle) : "klar",
  };
}
