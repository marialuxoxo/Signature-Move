import type { Brand, LogoPositions } from "../types";
import { LAYOUT_STYLES, LOGO_POS_OPTIONS } from "../types";
import type { Action } from "../state/useAppState";
import { Section } from "./Section";
import { LayoutPicker } from "./LayoutPicker";

interface Props {
  brand: Brand;
  dispatch: React.Dispatch<Action>;
}

function label<K extends keyof LogoPositions>(kind: K, id: string): string {
  return (LOGO_POS_OPTIONS[kind] as { id: string; label: string }[]).find((o) => o.id === id)?.label.toLowerCase() ?? "";
}

/** Stil und Logo-Position für alle drei Vorlagen, vorab auswählbar. */
export function LayoutPanel({ brand, dispatch }: Props) {
  const pos = brand.logoPos;
  const setPos = (patch: Partial<LogoPositions>) => dispatch({ type: "brand", patch: { logoPos: { ...pos, ...patch } } });
  const style = LAYOUT_STYLES.find((s) => s.id === brand.style) ?? LAYOUT_STYLES[0];
  const summary = `${style.label}, Logo: Signatur ${label("signature", pos.signature)}, Karte ${label("card", pos.card)}, Brief ${label("letter", pos.letter)}`;

  return (
    <Section title="Aufbau" summary={summary} defaultOpen>
      <div className="group">
        <h3 className="group-title">Stil</h3>
        <div className="card card-pad">
          <div className="segmented segmented-fill" role="radiogroup" aria-label="Stil">
            {LAYOUT_STYLES.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={brand.style === s.id} onClick={() => dispatch({ type: "brand", patch: { style: s.id } })}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="card-hint">{style.hint}</p>
        </div>
      </div>

      <div className="group">
        <h3 className="group-title">Wo sitzt das Logo?</h3>
        <div className="card">
          <div className="layout-row">
            <span className="layout-row-label">Signatur</span>
            <LayoutPicker kind="signature" value={pos.signature} onChange={(id) => setPos({ signature: id })} />
          </div>
          <div className="layout-row">
            <span className="layout-row-label">Visitenkarte</span>
            <LayoutPicker kind="card" value={pos.card} onChange={(id) => setPos({ card: id })} />
          </div>
          <div className="layout-row">
            <span className="layout-row-label">Briefkopf</span>
            <LayoutPicker kind="letter" value={pos.letter} onChange={(id) => setPos({ letter: id })} />
          </div>
        </div>
      </div>
    </Section>
  );
}
