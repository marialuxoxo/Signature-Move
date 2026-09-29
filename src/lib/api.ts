import type { AiCheckResult, Brand } from "../types";

/**
 * Adresse des API-Servers. Im Entwicklungsmodus leer, dann reicht Vite /api weiter.
 * Auf GitHub Pages setzt der Deploy-Workflow sie auf den Server bei Render.
 */
const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export interface ApiStatus {
  ai: boolean;
}

export async function fetchStatus(): Promise<ApiStatus> {
  try {
    const r = await fetch(`${API_URL}/api/status`);
    if (!r.ok) return { ai: false };
    return (await r.json()) as ApiStatus;
  } catch {
    return { ai: false };
  }
}

export class AiCheckError extends Error {}

export async function runAiCheck(brand: Omit<Brand, "logo" | "swatches" | "logoPos" | "photoPos">, logoPngBase64: string | null): Promise<AiCheckResult> {
  const r = await fetch(`${API_URL}/api/ai-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand, logoPngBase64 }),
  });
  const data = await r.json().catch(() => null);
  if (!r.ok || !data) throw new AiCheckError(data?.error ?? "Der KI-Check hat gerade nicht geklappt. Bitte später erneut versuchen.");
  return data as AiCheckResult;
}
