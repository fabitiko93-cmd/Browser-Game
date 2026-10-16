# Vorabvergleich der Autoformationen

Die Messung verwendet die echte feste Kampfberechnung der Probeschlacht. Der Vergleichsstand ist Commit `2411acc61d6c52937c2348e9307e6685ccc99e10`.

## Versuchsaufbau

288 Vergleichspaare / 576 einzelne Gefechte: sechs Szenarien, sechs zuvor nicht zur Ausarbeitung verwendete Seeds, beide Seiten und vier Formationen. Jedes Gefecht läuft bis zum Ergebnis oder bis Tag 45. Ausgangsschiffe, Hülle, individuelle Versorgung, Forschung, Panzerung, Waffenreichweiten und Schadensrate werden pro Vergleich auf Gleichheit geprüft. Gegner erhalten dieselbe Aktualisierung der allgemeinen Aufstellung wie der Spieler. Deshalb werden neben dem alten Stand auch die vier neuen Formationen untereinander verglichen.

Die folgenden Ergebnisse betreffen die Wahl der **Flottenformation** bei unveränderten inneren Autoaufstellungen, also den üblichen ersten Bedienungsschritt. Ein separater vorangehender Durchlauf mit beiden Planungsebenen bestätigte die Keilwirkung ebenfalls. Manuelle Positionen, Mitgliedschaften und Ziele werden nicht automatisch überschrieben.

## Ausgewählte Ergebnisse der abschließenden Messung

Pro Tabellenzeile liegen zwölf Gefechte je Formation vor: sechs Seeds auf beiden Seiten. Angegeben sind mittlere Verluste; die vollständigen Ergebnisse aller sechs Szenarien und vier Formationen stehen in `experiments/formation-comparison.json`.

| Szenario und Messgröße | Ausgewogen | Linie | Keil | Statische Schutzaufstellung |
| --- | ---: | ---: | ---: | ---: |
| Gemischtes Frontalgefecht · eigene Schiffsverluste | 12,58 | 10,08 | 7,08 | 10,08 |
| Breite gegnerische Front · eigene Schiffsverluste | 14,00 | 12,25 | 7,58 | 12,25 |
| Konvoi mit Flankenangriff · eigene Schiffsverluste | 6,00 | 5,00 | 8,92 | 6,33 |
| Konvoi mit Flankenangriff · Frachterverluste von jeweils 3 | 1,50 | 1,00 | 1,92 | 0,17 |
| Stark beschädigte Eskorte · Frachterverluste von jeweils 2 | 2,00 | 2,00 | 2,00 | 2,00 |

## Entscheidung

- Übernommen: tatsächliche Ausgangswerte für die Platzbesetzung von Ausgewogen, Linie und Keil; einheitliche Beweglichkeitsberechnung; koordinierte automatische Keilsalven. Der Keil senkt in den Frontalfällen Verluste, verschlechtert aber den Konvoi-Flankenfall deutlich. Er ist keine allgemeine Verbesserung jeder Lage.
- Beibehalten: die bisherige statische Schutzgeometrie. Im Konvoi-Flankenfall verliert sie in der abschließenden Variante insgesamt 2 von 36 eingesetzten Frachtern, Ausgewogen 18 von 36. Dafür kostet sie etwas mehr Eskorten. Daraus folgt kein Schutz vor gezielt zugewiesenem Fernfeuer.
- Verworfen: experimentelles Nachführen aller beziehungsweise nur schneller Eskorten und eine neue Schutz-Zielpriorität. In den Vorversuchen mit identischen Schiffswerten verschlechterten sie den Frachterschutz gegenüber dem ausgewogenen Vergleich oder lieferten keinen zusätzlichen Nutzen. Diese Bewegungs- und Prioritätslogik ist nicht Bestandteil der Veröffentlichung.
- Grenze: Bei der stark beschädigten Eskorte gehen in allen vier Varianten beide Frachter verloren. Die Formation ersetzt keine ausreichende eigene Kampfkraft. Alle bewaffneten Klassen behalten hier die bisherige Reichweite von 90 km.

## Reproduktion

`node scripts/compare-battle-formations.mjs` extrahiert nur die alten Quellen aus dem genannten Git-Commit in ein temporäres Verzeichnis und führt die Vergleichspaare aus. Das Arbeitsexemplar und seine Dateien werden dabei nicht zurückgesetzt. Das JSON-Ergebnis liegt standardmäßig unter dem System-Tempverzeichnis; `ORBIT_BENCH_OUTPUT` wählt einen Zielpfad. Mit `ORBIT_BENCH_LEVEL=both` werden beide Planungsebenen gemeinsam gesetzt. `ORBIT_BENCH_SEEDS`, `ORBIT_BENCH_CASES` und `ORBIT_BENCH_FORMS` begrenzen einen gezielten Nachlauf.

## Grenzen der Aussage

Dies sind deterministische Vergleiche in sechs definierten Situationen, keine allgemeine Balancegarantie und kein Test auf einem physischen iPhone. Die zwölf Läufe je Variante sind keine zwölf unabhängigen Kampfsysteme; die Seeds verändern die organischen Ausgangspositionen. Flug- und Trefferereignisse sowie Verluste stammen aus dem tatsächlichen Simulationsablauf. Der erste Abschuss allein wurde ausdrücklich nicht als ausreichender Nutzen gewertet. Die strategische Kampfabrechnung des Hauptspiels wird nicht verändert.
