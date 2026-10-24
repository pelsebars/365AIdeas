# GPS, Einstein og tidens mysterium

Åbn `/apps/gps-og-tiden/` med projektets lokale server (`npm run dev`). Oplevelsen har syv kapitler og tre forklaringsniveauer. Kapitel og niveau gemmes i URL-fragmentet, eksempelvis `#kapitel=7&niveau=3`.

## Arkitektur

- `physics.js`: rene funktioner for cirkulære baner, urbidrag, lysrejseafstand, lysurets gammafaktor og en numerisk 2D-positionsløsning med modtagerurfejl. SI-enheder internt; funktionsnavne og returfelter dokumenterer grænsefladen. Banehøjde indlæses i km, tid i døgn, urbidrag returneres i µs/døgn.
- `state.js`: simulationstilstand, nulstilling og URL-navigation.
- `chapters.js`: de syv kapitlers indhold og tre forklaringsniveauer.
- `visuals.js`: SVG-visualiseringer, uafhængigt af navigation og DOM-opdateringer.
- `app.js`: navigation, hændelser, opdatering af instrumenter og animationsløkke.
- `style.css`: tema, responsivt layout og indstilling til reduceret bevægelse.
- `index.html`: tilgængelig grundstruktur, kilder og integration til hovedsiden.
- `original-prompt.txt`: menneskets korte, oprindelige idé, gengivet ordret.
- `concept.txt`: den komplette byggeprompt, udbygget af AI i en separat chat og efterfølgende indsat som brief her; uændret.

Der er ingen biblioteker, buildkrav eller netværksafhængigheder. Klassiske scripts er indkapslet og indlæses i rækkefølge. Det gør den samme kode kompatibel med projektets eksisterende HTML-downloadbygger. Nye kapitler tilføjes i indholdslisten og får en visning/hændelseshåndtering i appen; fysikmotoren genbruges.

## Model og afgrænsning

R = 6.371.000 m, GM = 3,986004418 · 10¹⁴ m³/s² og c = 299.792.458 m/s. Førsteordens svagt-felts-model med sfærisk, ikke-roterende Jord, cirkulær satellitbane og et idealiseret overfladeur i ro. Rotation, excentricitet, Sagnac, atmosfære og operationelle GPS-korrektioner udelades. GPS-eksemplet ved 20.200 km giver +45,724 og −7,211 µs/døgn; netto +38,514. Balancehøjden er R/2 = 3.185,5 km. Lysrejseafstand er ikke en beregnet positionsfejl.

Kapitel 6 bruger fire satellitter i et fiktivt fladt 2D-system. Position og urfejl findes ved Gauss–Newton/mindste kvadrater fra pseudorange; løsningen modtager ikke de kendte koordinater. Målingerne er støjfri og satelliturenes korrektion antages anvendt. Animationen følger signalernes forskellige rejsetider, gengivet i slowmotion. Lysuret viser samme hændelser i to inertialsystemer med forskellige tidsakser; animationerne synkroniseres efter passagen. Tegningerne er skematiske.

## Integration og kontrol

Forsiden indeholder eksperiment 004, begge prompts og byggeforklaring. Den korte, menneskeskrevne idé vises direkte i byggeforklaringen. Den fulde AI-udbyggede byggeprompt kan foldes ud samme sted. Begge kan også åbnes som tekstfiler, og deres ophav er tydeligt markeret. Ingen backlogidé er fjernet, da konceptet er nyt. Kør `npm run build` efter ændringer for at samle `gps-og-tiden.html`, som kan åbnes direkte uden server. Kør derefter `npm run check`. `scripts/check-gps.mjs` kontrollerer GPS-standardtal, gamma og lysurets geometri, fortegn, monotonitet, tidsakkumulering, balancehøjde, ugyldige input og 60 positionsløsninger med urfejl.

Browserkontrol den 24. oktober 2026: syv kapitler på desktop (1280 × 720) og mobilviewport (390 × 844), urenes start/pause, højde og tastatur, bidragenes kontakter, lysrejseafstand, flytning af modtager med træk og tastatur, modtagerurfejl, laboratoriets balance, simulationstid og forklaringsniveauer. Ingen vandret sideoverløb eller dublerede id'er i de syv mobilvisninger. Kapitel/niveau overlever genindlæsning. Mobilkontrollen er i browser, ikke på en fysisk telefon. Faglige primærkilder findes i appens kildeafsnit.

HTML-downloadens indlejrede scripts er syntakskontrolleret, og filen har ingen eksterne script- eller stilreferencer. Direkte browserafprøvning via en lokal file-URL var blokeret af testbrowserens URL-politik; de interaktive browserprøver ovenfor bruger den lokale webserver. Reduceret bevægelse er implementeret med `prefers-reduced-motion`, men er ikke emuleret i browserprøven.
