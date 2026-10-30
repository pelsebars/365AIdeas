# Backlog — 365AIIdeer

Dette er den autoritative backlog. Tilføj idéer manuelt eller bed en chat om det.
Fælles bygge-, integrations- og udgivelsesregler står i [build.md](build.md).
De oprindelige 36 AI-genererede forslag er fjernet efter brugerens ønske. Nye idéer og statusændringer skrives kun her; de slettede forslag kan genfindes i Git-historikken.

## Sådan bruges filen

- Bevar A som den oprindelige idé; adskil menneskets ord fra AI-forslag.
- Status er `kladde`, `klar`, `i gang`, `implementeret`, `udgivet` eller `blokeret`.
- `Kø: historik` undtager ældre implementerede apps fra automatisk deployment. Nye entries er som standard aktive.
- Kun `klar` må vælges automatisk til en ny bygning. Rækkefølgen i filen er prioriteten.
- `implementeret` betyder bygget og kontrolleret; `udgivet` kræver verificeret offentlig deployment.
- Datoer bruger YYYY-MM-DD i Europe/Copenhagen. Brug `—` for ukendt/ikke udført.
- Bevar afsluttede entries som historik. ID ændres aldrig; det er ikke et dagnummer.
- C må være “Ikke genereret endnu”. Byggekørslen udbygger A til en konkret konceptprompt og gemmer den her før implementering. C indeholder kun appens koncept; build.md leverer fælles regler.
- Ved senere ændring af A på en klar idé: sæt den til kladde og markér C til opdatering.

## Skabelon til en ny idé

Kopiér denne blok til det ønskede sted i køen, og giv den et unikt ID.

```markdown
## IDE-XXX — Titel

### A · Grundlæggende idé
Ophav: menneske

Skriv din idé her.

### B · Status
- Status: kladde
- Tilføjet: YYYY-MM-DD
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: —

### C · Fuld konceptprompt
Ikke genereret endnu.
```

## Idékø og historik

## IDE-001 — Solsystemet, formørkelser og månefaser

### A · Grundlæggende idé
Ophav: menneske

En 3D model af sol-systemet. Man skal kunne se planeterne drøne rundt som de rigtigt er positioneret på en given dato (kan vi det)? Man skal også kunne se hvordan solformørkelse og månens faser virker

### B · Status
- Status: kladde
- Tilføjet: 2026-10-22
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Kun idé indtil videre, jf. backlogchatten. Forklarende grafik prioriteres. Afklar præcision og datagrundlag i C; ingen automatisk byggestart før status klar.

### C · Fuld konceptprompt
Ikke genereret endnu.

## IDE-002 — På kanten af kaos — Feigenbaum

### A · Grundlæggende idé
Ophav: menneske

jeg elsker computer grafik - hvad er fraktal træet? Feigenbaum? Kan vi lave en feigenbaum renderer hvor der også er en forklaring på hvad det er vi ser på, altså vækst-rater? Og måske mulighed for at zoome?

### B · Status
- Status: implementeret
- Kø: historik
- Tilføjet: 2026-10-22
- Startet: —
- Implementeret: 2026-10-22
- Udgivet: —
- App: [Åbn app](apps/paa-kanten-af-kaos/index.html)
- Deployment: —
- Noter: Implementering og afprøvningsdato dokumenteret i README. Offentlig deployment er ikke efterprøvet ved denne migrering.

### C · Fuld konceptprompt
Byg en interaktiv Feigenbaum-renderer med titlen “På kanten af kaos”.

Formålet er at skabe en visuelt fascinerende oplevelse, hvor man kan zoome ind i et bifurkationsdiagram og forstå, hvordan en enkel vækstmodel kan skabe stabilitet, gentagelser og kaos.

Matematisk grundlag:
Brug den logistiske afbildning:
x[n+1] = r · x[n] · (1 − x[n])

x er en normaliseret bestand mellem 0 og 1, og r er en vækstparameter. Forklar, at dette er en forenklet model, og at r ikke direkte er en vækstprocent.

Hovedvisualisering:
- Vandret akse viser r; lodret akse viser x.
- Start med r fra 2,5 til 4 og x fra 0 til 1.
- For hver værdi af r beregnes en serie iterationer. Kassér først en indkøringsperiode, og tegn derefter de efterfølgende værdier.
- Diagrammet skal beregnes fra modellen, ikke være et statisk billede.
- Brug mørk baggrund, fine lysende punkter, læsbare akser og et roligt kontrolpanel. Grafikken skal være oplevelsens centrum.

Zoom og navigation:
- Man skal kunne markere et område for at zoome.
- Understøt også scroll/pinch eller tydelige zoomknapper og navigation på touchskærme.
- Tilføj “Tilbage” og “Nulstil udsnit”.
- Genberegn detaljer for det synlige område ved zoom; forstør ikke blot et eksisterende billede.
- Vis de aktuelle akseintervaller, og forklar begrænsninger ved meget dyb zoom.

Undersøg én vækstrate:
- Klik på diagrammet for at vælge r, og markér den med en lodret linje.
- Vis en tilknyttet tidsserie for x, så man kan se udviklingen iteration for iteration.
- Tilføj en præcis kontrol til valg af r og mulighed for at ændre startværdien x₀.
- Vis gerne to forløb med næsten ens startværdier, så følsomhed over for begyndelsesbetingelser kan undersøges.
- Skeln tydeligt mellem tidsseriens indkøringsperiode og de værdier, der tegnes i bifurkationsdiagrammet.

Forklaring:
Forklar i korte, letforståelige tekster:
1. Hvorfor én vækstrate kan give ét stabilt niveau.
2. Hvordan periodedobling giver 2, 4, 8 osv. tilbagevendende værdier.
3. Hvad kaotisk adfærd betyder, og hvorfor deterministisk ikke altid betyder let at forudsige.
4. Hvordan regelmæssige vinduer kan findes inde i kaos.
5. Hvad Feigenbaums konstant δ ≈ 4,669 betyder: forholdet mellem successive afstande i r mellem periodedoblinger nærmer sig denne værdi.

Tilføj guidede stop med passende udsnit og forklaringer:
- Stabilitet, eksempelvis r = 2,8.
- Periode 2, eksempelvis r = 3,2.
- Periode 4, eksempelvis r = 3,5.
- Ophobningen af periodedoblinger omkring r ≈ 3,56995.
- Et vindue med periode 3 omkring r = 3,83.
- Kaotisk adfærd, eksempelvis r = 3,9.

Kvalitet:
- Hold navigation og kontroller responsive under beregning, eksempelvis med en Web Worker eller beregning i mindre portioner.
- Afbryd forældede beregninger, når brugeren ændrer udsnittet.
- Tilpas opløsning og antal iterationer til udsnittet og enhedens kapacitet.
- Forklar, at endeligt antal iterationer og numerisk præcision påvirker billedet.
- Undgå at kalde et forløb kaotisk alene ud fra antallet af forskellige beregnede værdier.
- Verificér de matematiske forklaringer og de guidede eksempler mod pålidelige primærkilder, og tilføj diskrete kildelinks.

Byg en færdig oplevelse, hvor forklaringen og grafikken hjælper hinanden: Jeg skal både kunne nyde mønstret og forstå, hvad jeg ser.

## IDE-003 — Perspektivretter

### A · Grundlæggende idé
Ophav: menneske

En billed editor så jeg kan oprette perspektiv. Usecase: Jeg tager et billede af en bygning, jeg vel gerne bruge billedet som texture i blender, men perspektivet er helt skævt. Så et lille tool der kan gøre lodrette linjer "rigtig" lodrette og vandrette "rigtigt" vandrette i bitmappen

### B · Status
- Status: implementeret
- Kø: historik
- Tilføjet: 2026-10-22
- Startet: —
- Implementeret: 2026-10-23
- Udgivet: —
- App: [Åbn app](apps/perspektivretter/index.html)
- Deployment: —
- Noter: Senere præcisering: vælg billede, to lodrette og to vandrette referencelinjer, forhåndsvis og gem i opløsning tæt på originalen. Offentlig deployment er ikke efterprøvet ved denne migrering.

