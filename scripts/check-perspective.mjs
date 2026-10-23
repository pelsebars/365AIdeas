import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const P=createRequire(import.meta.url)('../apps/perspektivretter/geometry.js');
const point=(x,y)=>({x,y});
const rect=[[point(0,20),point(0,70)],[point(200,30),point(200,85)],[point(25,0),point(120,0)],[point(50,100),point(175,100)]];
const q=P.quad(rect,200,100),m=P.homography(q);
[point(0,0),point(200,0),point(200,100),point(0,100)].forEach((p,i)=>assert.ok(Math.hypot(p.x-q[i].x,p.y-q[i].y)<1e-10));
assert.equal(P.estimate(q),2);assert.deepEqual(P.dimensions(q,1),{width:200,height:200});assert.deepEqual(P.dimensions(q,4),{width:400,height:100});
// Known projective camera, independent of the implementation under test.
const camera=(u,v)=>point((780*u-100*v+260)/(.12*u-.28*v+1),(110*u+510*v+100)/(.12*u-.28*v+1));
const lines=[[camera(0,.2),camera(0,.7)],[camera(1,.35),camera(1,.9)],[camera(.1,0),camera(.6,0)],[camera(.3,1),camera(.85,1)]];
const h=P.homography(P.quad(lines,1400,1050));
for(let u=0;u<=1;u+=.05)for(let v=0;v<=1;v+=.05){const a=camera(u,v),b=P.map(h,u,v);assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<1e-8);}
// Independently invert the camera to make a perspective raster grid.
function unproject(x,y){const a=780-.12*x,b=-100+.28*x,c=x-260,d=110-.12*y,e=510+.28*y,f=y-100,det=a*e-b*d;return {u:(c*e-b*f)/det,v:(a*f-c*d)/det};}
const src={width:1400,height:1050,data:new Uint8ClampedArray(1400*1050*4)};
for(let y=0;y<src.height;y++)for(let x=0;x<src.width;x++){const {u,v}=unproject(x+.5,y+.5),i=(y*src.width+x)*4;src.data[i]=Math.abs(u*10-Math.round(u*10))<.045?0:255;src.data[i+1]=Math.abs(v*10-Math.round(v*10))<.045?0:255;src.data[i+3]=255;}
const dst={width:400,height:400,data:new Uint8ClampedArray(400*400*4)};P.renderRows(src,dst,h,0,400);
for(const k of [1,3,5,7,9])for(const t of [31,73,137,221,319]){assert.ok(dst.data[(t*400+k*40)*4]<40,'Lodret gitterlinje skal være lodret');assert.ok(dst.data[(k*40*400+t)*4+1]<40,'Vandret gitterlinje skal være vandret');}
// Identity mapping preserves every source pixel, including borders and alpha.
const identity={width:200,height:100,data:new Uint8ClampedArray(200*100*4)};for(let i=0;i<identity.data.length;i++)identity.data[i]=i%4===3?255:i%251;
const copy={width:200,height:100,data:new Uint8ClampedArray(identity.data.length)};P.renderRows(identity,copy,m,0,100);assert.deepEqual(copy.data,identity.data);
const strip={width:200,height:100,data:new Uint8ClampedArray(200*10*4)};P.renderRows(identity,strip,m,20,30,20);assert.deepEqual(strip.data,identity.data.slice(200*20*4,200*30*4));
for(const bad of [ [rect[0],rect[0],rect[2],rect[3]], [rect[0],rect[1],rect[0],rect[3]], [[point(0,0),point(0,0)],...rect.slice(1)], [[point(0,0),point(1,100)],[point(0,1),point(1,101)],rect[2],rect[3]], [rect[1],rect[0],rect[2],rect[3]] ])assert.throws(()=>P.quad(bad,200,100));
const far=structuredClone(rect);far[0]=[point(-1000,0),point(-1000,100)];assert.throws(()=>P.quad(far,200,100));
console.log('OK: homografi, uafhængigt perspektivgitter i begge retninger, identitet, proportioner, rækkeeksport og ugyldige markeringer.');
