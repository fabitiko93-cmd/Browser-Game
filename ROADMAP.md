# Vorgemerkte Entwicklung

## Planetenbau · Nutzerentscheidungen und Musterplanet · 20.10.2026

- Festgelegt: Regionen am drehbaren Planeten auswählen, innerhalb einer konzentrierten regionalen Ansicht bauen. Drei bis fünf Regionen dienen als erste Testgröße; die Erde mit etwa neun Milliarden Einwohnern ist der spätere Bevölkerungsmaßstab.
- Der Startplanet ist vollständig erschlossen. Nutzbarkeit hängt später an Versorgung, nicht am Kauf einzelner Kacheln. Weitere Welten werden je nach Erkundungsstand teilweise oder vollständig bekannt; Expeditionen können fehlende Gebiete erschließen.
- Gebäude dürfen mehrere Kacheln belegen; planetare Großwaffen benötigen entsprechend große Flächen. Planetentyp, Größe und örtliche Bedingungen dürfen bestimmte Bauwerke ausschließen. Erze unter Teilen einer Grundfläche, abfallende Geothermieeffizienz und Wasserzugang über Nachbarschaft sollen differenziert berechnet und im Bauplaner mit Ertrag und Produktion sichtbar werden.
- Versorgung innerhalb eines Planeten soll überschaubar bleiben. Staatsformen und Gesetzeskosten sollen zusammenwirken; Umweltverschmutzung ist erst eine spätere Erweiterung. Diese Regeln sind mit der neuen Darstellung noch nicht implementiert.
- Gewählte Quellen: Minerva für zukünftige Gebäude, Solar System Scope für Planetenkarten sowie Poly Haven Namaqualand und Lunar Landscape für Gelände. Minerva-Dateien sind noch nicht verfügbar und werden in der Probe nicht durch erfundene Modelle ersetzt.
- Umgesetzt: separater Musterplanet mit vier vollständig erschlossenen Regionen, drei Planetenvorlagen, Landschaftsmodulen, Touchkamera und zuschaltbarem Vorschau-Raster. Tatsächliche freie Pack-Assets liegen samt Lizenz-/Herkunftsnachweis im Repository. Gebäude, Wirtschaft und das bestehende Oberflächenspiel werden darüber noch nicht bedient.
- Grafiküberarbeitung der Probe: vier unterschiedliche Geländeformen (Küste, rotes Terrassenbecken, Hochland und Caldera), material- und höhenabhängige Bodenfarben, bewegtes Küstenwasser und passende Felsgruppen. Freistehende offene Klippenscans wurden durch geprüfte Boulder-Scans ersetzt; unvollständige Scanunterseiten und Modellauflagen werden im tatsächlichen Boden versenkt. Die Rezepte tragen dafür Generatorversion 2, ohne Änderung des Reichsspielstands.
- Vorbereitet: versionierte Rezepte mit stabilen unabhängigen Teil-Seeds. Die bereits vorhandene strategische Weltgeneration hat einen gespeicherten Welt-Seed; ein neuer Spielstand wählt standardmäßig einen neuen Seed. Die spätere Verknüpfung der neuen Regionen mit Spielständen und Erkundung sowie frei generierte globale Kontinente bleiben offen. Die jetzigen globalen Karten sind feste Referenztexturen.

## Planungsstand · 17.10.2026

### Festgehalten durch den Nutzer

- Im Kernspiel fehlen aus Nutzersicht weiterhin Vision und Umfang; auch die Schlacht ist noch nicht finalisiert. Die fertigen Teilpatches bedeuten keinen Abschluss des Gesamtspiels oder des Gefechtssystems.
- Ein Flottensystem nach dem Kartenprinzip von Mount & Blade wird als spätere Zielrichtung vorgemerkt: Flotten bewegen sich sichtbar über die strategische Karte; ihre Darstellung vermittelt die tatsächliche Größenordnung und Zusammensetzung.
- Diese Kartenumstellung ist eine große Anpassung und wird derzeit nicht umgesetzt. Sie ersetzt nicht die noch offene Finalisierung von Kernspiel und Schlacht.

### Vorschläge zur weiteren Planung · noch abzustimmen

- Den angestrebten Umfang einer vollständigen Partie anhand des vorhandenen Kernspiels zusammenführen: Aufbau und Versorgung, Erkundung und Expansion, Innen- und Außenpolitik, Krieg und langfristige Ziele. Vorhandene Systeme dabei nach ihrer tatsächlichen Spielwirkung bewerten.
- Einen begrenzten Abschlussumfang für die Schlacht festlegen: verständliche und wirksame Befehle, nachvollziehbare Formationen und Manöver, Gefechtsdauer und Rückzug, Skalierung auf dem iPhone sowie die Übernahme von Teilnehmern, Schaden, Versorgung und Ergebnis ins Hauptspiel.
- Für das vorgemerkte Kartenprinzip bleiben Zoomdarstellung, Reise- und Abfangregeln, Sensorik, Eskorte, Zeitablauf und der Übergang in Gefechte auszuarbeiten. Die besprochenen Details sind noch kein freigegebener Umsetzungskatalog.

