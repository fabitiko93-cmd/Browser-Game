# Modulkarte

| Datei | Zuständigkeit |
| --- | --- |
| `src/data.js` | Gebäude, Waren, Technologien, Ideologien, Schiffe und Startwelten |
| `src/state.js` | Neuer Spielstand, IDs, Bestände, Gelände, Datumsanzeige und Meldungen |
| `src/economy.js` | Lokale Produktionsketten, Arbeitskräfte, Bevölkerung, Bau und Tagesprognosen |
| `src/governance.js` / `src/governance-ui.js` | Politische Profile, sechs Gesetzesbereiche, befristete Regierungsprogramme und deren Ansichten |
| `src/politics.js` | Regierung, Steuern, Wahlen, Diplomatie, Krieg und Unruhen |
| `src/research.js` | Forschungsaufträge und Technologieabschluss |
| `src/fleets.js` | Werftaufträge, Reisen, Kolonien, Frachtrouten, Kämpfe und gegnerische Überfälle |
| `src/simulation.js` | Tagesablauf und interaktive Ereignisse |
| `src/save.js` | Lokaler Spielstand, Validierung, Import und Export |
| `src/map.js` | Canvas-Karten, Oberflächen, Planeten, Sterne, Auswahl, Verschieben und Zoom |
| `src/ui.js` / `src/icons.js` | Verwaltungsansichten und SVG-Symbole |
| `src/main.js` | Laufende Anwendung, Eingabe, Zeitsteuerung und Speicherung |
| `web/` | HTML, CSS, App-Manifest und Icon |
| `scripts/` | Deterministischer Build und lokaler Entwicklungsserver |
| `tests/` | Regeln der Simulation und Integrationsabläufe |

Waren befinden sich auf einzelnen Planeten. Credits und Forschung gelten reichsweit.
Ein Spieltag dauert bei 1× drei Sekunden. Geschwindigkeit: Pause, 1×, 2×, 4×.
Beim Wechsel in den Hintergrund wird pausiert; es gibt keine Offline-Zeitfortschreibung.
Reisen und Fabriken werden jeweils im Tagesablauf verarbeitet. Flottenaufträge validieren Kosten, Zugang und Auswahl vor jeder Buchung.

Der Build kopiert die eigenständigen ES-Module nach `docs/build/` und erzeugt den Service Worker aus dem vollständigen Dateiinhalt.
Der Cache besitzt einen automatisch ermittelten Hash. Keine externe Bibliothek, Schrift oder CDN ist zum Spielen nötig.
Speicherformat: v2. v1 wird beim Laden ohne Verlust von Planeten, Waren oder Missionen migriert. Neue Gesetze starten mit neutralen Optionen; keine Programme werden automatisch aktiviert.
Politische Profile und Gesetze multiplizieren konkrete Wirtschafts- und Flottenwerte; Zufriedenheit addiert sich. Alle Regierungsformen können dieselben Gesetze und Programme nutzen. Werftzeiten werden bei Auftragserteilung berechnet; bestehende Aufträge behalten ihre Restzeit.
Flottenverbände reisen mit dem langsamsten Schiff. Panzerung reduziert Kampfschaden, Versorgungsschiffe übertragen vorhandene Versorgung. Frachterkapazität wird pro Schiffstyp geprüft.
