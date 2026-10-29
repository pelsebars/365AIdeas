# 365AIIdeer

Et års eksperiment: en ny, lille AI-genereret webapp hver dag. Ét samlet website med selvstændige apps, prompts og byggeforklaringer.

## Start lokalt

Kør `npm run dev` og åbn http://localhost:3000. Python 3 kræves til den lokale server; ingen afhængigheder skal installeres. `npm run check` validerer JavaScript, backlog og lokale links.

## Indhold

- `index.html`, `style.css`: hovedside med udgivne apps og deres byggeforklaringer.
- `apps/space-invaders/`: første spil, med point, liv, bølger, pause og touch.
- `apps/paa-kanten-af-kaos/`: interaktiv logistisk afbildning med worker, zoom, guidede stop og tidsserier.
- `apps/gps-og-tiden/`: syv interaktive kapitler om GPS og relativitet med tre forklaringsniveauer og eget laboratorium.
- `backlog.md`: autoritativ idébacklog med oprindelig idé, status/datoer og fuld konceptprompt. Kan redigeres manuelt eller via en chat.
- `build.md`: fælles regler for valg af opgave, bygning, integration, kontrol og deployment.

## Daglig arbejdsgang

Følg [build.md](build.md), og vælg første `klar`-entry i [backlog.md](backlog.md). Nye idéer starter som `kladde`; skift til `klar`, når de må bygges automatisk. Kørslen gemmer den fulde konceptprompt før implementeringen og opdaterer status og datoer bagefter. Afsluttede entries bevares som historik. cron-job.org starter GitHub-workflowet dagligt kl. 06.07 i Europe/Copenhagen via workflow_dispatch; sommertid/vintertid følger tidszonen.

## Vercel

Projektet er statisk og har `vercel.json`. Importér Git-repositoriet i Vercel som et projekt med preset **Other**, uden build command og med output directory `.`. Alle apps kan udgives under samme domæne, fx `/apps/space-invaders/`. Hvert push til produktionsbranchen kan dermed udgive næste app og opdatere hovedsiden samlet.

Git-repository: https://github.com/pelsebars/365AIdeas. Vercel er tilkoblet Git-repositoriet og udgiver fra `main`. Den offentlige side er https://365aideas.vercel.app. Tilkoblingen er verificeret via GitHubs Vercel-status og HTTP 200 fra den offentlige side. Efter push skal Vercel-status og den faktiske offentlige app kontrolleres; et push alene dokumenterer ikke en deployment.

## Udgivelsesplan

Fra 28. oktober 2026 styres den daglige cloud-kørsel af cron-job.org kl. 06.07 dansk tid. GitHubs native schedule-trigger er fjernet efter gentagne udeblevne kørsler. Backlog.md rummer egne idéer og implementerede apps; de 36 oprindelige AI-forslag er fjernet efter brugerens ønske; kun entries markeret `klar` er i byggekøen. En daglig agentkørsel skal have adgang til repository og deployment og bør kun udgive efter sine kontroller. En tidsplan alene genererer ikke apps.

Websitet bruger Google Fonts som valgfri typografiforbedring med lokale fallback-skrifter. Spillet har ingen netværksafhængigheder og gemmer kun rekord i localStorage.

## På kanten af kaos

Åbn `/apps/paa-kanten-af-kaos/`. Appen kræver en webserver (fx `npm run dev`), da beregningen kører i en Web Worker. Klik vælger r, træk zoomer, scroll eller +/− zoomer, og Shift+piletaster flytter udsnittet. Piletaster uden Shift ændrer r. På mobil bruges knapperne eller markeringstilstanden; almindelig berøring tillader rulning af siden. Forældede workers termineres ved nye beregninger.

`npm run check` finder automatisk apps og deres JavaScript og lokale HTML-links, validerer en variabel backlogstørrelse, tæller og fremdrift samt de guidede periodiske eksempler og en positiv numerisk Lyapunov-eksponent ved r = 3,9. Den numeriske kontrol supplerer primærkilderne i appen; den er ikke et generelt kaosbevis. Konceptet fandtes ikke i backloggen, så ingen backlogidé er fjernet.

