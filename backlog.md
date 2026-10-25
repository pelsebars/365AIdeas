# Backlog — 365AIIdeer

Dette er den autoritative backlog. Tilføj idéer manuelt eller bed en chat om det.
Fælles bygge-, integrations- og udgivelsesregler står i [build.md](build.md).
`backlog.json` er et historisk seed-arkiv; nye idéer og statusændringer skrives kun her.

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

## IDE-006 — Snake

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Saml mad og undgå din egen hale.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=2. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Snake. Saml mad og undgå din egen hale. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-007 — Pong

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Spil bordtennis mod computeren.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=3. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Pong. Spil bordtennis mod computeren. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-008 — Pac-Man-inspireret labyrint

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Saml prikker og undgå fjender i en original labyrint.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=4. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Pac-Man-inspireret labyrint. Saml prikker og undgå fjender i en original labyrint. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-009 — Tetris-inspirerede blokke

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Rotér faldende blokke og ryd linjer.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=5. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Tetris-inspirerede blokke. Rotér faldende blokke og ryd linjer. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-010 — Memory

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Find de matchende kort.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=6. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Memory. Find de matchende kort. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-011 — 2048

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Kombinér tal og nå 2048.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=7. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: 2048. Kombinér tal og nå 2048. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-012 — Minestryger

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Find miner med hjælp fra tallene.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=8. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Minestryger. Find miner med hjælp fra tallene. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-013 — Breakout

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Slå bolden mod en mur af blokke.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=9. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Breakout. Slå bolden mod en mur af blokke. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-014 — Sudoku

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Løs et talpuslespil med hints.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=10. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Sudoku. Løs et talpuslespil med hints. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-015 — Flappy Bird-inspireret flyvespil

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Flyv mellem forhindringer.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=11. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Flappy Bird-inspireret flyvespil. Flyv mellem forhindringer. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-016 — Ordgæt

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Gæt et dansk ord på seks forsøg.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=12. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Ordgæt. Gæt et dansk ord på seks forsøg. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-017 — Simon Says

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Gentag en voksende sekvens af farver.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=13. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Simon Says. Gentag en voksende sekvens af farver. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-018 — Pomodoro

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Arbejd fokuseret i intervaller.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=14. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Pomodoro. Arbejd fokuseret i intervaller. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-019 — Farvevælger

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Lav en palet og kopiér farvekoder.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=15. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Farvevælger. Lav en palet og kopiér farvekoder. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-020 — Markdown-editor

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Skriv tekst med live forhåndsvisning.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=16. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Markdown-editor. Skriv tekst med live forhåndsvisning. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-021 — Enhedsomregner

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Omregn længde, vægt og temperatur.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=17. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Enhedsomregner. Omregn længde, vægt og temperatur. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-022 — Adgangskodegenerator

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Generér adgangskoder lokalt med Web Crypto.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=18. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Adgangskodegenerator. Generér adgangskoder lokalt med Web Crypto. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-023 — Ugebudget

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Fordel et beløb på ugens udgifter.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=19. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Ugebudget. Fordel et beløb på ugens udgifter. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-024 — Vanetracker

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Markér dagens vaner og se dine fremskridt.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=20. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Vanetracker. Markér dagens vaner og se dine fremskridt. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-025 — Beslutningshjul

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Lad et hjul vælge mellem dine muligheder.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=21. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Beslutningshjul. Lad et hjul vælge mellem dine muligheder. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-026 — Stopur

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Tag tid og gem mellemtider.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=22. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Stopur. Tag tid og gem mellemtider. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-027 — Pakkeliste

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Lav en tjekliste til din næste tur.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=23. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Pakkeliste. Lav en tjekliste til din næste tur. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-028 — Tekstværktøj

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Tæl ord og tegn og skift store og små bogstaver.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=24. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Tekstværktøj. Tæl ord og tegn og skift store og små bogstaver. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-029 — Intervaltræner

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Sæt træning og pauser i en gentaget timer.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=25. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Intervaltræner. Sæt træning og pauser i en gentaget timer. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-030 — Pixel-editor

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Tegn pixelkunst og eksportér som PNG.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=26. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Pixel-editor. Tegn pixelkunst og eksportér som PNG. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-031 — Generativ plakat

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Lav geometriske plakater med et klik.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=27. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Generativ plakat. Lav geometriske plakater med et klik. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-032 — Trommemaskine

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Byg et beat i en 16-trins sequencer.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=28. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Trommemaskine. Byg et beat i en 16-trins sequencer. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-033 — Kalejdoskop

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Tegn symmetriske mønstre med musen.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=29. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Kalejdoskop. Tegn symmetriske mønstre med musen. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-034 — Partikellegeplads

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Leg med partikler der følger din markør.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=30. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Partikellegeplads. Leg med partikler der følger din markør. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-035 — Gradient-generator

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Bland farver og kopiér CSS.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=31. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Gradient-generator. Bland farver og kopiér CSS. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-036 — ASCII-kunst

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Lav tekstbaserede mønstre.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=32. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: ASCII-kunst. Lav tekstbaserede mønstre. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-037 — Fraktaltræ

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Udforsk et træ med justérbare grene.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=33. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Fraktaltræ. Udforsk et træ med justérbare grene. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-038 — Tegneblok

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Tegn med farver og gem dit billede.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=34. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Tegneblok. Tegn med farver og gem dit billede. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-039 — Lydlandskab

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Bland syntetiske naturlyde med Web Audio.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=35. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Lydlandskab. Bland syntetiske naturlyde med Web Audio. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-040 — Typografiplakat

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Eksperimentér med tekst, størrelse og afstand.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=36. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Typografiplakat. Eksperimentér med tekst, størrelse og afstand. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

## IDE-041 — Livets spil

### A · Grundlæggende idé
Ophav: AI-forslag fra den oprindelige backlog; ikke en personlig brugerprompt

Udforsk cellulære mønstre med Conway’s Game of Life.

### B · Status
- Status: kladde
- Tilføjet: —
- Startet: —
- Implementeret: —
- Udgivet: —
- App: —
- Deployment: —
- Noter: Importeret 2026-10-25 fra backlog.json, tidligere day=37. Eksisterende C er en kort seed-prompt og bør konkretiseres før bygning.

### C · Fuld konceptprompt
Lav en simpel webapp: Livets spil. Udforsk cellulære mønstre med Conway’s Game of Life. Brug HTML, CSS og JavaScript uden eksterne biblioteker. Gør den responsiv, tilgængelig med tastatur og anvendelig med touch. Tilføj tydelig hjælp og en nulstil-knap. Gem eventuelle personlige data lokalt i browseren.