### C · Fuld konceptprompt
Den eksisterende fulde AI-udbyggede prompt er bevaret i [concept.txt](apps/perspektivretter/concept.txt).

## IDE-004 — GPS og tiden

### A · Grundlæggende idé
Ophav: menneske

Igrundig, pædagogisk grafisk forklaring af hvorfor gps satellitters ur går anderledes end et ur på jordoverfladen. En interaktiv præsentation, måske over flere sider man kan bladre igennem

### B · Status
- Status: implementeret
- Kø: historik
- Tilføjet: —
- Startet: —
- Implementeret: 2026-10-24
- Udgivet: —
- App: [Åbn app](apps/gps-og-tiden/index.html)
- Deployment: —
- Noter: Oprindelig idé kopieret ordret fra original-prompt.txt. Implementeringsdato fra README; offentlig deployment ikke efterprøvet ved migrering.

### C · Fuld konceptprompt
Den eksisterende fulde AI-udbyggede prompt er bevaret i [concept.txt](apps/gps-og-tiden/concept.txt).

## IDE-005 — Space Invaders

### A · Grundlæggende idé
Ophav: eksisterende byggebrief fra hovedsiden; oprindeligt ophav ikke verificeret

Lav en HTML-version af Space Invaders. Brug canvas, pixelgrafik, piletaster og mellemrum til at skyde. Tilføj point, liv, bølger og touch-knapper. Alt skal køre lokalt uden eksterne biblioteker.

### B · Status
- Status: implementeret
- Kø: historik
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: [Åbn app](apps/space-invaders/index.html)
- Deployment: —
- Noter: Implementeringen findes i projektet. Dato og offentlig deployment er ikke verificeret ved migrering.

### C · Fuld konceptprompt
Det eksisterende byggebrief står under A.

## IDE-042 — Memento mori

### A · Grundlæggende idé
Ophav: menneske

Idé: Memento mori. Brugeren indtaster alder, køn og måske andre relevante faktorer for forventet levetid. Så renderer vi resten af de dage der er tilbage på en eller anden måde. Jeg forstiller mig måske rækker af 30 - 50 firkanter, og så ellers nedad indtil den forventede dødsdag som markeres med et krucifiks. Måske vi også farver firkanterne efter forventet død: Helt hvid = 0% død, helt sort = 100% død. Øverst en tekst som fejrer livet, noget i retning af "når vi husker døden, husker vi at leve livet".

### B · Status
- Status: udgivet
- Tilføjet: 2026-10-26
- Startet: 2026-10-26
- Implementeret: 2026-10-26
- Udgivet: 2026-10-26
- App: [Åbn app](apps/memento-mori/index.html)
- Deployment: https://365aideas.vercel.app/apps/memento-mori/
- Noter: Bygget 2026-10-26 med lokal HISB8 2024:2025 (400 kildetal, metadata og CSV bevaret). A er bevaret ordret med menneskeligt ophav; C er præciseret og gemt før implementering. Integreret som eksperiment 005 med promptvisning, tællere og selvstændig HTML-download. npm run build, npm run check, npm run test:runner (7 tests samt ny beregningstest) og npm run test:browser (14 tests) bestået. Funktionstest dækker resultatændring, rækkevalg, tegnet kors, efterfølgende dage, tastatur, nulstilling, ugyldig alder, grænsealdre og offlinefil. Generelle browserkontroller er bevaret; navigation, konsol og overløb kontrolleret. Desktop- og mobilskærmbilleder gennemset. En fundet nulstillingsfejl er rettet før sidste fulde testkørsel. Begrænsninger: alder 0–90, lineær interpolation, kurve kun til alder 99, periodestatistik uden individuelle risikofaktorer eller fremtidig prognose. Mobil er Chromium-viewport, ikke fysisk telefon. AI-byggetrinnet foretog ingen commit, push, deployment eller social publicering. Den efterfølgende cloud-runner publicerede commit bc350f2 og bekræftede Vercel og offentlig app i Actions-kørsel 40300853240; status udgivet blev gemt i 3dc0e5c. Alle 400 snapshotværdier er efterfølgende genkontrolleret mod Danmarks Statistiks API, og den offentlige app er browserafprøvet.

### C · Fuld konceptprompt
Byg “Memento mori”: en smuk og livsbekræftende visualisering af de dage, man statistisk kan have tilbage. Øverst står “Når vi husker døden, husker vi at leve livet”. Bevar menneskets idé under A ordret og vis det tydelige ophav under opslaget på forsiden.

Brug alder (hele år) og et valg af kønskategori fra det statistiske datagrundlag. Forklar kort hvad kategorierne betyder; det er befolkningsstatistik. Brug danske officielle levetidstavler fra Danmarks Statistik, eksempelvis HISB8: https://www.statbank.dk/HISB8 og https://api.statbank.dk/. Verificér tilgængelig periode, variabelkoder, enheder og metode mod primærkilden. Gem et lille dokumenteret datasnapshot lokalt i appen, så den virker uden live-API. Angiv periode, kilde og hentningsdato. Find både betinget restlevetid og en betinget overlevelseskurve for den indtastede alder; træk ikke blot alder fra middellevetiden ved fødsel. Tilføj ikke livsstilsfaktorer eller personlige risikokorrektioner uden et ordentligt dokumenteret beregningsgrundlag. Hvis datagrundlaget ikke kan etableres, dokumentér hindringen frem for at opfinde tal.

Tegn én firkant pr. fremtidig dag med en justerbar række på 30–50 firkanter (fx 40 som standard). Vis dage og år frem til en statistisk forventningsdato med et tydeligt kors/krucifiks ved markøren. Kald den “statistisk forventningsdato”, ikke en forudsagt personlig dødsdag. Gør det let at se, at forventningen ikke er en sikker grænse: vis valgfrit dagene efter markøren og en overlevelseskurve/forklarende graf med et meningsfuldt interval. Sørg for at lange visninger er effektive og forståelige på både mobil og desktop, eksempelvis Canvas med en tilgængelig tekstlig opsummering og oplysninger ved klik/tastatur.

Lad farven repræsentere den kumulative sandsynlighed for at være død inden den pågældende fremtidige dag, betinget på at man lever ved startalderen: hvid svarer til 0%, sort til 100%. Tilføj en tydelig forklaring og skala. Tving ikke farven til sort på gennemsnitsdatoen: den er ikke 100% sandsynlighed. Interpolér årsdata på en forklaret måde, og angiv begrænsningerne ved alder i hele år og en endelig levetidstabel. Påstå ikke 100% på en sidste observationsalder, hvis data ikke understøtter det. Vis ingen unødigt præcis individuel risikoprocent.

Giv oplevelsen ro, varme og plads til eftertanke. Brug typografi, forklarende grafik og kontrast, der gør den behagelig at udforske. Alle brugeroplysninger behandles lokalt; ingen upload, konti eller tracking. Brug inputvalidering med et dokumenteret aldersinterval, nulstilling og tydelige fejlbeskeder. Fejr livet frem for at skabe en alarm eller nedtælling med sekunder.

Afprøv beregningerne mod kildedata: restlevetid ved flere aldre, betingning, enheder, monotoni og sandsynligheder i [0,1]. Afprøv grænsealdre, ugyldigt input, farveskalaens betydning og datoer over årsskifte/skudår. Tilføj en funktionel Playwright-test i tests/browser/memento-mori.spec.mjs, som indtaster alder og kategori, genererer resultatet og kontrollerer ændringen ved et nyt input, rækkevalg, nulstilling og forventningsmarkør. Brug den eksisterende downloadproces og få standalone-udgaven til at virke med det indlejrede datasnapshot. Følg build.md for integration, tællere, promptvisning og kontroller. Ingen LinkedIn- eller anden automatisk social publicering.


