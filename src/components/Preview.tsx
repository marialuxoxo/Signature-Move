import { useId, useRef, type ReactElement } from "react";
import type { AppState, Person, Tab } from "../types";
import type { Action } from "../state/useAppState";
import { signatureDocument, signatureHtml } from "../templates/signature";
import { CARD_H, CARD_W, cardBack, cardFront, cardSheet } from "../templates/businessCard";
import { A4_H, A4_W, letterhead } from "../templates/letterhead";
import { svgDocument } from "../templates/svg";
import { copyHtml, downloadFile } from "../lib/browser";
import { tint } from "../lib/colors";
import { slug } from "../lib/text";
import { ProofSheet } from "./ProofSheet";
import { Showcase } from "./Showcase";
import { SvgMarkup } from "./SvgMarkup";
import { CopyIcon, DownloadIcon } from "./Icons";

/** In der Vorschau zeigen fehlende Fotos einen Platzhalter, in Downloads nicht. */
const PREVIEW = { placeholder: true };

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Übersicht" },
  { id: "signature", label: "Signatur" },
  { id: "card", label: "Visitenkarte" },
  { id: "letter", label: "Briefkopf" },
];

interface Props {
  state: AppState;
  active: Person;
  dispatch: React.Dispatch<Action>;
  notify: (msg: string, isError?: boolean) => void;
}

export function Preview({ state, active, dispatch, notify }: Props) {
  const { brand, team, tab } = state;
  const sigRef = useRef<HTMLDivElement>(null);
  const ids = useId();
  const open = (t: Tab) => dispatch({ type: "tab", tab: t });

  async function copySignature() {
    const html = signatureHtml(active, brand);
    if (await copyHtml(html)) return notify("Signatur kopiert. Jetzt in Outlook unter Signaturen einfügen.");
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
    notify("Kopieren ist hier gesperrt. Lade die Signatur stattdessen herunter.", true);
  }

  const actions: Record<Tab, ReactElement | null> = {
    overview: null,
    signature: (
      <>
        <button className="btn btn-secondary" type="button" onClick={() => downloadFile(`signatur-${slug(active.name)}.html`, signatureDocument(active, brand), "text/html")}>
          <DownloadIcon /> Als HTML
        </button>
        <button className="btn btn-primary" type="button" onClick={copySignature}>
          <CopyIcon /> Signatur kopieren
        </button>
      </>
    ),
    card: (
      <button className="btn btn-primary" type="button" onClick={() => downloadFile(`visitenkarte-${slug(active.name)}.svg`, cardSheet(active, brand), "image/svg+xml")}>
        <DownloadIcon /> Druckbogen laden
      </button>
    ),
    letter: (
      <button className="btn btn-primary" type="button" onClick={() => downloadFile(`briefkopf-${slug(brand.name)}.svg`, svgDocument(letterhead(active, brand), A4_W, A4_H, "Briefkopf", true), "image/svg+xml")}>
        <DownloadIcon /> Briefkopf laden
      </button>
    ),
  };

  const people = `${team.length}\u00a0${team.length === 1 ? "Person" : "Personen"}`;

  return (
    <main className="canvas">
      <div className="tabs-wrap">
        <div className="tabs" role="tablist" aria-label="Ansicht">
          {TABS.map((t) => (
            <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => open(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-group">
          <label className="toolbar-label" htmlFor={`${ids}-person`}>Für</label>
          <select id={`${ids}-person`} className="toolbar-select" value={active.id} onChange={(e) => dispatch({ type: "select", id: e.target.value })}>
            {team.map((p) => <option key={p.id} value={p.id}>{p.name || "Neue Person"}</option>)}
          </select>
        </div>
        {actions[tab] && <div className="toolbar-actions">{actions[tab]}</div>}
      </div>

      <div className={`stage stage-${tab}`} style={{ background: tint(brand.mainColor, 0.08) }}>
        {tab === "overview" && (
          <>
            <div className="hero">
              <h2 className="hero-title">Logo rein. Alles fertig.</h2>
              <p className="hero-sub">Signatur, Visitenkarte und Briefkopf für {people}. Klick auf ein Teil, um es groß zu sehen.</p>
            </div>
            <Showcase brand={brand} person={active} onOpen={open} />
          </>
        )}

        {tab === "signature" && (
          <div className="composer">
            <div className="composer-bar"><i /><i /><i /><span>Neue Nachricht</span></div>
            <div className="composer-field"><span>An</span>eigentuemer@beispiel.de</div>
            <div className="composer-field"><span>Betreff</span>Einladung zur Eigentümerversammlung</div>
            <div className="composer-body">
              <p className="composer-text">Guten Tag Herr Beispiel,</p>
              <p className="composer-text">anbei erhalten Sie die Einladung samt Tagesordnung.</p>
              <p className="composer-text composer-text-last">Viele Grüße</p>
              <div className="composer-signature" ref={sigRef} dangerouslySetInnerHTML={{ __html: signatureHtml(active, brand, undefined, undefined, PREVIEW) }} />
            </div>
          </div>
        )}

        {tab === "card" && (
          <div className="proofs">
            <ProofSheet label="Vorderseite" size="85 × 55 mm" className="proof-card">
              <SvgMarkup markup={svgDocument(cardFront(active, brand, undefined, undefined, PREVIEW), CARD_W, CARD_H, "Visitenkarte Vorderseite")} />
            </ProofSheet>
            <ProofSheet label="Rückseite" size="85 × 55 mm" className="proof-card">
              <SvgMarkup markup={svgDocument(cardBack(brand), CARD_W, CARD_H, "Visitenkarte Rückseite")} />
            </ProofSheet>
          </div>
        )}

        {tab === "letter" && (
          <div className="proofs">
            <ProofSheet label="Briefkopf nach DIN 5008" size="210 × 297 mm" className="proof-letter">
              <SvgMarkup markup={svgDocument(letterhead(active, brand), A4_W, A4_H, "Briefkopf DIN A4")} />
            </ProofSheet>
          </div>
        )}
      </div>

      {tab !== "overview" && (
        <p className="stage-note">
          {tab === "signature" && "Im Prototyp steckt das Logo direkt in der Signatur. Im Echtbetrieb liegt es auf einem Server, damit jedes Mailprogramm es zuverlässig anzeigt."}
          {tab === "card" && "Als Nächstes: druckfertige PDF mit 3 mm Beschnitt und CMYK-Farben, auf Wunsch direkt an die Druckerei."}
          {tab === "letter" && "Als Nächstes: der Briefkopf als Word-Vorlage, in die man direkt hineinschreibt."}
        </p>
      )}
    </main>
  );
}
