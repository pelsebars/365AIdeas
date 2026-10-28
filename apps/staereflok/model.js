/* Pure, seeded 3D model. No rendering or wall-clock dependency. */
(function(root){
const add=(a,b)=>a.map((x,i)=>x+b[i]), mul=(a,s)=>a.map(x=>x*s), sub=(a,b)=>add(a,mul(b,-1));
const length=a=>Math.hypot(...a), unit=a=>mul(a,1/(length(a)||1));
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const limit=(a,max)=>length(a)>max?mul(unit(a),max):a;
function nearest(birds,i,k=7){return birds.map((b,j)=>({j,d:length(sub(b.p,birds[i].p))})).filter(b=>b.j!==i).sort((a,b)=>a.d-b.d||a.j-b.j).slice(0,k).map(b=>b.j);}
function project(p,w,h){const scale=Math.min(w/360,h/210);const depth=Math.max(110,370+p[2]);return {x:w/2+p[0]*scale*370/depth,y:h/2+p[1]*scale*370/depth,r:Math.max(.8,2.1*370/depth)};}
class World{
 constructor(count=240,seed=45){this.time=0;this.ticks=0;this.paused=false;this.follow=3;this.inertia=1;this.event=null;this.nextTurn=14;this.graph=[];let s=seed;this.random=()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296;};this.birds=Array.from({length:count},()=>({p:[(this.random()-.5)*100,(this.random()-.5)*58,(this.random()-.5)*70],v:mul(unit([1,(this.random()-.5)*.3,(this.random()-.5)*.3]),15),omega:[0,0,0]}));this.refresh();}
 refresh(){this.graph=this.birds.map((_,i)=>nearest(this.birds,i));}
 turn(index=0){if(this.paused)return false;this.event={index,start:this.time,baseline:this.birds.map(b=>unit(b.v)),direct:[index]};return true;}
 reactions(){if(!this.event)return [];return this.birds.map((b,i)=>length(sub(unit(b.v),this.event.baseline[i])));}
 step(dt=1/60){if(this.paused)return;if(this.ticks++%4===0)this.refresh();if(this.time>=this.nextTurn){this.turn(Math.floor(this.random()*this.birds.length));this.nextTurn=this.time+18;}
 const next=this.birds.map((b,i)=>{const neighbors=this.graph[i];let mean=[0,0,0],center=[0,0,0],spin=[0,0,0],repel=[0,0,0];for(const j of neighbors){const n=this.birds[j];mean=add(mean,unit(n.v));center=add(center,n.p);spin=add(spin,n.omega);}
 // Separation uses physical distance, independent of topological alignment.
 for(let j=0;j<this.birds.length;j++){if(j===i)continue;const d=sub(b.p,this.birds[j].p),r=length(d);if(r<7)repel=add(repel,mul(unit(d),Math.min(2,(7-r)/3)));}
 const k=neighbors.length||1;let target=add(mul(unit(mean),this.follow),add(mul(sub(mul(center,1/k),b.p),.018),mul(repel,.8)));
 const boundary=b.p.map((x,axis)=>-Math.sign(x)*Math.pow(Math.max(0,(Math.abs(x)-(axis===0?105:65))/30),2)*2);target=add(target,boundary);
 let torque=add(mul(cross(unit(b.v),target),2),mul(sub(mul(spin,1/k),b.omega),1.8));
 if(this.event&&this.time-this.event.start<.7&&i===this.event.index)torque=add(torque,[0,.8,3.6]);
 const angularAcceleration=limit(mul(sub(torque,mul(b.omega,2.5)),1/this.inertia),3);
 const omega=limit(add(b.omega,mul(angularAcceleration,dt)),1.1);
 const v=mul(unit(add(b.v,mul(cross(omega,b.v),dt))),15);
 return {p:add(b.p,mul(v,dt)),v,omega};});this.birds=next;this.time+=dt;}
}
root.Starling={World,nearest,project,length,sub};
})(globalThis);
