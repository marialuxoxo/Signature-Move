import { config } from "dotenv";
import express from "express";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { buildPrompt, parseAiResult, validateBrand } from "./aiCheck";

config({ quiet: true });

const PORT = Number(process.env.PORT ?? 8787);
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
const anthropic = apiKey ? new Anthropic({ apiKey }) : null;

const app = express();
app.use(express.json({ limit: "5mb" }));

/** Einfache Bremse gegen zu viele Anfragen: höchstens 10 KI-Checks pro Minute und Adresse. */
const hits = new Map<string, number[]>();
function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 10;
}

app.get("/api/status", (_req, res) => {
  res.json({ ai: Boolean(anthropic) });
});

app.post("/api/ai-check", async (req, res) => {
  if (!anthropic) return res.status(503).json({ error: "Der KI-Check ist nicht eingerichtet." });
  if (tooMany(req.ip ?? "unbekannt")) return res.status(429).json({ error: "Gerade zu viele Anfragen. Bitte in einer Minute erneut versuchen." });

  const brand = validateBrand(req.body?.brand);
  if (!brand) return res.status(400).json({ error: "Firmenname und gültige Farben werden benötigt." });

  const logo = typeof req.body?.logoPngBase64 === "string" && req.body.logoPngBase64.length < 4_000_000 ? req.body.logoPngBase64 : null;

  try {
    const content: Anthropic.ContentBlockParam[] = [];
    if (logo) content.push({ type: "image", source: { type: "base64", media_type: "image/png", data: logo } });
    content.push({ type: "text", text: buildPrompt(brand, Boolean(logo)) });

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content }],
    });
    const text = message.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    res.json(parseAiResult(text));
  } catch (err) {
    console.error("KI-Check fehlgeschlagen:", err instanceof Error ? err.message : err);
    res.status(502).json({ error: "Der KI-Check hat gerade nicht geklappt. Bitte später erneut versuchen." });
  }
});

// Im Betrieb liefert derselbe Server auch die fertig gebaute Oberfläche aus.
const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get("/{*splat}", (_req, res) => res.sendFile(join(dist, "index.html")));
}

app.listen(PORT, () => {
  console.log(`Signature Move API läuft auf http://localhost:${PORT} (KI-Check ${anthropic ? "aktiv" : "aus"})`);
});
