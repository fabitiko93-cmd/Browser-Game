# ORBIT 3077

Eine eigenständige planetare Aufbau- und Kriegssimulation für den **iPhone-Browser im Hochformat**.
Fiktive Welt im Jahr 3077, mit lokalen Produktionsketten, fremden Spezies und interstellarer Politik.
Arbeitstitel: ORBIT 3077.

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
