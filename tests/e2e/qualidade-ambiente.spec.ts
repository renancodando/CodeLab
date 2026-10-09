import {test,expect} from '@playwright/test';

test('hardware limitado mantém chuva e nuvens com canvas dentro do orçamento',async({page})=>{
 const erros:string[]=[];page.on('pageerror',erro=>erros.push(erro.message));
 page.on('console',mensagem=>{if(mensagem.type()==='error'&&/THREE|WebGL|shader/i.test(mensagem.text()))erros.push(mensagem.text());});
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>2});
  Object.defineProperty(navigator,'deviceMemory',{get:()=>2});
 });
 await page.setViewportSize({width:375,height:812});
 await page.goto('http://127.0.0.1:5174/tests/fixtures/atmosfera.html');
 await page.waitForFunction(()=>typeof Reflect.get(window,'mostrarCenario')==='function');
 const estado=await page.evaluate(()=>Reflect.get(window,'mostrarCenario')('chuva-forte'));
 expect(estado.chuva).toBeGreaterThan(.8);expect(estado.massas).toBe(42);
 await expect(page.locator('#world')).toHaveAttribute('data-quality','low');
 await expect(page.locator('#world')).toHaveAttribute('data-massas','42');
 await expect.poll(async()=>Number(await page.locator('#world').getAttribute('data-chuva'))).toBeGreaterThan(.8);
 for(const largura of [375,4000]){
  await page.setViewportSize({width:largura,height:812});
  await expect.poll(()=>page.locator('#world canvas').evaluate(elemento=>Math.round(elemento.getBoundingClientRect().width))).toBe(largura);
  const dimensoes=await page.locator('#world canvas').evaluate(elemento=>({largura:(elemento as HTMLCanvasElement).width,altura:(elemento as HTMLCanvasElement).height}));
  expect(dimensoes.largura*dimensoes.altura).toBeLessThanOrEqual(1200000);
  await expect(page.locator('#world')).toHaveAttribute('data-quality','low');
  await expect(page.locator('#world')).toHaveAttribute('data-massas','42');
 }
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('#world')).toHaveAttribute('data-quality','reduced');
 await page.emulateMedia({reducedMotion:'no-preference'});await expect(page.locator('#world')).toHaveAttribute('data-quality','low');
 expect(erros).toEqual([]);
});
