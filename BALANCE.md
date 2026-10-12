# Abnahme der bestehenden Balance · 0.10.5 / Anzeige 0.10.6

Stand: 12. Oktober 2026. Der mit dem Nutzer abgegrenzte Balanceabschluss ist erfüllt. Das bedeutet einen tragfähigen Stand des vorhandenen Spiels; keine Aussage, dass jede denkbare Partie oder politische Kombination gleich stark wäre.

## Feste Kriterien und Nachweise

| Kriterium | Prüfung und Ergebnis |
| --- | --- |
| Faire Abrechnung | Identische Wirtschaften verbrauchen bei Spieler und KI dieselben Mengen. Frieden, Krieg, Elektronikfreischaltung und Zahlungsunfähigkeit sind geprüft. HUD-Prognose und tatsächliche nächste Tagesbuchung stimmen überein, auch bei einem Forschungsabschluss zwischen Tagesschritten. |
| Tragfähige Spielweisen | Bezahlter Ausbau, echte Frachtrouten und ein finanzierter Eroberungszug sind vom gleichen Start aus für 360 Tage geprüft. Jede Spielweise erzielt ihren eigenen Gegenwert und bleibt zahlungsfähig; keine gewinnt bei allen verglichenen Größen. |
| Lohnende Investitionen | Forschung, Gesetze und bezahlte Handelsprogramme erhöhen reale Verkaufspreise auch nach Überschreiten der bisherigen Grenzen. Das gilt für Fremdexporte und öffentliche Spielerangebote. Technokratie, personalintensive Produktion, Rüstung und professionelle Flotten behalten unterschiedliche Stärken. |
| Beherrschbare Folgen | Schulden, Finanzierungspausen, Nahrungs- und Personalengpässe, Sparbetrieb, geschützte Exportreserven und echte Nachlieferungen sind geprüft. Käuferkassen und Waren werden bei Handel tatsächlich belastet. Großflächige Vernichtung kann den Sieg weiterhin unmöglich machen. |
| Geldgrößen und Endspielkosten | Gewöhnliche Credit-Anzeige und Eingaben buchen dieselben internen Beträge. Die optische Größenklassierung aus 0.10.5 ist seit 0.10.6 auf Nutzerwunsch entfernt. 180 Kombinationen aus sechs Startwelten, zehn Regierungsformen und drei Steuerstufen scheitern nach zwei und drei Jahren passiven Sparens an der Finanzierung eines einsatzfähigen Vernichtungsprojekts. |

## Vergleich real bezahlter Spielweisen

Reproduzierbarer Regeltest: `tests/balance-paths.test.js`. Feste ursprüngliche Startwelt, 360 Tage normale Simulation einschließlich fremder Reiche, keine geschenkten Credits, Materialien, Forschung oder Schiffe. Die Tabelle zeigt eine Referenzpartie, keine allgemeine Rangfolge.

| Spielweise | Kasse nach 360 Tagen | Heimatbevölkerung | Eigene Welten | Laufende Bilanz / Tag |
| --- | ---: | ---: | ---: | ---: |
| Unveränderter Start | 6.093,63 ¢ | 240 | 1 | +16,86 ¢ |
| Zwei Habitate, Farm und Solaranlage | 5.968,92 ¢ | 338 | 1 | +29,09 ¢ |
| Gesandtschaft, Handelsvertrag und echte Nahrungsroute | 6.408,61 ¢ | 240 | 1 | +16,86 ¢ |
| Militärische Vorbereitung und Eroberung | 3.938,05 ¢ | 118 | 2 | +6,95 ¢ |

