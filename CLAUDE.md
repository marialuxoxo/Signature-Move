# Markenwerk

Arbeitstitel für ein Produkt von Renamic: Eine Firma lädt ihr Logo hoch, trägt ihr Team ein und bekommt E-Mail-Signaturen, Visitenkarten und Briefköpfe für alle Mitarbeitenden. Zielgruppe für den Start: Immobilienverwaltungen.

Die ganze Vorgeschichte mit allen Entscheidungen steht in [docs/PROJEKTVERLAUF.md](docs/PROJEKTVERLAUF.md). Lies sie, bevor du größere Änderungen machst.

## Mit wem du arbeitest

Maria (Marketing bei Renamic) treibt das Projekt, Ralf ist ihr Chef und entscheidet mit. Maria ist keine Entwicklerin:

- Antworte auf Deutsch, locker und direkt, ohne Fachbegriffe. Komplizierte Dinge am besten mit einem einfachen Vergleich oder Bild erklären.
- Keine Gedankenstriche (– oder —) in Texten für Maria und in der Oberfläche. Stattdessen Komma, Doppelpunkt oder umformulieren.
- Material für Ralf lieber visuell (Folien, Diagramme) als lange Texte.

## Stand und Zweige

- Gearbeitet wird auf dem Zweig `markenwerk-design`. Dort liegt das aktuelle Design im Apple-Stil mit Logo- und Fotoposition.
- `main` ist die Live-Seite unter <https://marialuxoxo.github.io/Signature-Move/> und wird bei jedem Push automatisch über GitHub Pages veröffentlicht (`.github/workflows/pages.yml`). Seit dem 29.09.2026 zeigt sie das Design aus `markenwerk-design`. Auf GitHub Pages gibt es keinen Server, der KI-Check ist dort deshalb ausgeblendet.
- `markenwerk-design` erst nach Marias ausdrücklicher Freigabe in `main` übernehmen, weil sich damit die Live-Seite ändert.
- Das Repository heißt noch `signature-move`. Der Produktname ist wieder Markenwerk.

## Befehle

```bash
npm install
npm run dev      # Oberfläche auf http://localhost:5173, Server für den KI-Check auf 8787
npm test         # alle Tests (Vitest)
npm run build    # Typprüfung und fertige Version in dist/
npm start        # fertige Version und Server auf einem Port
```

Der KI-Check braucht `ANTHROPIC_API_KEY` in `.env` (siehe `.env.example`). Ohne Schlüssel ist der Knopf ausgeblendet, alles andere läuft.

Vor jedem Commit: `npm test` und `npm run build` müssen grün sein.

## Aufbau des Codes

- `src/templates/`: die Vorlagen als reine Funktionen, Daten rein, HTML oder SVG raus. `signature.ts` (E-Mail-HTML mit Tabellen und Inline-Styles, wegen Outlook), `businessCard.ts` (85 × 55 mm, 10 Einheiten = 1 mm), `letterhead.ts` (DIN A4 nach DIN 5008 Form B), `photo.ts` (Platzhalter für fehlende Fotos).
- `src/components/`: Oberfläche in React. Seitenleiste mit den Abschnitten Marke, Aufbau, Firmendaten, Team; rechts `Preview` mit den Reitern Übersicht, Signatur, Visitenkarte, Briefkopf. `Showcase` ist die Übersicht mit allen Vorlagen übereinander. `LayoutPicker` zeigt die Vorschaubildchen für Logo- und Fotoposition.
- `src/state/useAppState.ts`: Zustand, gespeichert im Browser (`localStorage`, Schlüssel `markenwerk-v2`). Ältere Stände werden beim Laden ergänzt.
- `src/types.ts`: Datenmodell, dort auch die Optionen für Logo- und Fotoposition.
- `src/demo.ts`: die Beispielfirma.
- `server/`: kleiner Express-Server, liefert die App aus und spricht für den KI-Check mit Claude.

## Regeln

- Die Vorlagen gestalten nicht frei. Stil und Positionen sind feste, geprüfte Varianten; die KI macht nur Vorschläge.
- Porträtfotos werden beim Hochladen rund als PNG zugeschnitten, damit sie auch in Outlook rund sind. Fehlt ein Foto, zeigt nur die Vorschau einen Platzhalter (`{ placeholder: true }`), Downloads und kopierte Signaturen nie.
- Beispieldaten bleiben eindeutig erfunden: Firmenname „Beispiel Hausverwaltung GmbH“, Domain auf `.example`, Rufnummern nur aus den Film-Bereichen der Bundesnetzagentur (0221 4710 000 bis 999, 0171 39200 00 bis 99, 0176 040690 00 bis 99), Register- und Steuernummer mit Nullen. Keine echten Firmen, Slogans oder Personenfotos.
- Neue Funktionen bekommen Tests in `src/templates/templates.test.ts` oder daneben.

## Gestaltung (freigegeben: Apple-Stil)

Hell und ruhig, keine dunklen Flächen. Die Oberfläche tritt zurück, farbig sind nur das Logo-Zeichen und die Farben des Kunden.

| Rolle | Wert |
| --- | --- |
| Text | `#1D1D1F` |
| Nebentext | `#6E6E73` |
| Seitenleiste | `#F5F5F7` |
| Karten und Arbeitsfläche | `#FFFFFF` |
| Trennlinien | `#E5E5EA` |
| Aktion (Knöpfe, Links) | `#0071E3` |
| Schrift | Systemschrift (auf Apple-Geräten SF), sonst Inter |

Eingaben in weißen Karten mit eingerückten Trennlinien wie in den iPhone-Einstellungen, Umschalter im macOS-Stil, runde Knöpfe. Alle Werte stehen als Variablen oben in `src/styles.css`.

Verworfen wurden: dunkles Navy mit Messing (zu sehr HubSpot), Signalgelb (zu sehr Kununu).

## Offene Punkte

- **Logo:** Drei Varianten liegen zur Auswahl (Briefmarke, Briefmarke als Umriss, nur Schriftzug). Das aktuelle Zeichen aus drei Farbkreisen (`src/components/LogoMark.tsx`, Favicon in `index.html`) ist eine verbreitete Stockgrafik und soll ersetzt werden.
- **Name:** „Markenwerk“ wird von mehreren Agenturen genutzt. Vor öffentlichem Einsatz braucht es eine Markenrecherche.
- **Ausbau:** Logos auf einem Server statt eingebettet in der Signatur, Firmenkonten mit Anmeldung, druckfertige PDF mit CMYK und 3 mm Beschnitt, Briefkopf als Word-Vorlage.

## Klickbarer Prototyp

Unter <https://claude.ai/artifact/QqXCumFY2ngJwFZVkt1Pnw> liegt ein klickbarer Prototyp auf claude.ai. Er wird aus diesem Code gebaut, nur KI-Check und Downloads laufen dort über claude.ai statt über den eigenen Server.
