import type { ReactNode } from "react";

/** Zeigt eine Druckvorlage wie einen Andruck: mit Schnittmarken und Farbkontrollstreifen. */
export function ProofSheet({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={`proof ${className ?? ""}`}>
      <div className="frame">
        <span className="crop tl" /><span className="crop tr" /><span className="crop bl" /><span className="crop br" />
        <div className="obj">{children}</div>
      </div>
      <div className="slug">
        <span className="cmyk" aria-hidden="true"><i className="c" /><i className="m" /><i className="y" /><i className="k" /></span>
        {label}
      </div>
    </div>
  );
}
