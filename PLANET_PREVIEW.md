# Musterplanet

`planet-preview.html` öffnet einen drehbaren Globus mit drei bis fünf Regionen. Der Einstieg aus dem Spiel übernimmt Seed und Namen der Heimatwelt. Die Simulation pausiert und speichert vorher; die Probe schreibt keine Reichsdaten. Gleicher Seed, gleiche Vorlage, Regionszahl und Generatorversion reproduzieren dieselbe Probe. Seed und Optionen stehen in der URL.

## Geografie, Landschaft und Koloniestandort · 21.10.2026

Generatorversion 6 verbindet die drei Maßstabsebenen. Die erdähnliche Welt verwendet keine unabhängigen Marker auf einer festen Erdkarte mehr. `planet-geography.js` erzeugt sphärische Kontinental-, Höhen-, Feuchte-, Temperatur- und Vulkanismusfelder aus dem Planetensamen. Der Globus und die Suche nach passenden Regionsstandorten lesen dieselben Felder. Die Koordinaten liegen auf tatsächlichem Land; eine Küste wird bis an den Land-/Meerübergang verfeinert. Temperatur hängt von Breite und Höhe ab. Höhenlage, Feuchte und Geologie bestimmen die Standorte der Landschaftsmodule und gehen in die regionalen Rezepte ein. Ein fünfter Standort ergänzt eine wärmere Südküste.

Die globale Textur verwendet nahtlose sphärische Felder einschließlich polarer Eisfarben. Erdähnliche Kontinente verändern sich mit dem Seed. Die Erd-Nachtkarte mit fremden realen Städten wird dort nicht mehr angezeigt. Trocken- und Mondvorlagen behalten die vorhandenen Referenzkarten. Wolken verwenden weiterhin die lizenzierte Wolkenaufnahme.

| Standort | Landschaft | Örtliche Erschließung |
| --- | --- | --- |
| Warme, niedrige Küste | Geschwungene Bucht, schmaler Strand, grüne Küstenwiesen, niedrige Eichen-/Kieferngruppen | Küstenparallele Achse und höhere Uferterrasse; der Stichweg folgt der tatsächlich erzeugten Küste |
| Feuchteres Binnenland | Mäandrierender, durchgehender Fluss, Aue und dichter Laubwald | Quartiere auf der trockenen Flussterrasse neben der Aue |
| Höherer, kühler Standort | Nadelwald an unteren Hängen, offene Bergwiesen, Baumgrenze und Schnee an höheren Bergrücken | Versetzte Baugruppen auf einem geschützten, sanften Hangplateau |
| Vulkanischer Standort | Kratersee, offenliegender dunkler Basalt, Moospolster, wenige kleinere Baumgruppen | Gebogener Erschließungsweg zwischen Basaltrücken und See |

Die Vegetation unterscheidet sich in Arten, Größe, Verteilung und Dichte. Beim Musterseed stehen im gesamten Umgebungsrezept rund 470 Bäume an der Küste, 1.360 im Flusstal, 670 im Hochland und 80 im Vulkanbecken. Das sind Rezeptzahlen, keine gleichzeitigen sichtbaren Bäume. Waldflächen, Feuchtigkeit, Ufer, offener Basalt, Baumgrenze und Schnee steuern gemeinsam Bodenmaterial und Bewuchs. Farne werden nicht pauschal in allen Regionen verteilt. Wiesen-/Moosfarben bleiben unabhängig von überwiegend braunem Scan-Laub; die Aufnahmen liefern feinere Oberflächendetails.

`planet-colony.js` beschreibt unterschiedliche Wege und Baugruppen als Standortentwürfe. Wege sind zurückhaltend, mit weichen Rändern dargestellt. Vorbereitete Flächen erscheinen als dezente Überlagerung zusammen mit dem optionalen Raster. Pflanzen und Felsen halten die Erschließung frei. Koordinaten und Höhenlage stehen an der Region; eine mit der Ansicht mitdrehende Nordanzeige verbindet die lokale Geländeausrichtung mit dem planetaren Standort. Der Globus fokussiert die gewählte Koordinate direkt. Die regionalen Kameras zeigen beim Einstieg auch die jeweilige Landschaft; Näherzoomen und manuelles Drehen bleiben möglich.

Die 128 × 128 m große Bauzone bleibt sanft. Starke Bergrücken und Kraterränder beginnen außerhalb größerer Gebäudegrundrisse; Fluss und See liegen außerhalb des Baufelds. Ein feinerer Terrainstreifen um das Baugebiet bildet Flussufer, Seeufer und nahe Felsrücken ab. Darstellung, Bodeneinpassung und Kamera verwenden dieselben adaptiven Dreiecke. Der lokale Höhenursprung wird für das Rendering verwendet; die planetare Höhenlage bleibt als geografischer Wert im Rezept. Die Region ist ein Landschaftsausschnitt am passenden Standort und kein lückenloser geometrischer Zoom aus der gesamten Kontinenttextur.

