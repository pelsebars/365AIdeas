import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const data=runInNewContext(readFileSync('apps/memento-mori/data.js','utf8')+';lifeData');
const expected=(age,sex)=>Math.round(data[sex].remaining[age]*365.2425).toLocaleString('da-DK');
for(const standalone of [false,true]){
 test(`Memento mori: interaktion ${standalone?'i offlinefil':'i app'}`,async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:3000/')?route.continue():route.abort());
  if(standalone){await page.goto('/');await page.setContent(readFileSync('apps/memento-mori/memento-mori.html','utf8'));}else await page.goto('/apps/memento-mori/');
  await expect(page.locator('#days')).toHaveText(expected(40,'M'));
  await page.getByLabel('Din alder i hele år').fill('65');await page.getByLabel('Statistikkens kønskategori').selectOption('K');await page.getByRole('button',{name:'Se dagene'}).click();
  await expect(page.locator('#days')).toHaveText(expected(65,'K'));await expect(page.locator('#expectation')).toContainText('65 år, kvinder');
  const markerPixel=await page.locator('#grid').evaluate(canvas=>{const last=Number(document.getElementById('day').max),cell=canvas.width/40;return Array.from(canvas.getContext('2d').getImageData(Math.floor((last%40)*cell+cell*.15),Math.floor(Math.floor(last/40)*cell+cell*.7),1,1).data);});
  expect(markerPixel).toEqual([178,81,35,255]);
  const initialHeight=await page.locator('#grid').getAttribute('height');
  await page.getByLabel('Firkanter pr. række').selectOption('50');expect(await page.locator('#grid').getAttribute('height')).not.toBe(initialHeight);
  await page.getByRole('button',{name:'Find korset'}).click();await expect(page.locator('#day-info')).toContainText('† Statistisk forventningsdato');
  expect(await page.locator('#tapestry').evaluate(e=>e.scrollTop)).toBeGreaterThan(0);
  const end=await page.locator('#day').getAttribute('max');await page.getByLabel('Vis også dagene').check();expect(Number(await page.locator('#day').getAttribute('max'))).toBeGreaterThan(Number(end));
  await page.locator('#day').focus();await page.keyboard.press('Home');await expect(page.locator('#day-info')).toContainText('0%');await page.keyboard.press('ArrowRight');await expect(page.locator('#day-info')).toContainText('Dag 2 ·');
  await page.locator('#age').fill('91');await page.getByRole('button',{name:'Se dagene'}).click();await expect(page.getByRole('alert')).toContainText('0 til 90');await expect(page.locator('#days')).toHaveText(expected(65,'K'));
  await page.getByRole('button',{name:'Nulstil',exact:true}).click();await expect(page.locator('#age')).toHaveValue('40');await expect(page.locator('#sex')).toHaveValue('M');await expect(page.locator('#columns')).toHaveValue('40');await expect(page.locator('#days')).toHaveText(expected(40,'M'));await expect(page.locator('#beyond')).not.toBeChecked();await expect(page.getByRole('alert')).toBeEmpty();
  for(const age of ['0','90']){await page.locator('#age').fill(age);await page.getByRole('button',{name:'Se dagene'}).click();await expect(page.locator('#days')).toHaveText(expected(Number(age),'M'));}
  expect(errors).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 });
}
