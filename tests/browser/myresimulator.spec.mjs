import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
test('myrer leverer mad, vægge kan tegnes/fjernes, pause og nulstilling virker',async({page},testInfo)=>{
 await page.route('https://**/*',r=>r.abort());
 await page.goto('/apps/myresimulator/');
 await page.getByRole('button',{name:'Pause',exact:true}).click();
 const frozen=await page.evaluate(()=>JSON.stringify(antLab.world));
 await page.evaluate(()=>antLab.advance(5));
 expect(await page.evaluate(()=>JSON.stringify(antLab.world))).toBe(frozen);
 const canvas=page.locator('canvas');let box=await canvas.boundingBox();
 await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down();
 await page.mouse.move(box.x+box.width*.65,box.y+box.height*.5,{steps:12});await page.mouse.up();
 const painted=Number(await page.locator('#walls').textContent());expect(painted).toBeGreaterThan(20);
 await page.getByRole('button',{name:'Viskelæder',exact:true}).click();
 await canvas.focus();await page.keyboard.press('Space');
 expect(Number(await page.locator('#walls').textContent())).toBeLessThan(painted);
 expect(await page.evaluate(()=>antLab.world.walls[41+20*64])).toBe(0);
 await page.getByRole('button',{name:'Fjern alle vægge'}).click();await expect(page.locator('#walls')).toHaveText('0');
 if(testInfo.project.name==='mobile'){
  await page.getByRole('button',{name:'Tegn væg',exact:true}).click();
  await canvas.scrollIntoViewIfNeeded();box=await canvas.boundingBox();
  await page.touchscreen.tap(box.x+box.width*.4,box.y+box.height*.4);
  expect(await page.evaluate(()=>antLab.world.walls[25+16*64])).toBe(1);
  await page.getByRole('button',{name:'Fjern alle vægge'}).click();
 }

 await page.getByRole('button',{name:'Fortsæt',exact:true}).click();
 await page.evaluate(()=>antLab.advance(120));
 expect(Number(await page.locator('#delivered').textContent())).toBeGreaterThan(45);
 expect(await page.evaluate(()=>antLab.world.cakes)).toBeGreaterThan(1);
 expect(await page.evaluate(()=>{const w=antLab.world;return w.delivered+w.stats().carrying+w.food.left===w.cakes*45;})).toBe(true);
 const before=await page.evaluate(()=>antLab.world.delivered);
 await page.setViewportSize({width:520,height:800});expect(await page.evaluate(()=>antLab.world.delivered)).toBeGreaterThanOrEqual(before);
 await page.getByRole('button',{name:'Start forfra'}).click();await expect(page.locator('#delivered')).toHaveText('0');await expect(page.locator('#left')).toHaveText('45');
});
test('selvstændig HTML leverer mad helt uden netværk',async({page})=>{
 await page.route('**/*',route=>route.request().url().startsWith('file:')?route.continue():route.abort());
 await page.goto('file://'+resolve('apps/myresimulator/myresimulator.html'));
 await page.evaluate(()=>antLab.advance(120));
 expect(Number(await page.locator('#delivered').textContent())).toBeGreaterThan(45);
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('button',{name:'Fortsæt',exact:true})).toBeVisible();
});
