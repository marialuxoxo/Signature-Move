import type { AppState } from "./types";

/** Beispiel-Logo, damit man ohne eigenes Logo sofort etwas sieht. */
export const DEMO_LOGO =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120"><rect width="360" height="120" fill="#fff"/>' +
      '<path d="M20 70 L60 34 L100 70" fill="none" stroke="#1E5A6E" stroke-width="10" stroke-linejoin="round"/>' +
      '<rect x="34" y="66" width="52" height="34" fill="#1E5A6E"/>' +
      '<path d="M14 104 C34 94 50 114 70 104 S106 94 116 104" fill="none" stroke="#D39B35" stroke-width="7" stroke-linecap="round"/>' +
      '<text x="132" y="62" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#1E5A6E">Rheinblick</text>' +
      '<text x="133" y="92" font-family="Arial, sans-serif" font-size="17" letter-spacing="3" fill="#6A7479">HAUSVERWALTUNG</text></svg>',
  );

/** Eine erfundene Beispielfirma. Alle Daten sind Platzhalter. */
export const DEMO_STATE: AppState = {
  brand: {
    name: "Hausverwaltung Rheinblick GmbH",
    claim: "Verwaltung mit Weitblick",
    street: "Rheinallee 12",
    city: "56068 Koblenz",
    phone: "0261 123 45-0",
    web: "www.rheinblick-verwaltung.de",
    emergency: "0261 123 45-99",
    ceo: "Anna Beispiel",
    register: "AG Koblenz, HRB 12345",
    vat: "DE123456789",
    bank: "[Bank], IBAN [DE__ ____ ____ ____ ____ __]",
    mainColor: "#1E5A6E",
    accentColor: "#D39B35",
    font: "source-sans",
    style: "klar",
    logo: DEMO_LOGO,
    swatches: ["#1E5A6E", "#D39B35", "#6A7479"],
  },
  team: [
    { id: "p1", name: "Sabine Krämer", role: "Objektbetreuung WEG", phone: "0261 123 45-21", mobile: "0171 000 00 21", email: "s.kraemer@rheinblick-verwaltung.de" },
    { id: "p2", name: "Tobias Heinen", role: "Buchhaltung", phone: "0261 123 45-34", mobile: "", email: "t.heinen@rheinblick-verwaltung.de" },
    { id: "p3", name: "Leonie Weber", role: "Mietverwaltung", phone: "0261 123 45-17", mobile: "0151 000 00 17", email: "l.weber@rheinblick-verwaltung.de" },
  ],
  activeId: "p1",
  tab: "signature",
};