Seneste browserafprøvning (22. oktober 2026): desktop 1280×720 og mobilviewport 390×844. Alle seks stop, markering, scrollzoom, zoomknapper, tilbage/nulstilling, tastatur, præcis r, x₀ = 0, tidsseriens to faser, sammenligning og navigation til/fra oversigten er afprøvet. Ingen observerede konsolfejl eller vandret overløb. Mobiltesten er udført i en browserviewport, ikke på en fysisk telefon.

## HTML-download

Hver udgivet app kan tilbydes som en selvstændig HTML-fil. Kør `npm run build` efter ændringer i apps eller CSS for at opdatere HTML-downloads i hver apps mappe. Filen indeholder CSS og JavaScript og kræver ingen server eller netværksforbindelse. Den genererede fil skal med i commit.

## Idéformular

`ide.html` sender forslag via FormSubmit til jacobhansennymail@gmail.com. Mailadresse er valgfri. FormSubmit bruger som standard CAPTCHA; et skjult honeypot-felt supplerer spamkontrollen. Ved første indsendelse sender tjenesten en aktiveringsmail til modtageren: aktivér formularen, og indsend derefter et nyt testforslag for at kontrollere levering. Der er ikke sendt nogen testhenvendelse fra udviklingen. Besøgende kan også bruge mailto-linket. Formularen afhænger af FormSubmits tilgængelighed og er endnu ikke verificeret med levering til indbakken.

## Perspektivretter

Åbn `/apps/perspektivretter/`. Vælg et billede, tilpas to lodrette og to vandrette linjer, kontrollér resultatet og gem en PNG eller JPEG. Et indbygget syntetisk testgitter gør det muligt at prøve værktøjet uden egne billeder. Linjerne behandles som uendelige; deres skæringspunkter definerer referencefladen. “Hele billedet” er standard og bevarer hele originalen efter transformationen; “Mellem linjerne” beskærer til referencefladen. Kendte mål beskriver altid referencefladen, mens outputmål følger det valgte udsnit. Alle koordinater og eksportberegninger bruger originalens orienterede pixels.

Træk punkterne med mus eller touch. Zoom med scroll eller +/−, og panorér ved at trække baggrunden; “Panorér” tillader også træk oven på punkterne. Tab vælger et punkt, og piletaster flytter det 1 pixel (Shift: 10). “Tegn valgt linje” lader dig tegne linjen igen, og “Fortryd”/Ctrl+Z eller Cmd+Z gendanner tidligere markeringer. “Start forfra” nulstiller markeringer og udsnit. Proportioner kan estimeres, angives som kendt bredde/højde og finjusteres med skyderen. Eksportmål har låst aspektforhold, afrundet til hele pixels.

Teknik: almindelig HTML, CSS og JavaScript; SVG-markeringer og Canvas 2D. Invers homografi med bilineær, alfa-korrekt interpolation. Forhåndsvisningen har højst 640 px på længste side; eksporten beregnes separat fra originalen i 32-pixels-rækker med pauser til browseren. EXIF-orientering anvendes ved indlæsning via `createImageBitmap`. Ingen billeder sendes til en server. PNG bevarer transparens; JPEG får hvid baggrund. Ingen eksterne biblioteker eller netværksafhængigheder. Downloadudgaven indeholder hele appen i én HTML-fil.

Grænser: 50 megapixel/20.000 px pr. side ved indlæsning og 40 megapixel/16.384 px pr. side ved eksport. Enhedens hukommelse kan sætte en lavere grænse; fejl meddeles uden automatisk nedskalering. Én plan flade ad gangen; linseforvrængning korrigeres ikke, og fire linjer bestemmer ikke alene korrekte fysiske proportioner.

