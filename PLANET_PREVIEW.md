# Musterplanet

`planet-preview.html` ist über den Startbildschirm und die Spieleinstellungen erreichbar. Der Einstieg aus dem Spiel verwendet den Seed und Namen des ausgewählten eigenen Planeten; fremde Planeten öffnen die eigene Heimat als Probe. Die Simulation pausiert und speichert vor dem Wechsel. Die separate Vorschau schreibt keine Reichsdaten.

Die Übersicht zeigt einen drehbaren Planeten mit vier vollständig erschlossenen Regionen. Antippen wählt und fokussiert; „Region betreten“ öffnet ausdrücklich die regionale Landschaft. Ein Finger dreht, zwei Finger verschieben und zoomen. Bauflächen lassen sich einblenden und durch Antippen auf Neigung, Küstennähe und beispielhafte Rohstoffvorkommen prüfen. Das Raster und seine Maße sind lokale Probewerte, keine festgelegte Kolonie- oder Gebäudeskalierung.

## Baugebiet, Kamera und Umgebung · 21.10.2026

Eine dezente Außenlinie zeigt das 64 × 64 Kacheln große Baugebiet auch bei ausgeblendetem Innenraster. Raster, Standortprüfung und Auswahl verwenden dieselbe Grenze. Ein Tipp wählt die Mitte einer tatsächlich angezeigten Kachel; die geländeangepasste Markierung umrandet genau diese Kachel. Tippen außerhalb des Rasters oder in den Himmel hebt eine bestehende Auswahl auf, ohne einen scheinbaren Bauplatz zu erzeugen.

Die ausgewählte Kachel erhält einen sanften Kamerafokus: Blickpunkt und Kamera gleiten über 0,65 Sekunden gemeinsam zur Auswahl. Zoom und Blickrichtung bleiben erhalten; die bestehende Bodensicherung wird während der Bewegung angewandt. Eigene Dreh-, Verschiebe- oder Zoomgesten, Zentrieren, ein Regionswechsel oder das Aufheben der Auswahl beenden den Fokus sofort. Bei reduzierter Bewegung wird das Ziel direkt eingestellt.

Die Regionskamera folgt beim Verschieben der tatsächlichen Bodenhöhe. Blickpunkt und Kamera werden nach Drehen, Zoomen und Zentrieren korrigiert; dazwischenliegende Canyonwände, Kraterränder und die unmittelbare Kameraumgebung werden berücksichtigt. Der Blickpunkt bleibt in der Nähe des Baugebiets, während dessen Umgebung weiter sichtbar ist.

Generatorversion 5 behält die sanften Talböden und Terrassen im Baufeld bei. Es gibt keine großen Geländestufen zwischen den Kacheln. Die vorhandenen Prüfungen größerer Baugrundrisse, Geländedreiecke und Kamerafreiheit gelten weiter. Ein geschwungener, eingesenkter Bach liegt im Tal ausschließlich außerhalb der auswählbaren Bauzone; Gelände, Wasserfläche, Pflanzen und Standortabfrage verwenden dieselbe Bachdefinition.

Die vier erdähnlichen Regionen haben eigene Vegetationsbilder: Küstenwiesen mit lichten Eichenhainen, ein Laubwaldtal mit Espen und Bach, Nadelwald und Bergwiesen im Hochland sowie ein dichter bewachsenes Vulkanbecken. `planet-biomes.js` trennt diese lebenden Landschaften von den Stein-/Sandpaletten der Geologie. Die Bildkorrektur behebt den konkreten Fehler der vorherigen Fassung: Die als Wiese verwendete Aufnahme bestand überwiegend aus braunem Material (nur etwa 2,4 % grüne Pixel), während zusätzlich braunes Waldlaub mit bis zu 92 % Gewicht dominierte. Jetzt liefern die Scans Struktur, die Biome grüne Turf- und Moosfarben; rohes braunes Laub ist unter Baumkronen auf einen kleinen Anteil begrenzt. Feuchtigkeit und zwei gegeneinander gedrehte Texturabtastungen verhindern eine einheitlich braune oder deutlich gekachelte Fläche.

