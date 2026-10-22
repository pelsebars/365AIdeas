'use strict';
const $ = id => document.getElementById(id);
const diagram = $('diagram'), series = $('series');
const full = {r0:2.5,r1:4,x0:0,x1:1};
let view = {...full}, history = [], rate = 3.9, initial = 0.2, worker, renderId = 0;
let burn = 1600, keep = 320, plot, marking = false, drag = null, resizing;
const margin = {left:43,right:13,top:16,bottom:33};
const stops = [
  ['Stabilitet',2.8,[2.5,3.05,0.45,0.8],'Ét stabilt niveau','Ved r = 2,8 nærmer bestanden sig 0,642857… efter indkøring. Små afvigelser dæmpes fra trin til trin. En hel tidsserie falder derfor sammen til ét lyspunkt.'],
  ['Periode 2',3.2,[2.95,3.45,0.4,0.9],'Frem og tilbage','Ved r = 3,2 skifter bestanden mellem cirka 0,5130 og 0,7995. To generationer senere er den tilbage. Den første forgrening er begyndelsen på periodedoblingerne.'],
  ['Periode 4',3.5,[3.43,3.57,0.3,0.92],'Nu skal der fire trin til','Ved r = 3,5 gentages fire niveauer: cirka 0,3828, 0,5009, 0,8269 og 0,8750. Forgreningerne ligger stadig tættere, når r øges.'],
  ['På kanten',3.56995,[3.554,3.575,0.46,0.57],'Forgreninger uden ende','Periodedoblingerne ophobes ved r ≈ 3,569945672. Her viser vi et lille udsnit af en gren. r = 3,56995 ligger lige over grænsen. Nær kanten kræves lang indkøring; billedet er en numerisk tilnærmelse.'],
  ['Periode 3',3.83,[3.825,3.858,0,1],'En ø af orden','Ved r = 3,83 vender bestanden tilbage efter tre trin: cirka 0,1561, 0,5047 og 0,9574. Inde i et uroligt område findes et regelmæssigt vindue, som selv forgrener sig.'],
  ['Kaos',3.9,[3.75,4,0,1],'To næsten ens begyndelser','Ved r = 3,9 er typiske forløb kaotiske. Sammenlign de to startværdier: deres afstand kan vokse, selv om reglen er den samme. En særlig startværdi kan dog følge et ustabilt periodisk forløb.']
];
const fmt = (x,d=6) => x.toLocaleString('da-DK',{maximumFractionDigits:d});
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
function dimensions(canvas) {
  const rect = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1,2);
  canvas.width = Math.round(rect.width*dpr); canvas.height = Math.round(rect.height*dpr);
  const ctx = canvas.getContext('2d'); ctx.scale(dpr,dpr);
  return {ctx,w:rect.width,h:rect.height,dpr};
}
function axes(ctx,w,h,bounds) {
  const p = {x:margin.left,y:margin.top,w:w-margin.left-margin.right,h:h-margin.top-margin.bottom};
  ctx.fillStyle = '#101918'; ctx.fillRect(0,0,w,h);
  ctx.font = '10px monospace';
  const fineX=bounds.x1-bounds.x0<.001, fineR=bounds.r1-bounds.r0<.001;
  if(fineX || fineR){ctx.fillStyle='#a0b0a8';ctx.textAlign='left';ctx.fillText(`${fineX?'x: '+fmt(bounds.x0,9)+' + akseværdi ':''}${fineR?'r: '+fmt(bounds.r0,9)+' + akseværdi':''}`,p.x,10);}
  const tick=(value,base,fine)=>fine?(value-base===0?'0':(value-base).toExponential(1).replace('.',',')):fmt(value,5);
  for(let i=0;i<=4;i++) {
    const a=i/4, y=p.y+p.h*(1-a), x=p.x+p.w*a;
    ctx.strokeStyle='#273831'; ctx.lineWidth=.6;
    ctx.beginPath();ctx.moveTo(p.x,y);ctx.lineTo(p.x+p.w,y);ctx.stroke();
    ctx.fillStyle='#a0b0a8';ctx.textAlign='right';ctx.fillText(tick(bounds.x0+a*(bounds.x1-bounds.x0),bounds.x0,fineX),p.x-7,y+3);
    ctx.textAlign=i===0?'left':i===4?'right':'center';ctx.fillText(tick(bounds.r0+a*(bounds.r1-bounds.r0),bounds.r0,fineR),x,p.y+p.h+19);
  }
  ctx.textAlign='left';ctx.fillStyle='#d2ef97';ctx.fillText('x',8,12);ctx.fillText(bounds.label || 'r',w-10,h-3);
  return p;
}
function drawSelectionLine(ctx) {
  if(rate<view.r0 || rate>view.r1)return;
  const x=plot.x+(rate-view.r0)/(view.r1-view.r0)*plot.w;
  ctx.strokeStyle='#d2ef97';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x,plot.y);ctx.lineTo(x,plot.y+plot.h);ctx.stroke();ctx.setLineDash([]);
}
let rendered = null;
function paint() {
  const {ctx,w,h}=dimensions(diagram);plot=axes(ctx,w,h,view);
  if(rendered)ctx.drawImage(rendered,plot.x,plot.y,plot.w,plot.h);
  drawSelectionLine(ctx);$('selected-note').textContent=rate<view.r0||rate>view.r1?'Valgt r ligger uden for det viste udsnit.':'';
}
function render() {
  worker?.terminate(); const id=++renderId; rendered=null;paint();
  const depth=Math.max(0,Math.log2(1.5/(view.r1-view.r0)));
  burn=Math.min(14000,1600+Math.round(depth)*700);
  keep=Math.min(900,320+Math.round(depth)*40);
  const low=window.innerWidth<760 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency<=4);
  const width=Math.max(1,Math.round(plot.w*(low?1:Math.min(devicePixelRatio||1,1.5))));
  const height=Math.max(1,Math.round(plot.h*(low?1:1.5)));
  $('status').textContent='Beregner nyt udsnit …';
  $('ranges').textContent=`r ${fmt(view.r0,9)}–${fmt(view.r1,9)} / x ${fmt(view.x0,9)}–${fmt(view.x1,9)}`;
  $('precision').textContent=`${burn.toLocaleString('da-DK')} trin kasseres · ${keep} trin tegnes pr. r · ${width*2} r-prøver. ${depth>15?'Meget dybt zoom: indkøring og afrunding kan dominere billedet.':'Endeligt antal iterationer; helt smalle detaljer kan mangle.'}`;
  $('undo').disabled=!history.length;
  drawSeries();
  try { worker=new Worker('worker.js'); } catch { workerError();return; }
  worker.onerror=workerError;
  worker.onmessage=({data:{density,width,height}})=>{
    if(id!==renderId)return;
    rendered=document.createElement('canvas');rendered.width=width;rendered.height=height;
    const ctx=rendered.getContext('2d'), img=ctx.createImageData(width,height);
    for(let i=0;i<density.length;i++)if(density[i]){
      const strength=Math.min(1,.35+Math.log1p(density[i])*.14),j=i*4;
      img.data[j]=Math.round(110*strength);img.data[j+1]=Math.round(235*strength);img.data[j+2]=Math.round(185*strength);img.data[j+3]=255;
    }
    ctx.putImageData(img,0,0);paint();$('status').textContent='● Udsnit beregnet';worker.terminate();
  };
  worker.postMessage({view,width,height,burn,keep,initial,samples:width*2});
}
function workerError(){ $('status').textContent='Beregning kunne ikke startes';$('precision').textContent='Genindlæs siden fra en webserver. Browseren skal tillade Web Workers.'; }
function navigate(next,save=true){
  if(next.r1-next.r0<1e-9 || next.x1-next.x0<1e-9){$('status').textContent='Zoomgrænse nået (10⁻⁹)';return;}
  if(save){history.push({...view});if(history.length>100)history.shift();}view=next;render();
}
function zoom(factor,atR=(rate>=view.r0 && rate<=view.r1?rate:(view.r0+view.r1)/2),atX=(view.x0+view.x1)/2){
  const rw=Math.min(1.5,(view.r1-view.r0)*factor),xw=Math.min(1,(view.x1-view.x0)*factor);
  const r0=clamp(atR-(atR-view.r0)*factor,2.5,4-rw),x0=clamp(atX-(atX-view.x0)*factor,0,1-xw);
  navigate({r0,r1:r0+rw,x0,x1:x0+xw});
}
function pan(direction){const rw=view.r1-view.r0,xw=view.x1-view.x0;let r0=view.r0,x0=view.x0;
  if(direction==='left')r0-=rw*.2;if(direction==='right')r0+=rw*.2;if(direction==='up')x0+=xw*.2;if(direction==='down')x0-=xw*.2;
  r0=clamp(r0,2.5,4-rw);x0=clamp(x0,0,1-xw);navigate({r0,r1:r0+rw,x0,x1:x0+xw});
}
function chooseRate(value){rate=clamp(value,2.5,4);$('rate').value=rate;$('rate-number').value=Number(rate.toFixed(9));$('rate-label').textContent=fmt(rate,9);paint();drawSeries();}
function drawSeries(){
  const {ctx,w,h}=dimensions(series),tail=$('phase').value==='tail',start=tail?burn:0;
  const p=axes(ctx,w,h,{r0:start,r1:start+80,x0:0,x1:1,label:'n'});
  // Early values are deliberately shown as a transient, never mixed with retained points.
  if(!tail){ctx.fillStyle='#d2ef970a';ctx.fillRect(p.x,p.y,p.w,p.h);}
  function line(x,color,dashed){
    for(let n=0;n<start;n++)x=rate*x*(1-x);
    ctx.strokeStyle=color;ctx.lineWidth=1.3;ctx.setLineDash(dashed?[4,3]:[]);ctx.beginPath();
    for(let i=0;i<=80;i++){const px=p.x+i/80*p.w,py=p.y+(1-x)*p.h;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);x=rate*x*(1-x);}ctx.stroke();ctx.setLineDash([]);
  }
  // Draw the comparison last, dashed, so coinciding paths remain identifiable.
  line(initial,'#76d7b6',false);
  const second=Math.min(1,initial+1e-6);
  if($('compare').checked)line(second,'#efb697',true);
  $('series-caption').textContent=tail?`n = ${burn}–${burn+80}. n = ${burn} er sidste indkøringstrin; punkter fra n = ${burn+1} bruges i diagrammet. Også indkøringen kan være for kort nær en forgrening.`:`n = 0–80: begyndelsen af indkøringen. Diagrammet kasserer n = 1–${burn} og tegner n = ${burn+1}–${burn+keep}.`;
  if(initial>1-1e-6 && $('compare').checked)$('series-caption').textContent+=` Anden start er begrænset til 1 (x₀′ = ${fmt(second,9)}).`;
}
for(const [i,stop] of stops.entries()){
  const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed','false');
  button.innerHTML=`<b>0${i+1}</b><span>${stop[0]}</span><small>${fmt(stop[1],5)}</small>`;
  button.onclick=()=>{document.querySelectorAll('.stops button').forEach(b=>b.setAttribute('aria-pressed','false'));button.setAttribute('aria-pressed','true');$('stop-number').textContent=`STOP 0${i+1} / r = ${fmt(stop[1],5)}`;$('stop-title').textContent=stop[3];$('stop-text').textContent=stop[4];chooseRate(stop[1]);const [r0,r1,x0,x1]=stop[2];navigate({r0,r1,x0,x1});};$('stops').append(button);
}
$('center-rate').onclick=()=>{const width=view.r1-view.r0,r0=clamp(rate-width/2,2.5,4-width);navigate({...view,r0,r1:r0+width});};
$('zoom-in').onclick=()=>zoom(.5);$('zoom-out').onclick=()=>zoom(2);
$('undo').onclick=()=>{if(history.length)navigate(history.pop(),false);};
function overview(){document.querySelectorAll('.stops button').forEach(b=>b.setAttribute('aria-pressed','false'));$('stop-number').textContent='DET STORE BILLEDE';$('stop-title').textContent='En regel. Mange fremtider.';$('stop-text').textContent='Hver lodret søjle er sit eget forsøg med en fast r. Lyspunkterne viser bestanden efter indkøring. Vælg et stop, eller udforsk på egen hånd.';navigate({...full});}
$('reset').onclick=overview;$('overview').onclick=overview;
document.querySelectorAll('[data-pan]').forEach(b=>b.onclick=()=>pan(b.dataset.pan));
$('touch-zoom').onclick=()=>{marking=!marking;diagram.classList.toggle('marking',marking);$('touch-zoom').setAttribute('aria-pressed',String(marking));};
$('parameters').onsubmit=e=>e.preventDefault();
$('rate').oninput=e=>chooseRate(Number(e.target.value));
$('rate-number').oninput=e=>{if(e.target.value!=='' && e.target.validity.valid)chooseRate(Number(e.target.value));};
$('initial').oninput=e=>{if(e.target.value!=='' && e.target.validity.valid){initial=Number(e.target.value);render();}};
$('compare').onchange=drawSeries;$('phase').onchange=drawSeries;
function point(e){const rect=diagram.getBoundingClientRect();return {x:clamp(e.clientX-rect.left,plot.x,plot.x+plot.w),y:clamp(e.clientY-rect.top,plot.y,plot.y+plot.h)};}
function coords(p){return {r:view.r0+(p.x-plot.x)/plot.w*(view.r1-view.r0),x:view.x1-(p.y-plot.y)/plot.h*(view.x1-view.x0)};}
diagram.onpointerdown=e=>{if(!e.isPrimary)return;const p=point(e);drag={start:p,end:p,canZoom:e.pointerType!=='touch'||marking};diagram.setPointerCapture(e.pointerId);};
diagram.onpointermove=e=>{if(!drag)return;drag.end=point(e);if(!drag.canZoom)return;const a=drag.start,b=drag.end,s=$('selection');s.hidden=false;Object.assign(s.style,{left:`${Math.min(a.x,b.x)}px`,top:`${Math.min(a.y,b.y)}px`,width:`${Math.abs(b.x-a.x)}px`,height:`${Math.abs(b.y-a.y)}px`});};
diagram.onpointerup=e=>{if(!drag)return;const a=drag.start,b=point(e),distance=Math.hypot(a.x-b.x,a.y-b.y);const canZoom=drag.canZoom;drag=null;$('selection').hidden=true;
 if(canZoom && Math.abs(b.x-a.x)>8 && Math.abs(b.y-a.y)>8){const u=coords(a),v=coords(b);navigate({r0:Math.min(u.r,v.r),r1:Math.max(u.r,v.r),x0:Math.min(u.x,v.x),x1:Math.max(u.x,v.x)});}else if(distance<8)chooseRate(coords(b).r);
};
diagram.onpointercancel=()=>{drag=null;$('selection').hidden=true;};
let wheelTimer;
diagram.addEventListener('wheel',e=>{e.preventDefault();clearTimeout(wheelTimer);const p=coords(point(e));wheelTimer=setTimeout(()=>zoom(e.deltaY<0?.75:1.333,p.r,p.x),80);},{passive:false});
diagram.onkeydown=e=>{const directions={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
 if(e.key==='+'||e.key==='='){e.preventDefault();zoom(.5);}else if(e.key==='-'){e.preventDefault();zoom(2);}else if(directions[e.key]){e.preventDefault();if(e.shiftKey)pan(directions[e.key]);else chooseRate(rate+(e.key==='ArrowLeft'||e.key==='ArrowDown'?-1:1)*(view.r1-view.r0)/500);}else if(e.key==='Escape'){drag=null;$('selection').hidden=true;} };
new ResizeObserver(()=>{clearTimeout(resizing);resizing=setTimeout(render,120);}).observe(diagram);
chooseRate(rate);render();
