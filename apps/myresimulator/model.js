/* Ren gittermodel. Ingen søgende myre får adgang til en fjern fødeposition. */
class AntWorld {
 constructor(seed=43,count=220){this.seed=seed>>>0;this.w=64;this.h=40;this.n=this.w*this.h;this.home=3+3*this.w;this.walls=new Uint8Array(this.n);this.scent=new Float64Array(this.n);this.vx=new Float64Array(this.n);this.vy=new Float64Array(this.n);this.food={cell:59+35*this.w,left:45};this.delivered=0;this.cakes=1;this.time=0;this.paused=false;this.acc=0;this.ants=Array.from({length:count},()=>({cell:this.home,dir:Math.floor(this.random()*4),carrying:false}));this.map();}
 random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
 neighbors(c){const x=c%this.w,y=Math.floor(c/this.w);return [x<this.w-1?c+1:-1,y<this.h-1?c+this.w:-1,x>0?c-1:-1,y>0?c-this.w:-1];}
 map(){this.dist=new Int32Array(this.n).fill(-1);this.dist[this.home]=0;const queue=[this.home];for(let k=0;k<queue.length;k++)for(const c of this.neighbors(queue[k]))if(c>=0&&!this.walls[c]&&this.dist[c]<0){this.dist[c]=this.dist[queue[k]]+1;queue.push(c);}}
 paint(c,r,erase=false){const cx=c%this.w,cy=Math.floor(c/this.w);for(let y=Math.max(0,cy-r);y<=Math.min(this.h-1,cy+r);y++)for(let x=Math.max(0,cx-r);x<=Math.min(this.w-1,cx+r);x++){const i=x+y*this.w;if(Math.hypot(x-cx,y-cy)>r||Math.hypot(x-this.home%this.w,y-Math.floor(this.home/this.w))<3||Math.hypot(x-this.food.cell%this.w,y-Math.floor(this.food.cell/this.w))<3)continue;this.walls[i]=erase?0:1;if(!erase)this.scent[i]=this.vx[i]=this.vy[i]=0;}
 // Relocate covered ants using a bounded breadth-first search, including blocked cells.
 for(const a of this.ants)if(this.walls[a.cell]){const seen=new Set([a.cell]),q=[a.cell];for(let k=0;k<q.length;k++){if(!this.walls[q[k]]){a.cell=q[k];break;}for(const j of this.neighbors(q[k]))if(j>=0&&!seen.has(j)){seen.add(j);q.push(j);}}}this.map();}
 clear(){this.walls.fill(0);this.map();}
 newFood(){const valid=[];for(let c=0;c<this.n;c++)if(this.dist[c]>18&&!this.walls[c])valid.push(c);if(!valid.length)return false;this.food={cell:valid[Math.floor(this.random()*valid.length)],left:45};this.cakes++;return true;}
 step(dt){if(this.paused)return;dt=Math.max(0,Math.min(dt,.25));this.time+=dt;const decay=Math.exp(-dt/16);for(let i=0;i<this.n;i++){this.scent[i]*=decay;this.vx[i]*=decay;this.vy[i]*=decay;}this.acc+=dt;while(this.acc>=.075){this.acc-=.075;this.tick();}}
 tick(){for(const a of this.ants){if(!a.carrying&&a.cell===this.food.cell&&this.food.left>0){a.carrying=true;this.food.left--;}
 if(a.carrying&&a.cell===this.home){a.carrying=false;this.delivered++;}
 const ns=this.neighbors(a.cell);let dir=-1;
 if(a.carrying&&this.dist[a.cell]>0){dir=ns.findIndex(c=>c>=0&&!this.walls[c]&&this.dist[c]===this.dist[a.cell]-1);}
 if(dir<0){const weights=ns.map((c,d)=>{if(c<0||this.walls[c])return 0;const dx=[1,0,-1,0][d],dy=[0,1,0,-1][d];const forward=Math.max(0,this.vx[a.cell]*dx+this.vy[a.cell]*dy);return 1+(d===a.dir?5:0)+Math.min(35,forward*4);});let pick=this.random()*weights.reduce((s,v)=>s+v,0);dir=weights.findIndex(v=>(pick-=v)<0);}
 if(dir<0)continue;const next=ns[dir];if(a.carrying){const c=a.cell,dx=-[1,0,-1,0][dir],dy=-[0,1,0,-1][dir];const room=Math.min(.65,30-this.scent[c]);this.scent[c]+=room;this.vx[c]+=dx*room;this.vy[c]+=dy*room;}
 a.cell=next;a.dir=dir;
 }if(this.food.left===0)this.newFood();}
 stats(){return {delivered:this.delivered,carrying:this.ants.filter(a=>a.carrying).length,left:this.food.left,walls:this.walls.reduce((a,b)=>a+b,0),cakes:this.cakes,time:this.time};}
}
globalThis.AntWorld=AntWorld;