## Immersive 3D-Gefechte · erster Schritt mit 0.11.0

- Nutzerentscheidung: Quaternius als Ausgangsset verwenden. Gefechtsdauer bedeutet Wochen und Monate **Spielzeit**, keine Kalenderzeit.
- Erledigt: separate Probeschlacht mit vier aufbereiteten Rümpfen, Touch- und Schiffskamera, Waffen-/Schildeffekten und wirksamen Übungsbefehlen. Sie arbeitet unabhängig von den tatsächlichen Flotten und dem gespeicherten Reich.
- Grafik- und Bedienungsumbau 0.12.0: Materialien und Licht, örtliche Schildtreffer, Beschädigung und Trümmer, weichere Kameraführung, direkte Flotten-/Taktikansicht und adaptive Auflösung. Zielauswahl und Angriff sind getrennt; Aufträge nennen ihren Empfängerkreis und bleiben beim Ansehen anderer Kontakte erhalten. Diese Änderungen betreffen die bestehende Übung.
- Nächste besprochene Schritte: dauerhafte Gefechte mit tatsächlichem Schaden, Versorgung, Verstärkung und Rückzug; danach die taktischen Befehle und 3D-Ansicht an diese laufenden strategischen Gefechte anbinden. Diese Schritte sind noch nicht implementiert; ihre genauen Regeln werden separat festgelegt.

Der vereinbarte Balanceabschluss des vorhandenen Spiels ist mit 0.10.5 umgesetzt. Abnahme und gemessene Grenzen stehen in [BALANCE.md](BALANCE.md). Sozialmodell, freiwilliger Spieleinstieg und weitere Entwürfe bleiben gesonderte, noch nicht implementierte Erweiterungen.

## Flottenorganisation und Formationen · Grundlage in der Probeschlacht

- Nutzerentscheidung: Verbands- und Flottenplaner entstehen zunächst vollständig in der Probeschlacht. Eigene Spielschiffe sind nicht erforderlich. Vorbereitungen und Schlachtfortschritt werden unabhängig vom Reich gespeichert; neue Reichsspielstände setzen die Planung nicht zurück.
- Umgesetzt: Beide Seiten frei aus allen vorhandenen Klassen zusammenstellen, beliebig gemischte und benannte Verbände ohne feste Größen- oder Anzahlgrenze. Schiffe stehen direkt unter ihrem Verband, mit gemeinsamer Suche. Auto · Ausgewogen, Schlachtlinie, Keil und Schutzaufstellung funktionieren auf Verbands- und Flottenebene. Antippen, Ziehen, Zoom und Rückgängig erleichtern die Platzierung; stärkere Höhenstreuung entsteht automatisch ohne Höhenregler. Vorschau und Kampf verwenden dieselben tatsächlichen Positionen.
- Umgesetzt: Einzel-, Verbands- und Flottenauswahl mit tatsächlichen gemeinsamen Ziel-/Klassenbefehlen und Rückzug; Ziellinien zeigen ausschließlich die ausgewählten Empfänger. Die Gesamtansicht kann Schiffe und Verbände mit eigenem Drehpunkt verfolgen; Antippen fokussiert ohne Menü oder Taktikpause. Details, Befehle und Zielvorschläge sind ausdrücklich getrennt. Die Planungsentwürfe gehören zur jeweiligen Probeschlacht und behalten deren Ausgangswerte.
- Umgesetzt: Bei Flotte bleiben, Position halten, selbstständig angreifen, links/rechts flankieren und zur bewegten Flotte sammeln. Tatsächliche Verbandsbewegung mit Formationsbindung, gemeinsamen Geschwindigkeiten, begrenzter Wendigkeit und Bugfeuerwinkeln. Routenvorschau und taktische Menüpause halten Planung und Ausführung lesbar. Keine beweglichen Türme oder zusätzliche Jäger-KI.
- Vorab geprüft und umgesetzt: wertbasierte Besetzung von Ausgewogen, Linie und Keil mit kopierten Ausgangswerten sowie koordinierte automatische Keilsalven unter Berücksichtigung fliegender Torpedos. Vergleichsfälle und Nachteile sind in `FORMATION_TESTS.md` dokumentiert. Die vorhandene statische Schutzaufstellung bleibt; bewegliche Eskorte und zusätzliche Schutz-Zielprioritäten bestanden die Vergleiche nicht und wurden nicht integriert. Kein pauschaler Formationsbonus.
- Abnahme in der Probeschlacht: Bedienbarkeit und Gefechtswirkung bei Unterzahl, Mischverbänden und großen Flotten bewerten; Geschwindigkeit, Wendigkeit, Abstände und Feuerwinkel bleiben Probewerte.
- Später dieselben Planungsdaten und das vervollständigte Gefechtssystem an reguläre Spielschlachten anbinden. Bestehende strategische Kampfabrechnung bleibt bis dahin maßgeblich.

