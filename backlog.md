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
