# ORBIT 3077

Eine eigenständige planetare Aufbau- und Kriegssimulation für den **iPhone-Browser im Hochformat**.
Fiktive Welt im Jahr 3077, mit lokalen Produktionsketten, fremden Spezies und interstellarer Politik.
Arbeitstitel: ORBIT 3077.

## Planetarer Basenbau

- Zusammenhängende Fels-, Eis- und Vulkanoberflächen mit Kratern, Eisbrüchen und vulkanischen Wärmequellen. Die Geologie eines Planeten bleibt dauerhaft gleich.
- Freie Flächen antippen, um Boden und Standortwirkung zu prüfen. Erzadern geben Erzförderern und Tiefenförderanlagen +20–35 % Ertrag; Wärmequellen geben Geothermiekraftwerken +40 %. Vorkommen erschöpfen sich nicht.
- Beim Bauen zeigt die Vorschau den Standortbonus und den Ertrag inklusive Planetenfaktoren, Forschung und Regierung. Tatsächliche Produktion setzt Personal und Versorgung voraus.
- Alle 37 Gebäudetypen haben erkennbare Anlagenformen. Fundamente, Rohbau und Endausbau zeigen den Baufortschritt; fertige Anlagen verbinden sich automatisch.
- Verbindungen belegen keine Baufläche und benötigen keine Transportaufträge. Versorgung bleibt Teil des gemeinsamen Planetenvorrats. Kleine Displays behalten brauchbare Bauflächen; Karte verschieben und mit zwei Fingern zoomen.
- Vorhandene Spielstände, Gebäude und Baukoordinaten bleiben erhalten. Gasriesen, neue Fantasierohstoffe und Terraforming gehören noch nicht zu diesem Ausbau.

## Erste spielbare Fassung

- Drei Sonnensysteme, sieben Planeten und vier politische Mächte.
- Planetenoberfläche, Systemkarte und Sternenkarte mit Touchauswahl, Verschieben und Zoom.
- Zehn Gebäudetypen, sieben lokal gelagerte Waren und echte Produktionsketten.
- Bevölkerung, Wohnraum, Arbeitskräfte, Nahrung, Steuern, Zufriedenheit und Haushalt.
- Sechs Regierungsformen, Regierungswechsel, Wahlen, Diplomatie und Handelsabkommen.
- Vier Technologien mit wirksamen Änderungen an Energie, Schiffen, Reisen und Wohnraum.
- Korvetten, Frachter, Kolonie- und Landungsschiffe mit Bauzeit und materiellen Kosten.
- Kolonisierung, wiederholbare Frachtrouten, Handel, Orbitalgefechte und planetare Besetzung.
- Gegnerische Versorgung und Wiederaufbau der Verteidigung; im Krieg regelmäßige Gegenangriffe.
- Ereignisse mit Entscheidungen, automatische lokale Speicherung und Spielstanddateien.
- Pause und Zeitbeschleunigung; nach erfolgreicher Installation der Offline-Dateien auch ohne Netz spielbar.

Die erste Fassung ist ein spielbarer Grundstock. Gegner bauen noch keine eigenen neuen Kolonien und keine frei beweglichen Flottenverbände.
Ihre Gegenangriffe werden als Überfälle berechnet. Komplexe Befehlshierarchien, eigene Parteienorganisationen, Bodenkampfzonen,
vollständige Sternenreisen und Multiplayer sind noch nicht implementiert.
Ideologien und Zahlen sind Spielregeln der fiktiven Welt und keine historischen Modelle.

## Spielen mit GitHub Pages

Die vorbereitete Pages-Ausgabe liegt in `docs/`. Im Repository unter **Settings → Pages**:

1. Source: **Deploy from a branch**.
2. Branch: **main**, Ordner: **/docs**.
3. Save.

Nach erfolgreicher Veröffentlichung lautet der Spielzugang:
`https://fabitiko93-cmd.github.io/Browser-Game/`

Safari öffnen; optional über **Teilen → Zum Home-Bildschirm** hinzufügen.
Automatische Speicherung gehört zum jeweiligen Browser und Gerät. Vor Gerätewechsel oder Löschen der Browserdaten den Spielstand im Spielmenü als Datei sichern.

## Erste Schritte

1. Kolonie übernehmen. Mit dem Zeitsymbol pausieren; mit der Geschwindigkeitsanzeige zwischen 1×, 2× und 4× wechseln.
2. Unter **Bauen** eine Kristallmine und anschließend eine Laserfabrik auswählen; Baufläche antippen und bestätigen.
3. Unter **Wirtschaft** Bestände und Tagesbilanzen prüfen. Forschungspunkte stammen aus Laboren.
4. Unter **Flotte → Raumwerft** ein Kolonieschiff fertigen.
5. Unter **Flottenbefehle** das fertige Kolonieschiff auswählen, Cinder als Ziel wählen und kolonisieren.
6. Waren zwischen Kolonien mit Frachtern bewegen. Für fremde Planeten zunächst ein Handelsabkommen schließen.
7. Für Angriffe Krieg erklären; Korvetten und Landungsschiffe gemeinsam schicken. Gegnerische Verteidigung ist in den Planetendetails sichtbar.