Implementeringspræcisering (AI, 2026-10-26): Brug HISB8, periode 2024:2025, TAVLE 1 (overlevende pr. 100.000) og 3 (restlevetid i år). Tillad startalder 0–90 år, så der er et meningsfuldt synligt interval frem til tabellens sidste alder, 99. Beting overlevelse med l(x+t)/l(x), interpolér l lineært mellem hele aldre, og vis aldrig sandsynligheder ud over alder 99. Omregn restlevetid med 365,2425 dage pr. år og afrund til hele dage fra lokal dagsdato. Tegn et scrollbart dagtæppe i Canvas, en kurve med navngivne akser, en tastaturbetjent dagvælger og et hop til korset. Nulstil til 40 år, mænd og 40 firkanter pr. række.

## IDE-043 — Myresimulator: fra tilfældig søgen til fælles spor

### A · Grundlæggende idé
Ophav: menneske

En myre simulator. Skærmen viser et sted i øvre venstre hjørne hvor myrene kommer ud af tuen. De bruger random work for at finde en kage i nederste højre hjørne. Når de har fundet kagen bringer de en kagebid tilbage til tuen, og sætter undervejs et feromon spor som andre myrer (og dem selv) kan følge til kagen. Feromon-sporet styrkes når flere myrer følger sporet med kage, og afkøles over tid hvis det ikke gen-forstærkes. Feromon styrken vises på baggrunden som farve intensitet.
Når en kage er spist, dukker en ny kage op et andet sted på skærmen.
Brugeren kan lave og fjerne  forhindringer med en mouse-pointer.

### B · Status
- Status: udgivet
- Tilføjet: 2026-10-26
- Startet: 2026-10-27
- Implementeret: 2026-10-27
- Udgivet: 2026-10-27
- App: [Åbn app](apps/myresimulator/index.html)
- Deployment: https://365aideas.vercel.app/apps/myresimulator/
- Noter: Tilføjet til den daglige byggekø. “random work” fortolkes som random walk (tilfældig vandring). Bygget 27. oktober 2026 ved genoptagelse; ingen eksisterende appfiler fandtes. C præciseret og gemt før implementering; A bevaret ordret med menneskeligt ophav. Implementeret med 220 myrer, lokale retningsspor, vægge, touch/tastatur, pause, tempo, nulstilling, madregnskab og offline-HTML. npm run build, npm run check, npm run test:runner (10 runner-tests og beregningskontroller) og npm run test:browser (20 tests) bestod. Efter tilføjet direkte mobil-touchkontrol bestod alle fire app-specifikke browsertests igen. Kontroller omfatter lokal madoptagelse, levering uden dobbeltoptælling, spor/fordampning, pause, vægge, gyldig ny kage, reproducerbart standardforløb, resize, navigation og selvstændig fil uden netværk. Ingen observerede JS-fejl eller vandret overløb i de generelle browserkontroller; desktopbillede gennemset. Begrænsninger: gittermodel med fælles afstandsbaseret hjemnavigation og flytning af overmalede myrer, ikke præcis biologi; mobil testet i Chromium-emulering, ikke på fysisk telefon. Space Invaders-download regenereret automatisk pga. fælles CSS. Ingen nye afhængigheder, infrastrukturændringer, commit, push, deployment eller social publicering.

### C · Fuld konceptprompt
Byg en interaktiv myresimulator, hvor en synlig myretue i øverste venstre hjørne og en kage i nederste højre hjørne bliver forbundet af myrernes selvorganiserede feromonspor. Bevar brugerens oprindelige idé under A ordret. Brug dansk og følg build.md for integration, HTML-download, tests og publicering.

Simulér individuelle myrer med mindst to tydelige tilstande: søgende uden mad og hjemvendende med en synlig kagebid. Søgende myrer foretager random walk med en vis retningsvedholdenhed. De opdager kun mad inden for en lokal sanseradius; ingen skjult global kageposition må styre deres søgen. Tune antal myrer, bevægelse og fødestørrelse, så man normalt ser opdagelse og etablering af spor inden for en overskuelig tid i standardscenariet. Bevar et element af tilfældig udforskning, også når et spor findes.

Ved kontakt med kagen reserverer myren én portion, som trækkes fra kagens beholdning, og bringer den fysisk tilbage til tuen. Hjemnavigation må bruge en forklarlig model, eksempelvis hukommelse om egen rute eller orientering mod tuen med forhindringshåndtering. Myren lægger og forstærker madferomon langs sin returrute, mens den bærer en kagebid. Søgende myrer kan derefter følge lokale spor mod maden. Vælg en model, der giver retning mod fødekilden i stedet for blot at fastholde myrer på den stærkeste plet ved tuen; fx lokale retningsspor kombineret med intensitet. Forklar forenklingen kort. Forstærkning skal komme fra hjemvendende myrer med mad, og alle myrer skal kollidere med forhindringer.

Feromonet lagres i et separat felt og aftager over simulationstid uden genforstærkning. Vis det direkte på baggrunden som farveintensitet med en tydelig skala: lyst/svagt til intenst/stærkt. Flere hjemvendende myrer skal give et tydeligere spor. Sørg for begrænsede, stabile værdier og frame-rate-uafhængig fordampning. Når kagen er tømt, opstår en ny kage et tilfældigt, egnet sted; behold det gamle spor, så man kan se det aftage, og myrerne finde en ny rute. Fødeplacering skal være uden for tuen og forhindringer og tilgængelig fra tuen på placeringstidspunktet. Hvis brugeren senere afskærer ruten, må det gerne påvirke kolonien synligt. Vis separate tællere for portioner tilbage, mad leveret til tuen og eventuelt mad båret undervejs.

Brugeren kan male forhindringer ved at trække med musemarkøren og fjerne dem med et tydeligt viskelæderværktøj. Understøt også touch via Pointer Events og tilbyder valg af penselstørrelse. Markér det aktive værktøj, og forklar betjeningen. Beskyt tuen og den aktuelle kage mod overmaling. Håndtér myrer, som bliver ramt af nye forhindringer, og gamle ruteminder, som bliver blokeret: ingen vægpassage, fastlåsning i en væg eller uendelig beregning. Brugeren skal kunne bryde et eksisterende spor og se lokal omvejssøgning. Tilføj pause/fortsæt, nulstilling og fjern alle forhindringer. Pause skal også sætte fordampning og fødehåndtering på pause; nye browserfaner må ikke give et voldsomt tidsryk ved genoptagelse.

Lav en gennemarbejdet Canvas-oplevelse med let genkendelige myrer, tue, kage, forhindringer og farvede spor. Sørg for god kontrast mellem objekter og feromon. Giv korte pædagogiske forklaringer på tilfældig søgen, positiv feedback og fordampning. Vis at dette er en forenklet model, ikke en præcis biologisk simulering. Brug et fast logisk koordinatsystem og skalér billedet responsivt uden at nulstille verden ved resize. Hold mobiloplevelsen flydende med et fornuftigt antal myrer og et passende feltgitter; ingen backend, eksterne biblioteker eller netværkskrav. Tilføj en tilgængelig tekststatus samt tastaturbetjening til almindelige kontroller.

Adskil simulationens regler fra rendering, så man kan afprøve en seedet tilfældighedsgenerator og kontrollerede scenarier. Tilføj meningsfulde beregningstests af lokal madopdagelse, optagelse/levering, ingen dobbeltoptælling, forstærkning fra madbærende myrer, aftagende spor uden genforstærkning, pause, vægkollisioner og ny gyldig kageplacering. Tilføj tests/browser/myresimulator.spec.mjs med funktionel afprøvning af pause/fortsæt, tegning/fjernelse af vægge, nulstilling og et reproducerbart forløb med opdagelse og levering. Brug fx en seedet simulation og en kontrolleret testopsætning til lange forløb; undgå flaky tests baseret på vilkårlig ventetid. Afprøv også selvstændig HTML-download, mobilkoordinater og resize. Gem slug som myresimulator, så test og appmappe passer sammen.


