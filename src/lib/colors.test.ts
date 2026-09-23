import { describe, expect, it } from "vitest";
import { contrast, hexToRgb, pickColors, readableOnWhite, rgbToHex, textOn } from "./colors";

describe("Farbumrechnung", () => {
  it("wandelt Hex in RGB und zurück", () => {
    expect(hexToRgb("#1E5A6E")).toEqual([30, 90, 110]);
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
    expect(rgbToHex(30, 90, 110)).toBe("#1E5A6E");
  });
});

describe("Kontrast", () => {
  it("Schwarz auf Weiß hat den höchsten Kontrast", () => {
    expect(contrast("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });
  it("wählt die lesbare Textfarbe", () => {
    expect(textOn("#1E5A6E")).toBe("#FFFFFF");
    expect(textOn("#FFED00")).not.toBe("#FFFFFF");
  });
  it("ersetzt zu helle Farben auf Weiß", () => {
    expect(readableOnWhite("#FFED00")).not.toBe("#FFED00");
    expect(readableOnWhite("#1E5A6E")).toBe("#1E5A6E");
  });
});

describe("Farben aus Logo lesen", () => {
  function pixels(colors: [number, number, number, number][], count: number[]): number[] {
    return colors.flatMap((c, i) => Array.from({ length: count[i] }, () => c).flat());
  }
  it("findet die Hauptfarben und ignoriert Weiß und Transparenz", () => {
    const px = pixels(
      [[255, 255, 255, 255], [30, 90, 110, 255], [211, 155, 53, 255], [0, 0, 0, 0]],
      [500, 200, 80, 300],
    );
    const found = pickColors(px);
    expect(found[0]).toBe("#1E5A6E");
    expect(found).toContain("#D39B35");
    expect(found).not.toContain("#FFFFFF");
  });
  it("fasst sehr ähnliche Farben zusammen", () => {
    const px = pixels([[30, 90, 110, 255], [34, 94, 114, 255]], [100, 100]);
    expect(pickColors(px)).toHaveLength(1);
  });
});
