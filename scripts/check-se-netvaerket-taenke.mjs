import assert from 'node:assert/strict';
import '../apps/se-netvaerket-taenke/model.js';
import '../apps/se-netvaerket-taenke/weights.js';
const {forward,rng,sample}=globalThis.ShapeNet,m=globalThis.SHAPE_MODEL;
assert.equal(m.w1.length,8);assert(m.w1.every(r=>r.length===100));assert.equal(m.w2.length,3);assert(m.w2.every(r=>r.length===8));assert.equal(m.b1.length,8);assert.equal(m.b2.length,3);
const tiny={w1:[[2,-1]],b1:[.5],w2:[[1],[-1],[0]],b2:[0,0,0]},f=forward([1,1],tiny),h=Math.tanh(1.5),den=Math.exp(h)+Math.exp(-h)+1;
assert.equal(f.z[0],1.5);assert.equal(f.h[0],h);assert(Math.abs(f.p[0]-Math.exp(h)/den)<1e-12);
const large=forward([0],{w1:[[0]],b1:[0],w2:[[0],[0],[0]],b2:[10000,9999,-10000]});assert(large.p.every(Number.isFinite));assert(Math.abs(large.p.reduce((a,b)=>a+b)-1)<1e-12);
const zero=forward(Array(100).fill(0),m);assert.deepEqual(zero.z,m.b1);
// Recreate the raw training raster universe, then independently reproduce holdout evaluation.
const r=rng(4801),seen=new Set();for(let k=0;k<12000;k++)seen.add(sample(r,k%3).join(''));
const hr=rng(4802),confusion=Array.from({length:3},()=>[0,0,0]);let count=0;
for(let k=0;count<900;k++){const label=k%3,x=sample(hr,label),key=x.join('');assert(x.every(v=>v===0||v===1));if(seen.has(key))continue;seen.add(key);count++;const p=forward(x,m).p;confusion[label][p.indexOf(Math.max(...p))]++;}
assert.deepEqual(confusion,m.meta.confusion);assert.equal(confusion.reduce((s,row,i)=>s+row[i],0)/900,m.meta.accuracy);assert(m.meta.accuracy>.8);
console.log('OK: netværksdimensioner, håndberegnet inferens, stabil softmax, bias og 900 holdout-resultater.');
