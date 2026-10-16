# Schlachtübersicht – erste 3D-Umsetzung

## Flotten- und Verbandsplaner in der interaktiven Probe

Unter **⋯ → Flotten- und Verbandsplaner** oder **Flotte → Flotten- und Verbandsplaner öffnen** werden beide Testseiten vollständig vorbereitet. Ein Reichsspielstand oder eigene Schiffe sind nicht nötig. Alle zwölf vorhandenen Klassen können frei gemischt, hinzugefügt, benannt, ausgetauscht, entfernt und zwischen benannten Verbänden umgegliedert werden. Es gibt keine feste Teilnehmer-, Verbands- oder Verbandsgrößengrenze; die praktische Leistung hängt vom Gerät ab. Waffenlose Klassen bleiben waffenlos.

Der **Verbandsplaner** ordnet einzelne Schiffe relativ zum Verband; der **Flottenplaner** ordnet ganze Verbände mit ihren Mitgliedern relativ zur Flotte. **Auto · Ausgewogen** ist die Voreinstellung; **Schlachtlinie**, **Keil** und **Schutzaufstellung** sind weitere automatische Ausgangsformen. Auto platziert schwere, schnelle und unbewaffnete Einheiten nach ihrer Rolle, ohne Verbände aufzuteilen oder Kampfboni zu vergeben. Frühere Entwürfe mit Staffel oder Kolonne bleiben ladbar. Leere Verbände verändern die Aufstellung nicht.

Ein Objekt auswählen und eine freie Zielposition antippen platziert es direkt; Ziehen am Objekt und Richtungstasten erlauben Korrekturen. Ziehen auf freier Fläche verschiebt den Plan, Zoom und **Alles zeigen** ändern den Ausschnitt. **Automatisch platzieren** verwirft manuelle Versätze der aktuellen Ebene. Drehung betrifft die Aufstellung; feste Bugwaffen richten sich im Gefecht tatsächlich zum Ziel aus. Rückgängig stellt die letzte Bearbeitung wieder her. Schiffe stehen kompakt direkt unter ihrem Verband; eine gemeinsame Suche findet Namen und Klassen. Beim Auflösen eines Verbands bleiben seine Schiffe in einem anderen Verband erhalten.

Natürliche Abweichungen und deutlich gestreute Höhen entstehen automatisch aus einem gespeicherten Seed. Es gibt keine Höhenregler. Die Abweichungen bleiben beim Rendern, Pausieren, Laden und erneuten Aufstellen identisch, bis ausdrücklich neu verteilt wird. Mindestabstände werden anhand der Rumpflängen gesichert. Vorschau und Schlacht verwenden dieselbe Aufstellungsfunktion, einschließlich dieser Korrekturen; Modell, Waffenanker und Trefferposition liegen am tatsächlichen Schiff. Seiten mit sehr tiefen Aufstellungen werden weit genug getrennt aufgestellt, damit sie sich nicht überschneiden. Sehr weite Positionen können außerhalb der Waffenreichweite liegen.

Der Entwurf liegt unter `orbit3077-trial-plan`, der laufende Kampf weiter unter `orbit3077-trial`. Neue Reichsspielstände verändern beide nicht. Änderungen im Planer werden separat gespeichert; erst **Mit Planung neu aufstellen** ersetzt die laufende Probe und beginnt pausiert. **Flotte** bietet benannte Verbände und ihre einzelnen Schiffe als Befehlsempfänger. Angriff, Klassenpriorität, automatische Ziele und bestätigter Rückzug wirken auf die tatsächlichen aktiven Mitglieder. Auswahlmarkierungen und Ziellinien verwenden denselben Empfängerkreis.

Unter **Befehle → Flugmanöver** erhalten ein Verband oder die gesamte Flotte **Bei Flotte bleiben**, **Position halten**, **Selbstständig angreifen**, **Links flankieren**, **Rechts flankieren** oder **Zur Flotte sammeln**. Menüs pausieren taktisch; die dezente Routenvorschau zeigt den geplanten Weg, **▶** setzt die tatsächliche Bewegung fort. Verbände behalten ihre Mitglieder und relativen Plätze, gemeinsame Bewegung orientiert sich am langsamsten Mitglied. Sammeln folgt dem aktuellen Flottenanker. Flankenrouten umgehen die seitliche Ausdehnung der gegnerischen Formation und verfolgen bewegte Ziele.