Afprøvet 23. oktober 2026: `npm run check` omfatter nu en uafhængig projektiv testfigur med gitter i begge retninger, retvinklet identitet (pixelbevarelse), manuelle proportioner, rækkevis eksport og ugyldige/ekstreme markeringer. Browserprøver ved 1280×900 og 390×844 omfatter upload, EXIF-rotation 6, punkttræk, tastatur, linjetegning, fortryd, nulstilling, scrollzoom, zoomknapper, panorering, gitter, proportionsskyder, 2:1-mål, ugyldig geometri, for stort output og navigation til/fra oversigten. PNG og JPEG blev downloadet og filernes faktiske mål verificeret til 1600×800. Ingen observerede konsolfejl eller vandret overløb i mobilviewporten. Mobil er afprøvet i browserviewport, ikke på en fysisk telefon.

Konceptprompten er bevaret i `apps/perspektivretter/concept.txt` og under opslaget på forsiden, adskilt fra projektbriefet. Perspektivretter fandtes ikke i backloggen; ingen anden idé er fjernet. Kontrolscriptet accepterer fortsat en variabel backlogstørrelse.

Opdatering: Referencelinjer og beskæring er nu adskilt. Hele billedets transformerede hjørner bestemmer outputrammen. Tomme kanter bevares transparente i PNG og hvide i JPEG. Hvis en projektiv horisont krydser originalen, kan hele billedet ikke rummes på et endeligt lærred; appen beder om andre linjer eller udsnittet mellem linjerne. Kontrolscriptet tester pixelbevarelse med indre referencer, projektive billedgrænser og denne fejltilstand.

## GPS og tiden

Åbn `/apps/gps-og-tiden/`. Eksperiment 004 følger to atomure gennem bevægelse, gravitation, mikrosekunder og positionering frem til et relativitetslaboratorium. Ændr højde, tid og bidrag; hastigheden følger højden i en cirkulær bane. Kapitel 6 løser position og urfejl numerisk fra fire signaler i en forenklet 2D-model. Alle kapitler deler en ren, testbar fysikmotor. Kapitel og forklaringsniveau gemmes i URL'en. Downloadudgaven virker uden server og netværk.

`npm run check` omfatter nu GPS-tal, fortegn, balancehøjde, lysur, tidsakkumulering og 60 positioner med urfejl. Browserafprøvet 24. oktober 2026 ved 1280×720 og 390×844. Detaljer om arkitektur, kontroller og modellens afgrænsning findes i `apps/gps-og-tiden/README.md`. Menneskets oprindelige idé er bevaret ordret i appens `original-prompt.txt`, og den AI-udbyggede byggeprompt fra en separat chat er bevaret uændret i `concept.txt`. Begge er medtaget under opslagets byggeforklaring på forsiden med tydelig angivelse af ophav. Der er ikke fjernet noget fra backloggen.

## Automatisk køvalg (forberedelse)

- `npm run backlog:check`: validerer A/B/C, unikke ID'er, status, datoer og køens entydighed. Indgår også i `npm run check`.
- `npm run backlog:next`: læser køen uden ændringer; giver JSON eller `null`.
- `npm run backlog:start`: markerer den næste klare idé som startet. Brug kun inde i en låst kørsel.
- `npm run daily:run -- <kommando> [argumenter]`: holder en lokal eksklusiv lås under hele kommandoen og sender valgt ID/action som `BACKLOG_ID`/`BACKLOG_ACTION`. Starter ingen kommando, hvis køen er tom. Kommandoen står selv for startmarkering, bygning og statusopdatering.
- `npm run test:backlog`: afprøver køvalg, genoptagelse, ugyldige data, startmarkering og lås/fejl.

De fire allerede byggede apps er markeret `Kø: historik`, da deres deployment ikke blev efterprøvet under importen. De skal ikke blokere den nye kø. Nye idéer starter som kladder, medmindre brugeren vælger dem til en byggekørsel. Cloud-workflowet nedenfor håndterer repository-dækkende concurrency, checkpoint og deploymentkontrol. Den lokale lås bruges til lokale kørsler. Den daglige tidsplan er kl. 06.07 dansk tid.

## Cloud-runner (manuelt aktiveret)

Workflow: `.github/workflows/daily-app.yml` — **Build one backlog app** under GitHub Actions. Det startes af cron-job.org dagligt kl. 06.07 i Europe/Copenhagen på `main` og kan også startes manuelt. Den fulde app-prøve bestod 26. oktober 2026.

