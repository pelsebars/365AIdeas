import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
for(const file of ['index.html','se-netvaerket-taenke.html'])test(`netværk: tegning, inferens og forbindelser (${file})`,async({page})=>{
 await page.route('https://**/*',r=>r.abort());
 if(file==='index.html')await page.goto(`/apps/se-netvaerket-taenke/${file}`);else{await page.route('**/*',r=>r.abort());await page.setContent(readFileSync(`apps/se-netvaerket-taenke/${file}`,'utf8'));}
 const pixels=page.locator('#pixels button');await expect(pixels).toHaveCount(100);
 await page.locator('#example').selectOption('1');await expect(page.locator('#result')).toHaveText('Trekant');
 await page.locator('#example').selectOption('0');await expect(page.locator('#result')).toHaveText('Firkant');await expect(page.locator('#pixels .on')).not.toHaveCount(0);
 const expected=await page.evaluate(()=>{const x=[...document.querySelectorAll('#pixels button')].map(b=>Number(b.classList.contains('on'))),p=ShapeNet.forward(x,SHAPE_MODEL).p;return {name:SHAPE_MODEL.meta.classes[p.indexOf(Math.max(...p))],scores:p.map(v=>(v*100).toFixed(1)+'%')};});
 await expect(page.locator('#result')).toHaveText(expected.name);
 for(const score of expected.scores)await expect(page.locator('#scores')).toContainText(score);
 await page.locator('#neuron').selectOption('8');await expect(page.locator('#connections tr')).toHaveCount(8);await expect(page.locator('#calculation')).toContainText('softmax');
 await page.getByText('Alle indgående forbindelser · vælg en række',{exact:true}).click();await page.locator('#connections button').first().click();await expect(page.locator('#connection')).toContainText('w·a =');
 await page.locator('#neuron').selectOption('0');await expect(page.locator('#connections tr')).toHaveCount(100);
 await page.locator('#mode').selectOption('weight');expect(await page.locator('#network line').count()).toBeGreaterThan(0);
 await page.locator('#clear').click();await expect(page.locator('#pixels .on')).toHaveCount(0);
 await pixels.nth(22).scrollIntoViewIfNeeded();const box=await pixels.nth(22).boundingBox();
 if(test.info().project.name==='mobile')await page.touchscreen.tap(box.x+box.width/2,box.y+box.height/2);else{await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width*3.5,box.y+box.height/2,{steps:5});await page.mouse.up();}
 await expect(pixels.nth(22)).toHaveAttribute('aria-pressed','true');
 await page.locator('#eraser').click();await pixels.nth(22).click();await expect(pixels.nth(22)).toHaveAttribute('aria-pressed','false');
 await pixels.nth(99).focus();await page.keyboard.press('Space');await expect(pixels.nth(99)).toHaveAttribute('aria-pressed','true');
 await page.locator('#clear').click();await expect(page.locator('#pixels .on')).toHaveCount(0);await expect(page.locator('#result')).toHaveText('Ved ikke');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});
