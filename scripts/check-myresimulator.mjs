import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const scope={};runInNewContext(readFileSync('apps/myresimulator/model.js','utf8'),scope);const World=scope.AntWorld;
const advance=(w,t)=>{for(let i=0;i<Math.round(t/.05);i++)w.step(.05);};
let w=new World(43,1);w.food={cell:w.home+2,left:2};w.ants[0].cell=w.home;w.ants[0].dir=0;
w.tick();assert.equal(w.food.left,2,'fjern mad må ikke optages');assert.equal(w.scent.reduce((a,b)=>a+b,0),0,'søgende afsætter intet');
w.ants[0].cell=w.food.cell;w.tick();assert.equal(w.food.left,1);assert.equal(w.stats().carrying,1);assert.ok(w.scent.reduce((a,b)=>a+b,0)>0);for(let i=0;i<3;i++)w.tick();assert.equal(w.delivered,1);assert.equal(w.stats().carrying,0);assert.equal(w.delivered+w.stats().carrying+w.food.left,2);
w.ants=[];const scent=w.scent.reduce((a,b)=>a+b,0);advance(w,16);assert.ok(Math.abs(w.scent.reduce((a,b)=>a+b,0)/scent-Math.exp(-1))<1e-10);
w.paused=true;const snapshot=JSON.stringify(w);advance(w,10);assert.equal(JSON.stringify(w),snapshot);
w=new World();w.paint(20+20*64,3);assert.ok(w.walls[20+20*64]);w.ants[0].cell=20+20*64;w.paint(20+20*64,3);assert.equal(w.walls[w.ants[0].cell],0);advance(w,10);assert.ok(w.ants.every(a=>!w.walls[a.cell]));w.paint(w.home,2);assert.equal(w.walls[w.home],0);w.paint(w.food.cell,2);assert.equal(w.walls[w.food.cell],0);w.clear();assert.equal(w.stats().walls,0);
// A closed partition must never be crossed; new cakes remain reachable.
for(let y=0;y<40;y++)w.walls[32+y*64]=1;w.map();w.ants.forEach(a=>{a.cell=w.home;a.carrying=false;});advance(w,20);assert.ok(w.ants.every(a=>a.cell%64<32));for(let i=0;i<100;i++){assert.ok(w.newFood());assert.ok(w.dist[w.food.cell]>18);assert.equal(w.walls[w.food.cell],0);}
const a=new World(),b=new World();advance(a,120);advance(b,120);assert.equal(JSON.stringify(a),JSON.stringify(b));assert.ok(a.delivered>45,'standardscenariet opdager, leverer og skifter kage');assert.equal(a.delivered+a.stats().carrying+a.food.left,a.cakes*45);assert.ok(a.scent.every(v=>Number.isFinite(v)&&v>=0&&v<=30));
console.log('OK: myremodel — lokal optagelse, levering, regnskab, spor, pause, vægge, kageplacering og seedet forløb.');