## Abschluss der bestehenden Balance · erledigt mit 0.10.5

### Abnahmekriterien

1. Faire Grundlage: vergleichbare Kosten und Verbräuche werden bei Spieler und KI nach denselben Regeln abgerechnet.
2. Tragfähige Spielweisen: wirtschaftlicher Ausbau, Handel und militärische Expansion funktionieren unter passenden Bedingungen; keine davon ist in sämtlichen Situationen überlegen.
3. Lohnende Investitionen: Gebäude, Forschung und Verträge liefern in ihrem vorgesehenen Einsatz einen spürbaren Gegenwert. Forschungszeitverkürzungen wirken exakt auf die tatsächliche Entwicklungsdauer, einschließlich Bruchteilen eines Spieltags.
4. Beherrschbare Folgen: Engpässe und Fehlentscheidungen haben Konsequenzen; vorhandene Gegenmaßnahmen funktionieren. Der bewusst mögliche gemeinsame Untergang durch Vernichtung bleibt erhalten.
5. Lesbare Geldsummen und glaubwürdige Kostenverhältnisse: Auf Nutzerwunsch seit 0.10.6 wieder gewöhnliche Creditsummen ohne Größenklassen. Dieselbe Einheit gilt für Einnahmen, Unterhalt, Preise, Verträge, Schulden und Kaufentscheidungen. Die reine Zahlenskalierung ersetzt keine Balance der tatsächlichen Erschwinglichkeit.

### Grenze für die Finanzierung der Vernichtungswaffen

- Eine einzelne unveränderte Startkolonie soll nach zwei bis drei Spieljahren passiver Vermögensbildung kein vollständiges einsatzfähiges Vernichtungsprojekt finanzieren können. Die Prüfung berücksichtigt auch vorhandene Steuerstufen und Regierungsformen.
- Verglichen wird das gesamte vorhandene Projekt: Startanlage, notwendige Versorgungsinfrastruktur, erste Ladung sowie laufende Kosten während Bau und Ladung. Forschung und lokale Materialverfügbarkeit bleiben eigenständige Bedingungen.
- Vorhandene Kosten und laufende Versorgung werden so gewichtet, dass eine entwickelte industrielle Wirtschaft und finanzierbare Betriebsleistung nötig sind. Wirtschaftlicher Ausbau und tragfähiger Handel sollen den Zugang gegenüber bloßem Abwarten deutlich verbessern.
- Die Darstellung verwendet auf dem iPhone wieder gewöhnliche Creditsummen mit deutschen Tausendertrennzeichen, ohne Mio./Mrd./Bio.-Einteilungen. Tagesraten und Kosten bleiben vergleichbar und korrekt. Interne Beträge, erhöhte Projektkosten und bestehende Spielstände bleiben erhalten.

### Begrenzter Umfang und Abschluss

- Konkrete Korrekturen: ungleiche Verbrauchsabrechnung, früh ausgereizte Handelsboni, exakte Forschungszeiten sowie Credit-Darstellung und die Finanzierung bereits vorhandener Endspielwaffen.
- Danach dieselben festgelegten Wirtschaftslagen und Spielweisen vergleichen. Weitere Werte werden in diesem Durchlauf nur bei einer belegten Schieflage geändert.
- Nach erfüllten Kriterien wird der Stand als ausreichend ausgewogen festgehalten. Weitere Feinjustierung folgt aus konkreten Spielerfahrungen; neue Features eröffnen eine eigene Balanceprüfung.

### Exakte Forschungszeit

