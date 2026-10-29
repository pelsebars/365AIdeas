import {test,expect} from '@playwright/test';
import {resolve} from 'node:path';
async function slider(page,id,value){await page.locator('#'+id).evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},value);}
test('trafikforsøg: reaktion, bremsning, målt flow, graf og nulstilling',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());await page.goto('/apps/motorvejslaboratoriet/');
 await page.getByRole('button',{name:'Pause',exact:true}).click();
 const frozen=await page.locator('#clock').textContent();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));await expect(page.locator('#clock')).toHaveText(frozen);
 await slider(page,'reaction',1);await expect(page.locator('#out-reaction')).toHaveText('1,0 s');await expect(page.locator('#distances')).toContainText('30,6 m');
 await slider(page,'brake',5);await expect(page.locator('#distances')).toContainText('93,4 m');
 await page.getByRole('button',{name:'Kort opbremsning'}).click();await expect(page.locator('#status')).toContainText('Opbremsninger: 1');
 await slider(page,'reaction',.6);await slider(page,'inflow',10000);await expect(page.locator('#clock')).toHaveText('0,0 s');
 await page.getByRole('button',{name:'Beregn 90 sekunder'}).click();await expect(page.getByRole('button',{name:'Gem målepunkt'})).toBeEnabled();
 await expect(page.locator('#clock')).toHaveText('90,0 s');await expect(page.locator('#metrics')).toContainText('60,0 s');
 const queue=await page.locator('dt').filter({hasText:'Ventende før indkørsel'}).locator('+ dd').textContent();expect(Number(queue)).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Gem målepunkt'}).click();await expect(page.locator('#records tr')).toHaveCount(1);
 const cells=await page.locator('#records td').allTextContents();expect(Number(cells[2].replaceAll('.',''))).toBeGreaterThan(0);expect(cells[0]).toContain('10000/t');
 await slider(page,'inflow',0);await slider(page,'initial',0);await page.getByRole('button',{name:'Beregn 90 sekunder'}).click();await page.getByRole('button',{name:'Gem målepunkt'}).click();await expect(page.locator('#records tr')).toHaveCount(2);await expect(page.locator('#records tr').nth(1).locator('td').nth(2)).toHaveText('0');
 await page.getByRole('button',{name:'Nulstil',exact:true}).click();await expect(page.locator('#clock')).toHaveText('0,0 s');await expect(page.getByRole('button',{name:'Gem målepunkt'})).toBeDisabled();await expect(page.locator('#records tr')).toHaveCount(2);
 await page.getByRole('button',{name:'Fortsæt',exact:true}).click();await expect.poll(()=>page.locator('#clock').textContent()).not.toBe('0,0 s');await page.getByRole('button',{name:'Pause',exact:true}).click();
 await page.getByRole('button',{name:'Ryd graf'}).click();await expect(page.locator('#records tr')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);expect(errors).toEqual([]);
});
test('selvstændig fil beregner målte resultater helt offline',async({page,context})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await context.setOffline(true);await page.goto('file://'+resolve('apps/motorvejslaboratoriet/motorvejslaboratoriet.html'));
 await page.getByRole('button',{name:'Beregn 90 sekunder'}).click();await expect(page.getByRole('button',{name:'Gem målepunkt'})).toBeEnabled();await page.getByRole('button',{name:'Gem målepunkt'}).click();await expect(page.locator('#records tr')).toHaveCount(1);expect(errors).toEqual([]);
});
