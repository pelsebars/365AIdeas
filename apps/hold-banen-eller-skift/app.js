const $=id=>document.getElementById(id),{Pair,summarize}=LaneExperiment;
let pair,rows=[],running=false,busy=false,generation=0,last=0;
const fmt=n=>n.toLocaleString('da-DK',{minimumFractionDigits:1,maximumFractionDigits:1});
function params(){return Object.fromEntries(['load','share','threshold','seed','lane'].map(k=>[k,Number($(k).value)]));}
function reset(){generation++;running=false;busy=false;rows=[];pair=new Pair(params());render();}
function save(){if(!pair.saved){rows.push(pair.result());pair.saved=true;}}
function render(){
 $('shareValue').value=params().share+' %';
 $('play').textContent=running?'Pause':'Start';
 $('status').textContent=busy?'Beregner i korte portioner …':pair.done?'Par afsluttet. Se rejsetider og eventuelle ugyldige løb nedenfor.':`${running?'Kører':'Pause'} · ${fmt(pair.time)} s efter start · samme fysik i begge verdener`;
 const center=pair.worlds.reduce((s,w)=>s+w.car.x,0)/2;
 pair.worlds.forEach((w,i)=>{
 const distance=Math.min(2000,w.car.x-w.start);$('progress'+i).value=distance;
 $('metric'+i).textContent=`${fmt(distance)} / 2.000 m · ${w.invalid?'Ugyldig: kollision':w.arrival!==null?`${fmt(w.arrival)} s · ${fmt(7200/w.arrival)} km/t i snit`:pair.done?'Uafsluttet efter 300 s':'Undervejs'} · ${w.car.switches} skift · ${w.hard} kraftige opbremsninger · ${w.sim.collisions} kollisioner`;
 const others=w.sim.cars.filter(c=>c!==w.car),willing=others.filter(c=>c.policy==='switch').length;
 $('traffic'+i).textContent=`Øvrig trafik: ${willing} af ${others.length} biler vil skifte lige nu · ${w.trafficSeconds?fmt(w.trafficDistance/w.trafficSeconds*3.6):'–'} km/t i gennemsnit siden forsøgsstart · ${w.trafficChanges} udførte skift` ;
 const c=$('road'+i),ctx=c.getContext('2d'),overview=$('camera').value==='overview',span=overview?3000:420,left=overview?0:Math.max(0,Math.min(3000-span,center-span/2)),x=m=>(m-left)/span*c.width;
 ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#21323d';ctx.fillRect(0,18,c.width,172);ctx.strokeStyle='#71808a';ctx.setLineDash([18,20]);for(let lane=1;lane<4;lane++){ctx.beginPath();ctx.moveTo(0,18+lane*43);ctx.lineTo(c.width,18+lane*43);ctx.stroke();}ctx.setLineDash([]);
 for(const [pos,label] of [[w.start,'START'],[w.goal,'MÅL']]){ctx.strokeStyle='#dae8df';ctx.beginPath();ctx.moveTo(x(pos),18);ctx.lineTo(x(pos),190);ctx.stroke();ctx.fillStyle='#ffffff';ctx.font='14px system-ui';ctx.fillText(label,x(pos)+5,14);}
 for(const car of w.sim.cars){const px=x(car.x);if(px<0||px>c.width)continue;const lane=car.shift>0?car.from+(car.lane-car.from)*(1-car.shift/2):car.lane;ctx.fillStyle=car===w.car?(i?'#f6cc72':'#71d4ed'):car.a < -3?'#e69b86':car.policy==='switch'?'#b6a1d9':'#7c919c';ctx.fillRect(px-10,30+lane*43,Math.max(12,5/span*c.width),19);if(car===w.car){ctx.strokeStyle='#fff';ctx.strokeRect(px-13,27+lane*43,Math.max(18,5/span*c.width+6),25);}}
 ctx.fillStyle='#d2e0e7';ctx.font='13px system-ui';ctx.fillText(`${Math.round(left)} m → ${Math.round(left+span)} m`,12,202);
 });
 const summary=summarize(rows);$('summary').textContent=summary.n?`${summary.n} gyldige af ${rows.length} par · Middel: ${fmt(summary.mean)} s · Median: ${fmt(summary.median)} s · Spænd: ${fmt(summary.min)} til ${fmt(summary.max)} s`:`${rows.length} registrerede par · Ingen gyldige, afsluttede par endnu.`;
 $('records').replaceChildren(...rows.map(r=>{const tr=document.createElement('tr');for(const text of [`${r.seed} / ${r.lane+1}`,`${r.share} %`,...r.times.map(t=>t===null?'Ingen gyldig ankomst':fmt(t)+' s'),r.valid?fmt(r.delta)+' s':'Ugyldigt / uafsluttet',r.trafficSpeed.map(v=>v===null?'–':fmt(v)).join(' / ')+' km/t']){const td=document.createElement('td');td.textContent=text;tr.append(td);}return tr;}));
 const ctx=$('chart').getContext('2d');ctx.clearRect(0,0,1000,260);ctx.strokeStyle='#536672';ctx.strokeRect(60,20,900,200);ctx.fillStyle='#d2e0e7';ctx.font='16px system-ui';ctx.fillText('2.000 m',0,20);ctx.fillText('0 m',15,220);ctx.fillText(`Tid: 0 → ${fmt(pair.time)} s`,360,250);
 for(let i=0;i<2;i++){ctx.strokeStyle=i?'#f6cc72':'#71d4ed';ctx.lineWidth=3;ctx.beginPath();pair.samples.forEach((s,n)=>{const x=60+s.t/Math.max(1,pair.time)*900,y=220-s.d[i]/2000*200;n?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();}
 const lastSample=pair.samples.at(-1);$('chartText').textContent=`Seneste sample ${fmt(lastSample.t)} s: hold ${fmt(lastSample.d[0])} m, skift ${fmt(lastSample.d[1])} m. Blå = hold; gul = skift.`;
}
async function complete(token){while(!pair.done&&token===generation){pair.advance(2);if(Math.round(pair.time)%10===0)render();await new Promise(resolve=>setTimeout(resolve,0));}if(token!==generation)return false;save();render();return true;}
$('finish').onclick=async()=>{if(busy)return;running=false;busy=true;const token=++generation;render();await complete(token);if(token===generation){busy=false;render();}};
$('series').onclick=async()=>{if(busy)return;running=false;busy=true;rows=[];const token=++generation,p=params();for(let i=0;i<6;i++){if(token!==generation)return;pair=new Pair({...p,seed:p.seed+i,lane:(p.lane+i)%4});render();if(!await complete(token))return;}busy=false;render();};
$('play').onclick=()=>{generation++;busy=false;if(pair.done)return;running=!running;last=0;render();};$('reset').onclick=reset;
for(const id of ['load','share','threshold','seed','lane'])$(id).onchange=()=>{if(id==='seed')$('seed').value=Math.max(1,Math.min(999999,Math.trunc(Number($('seed').value)||47)));reset();};$('camera').onchange=render;$('share').oninput=()=>$('shareValue').value=$('share').value+' %';
function frame(now){if(running){pair.advance(last?Math.min(.1,(now-last)/1000)*8:0);if(pair.done){running=false;save();}render();}last=now;requestAnimationFrame(frame);}reset();requestAnimationFrame(frame);
