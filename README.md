# Markenwerk

Ein Generator für die komplette Geschäftsausstattung einer Firma: **E-Mail-Signaturen, Visitenkarten und Briefköpfe**, erzeugt aus einem Logo und ein paar Firmendaten.

Die Firma lädt ihr Logo hoch, die Farben werden automatisch erkannt, das Team wird eingetragen. Danach ist für jede Person alles fertig. Ändert sich das Logo, ändert sich alles auf einmal mit.

> Arbeitstitel, Stand Prototyp. Zielgruppe für den Start: Immobilienverwaltungen.

## Was es heute kann

- Logo hochladen (PNG, JPG, SVG, WebP), Farben werden aus dem Logo gelesen
- Firmendaten einmal pflegen, inklusive Notdienst und Pflichtangaben
- Team anlegen und bearbeiten, mit Porträtfoto pro Person (wird automatisch rund zugeschnitten)
- **Aufbau vorab wählen:** Stil (Klar, Kante, Ruhig), Position des Logos und des Porträtfotos, per Vorschaubildchen
- **Übersicht** mit allen Vorlagen zusammen auf einer Fläche in der Kundenfarbe
- **E-Mail-Signatur** zum Kopieren oder als HTML-Datei
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

### KI-Check auf der Live-Seite

Die Oberfläche liegt auf GitHub Pages, der kleine Server für den KI-Check bei [Render](https://render.com) in Frankfurt. Einrichtung, einmalig:

1. Bei Render mit dem GitHub-Konto anmelden.
2. **New > Blueprint** wählen und dieses Repository verbinden. Render liest `render.yaml` und legt den Dienst `markenwerk-api` an.
3. Beim Anlegen fragt Render nach `ANTHROPIC_API_KEY`: den Schlüssel eintragen.
4. Heißt die Adresse des Dienstes nicht `https://markenwerk-api.onrender.com`, auf GitHub unter **Settings > Secrets and variables > Actions > Variables** die Variable `API_URL` mit der richtigen Adresse anlegen und die Seite neu veröffentlichen.

Schutz vor hohen Kosten: höchstens 10 KI-Checks pro Minute und Adresse und höchstens 100 pro Tag (`DAILY_LIMIT`). Zusätzlich in der [Anthropic Console](https://console.anthropic.com) ein Ausgabenlimit setzen.

Im kostenlosen Tarif schläft der Server nach 15 Minuten ohne Besuch ein. Der erste Aufruf danach weckt ihn, der Knopf für den KI-Check erscheint dann nach etwa einer Minute.

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
  demo.ts        Erfundene Beispielfirma „Beispiel Hausverwaltung GmbH“
server/
  index.ts       Kleiner Server: liefert die App aus und spricht mit Claude
  aiCheck.ts     Anweisung an Claude und Auswertung der Antwort
docs/
  ROADMAP.md         Fahrplan
  PROJEKTVERLAUF.md  Idee, Entscheidungen, Designrunden, Plagiat-Check, offene Punkte
```

**Grundidee:** Die Vorlagen sind feste, sauber gestaltete Bausteine. Die KI gestaltet nicht frei, sondern bereitet vor und schlägt vor. So bleibt die Qualität immer gleich.

Die Vorlagen sind reine Funktionen: Daten rein, HTML oder SVG raus. Dadurch lassen sie sich einfach testen und später auch auf dem Server nutzen, zum Beispiel für PDF oder Word.

## Technik

React 19, TypeScript, Vite, Express, Anthropic SDK, Vitest.

## Hinweise

- Alle Daten der Beispielfirma sind erfunden.
- Die Signatur enthält das Logo derzeit direkt als Datei. Für den Echtbetrieb muss es auf einem Server liegen, sonst zeigen manche Mailprogramme es nicht an.
- Dieses Repository hat noch keine Lizenz und ist damit nicht zur freien Nutzung freigegeben.
