# Schlachtübersicht – erste 3D-Umsetzung

[Probeschlacht öffnen](https://fabitiko93-cmd.github.io/Browser-Game/battle-overview.html)

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

Ausgewählte eigene Schiffe erhalten blaue Ringe, ihre anvisierten Gegner orange Rauten. Zurückhaltende gestrichelte Linien zeigen die Zielbeziehung für ein Schiff oder bis zu 50 ausgewählte Flottenschiffe. Sie sind keine Waffeneffekte und bleiben auch beim Warten auf Reichweite erkennbar. Auswahl aufheben entfernt sie; Grafikoptionen können die Linien ausblenden. Ein knapper Hinweis nennt Auswahl und Zielzahl, weitere Angaben stehen in den Menüs. Kamera, Auswahl und diese Anzeige verändern keine Kampfregel.

Zielwahl, Klassenpriorität und Rückzug beeinflussen den laufenden Kampf. Betrachten eines Kontakts erteilt keinen Angriff. Treffer erzeugen unmittelbar den gespeicherten Schaden; Torpedos erst bei der Ankunft. Gleichzeitige Laserangriffe sind symmetrisch, letzte Torpedos wirken auch nach Verlust des Abschussschiffs. Rückzug benötigt Bordversorgung und kann unter Beschuss scheitern.

Neue Proben stellen bewaffnete Schiffe bereits auf ihre anfänglichen automatischen Ziele ausgerichtet auf. Alle kampfbereiten Schiffe beider Seiten eröffnen im selben ersten Simulationstakt; es gibt keine Startverzögerung nach Listenposition. Danach gelten die jeweiligen Waffenintervalle. Abweichende Zielbefehle erfordern weiterhin das physische Ausrichten der festen Bugwaffen; Rückzug und waffenlose Schiffe nehmen nicht an der Eröffnung teil.

Die bestehenden GPU-Batches bieten Platz für die gesamte erste Salve bis 50:50: höchstens 128 Laser, 384 Lichtimpulse und 200 Übersichtsimpulse. Gleichzeitiges Feuer wird dadurch nicht mehr auf die letzten 24 Laser einer Seite beschnitten; Partikel-, Trümmer- und Projektilgrenzen bleiben bestehen.

Reichweite (90 km), Feuerrhythmus, zeitliche Schadensverteilung und Rückzugskosten sind Probewerte für das neue Gefecht. Die bestehende strategische Kampfabrechnung bleibt maßgeblich für dein Reich. Die Probe speichert ihren Fortschritt getrennt und lässt sich pausiert fortsetzen; sie verändert keine echten Schiffe, Waren oder Gefechtsberichte. Bewegliche Türme und neue Jäger-KI sind weiterhin ausgenommen.
