import {chromium,expect} from '../work/CodeLab/node_modules/@playwright/test/index.mjs';
const origem=process.argv[2]||'https://code-lab-omega.vercel.app';
const credencial=process.argv[2]?process.env.VERCEL_OIDC_TOKEN:undefined;
const navegador=await chromium.launch({channel:'msedge',headless:true});
try {
 const contexto=await navegador.newContext({viewport:{width:375,height:812}}),pagina=await contexto.newPage(),erros=[];
 if(credencial)await contexto.route('**/*',rota=>rota.continue(new URL(rota.request().url()).origin===origem?{headers:{...rota.request().headers(),'x-vercel-trusted-oidc-idp-token':credencial}}:undefined));
 pagina.on('pageerror',erro=>erros.push(erro.message));
 pagina.on('console',mensagem=>{if(mensagem.type()==='error'&&/THREE|WebGL|shader/i.test(mensagem.text()))erros.push(mensagem.text());});
 await pagina.addInitScript(()=>{
  Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>2});
  Object.defineProperty(navigator,'deviceMemory',{get:()=>2});
  window.maiorBuffer=0;
  for(const atributo of ['width','height']) {
   const descritor=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,atributo);
   Object.defineProperty(HTMLCanvasElement.prototype,atributo,{...descritor,set(valor){descritor.set.call(this,valor);if(this.closest('#world'))window.maiorBuffer=Math.max(window.maiorBuffer,this.width*this.height);}});
  }
 });
 await pagina.goto(origem,{waitUntil:'domcontentloaded',timeout:45000});
 await expect(pagina.locator('#world')).toHaveAttribute('data-quality','low',{timeout:30000});
 await expect(pagina.locator('#world')).toHaveAttribute('data-massas','42');
 const medidas=[];
 for(const [largura,altura] of [[375,812],[4000,812],[375,812],[220,1800],[4000,300],[375,812]]) {
  await pagina.setViewportSize({width:largura,height:altura});
  await expect.poll(()=>pagina.locator('#world canvas').evaluate(canvas=>Math.round(canvas.getBoundingClientRect().width))).toBe(largura);
  const medida=await pagina.locator('#world canvas').evaluate(canvas=>({largura:canvas.width,altura:canvas.height,pico:window.maiorBuffer}));
  expect(medida.largura*medida.altura).toBeLessThanOrEqual(1200000);expect(medida.pico).toBeLessThanOrEqual(1200000);medidas.push(medida);
 }
 await pagina.emulateMedia({reducedMotion:'reduce'});await expect(pagina.locator('#world')).toHaveAttribute('data-quality','reduced');
 await pagina.emulateMedia({reducedMotion:'no-preference'});await expect(pagina.locator('#world')).toHaveAttribute('data-quality','low');
 await expect(pagina.locator('#world')).toHaveAttribute('data-massas','42');
 expect(erros).toEqual([]);
 console.log(JSON.stringify({medidas,erros,qualidade:await pagina.locator('#world').getAttribute('data-quality'),massas:await pagina.locator('#world').getAttribute('data-massas')}));
} finally {await navegador.close();}

