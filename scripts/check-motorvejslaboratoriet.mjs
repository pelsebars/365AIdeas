import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx=vm.createContext({});vm.runInContext(readFileSync('apps/motorvejslaboratoriet/model.js','utf8'),ctx);
const {Simulation,distances}=ctx.Traffic;
assert.equal(distances(72,1,5).reaction,20);assert.equal(distances(72,1,5).braking,40);
// Controlled cut-in observation: no reinterpretation of the old leader history.
const s=new Simulation({initial:0,inflow:0,reaction:1,tendency:0});const follower=s.car(0,40),leader=s.car(1,100);follower.v=20;leader.v=10;s.cars=[follower,leader];s.initial=2;s.advance(1);leader.lane=0;leader.from=0;s.advance(.5);assert(follower.a>0,'cut-in must not be perceived before reaction delay');s.advance(.55);assert(follower.a<0,'delayed cut-in must trigger braking');
const lanes=new Simulation({initial:0,inflow:0});const a=lanes.car(0,100),b=lanes.car(1,103);lanes.cars=[a,b];assert.equal(lanes.change(a,1),false);b.x=230;assert(lanes.change(a,1));const c=lanes.car(2,100);lanes.cars.push(c);assert.equal(lanes.change(c,1),false,'reserved destination prevents simultaneous merge');
for(const params of [{},{initial:0,inflow:10000},{initial:80,inflow:10000,reaction:0,headway:2}]){const m=new Simulation(params);m.advance(180);assert(!m.stopped,'standard runs must remain stable');assert.equal(m.initial+m.entered-m.exited,m.cars.length);assert(m.cars.every(c=>Number.isFinite(c.x)&&c.v>=0&&c.a>=-m.p.brake));if(params.inflow===10000)assert(m.waiting>0);assert(m.result());}
const pulse=new Simulation({initial:0,inflow:0,tendency:0});pulse.cars=[pulse.car(0,300),pulse.car(1,100)];pulse.initial=2;assert(pulse.brakePulse());assert.equal(pulse.cars.filter(c=>c.pulse>0).length,1);const before=pulse.cars[0].v;pulse.advance(.5);assert(pulse.cars[0].v<before);assert(pulse.cars[1].a>0);
const collision=new Simulation({initial:0,inflow:0});collision.cars=[collision.car(0,100),collision.car(0,102)];collision.tick();assert(collision.stopped&&collision.collisions===1);
const measured=new Simulation({initial:0,inflow:0});measured.time=90;measured.passages=[31,40,50,60,70,80];assert.equal(measured.metrics().flow,360);assert.equal(measured.metrics().window,60);assert.equal(measured.result().max,720);
const one=new Simulation(),two=new Simulation();one.advance(30);for(let i=0;i<900;i++)two.advance(1/30);assert.equal(one.time,two.time);assert.equal(JSON.stringify(one.cars),JSON.stringify(two.cars));two.reset();const fresh=new Simulation();assert.equal(JSON.stringify(two.cars),JSON.stringify(fresh.cars));
console.log('OK: motorvej, forsinket cut-in, skift/reservation, stabilitet, kø, bevarelse, flow, kollision, seed og framerate.');
