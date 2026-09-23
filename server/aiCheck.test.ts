import { describe, expect, it } from "vitest";
import { buildPrompt, parseAiResult, validateBrand } from "./aiCheck";
import { DEMO_STATE } from "../src/demo";

const { logo: _l, swatches: _s, ...brand } = DEMO_STATE.brand;

describe("KI-Check", () => {
  it("baut eine Anweisung mit Firmendaten und Kontrastwerten", () => {
    const p = buildPrompt(brand, true);
    expect(p).toContain("Hausverwaltung Rheinblick GmbH");
    expect(p).toContain("Kontrast zu Weiß");
    expect(p).toContain("Das Logo liegt als Bild bei.");
  });

  it("liest JSON auch aus einem Codeblock", () => {
    const r = parseAiResult('```json\n{"einschaetzung":"Gut.","farben":"Lesbar.","schrift":"Lora","schrift_grund":"Warm.","stil":"kante","stil_grund":"Kräftig.","claims":["A","B","C","D"]}\n```');
    expect(r.stil).toBe("kante");
    expect(r.claims).toEqual(["A", "B", "C"]);
  });

  it("setzt einen unbekannten Stil auf klar", () => {
    expect(parseAiResult('{"stil":"bunt"}').stil).toBe("klar");
  });

  it("wirft einen Fehler ohne JSON", () => {
    expect(() => parseAiResult("Leider nein")).toThrow();
  });

  it("lehnt ungültige Eingaben ab", () => {
    expect(validateBrand(null)).toBeNull();
    expect(validateBrand({ ...brand, mainColor: "rot" })).toBeNull();
    expect(validateBrand({ ...brand, name: "" })).toBeNull();
    expect(validateBrand(brand)?.name).toBe(brand.name);
  });
});
