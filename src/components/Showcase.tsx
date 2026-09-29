import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Brand, Person, Tab } from "../types";
import { signatureHtml } from "../templates/signature";
import { CARD_H, CARD_W, cardBack, cardFront } from "../templates/businessCard";
import { A4_H, A4_W, letterhead } from "../templates/letterhead";
import { svgDocument } from "../templates/svg";
import { SvgMarkup } from "./SvgMarkup";

/** Feste Bühne, die als Ganzes auf die verfügbare Breite skaliert wird. */
const STAGE_W = 1100;
const STAGE_H = 640;
const PREVIEW = { placeholder: true };

interface Props {
  brand: Brand;
  person: Person;
  onOpen: (tab: Tab) => void;
}

function Item({ className, label, tab, onOpen, children }: { className: string; label: string; tab: Tab; onOpen: (tab: Tab) => void; children: ReactNode }) {
  const open = () => onOpen(tab);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };
  return (
    <div className={`lay-item ${className}`} role="button" tabIndex={0} aria-label={`${label} ansehen`} onClick={open} onKeyDown={onKey}>
      {children}
      <span className="lay-tag" aria-hidden="true">{label}</span>
    </div>
  );
}

/**
 * Die ganze Geschäftsausstattung auf einen Blick, locker übereinandergelegt
 * wie bei einer Präsentation im Designstudio.
 */
export function Showcase({ brand, person, onOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / STAGE_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="lay" ref={ref} style={{ height: STAGE_H * scale }}>
      <div className="lay-stage" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
        <Item className="lay-letter" label="Briefkopf" tab="letter" onOpen={onOpen}>
          <SvgMarkup markup={svgDocument(letterhead(person, brand), A4_W, A4_H, "Briefkopf")} />
        </Item>
        <Item className="lay-mail" label="E-Mail-Signatur" tab="signature" onOpen={onOpen}>
          <div className="lay-mail-bar"><i /><i /><i /><span>Neue Nachricht</span></div>
          <div className="lay-mail-body">
            <p>Viele Grüße</p>
            <div dangerouslySetInnerHTML={{ __html: signatureHtml(person, brand, undefined, undefined, PREVIEW) }} />
          </div>
        </Item>
        <Item className="lay-card-back" label="Visitenkarte" tab="card" onOpen={onOpen}>
          <SvgMarkup markup={svgDocument(cardBack(brand), CARD_W, CARD_H, "Visitenkarte Rückseite")} />
        </Item>
        <Item className="lay-card-front" label="Visitenkarte" tab="card" onOpen={onOpen}>
          <SvgMarkup markup={svgDocument(cardFront(person, brand, undefined, undefined, PREVIEW), CARD_W, CARD_H, "Visitenkarte Vorderseite")} />
        </Item>
      </div>
    </div>
  );
}
