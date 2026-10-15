# Vorgemerkte Entwicklung

## Immersive 3D-Gefechte · erster Schritt mit 0.11.0

- Nutzerentscheidung: Quaternius als Ausgangsset verwenden. Gefechtsdauer bedeutet Wochen und Monate **Spielzeit**, keine Kalenderzeit.
- Erledigt: separate Probeschlacht mit vier aufbereiteten Rümpfen, Touch- und Schiffskamera, Waffen-/Schildeffekten und wirksamen Übungsbefehlen. Sie arbeitet unabhängig von den tatsächlichen Flotten und dem gespeicherten Reich.
- Grafik- und Bedienungsumbau 0.12.0: Materialien und Licht, örtliche Schildtreffer, Beschädigung und Trümmer, weichere Kameraführung, direkte Flotten-/Taktikansicht und adaptive Auflösung. Zielauswahl und Angriff sind getrennt; Aufträge nennen ihren Empfängerkreis und bleiben beim Ansehen anderer Kontakte erhalten. Diese Änderungen betreffen die bestehende Übung.
- Nächste besprochene Schritte: dauerhafte Gefechte mit tatsächlichem Schaden, Versorgung, Verstärkung und Rückzug; danach die taktischen Befehle und 3D-Ansicht an diese laufenden strategischen Gefechte anbinden. Diese Schritte sind noch nicht implementiert; ihre genauen Regeln werden separat festgelegt.

Der vereinbarte Balanceabschluss des vorhandenen Spiels ist mit 0.10.5 umgesetzt. Abnahme und gemessene Grenzen stehen in [BALANCE.md](BALANCE.md). Sozialmodell, freiwilliger Spieleinstieg und weitere Entwürfe bleiben gesonderte, noch nicht implementierte Erweiterungen.

## Flottenorganisation und Formationen · vorgemerkt

- Bedienbasis umgesetzt: Auswahl und Planung in Menüs mit Taktikpause, eindeutige Befehlsempfänger, unabhängige Nahkamera, dezente Ziellinien und Zielmarkierungen. Echte Verbandsorganisation und ausgearbeitetes taktisches Gameplay bleiben vorgemerkt.
- Nutzerentscheidung: Ein künftiger Formationsplaner gehört bereits in die Flottenplanung. Die geplante Aufstellung soll anschließend in die Schlacht übernommen werden.
- Verbandsregeln, Bedienung und taktisches Verhalten werden vor der Umsetzung ausgearbeitet; dieser Feuerstart-Patch implementiert den Planer noch nicht.

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
