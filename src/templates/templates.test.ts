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
    expect(html).toContain("HRB 12345");
    expect(html).toContain("mailto:s.kraemer@rheinblick-verwaltung.de");
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
    expect(cardBack(brand, style)).toContain(style === "ruhig" ? "Verwaltung mit Weitblick" : "Hausverwaltung Rheinblick GmbH");
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
    expect(svg).toContain("USt-IdNr. DE123456789");
  });
});

describe("Dateinamen", () => {
  it("ersetzt Umlaute und Sonderzeichen", () => {
    expect(slug("Sabine Krämer")).toBe("sabine-kraemer");
    expect(slug("Große Straße 5!")).toBe("grosse-strasse-5");
    expect(slug("")).toBe("datei");
  });
});
