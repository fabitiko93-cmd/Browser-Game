# Modulkarte

| Datei | Zuständigkeit |
| --- | --- |
| `src/data.js` | Gebäude, Waren, Technologien, Ideologien, Schiffe und Startwelten |
| `src/state.js` | Neuer Spielstand, IDs, Bestände, Gelände, Datumsanzeige und Meldungen |
| `src/economy.js` | Lokale Produktionsketten, Arbeitskräfte, Bevölkerung, Bau und Tagesprognosen |
| `src/governance.js` / `src/governance-ui.js` | Politische Profile, sechs Gesetzesbereiche, befristete Regierungsprogramme und deren Ansichten |
| `src/politics.js` | Regierung, Steuern, Wahlen, Diplomatie, Krieg und Unruhen |
| `src/technology-data.js` / `src/technology.js` | 77 Technologien, zehn Fachgebiete, Voraussetzungen, Spezialisierungen und Modifikatoren |
| `src/research.js` / `src/research-ui.js` | Forschungsaufträge, politische Entwicklungsdauer, Technologieabschluss und touchfähiger Baum |
| `src/budget.js` | Gemeinsame laufende Tagesabrechnung und Vorschau für Reichshaushalt, HUD und Ressourcen |
| `src/fleets.js` | Werftaufträge, Reisen, Kolonien, Frachtrouten, Kämpfe und gegnerische Überfälle |
| `src/simulation.js` | Tagesablauf und interaktive Ereignisse |
| `src/save.js` | Lokaler Spielstand, Validierung, Import und Export |
| `src/map.js` | Canvas-Karten, Oberflächen, Planeten, Sterne, Auswahl, Verschieben und Zoom |
| `src/surface.js` / `src/surface-ui.js` | Seedbasierte Geologie, Standortboni, Bauphasen, automatische Verbindungen und Standortvorschau |
| `src/surface-renderer.js` / `src/surface-buildings.js` | Zusammenhängende Fels-, Eis- und Vulkanlandschaften, zwischengespeicherte Gebäudegrafik und Bauplatzmarkierung |
| `src/ui.js` / `src/icons.js` | Verwaltungsansichten und SVG-Symbole |
| `src/main.js` | Laufende Anwendung, Eingabe, Zeitsteuerung und Speicherung |
| `web/` | HTML, CSS, App-Manifest und Icon |
| `scripts/` | Deterministischer Build und lokaler Entwicklungsserver |
| `tests/` | Regeln der Simulation und Integrationsabläufe |

Waren befinden sich auf einzelnen Planeten. Credits und Forschung gelten reichsweit.
Oberflächen werden dauerhaft aus Planetensamen und Planetentyp abgeleitet. Alte Baukoordinaten und bebaubare Flächen bleiben erhalten; das Speicherformat bleibt v6. Drei örtliche Erzfelder liefern +20–35 % Ertrag für Erzförderer/Tiefenförderanlagen, Wärmequellen +40 % für Geothermie. Sie erschöpfen sich nicht. Planeten-, Standort-, Forschungs- und Regierungsfaktoren gehen über `productionFactor` in dieselbe Simulation und Ertragsvorschau ein. Verbindungen zwischen fertigen Anlagen sind rein visuell: keine Bauflächen, Kosten oder gesonderten Transportaufträge. Versorgung erfolgt weiterhin aus dem gemeinsamen Planetenvorrat. Gelände und Gebäudegrafik werden begrenzt zwischengespeichert; Bauphasen folgen den bestehenden Restbauzeiten.
Ein Spieltag dauert bei 1× drei Sekunden. Geschwindigkeit: Pause, 1×, 2×, 4×.
Beim Wechsel in den Hintergrund wird pausiert; es gibt keine Offline-Zeitfortschreibung.
Reisen und Fabriken werden jeweils im Tagesablauf verarbeitet. Flottenaufträge validieren Kosten, Zugang und Auswahl vor jeder Buchung.

Der Build kopiert die eigenständigen ES-Module nach `docs/build/` und erzeugt den Service Worker aus dem vollständigen Dateiinhalt.
Der Cache besitzt einen automatisch ermittelten Hash. Keine externe Bibliothek, Schrift oder CDN ist zum Spielen nötig.
Speicherformat: v6. v1, v2, v3, v4 und v5 werden beim Laden ohne Verlust von Planeten, Waren oder Missionen migriert. Erforschte alte Technologien bleiben erhalten; ihre neuen Grundlagen werden ergänzt. Laufende Forschungs- und Werftaufträge behalten ihre Restzeit. Neue Spielerprogramme werden nicht automatisch aktiviert. v5 erhält drei fremde Hauptwelten und vier Güter; bereits zerstörte Sterne bleiben zerstört.
Politische Profile und Gesetze multiplizieren konkrete Wirtschafts- und Flottenwerte; Zufriedenheit addiert sich. Grundgesetze bleiben gemeinsam; bestimmte Einwanderungs-, Forschungs- und Verwaltungsoptionen sowie Reformprogramme passen nur zu bestimmten Regierungsformen. Institutionelle Reformforschung schaltet weitere Möglichkeiten frei. Unpassende Optionen werden bei Regierungswechsel oder Altspielstandmigration auf die gemeinsame Grundoption zurückgesetzt. Werftzeiten werden bei Auftragserteilung berechnet; bestehende Aufträge behalten ihre Restzeit.
Flottenverbände reisen mit dem langsamsten Schiff. Panzerung reduziert Kampfschaden, Versorgungsschiffe übertragen vorhandene Versorgung. Frachterkapazität wird pro Schiffstyp geprüft.

