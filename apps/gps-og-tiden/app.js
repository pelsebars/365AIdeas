(function () {
  'use strict';
  const P = GPSPhysics, V = GPSVisuals, {state: S} = GPSState, chapters = GPSChapters;
  const $ = id => document.getElementById(id), fmt = V.fmt, sign = V.signed;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animation = !reduced.matches, phase = 0.58, drag = null, last = performance.now(), painted = 0;
  const byId = (id, text) => { const el = $(id); if (el) el.textContent = text; };
  function range(id, label, min, max, step, value, unit = '') {
    return `<label for="${id}">${label}<output id="${id}-value" for="${id}">${fmt(value,step<1?1:0)} ${unit}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
  }
  const toggles = () => `<div class="two-toggles"><label class="toggle"><input id="gravity" type="checkbox" ${S.gravity?'checked':''}> Gravitation</label><label class="toggle"><input id="motion" type="checkbox" ${S.motion?'checked':''}> Bevægelse</label></div>`;
  const motionButton = () => `<button id="animate" aria-pressed="${animation}" ${reduced.matches?'disabled title="Din enhed er indstillet til reduceret bevægelse."':''}>${reduced.matches?'Reduceret bevægelse':animation?'Pause animation':'Vis animation'}</button>`;
  const clock = (label,id,color) => `<div class="clock"><span>${label}<span class="${color}">ATOMUR</span></span><time id="${id}"></time></div>`;
  function showMath() {
    const p = P.orbit(S.height);
    const math = {
      1: 'Δτ = t · (ΔΦ/c² − v²/(2c²))\nVed 20.200 km: Δτ ≈ 38,51 µs pr. døgn.\nReference: idealiseret overfladeur i ro.',
      2: `β = v/c = ${fmt(S.beta,2)}\nγ = 1/√(1 − β²) = ${fmt(P.gamma(S.beta),4)}\nΔt = γ · Δτ\nGPS: β ≈ 0,0000129, γ − 1 ≈ 8,35 · 10⁻¹¹.`,
      3: `r = R + h = ${fmt(p.r/1000,0)} km\nΦsat − Φjord = ${fmt((p.potential+P.GM/P.R)/1e6,3)} MJ/kg\nΔτgrav / døgn = ${sign(p.gravity,3)} µs\ngsat = ${fmt(p.acceleration,3)} m/s²`,
      4: 'Δτnetto = Δτgrav + Δτbev\n≈ (+45,7 − 7,2) µs/døgn\n≈ +38,5 µs/døgn (begge bidrag aktive).',
      5: `Δρ = c · Δt\n= 299.792.458 m/s · ${fmt(S.error,1)} · 10⁻⁶ s\n= ${fmt(P.lightDistance(S.error),2)} m`,
      6: 'ρᵢ = |sᵢ − p| + c · b\n2D: p = (x,y), plus modtagerens urfejl b.\n3D: p = (x,y,z), plus b → fire ukendte.\nSatellitternes urfejl antages allerede korrigeret.',
      7: `v = √(GM/r)\nΔτgrav = t · GM/c² · (1/R − 1/r)\nΔτbev = −t · GM/(2rc²)\nΔτnetto = 0 ⇒ r = 3R/2 ⇒ h = R/2\nR = 6.371.000 m; GM = 3,986004418 · 10¹⁴ m³/s²`
    };
    byId('math-content',math[S.chapter]);
  }
  function explanation() {
    const c = chapters[S.chapter-1];
    byId('explanation',c.levels[S.level-1]);
    byId('depth-label',['INTUITIVT · BEGYND MED OPLEVELSEN','GYMNASIUM · FORSTÅ SAMMENHÆNGEN','AVANCERET · MODELLEN OG DENS GRÆNSER'][S.level-1]);
    $('mathematics').hidden = S.chapter === 1 && S.level === 1;
    $('mathematics').open = S.level === 3;
    showMath();
  }
  function render(focus = false) {
    S.running = false;
    const c = chapters[S.chapter-1];
    $('chapters').innerHTML = chapters.map((ch,i)=>`<button data-chapter="${i+1}" ${S.chapter===i+1?'aria-current="step"':''} aria-label="Kapitel ${i+1}: ${ch.short}"><span>${String(i+1).padStart(2,'0')}</span>${ch.short}</button>`).join('');
    $('kicker').textContent = c.kicker;
    $('chapter-title').innerHTML = c.title;
    $('chapter-intro').textContent = c.intro;
    $('insight-title').textContent = c.result;
    $('level').value = S.level;
    $('previous').disabled = S.chapter===1;
    $('next').textContent = S.chapter===7?'Tilbage til begyndelsen ↺':'Næste kapitel →';
    byId('chapter-count',`${S.chapter} / 7`);
    let content = '';
    if (S.chapter===1) content = `<div class="stage-grid"><div class="cosmos"><span class="scene-stamp">ET EKSPERIMENT MED TO ATOMURE</span>${V.earthScene()}<span class="scene-foot">Banen er skematisk · højden er virkelig</span></div><div class="instrument"><p class="eyebrow">FORSKELLEN VOKSER</p><div id="clock-difference" class="readout aqua"></div><div class="unit-label">mikrosekunder foran jorduret</div>${clock('På Jordens overflade','earth-clock','blue')}${clock('I GPS-satellitten','space-clock','aqua')}<div class="controls"><div class="control-buttons"><button id="start" class="primary">Start begge ure ▶</button><button id="reset-clocks">Nulstil ↺</button></div>${range('speed','Døgn pr. sekund',.02,2,.02,S.speed)}<p class="hint" id="elapsed"></p><p class="hint">Cifrene efter punktummet er milliontedele sekunder. Ét døgn giver cirka 38,5 µs forskel.</p></div></div></div><div class="stage-caption"><span>Samme atomfysik. Forskellige forløb gennem rumtiden.</span><b>GPS-højde: 20.200 km</b></div>`;
    if (S.chapter===2) content = `<div class="stage-grid"><div class="light-visual" id="light-view">${V.lightClock(S.beta,phase)}</div><div class="instrument"><p class="eyebrow">EN LÆNGERE VEJ FOR LYSET</p><div id="gamma" class="readout orange"></div><span class="unit-label">så lang koordinattid for samme passage</span><div class="controls">${range('beta','Andel af lysets fart',0,.95,.01,S.beta,'c')}<div class="metric-row"><span>Fart i eksperimentet</span><strong id="light-speed"></strong></div><div class="metric-row"><span>GPS-satellit, til sammenligning</span><strong>3,9 km/s</strong></div><div class="control-buttons" style="margin-top:20px">${motionButton()}</div><p class="hint">Vi følger én passage fra nederste til øverste spejl. Figurens tid er strakt, så du kan følge lyset. γ angiver forholdet mellem de to målte tidsrum.</p></div></div></div><div class="stage-caption"><span>Lys bevæger sig med c i begge inertialsystemer.</span><b>GPS: ca. −7,2 µs/døgn fra bevægelse</b></div>`;
    if (S.chapter===3) content = `<div class="stage-grid"><div class="cosmos"><span class="scene-stamp">GRAVITATIONSPOTENTIALE · SKEMATISK FARVEFELT</span>${V.earthScene(S.height,true)}<span class="scene-foot">Mørkere: dybere potentiale · lysere: højere potentiale</span></div><div class="instrument"><p class="eyebrow">KUN GRAVITATIONSBIDRAGET</p><div class="readout aqua" id="gravity-rate"></div><span class="unit-label">µs pr. døgn foran jorduret</span><div class="controls">${range('height','Højde over overfladen',500,36000,.5,S.height,'km')}<div class="presets"><button data-height="500">Lav bane</button><button data-height="20200">GPS-højde</button><button data-height="36000">Høj bane</button></div><div class="metric-row"><span>Forskel i potentiale <span title="Energi pr. masse relativt til referenceuret. Enhed: megajoule pr. kilogram.">ⓘ</span></span><strong id="potential-value"></strong></div><div class="metric-row"><span>Tyngdeacceleration ved satellitten</span><strong id="acceleration"></strong></div><p class="hint">Kun gravitation vises her. Bevægelsen kommer med i næste kapitel. Træk satellitten lodret, eller brug skyderen.</p></div></div></div><div class="stage-caption"><span>Højere potentiale → hurtigere ur sammenlignet med jorduret.</span><b>Potentiale er ikke det samme som acceleration.</b></div>`;
    if (S.chapter===4) content = `<div class="stage-grid"><div class="balance-visual"><p class="eyebrow">ET DØGN I GPS-BANE</p><div id="balance-view">${V.balance(S.gravity,S.motion)}</div><p class="hint">Til venstre for nul: satellituret taber tid. Til højre: det vinder tid.</p></div><div class="instrument"><p class="eyebrow">DET SAMLEDE RESULTAT</p><div class="readout blue" id="balance-net"></div><span class="unit-label">µs pr. døgn relativt til jorduret</span><div class="controls">${toggles()}<div class="metric-row"><span>Gravitation</span><strong class="aqua" id="balance-gravity"></strong></div><div class="metric-row"><span>Bevægelse</span><strong class="orange" id="balance-motion"></strong></div><p class="hint">Højde: 20.200 km. Kontakterne isolerer effekterne i et tankeeksperiment. Banen er den samme.</p></div></div></div><div class="stage-caption"><span>Førsteordensbidragene lægges sammen med fortegn.</span><b>Begge bidrag: ≈ +38,5 µs/døgn</b></div>`;
    if (S.chapter===5) content = `<div class="stage-grid"><div class="distance-visual"><p class="eyebrow">HVOR LANGT NÅR LYSET?</p><div id="light-distance" class="readout aqua"></div><div class="unit-label">kilometer lysrejseafstand</div><div id="distance-view">${V.distancePulse(S.error,phase)}</div><p class="hint">På bare 1 µs når lyset 299,79 meter.</p></div><div class="instrument"><p class="eyebrow">ET LILLE ØJEBLIK. EN STOR AFSTAND.</p><div class="controls">${range('error','Tidsfejl',0,100,.1,S.error,'µs')}<div class="presets"><button data-error="1">1 µs</button><button data-error="38.5">Et GPS-døgn: 38,5 µs</button></div><div class="metric-row"><span>Afstandsækvivalent</span><strong id="range-error"></strong></div><div class="control-buttons" style="margin-top:20px">${motionButton()}</div><p class="hint"><strong>Afstand er ikke position.</strong> Den faktiske GPS-positionsfejl afhænger også af satellitgeometrien og modtagerens urkorrektion. 11,5 km er ikke en automatisk forskydning af din blå prik.</p></div></div></div><div class="stage-caption"><span>Δρ = c · Δt</span><b>Lys i vakuum: 299.792.458 m/s</b></div>`;
    if (S.chapter===6) content = `<div class="stage-grid"><div class="map-visual" id="map-view">${V.gpsMap(S,phase)}</div><div class="instrument"><p class="eyebrow">FIRE SIGNALER → POSITION + URFEJL</p><div class="unit-label" id="solved-position"></div><div class="controls">${range('bias','Modtagerens urfejl',-50,50,1,S.bias,'µs')}<label class="toggle"><input id="rings" type="checkbox" ${S.rings?'checked':''}> Vis korrigerede afstandscirkler</label><div class="control-buttons">${motionButton()}<button id="center-receiver">Centrér modtager</button></div><table class="signal-table"><thead><tr><th>Signal</th><th>Rejsetid, ms</th><th>Pseudorange, km</th></tr></thead><tbody id="signals"></tbody></table><p class="hint" id="solved-bias"></p><p class="hint">Cirklerne er afstande efter urkorrektion. Flyt modtageren med træk eller piletaster. Tabellen viser hver signals rejsetid og afstandsmål før modtagerens urkorrektion.</p></div></div></div><div class="stage-caption"><span>2D: x, y og urfejl → tre ukendte. Her bruges fire signaler.</span><b>Virkelig GPS: 3D + urfejl → fire ukendte</b></div>`;
    if (S.chapter===7) content = `<div class="stage-grid"><div class="lab-chart"><div class="lab-header"><p class="eyebrow">URENES FORSKEL SOM FUNKTION AF HØJDEN</p><span>Vælg også ved at klikke på grafen</span></div><div class="lab-legend"><span>Gravitation</span><span class="motion">Bevægelse</span><span class="net">Netto</span></div><div id="chart-view">${V.chart(S.height,S.gravity,S.motion)}</div><div class="readout blue" id="lab-rate"></div><div class="unit-label">µs pr. døgn · satellitur relativt til jordur</div><p class="hint" id="balance-hint"></p></div><div class="instrument"><p class="eyebrow">DIT RELATIVITETSLABORATORIUM</p><div class="controls">${range('height','Højde over overfladen',500,36000,.5,S.height,'km')}<div class="presets"><button data-height="500">500 km</button><button data-height="20200">GPS</button><button data-height="3185.5">Find balance</button></div>${range('labDays','Simulationstid',0,30,.1,S.labDays,'døgn')}${toggles()}<div class="metric-row"><span>Orbitalhastighed</span><strong id="lab-velocity"></strong></div><div class="metric-row"><span>Gravitation pr. døgn</span><strong class="aqua" id="lab-gravity"></strong></div><div class="metric-row"><span>Bevægelse pr. døgn</span><strong class="orange" id="lab-motion"></strong></div><div class="metric-row"><span>Akkumuleret tidsforskel</span><strong id="lab-accumulated"></strong></div><div class="metric-row"><span>Lysrejseafstand, |c · Δt|</span><strong id="lab-distance"></strong></div><p class="hint">Cirkulær bane: højden bestemmer hastigheden. Afstandsækvivalenten er ikke en beregnet positionsfejl.</p></div></div></div><div class="stage-caption"><span>Samme model i alle kapitler. Ændr én antagelse ad gangen.</span><b>Ideel balance: h = R/2 = 3.185,5 km</b></div>`;
    $('experiment').innerHTML = content;
    explanation(); update(); GPSState.saveURL();
    if (focus) $('chapter-title').focus({preventScroll:true});
  }
  function timeString(days,offset) {
    let microseconds = Math.round(days * P.DAY * 1e6) + Math.round(offset);
    const day = Math.floor(microseconds / (P.DAY*1e6));
    microseconds -= day * P.DAY*1e6;
    const seconds = Math.floor(microseconds / 1e6);
    const h=String(Math.floor(seconds/3600)).padStart(2,'0'),m=String(Math.floor(seconds/60)%60).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');
    return `${day?day+'d ':''}${h}:${m}:${s}.${String(microseconds%1e6).padStart(6,'0')}`;
  }
  function repaintMap() {
    const focused = document.activeElement?.id==='receiver';
    $('map-view').innerHTML = V.gpsMap(S,phase);
    if (focused) $('receiver').focus({preventScroll:true});
  }
  function update() {
    if (S.chapter===1) {
      const e=P.experiment(P.GPS_HEIGHT,S.days);
      byId('clock-difference',sign(e.microseconds,1));
      byId('earth-clock',timeString(S.days,0)); byId('space-clock',timeString(S.days,e.microseconds));
      byId('elapsed',`${fmt(S.days,3)} simulerede døgn · cirka ${fmt(S.days*24,2)} timer`);
      byId('speed-value',`${fmt(S.speed,2)} døgn/s`);
    }
    if (S.chapter===2) {
      byId('gamma',`${fmt(P.gamma(S.beta),2)} ×`); byId('beta-value',`${fmt(S.beta,2)} c`);
      byId('light-speed',`${fmt(S.beta*P.C/1000,0)} km/s`);
      $('light-view').innerHTML=V.lightClock(S.beta,phase);
    }
    if (S.chapter===3) {
      const p=P.orbit(S.height), y=248-(S.height-500)/35500*150;
      byId('height-value',`${fmt(S.height,0)} km`); byId('gravity-rate',sign(p.gravity,2));
      byId('potential-value',`${sign((p.potential+P.GM/P.R)/1e6,2)} MJ/kg`); byId('acceleration',`${fmt(p.acceleration,3)} m/s²`);
      $('orbit-satellite').setAttribute('transform',`translate(491 ${y})`); $('orbit-satellite').setAttribute('aria-valuenow',S.height);
      $('height-line').setAttribute('d',`M342 272L491 ${y}`); byId('orbit-height',`${fmt(S.height,0)} km`);
    }
    if (S.chapter===4) {
      const p=P.experiment(P.GPS_HEIGHT,1,S.gravity,S.motion);
      byId('balance-net',sign(p.rate,1)); byId('balance-gravity',S.gravity?`${sign(p.gravity)} µs/døgn`:'Slået fra'); byId('balance-motion',S.motion?`${sign(p.motion)} µs/døgn`:'Slået fra');
      $('balance-view').innerHTML=V.balance(S.gravity,S.motion);
    }
    if (S.chapter===5) {
      byId('error-value',`${fmt(S.error,1)} µs`); byId('light-distance',fmt(P.lightDistance(S.error)/1000,2)); byId('range-error',`${fmt(P.lightDistance(S.error),0)} m`);
      $('distance-view').innerHTML=V.distancePulse(S.error,phase);
    }
    if (S.chapter===6) {
      const signals=P.signals(S.receiver.x,S.receiver.y,S.bias), solution=P.locate(signals.map(x=>x.pseudoKm));
      byId('bias-value',`${sign(S.bias,0)} µs`);
      byId('solved-position',`Beregnet position: x = ${fmt(solution.x*P.MAP_KM,0)} km · y = ${fmt(solution.y*P.MAP_KM,0)} km`);
      const predicted=P.signals(solution.x,solution.y,solution.biasUs);
      const residual=Math.max(...signals.map((s,i)=>Math.abs(s.pseudoKm-predicted[i].pseudoKm)))*1000;
      byId('solved-bias',`Beregnet urfejl: ${sign(solution.biasUs,2)} µs · største residual ${fmt(residual,2)} m.`);
      $('signals').innerHTML=signals.map(s=>`<tr><td>S${s.id}</td><td>${fmt(s.travelMs,3)}</td><td>${fmt(s.pseudoKm,2)}</td></tr>`).join('');
    }
    if (S.chapter===7) {
      const p=P.experiment(S.height,S.labDays,S.gravity,S.motion);
      byId('height-value',`${fmt(S.height,S.height%1?1:0)} km`); byId('labDays-value',`${fmt(S.labDays,1)} døgn`);
      byId('lab-rate',sign(p.rate,2)); byId('lab-velocity',`${fmt(p.velocity/1000,3)} km/s`);
      byId('lab-gravity',S.gravity?`${sign(p.gravity,2)} µs`:'Slået fra'); byId('lab-motion',S.motion?`${sign(p.motion,2)} µs`:'Slået fra');
      byId('lab-accumulated',`${sign(p.microseconds,2)} µs`); byId('lab-distance',`${fmt(Math.abs(p.distance)/1000,3)} km`);
      byId('balance-hint',S.gravity&&S.motion?(Math.abs(p.rate)<.1?'Du har fundet balancen: urene følges næsten ad.':p.rate>0?'Satellituret kommer foran. Prøv en lavere bane.':'Satellituret kommer bagud. Prøv en højere bane.'):'Slå begge bidrag til for at lede efter en højde, hvor de ophæver hinanden.');
      $('chart-view').innerHTML=V.chart(S.height,S.gravity,S.motion);
    }
    showMath();
  }
  function go(chapter) { drag=null; S.chapter=chapter; render(true); $('chapters').scrollIntoView({block:'start',behavior:'instant'}); }
  function setHeight(height) {
    S.height=Math.max(500,Math.min(36000,height));
    if ($('height')) $('height').value=S.height;
    update();
  }
  $('chapters').addEventListener('click',event=>{const b=event.target.closest('[data-chapter]');if(b)go(Number(b.dataset.chapter));});
  $('previous').addEventListener('click',()=>{if(S.chapter>1)go(S.chapter-1);});
  $('next').addEventListener('click',()=>go(S.chapter===7?1:S.chapter+1));
  $('level').addEventListener('change',()=>{S.level=Number($('level').value);explanation();GPSState.saveURL();});
  $('restart').addEventListener('click',()=>{GPSState.reset();phase=.58;render(true);window.scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'});});
  window.addEventListener('hashchange',()=>{GPSState.readURL();render();});
  $('experiment').addEventListener('input',event=>{
    const {id,value,checked}=event.target;
    if (['speed','beta','height','error','labDays','bias'].includes(id)) S[id]=Number(value);
    if (['gravity','motion','rings'].includes(id)) S[id]=checked;
    if (S.chapter===6 && ['bias','rings'].includes(id)) repaintMap();
    update();
  });
  $('experiment').addEventListener('click',event=>{
    const button=event.target.closest('button');
    if (button) {
      if (button.id==='start') {S.running=!S.running;button.textContent=S.running?'Pause urene Ⅱ':'Fortsæt ▶';}
      if (button.id==='reset-clocks') {S.days=0;S.running=false;byId('start','Start begge ure ▶');}
      if (button.id==='animate') {animation=!animation;button.textContent=animation?'Pause animation':'Vis animation';button.setAttribute('aria-pressed',animation);}
      if (button.id==='center-receiver') {S.receiver={x:390,y:270};repaintMap();}
      if (button.dataset.height) setHeight(Number(button.dataset.height));
      if (button.dataset.error) {S.error=Number(button.dataset.error);$('error').value=S.error;}
      update();
    }
    if (event.target.id==='chart-hit') {
      const point=svgPoint($('correction-chart'),event);
      setHeight(Math.round(500+(point.x-55)/(645-55)*35500));
    }
  });
  function svgPoint(svg,event) {
    const point=svg.createSVGPoint(); point.x=event.clientX;point.y=event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  }
  $('experiment').addEventListener('pointerdown',event=>{
    if (event.button!==0) return;
    const target=event.target.closest('#receiver, #orbit-satellite');
    if (!target) return;
    event.preventDefault();
    target.focus({preventScroll:true});
    drag={type:target.id, pointer:event.pointerId};
    $('experiment').setPointerCapture(event.pointerId);
  });
  $('experiment').addEventListener('pointermove',event=>{
    if (!drag || drag.pointer!==event.pointerId) return;
    if (drag.type==='receiver') {
      const point=svgPoint($('gps-map'),event);
      S.receiver={x:Math.max(120,Math.min(670,point.x)),y:Math.max(120,Math.min(380,point.y))};
      repaintMap();update();
    } else {
      const svg=$('orbit-satellite').ownerSVGElement,point=svgPoint(svg,event);
      setHeight(Math.round(500+(248-point.y)/150*35500));
    }
  });
  for (const type of ['pointerup','pointercancel','lostpointercapture']) $('experiment').addEventListener(type,()=>{drag=null;});
  document.addEventListener('keydown',event=>{
    const id=event.target.id, arrows=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'];
    if (id==='orbit-satellite' && arrows.includes(event.key)) {
      event.preventDefault();setHeight(S.height+(event.key==='ArrowUp'||event.key==='ArrowRight'?1:-1)*(event.shiftKey?1000:100));return;
    }
    if (id==='receiver' && arrows.includes(event.key)) {
      event.preventDefault();const d=event.shiftKey?20:5;
      S.receiver.x=Math.max(120,Math.min(670,S.receiver.x+(event.key==='ArrowLeft'?-d:event.key==='ArrowRight'?d:0)));
      S.receiver.y=Math.max(120,Math.min(380,S.receiver.y+(event.key==='ArrowUp'?-d:event.key==='ArrowDown'?d:0)));
      repaintMap();update();return;
    }
    if (event.target.closest('input,select,textarea,button,summary,[tabindex="0"]') || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key==='ArrowRight' && S.chapter<7) {event.preventDefault();go(S.chapter+1);}
    if (event.key==='ArrowLeft' && S.chapter>1) {event.preventDefault();go(S.chapter-1);}
  });
  reduced.addEventListener('change',event=>{if(event.matches)animation=false;const button=$('animate');if(button){button.disabled=event.matches;button.textContent=event.matches?'Reduceret bevægelse':animation?'Pause animation':'Vis animation';button.setAttribute('aria-pressed',String(animation));}});
  function frame(now) {
    const dt=Math.min(.15,Math.max(0,(now-last)/1000));last=now;
    if (!document.hidden) {
      if (S.running && S.chapter===1) {S.days=Math.min(3650,S.days+dt*S.speed);if(S.days===3650){S.running=false;byId('start','Fortsæt ▶');}}
      if (animation && !reduced.matches) phase=(phase+dt*.34)%1;
      if (now-painted>80) {
        if(S.running&&S.chapter===1) update();
        if(animation&&!reduced.matches) {
          if(S.chapter===2) $('light-view').innerHTML=V.lightClock(S.beta,phase);
          if(S.chapter===5) $('distance-view').innerHTML=V.distancePulse(S.error,phase);
          if(S.chapter===6) {byId('signal-time',`Sendt: 0 ms · nu: ${fmt(phase*100,1)} ms · slowmotion`); document.querySelectorAll('.signal-pulse').forEach((dot,i)=>{const sat=P.SATELLITES[i], travelMs=Math.hypot(sat.x-S.receiver.x,sat.y-S.receiver.y)*P.MAP_KM*1e6/P.C, progress=Math.min(1,phase*100/travelMs);dot.setAttribute('cx',sat.x+(S.receiver.x-sat.x)*progress);dot.setAttribute('cy',sat.y+(S.receiver.y-sat.y)*progress);});}
        }
        painted=now;
      }
    }
    requestAnimationFrame(frame);
  }
  render();requestAnimationFrame(frame);
})();
