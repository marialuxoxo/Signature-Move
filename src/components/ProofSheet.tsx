import type { ReactNode } from "react";

/**
 * Zeigt eine Druckvorlage wie einen Andruck zur Abnahme:
 * mit Schnittmarken, Farbkontrollstreifen und Maßangabe.
 */
export function ProofSheet({ label, size, className, children }: { label: string; size: string; className?: string; children: ReactNode }) {
  return (
    <figure className={`proof ${className ?? ""}`}>
      <div className="proof-frame">
        <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />
        <div className="proof-paper">{children}</div>
      </div>
      <figcaption className="proof-slug">
        <span className="cmyk" aria-hidden="true"><i className="c" /><i className="m" /><i className="y" /><i className="k" /></span>
        <span className="proof-label">{label}</span>
        <span className="proof-size">{size}</span>
      </figcaption>
    </figure>
  );
}
