# ORBIT 3077

Eigenständiges Spiel in `fabitiko93-cmd/Browser-Game`. Das andere Repository ist kein Änderungsziel.

## Festgelegt

- Browsergame für das iPhone, konsequent **Hochformat**.
- Fiktive Sci-Fi-Welt im Jahr 3077: Planeten, Sonnensysteme, Aliens und Laserwaffen.
- Aufbau und Produktionsketten angelehnt an Anno; Politik und militärische Organisation angelehnt an Hearts of Iron 3.
- Politische Einheiten sind planetare Staaten und interstellare Reiche. Unterschiedliche Ideologien einschließlich Nationalsozialismus sind Teil der fiktiven Simulation.
- Nutzerentscheidungen und vorgeschlagene Erweiterungen getrennt führen. Nicht beschlossene Details bleiben veränderbar.

## Arbeiten

Mit der kurzen Modulkarte in `ARCHITECTURE.md` beginnen. Kein langes Designarchiv vor jedem Patch lesen.
Die zuständigen Module gezielt bearbeiten. Regeln und Bedienung außerhalb des Auftrags erhalten.
Quellen liegen in `src/` und `web/`. `docs/` wird automatisch erzeugt und zusammen mit den Quellen veröffentlicht.
Keine Versionsnummern in einzelne Imports schreiben und keine Cachelisten von Hand pflegen.
Vor einer Veröffentlichung `npm run build`, `npm test` und `npm run build:check` ausführen.
Bei Änderungen an Darstellung oder Touchbedienung die betroffene Ansicht in einem schmalen Hochformat prüfen.
Keine zusätzlichen Agenten ohne ausdrücklichen Auftrag einsetzen.
