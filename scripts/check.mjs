import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname,resolve} from 'node:path';
for(const file of ['apps/space-invaders/game.js'])execFileSync(process.execPath,['--check',file]);
const ideas=JSON.parse(readFileSync('backlog.json','utf8'));
if(ideas.length!==36||new Set(ideas.map(x=>x.day)).size!==ideas.length)throw Error('Ugyldig backlog');
for(const item of ideas)for(const key of ['title','category','description','prompt'])if(!item[key])throw Error(`Mangler ${key}`);
for(const file of ['index.html','apps/space-invaders/index.html']){
 const html=readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const link=match[1];if(link.startsWith('#')||link.startsWith('/')||/^https?:/.test(link))continue;
  if(!existsSync(resolve(dirname(file),link)))throw Error(`Dødt link: ${file}: ${link}`);
 }
}
console.log('OK: JavaScript-syntaks, 36 backlogidéer og lokale links.');
