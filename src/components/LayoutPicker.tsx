import type { ReactElement } from "react";
import { LOGO_POS_OPTIONS, type CardLayout, type LetterLayout, type SignatureLayout } from "../types";

/*
  Kleine Vorschaubildchen, die zeigen, wo das Logo sitzt.
  Blau ist das Logo, die grauen Striche sind Text.
*/

const LOGO = "var(--blue)";
const INK = "#3A3A3C";
const TEXT = "#C7C7CC";

function bars(x: number, y: number, widths: number[], gap = 5.5) {
  return widths.map((w, i) => (
    <rect key={i} x={x} y={y + i * gap} width={w} height={i === 0 ? 3 : 2.4} rx="1.2" fill={i === 0 ? INK : TEXT} />
  ));
}

const SIGNATURE: Record<SignatureLayout, ReactElement> = {
  left: (
    <>
      <rect x="7" y="10" width="13" height="13" rx="2" fill={LOGO} />
      <rect x="24" y="9" width="1" height="22" fill={TEXT} />
      {bars(29, 10, [18, 14, 20, 12])}
    </>
  ),
  right: (
    <>
      {bars(7, 10, [18, 14, 20, 12])}
      <rect x="31" y="9" width="1" height="22" fill={TEXT} />
      <rect x="36" y="10" width="13" height="13" rx="2" fill={LOGO} />
    </>
  ),
  top: (
    <>
      <rect x="7" y="6" width="16" height="8" rx="2" fill={LOGO} />
      {bars(7, 19, [22, 16, 28])}
    </>
  ),
  bottom: (
    <>
      {bars(7, 6, [22, 16, 28])}
      <rect x="7" y="26" width="16" height="8" rx="2" fill={LOGO} />
    </>
  ),
};

const CARD: Record<CardLayout, ReactElement> = {
  top: (
    <>
      <rect x="4" y="5" width="48" height="30" rx="2" fill="#fff" stroke={TEXT} />
      <rect x="9" y="9" width="12" height="6" rx="1.5" fill={LOGO} />
      {bars(9, 20, [18, 12, 22], 4.5)}
    </>
  ),
  bottom: (
    <>
      <rect x="4" y="5" width="48" height="30" rx="2" fill="#fff" stroke={TEXT} />
      {bars(9, 10, [18, 12, 22], 4.5)}
      <rect x="35" y="24" width="12" height="6" rx="1.5" fill={LOGO} />
    </>
  ),
  right: (
    <>
      <rect x="4" y="5" width="48" height="30" rx="2" fill="#fff" stroke={TEXT} />
      {bars(9, 13, [16, 11, 18], 4.5)}
      <rect x="32" y="10" width="1" height="20" fill={TEXT} />
      <rect x="37" y="15" width="10" height="10" rx="1.5" fill={LOGO} />
    </>
  ),
};

function letterPage(logoX: number) {
  return (
    <>
      <rect x="15" y="2" width="26" height="36" rx="1.5" fill="#fff" stroke={TEXT} />
      <rect x={logoX} y="6" width="9" height="4.5" rx="1" fill={LOGO} />
      {[15, 19, 23, 27].map((y, i) => (
        <rect key={y} x="19" y={y} width={i === 3 ? 10 : 18} height="1.8" rx=".9" fill={TEXT} />
      ))}
    </>
  );
}

const LETTER: Record<LetterLayout, ReactElement> = {
  left: letterPage(19),
  center: letterPage(23.5),
  right: letterPage(28),
};

type Kind = "signature" | "card" | "letter";
const DRAWINGS: Record<Kind, Record<string, ReactElement>> = { signature: SIGNATURE, card: CARD, letter: LETTER };

interface Props<K extends Kind> {
  kind: K;
  value: string;
  onChange: (id: (typeof LOGO_POS_OPTIONS)[K][number]["id"]) => void;
}

export function LayoutPicker<K extends Kind>({ kind, value, onChange }: Props<K>) {
  const options = LOGO_POS_OPTIONS[kind] as { id: (typeof LOGO_POS_OPTIONS)[K][number]["id"]; label: string }[];
  return (
    <div className="layout-picker" role="radiogroup" aria-label="Position des Logos">
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className="layout-option" onClick={() => onChange(o.id)}>
          <svg viewBox="0 0 56 40" width="56" height="40" aria-hidden="true">
            {DRAWINGS[kind][o.id]}
          </svg>
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