Gebäude antippen, um Betrieb oder Abbau zu verwalten. Zwei Finger zoomen, ein Finger verschiebt die Karte.
Alle wichtigen Verwaltungsaktionen liegen im unteren Bildschirmbereich. Das Detailfenster lässt sich über den Griff vergrößern.

## Entwicklung

Node 22 oder neuer. Keine Paketinstallation nötig.

```sh
npm run dev
```

Das Spiel läuft unter `http://127.0.0.1:4174/`. Änderungen an `src/` oder `web/` bauen automatisch neu; anschließend die Seite neu laden.
Port über `ORBIT_PORT` ändern. Zum Entwickeln Service Worker in den Browserwerkzeugen deaktivieren oder einen frischen Browserkontext verwenden.

```sh
npm run build
npm test
npm run build:check
```

Quellen und erzeugtes `docs/` zusammen committen. Modulkarte: [ARCHITECTURE.md](ARCHITECTURE.md).

## Erweiterung 0.2

- Sechs politische Spielprofile mit Vorteilen und Kosten: Handel, Industrie, Verwaltung, Militär, Forschung und Mobilisierung. Keine pauschale Abwertung einer Regierungsform; Gesetze sind für alle Formen verfügbar.
- Sechs Gesetzesbereiche mit jeweils drei Optionen: Wirtschaft, Arbeit, Militärdienst, Einwanderung, Forschung und Verwaltung. Gesetzeswechsel kosten 60 Credits und 3 Stabilität, mit fünf Tagen Verwaltungszeit bis zum nächsten Wechsel.
- Sechs befristete Regierungsprogramme mit sichtbaren Auswirkungen, Kosten und Sperrfristen.
- Neun Schiffstypen: zusätzlich Aufklärer, Laserzerstörer, Schlachtkreuzer, Großfrachter und Versorgungsschiff. Erkundung bringt einmal pro Planet 45 Forschung, Großfrachter transportieren 200 Waren, Panzerung mindert Schäden.
- Schiffsgeschwindigkeit, täglicher Flottenunterhalt, Versorgungstransfers und Forschungsbonus für alle bewaffneten Schiffe. Werftboni gelten für neu erteilte Aufträge.
- Bestehende v1-Spielstände werden automatisch übernommen. Zum Laden eines neuen Service-Worker-Caches alle offenen Spieltabs schließen und das Spiel neu öffnen.

## Erweiterung 0.3

- Haushaltsfehler behoben: lokaler Überschuss wurde bisher ohne Flottenunterhalt angezeigt. Der Reichshaushalt erfasst nun Steuern, Gebäude und Flotten aller eigenen Planeten in einer gemeinsamen Abrechnung.
- HUD und Wirtschaft verwenden dieselbe Vorschau auf den nächsten Spieltag. Wartung, Versorgung, Bevölkerungsänderungen und fertig werdende Gebäude sind darin enthalten. Laufende Raten sind von Einzelbuchungen wie Frachtverkauf oder Abflugenergie getrennt; die letzte Tagesabrechnung ist sichtbar.
- Tagesraten direkt im HUD; Bestände zeigen Nachkommastellen. Dunkles Weltraumdesign in Blau und Violett, neue Kartentöne und touchfreundliche Forschungsansichten.
- Politische Profile mit kausalen Rollen: Demokratie (Handel/Debatte), Kommunismus (Produktion/Beschäftigung), Monarchie (Verwaltung/Kontinuität), Militärdiktatur (Werften/Einsatzlogistik), Technokratie (Forschung/Entwicklung/Energieeffizienz), Nationalsozialismus (Rüstung/Mobilisierung). Vorteile und Kosten werden vor Änderungen ausgewiesen.
- 42 Technologien in Energie, Industrie, Kolonien, Wissenschaft, Raumfahrt, Flotten und Handel. Voraussetzungen, Querverbindungen und sieben dauerhafte Spezialisierungsentscheidungen ermöglichen unterschiedliche Spielweisen. Eine vollständige Richtung umfasst 35 der 42 Technologien.
- Kleine Technologieboni ersetzen die vier frühen Pauschalboni. Bereits erforschte Technologien bleiben abgeschlossen; fehlende neue Grundlagen werden automatisch ergänzt. Laufende Aufträge behalten ihre Restzeit. Alte v1- und v2-Spielstände werden als v3 übernommen.
