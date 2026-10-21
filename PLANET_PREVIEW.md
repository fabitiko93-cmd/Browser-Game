# Musterplanet

`planet-preview.html` ist über den Startbildschirm und die Spieleinstellungen erreichbar. Der Einstieg aus dem Spiel verwendet den Seed und Namen des ausgewählten eigenen Planeten; fremde Planeten öffnen die eigene Heimat als Probe. Die Simulation pausiert und speichert vor dem Wechsel. Die separate Vorschau schreibt keine Reichsdaten.

Die Übersicht zeigt einen drehbaren Planeten mit vier vollständig erschlossenen Regionen. Antippen wählt und fokussiert; „Region betreten“ öffnet ausdrücklich die regionale Landschaft. Ein Finger dreht, zwei Finger verschieben und zoomen. Bauflächen lassen sich einblenden und durch Antippen auf Neigung, Küstennähe und beispielhafte Rohstoffvorkommen prüfen. Das Raster und seine Maße sind lokale Probewerte, keine festgelegte Kolonie- oder Gebäudeskalierung.

## Baugebiet, Kamera und Umgebung · 21.10.2026

Eine dezente Außenlinie zeigt das 64 × 64 Kacheln große Baugebiet auch bei ausgeblendetem Innenraster. Raster, Standortprüfung und Auswahl verwenden dieselbe Grenze. Ein Tipp wählt die Mitte einer tatsächlich angezeigten Kachel; die geländeangepasste Markierung umrandet genau diese Kachel. Tippen außerhalb des Rasters oder in den Himmel hebt eine bestehende Auswahl auf, ohne einen scheinbaren Bauplatz zu erzeugen.

Die ausgewählte Kachel erhält einen sanften Kamerafokus: Blickpunkt und Kamera gleiten über 0,65 Sekunden gemeinsam zur Auswahl. Zoom und Blickrichtung bleiben erhalten; die bestehende Bodensicherung wird während der Bewegung angewandt. Eigene Dreh-, Verschiebe- oder Zoomgesten, Zentrieren, ein Regionswechsel oder das Aufheben der Auswahl beenden den Fokus sofort. Bei reduzierter Bewegung wird das Ziel direkt eingestellt.

Die Regionskamera folgt beim Verschieben der tatsächlichen Bodenhöhe. Blickpunkt und Kamera werden nach Drehen, Zoomen und Zentrieren korrigiert; dazwischenliegende Canyonwände, Kraterränder und die unmittelbare Kameraumgebung werden berücksichtigt. Der Blickpunkt bleibt in der Nähe des Baugebiets, während dessen Umgebung weiter sichtbar ist.

Generatorversion 4 ersetzt die schmalen, hohen Geländeformen im Baufeld durch breite Talböden, Küstenwiesen und sanfte Hochlandterrassen. Zusammenhängende, verrauschte Höhenzüge liegen außerhalb der Bauzone; die Vulkanregion hat einen fernen, erodierten Rand. Küste und Gelände werden gemeinsam abgefragt. Die Standortprüfung schließt trockene Flächen über 12 % Neigung aus. Tests kontrollieren zusätzlich 16-m-Grundrisse im Binnenland: über vier Seeds höchstens 1,6 m Höhenunterschied, keine Geländesprünge an der Rastergrenze. Das ist eine Geländegrundlage, noch keine implementierte Fundament- oder Gebäudenivellierung.

Erdähnliche Welten erhalten echte CC0-Pflanzen aus Poly Havens Pine Forest: dreidimensionale junge Kiefern und Tannen, Farne und Gras. Gemeinsame, kontinuierliche Felder für Feuchtigkeit, Hanglage, Küstennähe und Waldlichtungen steuern Pflanzen und Gras-/Waldbodenmaterialien. Die Verteilung ist aus realen Wiesen und lockeren Nadelwaldrändern abgeleitet; Alter, Größe und Abstand wechseln ohne harte Waldkreise. Trockene und luftlose Vorlagen bleiben ohne Vegetation. Ausgewachsene entfernte Kiefern verwenden acht vorberechnete Ansichten je Originalbaum; ihre Wurzeln bleiben fest und die gewählte Ansicht folgt der Kamera. Das spart die vielen Nadeldreiecke der Originale. 72-m-Gruppen erlauben Frustum-Culling. Eine Messung der Leistung auf dem iPhone steht aus.

