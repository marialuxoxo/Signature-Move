import type { AiCheckResult, Brand } from "../types";

export interface ApiStatus {
  ai: boolean;
}

export async function fetchStatus(): Promise<ApiStatus> {
  try {
    const r = await fetch("/api/status");
    if (!r.ok) return { ai: false };
    return (await r.json()) as ApiStatus;
  } catch {
    return { ai: false };
  }
}

export class AiCheckError extends Error {}

export async function runAiCheck(brand: Omit<Brand, "logo" | "swatches">, logoPngBase64: string | null): Promise<AiCheckResult> {
  const r = await fetch("/api/ai-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand, logoPngBase64 }),
  });
  const data = await r.json().catch(() => null);
  if (!r.ok || !data) throw new AiCheckError(data?.error ?? "Der KI-Check hat gerade nicht geklappt. Bitte später erneut versuchen.");
  return data as AiCheckResult;
}
