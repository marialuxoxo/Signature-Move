import type { FontId } from "../types";

export interface BrandFont {
  id: FontId;
  name: string;
  /** CSS-Schriftstapel mit sicheren Ausweichschriften für E-Mail-Programme. */
  stack: string;
}

export const FONTS: BrandFont[] = [
  { id: "source-sans", name: "Source Sans 3", stack: "'Source Sans 3', Arial, sans-serif" },
  { id: "franklin", name: "Libre Franklin", stack: "'Libre Franklin', Arial, sans-serif" },
  { id: "work", name: "Work Sans", stack: "'Work Sans', Arial, sans-serif" },
  { id: "plex", name: "IBM Plex Sans", stack: "'IBM Plex Sans', Arial, sans-serif" },
  { id: "lora", name: "Lora", stack: "Lora, Georgia, serif" },
  { id: "merri", name: "Merriweather", stack: "Merriweather, Georgia, serif" },
];

export function getFont(id: FontId): BrandFont {
  return FONTS.find((f) => f.id === id) ?? FONTS[0];
}

export function fontByName(name: string): BrandFont | undefined {
  return FONTS.find((f) => f.name.toLowerCase() === name.trim().toLowerCase());
}
