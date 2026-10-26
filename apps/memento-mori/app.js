const el = id => document.getElementById(id);
const number = n => n.toLocaleString('da-DK');
const dateText = d => d.toLocaleDateString('da-DK',{day:'numeric',month:'long',year:'numeric'});
let result, cell, columns, visibleDays;
function describeDay() {
 const day = Number(el('day').value), p = lifeModel.probability(result,day);
 el('day-info').textContent = `Dag ${number(day+1)} · ${dateText(lifeModel.date(day))} · cirka ${Math.round(p*100)}% statistisk døde inden denne dag. ${day===result.days?'† Statistisk forventningsdato.':''}`;
}
function draw() {
 columns = Number(el('columns').value);
 visibleDays = el('beyond').checked ? result.maxDays+1 : result.days+1;
 const canvas=el('grid'), width=Math.min(640,el('tapestry').clientWidth-(innerWidth<600?12:22));
 cell=width/columns;canvas.width=Math.floor(width);canvas.height=Math.ceil(visibleDays/columns)*cell;
 const ctx=canvas.getContext('2d');
 for(let day=0;day<visibleDays;day++) {
  const x=(day%columns)*cell, y=Math.floor(day/columns)*cell;
  const shade=lifeModel.shade(lifeModel.probability(result,day));
  ctx.fillStyle=`rgb(${shade},${shade},${shade})`;ctx.fillRect(x+1,y+1,Math.max(1,cell-2),Math.max(1,cell-2));
  if(day===result.days){ctx.fillStyle='#b25123';ctx.fillRect(x,y,cell,cell);ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(1,cell/9);ctx.beginPath();ctx.moveTo(x+cell/2,y+cell*.13);ctx.lineTo(x+cell/2,y+cell*.88);ctx.moveTo(x+cell*.2,y+cell*.38);ctx.lineTo(x+cell*.8,y+cell*.38);ctx.stroke();}
 }
 el('day').max=visibleDays-1;el('day').value=Math.min(Number(el('day').value),visibleDays-1);describeDay();
}
function curve() {
 const points=[];for(let age=result.age;age<=99;age++)points.push(`${55+((age-result.age)/(99-result.age))*555},${190-lifeData[result.sex].survivors[age]/lifeData[result.sex].survivors[result.age]*160}`);
 el('curve').innerHTML=`<g fill="none" stroke="#b8bcb0"><path d="M55 30V190H610 M55 110H610"/></g><polyline fill="none" stroke="#526d5a" stroke-width="3" points="${points.join(' ')}"/><g fill="#283b35" font-size="12" font-family="system-ui"><text x="6" y="35">100%</text><text x="15" y="115">50%</text><text x="22" y="194">0%</text><text x="55" y="211">${result.age} år</text><text x="574" y="211">99 år</text><text x="250" y="231">Fremtidig alder</text><text x="65" y="20">Andel stadig i live</text></g>`;
}
function generate() {
 try {
  const age=el('age').value.trim();result=lifeModel.estimate(age===''?NaN:Number(age),el('sex').value);el('error').textContent='';
  el('days').textContent=number(result.days);el('years').textContent=result.years.toLocaleString('da-DK',{maximumFractionDigits:1});
  el('expectation').textContent=`† Statistisk forventningsdato: ${dateText(lifeModel.date(result.days))} · ${result.age} år, ${result.sex==='M'?'mænd':'kvinder'}.`;
  el('tapestry').scrollTop=0;el('day').value=0;draw();curve();
 } catch(error){el('error').textContent=error.message;}
}
el('settings').addEventListener('submit',event=>{event.preventDefault();generate();});
el('reset-button').addEventListener('click',()=>{el('settings').reset();el('columns').value='40';el('beyond').checked=false;generate();});
el('columns').addEventListener('change',draw);el('beyond').addEventListener('change',draw);el('day').addEventListener('input',describeDay);
el('jump').addEventListener('click',()=>{el('tapestry').scrollTop=Math.floor(result.days/columns)*cell-el('tapestry').clientHeight/2;el('day').value=result.days;describeDay();});
el('grid').addEventListener('click',event=>{const rect=el('grid').getBoundingClientRect();const day=Math.floor((event.clientY-rect.top)/cell)*columns+Math.floor((event.clientX-rect.left)/cell);if(day<visibleDays){el('day').value=day;describeDay();}});
window.addEventListener('resize',()=>{if(result)draw();});generate();
