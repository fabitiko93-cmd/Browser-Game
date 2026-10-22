# Früher überzeugende Spielansichten

Ziel: bereits der erste gestalterische Entwurf soll eine zusammenhängende Szene zeigen. Die visuelle Richtung früh entscheiden und mit kurzen Rendervergleichen verbessern, bevor viel Inhalt davon abhängt. Der Nutzer gibt die Richtung vor; Recherche, technische Übersetzung und interne Vergleiche übernimmt der Agent.

## Vor der Umsetzung

- In wenigen Sätzen Spielerperspektive, Qualitätsziel, mobile Grenzen und unveränderliche Spielregeln festhalten. Nutzerentscheidungen und eigene Vorschläge trennen.
- Wenige passende visuelle Referenzen heranziehen. Geländeformen, Maßstab, Materialverteilung, Licht, Himmel und Vegetationsgruppen konkret daraus ableiten. Herkunft und Lizenz externer Assets prüfen.
- Vorhandene Materialien und Modelle im echten Renderer beurteilen. Früh entscheiden, ob sie geeignet sind, ergänzt oder ersetzt werden müssen. Fehlende Formqualität wird nicht durch zusätzliche Details geheilt.
- Das größte offene gestalterische oder technische Problem zuerst an einem kleinen Szenenausschnitt lösen. Kein verpflichtender neuer Freigabeschritt für Routinedetails.

## Den ersten Entwurf herstellen

1. Gelände, Boden, Himmel, Licht und exemplarischen Bewuchs zusammen einsetzen. Aus der späteren Spielerperspektive und mit realistischen mobilen Budgets rendern.
2. Bei einer offenen Grundrichtung zwei oder drei gezielte Varianten vergleichen. Pro Vergleich eine klare Frage stellen, z. B. Lichtkontrast, Materialwirkung oder räumliche Gliederung. Kameras, Seed und übrige Einstellungen gleich halten.
3. Gerenderte Ansichten tatsächlich ansehen. Konkrete Mängel benennen und die stärkste Variante weiterführen. Ein Konzeptbild und bestandene Programmtests ersetzen diese Sichtprüfung nicht.
4. Die gemeinsamen Regeln früh auf andere Landschaften und mindestens einen schwierigen Fall anwenden. Keine nach Seed verzweigten Schönheitskorrekturen.
5. Erst nach tragfähigen Geländeformen, Materialverteilung, Größenverhältnissen und Licht die kleinen Details ausarbeiten und den Umfang erweitern.

## Landschaftsvergleich benutzen

In der Planetenprobe unter Optionen „Landschaften vergleichen“ öffnen; direkte Links verwenden `studio=1`.

- Zehn bestehende Seed-Beispiele: acht Klimabiome, eine trockene Welt und luftloses Gestein. Die Beispiele verwenden dieselbe Geografie und dieselben Assets wie die Bauprobe.
- Drei feste, bodensichere Kameras: Übersicht, Baugebiet und Bodennähe. Die freie Kamera bleibt nutzbar; der Ansichtslink enthält ihre tatsächliche Position.
- „Natürlich“ ist die unveränderte regionale Beleuchtung. „Weich“ und „Klar“ sind kontrollierte fotografische Varianten. Belichtung, Umgebungslicht, Dunst und Bodennormalen lassen sich ohne Regionsneubau abstimmen. Luftlose Welten bekommen keinen Dunst.
- „Bild merken“ hält bis zu drei komprimierte Aufnahmen. Im Vergleich können sie wiederhergestellt, als Bild gespeichert oder über ihren Ansichtslink reproduziert werden. Bilder bleiben in dieser Sitzung; Links können dauerhaft gespeichert werden. Die Reproduktion gilt für dieselbe Generator- und Assetversion; nach einer bewussten Änderung dieser Grundlagen neue Vergleichsaufnahmen anlegen.
- Ein Renderer, begrenzte Bildgröße und eingefrorene Wasser-/Dampfanimationen verhindern unnötige Last und störende Unterschiede zwischen den Aufnahmen. Sonnenrichtung und fotografierter Himmel bleiben zusammengehörig.
- Vergleiche zeigen die ursprüngliche unbebaute Landschaft. Bauaktionen sind dort gesperrt. Vorhandene Probebauten und Räumungen werden beim Rückweg wieder geladen; gespeicherte Daten bleiben unangetastet.
- Der Vergleich ist ein Arbeitswerkzeug. Die fotografischen Entwürfe werden nicht automatisch zum neuen Standard der Spielwelt.

Beispiel für das vorhandene Eisbiom, **keine neu implementierte Eiswelt-Familie**:

`planet-preview.html?studio=1&seed=28&preset=temperate&regions=5&region=region-4`

## Prüfungen und Ergebnis

`npm run quality:planet` führt sequenziell Build, vollständige Node-Tests, Build-Abgleich, Ressourcen-Audit und Browserprüfungen für Bauauswahl sowie Landschaftsvergleich aus. Beim ersten Fehler stoppt der Ablauf.

Die Browserprüfungen benötigen Playwright und Chromium. Standardinstallation, falls noch nicht in der Entwicklungsumgebung vorhanden: `npm install --no-save --package-lock=false playwright@1.62.1`, danach `npx playwright install chromium`. Alternativ kann `ORBIT_BROWSER_EXECUTABLE` auf einen vorhandenen Chromium zeigen; eine bereitgestellte Codex-Laufzeit wird ebenfalls erkannt. Fehlende Browserprüfung gilt als offen, nicht als bestanden.

Die Studio-Prüfung schreibt Bilder und `browser-inspection.json` nach `review/planet/studio/`. `ORBIT_QA_OUTPUT_DIR` kann den Ausgabeordner ändern, `ORBIT_QA_BASE_URL` erlaubt denselben Test gegen eine veröffentlichte Version. Die Bauauswahl-Prüfung verwendet ihren bestehenden Ausgabeordner.

Aufnahmen danach visuell prüfen. Ladeverhalten, Renderaufwand und wiederholte Wechsel berücksichtigen. Software-Chromium im Hochformat und echte iPhone-/Safari-Messungen ausdrücklich getrennt ausweisen. Abschließend die ausgelieferte Version prüfen und knapp berichten, was fertig, belegt und offen ist.

## Nächste Planetenfamilien: bekannte Grundlagen

Die vorhandenen Biome und Bildstimmungen sind keine vollständigen neuen Planetentypen. Eine eigene Eiswelt braucht geeignete Eis-/Schneematerialien und charakteristische Formen; aktive Vulkanwelten passende Basalt-/Lavaflächen; ozeanische Welten kontrollierte Küsten-/Inselgeometrie und nutzbares Land. Diese Lücken vor dem jeweiligen Ausbau gezielt bearbeiten. Das bestehende Typ-Mapping des Hauptspiels ist weiterhin vereinfacht und muss mit den tatsächlichen Familien erweitert werden.
