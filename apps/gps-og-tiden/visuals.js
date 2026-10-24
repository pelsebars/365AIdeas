(function (root) {
  'use strict';
  const P = root.GPSPhysics;
  const fmt = (n, digits = 1) => n.toLocaleString('da-DK', {minimumFractionDigits: digits, maximumFractionDigits: digits});
  const signed = (n, digits = 1) => `${n < -0.0000001 ? '−' : '+'}${fmt(Math.abs(n), digits)}`;
  const satellite = `<path d="M-29-10h18v20h-18zM11-10h18v20H11z" fill="#234d74" stroke="#8fcaed"/><path d="M-23-10v20m6-20v20m18-20v20m6-20v20m6-20v20M-29 0h18m22 0h18" stroke="#6c9bba" stroke-width=".7"/><rect x="-9" y="-9" width="18" height="18" rx="3" fill="#cad9e4"/><path d="M-5-9l-6-9m11 9v-16m-4 0h8" stroke="#9cc6dd" fill="none"/>`;
  function earthScene(height = 20200, drag = false) {
    const y = 248 - (height - 500) / 35500 * 150;
    const stars = Array.from({length: 55}, (_, i) => `<circle cx="${(i * 139 + 17) % 650}" cy="${(i * 73 + 23) % 420}" r="${i % 5 === 0 ? 1.2 : .65}" fill="#92b5db" opacity="${.2 + (i % 4) * .12}"/>`).join('');
    return `<svg viewBox="0 0 650 430" aria-label="Jorden og en satellit. Diagrammet er ikke målfast." role="group"><defs>
      <radialGradient id="ocean" cx="30%" cy="25%" r="80%"><stop stop-color="#4385ad"/><stop offset=".42" stop-color="#254d74"/><stop offset=".8" stop-color="#0e233a"/><stop offset="1" stop-color="#08121e"/></radialGradient>
      <radialGradient id="atmosphere"><stop offset=".77" stop-color="#417cbd" stop-opacity="0"/><stop offset=".87" stop-color="#6cd1f4" stop-opacity=".18"/><stop offset=".9" stop-color="#4b9be0" stop-opacity=".08"/><stop offset="1" stop-color="#4b9be0" stop-opacity="0"/></radialGradient>
      <radialGradient id="potential" cx="30%" cy="72%" r="80%"><stop stop-color="#1a384e"/><stop offset=".5" stop-color="#204b5a" stop-opacity=".4"/><stop offset="1" stop-color="#78e2d0" stop-opacity=".04"/></radialGradient>
      <clipPath id="globe-clip"><circle cx="227" cy="274" r="119"/></clipPath>
    </defs>${drag ? '<rect width="650" height="430" fill="url(#potential)"/>' : ''}${stars}
    <ellipse cx="280" cy="258" rx="237" ry="102" fill="none" stroke="#304960" stroke-dasharray="3 7" transform="rotate(-27 280 258)"/>
    <circle cx="227" cy="274" r="139" fill="url(#atmosphere)"/>
    <circle cx="227" cy="274" r="119" fill="url(#ocean)" stroke="#82c4e7" stroke-opacity=".4"/>
    <g clip-path="url(#globe-clip)"><g fill="#739c93" opacity=".65"><path d="M119 208l25-20 18 5 12-9 20 10 9 19-12 19-16 5-3 17-15 7-14-17-16-5-11-21zm58 53 18 7 19 21-2 21-12 19-7 26-13 12-7-21 4-21-12-28zM235 165l28 5 13 10-11 16-24-1-17-12zm26 51 22-14 14 8 15-3 26 25-5 26-18-4-15 8-12-17-14 8-16-16zm-3 37 26 7 14 24-6 26-18 21-13-9-9-30-8-13zm58 76 30-10 12 17-18 13-22-5z"/></g><g stroke="#8ebbd1" stroke-opacity=".12" fill="none"><ellipse cx="227" cy="274" rx="60" ry="119"/><ellipse cx="227" cy="274" rx="103" ry="119"/><ellipse cx="227" cy="274" rx="119" ry="46"/><ellipse cx="227" cy="274" rx="119" ry="88"/><path d="M108 274h238M227 155v238"/></g><path d="M268 147c-25 105 10 184 86 229h80V128z" fill="#020913" opacity=".3"/></g>
    <circle cx="157" cy="178" r="4" fill="#78e2d0"/><path d="M157 178L111 137H63" fill="none" stroke="#78e2d0" stroke-opacity=".65"/><text x="63" y="124" class="svg-label">JORDURET</text>
    <path id="height-line" d="M342 272L491 ${y}" stroke="#78e2d0" stroke-opacity=".3" stroke-dasharray="4 5"/>
    <g id="orbit-satellite" transform="translate(491 ${y})" ${drag ? 'tabindex="0" role="slider" aria-label="Satellittens højde i kilometer. Piletaster ændrer højden." aria-valuemin="500" aria-valuemax="36000" aria-valuenow="'+height+'" style="cursor:ns-resize;touch-action:none"' : ''}><circle r="40" fill="transparent"/>${satellite}<circle r="39" fill="none" stroke="#78e2d0" stroke-opacity=".2"/><text x="-37" y="65" class="svg-label">${drag ? 'TRÆK OP / NED' : 'GPS-SATELLIT'}</text></g>
    <text id="orbit-height" x="430" y="377" class="svg-number">${fmt(height,0)} km</text><text x="430" y="396" class="svg-label">over Jordens overflade</text></svg>`;
  }
  function lightClock(beta, phase) {
    const g = P.gamma(beta), travel = Math.min(142, 200 / (beta * g || 1)), dx = beta * g * travel, progress = phase;
    return `<svg viewBox="0 0 650 380" role="img" aria-label="Samme lysur set fra to referencesystemer. Ved den valgte fart er gamma ${fmt(g,2)}.">
    <text x="30" y="30" class="visual-title">Med uret</text><text x="352" y="30" class="visual-title">Uret bevæger sig →</text>
    <text x="30" y="53" class="svg-label">Urets eget referencesystem</text><text x="352" y="53" class="svg-label">Et andet inertialsystem</text>
    <path d="M320 20v300" stroke="#263345"/>
    <path d="M95 ${252-travel}h80M95 252h80" stroke="#a0c7dd" stroke-width="5"/>
    <path d="M135 252v-${travel}" stroke="#78e2d0" stroke-dasharray="4 5"/>
    <circle cx="135" cy="${252 - travel * progress}" r="7" fill="#b3fff0"/><circle cx="135" cy="${252 - travel * progress}" r="16" fill="#78e2d0" opacity=".12"/>
    <path d="M${370 + dx * progress - 30} ${252-travel}h60M${370 + dx * progress - 30} 252h60" stroke="#a0c7dd" stroke-width="5"/>
    <path d="M370 252L${370 + dx} ${252-travel}" stroke="#f1ab7d" stroke-dasharray="4 5"/>
    <path d="M370 252h${dx}" stroke="#5f7692" stroke-dasharray="3 5"/>
    <circle cx="${370 + dx * progress}" cy="${252 - travel * progress}" r="7" fill="#ffd3ae"/><circle cx="${370 + dx * progress}" cy="${252 - travel * progress}" r="16" fill="#f1ab7d" opacity=".12"/>
    <text x="109" y="295" class="svg-number">Δτ = 1</text><text x="370" y="295" class="svg-number" style="fill:#f1ab7d">Δt = ${fmt(g,2)}</text>
    <text x="109" y="319" class="svg-label">Nu: τ = ${fmt(progress,2)}</text><text x="370" y="319" class="svg-label">Nu: t = ${fmt(progress*g,2)}</text><text x="30" y="347" class="svg-label">Samme hændelser. Hver sin tidsakse.</text>
    <text x="30" y="367" class="svg-label">Tid i L/c; synkroniseret efter lysets passage.</text></svg>`;
  }
  function balance(gravityOn, motionOn) {
    const p = P.orbit(P.GPS_HEIGHT), gravity = gravityOn ? p.gravity : 0, motion = motionOn ? p.motion : 0, net = gravity + motion;
    const x = v => 175 + v * 6;
    const bar = (v,y,color,label) => `<rect x="${Math.min(x(0),x(v))}" y="${y}" width="${Math.abs(v)*6}" height="30" rx="3" fill="${color}"/><text x="20" y="${y-12}" class="svg-label">${label}</text><text x="${Math.max(x(0),x(v))+12}" y="${y+20}" class="svg-number" style="fill:${color}">${signed(v)} µs</text>`;
    return `<svg viewBox="0 0 650 325" role="img" aria-label="Bidrag pr. døgn: gravitation ${signed(gravity)}, bevægelse ${signed(motion)}, netto ${signed(net)} mikrosekunder."><path d="M175 15v272" stroke="#66809b" stroke-dasharray="3 5"/>
    ${bar(gravity,45,'#78e2d0','GRAVITATION')}${bar(motion,127,'#f1ab7d','BEVÆGELSE')}${bar(net,209,'#87b9fa','NETTO')}
    <path d="M85 280h480" stroke="#33485f"/>${[-10,0,20,40,60].map(v=>`<text x="${x(v)}" y="301" class="svg-label" text-anchor="middle">${v>0?'+':''}${v}</text>`).join('')}<text x="545" y="322" class="svg-label">µs/døgn</text></svg>`;
  }
  function distancePulse(error, phase) {
    const distance = P.lightDistance(error) / 1000, end = 65 + error / 100 * 500;
    return `<svg viewBox="0 0 650 210" role="img" aria-label="${fmt(error)} mikrosekunder svarer til ${fmt(distance,2)} kilometer lysrejseafstand."><defs><linearGradient id="pulse"><stop stop-color="#78e2d0" stop-opacity="0"/><stop offset="1" stop-color="#78e2d0"/></linearGradient></defs>
    <path d="M65 100h500" stroke="#344961" stroke-width="2"/><path d="M65 100H${end}" stroke="#78e2d0" stroke-width="3" stroke-opacity=".45"/>
    <rect x="${65+Math.max(0,(end-65)*phase-45)}" y="96" width="${Math.min(45,(end-65)*phase)}" height="8" fill="url(#pulse)"/><circle cx="${65+(end-65)*phase}" cy="100" r="6" fill="#bbfff3"/>
    <path d="M65 79v42M${end} 79v42" stroke="#78e2d0"/>
    ${[0,25,50,75,100].map(t=>`<path d="M${65+t*5} 130v6" stroke="#4e657e"/><text x="${65+t*5}" y="157" text-anchor="middle" class="svg-label">${t} µs</text>`).join('')}
    <text x="65" y="53" class="svg-label">UDSENDELSE</text><text x="${Math.max(170,end)}" y="53" text-anchor="end" class="svg-number">${fmt(error)} µs</text><text x="65" y="195" class="svg-label">Fast skala: 0–100 µs · bevægelsen er vist i slowmotion</text></svg>`;
  }
  function gpsMap(state, phase) {
    const {x,y} = state.receiver, signals = P.signals(x,y,state.bias);
    let rings = '', links = '';
    P.SATELLITES.forEach((sat, i) => {
      const d = Math.hypot(sat.x-x,sat.y-y), progress = Math.min(1, phase * 100 / signals[i].travelMs);
      if (state.rings) rings += `<circle cx="${sat.x}" cy="${sat.y}" r="${d}" fill="none" stroke="${['#78e2d0','#87b9fa','#f1ab7d','#c0a5ec'][i]}" opacity=".27" stroke-width="1.5"/>`;
      links += `<path d="M${sat.x} ${sat.y}L${x} ${y}" stroke="#6b8cac" stroke-dasharray="4 6" stroke-opacity=".5"/><circle class="signal-pulse" cx="${sat.x+(x-sat.x)*progress}" cy="${sat.y+(y-sat.y)*progress}" r="4" fill="#b6fff1"/><g transform="translate(${sat.x} ${sat.y}) scale(.8)">${satellite}</g><text x="${sat.x}" y="${sat.y+32}" text-anchor="middle" class="svg-label">S${i+1}</text>`;
    });
    return `<svg id="gps-map" viewBox="0 0 800 500" role="group" aria-label="Todimensionelt GPS-eksperiment med fire satellitter og en flytbar modtager."><defs><pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0v40" stroke="#24354a" fill="none" stroke-width=".6"/></pattern><clipPath id="map-clip"><rect x="0" y="0" width="800" height="500"/></clipPath></defs><rect width="800" height="500" fill="url(#map-grid)"/><g clip-path="url(#map-clip)">${rings}${links}</g>
    <g id="receiver" transform="translate(${x} ${y})" tabindex="0" role="group" aria-label="Flyt modtageren. Brug piletaster, Shift for større trin." style="cursor:move"><circle r="30" fill="transparent"/><circle r="21" fill="#78e2d0" opacity=".12"/><circle r="8" fill="#78e2d0" stroke="#071526" stroke-width="3"/><path d="M-14 0h-10M14 0h10M0-14v-10M0 14v10" stroke="#78e2d0"/><text y="46" text-anchor="middle" class="svg-label">DIN MODTAGER</text></g>
    <text id="signal-time" x="18" y="480" class="svg-label">Sendt: 0 ms · nu: ${fmt(phase*100,1)} ms · slowmotion</text></svg>`;
  }
  function chart(height, gravityOn, motionOn) {
    const w=680,h=330,left=55,right=645,top=25,bottom=275;
    const X = v => left+(v-500)/35500*(right-left), Y = v => bottom-(v+35)/95*(bottom-top);
    const path = key => Array.from({length:241},(_,i)=>{const height=500+i/240*35500,p=P.orbit(height);const v=key==='gravity'?(gravityOn?p.gravity:0):key==='motion'?(motionOn?p.motion:0):(gravityOn?p.gravity:0)+(motionOn?p.motion:0);return `${i?'L':'M'}${X(height).toFixed(2)} ${Y(v).toFixed(2)}`;}).join(' ');
    const rate = P.experiment(height,1,gravityOn,motionOn).rate;
    return `<svg id="correction-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Urkorrektion i mikrosekunder pr. døgn som funktion af højde fra 500 til 36.000 kilometer. Valgt netto: ${signed(rate,2)}.">
    ${[-30,-15,0,15,30,45,60].map(v=>`<path d="M${left} ${Y(v)}H${right}" stroke="${v===0?'#718297':'#24344a'}" ${v===0?'':'stroke-dasharray="3 5"'}/><text x="43" y="${Y(v)+4}" text-anchor="end" class="svg-label">${v>0?'+':''}${v}</text>`).join('')}
    ${[500,10000,20000,30000,36000].map(v=>`<text x="${X(v)}" y="300" text-anchor="middle" class="svg-label">${fmt(v,0)}</text>`).join('')}
    <text x="${left}" y="14" class="svg-label">µs / døgn</text><text x="${right}" y="323" text-anchor="end" class="svg-label">Højde over overfladen / km</text>
    <path d="${path('gravity')}" fill="none" stroke="#78e2d0" stroke-width="2"/><path d="${path('motion')}" fill="none" stroke="#f1ab7d" stroke-width="2"/><path d="${path('net')}" fill="none" stroke="#87b9fa" stroke-width="3"/>
    <path d="M${X(height)} ${top}V${bottom}" stroke="#c1dcf3" stroke-dasharray="4 4" opacity=".6"/><circle cx="${X(height)}" cy="${Y(rate)}" r="6" fill="#87b9fa" stroke="#0b1524" stroke-width="3"/>
    <rect x="${left}" y="${top}" width="${right-left}" height="${bottom-top}" fill="transparent" style="cursor:crosshair" id="chart-hit"/></svg>`;
  }
  root.GPSVisuals = {fmt, signed, earthScene, lightClock, balance, distancePulse, gpsMap, chart};
})(globalThis);
