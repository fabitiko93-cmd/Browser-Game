# ORBIT 3077

Eine eigenständige planetare Aufbau- und Kriegssimulation für den **iPhone-Browser im Hochformat**.
Fiktive Welt im Jahr 3077, mit lokalen Produktionsketten, fremden Spezies und interstellarer Politik.
Arbeitstitel: ORBIT 3077.

## 3D-Probeschlacht · 0.12.0

- Unter **Flotte → Probeschlacht öffnen** oder direkt über [battle.html](https://fabitiko93-cmd.github.io/Browser-Game/battle.html) starten. Das Reich wird vor dem Wechsel gespeichert und pausiert. Die Übung verwendet eigene Schiffe und einen eigenen Spielzeit-Takt; sie verändert keine Ressourcen, Forschungen oder Flotten des Spielstands.
- Vier echte Quaternius-Rümpfe und acht Schiffe in zwei festen, rund 50 km getrennten Formationen. Die Flotten nähern sich im Gefecht nicht an. Torpedos fliegen gelenkt mit sichtbarer Spur, Massentreiber verschießen schnelle Geschosse, Laserkorvetten treffen direkt und Abfangjäger feuern violette Pulse. Geschosse verursachen Schaden erst bei Ankunft; Reichweiten und Flugzeiten gehören zur Übungssimulation.
- **Schiff**, **Flotte** und **Taktik** sind direkte Kameraaktionen. „Ansehen“ im Zielfeld öffnet die nahe Gegnerkamera. Weiche Übergänge erhalten Auswahl und Befehle; bei reduzierter Bewegung erfolgen sie sofort. Die taktische Ansicht stellt die Formationen ausdrücklich schematisch dar und zeigt das tatsächliche Angriffsziel des ausgewählten Schiffs. Die reale Gefechtsdistanz bleibt erhalten; nur ein befohlener Rückzug bewegt Schiffe aus der Formation.
- **Ziele** öffnet die bestehende Kontaktliste mit Klassenfiltern, Suche, Sortierung und zwölf Kontakten je Seite. Die Auswahl dient dem Ansehen und der Vorbereitung eines Auftrags: Sie verändert einen laufenden Angriff nicht. **Dieses Schiff / Eigene Flotte** legt die Empfänger fest. **Angreifen** erteilt einen verbindlichen Auftrag auf den gewählten Gegner; **Automatisch** hebt die manuellen Aufträge dieser Empfänger auf; **Rückzug** gilt ebenfalls für die gewählte Gruppe. Die Befehlszeile zeigt den tatsächlich geltenden Auftrag. Ein unerreichbares manuelles Ziel wird abgewartet; nach dessen Vernichtung wählen die betroffenen Schiffe wieder automatisch. Der zerstörte betrachtete Kontakt bleibt als solcher beschriftet. Eine gefilterte Klasse kann ausdrücklich angegriffen werden. Die Kontaktkomponente ist mit 1.000 Einträgen geprüft; das 3D-Übungsgefecht enthält weiterhin acht Schiffe.
- Physikalische Modellmaterialien mit Metall-/Rauheitswerten, Umgebungsreflexionen und dezenten Oberflächennormalen. Licht und gebündelte Leuchteffekte betonen Triebwerke, Waffen und Treffer. Schildwellen entstehen am Einschlagpunkt; Beschädigung zeigt Brände und Rauch, Zerstörung eine kurze zerfallende Hülle, Druckwelle und zeitlich begrenzte Trümmer. Waffenklänge unterscheiden sich und berücksichtigen die vorhandene Toneinstellung. Die Effekte stammen aus realen Ereignissen der Übungssimulation.
- Stabile Bedienfelder bleiben während HUD-Aktualisierungen bestehen. Der Renderer verwendet feste Effektpuffer, Instanzen und vorab vorbereitete Hintergrundtexturen. Ein begrenzter, niedrig aufgelöster Leuchtpuffer läuft vor der finalen ACES-/sRGB-Ausgabe. Die Auflösung reagiert auf länger anhaltende Bildzeiten, zwischen Faktor 0,85 und maximal 1,75; die Ausgabe ist auf bis zu 60 Bilder pro Sekunde begrenzt. In Pause laufen weder Kampf noch Effekte weiter, Kamerabedienung bleibt möglich. Die tatsächliche Leistung hängt vom Gerät ab.
- Pause, 1×/2×/4× und Neustart. Ein Übungstag dauert bei 1× drei Sekunden. Der Hintergrund pausiert die Übung; es gibt keine Kalender- oder Offline-Fortschreibung.
- Vier lokal mitgelieferte GLB-Modelle mit 1024px-Texturen benötigen zusammen etwa 1,5 MB. Quaternius veröffentlicht die Originale unter CC0; Quelle, Änderungen und Prüfsummen stehen in `web/models/quaternius/`. Three.js wird als lokales Modul gebündelt, einschließlich MIT-Lizenz. Zur Laufzeit werden keine externen Modelle oder Bibliotheken geladen.
- Dies ist die erste Grafik- und Bedienungsprobe. Dauerhafte strategische Gefechte über Wochen oder Monate **Spielzeit** und ihre spätere Verbindung mit der 3D-Ansicht sind noch nicht umgesetzt. Die bestehenden strategischen Kampfregeln bleiben erhalten.

## Lesbare Credits und Ressourcenanzeige · 0.10.6

- Wieder gewöhnliche Creditsummen: **2.400 ¢** statt einer Mio./Mrd./Bio.-Einteilung. Tagesraten, Preise, Kosten und Budgetfelder verwenden dieselben Beträge; Spielstände brauchen keine Umrechnung.
- Die einzeilige Ressourcenanzeige hält Zahlen innerhalb ihres Feldes. Bei Platzmangel passt sich die Zahlengröße an; lange Beschriftungen greifen nicht in Nachbarressourcen über. Das bestehende Umschalten der Ressourcenseiten bleibt erhalten.
- Hohe Projektkosten bleiben unverändert: Weltenlanze 48.000 Credits plus erste Ladung 22.000; Resonanzschmiede 120.000 plus erste Ladung 80.000. Materialien und Betrieb kommen hinzu. Forschungskosten, Boni und exakt verkürzte Entwicklungszeiten bleiben erhalten.

## Balanceabschluss · 0.10.5

- Spieler und KI verbrauchen Energie, Legierung, Waffen und nach Freischaltung Elektronik nach denselben Regeln. Krieg erhöht den tatsächlichen Waffenbedarf. Zahlungsunfähigkeit belastet die Zufriedenheit beider Seiten; HUD, Tagesabrechnung und Marktbedarf berücksichtigen den gemeinsamen Verbrauch.
- Handelsboni liefern auch bei Kombination aus Regierung, Freihandel, Forschung und Programmen einen weiteren Ertrag. Mehrerträge nehmen ab, statt an einer frühen Preisgrenze vollständig zu verschwinden. Das gilt auch für den öffentlichen eigenen Handelsplatz; dessen Preise berücksichtigen jetzt Forschungs- und Hafenboni. Bedarf, reale Käuferbudgets, Waren und Reisezeit begrenzen den Absatz weiterhin.
- Eine interne Recheneinheit entspricht einer Milliarde Credits. Die Startkasse zeigt **800 Mrd. ¢**, größere Kassen und Projekte **Bio. ¢**. Einnahmen, Preise, Unterhalt, Schulden, Meldungen und Baukosten verwenden dieselbe Darstellung; kleine Preise erscheinen in Mio. Credits. Preis- und Budgeteingaben sind ausdrücklich in Mrd. Credits beschriftet und buchen denselben Betrag.
- Die Weltenlanze kostet **48 Bio. ¢**, ihre erste Ladung **22 Bio. ¢**; die Resonanzschmiede **120 Bio. ¢**, ihre erste Ladung **80 Bio. ¢**. Versorgung, Materialien und laufender Unterhalt kommen hinzu. Eine unveränderte Startwelt erreicht diese Finanzierung nach zwei bis drei Jahren auch mit den vorhandenen Steuerstufen und Regierungsformen nicht. Bereits bezahlte Bauten und Ladungen werden nicht nachberechnet.
- Forschungszeiten werden ohne Aufrunden und ohne versteckte Zweitagesgrenze berechnet. **5 Tage −10 % = 4,5 tatsächliche Spieltage**, auch bei einem Beginn mitten im Tag. Spieler und KI nutzen dieselbe Zeitachse. Die Prognose berücksichtigt Abschlüsse vor der nächsten Tagesabrechnung. Pause, Finanzierungspausen, Hintergrund und Speichern/Laden erhalten die Restzeit und den angebrochenen Spieltag.
- Spielstand v11 übernimmt bestehende Welten, Kassen, Bestände, Missionen und zugesagte Forschungsrestzeiten. Die neue Dauer gilt für neue Aufträge. Das vorhandene Hochformatdesign und die Audio-Wiedergabe bleiben erhalten; Zahlenfelder im Handelsformular verschlucken beim Verlassen keinen Speichern-Tipp mehr.
- Der vereinbarte Balanceabschluss ist anhand fester Kriterien geprüft. Ergebnisse und Grenzen stehen in [BALANCE.md](BALANCE.md). Sozialmodell, Tutorial und zusätzliche Katastrophenmechaniken bleiben vorgemerkt; sie gehören nicht zu diesem Patch.

## Politische Balance und Forschungsnetze · 0.10.4

- Acht politische Profile sind nach ihrer Wirkung auf reale Betriebe, Forschung, Handel und finanzierte Flotten neu gewichtet. Demokratie und Theokratie behalten ihre durch die Wachstumsbalance bereits wirksamen Schwerpunkte. Der gemeinsame politische Rechenweg gilt weiterhin für Spieler und KI.
- Monarchie und Oligarchie haben kleinere allgemeine Steuer- und Sparvorteile. Die Oligarchie erzielt dafür bessere Exportkonditionen, entwickelt Forschung aber etwas langsamer. Föderale Steuerteilung belastet den Haushalt weniger stark. Konzernherrschaft profitiert stärker von tatsächlich hergestellten zivilen Gütern statt von pauschalen Abgaben.
- Kommunismus stellt mehr Arbeitskräfte für ausgelastete Produktionsketten bereit. Die Militärregierung gewinnt Gefechtsstärke und spart 22 % Flottenunterhalt, bei weiterhin eingeschränkter ziviler Produktion und Beschäftigung. Nationalsozialismus setzt stärker auf Personal und Rüstungsserien; professionelle Militärverwaltung bleibt im Flottenbetrieb und in der Gefechtsstärke überlegen.
- Technokratie behält +25 % Forschung, 15 % kürzere Entwicklung und 8 % weniger Fabrik-Energiebedarf. Der allgemeine Gebäudeaufschlag sinkt von 18 % auf 8 %, damit zusätzliche Labore ihren Vorteil auch finanzieren können.
- Diplomatische Forschung hat abnehmende Mehrerträge: die ersten 14 Prozentpunkte wirken vollständig, größere Netze nähern sich insgesamt 40 %. Mit allen 18 Partnern und beiden Abkommen ergeben sich rund +37,44 % statt +252 %. Eigene Forschungsanlagen bleiben erforderlich. Krieg, Sanktionen oder der Verlust aller Partnerkolonien beenden den Bonus. Reale Forschungsabkommen wirken beidseitig nach derselben Netzregel.
- Die Diplomatieansicht zeigt den Gesamtbonus und den aktuellen Unterschied mit und ohne ein einzelnes Abkommen, einschließlich Abschlussvorschau und passender Protokolle. Die Tagesabrechnung und das HUD nutzen dieselbe Berechnung. Bestehende Spielstände, Programme und Restzeiten laufender Aufträge bleiben erhalten.
- Sozialmodell mit Armut, dauerhaften Belastungen, Streiks und echter Auswanderung sowie ein freiwilliger Tutorial-Einstieg sind für den nächsten Patch in [ROADMAP.md](ROADMAP.md) vorgemerkt. Details werden vor der Umsetzung weiter ausgearbeitet.

## Wirtschaftliche Balance · 0.10.3

- Zufriedenheit beeinflusst den Bevölkerungszuwachs stufenlos. Bei 80 % gilt die bisherige Grundrate; hohe Zustimmung beschleunigt Wachstum bis Faktor 1,6. Hohe Steuern bringen kurzfristig mehr Einnahmen, verlangsamen aber den Aufbau von Bevölkerung und Arbeitskräften. Nahrung und Wohnraum bleiben Voraussetzungen. Wirtschaft und Regierungsvorschau zeigen die tatsächliche Änderung je Spieltag.
- Fremde Reiche gleichen neue Produktionsanlagen mit laufendem Bedarf, vorhandenen Kapazitäten und öffentlichen Absatzmöglichkeiten ab. Überfüllte Anlagen pausieren und laufen bei sinkenden Vorräten wieder an; dadurch werden reale Arbeitskräfte und Unterhaltsmittel frei. Industrieprogramme werden für tatsächliche Engpässe finanziert.
- Zivile Investitionen, Frachter und Kampfverbände berücksichtigen auch den späteren Unterhalt laufender Bau- und Werftaufträge. Handelsreiche können bei ausgelasteten Routen mehrere bezahlte Frachter betreiben; Schutz- und Expansionsreiche verfolgen begrenzte eigene Flottenziele. Expansionisten stellen bis zu zwei Landungsschiffe bereit und können kleine vorübergehende Fehlbeträge aus vorhandenen Reserven finanzieren. Ansprüche, Ankündigungen, Wissen und Verträge bleiben Voraussetzungen für Kriege.
- Bestehende Spielstände bleiben nutzbar. Bestände, Gebäude, Forschungen, Bevölkerung und laufende Missionen werden beim Laden erhalten; die neue Balance wirkt ab dem nächsten Spieltag. Bereits angesammelte Überschüsse werden durch Verbrauch und Handel abgebaut.

## Welten, Wirtschaft und Vorherrschaft · 0.10

- **Neue Partien erzeugen einen neuen Sektor:** 16 unterschiedlich angeordnete Sterne, 49 neu verteilte Welten, wechselnder Heimatplanet und Nachbarschaften. 19 Reiche beginnen jeweils auf einer versorgbaren Heimatwelt. Unbewohnte Planetensysteme, drei reine Sternsysteme und wenige planetare bzw. orbitale Ruinen erweitern die Erkundung. In generierten Welten beeinflusst die Entfernung Reisezeit und Energiebedarf. Alte Spielstände behalten ihre Welt und bisherigen Reisezeiten.
- **Planetare Wirtschaftsrollen:** Klima, Erzergiebigkeit, Kristall- und Treibstoffausbeute sowie begrenzte Förderstellen unterscheiden Standorte. Die Förderung erschöpft sich nicht. Nahrung und Energie bleiben auf allen Heimatwelten sicherbar, spezialisierte Produktion und aufwendigere Autarkie führen aber zu unterschiedlichen Ausbauentscheidungen. Alte Welten behalten ihre Erträge und mindestens alle vorhandenen Förderanlagen.
- **Ruinen nach einer Analyse nutzen:** Ein bezahlter Frachter kann einmalig Material bergen oder mit freigeschalteter Betriebstechnik und realer Baustofffracht eine Anlage wiederherstellen. Planetare Anlagen benötigen eine eigene Kolonie; orbitale Relikte benötigen keine Kolonisierung. Ein orbitaler Versorgungsknoten oder ein Observatorium verbraucht laufend Nahrung, Energie und Credits. Ohne Versorgung pausiert es; Frachter und Kreisläufe können nachliefern.
- **Handel mit dem Spieler in beide Richtungen:** Wirtschaft → Handel → Märkte enthält den eigenen öffentlichen Handelsplatz. Freigegebene Exporte schützen 30 Tage Verbrauch, Baustoffreserven und eigene Zielbestände. Importaufträge haben Zielbestand, Preisgrenze und einen tatsächlich reservierten gemeinsamen Monatsbetrag. Fremde Frachter laden, reisen, kaufen bzw. liefern und kehren mit realer Fracht zurück. Ungenutzte Mittel werden zurückgegeben; die automatische Erneuerung schützt 180 Credits in der Staatskasse. Eine laufende Nachfrage sowie bestehende Lieferverträge und Mehrstopprouten tragen langfristigen Handel.
- **Längere Regierungsprogramme:** allgemeine Programme laufen 60–120 Tage, spezifische Reformen 180 Tage. Finanzierung wächst mit der Kolonienzahl; Laufzeit und Sperrfristen verhindern beliebiges Umschalten. Auch die KI bezahlt Programme und erhält dieselben realen Modifikatoren.
- **Verbindliche Machtbünde:** ab zwei Kolonien, Vertragsdiplomatie, Kommunikationszentrale und Diplomatischem Forum. Einladungen landen im vorhandenen Posteingang. Handel, mindestens 55 Beziehungen und finanzierbare Verpflichtungen sind erforderlich. Mitglieder zahlen 2 Credits pro Tag; Führung kostet 4 Credits je Mitglied. Der Bund gewährt gemeinsame Häfen gegen reale Servicekosten und +6 % Forschung. Versorgungsersuchen benötigen tatsächliche Frachterlieferungen; Automatik wird durch Smarte Versorgungsrouten freigeschaltet. Drei Beitrags- oder Versorgungsbrüche führen zum Austritt, mit 180 Tagen Beitrittssperre. Mitgliedschaft offenbart Hafenadressen, keine geheimen Gesellschafts- oder Militärdaten.
- **Vorherrschaft als Endgame:** Flotte → Macht (Vorherrschaft). Ein System zählt bei mindestens 55 % seiner ursprünglichen planetaren Bedeutung unter eigener Kontrolle oder verbindlichen Mitgliedern. Für den Sieg müssen zwei Drittel des gesamten Systemgewichts 120 Tage gehalten werden, bei solventer und versorgter Führung. Reine Sternsysteme zählen nicht; Zerstörung senkt den Nenner nicht. Die KI folgt derselben Siegbedingung. Nach dem Ergebnis kann frei weitergespielt werden; Aufbau-Meilensteine bleiben als ergänzende Ziele erhalten.
- **Kriegsziele und Friedensbedingungen:** bekannte planetare Ansprüche begrenzen Kampagnen. Ein frischer Krieg endet nicht mehr allein durch Zahlung von 120 Credits. Verhandlungen berücksichtigen Anspruch, Kriegsdauer und echte Gebietsverluste; Reparationszahlungen gehen an den Gegner. Friedensverwaltung kostet 60 Credits, Waffenstillstände gelten 180 Tage für beide Seiten.
- **Spielstand v10:** Import von v1–v9 bleibt möglich. Bestehende Kolonien, Bestände, Flotten, laufende Missionen, Forschungen, Programme und Beobachtungen bleiben erhalten. Weltgeneration erfolgt ausschließlich beim neuen Spiel. Das vorhandene Hochformatdesign, Gebäude und Oberflächen bleiben erhalten.

## Interessen & Rivalitäten · 0.9

- 18 fremde Regierungen verfolgen Handels-, Forschungs-, Siedlungs-, Sicherheits- oder Einflussziele. Eigene Versorgungskrisen ändern ihre Priorität; politische Produktions-, Forschungs- und Militärfaktoren wirken weiterhin über dieselben Regeln. Erklärte Interessen und öffentliche Partner/Rivalen stehen in der Diplomatieansicht.
- Fremde Reiche schließen untereinander bezahlte Handelsabkommen und Nichtangriffspakte. Entwickelte Vertragsdiplomatie plus aktives Diplomatisches Forum ermöglichen Schutzbündnisse: 2 Credits Unterhalt je Partner und Tag sowie begrenzte Hilfe aus tatsächlich vorhandenen Vorräten. Höchstens zwei Schutzpartner; begrenzte Handelsnetze statt automatisch aller 153 Verbindungen.
- Regionale Konkurrenz kann zu Rivalitäten und vorbereiteten Kriegen führen. Konfliktbeginn frühestens ab Tag 180, mindestens 36 Tage Vorbereitung, ausreichend eigene Flotte und finanzierbarer Unterhalt. Ansprüche an den Spieler und Kriegserklärungen landen als Erklärung in der Kommunikationszentrale. Annäherung, Handel und Pakte können die Vorbereitung abbrechen. Wirtschaftliche Krisen und langanhaltende Kriege führen zwischen KI-Reichen zu Waffenstillständen mit 180 Tagen Eskalationspause.
- Die KI baut reale Korvetten, Zerstörer, später Kreuzer und Landungsschiffe. Werftzeit, Forschung, Besatzung, lokale Waren, Credits, Flottenunterhalt, Startenergie, Bordversorgung, Reparatur und Schäden gelten für alle Reiche. Der frühere Überfall mit erfundener, automatisch wachsender Stärke entfällt. Physische Verteidigungsschiffe zählen im Gefecht; Eroberung verbraucht Landungsschiffe. Auch KI-Fernwaffen benötigen Forschung und den vollständigen Preis.
- Öffentlich finanzierte Beschaffungsgebote decken neben laufendem Verbrauch geplante Gebäude und Schiffe ab. Diese Gebote beeinflussen Marktpreise und Liefermengen, nicht die HUD-Tagesraten. KI-Frachter benötigen Handelszugang; eigene Kolonien versorgen sie mit real gebuchten Waren und Reiseenergie. Zivile Reserven schützen vor ungebremsten Importkäufen. Anlagen- und Werftentscheidungen berücksichtigen laufende Flottenkosten.
- „Öffentliches Subraum-Nachrichtennetz“ schaltet **Space News** innerhalb der Kommunikationszentrale frei. Öffentliche Abkommen, Rivalitäten, Kriege, Waffenstillstände, Kolonien, Eroberungen, Zerstörungen und beobachtbare Flottenbewegungen. Empfang nur über eine versorgte Zentrale und aus kartierten Systemen; keine rückwirkende Lieferung unbekannter Ereignisse. Gespeicherte Berichte bleiben bei Empfangsausfall erhalten. Neue Berichte markieren den blauen Dachpunkt, die Dachzahl zählt weiterhin ausschließlich unbeantwortete Angebote.
- Nachrichten geben keine internen Vorräte, Bevölkerungszahlen, geheimen Anlagen oder Flottenstärken preis. Öffentliche neue Hafenadressen ergänzen nur Bewohnung und Zugehörigkeit. Militärische Planung nutzt eigene Wissensarchive; erst die tatsächliche Gefechtsauflösung verwendet die reale Verteidigung.
- Verlust der letzten eigenen Welt beendet die Simulation mit einem gespeicherten Niederlagenzustand; Sichern, Laden und Neustart bleiben verfügbar. Speicherformat v9 übernimmt v1–v8 mit bestehenden Kolonien, Waren, Archiven und laufenden Aufträgen. Kein Neustart für diesen Patch erforderlich. Oberfläche, Gebäudegrafiken und Musik bleiben im bisherigen Stil.

## Direkte Audiowiedergabe · 0.10.2

- Ein im WebKit-Test reproduzierter Timerfehler ist korrigiert: Browser-Zeitgeber behalten ihren Window-Kontext statt das Audioobjekt als Empfänger zu verwenden.
- Soundtrack und zehn Aktionssounds spielen als eingecheckte MP3-Dateien direkt über native Player, ohne AudioContext-Freigabe und ohne Rendering auf dem iPhone. Gleiche Musik, rund 1,7 MB Audio, getrennte Einstellungen und fortgesetzte Musikposition.
- Soundtest startet unmittelbar im Tipp. Hängende Starts und ein stehender Wiedergabezeitgeber werden sichtbar; „Direkter Audiotest“ prüft mit dem normalen Player-Control unabhängig vom Spielstart. Der Status benennt die Browserantwort statt hörbaren Ton zu behaupten.
- Offline-Audio beantwortet Safari-Byte-Range-Anfragen mit korrekten binären 206-Antworten. Der Build kopiert die Audiodateien unverändert.
- Bei älteren iOS-Versionen kann Home-Screen-Audio auch außerhalb des Spielcodes scheitern. Apple dokumentiert eine Korrektur in Safari 26.2; zum Vergleich kann ein normaler Safari-Tab verwendet werden. Spielstände und Browserdaten müssen nicht gelöscht werden.
- Optionale Regeneration der MP3-Dateien: `npm run audio:render`, mit lokal verfügbarem `web-audio-engine` und `ffmpeg`; `ORBIT_AUDIO_ENGINE` kann auf die installierte Renderer-Datei zeigen. Build und Spielen benötigen diese Werkzeuge nicht.

## Audiofreigabe auf dem iPhone · 0.10.1

- Die Wiedergabe verwendet die Audio-Session-Kategorie `playback`, soweit vom Browser unterstützt. Dadurch hängt Musik auf dem iPhone nicht mehr von der bisherigen Ambient-Einstellung und dem Lautlosmodus ab.
- Fingerheben, Touchende und Tastaturbedienung geben den Ton ebenfalls frei. Ein Tipp repariert einen veralteten Hintergrundstatus; unterbrochene Wiederaufnahmeversuche und fehlgeschlagene Initialisierungen blockieren den nächsten Versuch nicht.
- Die Toneinstellungen zeigen den Wiedergabestatus und bieten „Ton neu starten“. Lautstärken, Stummschaltungen und Musikposition bleiben dabei erhalten.

## Musik & Aktionssounds · 0.8.1

- Neuer eigener Space-Soundtrack „Transit 3077“: zwei Minuten mit Synth-Flächen, Melodien, Arpeggios, ruhigen und rhythmischen Passagen. Nahtloser Audioloop unabhängig von Spieltempo, Pause und UI-Timern; durchgehend hörbare Klangflächen auch beim anfänglichen Live-Score.
- Musik pausiert bei App-/Tabwechsel und versucht bei Rückkehr automatisch an derselben Stelle weiterzuspielen. Falls der Browser eine neue Bedienaktion verlangt, aktiviert jeder Tipp die Wiedergabe, auch auf der Karte. Safari-Unterbrechungen und verspätete Hintergrundpausen werden abgefangen; keine doppelten Musikinstanzen.
- Unterschiedliche kurze Sounds für Bau, Forschung, Schiffbau, Lieferung, Kolonisierung, Angriffe und neue Korrespondenz. Warnungen und Meldungen werden begrenzt, gewöhnliche Protokolleinträge erzeugen keinen zusätzlichen Ton. Musik und Effekte behalten ihre getrennten Lautstärke- und Stummschaltungen.
- Spielstände und Gameplay bleiben unverändert; kein Neustart erforderlich.

## Kleine Reiche & eigenständige Wirtschaft · 0.8

- Neue Partien starten mit 18 fremden Reichen, je einer Heimatwelt. Insgesamt 49 Planeten in zwölf Sonnensystemen; mehrere Staaten teilen sich Systeme. Alte Spielstände behalten sämtliche Besitzverhältnisse und erhalten zwölf zusätzliche Hauptwelten.
- Zehn Staatsformen: neu Föderale Republik, Konzernherrschaft, Oligarchie und Theokratie. Eigene Produktions-, Forschungs-, Steuer-, Versorgungs- und Reformfaktoren sowie passende Gesetze und Regierungsprogramme.
- Credits können negativ werden. Ungedeckte laufende Kosten bleiben Schulden, mit 0,1 % Zins je Spieltag. Bei Zahlungsunfähigkeit warten nicht notwendige Baustellen, Industrie liefert 80 %, Labore 50 %, Forschungsprojekte pausieren und Flotten verlieren täglich drei Versorgung ohne automatische Wartung. Oberhalb von max. 150 Credits bzw. 1,5 Credits je Einwohner Schulden stehen nicht notwendige Anlagen still, bei 25 % Restunterhalt. Nahrung, Energie, Wohnraum, öffentliche Gesundheit und Kommunikation bleiben geschützt. Einnahmen tilgen Schulden automatisch.
- Wirtschaft → Finanzen bietet Sparbetrieb, Haushaltshilfen und örtliche Sofortverkäufe ohne Frachter. Maximal 50 Einheiten je Planet und Spieltag, ein begrenztes ziviles Käuferbudget mit langsamer Erholung, 38 % des Waren-Grundpreises. Kleine regelmäßige Gebühren aus versorgter und zufriedener Binnenwirtschaft; Handelshäfen erhöhen sie begrenzt. Keine permanente Geldquelle ohne Bevölkerung oder Versorgung.
- Preise reagieren stärker auf echte Bestandsreichweite und Überschussproduktion. Engpässe, Nachfrage und Überangebot sind als öffentliche Marktsignale sichtbar. Tatsächliche Lieferungen verschieben Preise; interne Vorräte bleiben verborgen.
- Fremde Staaten starten mit unterschiedlichen Vorräten und Produktionsschwerpunkten. Sie investieren in eigene Engpässe, prüfen dauerhafte Kosten, pausieren Anlagen bei Schulden und betreiben echte Frachter mit begrenztem Laderaum, gebuchter Ware, Hin-/Rückflugenergie, Reisezeiten und endlichen Haushalten. Erkundete leere Welten können sie nach Forschung mit bezahlten Kolonieschiffen und Siedlern besiedeln; höchstens drei eigene Kolonien je Reich.
- Das eigene Planetendossier öffnet durch Antippen des Planetennamens über der Karte. Es ist nicht mehr zwischen Baukategorien untergebracht. Systeme mit fünf Welten werden vollständig gezeichnet.
- Speicherformat v8: v1–v7 werden migriert, bestehende Kolonien, Güter, Archive und Flottenaufträge bleiben erhalten. Die kleinteilige Startverteilung erfordert eine neue Partie.

## Erkundung & Kommunikation · 0.7

- Zwölf Sterne und 37 Planeten. Drei neue Systeme mit neun unbewohnten Welten liegen außerhalb der kartierten Flugrouten. In der Sternenkarte einen unkartierten Stern wählen und einen Erkunder losschicken; nach erfolgreicher Übertragung können andere Schiffe folgen. Flüge ohne vorhandene Sprungkorridore kosten mehr Energie und dauern länger. Neue Raumtore werden noch nicht gebaut.
- Erkunder sind unbewaffnet und melden vor allem Bewohnung. Sie halten Abstand zu fremden Bewohnern und ziehen sich zurück; aggressive Abwehr kann sie vor der Datenübertragung zerstören. Ein Verlust erteilt keine kostenlosen Informationen.
- „Planetare Analyseverfahren“ schaltet Analysesonden frei. Ein manueller Scan kostet 60 Credits, 8 Energie und 2 Optik zusätzlich zur Startenergie, dauert nach der Ankunft sechs Tage und erschließt Geologie und Gelände. Die Sonde kehrt zurück. Bevölkerung, Regierung und Militär bleiben davon verborgen.
- Das Planetendossier trennt Astronomie, Bewohnung, Zugehörigkeit, Gesellschaft, Oberfläche und Gefechtsbeobachtung. Informationen erhalten Quelle, Datum und Qualität; ältere Beobachtungen bleiben als solche gespeichert. Eigene Planeten zeigen aktuelle Verwaltungsdaten. Ein tatsächlicher Hafenbesuch bei einem Handelspartner erschließt zivile Einblicke, keine geheimen Militäranlagen.
- Karten, Oberflächen, Diplomatie, Märkte und Zielauswahl berücksichtigen denselben Wissensstand. Fremde interne Vorräte und Produktionsketten sind verborgen; öffentliche Marktpreise und konkrete Handelsangebote bleiben verfügbar. Beim Betrachten fremder Planeten zeigt das HUD weiterhin die Vorräte einer eigenen Kolonie.
- Die KI besitzt getrennte Wissensarchive und nutzt dieselben Schiffsbau-, Erkundungs- und Scanaufträge mit eigenen Kosten, Reisezeiten und Forschungsvoraussetzungen. Angriffsziele werden aus bekannten Beobachtungen gewählt; Gefechte selbst werden anhand der tatsächlichen Verteidigung aufgelöst.
- Subraum-Kommunikation schaltet die Kommunikationszentrale frei: maximal eine je Planet, gemeinsam genutzter reichsweiter Posteingang, Zugang durch Antippen des Gebäudes. Die Dachzahl zählt gültige, unbeantwortete Anfragen/Angebote: 0 in Blaugrau, offene Anfragen in Amber, bei höchstens sieben Tagen Restfrist in Orange. Ein separater blauer Punkt kennzeichnet ungelesene Erklärungen.
- Handels- und Paktangebote können angenommen, abgelehnt oder zurückgezogen werden. Unbeantwortete Angebote laufen nach 30 Tagen aus; eigene Angebote werden nach drei Tagen geprüft. Ignorieren verursacht keine pauschale Beziehungsstrafe. Neue Korrespondenz erzeugt nur einen kurzen Hinweis. Eine Reichsanfrage höchstens alle 48 Tage; je Absender mindestens 120 Tage Abstand und keine parallelen Doppelverhandlungen.
- Abbau, Verlust oder Neubau einer Zentrale löscht die Korrespondenz nicht. v1–v6-Spielstände werden auf v7 übernommen; bestehende Kolonien, Bestände und laufende Handelsrouten bleiben erhalten. Kacheln, Gebäude und Forschungsgrafik behalten den bisherigen Stil.

Spionage, Informationsabkommen, automatische Scans, Misstrauen/Angst, Cluster-Dominanz und Täuschungskampagnen sind für spätere Patches vorgesehen.

## Planetarer Basenbau

- Die Karte verwendet die bisherigen Kacheln und Gebäudegrafiken. Erzflächen sind kühl eingefärbt und nutzen die vorhandene Steinform; Wärmequellen sind warm eingefärbt und zeigen einfache Gelände-Striche. Helle Erzkerne liefern den stärkeren Bonus. Eine kleine Legende erklärt die Farben.
- Freie Flächen antippen, um Boden und Standortwirkung zu prüfen; bekannte Erzadern und Wärmequellen sind zusätzlich in den Planetendetails per Sektorkoordinate auswählbar. Erzadern geben Erzförderern und Tiefenförderanlagen +20–35 % Ertrag; Wärmequellen geben Geothermiekraftwerken +40 %. Vorkommen erschöpfen sich nicht.
- Standort-, Anlagen- und Bauinfos erscheinen standardmäßig als kompakte Karte oben; ausführliche Verwaltung öffnet sich über „Details“. Die gewählte Kachel bleibt im freien Kartenbereich, dessen Grenzen aus den tatsächlichen Fensterhöhen gemessen werden. Beim Bauen zeigt die Vorschau Standortbonus, Kosten und Ertrag inklusive Planetenfaktoren, Forschung und Regierung. Tatsächliche Produktion setzt Personal und Versorgung voraus.
- Die bisherigen Gebäudedächer, Symbole und Statuspunkte bleiben erhalten. Fundament, Rohbau und Endausbau werden in den Anlagendetails ausgewiesen; fertige Anlagen verbinden sich automatisch.
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

Die erste Fassung ist ein spielbarer Grundstock. Gegner erkunden, analysieren, transportieren Waren und gründen eigene Kolonien. Frei organisierte gegnerische Kampfverbände und umfassende zwischenstaatliche Kriegsplanung bleiben ein weiterer Entwicklungsschritt.
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
7. Für Angriffe Krieg erklären; Korvetten und Landungsschiffe gemeinsam schicken. Das Planetendossier zeigt nur tatsächlich bekannte Informationen; Gefechtsbeobachtungen können Hinweise auf die Verteidigung liefern.

Gebäude antippen, um Betrieb oder Abbau zu verwalten. Zwei Finger zoomen, ein Finger verschiebt die Karte.
Alle wichtigen Verwaltungsaktionen liegen im unteren Bildschirmbereich. Das Detailfenster lässt sich über den Griff vergrößern.

## Entwicklung

Node 22 oder neuer. Die Grafikbibliothek und der Bundler sind im Lockfile festgelegt.

```sh
npm ci
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
