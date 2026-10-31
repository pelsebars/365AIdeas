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