- Festgelegt durch den Nutzer: Eine Verkürzung von 10 % soll die tatsächliche Forschungsdauer um 10 % reduzieren. Fünf Spieltage werden zu 4,5 Tagen, drei Spieltage zu 2,7 Tagen. Die Berechnung darf keine ganzen Tage aufrunden; eine versteckte Mindestdauer darf den Bonus ebenfalls nicht abschneiden.
- Entwicklungsdauer, tatsächlicher Fortschritt und Abschluss müssen Bruchteile eines Spieltags berücksichtigen. Die Zeit wird ab Beginn des Projekts gemessen; eine dezimale Vorschau bei weiterhin ausschließlich täglichen Abschlüssen genügt nicht.
- Spieler und KI verwenden dieselbe Berechnung und denselben Zeitfortschritt. Laufende Forschung behält ihre bereits zugesagte Restzeit; neue Projekte verwenden die präzise Dauer.
- Pausen, Spieltempo, Unterbrechungen wegen fehlender Finanzierung und Hintergrundpausen dürfen weder Zeit verschenken noch doppelt abbuchen. Speichern, Laden und Import erhalten die Bruchteile.
- Die Anzeige verwendet lesbare deutsche Dezimalwerte, während Berechnung und gespeicherter Fortschritt präzise bleiben. Bestehende politische und technische Zeitfaktoren kombinieren weiterhin nach derselben Regel.

## Lebensbedingungen statt pauschaler Steuer-Mali

- Hohe Steuern sind nicht automatisch schlecht: finanzierte soziale Leistungen können Belastungen ausgleichen. Niedrige Steuern helfen nicht, wenn Versorgung, Arbeit und öffentliche Leistungen fehlen.
- Armut und Belastung sollen aus realen Lebensbedingungen entstehen: verfügbarem Einkommen nach Steuern, Preisen und tatsächlich verfügbaren Gütern, Arbeit, Wohnraum sowie versorgten und finanzierten Gesundheits- und Sozialleistungen. Ein Gesetz allein erzeugt keine Leistung.
- Anhaltende Belastungen sollen Unzufriedenheit und Unruhen aufbauen. Mögliche Folgen sind Proteste und konkrete Streiks: betroffene Betriebe verlieren Arbeitsleistung, während Kosten weiterlaufen. Keine neue pauschale Produktionsstrafe allein für die hohe Steuerstufe.
- Auswanderung soll nur zu bekannten, erreichbaren Welten mit tatsächlich besseren Perspektiven stattfinden. Arbeitsplätze, Wohnraum und passende Einreiseregeln sind nötig; Bevölkerung und Arbeitskräfte werden real übertragen, nicht gelöscht oder erzeugt.
- Dieselben Ursachen und Beschränkungen gelten für Spieler und fremde Reiche. Politische Systeme werden über ihre tatsächliche Organisation und Finanzierung beurteilt, ohne versteckten moralischen Wert.
- Auslöser, Dauer, Stärke und Gegenmaßnahmen werden vor der Umsetzung gemeinsam genauer festgelegt.

## Optionaler Spieleinstieg

- Ein leicht geführtes Tutorial soll freiwillig als erste Quest gestartet werden können und einmal durch die vorhandenen Mechaniken führen.
- Alternativ können freiwillige Aufgaben dieselbe Einführung übernehmen. Welche Darstellung und Reihenfolge am besten passt, wird als Nächstes genauer geplant.
- Der freie Spielstart bleibt möglich. Noch keine festgelegten Questtexte, Belohnungen oder neuen Spielmechaniken.

## Vernichtung und gemeinsamer Untergang

### Festgelegt durch den Nutzer

- Großflächige Vernichtung darf einen Vorherrschaftssieg dauerhaft unmöglich machen. Das ist eine beabsichtigte Folge: Vernichtung solchen Ausmaßes hinterlässt keinen Gewinner. Die feste ursprüngliche Bezugsgröße der aktuellen Siegbedingung wird deshalb nicht als Balancefehler behandelt oder durch eine automatische Ersatz-Siegbedingung umgangen.
- Die Vernichtung ganzer Systeme und Planeten soll zusätzliche Risiken bergen. Als konkreter Ansatz wurde die Entstehung eines Schwarzen Loches genannt, das nach einer Zeit N das Ende einleitet. Dieser Risikomechanismus ist noch nicht implementiert.

### Noch auszuarbeiten

- Welche Vernichtungswaffen eine solche Entwicklung auslösen können, wie häufig sie auftritt und wie mehrere Einsätze das Risiko beeinflussen.
- Verlauf und Dauer der Katastrophe, ihre räumliche Ausbreitung und welche Prognose dem Spieler zugänglich ist.
- Warnungen vor dem Waffeneinsatz, Beobachtung durch Analyse und öffentliche Berichte über die bestehenden Nachrichtenkanäle.
- Ob überhaupt Gegenmaßnahmen vorgesehen sind. Keine Rettungsaufgabe oder Abwendbarkeit ist beschlossen; ein gemeinsamer Untergang bleibt ausdrücklich möglich.
- Gleiches Waffenrisiko für Spieler und KI und angemessene KI-Abwägung vor dem Einsatz. Zeitpunkt und Umfang der Umsetzung sind noch offen.
