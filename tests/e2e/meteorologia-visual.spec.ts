import {test,expect} from '@playwright/test';
import {cenariosAtmosfericos} from '../../src/environment/meteorologia/cenarios';
test('treze cenários atmosféricos renderizam sem erros em desktop e celular',async({page},testInfo)=>{
 test.setTimeout(120000);const erros:string[]=[];
 page.on('pageerror',e=>erros.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/THREE|WebGL|shader/i.test(m.text()))erros.push(m.text());});
 await page.clock.setFixedTime(new Date('2026-10-08T15:00:00Z'));
 await page.goto('http://127.0.0.1:5174/tests/fixtures/atmosfera.html');
 await page.waitForFunction(()=>typeof Reflect.get(window,'mostrarCenario')==='function');
 let geometrias:string|null=null;
 for(const largura of [1440,375]){
  await page.setViewportSize({width:largura,height:812});
  for(const nome of cenariosAtmosfericos){
   await page.clock.setFixedTime(new Date(nome.startsWith('noite')?'2026-10-08T03:00:00Z':'2026-10-08T15:00:00Z'));
   const estado=await page.evaluate(nome=>Reflect.get(window,'mostrarCenario')(nome),nome);
   await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
   await expect(page.locator('#world')).toHaveAttribute('data-massas','42');
   const atual=await page.locator('#world').getAttribute('data-geometries');geometrias??=atual;expect(atual).toBe(geometrias);
   expect(estado.massas).toBe(42);
   if(nome==='chuva-fraca')expect(estado.chuva).toBeLessThan(.1);
   if(nome==='chuva-forte')expect(estado.chuva).toBeGreaterThan(.8);
   if(nome==='pos-chuva')expect(estado.solo).toBeGreaterThan(.5);
   if(nome==='neblina')expect(estado.neblina).toBeGreaterThan(.008);
   await testInfo.attach(nome+'-'+largura+'.png',{body:await page.screenshot(),contentType:'image/png'});
  }
 }
 expect(erros).toEqual([]);
});
