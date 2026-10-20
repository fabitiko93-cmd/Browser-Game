# Musterplanet

`planet-preview.html` ist über den Startbildschirm und die Spieleinstellungen erreichbar. Der Einstieg aus dem Spiel verwendet den Seed und Namen des ausgewählten eigenen Planeten; fremde Planeten öffnen die eigene Heimat als Probe. Die Simulation pausiert und speichert vor dem Wechsel. Die separate Vorschau schreibt keine Reichsdaten.

Die Übersicht zeigt einen drehbaren Planeten mit vier vollständig erschlossenen Regionen. Antippen wählt und fokussiert; „Region betreten“ öffnet ausdrücklich die regionale Landschaft. Ein Finger dreht, zwei Finger verschieben und zoomen. Bauflächen lassen sich einblenden und durch Antippen auf Neigung, Küstennähe und beispielhafte Rohstoffvorkommen prüfen. Das Raster und seine Maße sind lokale Probewerte, keine festgelegte Kolonie- oder Gebäudeskalierung.

## Modularität und Seeds

| Ebene | Rezept und Zuständigkeit |
| --- | --- |
| Strategische Welt | Vorhandener `world.seed`; neue Spiele erzeugen bereits einen neuen Seed. |
| Planet | `createPlanetBlueprint(planetSeed, { preset, regionCount, name })`: Generatorversion, Radius, Achsneigung und drei bis fünf Regionen. |
| Region | Stabile ID, eigenes Seed und Modul-ID; keine GPU-Objekte oder geladenen Texturen im Rezept. |
| Landschaft | `createRegionBlueprint(planet, regionId)`: unabhängig abgeleitete Seeds für Relief, Felsen und Vorkommen. Die Reihenfolge geöffneter Regionen verändert nichts. |
| Darstellung | Module wählen echte Globuskarten, Bodenmaterialien und Felsmodelle; die Szene lädt und teilt diese Ressourcen. |

Bewohnbar, trocken und luftlos verwenden getrennte Planetenvorlagen. Küste, rotes Terrassenbecken, Hochland, Caldera und Regolith sind austauschbare Landschaftsmodule mit eigenen Geländeprofilen, Materialpaletten und Felsgruppen. Der bewohnbare Musterplanet zeigt vier unterschiedliche Regionen. Neue Module können weitere lizenzierte Assets referenzieren, ohne Spielstand oder Rendererobjekte ins Rezept zu schreiben. Ein neuer Generierungsalgorithmus benötigt eine neue Version; unbekannte Rezeptversionen werden zurückgewiesen, statt sie still neu zu würfeln. Die Grafiküberarbeitung verwendet Version 2. Die Vorschau hat keine gespeicherten v1-Bauten oder Reichsdaten zu migrieren.

Gleicher Seed, gleiche Vorlage, Regionszahl und Generatorversion reproduzieren denselben Planeten und dieselben regionalen Anordnungen. Im Optionsdialog können Seed, Planetentyp und Regionszahl ausprobiert werden; die URL erhält diese Angaben und reproduziert die Probe nach Neuladen. Die globalen Earth-/Mars-/Moon-Karten bleiben Referenzkarten der ausgewählten Quelle. Neue Seeds erzeugen hier noch keine neuen Kontinente. Gasriesen bekommen keine fiktive feste Oberfläche.

## Assets und Grenzen

Die tatsächlichen Dateien unter `web/models/planets/` stammen aus Solar System Scope / INOVE (CC BY 4.0) und Poly Haven (CC0). `ATTRIBUTION.md` und `provenance.json` dokumentieren Quelle, öffentliche Bezugskopie, Lizenz, Prüfsummen und Bearbeitung. `scripts/prepare-planet-assets.py` übernimmt ausschließlich diese Assetdateien, wählt vorhandene LODs und begrenzt Texturgrößen. Mit `--boulders` übernimmt es die zusätzlichen Namaqualand-Scans aus der dokumentierten Bezugskopie; `scripts/simplify-planet-model.mjs` reduziert sie mit erhaltenen UVs und Normalen auf jeweils 4.000 Dreiecke. Einzelne freie Assets wurden aus den zuvor ausgewählten Sammlungen verwendet, nicht deren vollständiger Download. Die Planetendateien werden vom Service Worker erst auf Abruf gecacht.

Die Felsplatzierung richtet die Modelle an der Geländeneigung aus und prüft ihre tatsächlichen unteren Scanvertices. Diese Auflage wird in die Höhen der gerenderten Geländedreiecke eingepasst; ein einzelner Mittelpunkt mit Bounding-Box-Höhe reicht dafür nicht. Offene Klippenscans werden nicht mehr frei aufgestellt. Die neuen runden Felsen und Mondgesteine sind geschlossen, und die offene Unterkante des geschichteten Boulders liegt vollständig im Boden. Steile Wände werden bei der Verteilung loser Felsen gemieden. Materialfarben, Felsgruppen, Terrainprofile und Küstenwasser verdeutlichen die Unterschiede der Regionen.

Minerva-Gebäudedateien liegen noch nicht vor. Die Probe enthält daher Landschaft und Platzierungsgrundlage, noch keine Minerva-Kolonie, Bauaufträge oder angeschlossene Produktion. Bestehende Wirtschaft, Bauplätze, Bevölkerungswerte, Erkundung und Spielstandschema bleiben maßgeblich. Die derzeitigen Regionsausschnitte sind keine vollständigen geometrischen Abbilder ganzer planetarer Kontinente.

## Prüfung

`tests/planet-blueprint.test.js` prüft Reproduzierbarkeit, Serialisierung, unabhängige Seeds, Versionsgrenzen, unterschiedliche geologische Strukturen, freie zentrale Bauflächen und unveränderte strategische Daten. `tests/planet-rocks.test.js` kontrolliert die tatsächlichen GLB-Dateien auf offene Oberflächen, die Bodeneinpassung ihrer Auflagen und den Abgleich mit unabhängig per Three.js-Raycaster gemessenen Geländedreiecken.

`scripts/qa-planet-preview.mjs` prüft echte WebGL-Ausgabe, Assetabruf, Touchrotation und Pinchzoom, getrennten Fokus/Regionseintritt, Standortprüfung, wiederholte Regionswechsel mit begrenzten Grafikressourcen, Seed-Neuladen, alle drei Planetentypen und schmale Hochformate (390 × 844, 375 × 667, 320 × 568). Zusätzlich werden die vier Regionen einzeln aufgenommen, alle geladenen Felsauflagen numerisch geprüft und die Felsen aus vier Kamerarichtungen betrachtet. Ergebnisse und Aufnahmen stehen unter `review/planet/`. Das ersetzt keine Messung auf einem physischen iPhone.
