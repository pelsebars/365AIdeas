/* Geometry is independent of the UI; coordinates always refer to the original image. */
const Perspective = (() => {
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 function intersection(a,b,c,d){
  const ux=b.x-a.x,uy=b.y-a.y,vx=d.x-c.x,vy=d.y-c.y,det=ux*vy-uy*vx;
  if(distance(a,b)<2||distance(c,d)<2||Math.abs(det)<1e-5*Math.hypot(ux,uy)*Math.hypot(vx,vy))throw Error('To linjer er sammenfaldende eller næsten parallelle på tværs af retningerne. Flyt punkterne.');
  const t=((c.x-a.x)*vy-(c.y-a.y)*vx)/det;return {x:a.x+t*ux,y:a.y+t*uy};
 }
 function quad(lines,w,h){
  const cross=(i,j)=>intersection(...lines[i],...lines[j]);
  const q=[cross(0,2),cross(1,2),cross(1,3),cross(0,3)];
  if(q.some(p=>!Number.isFinite(p.x+p.y)||p.x < -2*w||p.x>3*w||p.y< -2*h||p.y>3*h))throw Error('Skæringspunkterne ligger for langt uden for billedet. Flyt linjerne tættere på fladen.');
  let sign=0,area=0;
  for(let i=0;i<4;i++){
   const a=q[i],b=q[(i+1)%4],c=q[(i+2)%4],z=(b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x);
   if(distance(a,b)<4||Math.abs(z)<w*h*1e-5||(sign&&Math.sign(z)!==sign))throw Error('Linjerne danner en kollapset eller krydset firkant. Hold venstre/højre og top/bund i rækkefølge.');
   sign=Math.sign(z);area+=a.x*b.y-a.y*b.x;
  }
  if(sign<0||Math.abs(area)<w*h*.0002)throw Error('Fladen er for lille eller vendt på hovedet. Kontrollér linjernes rækkefølge.');
  return q;
 }
 // Unit rectangle -> arbitrary quadrilateral, avoiding a poorly scaled 8x8 solve.
 function homography(q){
  const [a,b,c,d]=q,dx1=b.x-c.x,dx2=d.x-c.x,dx3=a.x-b.x+c.x-d.x,dy1=b.y-c.y,dy2=d.y-c.y,dy3=a.y-b.y+c.y-d.y;
  const det=dx1*dy2-dx2*dy1;
  if(Math.abs(det)<1e-10)throw Error('Fladen er numerisk ustabil.');
  const g=(dx3*dy2-dx2*dy3)/det,h=(dx1*dy3-dx3*dy1)/det;
  if(Math.min(1,1+g,1+h,1+g+h)<1e-5)throw Error('Perspektivet er for ekstremt. Vælg en mere stabil flade.');
  return [b.x-a.x+g*b.x,d.x-a.x+h*d.x,a.x,b.y-a.y+g*b.y,d.y-a.y+h*d.y,a.y,g,h];
 }
 function map(m,u,v){const z=m[6]*u+m[7]*v+1;return {x:(m[0]*u+m[1]*v+m[2])/z,y:(m[3]*u+m[4]*v+m[5])/z};}
 function dimensions(q,ratio){const w=Math.max(distance(q[0],q[1]),distance(q[3],q[2])),h=Math.max(distance(q[0],q[3]),distance(q[1],q[2]));return {width:Math.ceil(Math.max(w,h*ratio)),height:Math.ceil(Math.max(h,w/ratio))};}
 function estimate(q){return (distance(q[0],q[1])+distance(q[3],q[2]))/(distance(q[0],q[3])+distance(q[1],q[2]));}
 // Bounds in rectified reference coordinates. Reject a projective horizon crossing
 // the source: no finite canvas can contain that transformed image.
 function imageBounds(m,w,h){
  const [a,b,c,d,e,f,g,k]=m;
  const inverse=[e-f*k,c*k-b,b*f-c*e,f*g-d,a-c*g,c*d-a*f,d*k-e*g,b*g-a*k,a*e-b*d];
  const corners=[[0,0],[w,0],[w,h],[0,h]],den=corners.map(([x,y])=>inverse[6]*x+inverse[7]*y+inverse[8]);
  const largest=Math.max(...den.map(Math.abs));
  if(!largest||den.some(z=>!Number.isFinite(z)||Math.sign(z)!==Math.sign(den[0])||Math.abs(z)<largest*1e-5))throw Error('Hele billedet kan ikke rettes op til et endeligt, stabilt udsnit med disse linjer. Vælg “Mellem linjerne”, eller flyt referencelinjerne.');
  const points=corners.map(([x,y],i)=>({x:(inverse[0]*x+inverse[1]*y+inverse[2])/den[i],y:(inverse[3]*x+inverse[4]*y+inverse[5])/den[i]}));
  const x0=Math.min(...points.map(p=>p.x)),y0=Math.min(...points.map(p=>p.y)),x1=Math.max(...points.map(p=>p.x)),y1=Math.max(...points.map(p=>p.y));
  if(!Number.isFinite(x0+y0+x1+y1)||x1<=x0||y1<=y0)throw Error('Billedets oprettede udstrækning er ustabil. Flyt referencelinjerne.');
  return {x0,y0,x1,y1};
 }
 function renderRows(src,dst,m,start,end,offsetY=0,bounds={x0:0,y0:0,x1:1,y1:1}){
  const sw=src.width,sh=src.height,s=src.data,o=dst.data;
  for(let y=start;y<end;y++)for(let x=0;x<dst.width;x++){
   const p=map(m,bounds.x0+(x+.5)/dst.width*(bounds.x1-bounds.x0),bounds.y0+(y+.5)/dst.height*(bounds.y1-bounds.y0)),px=p.x-.5,py=p.y-.5,i=((y-offsetY)*dst.width+x)*4;
   if(!Number.isFinite(px+py)||px<-.5||py<-.5||px>sw-.5||py>sh-.5)continue;
   const cx=Math.max(0,Math.min(sw-1,px)),cy=Math.max(0,Math.min(sh-1,py)),ix=Math.floor(cx),iy=Math.floor(cy),fx=cx-ix,fy=cy-iy;
   const ids=[(iy*sw+ix)*4,(iy*sw+Math.min(ix+1,sw-1))*4,(Math.min(iy+1,sh-1)*sw+ix)*4,(Math.min(iy+1,sh-1)*sw+Math.min(ix+1,sw-1))*4],weights=[(1-fx)*(1-fy),fx*(1-fy),(1-fx)*fy,fx*fy];
   let alpha=0;for(let k=0;k<4;k++)alpha+=s[ids[k]+3]*weights[k];o[i+3]=alpha;
   if(alpha)for(let ch=0;ch<3;ch++){let value=0;for(let k=0;k<4;k++)value+=s[ids[k]+ch]*s[ids[k]+3]*weights[k];o[i+ch]=value/alpha;}
  }
 }
 return {quad,homography,map,dimensions,estimate,imageBounds,renderRows};
})();
if(typeof module!=='undefined')module.exports=Perspective;
