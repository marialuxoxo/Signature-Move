import type { Brand, LogoPositions, PhotoPositions } from "../types";
import { LAYOUT_STYLES, LOGO_POS_OPTIONS, PHOTO_POS_OPTIONS } from "../types";
import type { Action } from "../state/useAppState";
import { Section } from "./Section";
import { DRAWINGS, LayoutPicker } from "./LayoutPicker";

interface Props {
  brand: Brand;
  dispatch: React.Dispatch<Action>;
}

const lower = (options: { id: string; label: string }[], id: string) => options.find((o) => o.id === id)?.label.toLowerCase() ?? "";

/** Stil, Logo-Position und Foto-Position für die Vorlagen, vorab auswählbar. */
export function LayoutPanel({ brand, dispatch }: Props) {
  const logo = brand.logoPos;
  const photo = brand.photoPos;
  const setLogo = (patch: Partial<LogoPositions>) => dispatch({ type: "brand", patch: { logoPos: { ...logo, ...patch } } });
  const setPhoto = (patch: Partial<PhotoPositions>) => dispatch({ type: "brand", patch: { photoPos: { ...photo, ...patch } } });
  const style = LAYOUT_STYLES.find((s) => s.id === brand.style) ?? LAYOUT_STYLES[0];

  const photoOn = photo.signature !== "none" || photo.card !== "none";
  const summary = [
    style.label,
    `Logo in der Signatur ${lower(LOGO_POS_OPTIONS.signature, logo.signature)}`,
    photoOn ? "mit Foto" : "ohne Foto",
  ].join(", ");

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
            <LayoutPicker label="Logo in der Signatur" options={LOGO_POS_OPTIONS.signature} drawings={DRAWINGS.logoSignature} value={logo.signature} onChange={(id) => setLogo({ signature: id })} />
          </div>
          <div className="layout-row">
            <span className="layout-row-label">Visitenkarte</span>
            <LayoutPicker label="Logo auf der Visitenkarte" options={LOGO_POS_OPTIONS.card} drawings={DRAWINGS.logoCard} value={logo.card} onChange={(id) => setLogo({ card: id })} />
          </div>
          <div className="layout-row">
            <span className="layout-row-label">Briefkopf</span>
            <LayoutPicker label="Logo im Briefkopf" options={LOGO_POS_OPTIONS.letter} drawings={DRAWINGS.logoLetter} value={logo.letter} onChange={(id) => setLogo({ letter: id })} />
          </div>
        </div>
      </div>

      <div className="group">
        <h3 className="group-title">Wo sitzt das Porträtfoto?</h3>
        <div className="card">
          <div className="layout-row">
            <span className="layout-row-label">Signatur</span>
            <LayoutPicker label="Foto in der Signatur" options={PHOTO_POS_OPTIONS.signature} drawings={DRAWINGS.photoSignature} value={photo.signature} onChange={(id) => setPhoto({ signature: id })} />
          </div>
          <div className="layout-row">
            <span className="layout-row-label">Visitenkarte</span>
            <LayoutPicker label="Foto auf der Visitenkarte" options={PHOTO_POS_OPTIONS.card} drawings={DRAWINGS.photoCard} value={photo.card} onChange={(id) => setPhoto({ card: id })} />
          </div>
        </div>
        <p className="footnote">Die Fotos lädst du unten bei jeder Person im Team hoch.</p>
      </div>
    </Section>
  );
}