Implementeringspræcisering (AI, 2026-10-27): Brug et fast 64 × 40-gitter og 220 myrer. Søgende bruger vedholdende tilfældig vandring og lokale retningsspor; kun kontakt med kagens felt giver mad. Hjemvendende følger afstande til tuen i frie nabofelter (en forenklet fælles orienteringsevne, ikke biologisk rutelæring) og afsætter et udadrettet spor. Fire naboretninger forhindrer passage gennem væghjørner. Utilgængelige myrer udforsker lokalt, og overmalede myrer flyttes til nærmeste frie felt. Test seedede lange forløb samt små kontrollerede scenarier. Forklar modellen og dens grænser i appen.

## IDE-045 — Stæreflok: bølger af fælles bevægelse

### A · Grundlæggende idé
Ophav: menneske

En stære-floks-simulator. Hver stær er en prik på skærmen der som følger den logik der guider en stære-flok. Undersøg det gerne selv, jeg kunne forestille mig at en stær som udgangspunkt følger de fugle der er omkring den, og det gør at flokken som udgangspunkt flyver samlet. En gang imellem vælger en fugl dog at skifte retning, og det giver en bølge effekt gennem flokken. Som sagt, undersøg gerne om der er kilder der beskriver denne opførsel bedre.
Den animerede bevægelse skal ligne en rigtig fugleflok og derfor bevæge sig "flydende" på skærmen, ikke bare lodret eller vandret. Derfor er en fugls bevægelse sikkert en vektor i rummet, og der projiceres ind på den 2-dimensionelle skærm

### B · Status
- Status: udgivet
- Tilføjet: 2026-10-27
- Startet: 2026-10-28
- Implementeret: 2026-10-28
- Udgivet: 2026-10-28
- App: [Åbn app](apps/staereflok/index.html)
- Deployment: https://365aideas.vercel.app/apps/staereflok/
- Noter: Implementeret 28. oktober 2026. A bevaret ordret med menneskeligt ophav; C udbygget og gemt før implementering. Primærkilderne Ballerini (2008) og Attanasi (2014) gennemgået. 3D-model med syv lokale naboer, inerti, enkeltfugleimpuls, nabovisning, pause, kontroller og offline-HTML; integreret på forsiden som eksperiment 007. npm run build, npm run check, npm run test:runner (10 runner-tests samt beregningschecks) og npm run test:browser (26 bestået, desktop og mobil) er kørt efter sidste kodeændring. Beregningscheck dækker lokal kædereaktion, 60 sekunders stabilitet, fart/acceleration, 3D, seed, pause og projektion. Browsertest afprøver faktisk animationsfremdrift, drej, kontroller, resize, nulstilling og offline med blokeret netværk; generelle browserkontroller bevaret. Skærmbilleder gennemset ved flere simulationstidspunkter og mobilviewport; ingen observerede JS-fejl eller vandret overløb. Begrænsninger: headless Chromium og emuleret mobil, ingen fysisk telefon eller fuld visuel vurdering af en afspillet animation. Reaktionen kan være diffus; farven er retningsændring, ikke kausalitetsbevis eller præcis biologisk bølgefysik. Mobilprojektion giver ekstra plads til randdrej. Eksisterende Space Invaders-download er automatisk regenereret pga. fælles CSS. Ingen commit, push eller deployment udført.

### C · Fuld konceptprompt
Byg en stæreflok-simulator med slug staereflok. Hver fugl tegnes som en lille prik, men bevæger sig i et reelt tredimensionelt simulationsrum med position (x,y,z) og hastighedsvektor (vx,vy,vz), som projiceres til skærmen. Målet er en samlet, organisk flok med flydende bevægelse, formændringer og retningsskift, der forplanter sig lokalt. Følg build.md for integration og afprøvning. Bevar A ordret og adskil brugerens idé fra denne AI-udbyggede prompt.

Forskningsgrundlag og tydelig afgrænsning:
- Ballerini m.fl. (2008), “Interaction ruling animal collective behavior depends on topological rather than metric distance: Evidence from a field study”, PNAS, DOI 10.1073/pnas.0711437105: https://pubmed.ncbi.nlm.nih.gov/18227508/ og https://pmc.ncbi.nlm.nih.gov/articles/PMC2234121/ . Undersøgelsen af rekonstruerede 3D-flokke peger på samspil med omkring seks til syv nærmeste naboer frem for alle fugle inden for én fast radius. Brug syv som forklarligt standardvalg, ikke som en universel naturkonstant.
- Attanasi m.fl. (2014), “Information transfer and behavioural inertia in starling flocks”, Nature Physics, DOI 10.1038/nphys3035: https://www.nature.com/articles/nphys3035 og https://pubmed.ncbi.nlm.nih.gov/25264452/ . Studiet beskriver hurtig udbredelse af drejeretning med begrænset dæmpning og en teori med drejeinerti. Det betyder ikke, at et tilfældigt valg hos én fugl er dokumenteret som den universelle årsag til alle flokdrej.

Læs primærkilderne og forklar på dansk forskellen mellem observeret adfærd, forskernes model og appens pædagogiske forenklinger. Vis diskrete kildelinks. Vi ønsker en model inspireret af forskningen; påstå ikke at en almindelig alignment/separation/cohesion-model alene reproducerer studiets bølgefysik præcist.

Model:
- Lad hver fugl orientere sig efter sine syv nærmeste naboer i 3D, bevare passende afstand ved kort rækkevidde og søge svagt mod nabogruppen. Brug en fysisk afstand til kollisionsundgåelse, mens nabovalget til retningsfølgning er topologisk. Undgå at én central leder eller global flokretning dikterer alle fugles drej.
- Brug kontinuerte vektorer, begrænset acceleration og drejehastighed samt en glat dynamik for drejning (fx vinkelhastighed med inerti og dæmpning). Bevægelsen må ikke være et gitter med fire eller otte retninger. Undgå øjeblikkelige U-vendinger og ny, uafhængig støj i hver renderframe.
- Indfør af og til en kortvarig, lokal drejepåvirkning på én fugl eller en lille nabogruppe. Påvirkningen er appens valgte forsøgsmodel, ikke en påstand om at alle virkelige drej opstår sådan. Lad den spredes via nabosamspil over simulationstid; anvend ikke samme drejeimpuls direkte på alle fugle. Tilbyd også knappen “Start et retningsskift”, så brugeren ikke skal vente på et tilfældigt event.
- Efterstræb at man kan se en forsinket bølge af ændret retning gennem flokken, mens den overvejende holder sammen. Tilpas parametre og afprøv forløbet visuelt. En let dæmpet demonstration er acceptabel; hvis modellen blot giver langsom diffus tilpasning, skal det forklares frem for at kaldes en tro kopi af den målte bølge.
- Afgræns simulationsområdet med en svag, glat randstyring, så flokken kan dreje naturligt og blive i området. Forklar dette som en visuel afgrænsning, ikke en biologisk regel. Ingen usynlig teleportering ved kanten eller hårde refleksioner. Undgå kunstige evige cirkler om en fast central attraktør.

Visualisering og oplevelse:
- Lad selve den animerede flok dominere. Brug en rolig himmelbaggrund og fine, kontrastfulde prikker. Vis dybde diskret via punktstørrelse/intensitet og perspektiv, uden at fugle forsvinder ved kameraets nærplan. Kameraet må gerne bevæge sig langsomt; tilbyd et fast kamera, så man kan skelne kamerabevægelse fra flokkens drej.
- Tilføj et pædagogisk lag, der kan markere en valgt fugl og dens nærmeste naboer, vise hastighedsvektorer og eventuelt farve fuglene midlertidigt efter deres lokale reaktion på et drej. Illustrationen skal hjælpe med at se udbredelsen, ikke være en kunstigt tidsstyret farvebølge, som udgiver sig for at være selve dynamikken.
- Giv en kort forklaring af nabofølgning, afstand, drej og 3D-projektion. Brug pause/fortsæt, nulstilling, “Start et retningsskift” og et lille antal forståelige kontroller (fx antal fugle, nabofølgning og drejeinerti). Alle normale kontroller skal kunne bruges med tastatur og touch. Tilføj en tekstlig status og respekter reduceret bevægelse ved at tilbyde pause frem for uundgåelig animation.
- Start med et flot, stabilt standardscenarie på nogle hundrede fugle. Brug en passende søgestruktur eller begræns antal/tilpas kvalitet for mobil. Nærmeste-nabosøgning må ikke stiltiende ændres til kun en fast radius uden forklaring. Hold en fast simulationstidsstep og en frame-rate-uafhængig rendering. Pause stopper også impulser; resize og baggrundsfaner må ikke nulstille flokken eller indhente lange tidsspring.
- Brug almindelig JavaScript og Canvas 2D med egen 3D-projektion, medmindre en anden løsning er konkret nødvendig. Ingen backend, tracking, eksterne biblioteker eller netværkskrav. Den selvstændige HTML skal fungere offline.

