import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const folder='apps/memento-mori/';
const {model,data}=runInNewContext(readFileSync(folder+'data.js','utf8')+'\n'+readFileSync(folder+'model.js','utf8')+'\n({model:lifeModel,data:lifeData})');
const csv=readFileSync(folder+'source.csv','utf8').trim().split(/\r?\n/).slice(1);
for(const row of csv){const [ageText,sexText,table,,value]=row.split(';');const age=parseInt(ageText),sex=sexText==='Mænd'?'M':'K',field=table.startsWith('Overlevende')?'survivors':'remaining';assert.equal(data[sex][field][age],Number(value.replace(',','.')));}
assert.equal(csv.length,400);
assert.equal(model.estimate(0,'M').years,80.25);assert.equal(model.estimate(0,'K').years,83.90);
for(const sex of ['M','K']){
 assert.equal(data[sex].survivors.length,100);
 for(const age of [0,20,40,65,90]){
  const r=model.estimate(age,sex);assert.equal(r.years,data[sex].remaining[age]);assert.equal(r.days,Math.round(r.years*365.2425));assert.equal(model.probability(r,0),0);assert.ok(r.days<r.maxDays);
  assert.ok(Math.abs(model.probability(r,365.2425)-(1-data[sex].survivors[age+1]/data[sex].survivors[age]))<1e-12);
  assert.ok(Math.abs(model.probability(r,365.2425/2)-(1-(data[sex].survivors[age]+data[sex].survivors[age+1])/2/data[sex].survivors[age]))<1e-12);
  let previous=0;for(let day=0;day<=r.maxDays;day+=31){const p=model.probability(r,day);assert.ok(p>=previous&&p>=0&&p<=1);previous=p;}
  assert.ok(model.probability(r,r.maxDays)<1);assert.equal(model.probability(r,r.maxDays+1),null);assert.ok(model.probability(r,r.days)<1);
 }
}
for(const age of [-1,91,NaN,1.5])assert.throws(()=>model.estimate(age,'M'));
assert.throws(()=>model.estimate(40,'X'));assert.equal(model.shade(0),255);assert.equal(model.shade(1),0);
assert.equal(model.date(1,new Date(2024,1,28)).getDate(),29);assert.equal(model.date(2,new Date(2024,1,28)).getMonth(),2);
const rollover=model.date(1,new Date(2025,11,31));assert.equal(rollover.getFullYear(),2026);assert.equal(rollover.getMonth(),0);assert.equal(rollover.getDate(),1);
console.log('OK: Memento mori, 400 kildetal, betinget overlevelse, interpolation, grænser, farver og kalenderdatoer.');
