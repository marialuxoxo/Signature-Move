import { useRef, useState } from "react";
import type { Brand } from "../types";
import type { Action } from "../state/useAppState";
import { FONTS } from "../lib/fonts";
import { extractColors, loadImage, readFileAsDataUrl } from "../lib/browser";
import { AiCheck } from "./AiCheck";

const ACCEPTED = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_BYTES = 3 * 1024 * 1024;

interface Props {
  brand: Brand;
  dispatch: React.Dispatch<Action>;
  aiAvailable: boolean;
  notify: (msg: string, isError?: boolean) => void;
}

export function BrandPanel({ brand, dispatch, aiAvailable, notify }: Props) {
  const [target, setTarget] = useState<"mainColor" | "accentColor">("mainColor");
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

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
      else notify(`${colors.length} Farben aus dem Logo erkannt.${small ? " Hinweis: Das Logo ist klein und könnte im Druck unscharf werden." : ""}`, small);
    } catch {
      notify("Das Logo ließ sich nicht öffnen. Bitte eine andere Datei versuchen.", true);
    }
  }

  return (
    <section className="block" aria-labelledby="h-brand">
      <h2 id="h-brand">Logo und Farben</h2>
      <p className="hint">Logo als PNG, JPG oder SVG. Die Farben werden direkt aus dem Logo gelesen.</p>

      <label
        className={`drop${dragging ? " over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <div className="logo-box"><img src={brand.logo} alt="Aktuelles Logo" /></div>
        <div><b>Logo hochladen</b><span>Klicken oder Datei hierher ziehen</span></div>
        <input
          ref={input}
          type="file"
          accept={ACCEPTED.join(",")}
          onChange={(e) => { handleFile(e.target.files?.[0]); if (input.current) input.current.value = ""; }}
        />
      </label>

      <div className="seg" role="group" aria-label="Klick auf eine Farbe setzt">
        <button type="button" aria-pressed={target === "mainColor"} onClick={() => setTarget("mainColor")}>Klick setzt Hauptfarbe</button>
        <button type="button" aria-pressed={target === "accentColor"} onClick={() => setTarget("accentColor")}>Akzentfarbe</button>
      </div>
      <div className="swatches" aria-label="Farben aus dem Logo">
        {brand.swatches.map((hex) => (
          <button
            key={hex}
            type="button"
            className="swatch"
            style={{ background: hex }}
            title={hex}
            aria-label={`Farbe ${hex} übernehmen`}
            onClick={() => dispatch({ type: "brand", patch: { [target]: hex } })}
          />
        ))}
      </div>

      <div className="colors">
        {(["mainColor", "accentColor"] as const).map((key) => (
          <div className="colorfield" key={key}>
            <input
              type="color"
              value={brand[key]}
              aria-label={key === "mainColor" ? "Hauptfarbe" : "Akzentfarbe"}
              onChange={(e) => dispatch({ type: "brand", patch: { [key]: e.target.value.toUpperCase() } })}
            />
            <div><small>{key === "mainColor" ? "Hauptfarbe" : "Akzentfarbe"}</small><code>{brand[key].toUpperCase()}</code></div>
          </div>
        ))}
      </div>

      <label className="field">
        Hausschrift
        <select value={brand.font} onChange={(e) => dispatch({ type: "brand", patch: { font: e.target.value as Brand["font"] } })}>
          {FONTS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </label>

      {aiAvailable && <AiCheck brand={brand} dispatch={dispatch} notify={notify} />}
    </section>
  );
}