## Bedienung und Grenzen

Ein Tipp in der Übersicht wählt und fokussiert eine Region; „Region betreten“ wechselt in die Landschaft. Ein Finger dreht, zwei Finger verschieben und zoomen. Das optionale Raster und seine Maße sind Probewerte, keine endgültige Festlegung für alle Kolonien oder Gebäude.

Raster, Standortprüfung und Auswahl teilen die Grenze von 64 × 64 Kacheln à 2 m. Ein Tipp wählt die tatsächliche Kachelmitte; ein Tipp außerhalb hebt die Auswahl auf. Der sanfte Kachelfokus verschiebt Blickpunkt und Kamera über 0,65 Sekunden gemeinsam und erhält Zoom und Blickwinkel. Eigene Gesten beenden ihn; reduzierte Bewegung setzt das Ziel sofort. Die Kamera bleibt über den gerenderten Bodenflächen und dazwischenliegenden Höhenzügen, auch beim Verschieben und Zoomen.

Minerva-Gebäudedateien liegen nicht vor. Die Standortentwürfe erzeugen keine Gebäude, keine Bauaufträge, keine kostenlosen Anlagen und keine angebundene Produktion. Sie zeigen die landschaftlich passende Erschließung. Die vorhandene strategische Wirtschaft, Erkundung, Bevölkerungswerte und das Spielstandschema bleiben maßgeblich. Die Probe hat keine gespeicherten Bauten älterer Generatorversionen zu migrieren; unbekannte Rezeptversionen werden zurückgewiesen.

## Assets und Darstellung

Boden, Felsen und Unterwuchs: Poly Haven, CC0. Vollständige räumliche Eichen, Espen, Kiefern und Sträucher: EZ-Tree 1.1.0 von Daniel Greenheck, MIT, mit ambientCG-Rinde, CC0. Referenzkarten und Wolken: Solar System Scope / INOVE, CC BY 4.0. `web/models/planets/ATTRIBUTION.md`, Lizenzdateien und `provenance.json` enthalten Quellen, Prüfsummen und Vorbereitung. Es wurden keine neuen Pack-Dateien für diesen Geografiepatch benötigt.

Die vorbereiteten Bäume besitzen zwei feste Varianten je Art, tatsächliche Alpha-Blätter und 1.806–5.840 Dreiecke je Variante. Sie werden in 64-m-Gruppen instanziert; beschattende Bäume sind auf die nähere Kolonie begrenzt. Der Generator wird nicht zur Laufzeit geladen. Vorbereitung: `node scripts/prepare-planet-woodland.mjs <EZ-Tree-Quellcheckout>`. Die tatsächlichen unteren Scanvertices bestimmen die Felsauflagen; die geschlossenen/versenkten Scans bleiben korrekt im Gelände verankert. Trockene und luftlose Welten erhalten keine Vegetation.

## Prüfung

`npm run build`, `npm test` und `npm run build:check` sind vor der Veröffentlichung auszuführen. Die 379 automatisierten Tests umfassen Simulation und Vorschau. Die Geografieprüfungen vergleichen Marker mit tatsächlichem Land und exakt denselben Klimawerten wie der Globus, prüfen Datumsgrenze und Kugel-UVs, Küstennähe, verschiedene Höhenlagen/Vegetationsstrukturen, Wasser außerhalb der Baugrundrisse und freie Erschließungswege. Bestehende Prüfungen kontrollieren große Baugrundrisse, echte Raycaster-Treffer der Terrainpatches, aufrechte Pflanzen, Felsauflagen, 144 Kameraposen sowie den sanften Fokus in schmalen Hochformaten.

Die Browserumgebung scheitert weiterhin beim Erzeugen eines WebGL-Kontexts (`Error creating WebGL context`). Deshalb sind die WebGL-Ausgabe, die neuen Shader, Touchgesten und die Leistung auf einem iPhone hier nicht visuell abgenommen. Die vier aktuellen Landschaften wurden zusätzlich mit tatsächlichen Terrainpunkten, Habitaten, GLB-Varianten und angepassten Fels-LOD-Posen in Blender/CPU betrachtet. Diese separate Renderprüfung ist kein Screenshot des Spiels und bildet Shader und Licht nicht pixelgleich ab.

Reproduzierbarer Export: `node scripts/export-planet-review.mjs artifacts/landscapes [seed]`. Anschließend `blender -b --python scripts/render-planet-review.py -- artifacts/landscapes 0` bis `3`. `review/planet/geography-v6-offline.jpg` dokumentiert die vier Ansichten zusammen mit der tatsächlich erzeugten Globustextur und Regionskoordinaten. Ältere Aufnahmen und `browser-inspection.json` im Reviewverzeichnis gehören früheren Grafikständen an.