### Forløb

1. Runneren henter `main`, installerer de låste Playwright-afhængigheder og Chromium og afprøver projektet.
2. Et eventuelt checkpoint fra `codex/daily-app-work` flettes ind. Mergekonflikter stopper kørslen og kræver afklaring; intet overskrives.
3. Køen vælger én klar/afbrudt opgave. Er køen tom, bliver der hverken kaldt på AI eller ændret kode.
4. Den officielle Codex Action læser `.github/codex/daily-app.md` samt build.md/backlog.md. API-nøglen kommer fra repository-secretet `OPENAI_API_KEY`. En workspace-profil i `.github/codex/config.toml` tillader netværk til lokal browserafprøvning og kildeopslag, mens filskrivning er begrænset til arbejdsområdet. Modelvalget er fastsat direkte i workflowet til `gpt-6.1-sol`, effort `low` (laveste understøttede niveau). Repository-variables ændrer ikke modelvalget. Der er ikke fastsat et dokumenteret forbrugsbudget endnu.
5. Ændringer pakkes som en Git-patch med en tilladt filliste. En separat runner uden API-nøgle eller skrivetoken kontrollerer appstatus, uændrede oprindelige idéer, reproducerbare HTML-downloads, beregninger og browsertests på desktop/mobil. Nye apps skal have en funktionel `tests/browser/<slug>.spec.mjs` ud over den generelle navigationstest.
6. Et separat job med skriverettighed gemmer checkpoint på arbejdsbranchen, også når AI eller appkontroller fejler, hvis patchen kan indsamles og godkendes. Jobbet udfører ikke genereret appkode.
7. Planlagte kørsler publicerer automatisk efter beståede kontroller. Ved manuel start er inputtet **publish** som standard false. I den tilstand bliver arbejdet på checkpointbranchen. Hvis publish er true og alle kontroller består, pushes til main, forudsat at main ikke har flyttet sig under arbejdet. Ingen force-push.
8. Vercel-status for præcis den publicerede commit og offentlig forside/app kontrolleres. Først derefter markeres entryen udgivet, og checkpointbranchen fjernes. Manglende Vercel-status giver fejl, og entryen forbliver implementeret til næste forsøg. Bot-udløst Vercel-udgivelse skal verificeres ved den første fulde prøve.

### Fejl og grænser

- GitHub Actions concurrency holder én hel workflowkørsel ad gangen for denne udgivelsesproces. Det forhindrer ikke menneskers samtidige pushes; derfor kontrolleres main igen før publicering.
- Codex-trinnet har en grænse på 45 minutter inden for et byggejob på 65 minutter, så der normalt er tid til at gemme efter en timeout. Et abrupt runnernedbrud eller en tvungen afbrydelse kan stadig miste arbejde siden sidste checkpoint. Branche-checkpoints bevares; artifacts opbevares i 14 dage.
- Browserkontroller er headless Chromium med desktop- og mobilviewport, ikke en fysisk telefon. Den generelle test kontrollerer indlæsning, navigation, JS-fejl, bredde og HTML-download; den beviser ikke alle appfunktioner eller fuld offlinefunktion. Den app-specifikke test skal dække centrale funktioner.
- Workflowet må ændre apps, app-tests, ekstra beregningschecks, hovedsidens HTML/CSS, README og den valgte backlogentry. Det må ikke ændre workflows, afhængigheder eller runnerinfrastruktur under en appbygning. Den slags kræver en separat ændring.
- Fejl fremgår som fejlede Actions-kørsler. Modtagerens GitHub-notifikationsindstillinger afgør mail/push; der er ikke tilføjet en særskilt beskedtjeneste.

Lokalt: `npm ci`, `npx playwright install chromium`, `npm run test:runner`, `npm run check` og `npm run test:browser`. Ved ændringer i apps/CSS køres også `npm run build`, og genererede downloads medtages.

Der postes ikke automatisk til LinkedIn eller andre sociale medier. Udgivelsesflowet gælder kun hjemmesiden.