Ausbau bindet zunächst Geld und Unterhalt, erhöht später Personal und Einnahmen. Die Handelsroute verkauft fünf physische Lieferungen mit zusammen 424,98 Credits Erlös bei 110 Credits diplomatischer Investition; nach gedecktem Bedarf kann sie warten. Eroberung verwendet zwei bezahlte Zerstörer, zwei Landungsschiffe und die vorhandene Korvette. Landungsschiffe und ihre Siedler werden real verbraucht; Betriebe werden gezielt nach Materialbedarf pausiert. Gebiet und künftige Entwicklungsmöglichkeiten stehen einem kleineren Heimatpersonalbestand, Rüstungsaufwand und einer schwächeren laufenden Bilanz gegenüber.

## Finanzierung der Vernichtungsprojekte

`tests/balance-closure.test.js` prüft Seeds 31, 77, 3077, 42, 4096 und 2026 mit allen Regierungsformen und 12/16/22 % Steuern. Die unveränderte eigene Wirtschaft bezahlt Grundverbrauch und vorhandene Flotten aus regulären Einnahmen; Forschung, Ausbau, Exportkäufe und Zufallsbelohnungen werden nicht hinzugefügt.

Die größte geprüfte passive Kasse nach 1080 Tagen beträgt **29.658,66 Credits**: Monarchie bei 22 % Steuern, Seed 3077. Anlage und erste Ladung kosten bereits **70.000 Credits** für die Weltenvernichtung oder **200.000 Credits** für die Sternenvernichtung. Das ist eine Untergrenze des Gesamtprojekts: Ein Beispiel mit Reaktor, Kristallförderer und Betrieb während Bau/Ladung liegt bei 72.740 bzw. 205.280 Credits zu Grundwerten. Je nach Planet und Regierung kommen weitere Versorgung, Materialien, Personal und Betriebsfaktoren hinzu. Damit scheitert die passive Finanzierung schon an den Kernkosten und erst recht am vollständigen Projekt.

Vorhandene bezahlte Bauten, Aufträge und Guthaben werden nicht rückwirkend umgeschrieben. Neue Preise betreffen neue Bestellungen. Wiederholte Ladungen bleiben teuer; Großprojekte brauchen eine ausgebaute Reichswirtschaft statt einer kleinen Startkasse mit langem Warten.

## Zeit, Spielstände und Hochformat

- Regeltests prüfen fünf Tage mit 10 % Verkürzung als tatsächliche 4,5 Tage, einen Beginn mitten im Tag, kombinierte vorhandene Boni unter zwei Tagen, gleiche KI-Zeit, kleine Zeitabschnitte, Finanzierungspausen und taggenaue Haushaltsprognosen.
- Migrationen v1–v10, unveränderte laufende Forschungszusagen und Speichern/Laden mit dezimalem Fortschritt bestehen die Tests. Ungültige Zeitphasen und Forschungswerte werden abgewiesen.
- WebKit 26.5 ist mit Touch und 390 × 844 sowie 320 × 568 geprüft: keine horizontale Überbreite oder abgeschnittene HUD-Raten, korrekte Credit-Eingaben und reservierte Importbudgets. Ein Projekt von 2,82 Tagen endet bei 1×/2×/4× nach ungefähr 8,46/4,23/2,12 Sekunden; Pause und erneutes Laden erhalten die Restzeit. Native Musik läuft weiter. Dies ist Browserprüfung, keine Messung auf einem physischen iPhone.
- Sechs vollständige Weltsimulationen über 1080 Tage erhalten validierbare Spielstände. Am Ende bestehen 30–34 fremde Kolonien, 38–46 bewaffnete KI-Schiffe und 1–4 tatsächliche Kriege je Welt. Einzelne Reiche dürfen Schulden haben; es entsteht kein allgemeiner Finanzkollaps. Waren bleiben endlich und nicht negativ.

Abschlussprüfung: **261 erfolgreiche Tests**, deterministischer Build und Build-Abgleich. Weitere allgemeine Zahlenrunden sind nicht Bestandteil dieses Abschlusses. Nachjustierung braucht eine konkrete beobachtete Schieflage. Sozialmodell, optionaler Spieleinstieg und Katastrophen durch Vernichtungswaffen bleiben separate Entwürfe in `ROADMAP.md`.
