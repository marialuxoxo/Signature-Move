/** Gestaltungsvarianten, die für alle Vorlagen gelten. */
export type LayoutStyle = "klar" | "kante" | "ruhig";

export const LAYOUT_STYLES: { id: LayoutStyle; label: string; hint: string }[] = [
  { id: "klar", label: "Klar", hint: "Feine Linie in der Hauptfarbe" },
  { id: "kante", label: "Kante", hint: "Farbige Kante, kräftig" },
  { id: "ruhig", label: "Ruhig", hint: "Zurückhaltend, viel Weißraum" },
];

/** Wo das Logo sitzt, getrennt für jede Vorlage. */
export type SignatureLayout = "left" | "top" | "bottom" | "right";
export type CardLayout = "top" | "bottom" | "right";
export type LetterLayout = "left" | "center" | "right";

export interface LogoPositions {
  signature: SignatureLayout;
  card: CardLayout;
  letter: LetterLayout;
}

export const DEFAULT_LOGO_POS: LogoPositions = { signature: "left", card: "top", letter: "right" };

export const LOGO_POS_OPTIONS: {
  signature: { id: SignatureLayout; label: string }[];
  card: { id: CardLayout; label: string }[];
  letter: { id: LetterLayout; label: string }[];
} = {
  signature: [
    { id: "left", label: "Links" },
    { id: "top", label: "Oben" },
    { id: "bottom", label: "Unten" },
    { id: "right", label: "Rechts" },
  ],
  card: [
    { id: "top", label: "Oben" },
    { id: "bottom", label: "Unten" },
    { id: "right", label: "Rechts" },
  ],
  letter: [
    { id: "left", label: "Links" },
    { id: "center", label: "Mitte" },
    { id: "right", label: "Rechts" },
  ],
};

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
  /** Position des Logos in Signatur, Visitenkarte und Briefkopf. */
  logoPos: LogoPositions;
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

export type Tab = "overview" | "signature" | "card" | "letter";

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
