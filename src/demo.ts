import { DEFAULT_LOGO_POS, DEFAULT_PHOTO_POS, type AppState } from "./types";

/** Beispiel-Logo, damit man ohne eigenes Logo sofort etwas sieht. */
export const DEMO_LOGO =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120"><rect width="360" height="120" fill="#fff"/>' +
      '<path d="M20 70 L60 34 L100 70" fill="none" stroke="#1E5A6E" stroke-width="10" stroke-linejoin="round"/>' +
      '<rect x="34" y="66" width="52" height="34" fill="#1E5A6E"/>' +
      '<path d="M14 104 C34 94 50 114 70 104 S106 94 116 104" fill="none" stroke="#D39B35" stroke-width="7" stroke-linecap="round"/>' +
      '<text x="132" y="62" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#1E5A6E">Beispiel</text>' +
      '<text x="133" y="92" font-family="Arial, sans-serif" font-size="17" letter-spacing="3" fill="#6A7479">HAUSVERWALTUNG</text></svg>',
  );

/**
 * Eine erfundene Beispielfirma. Alle Daten sind Platzhalter:
 * Die Domain endet auf .example (für Beispiele reserviert), die Telefonnummern stammen aus den
 * Bereichen, die die Bundesnetzagentur für Filme und Medien freigegeben hat, und sind nicht vergeben.
 */
export const DEMO_STATE: AppState = {
  brand: {
    name: "Beispiel Hausverwaltung GmbH",
    claim: "Immobilienverwaltung in Köln",
    street: "Musterstraße 12",
    city: "50667 Köln",
    phone: "0221 4710 100",
    web: "www.beispiel-hv.example",
    emergency: "0221 4710 199",
    ceo: "Anna Beispiel",
    register: "AG Köln, HRB 00000",
    vat: "DE000000000",
    bank: "[Bank], IBAN [DE__ ____ ____ ____ ____ __]",
    mainColor: "#1E5A6E",
    accentColor: "#D39B35",
    font: "source-sans",
    style: "klar",
    logoPos: { ...DEFAULT_LOGO_POS },
    photoPos: { ...DEFAULT_PHOTO_POS },
    logo: DEMO_LOGO,
    swatches: ["#1E5A6E", "#D39B35", "#6A7479"],
  },
  team: [
    { id: "p1", name: "Sabine Krämer", role: "Objektbetreuung WEG", phone: "0221 4710 121", mobile: "0171 3920021", email: "s.kraemer@beispiel-hv.example" },
    { id: "p2", name: "Tobias Heinen", role: "Buchhaltung", phone: "0221 4710 134", mobile: "", email: "t.heinen@beispiel-hv.example" },
    { id: "p3", name: "Leonie Weber", role: "Mietverwaltung", phone: "0221 4710 117", mobile: "0176 04069017", email: "l.weber@beispiel-hv.example" },
  ],
  activeId: "p1",
  tab: "overview",
};
