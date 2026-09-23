/** Gestaltungsvarianten, die für alle Vorlagen gelten. */
export type LayoutStyle = "klar" | "kante" | "ruhig";

export const LAYOUT_STYLES: { id: LayoutStyle; label: string; hint: string }[] = [
  { id: "klar", label: "Klar", hint: "Logo links, Farblinie" },
  { id: "kante", label: "Kante", hint: "Farbige Kante, kräftig" },
  { id: "ruhig", label: "Ruhig", hint: "Zurückhaltend, viel Weißraum" },
];

export type FontId = "source-sans" | "franklin" | "work" | "plex" | "lora" | "merri";

/** Alles, was einmal pro Firma gepflegt wird. */
export interface Brand {
  name: string;
  claim: string;
  street: string;
  city: string;
  phone: string;
  web: string;
  emergency: string;
  ceo: string;
  register: string;
  vat: string;
  bank: string;
  mainColor: string;
  accentColor: string;
  font: FontId;
  style: LayoutStyle;
  /** Logo als Data-URL. Im echten Betrieb später eine gehostete URL. */
  logo: string;
  /** Aus dem Logo erkannte Farben. */
  swatches: string[];
}

/** Eine Person im Team. */
export interface Person {
  id: string;
  name: string;
  role: string;
  phone: string;
  mobile: string;
  email: string;
}

export type Tab = "signature" | "card" | "letter";

export interface AppState {
  brand: Brand;
  team: Person[];
  activeId: string;
  tab: Tab;
}

/** Antwort des KI-Checks. */
export interface AiCheckResult {
  einschaetzung: string;
  farben: string;
  schrift: string;
  schrift_grund: string;
  stil: LayoutStyle;
  stil_grund: string;
  claims: string[];
}
