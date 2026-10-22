import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
for(const slug of readdirSync('apps')){
 const folder=`apps/${slug}`;
 let scripts=[];
 let html=readFileSync(`${folder}/index.html`,'utf8')
  .replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,file)=>`<style>${readFileSync(resolve(folder,file),'utf8').replace(/@import\s+url\([^;]+;/g,'')}</style>`)
  .replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,file)=>{scripts.push(readFileSync(resolve(folder,file),'utf8'));return ''})
  .replace('href="../../"','href="https://365aideas.vercel.app/"')
  .replace(/<p class="download-block">.*?<\/p>/gs,'');
 const inline=scripts.map(js=>`<script>${js.replace(/<\/script/gi,'<\\/script')}</script>`).join('');
 html=html.includes('</body>')?html.replace('</body>',()=>inline+'</body>'):html.replace('</html>',()=>inline+'</html>');
 writeFileSync(`${folder}/${slug}.html`,'<!-- 365 AIdeas · Selvstændig HTML med CSS og JavaScript. Åbn i din browser eller redigér i en teksteditor. -->\n'+html);
 console.log(`Download klar: ${slug}.html`);
}