Geschwindigkeit, Wendigkeit und enge Bugfeuerwinkel unterscheiden sich nach vorhandener Schiffsklasse und Rumpfgröße. Ein schweres Schiff kann einen schnellen Flanker zeitweise nicht beschießen, bis sein Bug nachgedreht hat. Die lokale Abstandskorrektur hält bewegte aktive Rümpfe auseinander; dies ist keine vollständige Starrkörperphysik. Feuer- und Flugaufträge sind getrennt. Bewegliche Türme und zusätzliche Jäger-KI sind nicht enthalten.

Die Gesamtansicht verwendet den Mittelpunkt der eigenen aktiven Flotte als Drehpunkt. **Übersicht** stellt diesen nach einer freien Verschiebung wieder her. Die Kamera verändert keine Aufstellung oder Kampfentscheidung. Die strategische Kampfabrechnung bleibt unverändert.

Prüfung: `tests/battle-planner.test.js`, `tests/battle-maneuvers.test.js`, `scripts/qa-battle-planner.mjs` und `scripts/qa-battle-maneuvers.mjs` erfassen freie Mischverbände über den bisherigen Grenzen, unabhängige Speicherung, deterministische Geometrie, Mindestabstände, tatsächliche Flug- und Feuerbefehle, Touchbearbeitung und schmale Hochformate. Browserproben enthalten 50:50 sowie einen gemischten Verband mit mehr als 50 Mitgliedern; dies ist keine Messung der Bildrate auf einem echten iPhone.

