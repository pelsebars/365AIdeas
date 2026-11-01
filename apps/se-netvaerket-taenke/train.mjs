import './model.js';
import {writeFileSync} from 'node:fs';
const {rng,sample,forward}=globalThis.ShapeNet;
const r=rng(4801),records=new Map();
for(let k=0;k<12000;k++){const label=k%3,x=sample(r,label),key=x.join('');if(records.has(key)&&records.get(key).label!==label)records.set(key,{x,label:-1});else if(!records.has(key))records.set(key,{x,label});}
const data=[...records.values()].filter(v=>v.label>=0);
const hold=[],hr=rng(4802),seen=new Set(records.keys());
for(let k=0;hold.length<900;k++){const label=k%3,x=sample(hr,label),key=x.join('');if(!seen.has(key)){hold.push({x,label});seen.add(key);}}
const m={w1:Array.from({length:8},()=>Array.from({length:100},()=> (r()-.5)*.4)),b1:Array(8).fill(0),w2:Array.from({length:3},()=>Array.from({length:8},()=>r()-.5)),b2:Array(3).fill(0)};
for(let epoch=0;epoch<100;epoch++){
 for(let i=data.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[data[i],data[j]]=[data[j],data[i]];}
 const rate=.025*(1-epoch/120);
 for(const {x,label} of data){const f=forward(x,m),d=f.p.map((p,j)=>p-Number(j===label)),dh=f.h.map((h,i)=>d.reduce((s,v,j)=>s+v*m.w2[j][i],0)*(1-h*h));
  for(let j=0;j<3;j++){m.b2[j]-=rate*d[j];for(let i=0;i<8;i++)m.w2[j][i]-=rate*d[j]*f.h[i];}
  for(let j=0;j<8;j++){m.b1[j]-=rate*dh[j];for(let i=0;i<100;i++)m.w1[j][i]-=rate*dh[j]*x[i];}
 }
}
const confusion=Array.from({length:3},()=>[0,0,0]);
for(const {x,label} of hold){const f=forward(x,m);confusion[label][f.p.indexOf(Math.max(...f.p))]++;}
const accuracy=confusion.reduce((s,row,i)=>s+row[i],0)/hold.length;
m.meta={architecture:[100,8,3],classes:['Firkant','Trekant','Ved ikke'],seed:4801,holdoutSeed:4802,epochs:100,learningRate:'.025 * (1-epoch/120)',trainCount:data.length,holdoutCount:hold.length,confusion,accuracy,pixelOrder:'y*10+x',normalization:'0/1',activation:'tanh / softmax',duplicates:'Entydige rastere; labelkonflikter fjernet; holdout udelukker alle træningsrastere.'};
writeFileSync(new URL('./weights.js',import.meta.url),'globalThis.SHAPE_MODEL = '+JSON.stringify(m)+';\n');
writeFileSync(new URL('./report.json',import.meta.url),JSON.stringify(m.meta,null,2)+'\n');
console.log(m.meta);
