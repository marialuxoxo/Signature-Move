import { useId, useRef, useState } from "react";
import type { Brand } from "../types";
import { LAYOUT_STYLES } from "../types";
import type { Action } from "../state/useAppState";
import { FONTS, getFont } from "../lib/fonts";
import { extractColors, loadImage, readFileAsDataUrl } from "../lib/browser";
import { AiCheck } from "./AiCheck";
import { Section } from "./Section";
import { UploadIcon } from "./Icons";

const ACCEPTED = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_BYTES = 3 * 1024 * 1024;

type ColorKey = "mainColor" | "accentColor";
const COLOR_LABEL: Record<ColorKey, string> = { mainColor: "Hauptfarbe", accentColor: "Akzentfarbe" };

interface Props {
  brand: Brand;
  dispatch: React.Dispatch<Action>;
  aiAvailable: boolean;
  notify: (msg: string, isError?: boolean) => void;
}

export function BrandPanel({ brand, dispatch, aiAvailable, notify }: Props) {
  const [target, setTarget] = useState<ColorKey>("mainColor");
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const ids = useId();

  async function handleFile(file?: File) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) return notify("Bitte ein Logo als PNG, JPG, SVG oder WebP wählen.", true);
    if (file.size > MAX_BYTES) return notify("Das Logo ist größer als 3 MB. Bitte eine kleinere Datei wählen.", true);
    try {
      const url = await readFileAsDataUrl(file);
      const img = await loadImage(url);
      const colors = extractColors(img);
      dispatch({
        type: "brand",
        patch: {
          logo: url,
          swatches: colors,
          ...(colors[0] ? { mainColor: colors[0] } : {}),
          ...(colors[1] ? { accentColor: colors[1] } : {}),
        },
      });
      const small = file.type !== "image/svg+xml" && img.naturalWidth > 0 && img.naturalWidth < 400;
      if (!colors.length) notify("Logo übernommen. Farben bitte von Hand wählen.");
      else notify(`${colors.length} Farben aus dem Logo erkannt.${small ? " Das Logo ist klein und könnte im Druck unscharf werden." : ""}`, small);
    } catch {
      notify("Das Logo ließ sich nicht öffnen. Bitte eine andere Datei versuchen.", true);
    }
  }

  const styleLabel = LAYOUT_STYLES.find((s) => s.id === brand.style)?.label ?? "Klar";
  const summary = (
    <>
      <span className="mini-swatch" style={{ background: brand.mainColor }} />
      <span className="mini-swatch" style={{ background: brand.accentColor }} />
      {getFont(brand.font).name}, Gestaltung {styleLabel}
    </>
  );

  return (
    <Section step={1} title="Marke" summary={summary} defaultOpen>
      <label
        className={`logo-drop${dragging ? " is-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <span className="logo-drop-preview"><img src={brand.logo} alt="Aktuelles Logo" /></span>
        <span className="logo-drop-text">
          <span className="logo-drop-action"><UploadIcon /> Logo ersetzen</span>
          <span className="logo-drop-hint">PNG, JPG, SVG oder WebP bis 3 MB. Datei hierher ziehen oder klicken.</span>
        </span>
        <input
          ref={input}
          id={`${ids}-logo`}
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={(e) => { handleFile(e.target.files?.[0]); if (input.current) input.current.value = ""; }}
        />
      </label>

      <div className="group">
        <h3 className="group-title">Farben</h3>
        <div className="color-chips">
          {(Object.keys(COLOR_LABEL) as ColorKey[]).map((key) => (
            <label className="color-chip" key={key} htmlFor={`${ids}-${key}`}>
              <span className="color-chip-fill" style={{ background: brand[key] }} />
              <span className="color-chip-meta">
                <span className="color-chip-name">{COLOR_LABEL[key]}</span>
                <span className="color-chip-hex">{brand[key].toUpperCase()}</span>
              </span>
              <input
                id={`${ids}-${key}`}
                type="color"
                value={brand[key]}
                onChange={(e) => dispatch({ type: "brand", patch: { [key]: e.target.value.toUpperCase() } })}
              />
            </label>
          ))}
        </div>

        {brand.swatches.length > 0 && (
          <div className="from-logo">
            <span className="from-logo-label">Aus dem Logo erkannt</span>
            <div className="swatches">
              {brand.swatches.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className="swatch"
                  style={{ background: hex }}
                  title={`${hex} als ${COLOR_LABEL[target]} übernehmen`}
                  aria-label={`${hex} als ${COLOR_LABEL[target]} übernehmen`}
                  onClick={() => dispatch({ type: "brand", patch: { [target]: hex } })}
                />
              ))}
            </div>
            <div className="segmented segmented-small" role="radiogroup" aria-label="Logofarbe übernehmen als">
              {(Object.keys(COLOR_LABEL) as ColorKey[]).map((key) => (
                <button key={key} type="button" role="radio" aria-checked={target === key} onClick={() => setTarget(key)}>
                  {key === "mainColor" ? "als Haupt" : "als Akzent"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor={`${ids}-font`}>Hausschrift</label>
        <select id={`${ids}-font`} value={brand.font} onChange={(e) => dispatch({ type: "brand", patch: { font: e.target.value as Brand["font"] } })}>
          {FONTS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      {aiAvailable && <AiCheck brand={brand} dispatch={dispatch} notify={notify} />}
    </Section>
  );
}
