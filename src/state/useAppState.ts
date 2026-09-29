import { useEffect, useReducer } from "react";
import { DEFAULT_LOGO_POS, DEFAULT_PHOTO_POS, type AppState, type Brand, type Person, type Tab } from "../types";
import { DEMO_LOGO, DEMO_STATE } from "../demo";
import { uid } from "../lib/text";

const STORAGE_KEY = "markenwerk-v2";

export type Action =
  | { type: "brand"; patch: Partial<Brand> }
  | { type: "person"; id: string; patch: Partial<Person> }
  | { type: "addPerson" }
  | { type: "removePerson"; id: string }
  | { type: "select"; id: string }
  | { type: "tab"; tab: Tab }
  | { type: "reset" };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "brand":
      return { ...state, brand: { ...state.brand, ...action.patch } };
    case "person":
      return { ...state, team: state.team.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)) };
    case "addPerson": {
      const p: Person = { id: uid(), name: "", role: "", phone: "", mobile: "", email: "" };
      return { ...state, team: [...state.team, p], activeId: p.id };
    }
    case "removePerson": {
      if (state.team.length < 2) return state;
      const idx = state.team.findIndex((p) => p.id === action.id);
      const team = state.team.filter((p) => p.id !== action.id);
      const activeId = state.activeId === action.id ? team[Math.max(0, idx - 1)].id : state.activeId;
      return { ...state, team, activeId };
    }
    case "select":
      return { ...state, activeId: action.id };
    case "tab":
      return { ...state, tab: action.tab };
    case "reset":
      return structuredClone(DEMO_STATE);
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as AppState;
      if (s?.brand && Array.isArray(s.team) && s.team.length) {
        // Ältere gespeicherte Stände kennen die Logo-Position noch nicht.
        return {
          ...s,
          brand: {
            ...s.brand,
            logoPos: { ...DEFAULT_LOGO_POS, ...(s.brand.logoPos ?? {}) },
            photoPos: { ...DEFAULT_PHOTO_POS, ...(s.brand.photoPos ?? {}) },
          },
        };
      }
    }
  } catch {
    // Kein Zugriff auf den Speicher oder kaputte Daten: mit Beispieldaten starten.
  }
  return structuredClone(DEMO_STATE);
}

/**
 * Zustand der App. Wird im Browser gespeichert, damit nach einem Neuladen nichts verloren geht.
 * Später ersetzt durch Speicherung pro Firmenkonto auf dem Server.
 */
export function useAppState() {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Sehr große Bilder passen evtl. nicht in den Speicher. Dann ohne Logo und Fotos speichern.
        try {
          const slim = { ...state, brand: { ...state.brand, logo: DEMO_LOGO }, team: state.team.map((p) => ({ ...p, photo: "" })) };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
        } catch {
          /* ignorieren */
        }
      }
    }, 300);
    return () => clearTimeout(t);
  }, [state]);

  const active = state.team.find((p) => p.id === state.activeId) ?? state.team[0];
  return { state, dispatch, active };
}
