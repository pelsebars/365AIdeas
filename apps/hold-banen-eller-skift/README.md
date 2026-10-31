# Hold banen eller skift?

Selvstændig kopi af IDE-046’s model, ikke en import af dens brugerflade. base.js bevarer forsinkede observationer, ballistisk integration, skiftesikkerhed og kollisionsstop. Kopien ændrer vejlængde til 3 km, seed/ID-baserede førerdata, FIFO-ankomstplan og særskilt forsøgspolitik. model.js udpeger bilen efter 30 s og måler 2 km med interpoleret passage. app.js styrer kun portioner, rendering og rapportering.

Ankomster planlægges efter simulationstiden, uafhængigt af skiftebeslutninger. Hver ankomst får fast ID, bane og fartønske før eventuel ventetid. De to verdener kan have forskellig ventekø og forskellige reaktioner, men samme eksogene input. Serieknappen forskyder seed med 0–5 og startbane cyklisk. Ingen automatisk konklusion om en bestemt strategi.

Grænser: 300 s pr. par, fire ensrettede spor uden ramper, én biltype, ingen kalibrering mod observationsdata. Sikkerhedsreglen er inspireret af MOBIL, ikke fuld MOBIL. Der er ingen skjulte kollisionskorrektioner. Graf og statistik inkluderer kun faktiske data; ugyldige par vises særskilt. Starttætheden er en valgt begyndelsestilstand; 30 s er indkøring, ikke garanti for stationær trafik. Tegnede biler er forstørrede. Ingen permanent lagring.

Kør fra repositoryroden: npm run build, npm run check, npm run test:runner og npm run test:browser. scripts/check-hold-banen-eller-skift.mjs kontrollerer bl.a. nulreference, planlighed, sikre skift og passage. Browserprøven dækker app og selvstændig offlinefil i desktop-/mobilprojekterne. Primærkilder står i appens fysikafsnit.