Die neun Terrainabschnitte und ihre Dreiecksauflösung werden von Darstellung und Höhenabfragen gemeinsam beschrieben. Auch entfernte Felsen werden an diese tatsächlichen Dreiecke angepasst. Für sie enthält `rock-lods.json` vorbereitete Geometrien der vorhandenen CC0-Scans mit 420–776 Dreiecken; die Originalmaterialien werden geteilt. Vorbereitung: `node scripts/prepare-planet-environment-lods.mjs`. Pflanzen: `python scripts/prepare-planet-flora.py <Quellcache>`; der optionale Fernwald wird vorher mit Blender und `scripts/bake-planet-forest.py` gebacken. Die Quellen und Verarbeitungsschritte stehen im Asset-Verzeichnis.

## Modularität und Seeds

| Ebene | Rezept und Zuständigkeit |
| --- | --- |
| Strategische Welt | Vorhandener `world.seed`; neue Spiele erzeugen bereits einen neuen Seed. |
| Planet | `createPlanetBlueprint(planetSeed, { preset, regionCount, name })`: Generatorversion, Radius, Achsneigung und drei bis fünf Regionen. |
| Region | Stabile ID, eigenes Seed und Modul-ID; keine GPU-Objekte oder geladenen Texturen im Rezept. |
| Landschaft | `createRegionBlueprint(planet, regionId)`: unabhängig abgeleitete Seeds für Relief, Felsen und Vorkommen. Die Reihenfolge geöffneter Regionen verändert nichts. |
| Darstellung | Module wählen echte Globuskarten, Bodenmaterialien und Felsmodelle; die Szene lädt und teilt diese Ressourcen. |

Erdähnlich, trocken und luftlos verwenden getrennte Planetenvorlagen. Küste, rotes Terrassenbecken, Hochland, Caldera und Regolith sind austauschbare Landschaftsmodule mit eigenen Geländeprofilen, Materialpaletten und Felsgruppen. Der erdähnliche Musterplanet zeigt vier unterschiedliche Regionen. Neue Module können weitere lizenzierte Assets referenzieren, ohne Spielstand oder Rendererobjekte ins Rezept zu schreiben. Ein neuer Generierungsalgorithmus benötigt eine neue Version; unbekannte Rezeptversionen werden zurückgewiesen, statt sie still neu zu würfeln. Die Vorschau hat keine gespeicherten Bauten oder Reichsdaten älterer Generatorversionen zu migrieren.

Gleicher Seed, gleiche Vorlage, Regionszahl und Generatorversion reproduzieren denselben Planeten und dieselben regionalen Anordnungen. Im Optionsdialog können Seed, Planetentyp und Regionszahl ausprobiert werden; die URL erhält diese Angaben und reproduziert die Probe nach Neuladen. Die globalen Earth-/Mars-/Moon-Karten bleiben Referenzkarten der ausgewählten Quelle. Neue Seeds erzeugen hier noch keine neuen Kontinente. Gasriesen bekommen keine fiktive feste Oberfläche.

## Assets und Grenzen

Die tatsächlichen Dateien unter `web/models/planets/` stammen aus Solar System Scope / INOVE (CC BY 4.0) und Poly Haven (CC0). `ATTRIBUTION.md` und `provenance.json` dokumentieren Quelle, öffentliche Bezugskopie, Lizenz, Prüfsummen und Bearbeitung. `scripts/prepare-planet-assets.py` übernimmt ausschließlich diese Assetdateien, wählt vorhandene LODs und begrenzt Texturgrößen. Mit `--boulders` übernimmt es die zusätzlichen Namaqualand-Scans aus der dokumentierten Bezugskopie; `scripts/simplify-planet-model.mjs` reduziert sie mit erhaltenen UVs und Normalen auf jeweils 4.000 Dreiecke. Einzelne freie Assets wurden aus den zuvor ausgewählten Sammlungen verwendet, nicht deren vollständiger Download. Die Planetendateien werden vom Service Worker erst auf Abruf gecacht.

