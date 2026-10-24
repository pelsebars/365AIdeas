/* Pure calculations; SI internally, labelled units at the boundary. */
(function (root) {
  'use strict';
  const C = 299792458;
  const GM = 3.986004418e14; // Earth's standard gravitational parameter, m³/s².
  const R = 6371000; // Mean spherical Earth, m.
  const DAY = 86400;
  const GPS_HEIGHT = 20200;
  function orbit(heightKm) {
    if (!Number.isFinite(heightKm) || heightKm < 0) throw new RangeError('Højden skal være et endeligt, positivt tal.');
    const r = R + heightKm * 1000;
    const velocity = Math.sqrt(GM / r);
    const gravity = DAY * 1e6 * GM / (C * C) * (1 / R - 1 / r);
    const motion = -DAY * 1e6 * GM / (2 * r * C * C);
    return {r, velocity, gravity, motion, net: gravity + motion, potential: -GM / r, acceleration: GM / (r * r)};
  }
  function experiment(heightKm, days, gravityOn = true, motionOn = true) {
    if (!Number.isFinite(days) || days < 0) throw new RangeError('Tiden skal være positiv og endelig.');
    const result = orbit(heightKm);
    const rate = (gravityOn ? result.gravity : 0) + (motionOn ? result.motion : 0);
    const microseconds = rate * days;
    return {...result, rate, microseconds, distance: microseconds * 1e-6 * C};
  }
  function gamma(beta) {
    if (!Number.isFinite(beta) || beta < 0 || beta >= 1) throw new RangeError('Kræver 0 ≤ v/c < 1.');
    return 1 / Math.sqrt(1 - beta * beta);
  }
  function lightDistance(microseconds) { return microseconds * 1e-6 * C; }
  const SATELLITES = [{x: 65, y: 60}, {x: 710, y: 75}, {x: 730, y: 430}, {x: 55, y: 420}];
  const MAP_KM = 40; // One SVG unit = 40 km. Flat toy geometry, not Earth's surface.
  function signals(x, y, biasUs = 0) {
    return SATELLITES.map((sat, i) => {
      const distance = Math.hypot(sat.x - x, sat.y - y) * MAP_KM;
      return {id: i + 1, distance, travelMs: distance * 1000 / C * 1000,
        pseudoKm: distance + lightDistance(biasUs) / 1000};
    });
  }
  // Least-squares Gauss–Newton solution of rho_i = |s_i - p| + b, in km.
  // Four ranges constrain the three unknowns x, y and receiver clock bias in 2D.
  function locate(pseudoranges) {
    let p = [400 * MAP_KM, 250 * MAP_KM, 0];
    for (let iteration = 0; iteration < 30; iteration++) {
      const a = Array.from({length: 3}, () => [0, 0, 0, 0]);
      SATELLITES.forEach((sat, i) => {
        const dx = p[0] - sat.x * MAP_KM, dy = p[1] - sat.y * MAP_KM;
        const d = Math.max(1e-9, Math.hypot(dx, dy));
        const j = [dx / d, dy / d, 1], residual = pseudoranges[i] - d - p[2];
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) a[k][l] += j[k] * j[l];
          a[k][3] += j[k] * residual;
        }
      });
      for (let k = 0; k < 3; k++) {
        let pivot = k;
        for (let j = k + 1; j < 3; j++) if (Math.abs(a[j][k]) > Math.abs(a[pivot][k])) pivot = j;
        [a[k], a[pivot]] = [a[pivot], a[k]];
        const divisor = a[k][k];
        if (Math.abs(divisor) < 1e-12) throw new Error('Satellitgeometrien kan ikke løses.');
        for (let l = k; l < 4; l++) a[k][l] /= divisor;
        for (let j = 0; j < 3; j++) if (j !== k) {
          const factor = a[j][k];
          for (let l = k; l < 4; l++) a[j][l] -= factor * a[k][l];
        }
      }
      const delta = a.map(row => row[3]);
      p = p.map((v, i) => v + delta[i]);
      if (Math.hypot(...delta) < 1e-8) break;
    }
    return {x: p[0] / MAP_KM, y: p[1] / MAP_KM, biasUs: p[2] * 1000 / C * 1e6};
  }
  root.GPSPhysics = Object.freeze({C, GM, R, DAY, GPS_HEIGHT, MAP_KM, SATELLITES,
    orbit, experiment, gamma, lightDistance, signals, locate, cancellationHeight: R / 2000});
})(globalThis);
