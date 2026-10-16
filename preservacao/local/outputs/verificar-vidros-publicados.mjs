import {chromium,expect} from '../work/CodeLab/node_modules/@playwright/test/index.mjs';
const origem=process.argv[2]||'https://code-lab-omega.vercel.app';
const credencial=process.argv[2]?process.env.VERCEL_OIDC_TOKEN:undefined;
const navegador=await chromium.launch({channel:'msedge',headless:true});
try{
 const contexto=await navegador.newContext({viewport:{width:375,height:812}}),pagina=await contexto.newPage(),erros=[];
 if(credencial)await contexto.route('**/*',rota=>rota.continue(new URL(rota.request().url()).origin===origem?{headers:{...rota.request().headers(),'x-vercel-trusted-oidc-idp-token':credencial}}:undefined));
 pagina.on('pageerror',erro=>erros.push(erro.message));
 pagina.on('console',mensagem=>{if(mensagem.type()==='error'&&/THREE|WebGL|shader/i.test(mensagem.text()))erros.push(mensagem.text());});
 await pagina.goto(origem,{waitUntil:'domcontentloaded',timeout:45000});
 const mundo=pagina.locator('#world');
 await expect(mundo).toHaveAttribute('data-massas','42',{timeout:30000});
 await pagina.waitForFunction(()=>document.querySelector('#world').style.getPropertyValue('--condensacao-vidro')!=='');
 const medidas=[];
 for(const largura of [375,220,4000]){
  await pagina.setViewportSize({width:largura,height:812});
  const estado=await mundo.evaluate(elemento=>{const vidro=getComputedStyle(elemento,'::before');return {condensacao:Number(elemento.style.getPropertyValue('--condensacao-vidro')),opacidade:Number(vidro.opacity),filtro:vidro.filter,interacao:vidro.pointerEvents,largura:elemento.getBoundingClientRect().width};});
  expect(estado.condensacao).toBeGreaterThanOrEqual(0);expect(estado.condensacao).toBeLessThanOrEqual(1);
  expect(estado.opacidade).toBeGreaterThanOrEqual(0);expect(estado.opacidade).toBeLessThanOrEqual(1);
  expect(estado.filtro).toBe('none');expect(estado.interacao).toBe('none');expect(estado.largura).toBe(largura);
  expect(await mundo.locator('canvas').count()).toBe(1);
  expect(await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  medidas.push(estado);
 }
 expect(await pagina.locator('.room').evaluate(elemento=>getComputedStyle(elemento).backgroundImage)).toContain('/assets/casa.png');
 await pagina.emulateMedia({reducedMotion:'reduce'});await expect(mundo).toHaveAttribute('data-quality','reduced');
 await expect(mundo).toHaveAttribute('data-massas','42');expect(erros).toEqual([]);
 console.log(JSON.stringify({origem,medidas,erros,escopo:'estado real e CSS publicado; cenários sintéticos de condensação são verificados pela fixture local/CI'}));
}finally{await navegador.close();}
