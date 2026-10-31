/* Local educational IDM extension. Units: metres, seconds. */
(function(root){
const DT=.05,LENGTH=3000,defaults={initial:40,inflow:4200,tendency:50,reaction:.6,brake:7,speed:110,variation:15,headway:1.6};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function distances(speed,reaction,brake){const v=speed/3.6;return {reaction:v*reaction,braking:v*v/(2*brake)};}
function acceleration(o,p,desired){const v=o.v,s=2+Math.max(0,v*p.headway+v*(v-o.leadV)/(2*Math.sqrt(1.2*2)));return clamp(1.2*(1-(v/desired)**4-(s/Math.max(.1,o.gap))**2),-p.brake,1.2);}
class Simulation{
 constructor(params={}){this.reset(params);}
 reset(params={}){this.p={...defaults,...params};this.seed=this.p.seed||47;this.time=0;this.cars=[];this.entered=0;this.exited=0;this.waiting=0;this.arrivals=0;this.nextID=0;this.passages=[];this.changes=[];this.samples=[];this.collisions=0;this.stopped=false;this.pulses=0;this.accumulator=0;this.queue=[];this.plan=[];for(let i=0;i<this.p.initial;i++)this.cars.push(this.car(i%4,15+Math.floor(i/4)*70));this.initial=this.cars.length;}
 driverRandom(id,salt=0){let n=((this.p.seed||47)^salt^Math.imul(id+1,2654435761))>>>0;n=Math.imul(n^(n>>>16),2246822507)>>>0;return n/4294967296;}
 random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
 car(lane,x){const desired=this.p.speed/3.6*(1+(this.driverRandom(this.nextID)-.5)*2*this.p.variation/100);const policy=this.p.share===undefined?undefined:(this.driverRandom(this.nextID,0x51ed270b)<this.p.share/100?'switch':'hold');return {policy,id:this.nextID++,lane,from:lane,x,v:Math.min(desired,20),desired,a:0,history:[],shift:0,cool:0,pulse:0};}
 occupies(c,lane){return c.lane===lane||(c.shift>0&&c.from===lane);}
 leader(c,lane){let best;for(const o of this.cars)if(o!==c&&this.occupies(o,lane)&&o.x>=c.x&&(!best||o.x<best.x))best=o;return best;}
 observe(c,lane=c.lane){const lead=this.leader(c,lane);return {v:c.v,gap:lead?lead.x-c.x-5:1e6,leadV:lead?lead.v:c.v,leader:lead?.id??null};}
 canChange(c,lane){if(lane<0||lane>3||c.shift>0)return false;const front=this.leader(c,lane),back=this.cars.filter(o=>o!==c&&this.occupies(o,lane)&&o.x<c.x).sort((a,b)=>b.x-a.x)[0];if(front&&front.x-c.x-5<Math.max(8,c.v*(this.p.reaction+.5)))return false;if(back&&(c.x-back.x-5<Math.max(8,back.v*(this.p.reaction+.5))||acceleration({v:back.v,gap:c.x-back.x-5,leadV:c.v},this.p,back.desired)<-2))return false;return acceleration(this.observe(c,lane),this.p,c.desired)>-2;}
 change(c,lane){if(!this.canChange(c,lane))return false;c.from=c.lane;c.lane=lane;c.shift=2;c.cool=6;c.switches=(c.switches||0)+1;this.changes.push(this.time);return true;}
 brakePulse(){const c=[...this.cars].sort((a,b)=>Math.abs(a.x-300)-Math.abs(b.x-300))[0];if(!c)return false;c.pulse=2;this.pulses++;return true;}
 tick(){if(this.stopped)return;const p=this.p;
 // Sequential decisions reserve source and destination lanes during the full manoeuvre.
 for(const c of this.cars){c.cool=Math.max(0,c.cool-DT);if(c.shift>0){c.shift=Math.max(0,c.shift-DT);if(!c.shift)c.from=c.lane;}if(c.cool||c.policy==='hold'||(!c.policy&&!p.tendency))continue;const base=acceleration(this.observe(c),p,c.desired);let best=null,gain=0;for(const lane of [c.lane+1,c.lane-1]){if(!this.canChange(c,lane))continue;const g=acceleration(this.observe(c,lane),p,c.desired)-base+(c.policy?0:(lane>c.lane?.15:0));if(g>gain){gain=g;best=lane;}}if(best!==null&&gain>(c.policy?p.threshold:1.6*(1-p.tendency/100)+.08))this.change(c,best);}
 for(const c of this.cars){c.history.push({t:this.time,...this.observe(c)});const target=this.time-p.reaction;while(c.history.length>1&&c.history[1].t<=target+1e-8)c.history.shift();const o=c.history[0];c.a=acceleration(o,p,c.desired);if(c.pulse>0){c.a=-Math.min(p.brake,3);c.pulse-=DT;}}
 for(const c of this.cars){const duration=c.a<0?Math.min(DT,c.v/-c.a):DT;c.x+=c.v*duration+.5*c.a*duration*duration;c.v=Math.max(0,c.v+c.a*DT);}
 this.time=+(this.time+DT).toFixed(8);
 for(let lane=0;lane<4;lane++){const list=this.cars.filter(c=>this.occupies(c,lane)).sort((a,b)=>a.x-b.x);if(list.some((c,i)=>i&&c.x-list[i-1].x<5)){this.collisions++;this.stopped=true;break;}}
 const exited=this.cars.filter(c=>c.x>=LENGTH);this.exited+=exited.length;for(const c of exited)this.passages.push(this.time);this.cars=this.cars.filter(c=>c.x<LENGTH);
 this.arrivals+=p.inflow/3600*DT;const arriving=Math.floor(this.arrivals+1e-9);this.arrivals-=arriving;for(let i=0;i<arriving;i++){const car=this.car(this.plan.length%4,0);this.queue.push(car);this.plan.push({id:car.id,lane:car.lane,desired:car.desired,t:this.time});}
 while(this.queue.length){const c=this.queue[0],first=this.cars.filter(o=>this.occupies(o,c.lane)).sort((a,b)=>a.x-b.x)[0];if(first&&first.x-5<Math.max(10,c.v*(p.headway+p.reaction)))break;if(first)c.v=Math.min(c.v,first.v);this.cars.push(c);this.queue.shift();this.entered++;}this.waiting=this.queue.length;

 this.samples.push({t:this.time,n:this.cars.length});this.samples=this.samples.filter(s=>s.t>=this.time-60);this.passages=this.passages.filter(t=>t>=this.time-60);this.changes=this.changes.filter(t=>t>=this.time-60);
 }
 advance(seconds){this.accumulator+=seconds;while(this.accumulator>=DT-1e-9&&!this.stopped){this.tick();this.accumulator-=DT;}if(this.stopped)this.accumulator=0;}
 metrics(){const start=Math.max(30,this.time-60),window=Math.max(0,this.time-start),passes=this.passages.filter(t=>t>start).length;const samples=this.samples.filter(s=>s.t>start),density=(samples.length?samples.reduce((a,s)=>a+s.n,0)/samples.length:this.cars.length)/2;return {window,flow:window?passes*3600/window:0,density,speed:this.cars.length?this.cars.reduce((a,c)=>a+c.v,0)/this.cars.length*3.6:0,slow:this.cars.filter(c=>c.v<5).length,changes:this.changes.length*60/Math.max(DT,Math.min(60,this.time))};}
 result(){if(this.time<90||this.stopped)return null;const m=this.metrics(),bins=Array.from({length:6},(_,i)=>this.passages.filter(t=>t>this.time-60+i*10&&t<=this.time-50+i*10).length*360);return {...m,min:Math.min(...bins),max:Math.max(...bins),p:{...this.p}};}
}
root.Traffic={Simulation,defaults,distances,acceleration,DT,LENGTH};
})(globalThis);
