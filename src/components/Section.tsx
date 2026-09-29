import { useId, useState, type ReactNode } from "react";
import { ChevronIcon } from "./Icons";

interface SectionProps {
  /** Nummer des Schritts. Die Reihenfolge Marke, Firmendaten, Team ist ein echter Ablauf. */
  step: number;
  title: string;
  /** Kurze Zusammenfassung, sichtbar auch im zugeklappten Zustand. */
  summary: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** Aufklappbarer Schritt in der Seitenleiste. */
export function Section({ step, title, summary, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <section className={`step${open ? " is-open" : ""}`}>
      <h2 className="step-head">
        <button type="button" id={`${id}-head`} aria-expanded={open} aria-controls={`${id}-body`} onClick={() => setOpen((o) => !o)}>
          <span className="step-num" aria-hidden="true">{step}</span>
          <span className="step-text">
            <span className="step-title">{title}</span>
            <span className="step-summary">{summary}</span>
          </span>
          <ChevronIcon className="step-chevron" />
        </button>
      </h2>
      <div className="step-body" id={`${id}-body`} role="region" aria-labelledby={`${id}-head`} hidden={!open}>
        {children}
      </div>
    </section>
  );
}