Tagesreihenfolge: laufende Wirtschaft (alle Planeten, ein reichsweiter Haushalt, Flottenunterhalt, stationäre Wartung), Werften, Forschungsabschluss und fremde Entwicklung, Reisen/Handelsbuchungen, Gegner, Politik und Programmablauf, Vertragsperioden, Fernwaffen, Meilensteinbelohnungen, diplomatische Hilfe und Ereignisplanung.
`forecastDay` rechnet denselben laufenden Wirtschaftsschritt auf einer Kopie für den nächsten Tag. Das HUD zeigt Credits/Forschung reichsweit und Waren lokal, jeweils pro Spieltag. Einzelbuchungen wie Lieferungen und Abflüge sind keine dauerhaften Raten. `lastDayReport` dokumentiert diese zusätzlichen Buchungen.
Sieben Fachgebiete haben jeweils ein exklusives Spezialisierungspaar; drei zusätzliche militärische Zweige haben keine Ausschlüsse. Der Baum hat 77 Knoten, davon sind pro Spiel 70 erforschbar. Technologieboni sind kleine, kumulative Stufen; die alten vier pauschalen Maximalboni wurden durch den neuen Baum ersetzt.
Politische Profile stehen ausschließlich in `governance.js`. Beschreibungen und angezeigte Forschungsfaktoren müssen dieselben Modifikatoren nutzen wie die Simulation.

`military-data.js`, `military-technologies.js`, `strategic.js` und `strategic-ui.js` enthalten zehn Basentypen, fünf Fernwaffen, 18 Forschungsstufen und acht einmalige Meilensteine. Die Karte hat neun Sterne und 28 Welten; v3-Spielstände erhalten die 18 neuen Grenzwelten ohne Änderungen an den alten Kolonien.
Schilde regenerieren im gemeinsamen Wirtschaftsschritt nur mit aktiven Anlagen. Fernwaffen buchen lokale Ladekosten einmal, benötigen eine versorgte Anlage bis zum Start und fliegen danach unabhängig weiter. Frieden verhindert einen Einschlag. Planeten- und Sternenzerstörung ist endgültig; Kolonisierung, Routen und Flotten werden entsprechend gesperrt oder umgeleitet. Endspielwaffen benötigen eine zweite Bestätigung; Systeme mit eigenen oder nicht feindlichen Kolonien sind gesperrt. Gegner verfügen an den neuen Grenzwelten über Schilde/Silos und schießen im Krieg ab Tag 180 Fernraketen.

