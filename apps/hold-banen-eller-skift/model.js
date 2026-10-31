/* Paired extension of the local IDE-046 engine; no rendering dependencies. */
(function(root){
const {Simulation,DT}=root.Traffic;
const defaults={seed:47,lane:1,load:112,share:0,threshold:.1};
class Pair{
 constructor(params={},policies=['hold','switch']){
 this.p={...defaults,...params};this.p.share=Math.max(0,Math.min(100,Number(this.p.share)||0));this.time=0;this.samples=[];this.done=false;
 this.worlds=policies.map(policy=>{
 const sim=new Simulation({seed:this.p.seed,initial:this.p.load,inflow:this.p.load===64?1800:this.p.load===112?3600:5400,share:this.p.share,threshold:this.p.threshold,reaction:.3,brake:7,speed:90,variation:25,headway:1.6});
 sim.advance(30);
 const candidates=sim.cars.filter(c=>c.lane===this.p.lane&&!c.shift);
 const car=candidates.sort((a,b)=>Math.abs(a.x-200)-Math.abs(b.x-200))[0];
 if(!car)throw Error('Ingen forsøgsbil i startbanen');
 car.policy=policy;car.desired=110/3.6;car.cool=0;car.switches=0;
 return {sim,car,start:car.x,goal:car.x+2000,arrival:null,hard:0,wasHard:false,trafficDistance:0,trafficSeconds:0,trafficChanges:0,invalid:sim.stopped};
 });this.sample();
 }
 sample(){this.samples.push({t:this.time,d:this.worlds.map(w=>Math.min(2000,w.car.x-w.start))});}
 tick(){if(this.done)return;for(const w of this.worlds){if(w.arrival!==null||w.invalid)continue;const before=w.car.x;const traffic=w.sim.cars.filter(c=>c!==w.car).map(c=>({car:c,x:c.x,switches:c.switches||0}));w.sim.tick();if(w.sim.stopped){w.invalid=true;continue;}for(const {car,x,switches} of traffic){w.trafficDistance+=car.x-x;w.trafficSeconds+=DT;w.trafficChanges+=(car.switches||0)-switches;}if(w.car.a < -3&&!w.wasHard)w.hard++;w.wasHard=w.car.a < -3;
 if(w.car.x>=w.goal)w.arrival=this.time+DT*(w.goal-before)/(w.car.x-before);
 }this.time=+(this.time+DT).toFixed(8);if(Math.round(this.time/DT)%20===0)this.sample();this.done=this.time>=300||this.worlds.every(w=>w.arrival!==null||w.invalid);if(this.done)this.sample();}
 advance(seconds){for(let n=0;n<Math.round(seconds/DT)&&!this.done;n++)this.tick();}
 result(){const valid=this.done&&this.worlds.every(w=>w.arrival!==null&&!w.invalid);return {switches:this.worlds.map(w=>w.car.switches),share:this.p.share,trafficSpeed:this.worlds.map(w=>w.trafficSeconds?w.trafficDistance/w.trafficSeconds*3.6:null),seed:this.p.seed,lane:this.p.lane,valid,delta:valid?this.worlds[0].arrival-this.worlds[1].arrival:null,times:this.worlds.map(w=>w.arrival)};}
}
function summarize(rows){const values=rows.filter(r=>r.valid).map(r=>r.delta).sort((a,b)=>a-b),n=values.length;return n?{n,mean:values.reduce((a,b)=>a+b,0)/n,median:(values[Math.floor((n-1)/2)]+values[Math.floor(n/2)])/2,min:values[0],max:values[n-1]}:{n:0};}
root.LaneExperiment={Pair,defaults,summarize};
})(globalThis);
