import { useRef } from "react";
import type { AppState, Person, Tab } from "../types";
import type { Action } from "../state/useAppState";
import { LAYOUT_STYLES } from "../types";
import { signatureDocument, signatureHtml } from "../templates/signature";
import { CARD_H, CARD_W, cardBack, cardFront, cardSheet } from "../templates/businessCard";
import { A4_H, A4_W, letterhead } from "../templates/letterhead";
import { svgDocument } from "../templates/svg";
import { copyHtml, downloadFile } from "../lib/browser";
import { slug } from "../lib/text";
import { ProofSheet } from "./ProofSheet";

const TABS: { id: Tab; label: string }[] = [
  { id: "signature", label: "E-Mail-Signatur" },
  { id: "card", label: "Visitenkarte" },
  { id: "letter", label: "Briefkopf" },
];

interface Props {
  state: AppState;
  active: Person;
  dispatch: React.Dispatch<Action>;
  notify: (msg: string, isError?: boolean) => void;
}

/** Alle Vorlagen-HTML ist vollständig maskiert (siehe lib/text.ts), daher sicher für innerHTML. */
function Svg({ markup }: { markup: string }) {
  return <div className="svg-host" dangerouslySetInnerHTML={{ __html: markup }} />;
}

export function Preview({ state, active, dispatch, notify }: Props) {
  const { brand, team, tab } = state;
  const sigRef = useRef<HTMLDivElement>(null);

  async function copySignature() {
    const html = signatureHtml(active, brand);
    if (await copyHtml(html)) return notify("Signatur kopiert. In Outlook unter Signaturen einfügen.");
    // Ausweichweg: sichtbare Signatur markieren und kopieren
    const el = sigRef.current;
    const sel = window.getSelection();
    if (el && sel) {
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
      const ok = document.execCommand("copy");
      sel.removeAllRanges();
      if (ok) return notify("Signatur kopiert.");
    }
    notify("Kopieren ist hier gesperrt. Bitte den Download nutzen.", true);
  }

  return (
    <main>
      <div className="bar">
        <div className="tabs" role="tablist" aria-label="Vorlage">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => dispatch({ type: "tab", tab: t.id })}>
              {t.label}
            </button>
          ))}
        </div>
        <label>
          Gestaltung
          <select value={brand.style} onChange={(e) => dispatch({ type: "brand", patch: { style: e.target.value as typeof brand.style } })}>
            {LAYOUT_STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <label>
          Für
          <select value={active.id} onChange={(e) => dispatch({ type: "select", id: e.target.value })}>
            {team.map((p) => <option key={p.id} value={p.id}>{p.name || "Neue Person"}</option>)}
          </select>
        </label>
      </div>

      {tab === "signature" && (
        <>
          <div className="mail">
            <div className="mail-head"><b>An:</b> eigentuemer@beispiel.de&nbsp;&nbsp;&nbsp;<b>Betreff:</b> Einladung zur Eigentümerversammlung</div>
            <div className="mail-body">
              <p className="fake">Guten Tag Herr Beispiel,</p>
              <p className="fake">anbei erhalten Sie die Einladung samt Tagesordnung.</p>
              <p className="fake last">Viele Grüße</p>
              <div ref={sigRef} dangerouslySetInnerHTML={{ __html: signatureHtml(active, brand) }} />
            </div>
          </div>
          <div className="actions">
            <button className="btn" type="button" onClick={copySignature}>Signatur kopieren</button>
            <button className="btn ghost" type="button" onClick={() => downloadFile(`signatur-${slug(active.name)}.html`, signatureDocument(active, brand), "text/html")}>
              Als HTML herunterladen
            </button>
          </div>
          <p className="note">Hinweis: Im Moment steckt das Logo direkt in der Signatur. Für den Echtbetrieb muss es auf einem Server liegen, damit Outlook es zuverlässig anzeigt.</p>
        </>
      )}

      {tab === "card" && (
        <>
          <div className="proofs">
            <ProofSheet label="Vorderseite, 85 × 55 mm" className="card-proof"><Svg markup={svgDocument(cardFront(active, brand), CARD_W, CARD_H, "Visitenkarte Vorderseite")} /></ProofSheet>
            <ProofSheet label="Rückseite, 85 × 55 mm" className="card-proof"><Svg markup={svgDocument(cardBack(brand), CARD_W, CARD_H, "Visitenkarte Rückseite")} /></ProofSheet>
          </div>
          <div className="actions">
            <button className="btn" type="button" onClick={() => downloadFile(`visitenkarte-${slug(active.name)}.svg`, cardSheet(active, brand), "image/svg+xml")}>
              Druckbogen herunterladen (SVG)
            </button>
          </div>
          <p className="note">Nächster Ausbauschritt: druckfertige PDF mit 3 mm Beschnitt und CMYK-Farben.</p>
        </>
      )}

      {tab === "letter" && (
        <>
          <div className="proofs">
            <ProofSheet label="DIN A4 nach DIN 5008, Form B" className="letter-proof"><Svg markup={svgDocument(letterhead(active, brand), A4_W, A4_H, "Briefkopf DIN A4")} /></ProofSheet>
          </div>
          <div className="actions">
            <button className="btn" type="button" onClick={() => downloadFile(`briefkopf-${slug(brand.name)}.svg`, svgDocument(letterhead(active, brand), A4_W, A4_H, "Briefkopf", true), "image/svg+xml")}>
              Briefkopf herunterladen (SVG)
            </button>
          </div>
          <p className="note">Nächster Ausbauschritt: Briefkopf als Word-Vorlage, in die man direkt hineinschreibt.</p>
        </>
      )}
    </main>
  );
}
