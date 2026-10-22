# Landschaftsvergleich

## Ziel und Abnahme

Gestalterische Entscheidungen früh in vollständigen gerenderten Szenen vergleichen. Der Nutzer kann vom iPhone aus bestehende Landschaften, drei Bildstimmungen und feste Kameras vergleichen, Einstellungen direkt abstimmen und bis zu drei Aufnahmen mit reproduzierbaren Ansichten festhalten.

Die Darstellung verwendet den vorhandenen Renderer und dieselben generierten Regionen. Keine Änderung an Geografie, Ökologie, Lagerstätten, Bauidentitäten oder strategischen Spielständen durch die Abstimmung. Gespeicherte Probebauten bleiben erhalten. Die normale Planetenprobe behält ihre Bau- und Touchfunktionen.

## Umsetzung

- Ein eigener kompakter Bereich der Planetenprobe, erreichbar über die Optionen und `studio=1`.
- Zehn reproduzierbare Orte aus der bestehenden Generierung, drei bodensichere Kameras und drei initiale fotografische Varianten. Jede Kamera lässt sich nach freier Bewegung wieder exakt herstellen.
- Belichtung, Umgebungslicht, Dunst und Bodendetails wirken relativ zu unveränderlichen regionalen Ausgangswerten. Keine Aufsummierung beim Wechsel. Wasser und Gelände teilen dieselbe Dunststärke; luftloses Gestein bleibt dunstfrei. Sonnenrichtung und Himmelsaufnahme bleiben abgestimmt.
- Bis zu drei JPEG-Aufnahmen, auf maximal 1200 Pixel an der langen Seite begrenzt, mit Download, Verwerfen, vollständiger Wiederherstellung und teilbarem Ansichtslink. Keine Bildspeicherung in localStorage, kein zweiter WebGL-Kontext.
- Der Vergleich arbeitet mit leerem, separatem Bauzustand und gesperrten Bauaktionen. Beim Rückweg wird der vorhandene Zustand wieder dargestellt. Die ursprüngliche Natur lässt sich dadurch ohne frühere Räumungen beurteilen.
- Der bei der Vorprüfung gefundene Regolith-Fehler ist korrigiert: Kälte allein klassifiziert luftloses Mondgestein nicht länger als Eisuntergrund. Das tatsächliche bestehende Eisbiom bleibt Eisuntergrund. Keine neue Planetenfamilie wird damit behauptet.
- `VISUAL_WORKFLOW.md` und die knappen Arbeitsregeln verankern Referenzen, frühe Asset-Prüfung und vollständige Rendervergleiche vor dem Ausbau. `quality:planet` bündelt den Abschlussablauf.

## Prüfung

Die zugehörigen Node-Tests prüfen Bookmark-Abdeckung, vollständige Link-Rundläufe, Begrenzung ungültiger Parameter, sichere reproduzierbare Kameras ohne Rezeptänderung sowie die Regolith-/Eis-Unterscheidung.

Die Browserprüfung ist bestanden. Sie prüft tatsächliche Touch-Regler, drei Bildaufnahmen, Verwerfen und erneute Belegung, Wiederherstellung im selben Ort und nach mehreren Landschaftswechseln, Ansichtslinks nach Reload, unveränderte Geometrie/Kamera/Bildgröße beim Stimmungswechsel und bytegleich erhaltene Bau-Speicherdaten. Alle drei Kameras wurden in Eislandschaft, Regenwald und Küste durchgespielt. Der Rückweg stellt den gespeicherten Probebau und die ursprüngliche Beleuchtung wieder her. Keine Seiten-, Asset- oder Shaderfehler wurden aufgezeichnet.

- Vollständige Testsuite: **417 bestanden, 0 fehlgeschlagen**.
- Build und Build-Abgleich: **280 Dateien**, Cache-Fingerabdruck `5608d83291240eb2`.
- Ressourcen-Audit: **300 Planeten, 1.500 Regionen, 6.000 Felder**, keine Fehler.
- Bestehende Bauauswahl-Browserprüfung: bestanden, einschließlich Gebäudegeistern, Bau/Abriss, vollständigen Ressourcenmarkierungen und Auswahl außerhalb des Rasters.
- Studio-Browserprüfung mit Chromium 153: **390 × 844 und 320 × 568**, alle Aktionen im Bildschirm, mindestens 44 Pixel große Touchflächen, keine horizontalen Überläufe. Die Regler werden ebenfalls per Touch geprüft.
- Gerenderte Oberfläche, Vergleichsgalerie, Eislandschaft, Regenwald und Küste wurden tatsächlich visuell angesehen. Aufnahmen und der maschinenlesbare Bericht liegen unter `review/planet/studio/`.

Echte iPhone-/Safari-Leistung ist durch Software-Chromium nicht gemessen. Die neuen Bildstimmungen sind Entwürfe zur Beurteilung, keine automatisch gewählte neue Gestaltung aller Planeten.
