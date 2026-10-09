import {test,expect} from '@playwright/test';

test('condensação aparece no vidro sem cobrir a arte da sala',async({page})=>{
 await page.setViewportSize({width:1536,height:1024});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:5174/tests/fixtures/vidros.html');
 await page.waitForFunction(()=>typeof Reflect.get(window,'definirCondensacao')==='function');
 await page.evaluate(async()=>{const imagem=new Image();imagem.src='/assets/casa.png';await imagem.decode();});
 await page.addStyleTag({content:'#world{background:#142338;--daylight:1!important}#world canvas{visibility:hidden}'});
 const mundo=page.locator('#world');
 await page.evaluate(()=>Reflect.get(window,'definirCondensacao')(0));
 await expect.poll(()=>mundo.evaluate(elemento=>Number(getComputedStyle(elemento,'::before').opacity))).toBe(0);
 const seco=await page.screenshot();
 await page.evaluate(()=>Reflect.get(window,'definirCondensacao')(.85));
 await expect.poll(()=>mundo.evaluate(elemento=>Number(getComputedStyle(elemento,'::before').opacity))).toBeGreaterThan(.8);
 const úmido=await page.screenshot();
 const amostras=await page.evaluate(async imagens=>{
  const pontos=[[350,250],[700,300],[100,100],[950,350],[400,900]];
  const resultado:number[][][]=[];
  for(const dados of imagens){
   const imagem=new Image();imagem.src='data:image/png;base64,'+dados;await imagem.decode();
   const canvas=document.createElement('canvas');canvas.width=imagem.width;canvas.height=imagem.height;
   const contexto=canvas.getContext('2d')!;contexto.drawImage(imagem,0,0);
   resultado.push(pontos.map(([x,y])=>Array.from(contexto.getImageData(x,y,1,1).data).slice(0,3)));
  }
  return resultado;
 },[seco.toString('base64'),úmido.toString('base64')]);
 const diferenças=amostras[0].map((cor,i)=>Math.max(...cor.map((valor,j)=>Math.abs(valor-amostras[1][i][j]))));
 expect(diferenças[0]).toBeGreaterThan(10);expect(diferenças[1]).toBeGreaterThan(10);
 for(const diferença of diferenças.slice(2))expect(diferença).toBeLessThanOrEqual(3);
 await page.evaluate(()=>Reflect.get(window,'definirCondensacao')(0));
 await expect.poll(()=>mundo.evaluate(elemento=>Number(getComputedStyle(elemento,'::before').opacity))).toBe(0);
});

test('vidros acompanham neblina em qualidade baixa e reduzida sem novos buffers',async({page})=>{
 const erros:string[]=[];page.on('pageerror',erro=>erros.push(erro.message));
 page.on('console',mensagem=>{if(mensagem.type()==='error'&&/THREE|WebGL|shader/i.test(mensagem.text()))erros.push(mensagem.text());});
 await page.addInitScript(()=>{Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>2});Object.defineProperty(navigator,'deviceMemory',{get:()=>2});});
 await page.clock.setFixedTime(new Date('2026-10-08T15:00:00Z'));
 await page.goto('http://127.0.0.1:5174/tests/fixtures/vidros.html');
 await page.waitForFunction(()=>typeof Reflect.get(window,'mostrarCenario')==='function');
 const mundo=page.locator('#world');
 let geometrias:string|null=null;
 for(const largura of [220,375,1536,4000]){
  await page.setViewportSize({width:largura,height:812});
  const estado=await page.evaluate(()=>Reflect.get(window,'mostrarCenario')('neblina'));
  expect(estado.condensacao).toBeGreaterThan(.01);expect(estado.chuva).toBe(0);
  await expect.poll(()=>mundo.evaluate(elemento=>Number(elemento.style.getPropertyValue('--condensacao-vidro')))).toBeGreaterThan(.01);
  await expect(mundo).toHaveAttribute('data-quality','low');await expect(mundo).toHaveAttribute('data-massas','42');
  await expect.poll(()=>mundo.getAttribute('data-geometries')).not.toBeNull();
  geometrias??=await mundo.getAttribute('data-geometries');expect(await mundo.getAttribute('data-geometries')).toBe(geometrias);
  expect(await mundo.locator('canvas').count()).toBe(1);
  expect(await page.evaluate(()=>Reflect.get(window,'maiorBuffer')())).toBeLessThanOrEqual(1200000);
  const camada=await mundo.evaluate(elemento=>{const estilo=getComputedStyle(elemento,'::before');return {filtro:estilo.filter,interação:estilo.pointerEvents,opacidade:Number(estilo.opacity)};});
  expect(camada.filtro).toBe('none');expect(camada.interação).toBe('none');expect(camada.opacidade).toBeGreaterThan(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await expect(mundo).toHaveAttribute('data-quality','reduced');
 expect(await mundo.evaluate(elemento=>Number(getComputedStyle(elemento,'::before').opacity))).toBeGreaterThan(0);
 await page.evaluate(()=>Reflect.get(window,'descartarMundo')());
 await expect(mundo.locator('canvas')).toHaveCount(0);
 await expect.poll(()=>mundo.evaluate(elemento=>Number(getComputedStyle(elemento,'::before').opacity))).toBe(0);
 expect(await mundo.evaluate(elemento=>elemento.style.getPropertyValue('--condensacao-vidro'))).toBe('');
 expect(erros).toEqual([]);
});