Die Felsplatzierung richtet die Modelle an der Geländeneigung aus und prüft ihre tatsächlichen unteren Scanvertices. Diese Auflage wird in die Höhen der gerenderten Geländedreiecke eingepasst; ein einzelner Mittelpunkt mit Bounding-Box-Höhe reicht dafür nicht. Offene Klippenscans werden nicht mehr frei aufgestellt. Die neuen runden Felsen und Mondgesteine sind geschlossen, und die offene Unterkante des geschichteten Boulders liegt vollständig im Boden. Steile Wände werden bei der Verteilung loser Felsen gemieden. Materialfarben, Felsgruppen, Terrainprofile und Küstenwasser verdeutlichen die Unterschiede der Regionen.

Minerva-Gebäudedateien liegen noch nicht vor. Die Probe enthält daher Landschaft und Platzierungsgrundlage, noch keine Minerva-Kolonie, Bauaufträge oder angeschlossene Produktion. Bestehende Wirtschaft, Bauplätze, Bevölkerungswerte, Erkundung und Spielstandschema bleiben maßgeblich. Die derzeitigen Regionsausschnitte sind keine vollständigen geometrischen Abbilder ganzer planetarer Kontinente.

## Prüfung

`tests/planet-blueprint.test.js` prüft Reproduzierbarkeit, Serialisierung, unabhängige Seeds, Versionsgrenzen, unterschiedliche geologische Strukturen, freie zentrale Bauflächen und unveränderte strategische Daten. `tests/planet-rocks.test.js` kontrolliert die tatsächlichen GLB-Dateien auf offene Oberflächen, die Bodeneinpassung ihrer Auflagen und den Abgleich mit unabhängig per Three.js-Raycaster gemessenen Geländedreiecken.

`tests/planet-region.test.js` prüft alle 4.096 Kachelmittelpunkte und Rastergrenzen, alle neun Terrainabschnitte samt Übergängen gegen echte Three.js-Raycaster-Treffer, 144 Kamerapositionen über drei Seeds, unabhängige Umgebungsrezepte aller Vorlagen und die Bodeneinpassung der entfernten LOD-Felsen.

Prüfstand mit Flora und Terrassen: 373 automatisierte Tests bestanden. `tests/planet-flora.test.js` ergänzt größere Baugrundrisse, wurzelfeste und aufrechte Pflanzen, Habitatgrenzen, GLB- und Dreiecksbudgets, erhaltene Alpha-Texturen und Fernwaldansichten. Die Fokusprüfung umfasst zeitunabhängige Schritte, unveränderten Kameraversatz und die Projektion im Hochformat bei 320, 375 und 390 Pixeln Breite.

Die aktuelle Browservorschau meldet beim Erzeugen des WebGL-Kontexts `GL_RENDERER = Disabled / BindToCurrentSequence failed`. Deshalb sind WebGL-Bildqualität, Touchgesten und Grafikleistung dieses Patches im Browser nicht abgenommen. Die Quellmodelle und der Landschaftsaufbau wurden zusätzlich offline in Blender betrachtet; das ist kein Screenshot des Spiels und kein Ersatz für die Browserprüfung. Die vorhandenen Aufnahmen und `browser-inspection.json` unter `review/planet/` gehören zum früheren Grafikpatch und sind kein visueller Nachweis für Generatorversion 4. Eine Prüfung auf einem physischen iPhone steht ebenfalls aus.

`scripts/qa-planet-preview.mjs` prüft echte WebGL-Ausgabe, Assetabruf, Touchrotation und Pinchzoom, getrennten Fokus/Regionseintritt, Standortprüfung, wiederholte Regionswechsel mit begrenzten Grafikressourcen, Seed-Neuladen, alle drei Planetentypen und schmale Hochformate (390 × 844, 375 × 667, 320 × 568). Zusätzlich werden die vier Regionen einzeln aufgenommen, alle geladenen Felsauflagen numerisch geprüft und die Felsen aus vier Kamerarichtungen betrachtet. Ergebnisse und Aufnahmen stehen unter `review/planet/`. Das ersetzt keine Messung auf einem physischen iPhone.
