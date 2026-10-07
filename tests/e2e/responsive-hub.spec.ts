import {test,expect} from '@playwright/test';
for(const width of [220,320,480,768,1440,1920,2560,4000]){
 test('navegação e estudo sem transbordamento em '+width+'px',async({page})=>{
  test.setTimeout(90000);await page.setViewportSize({width,height:1000});
  for(const route of ['home','aprender','perfil','pratica/css-grade-estreita','projeto/html-caderno','aula/css-grid-trilhas','laboratorio']){
   await page.goto('/#/'+route);await expect(page.locator('#main h1')).toBeVisible();
   if(route==='laboratorio')await expect(page.locator('.monaco-editor')).toBeVisible();
   if(route.startsWith('aula/'))await expect(page.locator('[data-practice]')).toHaveCount(2);
   const dimensions=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
   expect(dimensions.document,'rota '+route).toBeLessThanOrEqual(width+1);expect(dimensions.body,'rota '+route).toBeLessThanOrEqual(width+1);
  }
  await expect(page.locator('.sidebar a')).toHaveCount(6);for(const link of await page.locator('.sidebar a').all()){const rect=await link.boundingBox();expect(rect!.width).toBeGreaterThanOrEqual(30);}
 });
}
