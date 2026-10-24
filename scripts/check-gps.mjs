import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const scope={};
runInNewContext(readFileSync('apps/gps-og-tiden/physics.js','utf8'),scope);
const P=scope.GPSPhysics;
const near=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<=tolerance,`${a} ≠ ${b} (tolerance ${tolerance})`);
// Values independently calculated using v²/(2c²), ΔPhi/c² and SI units.
const gps=P.orbit(20200);
near(gps.gravity,45.72418542955491,1e-10);
near(gps.motion,-7.210613499299363,1e-10);
near(gps.net,38.51357193025554,1e-10);
near(gps.velocity,3873.1555420221052,1e-6);
assert.equal(gps.gravity.toFixed(1),'45.7');
assert.equal(gps.motion.toFixed(1),'-7.2');
assert.equal(gps.net.toFixed(1),'38.5');
near(P.orbit(0).gravity,0);
near(P.orbit(P.R/2000).net,0,1e-12);
assert.ok(P.orbit(500).net<0);
assert.ok(P.orbit(36000).net>0);
let previous=P.orbit(500);
for(let h=600;h<=36000;h+=100){
  const current=P.orbit(h);
  assert.ok(current.gravity>previous.gravity);
  assert.ok(current.velocity<previous.velocity);
  assert.ok(current.motion>previous.motion);
  assert.ok(current.net>previous.net);
  previous=current;
}
for(const days of [0,1,2,30])for(const gravity of [true,false])for(const motion of [true,false]){
  const r=P.experiment(20200,days,gravity,motion);
  const expected=(gravity?gps.gravity:0)+(motion?gps.motion:0);
  near(r.rate,expected);near(r.microseconds,days*expected);
  near(r.distance,r.microseconds*299.792458,1e-7);
}
near(P.lightDistance(1),299.792458);
near(P.lightDistance(38.5),11542.009633);
near(P.gamma(0),1);near(P.gamma(.6),1.25);near(P.gamma(.8),5/3);
// Pythagoras: the moving path is gamma times the proper-frame path.
for(const beta of [0,.3,.6,.9,.95]){
  const gamma=P.gamma(beta),L=Math.min(142,200/(beta*gamma||1));
  near(Math.hypot(L,beta*gamma*L)/L,gamma);
}
for(const bad of [-1,NaN,Infinity])assert.throws(()=>P.orbit(bad));
for(const bad of [-.1,1,NaN,Infinity])assert.throws(()=>P.gamma(bad));
assert.throws(()=>P.experiment(500,-1));
// Solve from independently generated distances, at boundaries and with both bias signs.
for(const x of [120,250,390,530,670])for(const y of [120,240,380])for(const bias of [-50,0,20,50]){
  const ranges=P.SATELLITES.map(s=>Math.hypot((s.x-x)*40,(s.y-y)*40)+299792.458*bias*1e-6);
  const solved=P.locate(ranges);
  near(solved.x,x,1e-6);near(solved.y,y,1e-6);near(solved.biasUs,bias,1e-6);
  const signals=P.signals(x,y,bias);
  signals.forEach((s,i)=>{near(s.pseudoKm,ranges[i],1e-8);near(s.distance,s.travelMs/1000*299792.458,1e-8);});
}
console.log('OK: GPS-bidrag, fortegn, balancehøjde, cirkulær hastighed, tidsakkumulering, lysur og 60 positionsløsninger med urfejl.');