## Memento mori

Åbn `/apps/memento-mori/`. Indtast 0–90 hele år og statistisk kønskategori. Dagtæppet viser én firkant pr. dag, med kors ved forventet restlevetid og valgfri fortsættelse til alder 99. Klik på en firkant eller brug dagvælgerens piletaster for dato og afrundet sandsynlighed. Rækkevalg 30/40/50 og “Find korset” hjælper med navigationen.

Almindelig HTML/CSS/JavaScript med Canvas og SVG; ingen nye afhængigheder, lagring eller netværkskald. HISB8 fra Danmarks Statistik, 2024–2025, hentet 2026-10-26: `source.csv` bevarer originalsvaret, `source-metadata.json` variabelkoder og enheder, `data.js` det indlejrede snapshot. TAVLE 3 bruges direkte til betinget restlevetid; overlevelse er TAVLE 1 divideret med overlevende ved startalder. Lineær interpolation og 365,2425 dage/år er tilnærmelser. Periodestatistikken er ingen personlig prognose og modellerer ikke fremtidige ændringer i dødelighed. Kurven stopper ved 99 uden at antage 100% døde. Den selvstændige HTML indeholder data og virker offline; hjem- og kildelinks kræver netværk.

Beregningstesten `scripts/check-memento-mori.mjs` kontrollerer snapshot, betingning, restlevetid, sandsynligheder, datoer og grænser. `tests/browser/memento-mori.spec.mjs` tester input, resultatændring, rækkevalg, markør, nulstilling og den selvstændige fil uden netværk i desktop- og mobilprojektet. Mobilkontrollen bruger Chromium-viewport, ikke fysisk telefon.

### Første fulde cloud-prøve — 26. oktober 2026