[Probeschlacht öffnen](https://fabitiko93-cmd.github.io/Browser-Game/battle-trial.html)

Die eigenständige Probe startet mit 20 gegen 20 Schiffen. Unter **⋯ → Probeschlacht** stehen außerdem 5:35, 35:5 und 50:50 zur Verfügung. Ein Finger dreht die Gesamtansicht, zwei Finger zoomen und verschieben. **Gesamtansicht** stellt den Ausschnitt wieder her. Antippen eines Schiffs öffnet eine kurze Kontaktkarte; **Ansehen** öffnet die vorhandene Nahkamera. **Verbände** bietet eigene Schiffe, Gegnerkontakte und die Formationskamera; **Befehle** öffnet die bisherigen Einzel-/Flottenaufträge bei Bedarf.

## Darstellung und Grenzen

- Eine erhöhte Perspektivkamera mit etwa 40° Neigung und 30° vertikalem Sichtfeld rahmt die tatsächlichen 3D-Positionen ein. Der Ausschnitt bleibt beim Gefecht stabil. Bei Änderungen des verfügbaren Bildschirms wird neu gerahmt.
- Größen gelten je Klasse für beide Parteien. Die bestehende Umrechnung von 25 m je Welteinheit und die schweren Linien bei ungefähr 50 km Abstand bleiben erhalten. Damit sind entfernte Rümpfe klein; dezente Kontaktsymbole und kurze Feuer-/Trefferimpulse unterstützen die Übersicht. Nahansichten zeigen Modelldetails.
- Einheitliche Testlängen dieser Probe: Schlachtkreuzer 1.800 m, Zerstörer 900 m, Korvette 350 m, Jäger 60 m. Das sind veränderbare Gestaltungswerte für die Platzhalterklassen, keine Angaben des Modellautors. Sie gelten im Weltraum, für Waffenanker und Trefferabstände; Kamera, Partei und Flottengröße verändern sie nicht. Die ursprüngliche Acht-Schiff-Probe behält ihre bisherigen Maße.
- `battle-overview.js` erzeugt getrennte Darstellungsfixtures. Kleine Schiffe bewegen sich auf reproduzierbaren Anflugbahnen im selben festen Spielzeittakt wie die Geschosse. Großschiffe halten ihre Position. Dies ist noch keine Jäger- oder Formations-KI und keine neue strategische Schlachtberechnung.
- Rümpfe mit festem Buganker drehen begrenzt zum Schussziel; fliegende Jäger orientieren sich an ihrer Flugbahn. Ein Schuss darf erst bei passender Ausrichtung erfolgen. Die Buganker sind modellabhängige Testanker, keine vollständige Rekonstruktion der Harbinger-Bewaffnung. Ihre Koordinaten, Modellachse und Dimensionen sind getrennt von Kamera und Gefechtsdarstellung beschrieben.
- Bewegliche Geschütztürme sind ausdrücklich ausgenommen. Zusätzliche künstliche Turmmodelle werden in dieser Probe nicht dargestellt.
- Originalgeometrie und PBR-Texturen bleiben für die Nähe erhalten. Entfernte Modelle verwenden einmalig aus den Originalgeometrien erzeugte Vereinfachungen und gemeinsame Instanzpuffer. Waffen-, Treffer- und Trümmerpuffer sind begrenzt. Darstellung zielt auf höchstens 30 Renderbilder pro Sekunde; das ist keine bestätigte iPhone-Bildrate.
- Schaden, Waffenintervalle und Kontaktbefehle stammen aus der bestehenden Probe. Daher können ungleiche Szenarien schnell enden; Schiffszahl ist keine Kampfstärkewertung. Das gespeicherte Reich bleibt unabhängig.

## Zuständigkeiten

`battle-overview-page.js` verwaltet Oberfläche und Probe, `battle-overview.js` Fixtures/Flugbahnen/Modellkonventionen und `battle-geometry.js` Ausrichtung/Waffenanker. `harbinger-scene.js` verwendet den bestehenden Renderer mit Kamerarahmung, entfernten Instanzen und Touchauswahl; `battle-lod.js` vereinfacht nur entfernte Geometrie. Das neue Seitenbundle und die eigene URL vermeiden das Vermischen neuer Oberfläche mit alten, bereits gecachten Harbinger-Modulen. Alte Harbinger-Links bleiben als Einstieg erhalten.

## Prüfung

Vor Veröffentlichung: `npm run build`, `npm test`, `npm run build:check` und `ORBIT_BROWSER_EXECUTABLE=/pfad/zu/chrome node scripts/qa-harbinger.mjs`. Die Browserprüfung erfasst originale Materialien, Waffenausrichtung, Kontextbefehle, vier Kameras, Touch, schmale Hochformate, alle vier Szenarien, begrenzte Renderaufrufe, Neustarts, echte Salven/Treffer und Offline-Modellteile. Sie ersetzt die Beurteilung und Leistungsmessung auf dem tatsächlichen iPhone nicht.


## Im Spiel

Flotte → Gefechte enthält jetzt die letzten sechs echten Spielergefechte. Nach einer Schlacht pausiert das Reich und bietet die 3D-Aufzeichnung an. Bereits vor diesem Update abgeschlossene Gefechte haben keine Teilnehmeraufzeichnung.

`battle-replay.html?battle=<id>` liest ausschließlich den lokalen Bericht. Tatsächliche Teilnehmer, Anfangs-/Endhülle, Verluste, Rückzüge, Garnisonen und Besitzwechsel stammen aus der bestehenden strategischen Abrechnung. Die 36 Sekunden lange Darstellung inszeniert die Flugbahnen und Treffer zwischen diesen Zuständen. Sie ist als Aufzeichnung gekennzeichnet, verändert das Ergebnis nicht und bietet daher keine taktischen Befehle. Pausieren, Kamera und Teilnehmerauswahl funktionieren weiterhin.

Alle zwölf Spielklassen sind mit ihren echten Bezeichnungen angebunden; verfügbare Schiffsmodelle bleiben visuelle Platzhalter. Planetare Verteidigung erscheint als schematische Orbitalanlage, getrennt von der Schiffszahl. Bewegliche Türme und neue Jäger-KI sind weiterhin ausgenommen. `scripts/qa-battle-replay.mjs` prüft Spielnavigation, echte Ankunft, Speicherung, 3D-Wiedergabe, Hochformat, Skalierung und Rückkehr ohne doppelte Kampfabrechnung.


## Interaktive Probeschlacht mit Spielwerten

[Interaktive Probeschlacht öffnen](https://fabitiko93-cmd.github.io/Browser-Game/battle-trial.html). Im Reich: Flotte → Gefechte → Ansicht ausprobieren. Die bisherige Grafikprobe und die Gefechtsaufzeichnungen bleiben verfügbar.

Die Probe startet pausiert. Unter ⋯ können Testverbände, eigene Forschungs-/Politikboni oder Kopien der freien stationierten Schiffe eines Standorts gewählt werden. Hülle, Panzerung, Versorgung und Kampfstärke folgen den vorhandenen Regeln. Alle zwölf Klassen haben ihre tatsächlichen Namen; Waffenlose schießen nicht. Die Modelle bleiben vorläufige Zuordnungen. Standardverbände testen Kreuzer, Zerstörer und Korvetten; keine zusätzlichen Jäger werden erfunden.

Bedienung: In der Übersicht und Nahkamera dreht ein Finger die Ansicht. Zwei Finger zoomen und verschieben; die linke Maustaste dreht, die rechte verschiebt. **Übersicht** stellt die gemeinsame Schlachtperspektive wieder her. **Flotte** öffnet die Suche und Auswahl eines eigenen Schiffs oder ausdrücklich der gesamten Flotte. Antippen im Raum öffnet ein Schiffsmenü; erst dessen Auswahlaktion legt einen Befehlsempfänger fest. **Nahansicht** betrachtet ein Schiff unabhängig vom aktuellen Auftragsempfänger. Es gibt beim Einstieg keine vorgewählte Befehlseinheit.

Alle Auswahl- und Planungsmenüs aktivieren die Taktikpause. Schließen setzt die Schlacht nicht automatisch fort; dafür dient **▶**. Zuweisungen ändern die Aufträge in der Pause, Bewegung und Schüsse erst nach dem Fortsetzen. Rückzug zeigt Empfänger und tatsächliche Versorgungskosten in einem eigenen Bestätigungsmenü. Deaktivierte Aktionen erklären ihren Grund direkt. **⋯** trennt neue Proben, Grafik und Bedienhilfe.

Ausgewählte eigene Schiffe erhalten blaue Ringe, ihre anvisierten Gegner orange Rauten. Zurückhaltende gestrichelte Linien zeigen ihre Zielbeziehung. Auswahlpuffer wachsen mit der Teilnehmerzahl. Die Linien sind keine Waffeneffekte und bleiben auch beim Warten auf Reichweite erkennbar. Auswahl aufheben entfernt sie; Grafikoptionen können die Linien ausblenden. Ein knapper Hinweis nennt Auswahl und Zielzahl, weitere Angaben stehen in den Menüs. Kamera, Auswahl und diese Anzeige verändern keine Kampfregel.

Zielwahl, Klassenpriorität und Rückzug beeinflussen den laufenden Kampf. Betrachten eines Kontakts erteilt keinen Angriff. Treffer erzeugen unmittelbar den gespeicherten Schaden; Torpedos erst bei der Ankunft. Gleichzeitige Laserangriffe sind symmetrisch, letzte Torpedos wirken auch nach Verlust des Abschussschiffs. Rückzug benötigt Bordversorgung und kann unter Beschuss scheitern.

Neue Proben stellen bewaffnete Schiffe bereits auf ihre anfänglichen automatischen Ziele ausgerichtet auf. Alle kampfbereiten Schiffe beider Seiten eröffnen im selben ersten Simulationstakt; es gibt keine Startverzögerung nach Listenposition. Danach gelten die jeweiligen Waffenintervalle. Abweichende Zielbefehle erfordern weiterhin das physische Ausrichten der festen Bugwaffen; Rückzug und waffenlose Schiffe nehmen nicht an der Eröffnung teil.

Die GPU-Batches wachsen mit der Teilnehmerzahl und bieten für 50:50 mindestens 128 Laser, 384 Lichtimpulse und 200 Übersichtsimpulse. Gleichzeitiges Feuer wird dadurch nicht mehr auf die letzten 24 Laser einer Seite beschnitten. Projektile und Auswahlpuffer wachsen ebenfalls; Partikel und Trümmer bleiben als reine Qualitätseffekte begrenzt.

Reichweite (90 km), Feuerrhythmus, zeitliche Schadensverteilung und Rückzugskosten sind Probewerte für das neue Gefecht. Die bestehende strategische Kampfabrechnung bleibt maßgeblich für dein Reich. Die Probe speichert ihren Fortschritt getrennt und lässt sich pausiert fortsetzen; sie verändert keine echten Schiffe, Waren oder Gefechtsberichte. Bewegliche Türme und neue Jäger-KI sind weiterhin ausgenommen.