Die ausgesparten, sehr breiten Korridore sind durch kleinere, unregelmäßige Wiesenlichtungen ersetzt. Vollständige Eichen-, Espen- und Kiefernkronen stehen auch nahe der Kolonie. Die früheren ausgedünnten PH-Jungbäume und flachen Fernwaldansichten werden dort nicht mehr angezeigt. Zwei feste Varianten je Art werden offline mit EZ-Tree 1.1.0 (MIT) erzeugt, mit tatsächlichen Alpha-Blättern und 1.806–5.840 Dreiecken je Variante. Der Renderer instanziert sie in 64-m-Gruppen; beschattende Bäume sind auf die nähere Kolonieumgebung begrenzt. Es kommen deutlich mehr Gras, Sträucher und Farne aus den passenden Habitaten hinzu. Trockene und luftlose Vorlagen erhalten weiterhin keine Vegetation. Der vergrößerte Bewuchs ist Kulisse und noch keine Rodungs- oder Forstwirtschaft.

Alle Terrainabschnitte und ihre Dreiecksauflösung werden von Darstellung, Felsplatzierung und Höhenabfragen gemeinsam beschrieben. Die tatsächlichen Bodenauflagen der Scans bleiben erhalten. Vorbereitung der vollständigen Bäume: `node scripts/prepare-planet-woodland.mjs <EZ-Tree-Quellcheckout>`. Quellen, Lizenztexte, feste Seeds und Verarbeitungsschritte stehen im Asset-Verzeichnis; der Generator wird nicht zur Laufzeit geladen. Die alte Sapling-/Atlas-Vorbereitung bleibt zur Nachvollziehbarkeit im Repository.

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

Prüfstand mit vollständigem Wald und grünen Habitaten: 374 automatisierte Tests bestanden. `tests/planet-flora.test.js` ergänzt größere Baugrundrisse, wurzelfeste und aufrechte Pflanzen, Habitatgrenzen, GLB- und Dreiecksbudgets, erhaltene Alpha-Texturen und vollständige räumliche Baumgruppen sowie den Bach außerhalb der Bauzone. Die Fokusprüfung umfasst zeitunabhängige Schritte, unveränderten Kameraversatz und die Projektion im Hochformat bei 320, 375 und 390 Pixeln Breite.

Die aktuelle Browservorschau meldet beim Erzeugen des WebGL-Kontexts `GL_RENDERER = Disabled / BindToCurrentSequence failed`. Deshalb sind WebGL-Bildqualität, Touchgesten und Grafikleistung dieses Patches im Browser nicht abgenommen. Alle vier Landschaftsaufbauten wurden mit denselben Rezepten, Terrainpunkten, vollständigen 3D-Bäumen und Felsplatzierungen zusätzlich in Blender betrachtet und korrigiert. Die belegte Modell-/Landschaftsprüfung unter `review/planet/woodland-v5-offline.jpg` ist ausdrücklich eine separate Renderprüfung; sie ist kein Screenshot des Browsers und ersetzt weder dessen Shaderprüfung noch eine iPhone-Leistungsmessung. Die vorhandenen Aufnahmen und `browser-inspection.json` unter `review/planet/` gehören zum früheren Grafikpatch und sind kein visueller Nachweis für Generatorversion 5. Eine Prüfung auf einem physischen iPhone steht ebenfalls aus.

`scripts/qa-planet-preview.mjs` prüft echte WebGL-Ausgabe, Assetabruf, Touchrotation und Pinchzoom, getrennten Fokus/Regionseintritt, Standortprüfung, wiederholte Regionswechsel mit begrenzten Grafikressourcen, Seed-Neuladen, alle drei Planetentypen und schmale Hochformate (390 × 844, 375 × 667, 320 × 568). Zusätzlich werden die vier Regionen einzeln aufgenommen, alle geladenen Felsauflagen numerisch geprüft und die Felsen aus vier Kamerarichtungen betrachtet. Ergebnisse und Aufnahmen stehen unter `review/planet/`. Das ersetzt keine Messung auf einem physischen iPhone.
