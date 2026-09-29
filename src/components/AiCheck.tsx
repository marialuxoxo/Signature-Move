import { useState } from "react";
import type { AiCheckResult, Brand } from "../types";
import type { Action } from "../state/useAppState";
import { fontByName } from "../lib/fonts";
import { loadImage, toPngBase64 } from "../lib/browser";
import { runAiCheck } from "../lib/api";
import { LAYOUT_STYLES } from "../types";
import { SparkIcon } from "./Icons";

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
    setStatus("Die KI schaut sich deine Marke an. Das dauert meist 10 bis 30 Sekunden.");
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

  const suggestion = (label: string, value: string, reason: string, apply: () => void, done: string) => (
    <div className="suggestion">
      <div className="suggestion-text">
        <span className="suggestion-label">{label}</span>
        <span className="suggestion-value">{value}</span>
        {reason && <span className="suggestion-reason">{reason}</span>}
      </div>
      <button className="btn btn-secondary btn-small" type="button" onClick={() => { apply(); notify(done); }}>
        Übernehmen
      </button>
    </div>
  );

  return (
    <div className="card card-pad ai-check">
      <div className="ai-check-head">
        <span className="ai-check-icon" aria-hidden="true"><SparkIcon /></span>
        <div>
          <h3 className="ai-check-title">KI-Check</h3>
          <p className="ai-check-intro">Prüft Logo, Farben und Lesbarkeit und schlägt Schrift, Gestaltung und Claim vor.</p>
        </div>
      </div>
      <button className="btn btn-secondary" type="button" onClick={run} disabled={busy}>
        {busy ? "Wird geprüft" : "Marke prüfen lassen"}
      </button>
      {status && <p className="ai-status" aria-live="polite">{status}</p>}
      {result && (
        <div className="ai-result">
          {result.einschaetzung && <p>{result.einschaetzung}</p>}
          {result.farben && <p>{result.farben}</p>}
          {font && suggestion("Schrift", font.name, result.schrift_grund, () => dispatch({ type: "brand", patch: { font: font.id } }), "Schrift übernommen.")}
          {style && suggestion("Gestaltung", style.label, result.stil_grund, () => dispatch({ type: "brand", patch: { style: style.id } }), "Gestaltung übernommen.")}
          {result.claims.slice(0, 3).map((c) => (
            <div key={c}>{suggestion("Claim", c, "", () => dispatch({ type: "brand", patch: { claim: c } }), "Claim übernommen.")}</div>
          ))}
        </div>
      )}
    </div>
  );
}
