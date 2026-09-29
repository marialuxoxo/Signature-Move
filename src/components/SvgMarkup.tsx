/** Zeigt fertiges SVG-Markup aus den Vorlagen. Alle Vorlagen maskieren Eingaben (siehe lib/text.ts). */
export function SvgMarkup({ markup, className = "svg-host" }: { markup: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: markup }} />;
}
