import { describe, expect, it } from "vitest";
import { DEMO_STATE } from "../demo";
import { signatureHtml } from "./signature";
import { cardBack, cardFront, cardSheet } from "./businessCard";
import { letterhead } from "./letterhead";
import { slug } from "../lib/text";
import type { LayoutStyle } from "../types";

const brand = DEMO_STATE.brand;
const person = DEMO_STATE.team[0];
const styles: LayoutStyle[] = ["klar", "kante", "ruhig"];

describe("E-Mail-Signatur", () => {
  it.each(styles)("enthält Name, Funktion und Pflichtangaben (%s)", (style) => {
    const html = signatureHtml(person, brand, style);
    expect(html).toContain("Sabine Krämer");
    expect(html).toContain("Objektbetreuung WEG");
    expect(html).toContain("HRB 00000");
    expect(html).toContain("mailto:s.kraemer@beispiel-hv.example");
  });
  it("zeigt den Notdienst nur, wenn er eingetragen ist", () => {
    expect(signatureHtml(person, brand)).toContain("Notdienst");
    expect(signatureHtml(person, { ...brand, emergency: "" })).not.toContain("Notdienst");
  });
  it("maskiert Eingaben, damit kein fremdes HTML durchrutscht", () => {
    const html = signatureHtml({ ...person, name: '<script>alert("x")</script>' }, brand);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
  it("lässt leere Mobilnummer weg", () => {
    expect(signatureHtml({ ...person, mobile: "" }, brand)).not.toContain("M ");
  });
});

describe("Visitenkarte", () => {
  it.each(styles)("Vorder- und Rückseite enthalten die richtigen Daten (%s)", (style) => {
    expect(cardFront(person, brand, style)).toContain("Sabine Krämer");
    expect(cardBack(brand, style)).toContain(style === "ruhig" ? "Immobilienverwaltung in Köln" : "Beispiel Hausverwaltung GmbH");
  });
  it("Druckbogen ist ein gültiges SVG mit Schnittmarken und echten Maßen", () => {
    const svg = cardSheet(person, brand);
    expect(svg.startsWith("<?xml")).toBe(true);
    expect(svg).toContain("<line");
    expect(svg).toMatch(/width="\d+(\.\d+)?mm"/);
  });
});

describe("Briefkopf", () => {
  it("enthält Anschriftfeld, Infoblock und Fußzeile", () => {
    const svg = letterhead(person, brand, "klar", new Date(2026, 8, 23));
    expect(svg).toContain("[Empfänger]");
    expect(svg).toContain("Ihr Ansprechpartner");
    expect(svg).toContain("23.9.2026");
    expect(svg).toContain("USt-IdNr. DE000000000");
  });
});

describe("Dateinamen", () => {
  it("ersetzt Umlaute und Sonderzeichen", () => {
    expect(slug("Sabine Krämer")).toBe("sabine-kraemer");
    expect(slug("Große Straße 5!")).toBe("grosse-strasse-5");
    expect(slug("")).toBe("datei");
  });
});

describe("Logo-Position", () => {
  const logoFirst = (html: string) => html.indexOf("<img") < html.indexOf(person.name);

  it("Signatur: Logo links und oben vor dem Namen, rechts und unten danach", () => {
    expect(logoFirst(signatureHtml(person, brand, "klar", "left"))).toBe(true);
    expect(logoFirst(signatureHtml(person, brand, "klar", "top"))).toBe(true);
    expect(logoFirst(signatureHtml(person, brand, "klar", "right"))).toBe(false);
    expect(logoFirst(signatureHtml(person, brand, "klar", "bottom"))).toBe(false);
  });

  it("Signatur: nimmt die gespeicherte Position, wenn keine übergeben wird", () => {
    const b = { ...brand, logoPos: { ...brand.logoPos, signature: "right" as const } };
    expect(logoFirst(signatureHtml(person, b))).toBe(false);
  });

  it.each(styles)("Signatur: alle Positionen funktionieren im Stil %s", (style) => {
    for (const pos of ["left", "top", "bottom", "right"] as const) {
      const html = signatureHtml(person, brand, style, pos);
      expect(html).toContain(person.name);
      expect(html).toContain("<img");
    }
  });

  it("Visitenkarte: Logo oben, unten rechts oder rechts neben einer Linie", () => {
    expect(cardFront(person, brand, "klar", "top")).toContain('<image href');
    expect(cardFront(person, brand, "klar", "bottom")).toContain('x="560" y="400"');
    const right = cardFront(person, brand, "klar", "right");
    expect(right).toContain('<rect x="560" y="80"');
    expect(right).toContain('x="585" y="180"');
  });

  it("Briefkopf: Logo links, mittig oder rechts", () => {
    const d = new Date(2026, 8, 23);
    expect(letterhead(person, brand, "ruhig", d, "left")).toContain('x="250" y="120"');
    expect(letterhead(person, brand, "ruhig", d, "center")).toContain('x="725" y="120"');
    expect(letterhead(person, brand, "ruhig", d, "right")).toContain('x="1250" y="120"');
  });
});

describe("Porträtfoto", () => {
  const FOTO = "data:image/png;base64,AAAA";
  const withPhoto = { ...person, photo: FOTO };
  const b = (sig: "none" | "left" | "right" | "top", card: "none" | "left" | "right" = "none") => ({ ...brand, photoPos: { signature: sig, card } });

  it("Signatur: Foto links vor dem Namen, rechts danach", () => {
    const left = signatureHtml(withPhoto, b("left"));
    expect(left.indexOf(FOTO)).toBeLessThan(left.indexOf(person.name));
    const right = signatureHtml(withPhoto, b("right"));
    expect(right.indexOf(FOTO)).toBeGreaterThan(right.indexOf(person.name));
    const top = signatureHtml(withPhoto, b("top"));
    expect(top.indexOf(FOTO)).toBeLessThan(top.indexOf(person.name));
  });

  it("Signatur: ohne Foto-Position kein Foto", () => {
    expect(signatureHtml(withPhoto, b("none"))).not.toContain(FOTO);
  });

  it("Signatur: fehlendes Foto nur in der Vorschau als Platzhalter", () => {
    expect(signatureHtml(person, b("left"))).not.toContain("width=\"72\"");
    expect(signatureHtml(person, b("left"), undefined, undefined, { placeholder: true })).toContain("width=\"72\"");
  });

  it("Visitenkarte: Foto erscheint in allen Logo-Positionen, Platzhalter nur in der Vorschau", () => {
    for (const pos of ["top", "bottom", "right"] as const) {
      for (const side of ["left", "right"] as const) {
        expect(cardFront(withPhoto, b("none", side), "klar", pos)).toContain(FOTO);
        expect(cardFront(person, b("none", side), "klar", pos)).not.toContain("mw-card-photo");
        expect(cardFront(person, b("none", side), "klar", pos, { placeholder: true })).toContain("mw-card-photo");
      }
    }
  });
});
