/* Pixelrækkefølge: y*10+x; binære værdier uden normalisering. */
globalThis.ShapeNet = {
 forward(x,m){
  const z=m.w1.map((w,j)=>w.reduce((s,v,i)=>s+v*x[i],m.b1[j]));
  const h=z.map(Math.tanh);
  const logits=m.w2.map((w,j)=>w.reduce((s,v,i)=>s+v*h[i],m.b2[j]));
  const e=logits.map(v=>Math.exp(v-Math.max(...logits))),sum=e.reduce((a,b)=>a+b,0);
  return {z,h,logits,p:e.map(v=>v/sum)};
 },
 rng(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};},
 sample(r,label){
  const x=Array(100).fill(0),cx=3.5+r()*2,cy=3.5+r()*2,size=2+r()*1.8,angle=r()*Math.PI*2,filled=r()<.5;
  const n=label===0?4:3,rad=label===0?size*1.15:size*1.3;
  const vertices=Array.from({length:n},(_,i)=>[cx+rad*Math.cos(angle+i*2*Math.PI/n),cy+rad*Math.sin(angle+i*2*Math.PI/n)]);
  const mode=Math.floor(r()*4);
  for(let y=0;y<10;y++)for(let xx=0;xx<10;xx++){
   if(label===2){const dist=Math.hypot(xx-cx,y-cy);x[y*10+xx]=Number(mode===0?false:mode===1?r()<.27:mode===2?Math.abs(dist-size)<.65:Math.abs(y-(.4*xx+cy-2))<.5);continue;}
   let inside=false,min=Infinity;
   for(let i=0,j=n-1;i<n;j=i++){
    const [ax,ay]=vertices[j],[bx,by]=vertices[i];
    if((ay>y)!==(by>y)&&xx<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
    const t=Math.max(0,Math.min(1,((xx-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2)));
    min=Math.min(min,Math.hypot(xx-ax-t*(bx-ax),y-ay-t*(by-ay)));
   }
   x[y*10+xx]=Number(filled?inside:min<.6);
  }
  return x;
 }
};
