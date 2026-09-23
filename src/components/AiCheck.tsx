import { useState } from "react";
import type { AiCheckResult, Brand } from "../types";
import type { Action } from "../state/useAppState";
import { fontByName } from "../lib/fonts";
import { loadImage, toPngBase64 } from "../lib/browser";
import { runAiCheck } from "../lib/api";
import { LAYOUT_STYLES } from "../types";

interface Props {
  brand: Brand;
  dispatch: React.Dispatch<Action>;
  notify: (msg: string, isError?: boolean) => void;
}

export function AiCheck({ brand, dispatch, notify }: Props) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<AiCheckResult | null>(null);

  async function run() {
    setBusy(true);
    setResult(null);
    setStatus("Die KI schaut sich die Marke an. Das dauert meist 10 bis 30 Sekunden.");
    try {
      const img = await loadImage(brand.logo).catch(() => null);
      const png = img ? toPngBase64(img) : null;
      const { logo: _logo, swatches: _swatches, ...data } = brand;
      setResult(await runAiCheck(data, png));
      setStatus("");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Der KI-Check hat gerade nicht geklappt.");
    } finally {
      setBusy(false);
    }
  }

  const font = result ? fontByName(result.schrift) : undefined;
  const style = result ? LAYOUT_STYLES.find((s) => s.id === result.stil) : undefined;

  return (
    <div className="ai">
      <button className="btn ghost" type="button" onClick={run} disabled={busy}>KI-Check der Marke</button>
      <div className="ai-status" aria-live="polite">{status}</div>
      {result && (
        <div className="ai-out">
          {result.einschaetzung && <p>{result.einschaetzung}</p>}
          {result.farben && <p>{result.farben}</p>}
          {font && (
            <div className="sugg">
              <span>Schrift: <b>{font.name}</b><br />{result.schrift_grund}</span>
              <button className="btn small ghost" type="button" onClick={() => { dispatch({ type: "brand", patch: { font: font.id } }); notify("Schrift übernommen."); }}>Übernehmen</button>
            </div>
          )}
          {style && (
            <div className="sugg">
              <span>Gestaltung: <b>{style.label}</b><br />{result.stil_grund}</span>
              <button className="btn small ghost" type="button" onClick={() => { dispatch({ type: "brand", patch: { style: style.id } }); notify("Gestaltung übernommen."); }}>Übernehmen</button>
            </div>
          )}
          {result.claims.slice(0, 3).map((c) => (
            <div className="sugg" key={c}>
              <span>Claim: {c}</span>
              <button className="btn small ghost" type="button" onClick={() => { dispatch({ type: "brand", patch: { claim: c } }); notify("Claim übernommen."); }}>Übernehmen</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
