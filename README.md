# Signature Move

Ein Generator für die komplette Geschäftsausstattung einer Firma: **E-Mail-Signaturen, Visitenkarten und Briefköpfe**, erzeugt aus einem Logo und ein paar Firmendaten.

Die Firma lädt ihr Logo hoch, die Farben werden automatisch erkannt, das Team wird eingetragen. Danach ist für jede Person alles fertig. Ändert sich das Logo, ändert sich alles auf einmal mit.

> Arbeitstitel, Stand Prototyp. Zielgruppe für den Start: Immobilienverwaltungen.

## Was es heute kann

- Logo hochladen (PNG, JPG, SVG, WebP), Farben werden aus dem Logo gelesen
- Firmendaten einmal pflegen, inklusive Notdienst und Pflichtangaben
- Team anlegen und bearbeiten
- **E-Mail-Signatur** in drei Gestaltungen (Klar, Kante, Ruhig), zum Kopieren oder als HTML-Datei
- **Visitenkarte** 85 × 55 mm, Vorder- und Rückseite, als Druckbogen mit Schnittmarken (SVG)
- **Briefkopf** DIN A4 nach DIN 5008 Form B (SVG)
- **KI-Check** mit Claude: Einschätzung der Marke, Vorschläge für Schrift, Gestaltung und Claim
- Eingaben bleiben im Browser gespeichert

Was noch fehlt, steht im [Fahrplan](docs/ROADMAP.md).

## Starten

Voraussetzung: [Node.js](https://nodejs.org) ab Version 20.

```bash
npm install
cp .env.example .env     # optional, nur für den KI-Check
npm run dev
```

Dann im Browser <http://localhost:5173> öffnen.

### KI-Check einschalten

In der Datei `.env` den Schlüssel von <https://console.anthropic.com> eintragen:

```
ANTHROPIC_API_KEY=dein-schlüssel
```

Ohne Schlüssel läuft alles, nur der Knopf „KI-Check der Marke“ ist dann ausgeblendet. Der Schlüssel bleibt auf dem Server und kommt nie im Browser an. Die Datei `.env` wird nicht mit hochgeladen.

## Befehle

| Befehl | Was er tut |
| --- | --- |
| `npm run dev` | Entwicklungsmodus: Oberfläche und Server mit automatischem Neuladen |
| `npm test` | Alle Tests ausführen |
| `npm run build` | Fertige Version bauen (Ordner `dist`) |
| `npm start` | Fertige Version starten, alles auf einem Port (Standard 8787) |

## Aufbau

```
src/
  templates/     Die Vorlagen: signature.ts, businessCard.ts, letterhead.ts
  components/    Oberfläche (React)
  lib/           Farben, Schriften, Hilfsfunktionen
  state/         Zustand der App und Speicherung
  demo.ts        Beispielfirma „Hausverwaltung Rheinblick“
server/
  index.ts       Kleiner Server: liefert die App aus und spricht mit Claude
  aiCheck.ts     Anweisung an Claude und Auswertung der Antwort
docs/
  ROADMAP.md     Fahrplan
```

**Grundidee:** Die Vorlagen sind feste, sauber gestaltete Bausteine. Die KI gestaltet nicht frei, sondern bereitet vor und schlägt vor. So bleibt die Qualität immer gleich.

Die Vorlagen sind reine Funktionen: Daten rein, HTML oder SVG raus. Dadurch lassen sie sich einfach testen und später auch auf dem Server nutzen, zum Beispiel für PDF oder Word.

## Technik

React 19, TypeScript, Vite, Express, Anthropic SDK, Vitest.

## Hinweise

- Alle Daten der Beispielfirma sind erfunden.
- Die Signatur enthält das Logo derzeit direkt als Datei. Für den Echtbetrieb muss es auf einem Server liegen, sonst zeigen manche Mailprogramme es nicht an.
- Dieses Repository hat noch keine Lizenz und ist damit nicht zur freien Nutzung freigegeben.
