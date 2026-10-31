import assert from 'node:assert/strict';
await import('../apps/hold-banen-eller-skift/base.js');
await import('../apps/hold-banen-eller-skift/model.js');
const {Pair,summarize}=globalThis.LaneExperiment;
const p=new Pair({load:64},['hold','hold']);
assert.deepEqual(p.worlds[0].sim.cars,p.worlds[1].sim.cars);
while(!p.done)p.advance(5);
assert.equal(p.result().valid,true);assert.equal(p.result().delta,0);
assert.equal(p.worlds[0].car.switches,0);
assert.deepEqual(p.worlds[0].sim.plan,p.worlds[1].sim.plan);
const q=new Pair();const initial=q.worlds.map(w=>({start:w.start,goal:w.goal}));assert.deepEqual(initial[0],initial[1]);
while(!q.done)q.advance(5);
assert.equal(q.result().valid,true);assert.equal(q.worlds[0].car.switches,0);assert.ok(q.worlds[1].car.switches>0);
for(const w of q.worlds){assert.ok(w.arrival<=q.time);assert.ok(w.car.x>=w.goal);assert.ok(w.car.x-w.goal<w.car.v*.05+1e-5);assert.ok(w.sim.cars.every(c=>c.v>=0&&Number.isFinite(c.x)));}
const plans=q.worlds.map(w=>w.sim.plan);assert.deepEqual(plans[0].slice(0,plans[1].length),plans[1]);
const partial=new Pair({load:64});partial.time=299.95;partial.tick();assert.equal(partial.result().valid,false);assert.equal(partial.result().delta,null);
const s=new Traffic.Simulation({initial:0});const c=s.car(1,100),front=s.car(2,104);s.cars=[c,front];assert.equal(s.change(c,2),false);front.x=200;assert.equal(s.change(c,2),true);assert.ok(s.occupies(c,1)&&s.occupies(c,2));assert.equal(c.shift,2);
assert.deepEqual(summarize([{valid:true,delta:-2},{valid:true,delta:4},{valid:false,delta:100}]),{n:2,mean:1,median:1,min:-2,max:4});
console.log('OK: parret nulreference, ankomstplan, sikre skift, mållinje, uafsluttet løb og statistik.');

// Share changes behaviour only: driver attributes/arrival plans stay paired,
// and increasing the share retains every previously selected driver.
const fleets=[0,25,50,75,100].map(share=>new Traffic.Simulation({seed:47,initial:400,share,threshold:.1}));
for(let i=0;i<400;i++){
 const cars=fleets.map(s=>s.cars[i]);
 assert.ok(cars.every(c=>c.desired===cars[0].desired&&c.x===cars[0].x&&c.lane===cars[0].lane));
 assert.equal(cars[0].policy,'hold');assert.equal(cars[4].policy,'switch');
 for(let j=1;j<cars.length;j++)if(cars[j-1].policy==='switch')assert.equal(cars[j].policy,'switch');
}
const half=fleets[2].cars.filter(c=>c.policy==='switch').length;assert.ok(half>160&&half<240);
for(const share of [0,50,100]){
 const pair=new Pair({share,load:64},['hold','hold']);
 assert.deepEqual(pair.worlds[0].sim.cars,pair.worlds[1].sim.cars);
 while(!pair.done)pair.advance(5);
 assert.equal(pair.result().valid,true);assert.equal(pair.result().delta,0);
 assert.deepEqual(pair.worlds[0].sim.plan,pair.worlds[1].sim.plan);
 assert.equal(pair.result().share,share);
 assert.ok(pair.result().trafficSpeed.every(v=>Number.isFinite(v)&&v>0));
 if(share===0)assert.ok(pair.worlds.every(w=>w.trafficChanges===0));
 for(const w of pair.worlds)assert.ok(w.sim.cars.filter(c=>c!==w.car).every(c=>c.policy===(w.sim.driverRandom(c.id,0x51ed270b)<share/100?'switch':'hold')));
}
console.log('OK: 0/50/100 %, stabile førerdata, nye ankomster, parret adfærd og trafikmålinger.');
