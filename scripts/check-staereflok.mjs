import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const scope={};runInNewContext(readFileSync('apps/staereflok/model.js','utf8'),scope);const {World,nearest,project}=scope.Starling;
const points=[[0,0,0],[1,1,9],[2,0,0],[0,0,3]].map(p=>({p}));assert.deepEqual(Array.from(nearest(points,0,2)),[2,3]);
let w=new World(80);const start=w.birds.map(b=>[...b.p]);for(let i=0;i<3600;i++){const old=w.birds;w.step();for(let j=0;j<w.birds.length;j++){const b=w.birds[j];assert(b.p.every(Number.isFinite));assert(Math.abs(Math.hypot(...b.v)-15)<1e-8);assert(Math.hypot(...b.v.map((x,k)=>x-old[j].v[k]))*60<16.6);assert(Math.hypot(...b.omega)<=1.10001);}}for(let axis=0;axis<3;axis++)assert(w.birds.some((b,i)=>Math.abs(b.p[axis]-start[i][axis])>5));assert(w.birds.every(b=>Math.hypot(...b.p)<500));
w.paused=true;const frozen=JSON.stringify(w);w.step();assert.equal(w.turn(),false);assert.equal(JSON.stringify(w),frozen);
for(const z of [-370,-1000,0,1e6]){const p=project([0,0,z],390,370);assert(Object.values(p).every(Number.isFinite));assert(p.r>0);}
// A one-neighbor directed chain isolates local information transfer from other forces.
w=new World(4);w.birds=[0,1,2,3].map(i=>({p:[i*10,0,0],v:[15,0,0],omega:[0,0,0]}));w.refresh=()=>{};w.graph=[[1],[0],[1],[2]];w.turn(0);assert.deepEqual(Array.from(w.event.direct),[0]);w.step();let r=w.reactions();assert(r[0]>0);assert.equal(r[1],0);assert.equal(r[3],0);w.step();r=w.reactions();assert(r[1]>0);assert.equal(r[3],0);w.step();w.step();assert(w.reactions()[3]>0);
const a=new World(10),b=new World(10);for(let i=0;i<90;i++){a.step();b.step();}assert.equal(JSON.stringify(a.birds),JSON.stringify(b.birds));
console.log('OK: stæreflok 3D-naboer, lokal kædereaktion, fart/acceleration, 60 s stabilitet, pause, projektion og seed.');
