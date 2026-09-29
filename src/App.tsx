import { useCallback, useEffect, useRef, useState } from "react";
import { useAppState } from "./state/useAppState";
import { fetchStatus } from "./lib/api";
import { BrandPanel } from "./components/BrandPanel";
import { LayoutPanel } from "./components/LayoutPanel";
import { CompanyForm } from "./components/CompanyForm";
import { TeamPanel } from "./components/TeamPanel";
import { Preview } from "./components/Preview";
import { LogoMark } from "./components/LogoMark";

export default function App() {
  const { state, dispatch, active } = useAppState();
  const [aiAvailable, setAiAvailable] = useState(false);
  const [toast, setToast] = useState<{ msg: string; error: boolean } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    fetchStatus().then((s) => setAiAvailable(s.ai));
  }, []);

  const notify = useCallback((msg: string, error = false) => {
    setToast({ msg, error });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4500);
  }, []);

  // Zweistufige Bestätigung direkt am Knopf statt eines Browser-Dialogs.
  function handleReset() {
    clearTimeout(resetTimer.current);
    if (!confirmReset) {
      setConfirmReset(true);
      resetTimer.current = setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    setConfirmReset(false);
    dispatch({ type: "reset" });
    notify("Beispieldaten geladen.");
  }

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand">
          <LogoMark />
          <h1 className="wordmark">Markenwerk</h1>
        </div>
        <button className={`btn-link appbar-reset${confirmReset ? " is-confirming" : ""}`} type="button" onClick={handleReset}>
          {confirmReset ? "Wirklich alles ersetzen?" : "Beispieldaten laden"}
        </button>
      </header>
      <div className="layout">
        <aside className="sidebar" aria-label="Eingaben">
          <BrandPanel brand={state.brand} dispatch={dispatch} aiAvailable={aiAvailable} notify={notify} />
          <LayoutPanel brand={state.brand} dispatch={dispatch} />
          <CompanyForm brand={state.brand} dispatch={dispatch} />
          <TeamPanel team={state.team} active={active} dispatch={dispatch} notify={notify} />
          <p className="sidebar-note">Deine Eingaben bleiben in diesem Browser gespeichert.</p>
        </aside>
        <Preview state={state} active={active} dispatch={dispatch} notify={notify} />
      </div>
      <div className={`toast${toast?.error ? " is-error" : ""}`} role="status" aria-live="polite">{toast?.msg}</div>
    </div>
  );
}
