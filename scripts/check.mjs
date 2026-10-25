import {parseBacklog} from './backlog.mjs';
import './check-perspective.mjs';
import './check-gps.mjs';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname,resolve,extname} from 'node:path';
import {runInNewContext} from 'node:vm';
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(`${dir}/${e.name}`):[`${dir}/${e.name}`]);}
const appFiles=files('apps');
for(const file of appFiles.filter(f=>extname(f)==='.js'))execFileSync(process.execPath,['--check',file]);
parseBacklog(readFileSync('backlog.md','utf8'));
const ideas=JSON.parse(readFileSync('backlog.json','utf8'));
if(!Array.isArray(ideas)||new Set(ideas.map(x=>x.day)).size!==ideas.length)throw Error('Ugyldig backlog');
for(const item of ideas){if(!Number.isInteger(item.day))throw Error('Ugyldig dag');for(const key of ['title','category','description','prompt'])if(typeof item[key]!=='string'||!item[key].trim())throw Error(`Mangler ${key}`);}
for(const file of ['index.html',...appFiles.filter(f=>extname(f)==='.html')]){
 const html=readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const link=match[1];if(link.startsWith('#')||/^https?:/.test(link))continue;
  const target=link.split(/[?#]/)[0];
  if(!existsSync(target.startsWith('/')?resolve('.',`.${target}`):resolve(dirname(file),target)))throw Error(`Dødt link: ${file}: ${link}`);
 }
}
// Known analytic cycles, plus finite-time Lyapunov evidence for the guided chaotic example.
function orbit(r,x=0.2,n=20000){for(let i=0;i<n;i++)x=r*x*(1-x);return x;}
for(const [r,period] of [[2.8,1],[3.2,2],[3.5,4],[3.83,3]]){
 const x=orbit(r);if(Math.abs(orbit(r,x,period)-x)>1e-10)throw Error(`Forkert periode ved r=${r}`);
 for(let divisor=1;divisor<period;divisor++)if(period%divisor===0 && Math.abs(orbit(r,x,divisor)-x)<1e-6)throw Error('Uventet kortere periode');
 const scope={self:{postMessage(result){scope.result=result;}}};
 runInNewContext(readFileSync('apps/paa-kanten-af-kaos/worker.js','utf8'),scope);
 scope.self.onmessage({data:{view:{r0:r-1e-12,r1:r+1e-12,x0:0,x1:1},width:1,height:10000,burn:20000,keep:120,initial:0.2,samples:1}});
 const rows=Array.from(scope.result.density.entries()).filter(([,n])=>n).map(([i])=>i);
 let v=x;const expected=new Set();for(let n=0;n<period;n++){v=r*v*(1-v);expected.add(Math.min(9999,Math.floor((1-v)*10000)));}
 if(rows.length!==period||rows.some(row=>!expected.has(row))||scope.result.density.reduce((a,b)=>a+b,0)!==120)throw Error(`Worker giver forkerte punkter ved r=${r}`);
}
let x=orbit(3.9),lyapunov=0;for(let i=0;i<10000;i++){lyapunov+=Math.log(Math.abs(3.9*(1-2*x)));x=3.9*x*(1-x);}if(lyapunov/10000<0.4)throw Error('Uventet Lyapunov-eksponent ved r=3.9');
const homepage=readFileSync('index.html','utf8'),appCount=appFiles.filter(f=>f.endsWith('/index.html')).length;
if(Number(homepage.match(/id="count">(\d+)/)?.[1])!==appCount)throw Error('Forkert app-tæller');
if(!homepage.includes(`pixels<span>${String(appCount).padStart(2,'0')}`))throw Error('Forkert oversigtstæller');
const progress=Number(readFileSync('style.css','utf8').match(/width:max\(([\d.]+)%/)?.[1]);
if(Math.abs(progress-appCount/365*100)>0.001)throw Error('Forkert fremdrift');
console.log(`OK: ${appCount} apps, JavaScript-syntaks, ${ideas.length} backlogidéer, lokale links, fremdrift og guidede matematiske eksempler.`);
