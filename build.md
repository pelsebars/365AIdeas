# Fælles byggebrief — 365AIIdeer

Læs denne fil og `backlog.md` ved hver byggekørsel. Backloggens A er den oprindelige idé, B er status og C er den konkrete konceptprompt. Denne fil er de fælles regler og skal ikke gentages i hver C.

## Vælg én opgave

1. Læs eventuelle AGENTS.md-instruktioner, README, denne fil og backlog.md. Undersøg git-status, branch, remote og eksisterende apps. Bevar andres ændringer og private inputfiler.
2. Kør hele forløbet under låsen med `npm run daily:run -- <runnerkommando>`. Låsen gælder samme checkout. Cloud-workflowet bruger GitHub Actions concurrency for hele forløbet i stedet for den lokale lås. Ved optaget lås: stop. En efterladt lås må først fjernes manuelt, når det er kontrolleret, at ejeren ikke længere kører.
3. Brug `npm run backlog:next` til at vælge opgaven. Scriptet returnerer JSON med ID og action (`build`, `resume`, `deploy`) eller `null`. `i gang` og aktive `implementeret` prioriteres før første `klar`. Historik er undtaget. Ved `null` afsluttes uden bygning. Flere aktive ufærdige opgaver er en fejl, som kræver afklaring.
4. Ved action `build`: kør `npm run backlog:start` inde under låsen; det sætter `i gang` og Startet med dansk dato. Ved `resume`: undersøg eksisterende arbejde først. Ved `deploy`: genoptag kun kontrol/udgivelse af den byggede app. Bevar oprindelig A og ID. Nye implementerede apps må ikke mærkes `Kø: historik`; markeringen er kun til de ældre importerede apps.
5. Udbyg A til en konkret C, hvis C mangler eller kun er en seed-prompt. Beskriv brugeroplevelse, funktioner, visuel forklaring, afgrænsning og meningsfulde acceptkriterier. Følg idéens omfang; opfind ikke en større app. Gem C før implementeringen. En eksisterende dækkende C genbruges.
6. Hvis en afgørende uklarhed hindrer implementering, dokumentér den under Noter og sæt `blokeret`. En automatisk kørsel må ikke opfinde et brugerønske som løsning.

## Byg appen

- Brug `apps/<slug>/` med `index.html` og egne filer. Undersøg først, om appen allerede findes.
- Projektet er statisk HTML, CSS og JavaScript med Vercel-konfiguration. Brug ikke en ny frontendstack eller backend uden konkret behov og eksisterende autorisation.
- Brug dansk, et gennemarbejdet udtryk, responsivt layout, tilgængelige kontroller og relevante tastatur-/touchfunktioner. Tilføj navigation hjem.
- Prioritér fungerende interaktion og forståelig grafik. Forklar modeller og deres begrænsninger. Verificér fagligt indhold og eksterne API-forudsætninger mod relevante primærkilder.
- Behandl brugerfiler lokalt, hvor konceptet lægger op til det. Tilføj ikke upload eller eksterne tjenester uden behov.
- Gem A ordret i `original-prompt.txt`, og gem den anvendte C i `concept.txt` i appens mappe. Angiv det faktiske ophav; AI-seedforslag må ikke præsenteres som menneskeskrevne idéer.
- Bevar den anvendte C som historik. Dokumentér senere væsentlige rettelser særskilt frem for at omskrive, hvad der oprindeligt blev brugt.

## Integrér i hjemmesiden

- Tilføj et opslag på `index.html` i det eksisterende design med titel, præsentationsgrafik, kort beskrivelse og app-link.
- Vis oprindelig idé og AI-udbygget konceptprompt med tydeligt ophav samt en kort byggeforklaring. Fælles git- og deploymentinstruktioner skal ikke vises som konceptprompt.
- Angiv faktisk AI-værktøj, model og teknologi. Gæt ikke på modelvariant eller indsatsniveau.
- Opdatér app-tæller, oversigtstæller og fremdrift i `style.css` ud fra det faktiske antal apps. Eksperimentnummer er ikke backlog-ID eller kalenderdag.
- Understøt den eksisterende selvstændige HTML-download, og tilføj download-link. Undersøg `scripts/build-downloads.mjs`; udvid den ved behov for appens filstruktur. Lov kun offlinefunktion, når den er afprøvet.
- Opdatér README med relevant brug, teknik, afhængigheder og begrænsninger. Backlogentries bevares efter afslutning; fjern dem ikke.