`build-ui.js` ordnet jeden Bautyp genau einem von acht Baubereichen zu. Forschungsvoraussetzungen stehen auf jeder betroffenen Kurzkarte, auch wenn sie erfüllt sind. Das Ressourcen-HUD bleibt einzeilig: die gesamte Zeile wechselt zwischen Standard, Industrie und bei Bedarf Spezialgütern, samt Beständen, Tagesraten und Warnung für verdeckte Engpässe.
`trade.js` enthält lokale Angebot-/Nachfragepreise, finite fremde Haushalte, Einkäufe und Verkäufe sowie sechsmonatige Lieferverträge mit pro 30 Tagen reservierten Mitteln; `trade-ui.js` wählt dieselben Frachter, Ziele und Ladungen für Vorschau und tatsächlichen Auftrag. Preise gelten bei Ankunft, Startenergie und Waren werden sofort reserviert. Ein Handelsabkommen allein liefert keine Credits.
`diplomacy.js` / `diplomacy-ui.js`: Nichtangriffspakte (180 Tage, ab 35 Beziehungen) sperren Kriegserklärungen bis zur Kündigung. Partnerschaften (ab 50, mit Handel) liefern +8 % Forschung und +12 % Exportpreis sowie alle 60 Tage vorhandene Vorräte als Kriegshilfe. Sanktionen sperren Handel/Partnerschaft, senken die fremde Warenproduktion um 15 % und kosten 1,5 Credits je Spieltag. Gesandtschaften haben zehn Tage Abstand. Alle laufenden Haushaltsfolgen werden von derselben Prognose berechnet.
`events.js`: neun Ereignistypen. Erste Meldung ab Tag 96; neue Meldungen 84–144 Tage nach Auflösung, keine Wiederholung der letzten vier Typen. Temporäre Energie-/Legierungsboni haben ein gespeichertes Ablaufdatum. Eventkäufe und Siedleraufnahme prüfen Kosten/Wohnraum vor jeder Änderung. v4-Spielstände behalten offene Meldungen und militärischen Fortschritt; neue Ereignisplanung und Diplomatiefelder starten neutral.
`audio.js`: eigener prozeduraler 72-Sekunden-Space-Ambient-Score mit Synth-Flächen, Arpeggios, Subpulsen und Hall. Musik/Effekte und ihre Lautstärken sind getrennte Browserpräferenzen. Ein einziger AudioContext wird durch eine Nutzeraktion aktiviert, nur ein Musikscheduler läuft. Hintergrund/Seitenwechsel stoppen die Musik und suspendieren Audio; Wiederaufnahme erfolgt beim nächsten Tipp. Endliche Aktionssounds markieren Bau-, Forschungs-, Schiffbau- und Lieferabschlüsse. Pro Spieltag wird aus neuen Protokolleinträgen maximal ein priorisierter Hinweis gespielt, keine Tonflut bei 4×. Audioausfälle dürfen die Simulation nicht unterbrechen. Die Umsetzung folgt den [Web-Audio-Praktiken von MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

`development-data.js` und `development-technologies.js`: 17 neue zivile Bauwerke, vier Waren und 17 Forschungsstufen; insgesamt 37 Bautypen und elf Schiffsklassen. Geologie beeinflusst Nahrung, Kristalle, Deuterium und Geothermie. Konsumwaren und Medikamente decken tatsächlichen Bedarf und beeinflussen Zustimmung; aktive Akademien, Kliniken und Versorgungszentren wirken nur mit Personal und Gütern. `infrastructure.js` verteilt Personal nach Produktionspriorität und erklärt fehlende Vorprodukte.

`foreign.js`: sechs fremde Reiche mit denselben politischen, technischen und wirtschaftlichen Regeln wie der Spieler, endlichen Haushalten, eigenen Forschungspfaden, Anlageninvestitionen und institutionellen Reformen. Politische Grundfaktoren liegen allein in `governance.js`.

`routing.js` / `circuit-ui.js`: Handelskreisläufe mit geteiltem Frachtraum, Stopps, Laden/Entladen/Kaufen/Verkaufen, lokalen Reserven, Preisgrenzen und Umlaufabständen. Anfangs zwei Stopps, später sechs bzw. acht durch Forschung. Tatsächliche Bordfracht bleibt bei Abbruch erhalten. Unterversorgte Routen pausieren bis zum gewählten Auffüllziel; Depots und Docks beschleunigen die reale Materialbuchung. Kreisläufe prüfen Versorgung bis zum nächsten zugänglichen Versorgungshafen. `supply-ui.js` bietet Schwellen, Zielwerte, Heimathafen und später intelligente Reserven. Hafenabkommen erlauben kostenpflichtige Wartung beim Partner; laufende Gebühren gehören in die gemeinsame Prognose.

`hud.js`: Credits bleiben auf jeder einzeiligen Ressourcenseite sichtbar. Spezialgüter erscheinen nach Forschung, örtlicher Relevanz oder vorhandener Fracht. Bestände werden rot, wenn sie bei der prognostizierten Tagesrate innerhalb von einschließlich 30 Tagen erschöpfen, oder wenn reale Eingänge fehlen. Nur bereits geladene, rechtzeitig ankommende Lieferungen können die Warnung aufheben. Geplante Routen zählen nicht.

`market-ui.js`: Preise, Produktion, Verbrauch und Bestandsreichweite aller Waren; feste Lieferpreise für 180 Tage bei Mengen je 30 Tage. Verkäufe bedienen finanzierte Verträge zuerst. Überschüsse senken freie Preise und begrenzen Abnahme; Verbrauch erhält dauerhafte Nachfrage. Partnerschaften, Hafenrechte, Forschungsaustausch und Beistandsabkommen haben konkrete Vorteile und Kosten.

Die Forschungsansicht gruppiert die tatsächlichen Voraussetzungen in sortierte Hauptketten, eingerückte Erweiterungen und exklusive Paare mit Zusammenführung. Jede Technologie erscheint genau einmal. Zusätzliche Grundlagen bleiben als verlinkte Voraussetzungen sichtbar; der Baum verändert keine Forschungsregeln. Kompakte Karten öffnen Wirkung und Forschungsaktion beim Antippen, behalten ihren offenen Zustand bei Tagesupdates und zeigen nur die benötigte Punktzahl je nach Bestand grün oder rot. Statussymbole stehen am Titel, Rahmen bleiben neutral.

`effect-ui.js` rendert Modifikatorwerte einheitlich: mehr Ertrag, Wachstum und Stärke sowie weniger Unterhalt, Bedarf und Entwicklungsdauer sind grün, die Gegenrichtung rot; neutrale Werte bleiben neutral. Nur der Zahlenwert wird eingefärbt, Bezeichnungen bleiben unverändert. Forschungen, Regierungsprofile, Gesetze, Programme, diplomatische Forschungsboni und signierte Ereignisergebnisse nutzen dieselbe Darstellung. Erforschte Forschungskarten haben ein größeres Häkchen, ein hervorgehobenes Abschlusslabel und einen helleren blauen Hintergrund bei unverändert neutralem Rahmen.
