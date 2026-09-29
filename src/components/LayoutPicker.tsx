import type { ReactElement } from "react";
import type { CardLayout, CardPhotoLayout, LetterLayout, SignatureLayout, SignaturePhotoLayout } from "../types";

/*
  Kleine Vorschaubildchen, die zeigen, wo Logo oder Porträtfoto sitzen.
  Blau ist das Logo, der graue Kreis das Foto, die Striche sind Text.
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

/* Porträtfoto: der graue Kreis ist das Foto */
const PHOTO = "#8E8E93";

const PHOTO_SIGNATURE: Record<SignaturePhotoLayout, ReactElement> = {
  none: <>{bars(10, 12, [22, 16, 28, 18])}</>,
  left: (
    <>
      <circle cx="14" cy="18" r="7" fill={PHOTO} />
      {bars(25, 12, [18, 14, 22, 12])}
    </>
  ),
  right: (
    <>
      {bars(7, 12, [18, 14, 22, 12])}
      <circle cx="42" cy="18" r="7" fill={PHOTO} />
    </>
  ),
  top: (
    <>
      <circle cx="13" cy="11" r="5.5" fill={PHOTO} />
      {bars(7, 21, [22, 16, 28])}
    </>
  ),
};

const PHOTO_CARD: Record<CardPhotoLayout, ReactElement> = {
  none: (
    <>
      <rect x="4" y="5" width="48" height="30" rx="2" fill="#fff" stroke={TEXT} />
      {bars(9, 12, [18, 12, 22], 4.5)}
    </>
  ),
  left: (
    <>
      <rect x="4" y="5" width="48" height="30" rx="2" fill="#fff" stroke={TEXT} />
      <circle cx="15" cy="20" r="6" fill={PHOTO} />
      {bars(25, 13, [16, 11, 20], 4.5)}
    </>
  ),
  right: (
    <>
      <rect x="4" y="5" width="48" height="30" rx="2" fill="#fff" stroke={TEXT} />
      {bars(9, 13, [16, 11, 20], 4.5)}
      <circle cx="41" cy="20" r="6" fill={PHOTO} />
    </>
  ),
};

export const DRAWINGS = {
  logoSignature: SIGNATURE,
  logoCard: CARD,
  logoLetter: LETTER,
  photoSignature: PHOTO_SIGNATURE,
  photoCard: PHOTO_CARD,
} as const;

interface Props<T extends string> {
  options: { id: T; label: string }[];
  drawings: Record<T, ReactElement>;
  value: T;
  onChange: (id: T) => void;
  label: string;
}

/** Auswahl mit kleinen Vorschaubildchen, wie ein Umschalter mit Bildern. */
export function LayoutPicker<T extends string>({ options, drawings, value, onChange, label }: Props<T>) {
  return (
    <div className="layout-picker" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className="layout-option" onClick={() => onChange(o.id)}>
          <svg viewBox="0 0 56 40" width="56" height="40" aria-hidden="true">
            {drawings[o.id]}
          </svg>
          <span>{o.label}</span>
        </button>
      ))}
    </div>
  );
}