[Actions-kørsel 40300853240](https://github.com/pelsebars/365AIdeas/actions/runs/40300853240) byggede og udgav Memento mori (IDE-042) med publish=true. Alle fire jobs bestod: build, validate, save og verify. Hele forløbet tog cirka 7 minutter. API-nøglen virkede, checkpoint blev pushet fra runneren, Vercel reagerede på bottens push, og den offentlige app blev verificeret før status udgivet blev gemt. 7 runner-tests, kontrollen af 400 statistiktal og 14 browsertests bestod. API-prisen er ikke udledt af køretiden.

Efterfølgende manuel kontrol bekræftede alle 400 snapshotværdier mod Danmarks Statistiks API samt fungerende input/resultatændring på den offentlige app uden observerede JavaScript-fejl. Desktopskærmbillede er gennemset. Den daglige tidsplan blev efter prøven aktiveret til kl. 06.07 dansk tid. Tilføj og push flere entries med status klar for at fylde køen. Brugeren har aflæst dagens API-forbrug til $0,14; det er en måling, ikke en fast pris for fremtidige apps.

### Tidsplansrettelse — 27. oktober 2026

Der blev ikke registreret nogen schedule-kørsel ved den første planlagte start. GitHub-loggen giver ingen konkret årsag. Den native timezone-plan er erstattet af UTC-slots kl. 04.07 og 05.07, hvor et let startjob kun tillader den slot, som svarer til kl. 06.07 i Europe/Copenhagen. Dermed følger kørslen sommer-/vintertid uden timezone-feltet og undgår hel time. Porten bruger workflowets oprettelsestid, så senere køforsinkelse ikke giver et forkert tidsvalg. Dette er en forebyggende ændring, ikke dokumentation for årsagen til den manglende første start. GitHub kan fortsat forsinke eller udelade planlagte events; næste automatiske start skal efterprøves.

### Runnerrettelse — Node-actions og Ubuntu, 27. oktober 2026

Kørsel 40472277950 bestod time-slot, men stoppede i Codex-actionens sikkerhedsopsætning med `Could not restrict access to /run/dbus/system_bus_socket` på Ubuntu 26.04, før modellen blev startet. Validate/save markerede derefter kørslen som fejlet, og checkpoint med startstatus blev bevaret. Det svarer til den åbne upstream-fejl https://github.com/openai/codex-action/issues/188. Alle jobs bruger nu eksplicit Ubuntu 24.04, så ubuntu-latest ikke skifter OS under os. Checkout/setup-node/upload-artifact/download-artifact er opdateret til SHA-fastlåste versioner med native Node 24. Sikkerhedsstrategien er fortsat drop-sudo; den er ikke deaktiveret. Den tidligere Node 20-advarsel var ikke årsagen til byggefejlen.

Genkørsel 40473147435 kom forbi systemsocket-fejlen på Ubuntu 24.04. API’en afviste derefter den eksplicitte indstilling effort=none; modellen understøtter low, medium, high, xhigh og max. Workflowet er rettet til low. Den oprindelige prøve havde ikke sendt en eksplicit effort-værdi; CLI-loggens none kunne ikke bruges som API-konfiguration.

## Myresimulator (IDE-043)

Åbn `/apps/myresimulator/`. 220 myrer søger lokalt efter kage. Tegn og fjern vægge med mus, touch eller Canvas-feltets piletaster og mellemrum. Pause stopper simulation og fordampning; tempo kan sættes til 1×, 3× eller 8×. Start forfra genskaber det seedede udgangspunkt.

Ren JavaScript-model på 64 × 40 felter og Canvas-rendering; ingen nye afhængigheder eller netværkskald. Hjemnavigation bruger en afstandstabel til tuen, mens søgende kun følger lokale retningsspor og tilfældig vandring. Det er en visuel forenkling, ikke en biologisk prognose. Overmalede myrer flyttes til nærmeste frie felt; afskårede bærere søger, indtil ruten åbnes. Ny kage vælges kun i områder, der kan nås fra tuen. Farveskalaen mættes før feltets maksimum. Selvstændig HTML indeholder hele appen og virker offline. Hjemlink kræver netværk i downloadudgaven.

`scripts/check-myresimulator.mjs` afprøver regler, seedet levering, pause, fordampning, kageflytning og vægge. `tests/browser/myresimulator.spec.mjs` afprøver funktioner i desktop- og mobilprojekterne samt downloadfilen uden netværk. Mobil er Chromium-emulering, ikke en fysisk telefon. A er bevaret ordret med menneskeligt ophav; den anvendte AI-konceptprompt er gemt som C.

Bekræftet genkørsel: https://github.com/pelsebars/365AIdeas/actions/runs/40473435157 bestod alle fem jobs med Ubuntu 24.04, native Node 24-actions og gpt-6.1-sol/low. Ingen Node 20-deprecations blev logget. Begge browserkørsler bestod 20 tests. Myresimulatoren blev publiceret i a5f37ce og verificeret i 518b1fb. Dette bekræfter den manuelle genkørsel; næste automatiske schedule-event skal stadig observeres.

## Stæreflok (IDE-045)

Åbn `/apps/staereflok/`. 240 fugle flyver i et tredimensionelt rum med fast kamera. Pause/fortsæt, lokalt retningsskift, 80–360 fugle, nabofølgning, drejeinerti, nabovisning og hastighedsvektorer styres med tastatur eller touch. Reduceret bevægelse starter pauset. Nulstilling genskaber den seedede start.

Ren JavaScript og Canvas 2D uden nye afhængigheder, lagring eller runtime-netværkskald. Fast 1/60-sekundsmodel med eksakte syv nærmeste 3D-naboer opdateret hver fjerde step. Kort afstand giver frastødning; vinkelhastighed har inerti og dæmpning. Blød randstyring er en visuel afgrænsning. Ballerini (2008) og Attanasi (2014) er gennemgået som primærkilder; appens drej er en pædagogisk forenkling med mulig diffus reaktion, ikke en rekonstruktion af målt bølgefysik. Farve måler retningsændring og beviser ikke årsag. Selvstændig HTML virker offline; kilde- og hjemlinks kræver netværk.

`scripts/check-staereflok.mjs` tester 3D-nabovalg, lokal kædereaktion, fart/acceleration, 60 sekunders stabilitet, alle akser, seed, pause og projektion. `tests/browser/staereflok.spec.mjs` dækker interaktion, animation, resize, nulstilling og offline-download i Chromium på desktop og emuleret mobil. Ingen fysisk telefon er afprøvet. Menneskets A og anvendt AI-koncept C er gemt særskilt og vist med ophav på forsiden.

### Ekstern timer — 28. oktober 2026

cron-job.org-job 8744014 kalder `POST https://api.github.com/repos/pelsebars/365AIdeas/actions/workflows/daily-app.yml/dispatches` dagligt kl. 06.07 i Europe/Copenhagen med JSON `{"ref":"main","inputs":{"publish":true}}`. Den eksisterende repository-begrænsede GitHub-token opbevares kun hos cron-job.org. Tokenens udløb skal fornyes dér. HTTP 204 bekræfter modtagelse, ikke en vellykket bygning; resultatet findes i GitHub Actions.

Begge workflows har nu kun workflow_dispatch; testworkflowets femminutters-cron er også fjernet. Det eksterne testjob er ændret til den daglige produktionstimer. Tidligere tidsplansafsnit ovenfor er historik.

Workflowets concurrency serialiserer alle byggekørsler. Startjobbet henter aktuel main og springer hele bygningen over, hvis en backlogentry allerede har status udgivet med dagens dato i Europe/Copenhagen. Det gælder også manuelle starter. En uafsluttet/fejlet kørsel kan genoptages fra checkpoint; der bygges ikke en ekstra app efter en registreret udgivelse samme dag. Kontrollen bruger faktisk kørselsdato, så en ventende kørsel over midnat vurderes på den nye danske dato.

## Motorvejslaboratoriet (IDE-046)

Åbn `/apps/motorvejslaboratoriet/`. Fire ensrettede baner over 500 m med initialt bilantal, trafiktilførsel, skiftetendens, faktisk reaktionsforsinkelse, maksimal bremsning samt avancerede fart-/tidsafstandsvalg. Pause, nulstilling og kort opbremsning styrer forsøget. “Beregn 90 sekunder” beregner videre i modellen; gem derefter faktiske målepunkter i graf og tabel. Parameterændringer starter et nyt forsøg, mens gemte punkter bevares. Resultater gemmes kun i hukommelsen.

Ren JavaScript/Canvas uden nye afhængigheder eller runtime-netværk. IDM med forsinkede observationer, fast 0,05 s ballistisk tidsintegration og seed 46; MOBIL-inspireret incitament og sikkerhedstjek, sekventiel reservation af begge baner under 2 s skift. Komfortbremsning 2 m/s² adskilles fra justerbar maksimal bremsning. Forsinkede observationer omfatter egen fart, afstand og lederfart; nye ledere omskriver ikke historikken. Ved start antages første observation også at gælde før start. Dette er en pædagogisk udvidelse, ikke kalibreret standard-IDM/MOBIL. Lang reaktionstid kan give sammenstød, som stopper forsøget synligt uden teleportering. Ingen lastbiler, tilkørsler eller vejrbetingelser.

Flow måles ved udløbet over højst 60 s efter 30 s opvarmning. Grafen viser målt middeltæthed mod samlet flow over fire baner og spændet mellem seks 10 s vinduer; ét seed og korte vinduer er ikke en kapacitetsprognose. Upstream-kø tælles uden at tegnes. Kilder og enheder står i appen. Menneskets A er bevaret ordret, og den anvendte AI-udbygning C er gemt særskilt. Selvstændig HTML indeholder hele modellen og virker offline; hjem- og kildelinks kræver netværk.

`scripts/check-motorvejslaboratoriet.mjs` tester forsinket cut-in, bremseformler, sikre/afviste og samtidige skift, 180 s standardforløb, bevarelse, kø, kollisionsstop, passageflow, reset og renderuafhængighed. `tests/browser/motorvejslaboratoriet.spec.mjs` afprøver kontroller, opbremsning, pause, beregnede målinger, gemte sammenligninger, nulstilling og lokal offlinefil i desktop- og mobilprojektet. Mobil er Chromium-emulering, ikke fysisk telefon.
