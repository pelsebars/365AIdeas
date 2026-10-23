'use strict';
const $=id=>document.getElementById(id),P=Perspective;
const stage=$('stage'),canvas=$('source'),ctx=canvas.getContext('2d'),svg=$('overlay'),result=$('result');
const names=['L1 · Venstre','L2 · Højre','V1 · Top','V2 · Bund'],colors=['#eeaf72','#eeaf72','#7fd7d0','#7fd7d0'];
let original=null,sourcePixels=null,lines=[],history=[],selected=0,activePoint=null,view={scale:1,x:0,y:0},baseScale=1,drag=null,drawing=false,valid=false,ratio=1,quad=null,matrix=null,customSize=false,previewRevision=0,busy=false,loadRevision=0,filename='tekstur';
function status(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);}
function snapshot(){history.push(JSON.parse(JSON.stringify(lines)));if(history.length>80)history.shift();$('undo').disabled=false;}
function defaultLines(w,h){return [[{x:w*.18,y:h*.22},{x:w*.18,y:h*.78}],[{x:w*.82,y:h*.22},{x:w*.82,y:h*.78}],[{x:w*.26,y:h*.18},{x:w*.74,y:h*.18}],[{x:w*.26,y:h*.82},{x:w*.74,y:h*.82}]];}
function selectLine(i){selected=i;document.querySelectorAll('.line-controls button').forEach((b,j)=>b.classList.toggle('active',j===i));$('step-help').textContent=i<2?'Lodret '+(i+1)+' af 2: følg en fysisk lodret kant på fladen.':'Vandret '+(i-1)+' af 2: følg en fysisk vandret kant på samme flade.';}
names.forEach((name,i)=>{const button=document.createElement('button');button.textContent=name;button.onclick=()=>selectLine(i);$('line-controls').append(button);});selectLine(0);
function fit(){if(!original)return;baseScale=Math.min(stage.clientWidth/original.width,stage.clientHeight/original.height)*.88;view={scale:baseScale,x:(stage.clientWidth-original.width*baseScale)/2,y:(stage.clientHeight-original.height*baseScale)/2};paint();}
function screen(p){return {x:p.x*view.scale+view.x,y:p.y*view.scale+view.y};}
function imagePoint(p){return {x:(p.x-view.x)/view.scale,y:(p.y-view.y)/view.scale};}
function local(e){const r=stage.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
function paint(){
 const w=stage.clientWidth,h=stage.clientHeight,dpr=window.devicePixelRatio||1;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 if(!original)return;ctx.drawImage(original,view.x,view.y,original.width*view.scale,original.height*view.scale);svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
 // Preserve focused SVG handles across drawing updates.
 const focus=document.activeElement?.dataset?.point;svg.replaceChildren();
 function element(type,attrs){const el=document.createElementNS('http://www.w3.org/2000/svg',type);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,value);svg.append(el);return el;}
 if(valid&&quad){const points=quad.map(p=>{const s=screen(p);return `${s.x},${s.y}`;}).join(' ');element('polygon',{points,fill:'#d9ec9a12',stroke:'#d9ec9a77','stroke-width':1});}
 lines.forEach((line,i)=>{const [a,b]=line.map(screen),dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,extent=2*(w+h);element('line',{x1:a.x-dx/len*extent,y1:a.y-dy/len*extent,x2:b.x+dx/len*extent,y2:b.y+dy/len*extent,stroke:colors[i],'stroke-width':1,'stroke-dasharray':'5 5',opacity:.8});element('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:colors[i],'stroke-width':2.5});
  [a,b].forEach((p,j)=>{const el=element('circle',{cx:p.x,cy:p.y,r:8,fill:colors[i],tabindex:0,role:'button','aria-label':`${names[i]}, punkt ${j+1}. Brug piletaster for at flytte.`, 'data-point':`${i}-${j}`});el.addEventListener('focus',()=>{activePoint=[i,j];selectLine(i);});});
  const label=element('text',{x:a.x+12,y:a.y-12});label.textContent=names[i].split(' · ')[0];
 });
 if(focus)svg.querySelector(`[data-point="${focus}"]`)?.focus({preventScroll:true});$('zoom').textContent=Math.round(view.scale/baseScale*100)+'%';
}
function outputSize(){return {width:Number($('out-width').value),height:Number($('out-height').value)};}
function setSize(width){const height=Math.max(1,Math.round(width/ratio));$('out-width').value=Math.max(1,Math.round(width));$('out-height').value=height;}
function suggest(){if(quad){const size=P.dimensions(quad,ratio);setSize(size.width);}}
function validateSize(){const {width,height}=outputSize();if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1)throw Error('Angiv hele, positive pixelmål.');if(width>16384||height>16384||width*height>40000000)throw Error('Output er for stort til denne apps sikre canvasgrænse (40 megapixel og 16.384 px pr. side). Vælg selv mindre pixelmål.');return {width,height};}
function update(){
 if(!original)return;valid=false;
 try{
  quad=P.quad(lines,original.width,original.height);matrix=P.homography(quad);
  const manual=$('ratio-mode').value==='manual',rw=Number($('real-width').value),rh=Number($('real-height').value);
  if(manual&&(!(rw>0)||!(rh>0)))throw Error('Indtast en positiv bredde og højde for de kendte mål.');
  ratio=(manual?rw/rh:P.estimate(quad))*2**Number($('stretch').value);
  if(!Number.isFinite(ratio)||ratio<.02||ratio>50)throw Error('Vælg et bredde/højde-forhold mellem 1:50 og 50:1.');
  $('ratio-label').textContent=ratio.toLocaleString('da-DK',{maximumFractionDigits:3})+' : 1';
  if(!customSize)suggest();else setSize(Number($('out-width').value)||1);
  valid=true;status((manual?'Kendte proportioner':'Estimerede proportioner')+' · '+ratio.toLocaleString('da-DK',{maximumFractionDigits:3})+' : 1. Flyt punkterne, og kontrollér resultatet med gitteret.');
  try{validateSize();}catch(error){status(error.message,true);}
 }catch(error){status(error.message,true);}
 $('save').disabled=!valid||busy;$('reset').disabled=false;$('draw').disabled=false;
 if(!valid){previewRevision++;$('result-wrap').style.display='none';$('result-empty').hidden=false;$('result-empty').textContent='Ret markeringerne for at se resultatet';}
 else schedulePreview();paint();
}
async function schedulePreview(){
 const revision=++previewRevision;await new Promise(requestAnimationFrame);if(revision!==previewRevision||!valid)return;
 const width=Math.max(1,Math.round(Math.min(640,640*ratio))),height=Math.max(1,Math.round(width/ratio)),dst=new ImageData(width,height),m=matrix.slice(),src=sourcePixels;
 P.renderRows(src,dst,m,0,height);
 result.width=width;result.height=height;result.getContext('2d').putImageData(dst,0,0);$('result-wrap').style.display='block';$('result-empty').hidden=true;$('preview-info').textContent=`Forhåndsvisning ${width} × ${height} · eksport bruger originalen`;
}
function installImage(image,name,demoLines=null){
 const w=image.width||image.naturalWidth,h=image.height||image.naturalHeight;
 if(!w||!h||w>20000||h>20000||w*h>50000000)throw Error('Billedet overskrider grænsen på 50 megapixel eller 20.000 px pr. side. Gem selv en mindre kopi, og vælg den. Originalen ændres ikke.');
 const next=document.createElement('canvas');next.width=w;next.height=h;const c=next.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);const pixels=c.getImageData(0,0,w,h);
 original=next;sourcePixels=pixels;filename=name.replace(/\.[^.]+$/,'')||'tekstur';lines=demoLines||defaultLines(w,h);history=[];activePoint=null;drawing=false;drag=null;customSize=false;$('undo').disabled=true;$('empty').hidden=true;$('empty').style.display='none';$('source-size').textContent=`${w} × ${h} PX`;$('ratio-mode').value='auto';$('real-width').disabled=$('real-height').disabled=true;$('stretch').value=0;selectLine(0);fit();update();
}
$('file').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;const revision=++loadRevision;status('Indlæser originalen og anvender billedets orientering …');let bitmap;
 try{bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});if(revision!==loadRevision)return;installImage(bitmap,file.name);}catch(error){if(revision===loadRevision)status('Billedet kunne ikke indlæses. '+(error.message.includes('grænsen')?error.message:'Prøv PNG, JPEG eller WebP. Ved store filer kan browserens hukommelse kræve en mindre kopi.'),true);}finally{bitmap?.close();e.target.value='';}
});
$('demo').onclick=()=>{
 loadRevision++;const c=document.createElement('canvas');c.width=1400;c.height=1050;const g=c.getContext('2d');g.fillStyle='#c9c5ae';g.fillRect(0,0,c.width,c.height);
 const q=[{x:330,y:130},{x:1120,y:250},{x:1280,y:900},{x:140,y:850}],m=P.homography(q);g.fillStyle='#e9e4cc';g.beginPath();q.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill();
 for(let i=0;i<=10;i++){for(const vertical of [true,false]){const a=P.map(m,vertical?i/10:0,vertical?0:i/10),b=P.map(m,vertical?i/10:1,vertical?1:i/10);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle=i%5===0?'#304e46':'#698078';g.lineWidth=i%5===0?7:3;g.stroke();}}
 const demoLines=[[P.map(m,0,.16),P.map(m,0,.69)],[P.map(m,1,.3),P.map(m,1,.87)],[P.map(m,.18,0),P.map(m,.72,0)],[P.map(m,.28,1),P.map(m,.88,1)]];installImage(c,'testgitter',demoLines);
};
function zoomBy(factor,p={x:stage.clientWidth/2,y:stage.clientHeight/2}){if(!original)return;const old=view.scale,next=Math.max(baseScale*.25,Math.min(baseScale*24,old*factor));view.x=p.x-(p.x-view.x)*next/old;view.y=p.y-(p.y-view.y)*next/old;view.scale=next;paint();}
$('plus').onclick=()=>zoomBy(1.3);$('minus').onclick=()=>zoomBy(1/1.3);$('fit').onclick=fit;
stage.addEventListener('wheel',e=>{if(!original)return;e.preventDefault();zoomBy(Math.exp(-e.deltaY*.0015),local(e));},{passive:false});
stage.addEventListener('pointerdown',e=>{
 if(!original||e.button>0||drag)return;e.preventDefault();const p=local(e),ip=imagePoint(p);stage.setPointerCapture(e.pointerId);
 if(drawing){snapshot();lines[selected]=[{...ip},{...ip}];drag={type:'draw',pointer:e.pointerId,line:selected};drawing=false;update();}
 else{
  let nearest=null,min=23;lines.forEach((l,i)=>l.forEach((pt,j)=>{const s=screen(pt),d=Math.hypot(s.x-p.x,s.y-p.y);if(d<min){min=d;nearest=[i,j];}}));
  if(nearest&&!$('pan').checked){snapshot();activePoint=nearest;selectLine(nearest[0]);drag={type:'point',pointer:e.pointerId,line:nearest[0],point:nearest[1]};svg.querySelector(`[data-point="${nearest.join('-')}"]`)?.focus({preventScroll:true});}
  else drag={type:'pan',pointer:e.pointerId,start:p,x:view.x,y:view.y};
 }
});
stage.addEventListener('pointermove',e=>{if(!drag||drag.pointer!==e.pointerId)return;const p=local(e);if(drag.type==='pan'){view.x=drag.x+p.x-drag.start.x;view.y=drag.y+p.y-drag.start.y;paint();}else{const ip=imagePoint(p);ip.x=Math.max(-original.width*2,Math.min(original.width*3,ip.x));ip.y=Math.max(-original.height*2,Math.min(original.height*3,ip.y));lines[drag.line][drag.type==='draw'?1:drag.point]=ip;update();}});
function endDrag(){if(drag?.type==='draw'){selectLine(Math.min(3,drag.line+1));}drag=null;}
stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',endDrag);
svg.addEventListener('keydown',e=>{if(!activePoint||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();snapshot();const p=lines[activePoint[0]][activePoint[1]],d=e.shiftKey?10:1;p.x+=e.key==='ArrowLeft'?-d:e.key==='ArrowRight'?d:0;p.y+=e.key==='ArrowUp'?-d:e.key==='ArrowDown'?d:0;update();});
$('draw').onclick=()=>{drawing=!drawing;status(drawing?`Tegn ${names[selected]}: træk fra første til andet punkt på billedet.`:'Tegning annulleret.');};
$('undo').onclick=()=>{if(history.length){lines=history.pop();$('undo').disabled=!history.length;drawing=false;update();}};
$('reset').onclick=()=>{snapshot();lines=defaultLines(original.width,original.height);drawing=false;selectLine(0);fit();update();};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){drawing=false;drag=null;}if((e.ctrlKey||e.metaKey)&&e.key==='z'&&!['INPUT','SELECT'].includes(e.target.tagName)){e.preventDefault();$('undo').click();}});
$('ratio-mode').onchange=()=>{const manual=$('ratio-mode').value==='manual';$('real-width').disabled=$('real-height').disabled=!manual;if(manual&&quad){$('real-width').value=P.estimate(quad).toFixed(4);$('real-height').value=1;}$('stretch').value=0;customSize=false;update();};
for(const id of ['real-width','real-height','stretch'])$(id).addEventListener('input',()=>{customSize=false;update();});
$('out-width').oninput=()=>{customSize=true;const w=Number($('out-width').value);if(w>0)setSize(w);else status('Angiv en positiv bredde.',true);};
$('out-height').oninput=()=>{customSize=true;const h=Number($('out-height').value);if(h>0){$('out-height').value=Math.round(h);$('out-width').value=Math.max(1,Math.round(h*ratio));}else status('Angiv en positiv højde.',true);};
$('suggest').onclick=()=>{customSize=false;update();};$('grid').onchange=()=>{$('grid-overlay').hidden=!$('grid').checked;};$('format').onchange=()=>{$('quality').disabled=$('format').value!=='jpeg';};
$('save').onclick=async()=>{
 if(!valid||busy)return;let out;
 try{
  const {width,height}=validateSize(),m=matrix.slice(),src=sourcePixels,format=$('format').value,quality=Number($('quality').value),name=filename;busy=true;$('save').disabled=true;
  out=document.createElement('canvas');out.width=width;out.height=height;const c=out.getContext('2d');if(!c)throw Error('Canvas kunne ikke oprettes.');
  // Bounded row buffers avoid allocating another full-size RGBA image.
  for(let y=0;y<height;y+=32){const rows=Math.min(32,height-y),strip=c.createImageData(width,rows);const proxy={width,height,data:strip.data};
   P.renderRows(src,proxy,m,y,y+rows,y);c.putImageData(strip,0,y);status(`Beregner eksport fra originalen … ${Math.round((y+rows)/height*100)} %`);await new Promise(resolve=>setTimeout(resolve,0));
  }
  if(format==='jpeg'){c.globalCompositeOperation='destination-over';c.fillStyle='#fff';c.fillRect(0,0,width,height);}
  const blob=await new Promise(resolve=>out.toBlob(resolve,'image/'+format,quality));if(!blob)throw Error('Browserens canvas- eller hukommelsesgrænse er nået.');
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${name}-oprettet-${width}x${height}.${format==='jpeg'?'jpg':'png'}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status(`Gemt: ${width} × ${height} pixels · ${format.toUpperCase()}. Beregnet direkte fra originalbilledet.`);
 }catch(error){status('Eksport kunne ikke gennemføres. '+error.message+' Prøv mindre outputdimensioner; kvaliteten ændres ikke automatisk.',true);}finally{busy=false;$('save').disabled=!valid;if(out){out.width=1;out.height=1;}}
};
new ResizeObserver(()=>{if(original)fit();}).observe(stage);