Afprøvning:
Adskil simuleringsmotoren fra rendering, og brug en seedet generator til tests. Test 3D-nabovalg mod kontrollerede punktopsætninger, begrænset hastighed/acceleration, bevægelse i alle tre akser, endelige koordinater over lange forløb, pause og projektionens grænsetilfælde. Undersøg i en kontrolleret nabokæde, at kun den valgte fugl/gruppe får en direkte drejeimpuls, og at fjernere fugle reagerer senere via lokal vekselvirkning; mål eller vis begrænsningerne uden at love en universel bølgehastighed. Tilføj tests/browser/staereflok.spec.mjs, der afprøver pause/fortsæt, retningsskift og lokal reaktion, nabovisning, kontroller, nulstilling, resize og standalone-udgaven. Gennemse animeret bevægelse ved desktop- og mobilviewport; et skærmbillede alene kan ikke godkende, om flokken flyver flydende.

Implementeringspræcisering (AI, 28. oktober 2026): Brug 240 fugle som standard og 80–360 som valgmuligheder. Beregn de syv nærmeste med eksakt 3D-afstand; genbrug nabografen i fire faste tidsstep af 1/60 sekund for at begrænse mobilbelastning. Integrér begrænset vinkelhastighed med dæmpning, lokal retningsfølgning, kortdistancefrastødning og svag nabosamling. En enkelt fugl påvirkes i 0,7 sekund ved manuelt eller periodisk drej. Reaktionsfarve måles som faktisk ændring af hastighedsretningen siden forsøgets start; den er ikke et kausalitetsbevis. Vis antal reagerende fugle og forløbet simulationstid. Fast kamera er standard. Reduced motion starter pauset. Ingen lagring eller eksterne runtimekald. Accept: pause fryser modellen, direkte påvirkning rammer kun én fugl, en kontrolleret nabokæde reagerer i lokal rækkefølge, nulstilling genskaber seedet start, og standalone virker uden netværk.

## IDE-046 — Motorvejslaboratoriet: fire spor, vognbaneskift og kø

### A · Grundlæggende idé
Ophav: menneske

Lad os simulere hvad der sker på en 4 sporet motorvej: Der er flere parametre:
A: Antallet af biler
B: Tendens til vognbane skift
C: Reaktions-tid og bremselængde (hvad sker der når en bil skifter vognbane)
D: Tilføj gerne selv andre relevante parametre du kan idnetificere
Jeg forestiller mig en top-down visualisering hvor man kan se måske 300 meter motorvej eller hvad der nu er passende. Bilerne kommer ind i billedet nedefra, og forsvinder ud i toppen.
Man kan måske se en graf der viser sammenhængen af reelt throughput på motorvejen som funktion af antal biler, og måske også andre parametre som man selv kan justere.

### B · Status
- Status: udgivet
- Tilføjet: 2026-10-27
- Startet: 2026-10-29
- Implementeret: 2026-10-29
- Udgivet: 2026-10-30
- App: [Åbn app](apps/motorvejslaboratoriet/index.html)
- Deployment: https://365aideas.vercel.app/apps/motorvejslaboratoriet/
- Noter: Implementeret 29. oktober 2026. A er bevaret ordret med menneskeligt ophav; C blev præciseret og gemt før implementering. Fire ensrettede baner over 500 m, forsinket IDM-inspireret model, sikre reserverede skift, indkørselskø, opbremsningsforsøg og faktisk målt flow med gemte graf-/tabelpunkter. Forside, tællere, README og selvstændig offline-HTML er integreret; build opdaterer også Space Invaders-downloadens indlejrede fælles CSS. Kontroller: npm run build og npm run check bestod; npm run test:runner bestod med alle 11 runner-tests og ekstra modelchecks, kørt som env -u GITHUB_OUTPUT npm run test:runner, fordi runnerens nedarvede GITHUB_OUTPUT peger på en skrivebeskyttet sti (første forsøg fejlede af den grund). Ingen infrastrukturændring. npm run test:browser bestod alle 32 tests i desktop- og mobilprojekterne; appens fire tests blev efter sidste visuelle justering genkørt og bestod. Modelcheck dækker reaktionsforsinket cut-in, bremseformler, sikkert/afvist/samtidigt skift, lokal opbremsning, 180 s stabilitet, bilbevarelse, upstream-kø, flow, kollisionsstop, seed/reset og framerate-uafhængighed. Desktop- og mobilgrafik gennemset; ingen observerede konsolfejl eller vandret overløb. Offlinefil beregner og gemmer resultater uden netværk. Begrænsninger: Chromium-emuleret mobil, ikke fysisk telefon; ét seed og korte målevinduer, ingen kalibreret kapacitetsprognose. Lange reaktionstider kan give synligt kollisionsstop. Ingen lastbiler, tilkørsler, vejr eller flaskehals; MOBIL-inspiration er ikke fuld MOBIL. Kilde- og hjemlinks kræver netværk. Ingen commit, push eller publicering udført.

### C · Fuld konceptprompt
Byg “Motorvejslaboratoriet” med slug motorvejslaboratoriet: en top-down, interaktiv mikrosimulation af fire vognbaner i samme kørselsretning. Biler kommer ind nedefra, bevæger sig opad og forlader strækningen øverst. Vis afstandsmarkeringer i meter og et vejstykke på cirka 300–600 meter; vælg en dokumenteret længde, som gør lokale opbremsninger og vognbaneskift lette at se. Brug faktisk positions-/hastighedsdynamik, ikke en forudbestemt køreanimation. Følg build.md for hovedside, prompts, HTML-download og tests. Bevar A ordret.

Fagligt grundlag: Undersøg IDM som model for at følge bilen foran og MOBIL som inspiration til vognbaneskift. Brug modellernes egne kilder, eksempelvis https://mtreiber.de/MicroApplet/MOBIL.html og https://mtreiber.de/publications/MOBIL.pdf . Skeln eksplicit mellem reaktionsforsinkelse og ønsket tidsafstand til bilen foran: de er forskellige størrelser, som også fremhævet i https://sumo.dlr.de/docs/Simulation/Safety.html . Standard-IDM har ikke en separat menneskelig reaktionsforsinkelse; hvis den udvides med forsinkelse, beskriv metode, stabilitetsgrænser og konsekvenser i stedet for blot at omdøbe tidsafstanden. Treiber m.fl. behandler emnet i https://mtreiber.de/publications/StabilityIFAC06.pdf . Appen er et pædagogisk model-forsøg, ikke en kalibreret prognose for en bestemt motorvej. Giv kort forklaring og primærkildelinks i appen.