## Byg og kontrollér

1. Kør `npm run build` for at generere HTML-downloads; genererede filer skal med i ændringen.
2. Kør `npm run check`. Udvid eksisterende kontroller, når nye funktioner kræver det. Skriv meningsfulde tests for fx beregninger og eksport, ikke tests der blot gentager implementeringen.
3. Start lokal server med `npm run dev` og afprøv hovedfunktionerne, navigation til/fra forsiden samt downloadudgaven i browseren på desktop og mobilviewport. Kontrollér konsol og vandret overløb. Oplys hvis fysisk mobil eller browserkontrol ikke har været mulig.
4. Ret fundne fejl før udgivelse. Dokumentér udførte kontroller og eventuelle resterende begrænsninger under entryens Noter.
5. Sæt `implementeret` og udfyld dato og App, når appen er bygget og kontrolleret. Implementeret er ikke det samme som offentliggjort.

## Git og udgivelse

README dokumenterer GitHub-repositoriet https://github.com/pelsebars/365AIdeas og Vercel med produktionsbranch `main` samt https://365aideas.vercel.app. Det ønskede domæne 365AIidéer.dk må først bruges som verificeret produktionsadresse, når domænet faktisk er tilkoblet. Kontrollér aktuel konfiguration frem for at stole på en gammel status.

- En kørsel, som udtrykkeligt er sat op til daglig bygning OG udgivelse, må committe og pushe opgavens ændringer gennem den eksisterende udgivelsesproces. En manuel koncept- eller backlogopgave autoriserer ikke i sig selv deployment.
- Stage kun filer, som hører til opgaven. Medtag ingen private inputbilleder. Brug aldrig force-push eller destruktiv nulstilling af andres arbejde.
- Undersøg remote og seneste ændringer før push; følg den eksisterende branch-/PR-proces og bevar parallelle ændringer. Ved ny branch bruges som udgangspunkt `codex/`.
- Et push er ikke bevis på udgivelse: kontrollér deployment-status for den relevante commit og den faktiske app-URL samt hovedsidens nye opslag.
- Sæt først status `udgivet`, dato og Deployment-link, når deployment er verificeret. Gem relevant commitreference i Noter. Commit også statusopdateringen, når den er bekræftet.
- Hvis deployment fejler eller adgang mangler, bevar `implementeret`, og beskriv hindringen. Genoptag udgivelsen næste gang uden at bygge endnu en app.

## Afslutning

Giv en kort rapport med entry-ID, hvad der blev bygget, udførte kontroller, eventuelle hindringer samt lokal/offentlig URL. Denne fil opretter ikke i sig selv en tidsplan: den daglige automation konfigureres separat.

## Når GitHub Actions er runneren

`.github/workflows/daily-app.yml` og `.github/codex/daily-app.md` fordeler ansvaret: AI-trinnet bygger og afprøver, mens separate jobs gemmer checkpoint, validerer og eventuelt publicerer. AI-trinnet skal ikke committe/pushe selv. `publish=false` gemmer alene checkpoint, og `publish=true` autoriserer publicering efter kontroller. Den daglige tidsplan er aktiveret til kl. 06.07 i Europe/Copenhagen. Planlagte kørsler publicerer efter beståede kontroller; modellen er fastsat til gpt-6.1-sol med effort none. Se README for adgang, timeoutgrænser og genoptagelse.

## Sociale medier

Der må ikke automatisk postes til LinkedIn eller andre sociale medier. Udgivelsesflowet gælder kun projektets website. Eventuel deling foretages manuelt af brugeren.
