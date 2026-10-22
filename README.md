# 365 AIdeas

Et års eksperiment: en ny, lille AI-genereret webapp hver dag. Ét samlet website med selvstændige apps, prompts og byggeforklaringer.

## Start lokalt

Kør `npm run dev` og åbn http://localhost:3000. Python 3 kræves til den lokale server; ingen afhængigheder skal installeres. `npm run check` validerer JavaScript, backlog og lokale links.

## Indhold

- `index.html`, `style.css`: hovedside med udgivne apps og deres byggeforklaringer.
- `apps/space-invaders/`: første spil, med point, liv, bølger, pause og touch.
- `apps/paa-kanten-af-kaos/`: interaktiv logistisk afbildning med worker, zoom, guidede stop og tidsserier.
- `backlog.json`: intern backlog med 36 idéer og byggeprompts; vises ikke på hjemmesiden. Tallene er forslag til rækkefølge, ikke udgivelsesdatoer.
- `scripts/seed-backlog.py`: oprindelig seed. Kør den ikke igen efter manuelle ændringer i backloggen; den overskriver filen.

## Daglig arbejdsgang

1. Vælg en idé fra backloggen.
2. Brug prompten som brief og byg appen i `apps/<slug>/`.
3. Afprøv appen på mobil og desktop; tjek konsollen, tastatur, touch og nulstilling.
4. Vis den faktiske prompt, AI-værktøj, model, teknologien og eventuelle efterfølgende rettelser under appen. Angiv kun indsatsniveau, når det er kendt. Angiv begrænsninger ærligt.
5. Flyt idéen fra backloggen til hovedsidens udgivne apps, og opdatér tæller og fremdrift. Det er manuelt i denne første version.
6. Kør `npm run check`, commit og push til produktionsbranchen.

## Vercel

Projektet er statisk og har `vercel.json`. Importér Git-repositoriet i Vercel som et projekt med preset **Other**, uden build command og med output directory `.`. Alle apps kan udgives under samme domæne, fx `/apps/space-invaders/`. Hvert push til produktionsbranchen kan dermed udgive næste app og opdatere hovedsiden samlet.

Git-repository: https://github.com/pelsebars/365AIdeas. Vercel er tilkoblet Git-repositoriet og udgiver fra `main`. Den offentlige side er https://365aideas.vercel.app. Tilkoblingen er verificeret via GitHubs Vercel-status og HTTP 200 fra den offentlige side. Efter push skal Vercel-status og den faktiske offentlige app kontrolleres; et push alene dokumenterer ikke en deployment.

## Udgivelsesplan

Startdato, klokkeslæt og automatisk kørsel er ikke fastsat. Backloggen har 36 startidéer, ikke 365 færdige apps. En daglig agentkørsel skal have adgang til repository og deployment og bør kun udgive efter sine kontroller. En tidsplan alene genererer ikke apps.

Websitet bruger Google Fonts som valgfri typografiforbedring med lokale fallback-skrifter. Spillet har ingen netværksafhængigheder og gemmer kun rekord i localStorage.

## På kanten af kaos

Åbn `/apps/paa-kanten-af-kaos/`. Appen kræver en webserver (fx `npm run dev`), da beregningen kører i en Web Worker. Klik vælger r, træk zoomer, scroll eller +/− zoomer, og Shift+piletaster flytter udsnittet. Piletaster uden Shift ændrer r. På mobil bruges knapperne eller markeringstilstanden; almindelig berøring tillader rulning af siden. Forældede workers termineres ved nye beregninger.

`npm run check` finder automatisk apps og deres JavaScript og lokale HTML-links, validerer en variabel backlogstørrelse, tæller og fremdrift samt de guidede periodiske eksempler og en positiv numerisk Lyapunov-eksponent ved r = 3,9. Den numeriske kontrol supplerer primærkilderne i appen; den er ikke et generelt kaosbevis. Konceptet fandtes ikke i backloggen, så ingen backlogidé er fjernet.

Seneste browserafprøvning (22. oktober 2026): desktop 1280×720 og mobilviewport 390×844. Alle seks stop, markering, scrollzoom, zoomknapper, tilbage/nulstilling, tastatur, præcis r, x₀ = 0, tidsseriens to faser, sammenligning og navigation til/fra oversigten er afprøvet. Ingen observerede konsolfejl eller vandret overløb. Mobiltesten er udført i en browserviewport, ikke på en fysisk telefon.