Kontroller:
- Antal biler: lad brugeren vælge et initialt antal/tæthed ved nulstilling og justere trafiktilførslen løbende i biler/time. Vis separat aktuelt antal biler på selve strækningen, faktisk indslupne biler og eventuelt ventende biler før indkørslen. Biler må ikke indsættes oven i hinanden for at nå et ønsket antal.
- Tendens til vognbaneskift: styr incitament/tærskel og eventuelt hensyn til andre førere. Det er en adfærdsparameter, ikke en ordre om at skifte tilfældigt eller ignorere sikkerhedsafstanden. Vis faktisk antal vognbaneskift pr. minut.
- Reaktionstid i sekunder: reelle forsinkede observationer/beslutninger med historik eller en tydeligt forklaret tilsvarende model. Skeln fra simulationens numeriske tidsstep og ønsket tidsafstand. Et vognbaneskift foran en bil skal påvirke dens reaktion på en dokumenteret måde; håndtér korrekt skift af forankørende i historikken.
- Bremseevne i m/s², med skelnen mellem komfortbremsning og fysisk maksimal nedbremsning. Vis en beregnet reaktionsafstand v·t og en idealiseret bremselængde v²/(2b) ved en angivet hastighed, så “bremselængde” ikke bliver en konstant uafhængig af fart. Forklar modellens forenklinger.
- Relevante ekstra parametre: ønsket hastighed, variation mellem føreres ønskede hastighed, ønsket tidsafstand og eventuelt lastbilandel. Hold hovedpanelet overskueligt; læg de ekstra valg i et avanceret afsnit. Forklar enheder og virkning.

Bevægelse og sikkerhed:
Beregn acceleration ud fra lokal trafik, afstand og relativ fart. Udfør vognbaneskift glidende over en kort varighed; tjek både for- og bagvedkørende i målbanen og reservér plads under skift, så samtidige skift ikke kolliderer. Brug en klart angivet model for vognbaneregler, gerne med hold-til-højre-præference uden at hævde fuldstændig gengivelse af færdselsregler. Tilføj knappen “Kort opbremsning”, som påvirker én bil, så brugeren kan undersøge en bagudgående købølge. Animationen skal vise den fremvoksende effekt; indbyg ikke en automatisk bølge uafhængig af bilernes dynamik.

Brug et lille, fast tidsstep og dokumentér den valgte tidsintegration. Hvis store forsinkelser og utilstrækkelig afstand kan give sammenstød i modellen, skal de registreres/vises eller føre til en forståelig pause, ikke skjules ved teleportering eller uendelig bremseevne. Eventuelle sikkerhedsindgreb skal være synlige og tælles. Undgå fysisk overlap i normale standardscenarier, negative hastigheder og NaN-værdier. Håndtér åben indkørsel med sikker placering og en eventuel upstream-kø; udløbet skal være frit, medmindre en konkret flaskehals er valgt. Pause/fortsæt og nulstilling skal også styre målinger og køhistorik; baggrundsfaner indhenter ikke lange tidsspring.

Målinger og graf:
Vis målt gennemstrømning ud fra faktiske passagehændelser ved en tydeligt markeret tællelinje, normaliseret til biler/time. Vis målevinduets varighed og opvarmningsperioden; korte målinger skal ikke præsenteres som præcise kapacitetstal. Tilføj gennemsnitshastighed, tæthed i biler/km/bane og køindikator. Angiv om flow gælder alle fire baner eller én bane.

Grafen skal bygge på simulationens målinger, ikke en flot forudtegnet kapacitetskurve. Tilbyd at gemme sammenlignelige forsøg eller et kontrolleret scan af trafikbelastning, mens øvrige parametre holdes faste. Vis throughput som funktion af målt tæthed/antal biler og eventuelt en særskilt kurve mod ønsket trafiktilførsel; bland ikke de to akser. Vis variation over et målevindue eller flere seeds, og nulstil/afgræns dataserier ved parameterændringer. En åben, homogen motorvej behøver ikke give en bestemt faldende gren på flowkurven; hvis mere tilførsel blot skaber kø før indkørslen og et plateau i flow, skal graf og forklaring vise det faktiske resultat. Tving ikke et ønsket svar om vognbaneskift eller bilantal frem.

Design og teknik:
Lad vejen og de små biler dominere, med synlige bremselys og diskret markering af vognbaneskift. Gør den trafikale mekanisme let at følge. Skaler responsivt på desktop og mobil, brug dansk og tastatur-/touchvenlige kontroller. Adskil model, rendering og målinger. Brug seedet tilfældighed, Canvas og almindelig JavaScript uden backend eller eksterne runtime-afhængigheder. Den selvstændige HTML skal indeholde hele modellen og virke offline. Prioritér en robust, sammenhængende første version frem for for mange trafiksituationer.

Afprøvning:
Test reaktionens tidsforsinkelse i et kontrolleret tobilsscenarie, afstands-/bremseformlernes enheder, sikkert og afvist vognbaneskift, samtidige skift, bilbevarelse (initiale + indslupne − udløb = aktive, bortset fra eksplicit registrerede hændelser), upstream-kø, nulstilling og beregning af throughput fra kendte passageantal. Test stabile lange forløb og ens simuleret udvikling ved forskellige renderframerates. Tilføj tests/browser/motorvejslaboratoriet.spec.mjs med funktionel afprøvning af trafiktilførsel, reaktions-/bremsevalg, opbremsningsforsøg, pause, nulstilling, grafens målte data samt offlineudgaven og mobilviewport. Brug kontrollerede seeds og målepunkter frem for vilkårlige sleeps. Beskriv begrænsninger ærligt.

Implementeringspræcisering (AI, 29. oktober 2026): Første version bruger 500 meter, fire ensrettede baner, 0,05 s fast ballistisk integration og seed 46. IDM med acceleration 1,2 m/s², minimumsafstand 2 m og komfortbremsning 2 m/s²; brugeren vælger maksimal fysisk bremsning. Forsinkelse implementeres ved at gemme de øjeblikkelige observationer (egen fart, afstand og lederfart) og bruge observationen fra t−reaktionstid. Nye ledere ved indkørsel/skift kommer dermed først ind i den forsinkede observation efter reaktionstiden; historik må aldrig genfortolkes med en ny leder. Skift varer 2 s, optager begge baner og afgøres sekventielt med for-/bagafstand og accelerationstjek. Dette er MOBIL-inspireret egen implementering med gevinsttærskel og svag højrepræference, ikke fuld MOBIL. Overlap stopper forsøget med synlig kollisionsregistrering; ingen positionskorrektion. Høj forsinkelse kan være ustabil. Indkørselskø er ubegrænset som tæller, ikke som tegnede biler uden for vejen.

Målinger: tællelinjen er udløbet ved 500 m. Første 30 s er opvarmning, derefter højst 60 s rullende passagevindue. Gem sammenligningspunkt efter mindst 90 s med målt middeltæthed, samlet flow og interval mellem seks 10-sekunders passagevinduer. Parameterændring nulstiller forsøget og dets målinger; gemte forsøg bevares med parameteretiket. Tilførsel kan ændres med det samme, men starter et nyt måleforsøg for sammenlignelighed. Knap til beregning af 90 s gør forsøg reproducerbare uden ventetid i realtid. Graf og tilgængelig tabel viser kun gemte faktiske resultater. Ingen forventet kapacitetskurve tegnes. Initiale biler 0–80, tilførsel 0–10.000 biler/time, reaktion 0–2 s, maksimal bremsning 3–9 m/s²; ønsket fart, variation og tidsafstand kan justeres. Ingen lastbiler eller flaskehals i første version. Reduceret bevægelse starter pauset. Afprøv centrale modelregler numerisk samt brugerflow og offlinefil i begge browserprojekter.

## IDE-047 — Hold banen eller skift? Et trafikeksperiment

### A · Grundlæggende idé
Ophav: menneske

Måske samme grundmodel som motorvejslaboratoriet (IDE-046), men her vil vi gerne undersøge om en bil kommer hurtigst frem i tæt trafik ved at holde egen bane, eller foretage hyppige vognbaneskift hver gang det er muligt.
I denne simulering skal vi måske enten have en længere strækning (måske zoomet længere ud, og have en bane på tværs af skærmen) eller følge bilen over tid ved at "scrolle" vejen

### B · Status
- Status: klar
- Tilføjet: 2026-10-27
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Selvstændigt eksperiment, der følger efter og bygger videre på IDE-046. Brugerens idé bevaret ordret. Kørslen skal først undersøge den faktiske motorvejsmodel og undgå at kopiere eventuelle fejl eller påstå en generel vinder på forhånd. Ingen manuel byggestart ved tilføjelsen.

