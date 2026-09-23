import { useCallback, useEffect, useRef, useState } from "react";
import { useAppState } from "./state/useAppState";
import { fetchStatus } from "./lib/api";
import { BrandPanel } from "./components/BrandPanel";
import { CompanyForm } from "./components/CompanyForm";
import { TeamPanel } from "./components/TeamPanel";
import { Preview } from "./components/Preview";

export default function App() {
  const { state, dispatch, active } = useAppState();
  const [aiAvailable, setAiAvailable] = useState(false);
  const [toast, setToast] = useState<{ msg: string; error: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetchStatus().then((s) => setAiAvailable(s.ai));
  }, []);

  const notify = useCallback((msg: string, error = false) => {
    setToast({ msg, error });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  return (
    <>
      <header className="top">
        <h1>Signature Move</h1>
        <p>Logo hochladen, Farben prüfen, Team eintragen. Signatur, Visitenkarte und Briefkopf entstehen automatisch.</p>
        <button
          className="btn small ghost reset"
          type="button"
          onClick={() => { if (confirm("Alle Eingaben durch die Beispielfirma ersetzen?")) dispatch({ type: "reset" }); }}
        >
          Beispieldaten laden
        </button>
      </header>
      <div className="layout">
        <aside>
          <BrandPanel brand={state.brand} dispatch={dispatch} aiAvailable={aiAvailable} notify={notify} />
          <CompanyForm brand={state.brand} dispatch={dispatch} />
          <TeamPanel team={state.team} active={active} dispatch={dispatch} />
        </aside>
        <Preview state={state} active={active} dispatch={dispatch} notify={notify} />
      </div>
      <div className={`toast${toast?.error ? " err" : ""}`} aria-live="polite">{toast?.msg}</div>
    </>
  );
}
