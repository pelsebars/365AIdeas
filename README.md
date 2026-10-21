# 365 AIdeas

Et års eksperiment: en ny, lille AI-genereret webapp hver dag. Ét samlet website med selvstændige apps, prompts og byggeforklaringer.

## Start lokalt

Kør `npm run dev` og åbn http://localhost:3000. Python 3 kræves til den lokale server; ingen afhængigheder skal installeres. `npm run check` validerer JavaScript, backlog og lokale links.

## Indhold

- `index.html`, `style.css`, `app.js`: hovedside med søgning og kategorier.
- `apps/space-invaders/`: første spil, med point, liv, bølger, pause og touch.
- `backlog.json`: 36 idéer med byggeprompts. Tallene er forslag til rækkefølge, ikke udgivelsesdatoer.
- `scripts/seed-backlog.py`: oprindelig seed. Kør den ikke igen efter manuelle ændringer i backloggen; den overskriver filen.

## Daglig arbejdsgang

1. Vælg en idé fra backloggen.
2. Brug prompten som brief og byg appen i `apps/<slug>/`.
3. Afprøv appen på mobil og desktop; tjek konsollen, tastatur, touch og nulstilling.
4. Vis den faktiske prompt, teknologien og eventuelle efterfølgende rettelser under appen. Angiv begrænsninger ærligt.
5. Flyt idéen fra backloggen til hovedsidens udgivne apps, og opdatér tæller og fremdrift. Det er manuelt i denne første version.
6. Kør `npm run check`, commit og push til produktionsbranchen.

## Vercel

Projektet er statisk og har `vercel.json`. Importér Git-repositoriet i Vercel som et projekt med preset **Other**, uden build command og med output directory `.`. Alle apps kan udgives under samme domæne, fx `/apps/space-invaders/`. Hvert push til produktionsbranchen kan dermed udgive næste app og opdatere hovedsiden samlet.

Git-repository: https://github.com/pelsebars/365AIdeas. Vercel er endnu ikke tilkoblet, og der er ikke foretaget offentlig deployment. Hostingkonfigurationen er ikke afprøvet mod en Vercel-konto.

## Udgivelsesplan

Startdato, klokkeslæt og automatisk kørsel er ikke fastsat. Backloggen har 36 startidéer, ikke 365 færdige apps. En daglig agentkørsel skal have adgang til repository og deployment og bør kun udgive efter sine kontroller. En tidsplan alene genererer ikke apps.

Websitet bruger Google Fonts som valgfri typografiforbedring med lokale fallback-skrifter. Spillet har ingen netværksafhængigheder og gemmer kun rekord i localStorage.