### C · Fuld konceptprompt
Byg “Hold banen eller skift?” med slug hold-banen-eller-skift som et interaktivt, pædagogisk eksperiment i tæt motorvejstrafik. Undersøg, om en bestemt bil vinder rejsetid ved at blive i sin bane eller ved hyppigt at benytte muligheder for at skifte. Der må ikke være en forudbestemt vinder. Følg build.md for integration, download, prompts og tests. Bevar A ordret.

Tag udgangspunkt i den implementerede model fra IDE-046, hvis den findes. Læs dens koncept, kildehenvisninger og begrænsninger samt den faktiske kode, før noget genbruges. Genbrug en ren simuleringsmotor eller en dokumenteret, selvstændig kopi; medtag nødvendige filer, så appens HTML-download kan virke alene. Ændr ikke IDE-046’s eksisterende brugeroplevelse utilsigtet. Hvis grundmodellen endnu ikke er bygget eller er uegnet, dokumentér afhængigheden og hindringen i Noter frem for at foregive, at sammenligningen er valideret.

Strategier og kontroller:
- Sammenlign to alternative politikker for den samme forsøgsbil: “Hold banen” udfører ingen frivillige skift; “Hyppige skift” vurderer sikkert mulige og fordelagtige skift ofte, med lav skiftetærskel. Definér “muligt” og “fordelagtigt” tydeligt. Undgå meningsløs højre/venstre-zigzag, og giv brugeren eventuelt mulighed for at vælge mellem ethvert sikkert skift og kun sikkert skift med forventet fremdriftsfordel. Begge politikker skal have samme fartønske, acceleration, reaktionstid, bremseevne og biltype.
- Bevar de samme sikkerheds- og fysiske regler for begge politikker. Et skift tager tid og kan få andre biler til at bremse. Tving ikke ekstra forsinkelser eller fartfordele ind alene for at styre resultatet. Første version behøver ingen lukket bane eller ramper, så et tvungent skift ikke gør “hold banen” tvetydigt.
- Lad brugeren justere trafikbelastning, baggrundstrafikkens adfærd og forsøgsbilens skiftetærskel. Vis, hvilke parametre der holdes ens. Brug tydelig kontrol af start, pause, nulstilling og gentagelse med samme seed.

Fair forsøgsdesign:
Brug som primær måling parrede, separate simulationer med én forsøgsbil i hver: samme udgangstilstand og seed, samme starttidspunkt, position og vognbane, samme målstrækning og samme eksogent planlagte baggrundstrafik. Den eneste tilsigtede forskel er forsøgsbilens strategi. Hold baggrundens tilfældighed stabil med forudplanlagte ankomst-/førerdata eller separate RNG-strømme, så et ekstra vognbaneskift ikke ændrer alle efterfølgende tilfældige input. De øvrige bilers faktiske reaktioner må gerne divergere som konsekvens af forsøgsbilens adfærd; dét er en del af effekten.

Vis gerne begge alternative verdener samtidigt med synkroniseret kamera/tid. En duel med to markerede biler i samme simulation kan tilbydes som illustration, men skal mærkes anderledes: bilerne påvirker hinanden og starter ikke nødvendigvis helt sammenligneligt. Brug den ikke som eneste evidens for, hvilken strategi der er bedst. Afprøv flere seeds og startbaner; vis, hvor mange gentagelser sammenligningen bygger på. En enkelt spektakulær overhaling er ikke et samlet resultat.

Vej og kamera:
Brug en længere, endelig strækning med en synlig start- og mållinje, eksempelvis nogle kilometer med et meningsfuldt standardvalg, så mange skift og køforløb kan nå at få effekt. Vis vejen vandret på tværs af skærmen med fire spor, og lad kameraet følge forsøgsbilen eller tilbyd et zoomet overblik. Vejmarkeringer, andre biler og mål skal bevæge sig konsistent med bilens faktiske position. Vis kørt distance, resterende distance og en minimap/progressionslinje. Kameraets bevægelse må ikke ændre fysik, vejlængde eller målinger; hverken forsøg eller trafik må nulstilles, når et objekt forlader skærmen. Undgå en kunstig rundbane, der i det skjulte giver gentagne møder med de samme biler. Håndtér udløb og tilførsel samt indkøring af tæt trafik, før forsøgsbilen starter.

Resultater:
Mål først og fremmest faktisk rejsetid fra samme start til samme mål og tidsforskel mellem strategierne. Vis også antal vognbaneskift, gennemsnitshastighed, eventuelle kraftige opbremsninger og sikkerhedsindgreb. Et tidsbegrænset forsøg uden ankomst skal markeres som ikke afsluttet; afstand efter fast tid er en særskilt måling og må ikke kaldes rejsetid. Vis en tidsserie for forsøgsbilernes reelle fremdrift/indbyrdes forskel samt en opsummering af parrede gentagelser: gennemsnit/median af tidsgevinsten, spredning og antal løb. Nulstil eller adskil resultater ved parameterændringer, og gør definitionen af positiv/negativ forskel tydelig.

Forklar, at resultatet gælder den valgte model og trafik, ikke beviser en universel regel for virkelige motorveje. Henvis til grundmodellens primærkilder og forklar åbne grænser, førervariation og sikkerhedsregler. Oplevelsen skal gøre det muligt at opdage både små fordele, ulemper og tilfældig variation uden at have valgt en konklusion på forhånd. Dette er en modelundersøgelse, ikke en opfordring til risikabel kørsel.

Teknik og afprøvning:
Brug en ren, seedet og tidsstepbaseret motor adskilt fra Canvas-rendering og kamera. Arbejd i mindre portioner eller en worker ved serier af gentagelser, så kontrollerne forbliver responsive; nye indstillinger skal kunne afbryde et gammelt scan. Ingen eksterne runtime-afhængigheder eller backend. Giv dansk forklaring og tilgængelige kontroller på desktop og mobil, og en selvstændig offline-HTML.

Test identiske strategier mod hinanden som nulreference, fælles begyndelsestilstand/ankomstplan, ingen frivillige skift i hold-banen-politikken, gyldige skift i skiftepolitikken, korrekt mållinjepassage og rejsetid, håndtering af ikke-afsluttede løb, samt at kamera, zoom og renderframerate ikke ændrer resultatet. Genbrug relevante fysik- og sikkerhedstests fra IDE-046. Tilføj tests/browser/hold-banen-eller-skift.spec.mjs, der starter et reproducerbart sammenligningsforløb, afprøver strategi-/trafikvalg, pause, nulstilling, kamerafølge/overblik, afsluttet måling og standalone-udgaven. Test ikke mod en bestemt strategis sejr; det er netop det åbne spørgsmål.

## IDE-048 — Se et neuralt netværk genkende firkanter og trekanter

### A · Grundlæggende idé
Ophav: menneske

En visualisering af et lille neuralt netværk der læser et meget simpelt billede, 10*10 pixels, sort-hvid, og afgør om billedet er en firkant eller en trekant. Brugeren kan tegne i billedet og det visualiseres hvilke neuroner der fyrer, og hvilke styrker der sendes videre til det næste lag. Grøn = positiv, Rød = negativ. Desto tykkere streg, desto større numerisk værdi. Byg selv et script til at træne netværket med, og gem alle værdier i simuleringen.
Jeg tænker 100 input neuroner der repræsenterer selve billedet, et skjult lag med måske 8 (?) neuroner, og 3 output neuroner for firkant, trekant og "ved ikke".
Forklar gerne oven over visualiseringen af netværket en tekst, med en illustration hvordan en simuleret neuron virker, og hvordan de, når de sættes sammen, kan bruges til mønster-genkendelse som f.eks. i LLM'er

### B · Status
- Status: klar
- Tilføjet: 2026-10-28
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Brugerens idé er bevaret ordret. Klar til den daglige kø efter IDE-047. AI-præcisering: vis faktisk trænet inferens, ikke håndkodet formgenkendelse; skeln mellem vægte, aktiveringer og bidrag. Ingen manuel byggestart ved tilføjelsen.

