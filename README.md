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
- `backlog.json`: historisk seed-arkiv med 36 AI-forslag, importeret i backlog.md. Brug det ikke som aktiv kø; kontrolscriptet validerer det stadig som arkiv.
- `scripts/seed-backlog.py`: oprindelig seed. Kør den ikke igen efter manuelle ændringer i backloggen; den overskriver filen.

## Daglig arbejdsgang

Følg [build.md](build.md), og vælg første `klar`-entry i [backlog.md](backlog.md). Nye idéer starter som `kladde`; skift til `klar`, når de må bygges automatisk. Kørslen gemmer den fulde konceptprompt før implementeringen og opdaterer status og datoer bagefter. Afsluttede entries bevares som historik. En daglig tidsplan er endnu ikke oprettet af denne arbejdsgang.

## Vercel

Projektet er statisk og har `vercel.json`. Importér Git-repositoriet i Vercel som et projekt med preset **Other**, uden build command og med output directory `.`. Alle apps kan udgives under samme domæne, fx `/apps/space-invaders/`. Hvert push til produktionsbranchen kan dermed udgive næste app og opdatere hovedsiden samlet.

Git-repository: https://github.com/pelsebars/365AIdeas. Vercel er tilkoblet Git-repositoriet og udgiver fra `main`. Den offentlige side er https://365aideas.vercel.app. Tilkoblingen er verificeret via GitHubs Vercel-status og HTTP 200 fra den offentlige side. Efter push skal Vercel-status og den faktiske offentlige app kontrolleres; et push alene dokumenterer ikke en deployment.

## Udgivelsesplan

Startdato, klokkeslæt og automatisk kørsel er ikke fastsat. Backlog.md rummer både egne idéer, implementerede apps og 36 importerede AI-forslag; kun entries markeret `klar` er i byggekøen. En daglig agentkørsel skal have adgang til repository og deployment og bør kun udgive efter sine kontroller. En tidsplan alene genererer ikke apps.

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

De fire allerede byggede apps er markeret `Kø: historik`, da deres deployment ikke blev efterprøvet under importen. De skal ikke blokere den nye kø. Alle nye idéer står fortsat som kladder. Cloud-workflowet nedenfor håndterer repository-dækkende concurrency, checkpoint og deploymentkontrol. Den lokale lås bruges til lokale kørsler. Der er endnu ingen daglig tidsplan.

## Cloud-runner (manuelt aktiveret)

Workflow: `.github/workflows/daily-app.yml` — **Build one backlog app** under GitHub Actions. Det kan kun startes manuelt på `main`; en daglig tidsplan er bevidst ikke aktiveret før første fulde app-prøve.

### Forløb

1. Runneren henter `main`, installerer de låste Playwright-afhængigheder og Chromium og afprøver projektet.
2. Et eventuelt checkpoint fra `codex/daily-app-work` flettes ind. Mergekonflikter stopper kørslen og kræver afklaring; intet overskrives.
3. Køen vælger én klar/afbrudt opgave. Er køen tom, bliver der hverken kaldt på AI eller ændret kode.
4. Den officielle Codex Action læser `.github/codex/daily-app.md` samt build.md/backlog.md. API-nøglen kommer fra repository-secretet `OPENAI_API_KEY`. Repository-variables `CODEX_MODEL` og `CODEX_EFFORT` kan sættes; uden dem bruger actionen sine standarder. Der er ikke fastsat et dokumenteret forbrugsbudget endnu.
5. Ændringer pakkes som en Git-patch med en tilladt filliste. En separat runner uden API-nøgle eller skrivetoken kontrollerer appstatus, uændrede oprindelige idéer, reproducerbare HTML-downloads, beregninger og browsertests på desktop/mobil. Nye apps skal have en funktionel `tests/browser/<slug>.spec.mjs` ud over den generelle navigationstest.
6. Et separat job med skriverettighed gemmer checkpoint på arbejdsbranchen, også når AI eller appkontroller fejler, hvis patchen kan indsamles og godkendes. Jobbet udfører ikke genereret appkode.
7. Inputtet **publish** er som standard false. I den tilstand bliver arbejdet på checkpointbranchen. Hvis publish er true og alle kontroller består, pushes til main, forudsat at main ikke har flyttet sig under arbejdet. Ingen force-push.
8. Vercel-status for præcis den publicerede commit og offentlig forside/app kontrolleres. Først derefter markeres entryen udgivet, og checkpointbranchen fjernes. Manglende Vercel-status giver fejl, og entryen forbliver implementeret til næste forsøg. Bot-udløst Vercel-udgivelse skal verificeres ved den første fulde prøve.

### Fejl og grænser

- GitHub Actions concurrency holder én hel workflowkørsel ad gangen for denne udgivelsesproces. Det forhindrer ikke menneskers samtidige pushes; derfor kontrolleres main igen før publicering.
- Codex-trinnet har en grænse på 45 minutter inden for et byggejob på 65 minutter, så der normalt er tid til at gemme efter en timeout. Et abrupt runnernedbrud eller en tvungen afbrydelse kan stadig miste arbejde siden sidste checkpoint. Branche-checkpoints bevares; artifacts opbevares i 14 dage.
- Browserkontroller er headless Chromium med desktop- og mobilviewport, ikke en fysisk telefon. Den generelle test kontrollerer indlæsning, navigation, JS-fejl, bredde og HTML-download; den beviser ikke alle appfunktioner eller fuld offlinefunktion. Den app-specifikke test skal dække centrale funktioner.
- Workflowet må ændre apps, app-tests, ekstra beregningschecks, hovedsidens HTML/CSS, README og den valgte backlogentry. Det må ikke ændre workflows, afhængigheder eller runnerinfrastruktur under en appbygning. Den slags kræver en separat ændring.
- Fejl fremgår som fejlede Actions-kørsler. Modtagerens GitHub-notifikationsindstillinger afgør mail/push; der er ikke tilføjet en særskilt beskedtjeneste.

Lokalt: `npm ci`, `npx playwright install chromium`, `npm run test:runner`, `npm run check` og `npm run test:browser`. Ved ændringer i apps/CSS køres også `npm run build`, og genererede downloads medtages.
