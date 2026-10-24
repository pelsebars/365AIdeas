(function (root) {
  'use strict';
  root.GPSChapters = [
    {short: 'To ure', kicker: '01 / OBSERVATIONEN', title: 'Kan to perfekte ure<br>være <em>uenige?</em>',
      intro: 'Det ene bliver på Jorden. Det andet tager i kredsløb. Start dem samtidig — og se tiden skille dem ad.',
      result: 'Begge ure går rigtigt. Alligevel kommer satellittens ur foran. Hvorfor?',
      levels: [
        'Et atomur tæller meget stabile svingninger i atomer. To ens ure kan måle forskellige tidsrum mellem sammenlignede hændelser. Ved GPS-højde vinder satellituret omkring 38,5 milliontedele sekund i døgnet. Forskellen er lille nok til at være usynlig i hverdagen og stor nok til at betyde noget for GPS.',
        'Vi sammenligner urenes tidsvisning efter samme tidsrum på referenceuret ved Jorden. 1 µs er 0,000001 sekund. Forskellen beregnes særskilt fra den store, fælles tid, så små tal ikke forsvinder i afrunding. Skyderen vælger antal simulerede døgn pr. virkeligt sekund.',
        'Egentid er den tid, et ur måler langs sin egen verdenslinje. Sammenligning af adskilte ure kræver et valg af referencesystem og en synkroniseringsprocedure. Her bruges en idealiseret, ikke-roterende Jord med et overfladeur i ro og en cirkulær satellitbane. Diagrammet viser beregnede urforskelle uden signalernes rejsetid.']},
    {short: 'Bevægelse', kicker: '02 / LYSURET', title: 'Når vejen bliver længere,<br>må tiden <em>følge med.</em>',
      intro: 'En lyspuls mellem to spejle er et ur. Set udefra bevæger spejlene sig, mens lyset er på vej. Prøv at skrue op for farten.',
      result: 'Lysets fart er den samme. Den længere vej kræver længere tid set udefra.',
      levels: [
        'Til venstre ser du lysuret fra dets eget system. Til højre ses samme lysur fra et system, hvor det bevæger sig mod højre. Vi følger samme udsendelse og modtagelse. I det andet system tager turen længere tid. Skyderen går tæt på lysets fart, så forskellen bliver tydelig. En GPS-satellit bevæger sig kun cirka 3,9 km/s: her er bidraget omtrent −7,2 µs pr. døgn.',
        'Spejlafstanden er L i begge systemer, da bevægelsen er vinkelret på den. Pythagoras giver (c·Δt)² = L² + (v·Δt)², så Δt = γ·Δτ, hvor γ = 1/√(1 − v²/c²). Δτ = L/c er egentiden for én passage; Δt er koordinattiden i det system, hvor uret bevæger sig.',
        'Figuren sammenligner samme to hændelser i to inertialsystemer; de sideordnede billeder er ikke en fælles samtidighedsflade. I urets hvilesystem sker begge hændelser samme sted. Inertialbevægelse er symmetrisk: hver inertialobservatør ser den andens ur gå langsommere efter sin synkroniseringskonvention. GPS-sammenligningen er derimod mellem forskellige baner i Jordens rumtid.']},
    {short: 'Gravitation', kicker: '03 / HØJDEN', title: 'Højere oppe får tiden<br>lidt mere <em>plads.</em>',
      intro: 'Træk satellitten væk fra Jorden. Her isolerer vi gravitationen, så du kan se ét bidrag ad gangen.',
      result: 'Det er forskellen i gravitationspotentiale, der bestemmer urenes relative gang.',
      levels: [
        'Et ur ved Jordens overflade går langsommere end et ur højere oppe, når vi sammenligner deres gang. Tænk på potentialet som et landskabs højde: det beskriver placeringen i gravitationsfeltet. Tyngdeaccelerationen svarer til landskabets hældning. Højde og hældning er forskellige størrelser. Farven viser potentialet, ikke en fysisk membran.',
        'For en kugleformet Jord er potentialet Φ = −GM/r, med nul uendeligt langt væk. Urenes relative forskel er Δτ/t ≈ (Φsat − Φjord)/c². Tyngdeaccelerationen er derimod g = GM/r². To størrelser med forskellige enheder: potentiale måles i J/kg, acceleration i m/s².',
        'Stationære ure i et statisk felt har dτ/dt = √(1 + 2Φ/c²) i svagt-felts-grænsen. Ved at sammenligne to højder og beholde første orden fås Δτ/t ≈ ΔΦ/c². Dette kapitel isolerer stationære ures gravitationelle bidrag. Den illustrerede satellits nødvendige orbitalbevægelse tilføjes i næste kapitel.']},
    {short: 'Balancen', kicker: '04 / SAMMENHÆNGEN', title: 'To effekter.<br>Én <em>overraskelse.</em>',
      intro: 'Bevægelsen bremser satellituret. Højden får det til at gå hurtigere. Slå bidragene til og fra, og se hvad der vinder.',
      result: 'Ved GPS-højde vinder gravitationen. Satellittens ur går samlet hurtigere.',
      levels: [
        'Med begge effekter slået til kommer GPS-uret cirka 38,5 µs foran på ét døgn. Kontakterne er et tankeeksperiment: de gør det muligt at skille bidragene ad, selv om de begge findes i virkeligheden. Plus betyder, at satellituret kommer foran jorduret; minus betyder, at det kommer bagud.',
        'Ved højden 20.200 km giver den fælles model +45,7 µs/døgn fra gravitation og −7,2 µs/døgn fra bevægelse efter afrunding. Vi lægger de små førsteordensbidrag sammen. Netto er cirka +38,5 µs/døgn, og ikke summen af bidragenes absolutte størrelser.',
        'Referencen er et idealiseret overfladeur i ro i et geocentrisk, ikke-roterende system. Jordens rotation og geoidens form er udeladt. Tallene er derfor undervisningsmodellens omtrentlige GPS-tal, ikke en fuld operationel korrektion. Et virkeligt GPS-system bruger en fast frekvensforskydning samt udsendte urparametre og baneafhængige korrektioner.']},
    {short: 'Mikrosekunder', kicker: '05 / KONSEKVENSEN', title: 'Et øjeblik for dig.<br><em>Kilometer</em> for lyset.',
      intro: '“38 mikrosekunder. Det lyder da fuldstændig ligegyldigt?” Lad lyset vise, hvor langt et lille øjeblik rækker.',
      result: 'Et præcist afstandsmål kræver et præcist tidsmål. Milliontedele sekunder tæller.',
      levels: [
        'På ét mikrosekund bevæger lys sig næsten 300 meter. GPS måler på signalers rejsetid, så selv en lille tidsfejl kan give en stor afstandsfejl. De viste kilometer er en afstandsækvivalent. De er ikke automatisk fejlen i den position, din telefon viser.',
        'Afstandsækvivalenten er Δρ = c·Δt. For 38,5 µs bliver det 299.792.458 m/s · 0,0000385 s ≈ 11,54 km. Animationen er en langsom gengivelse af en impuls fra udsendelsen frem til den valgte tid; den viser ikke lys ved virkelig hastighed.',
        'En pseudorange indeholder geometrisk afstand og modtagerens og satellittens urafvigelser. Et fælles bidrag i alle pseudorange kan i vidt omfang optages i modtagerens estimerede urfejl. Den faktiske positionsfejl afhænger af satellitgeometri, forskellige urfejl og modtagerens løsning. Derfor kan c·Δt ikke generelt oversættes til en entydig positionsfejl.']},
    {short: 'Find positionen', kicker: '06 / POSITIONEN', title: 'Din blå prik er<br>et <em>regnestykke.</em>',
      intro: 'Flyt modtageren i kortet. Fire tidskodede signaler fortæller både, hvor den er, og hvor forkert dens ur går.',
      result: 'I 3D skal GPS finde fire ukendte: x, y, z og modtagerens urfejl.',
      levels: [
        'Hver satellit sender tidspunkt og oplysninger om sin bane. Modtageren sammenholder afsendelse med modtagelse. Rejsetid gange lysets fart giver et afstandsmål. Men modtagerens ur er upræcist, så målet kaldes en pseudorange. Cirklerne viser de korrigerede afstande; de mødes ved modtageren. Kortet er et frit 2D-tankeeksperiment, ikke virkelige satellitbaner.',
        'I denne 2D-model løses tre ukendte: x, y og urfejl b. Tre velplacerede satellitter kan være nok; den fjerde giver en ekstra måling. I den virkelige 3D-model er der fire ukendte, så der behøves mindst fire uafhængige signaler med egnet geometri. Justér urfejlen: pseudorange ændrer sig, mens den løste position forbliver på stedet.',
        'Vi genererer ρᵢ = √((x−xᵢ)² + (y−yᵢ)²) + c·b og løser position og b numerisk ved mindste kvadrater, uden at give løsningen modtagerens koordinater. Målingerne er støjfri og satelliturene antages korrigeret. Virkelig GPS inkluderer signalernes sendetidspositioner, atmosfære, relativistiske urkorrektioner og Jordens rotation under signalrejsen.']},
    {short: 'Laboratoriet', kicker: '07 / DIT EKSPERIMENT', title: 'Kan du få tiden til<br>at gå i <em>balance?</em>',
      intro: 'Vælg en bane. Giv den tid. Find det sted, hvor bevægelse og gravitation præcis ophæver hinanden i modellen.',
      result: 'Omkring 3.186 km over overfladen er nettoforskellen nul i denne forenklede model.',
      levels: [
        'Højden bestemmer også hastigheden i en cirkulær bane. Lave baner kræver højere fart og kan få satellituret til at gå langsommere end jorduret. Høje baner giver det modsatte. Grafen viser urenes forskel pr. døgn; den valgte simulationstid bestemmer, hvor meget forskellen når at vokse.',
        'Vi bruger v = √(GM/r), r = R + h og Δτgrav = t·GM/c²·(1/R − 1/r). Bevægelsen bidrager Δτbev = −t·GM/(2rc²). Med begge bidrag bliver netto nul ved r = 3R/2, altså h = R/2 = 3.185,5 km. Klik på grafen eller brug skyderen til at undersøge området.',
        'Førsteordens, svagt-felts-approksimation i en kuglesymmetrisk, statisk Jordmodel med et referenceur i ro ved middelradius R = 6.371 km. GM = 3,986004418·10¹⁴ m³/s² og c = 299.792.458 m/s. Vi udelader rotation, excentricitet, Sagnac-effekt, atmosfære og operationelle urkorrektioner. Kontakterne isolerer matematiske led; de ændrer ikke orbitalhastigheden.']}
  ];
})(globalThis);