### C · Fuld konceptprompt
Byg “Se netværket tænke” med slug se-netvaerket-taenke: en interaktiv, pædagogisk visualisering af et rigtigt, lille trænet neuralt netværk, som klassificerer brugerens sort-hvide tegning på 10 × 10 pixels som firkant, trekant eller “ved ikke”. Følg build.md for integration, promptvisning, selvstændig HTML og kontroller. Bevar A ordret og angiv det faktiske ophav.

Tegning og netværk:
- Giv brugeren en stor, tydelig 10 × 10-tegneflade med binære pixels. Mus og touch skal male sammenhængende streger ved træk. Tilføj viskelæder, ryd, nogle eksempelbilleder og mulighed for udfyldte figurer/konturer, hvis træningsgrundlaget dækker begge. Angiv tydeligt, hvilke variationer modellen er trænet på.
- Brug som standard 100 inputneuroner, ét skjult lag med 8 neuroner og 3 outputneuroner. Input er et dokumenteret rækkefølge-fladet billede med værdier 0/1. Brug en egnet skjult aktiveringsfunktion (fx tanh) og softmax til de tre klasser. Hold modellen lille og gennemskuelig; ændr ikke stiltiende arkitektur for at få flotte resultater. Hvis 8 skjulte enheder giver klare begrænsninger, vis og dokumentér dem. Ingen backend og ingen API-kald til billedgenkendelse.
- Implementér faktisk matrix-/vektorberegning med de gemte trænede parametre. Resultatet skal komme fra netværket, ikke en håndkodet geometrisk klassifikator med en dekorativ netværksanimation ovenpå. Opdatér ved hvert ændret pixel, og tilbyd eventuelt “Gå ét lag frem” til forklaring.

Træning og reproducerbarhed:
Byg et selvstændigt træningsscript i appens mappe, fx train.mjs eller train.py, uden nye tredjepartsafhængigheder. Scriptet skal generere mærkede syntetiske træningseksempler, udføre gradientbaseret træning og eksportere alle vægte, bias, arkitektur, klasse-/pixelrækkefølge og nødvendig normalisering til browserlæselige filer. Træn ved bygning, ikke hver gang en besøgende åbner siden. Gem seed, hyperparametre, træningskommando, datagenereringsregler og målte resultater i appens dokumentation eller metadata. Netværk og data skal kunne genskabes med den dokumenterede kommando.

Træningsdata skal omfatte passende variation i placering, størrelse og orientering samt konturer/udfyldning, hvis begge understøttes. Afklar “firkant” som en geometrisk kvadratisk figur og forklar, at rotation kan få den til at ligne en rombe. Pixelgitteret giver uundgåeligt grove approximationer. Tilføj separate negative eksempler mærket “ved ikke”, fx tomme billeder, støj, linjer, cirkellignende former, delvise og tvetydige figurer. Fjern eller ommærk sammenfaldende rasterbilleder med modstridende labels. Lad ikke en enkelt pixel-count eller fast position blive en utilsigtet genvej for labels; afbalancér variationerne efter behov.

Brug et separat holdout-sæt med anden seed/eksempler, som ikke bruges til træning eller valg af den endelige rapport. Kontrollér datalæk og dubletter, og rapportér samlet og pr. klasse-resultat på holdout-sættet. Lov ikke perfekt genkendelse af vilkårlige tegninger. “Ved ikke” er her en trænet restklasse med begrænset dækning; den gør ikke netværket til en sikker detektor af alt ukendt. Hvis der desuden bruges en tærskel for at afvise lav sikkerhed, så vis den som en separat regel, som kan forklare forskellen på vindende output og den endelige brugerbesked. Softmax-score er modelscore og ikke automatisk en kalibreret sandsynlighed.

Visualisering af de faktiske tal:
Vis alle 100 inputneuroner med entydig forbindelse til de 100 pixels, de 8 skjulte neuroner og de 3 navngivne outputneuroner. Inputneuronerne kan stå i en 10 × 10-matrix, så diagrammet ikke bliver flere tusinde pixels højt. De skjulte neuroners aktuelle aktiveringer og outputklassernes scores skal kunne aflæses, også som tekst. Fortæl at “fyrer” her betyder en numerisk aktivering, ikke en biologisk spike.

Skeln tydeligt mellem:
1. En indlært vægt w, som normalt er fast under brug.
2. En neurons aktuelle aktivering a, som ændres med tegningen.
3. Et aktuelt bidrag w·a, som sendes til næste neurons vægtede sum.

Lad standardvisningen farve forbindelser efter bidragets fortegn: grøn for positivt, rød for negativt, neutral/usynlig for nul. Stregtykkelse angiver absolut størrelse, ikke en større negativ værdi som “mindre vigtig”. Brug en forklaret, stabil skala, så hele netværket ikke skifter visuel betydning efter hver tegning. Tilbyd eventuelt skift mellem “Indlærte vægte” og “Aktuelle bidrag”, med tydeligt forskellig signatur. Undgå at vise alle streger grønne blot fordi input/output er positive.

Ved valg/hover/fokus på en neuron skal brugeren kunne se dens bias, vægtede sum før aktivering, aktiveringsfunktion og resultat. Fremhæv de vigtigste indgående bidrag med konkrete tal og vis, at bias lægges til; skjul ikke bias eller kald den en ekstra billedpixel. Ved valg af en forbindelse vises w, kildens a og w·a. Brug Canvas/SVG og filtrering/fremhævning til at gøre de 824 forbindelser forståelige uden at opfinde forbindelser eller skjule hele inputlaget. En valgfri signalanimation skal følge den aktuelle forward pass og må ikke ændre tallene. Respekter reduceret bevægelse og understøt tastaturvalg af neuroner/pixels samt touch uden hoverkrav.

Forklaring oven over netværket:
Skriv en kort, trinvis tekst med en illustration af én simuleret neuron: flere input → vægtning → sum plus bias → aktiveringsfunktion → output. Lad gerne brugeren justere et lille særskilt eksempel og se regnestykket. Forklar derefter, hvordan træning ændrer vægte og bias ud fra eksempler og fejl, mens tegning efter træningen normalt kun ændrer aktiveringer. Beskriv skjulte neuroner som indlærte numeriske mønstre; påstå ikke uden undersøgelse, at neuron 3 altid genkender en bestemt kant.

Knyt idéen til LLM'er på et præcist begynderniveau: mange lærte vægte og sammenkoblede beregninger kan lære mønstre, men dette lille feedforward-billednetværk er ikke en miniature-LLM. LLM'er behandler tokens og bruger typisk transformerarkitektur med attention og mange lag; de klassificerer ikke blot 10 × 10-billeder i tre kategorier. Brug verificerede primærkilder/oprindelig dokumentation til forklaringerne og giv få diskrete kildelinks. Hold hovedteksten let at forstå, med tekniske detaljer i et fold-ud-afsnit.

Design og afprøvning:
Gør tegneflade, aktuelt resultat og netværk til en samlet oplevelse på desktop og mobil. Brug dansk, læselige tal og en signatur, der også forklarer positiv/negativ med tekst eller symboler, så farven ikke står alene. Brug egne almindelige HTML/CSS/JavaScript-filer uden eksterne runtime-afhængigheder. Alle parametre og metadata skal være gemt med appen og med i HTML-downloaden.

Afprøv træningsscript, eksport/import og forward pass mod håndberegnede små eksempler; numerisk stabil softmax; netværkets præcise dimensioner; binær inputmapping; nulinput/bias; fortegn og størrelser for vægte og bidrag; sammenhæng mellem viste tal og klassifikationsresultat; samt holdout-resultater og håndtering af negative/tvetydige tegninger. Tilføj tests/browser/se-netvaerket-taenke.spec.mjs med funktionelle tests af tegning/viskning, eksempler, ryd, neuron-/forbindelsesvalg, modelresultat, mobil-touch og standalone-udgaven. Ingen tests må afhænge af en forventning om perfekt klassifikation af alle tænkelige håndtegninger. Rapportér konkrete præstationsgrænser ærligt.
