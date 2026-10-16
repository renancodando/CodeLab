import {chromium} from '../work/CodeLab/node_modules/@playwright/test/index.mjs';
import {writeFile} from 'node:fs/promises';
const navegador = await chromium.launch({channel:'msedge',headless:true});
const resultados = [], erros = [];
try {
 for(const largura of [375,1440]) {
  const contexto = await navegador.newContext({viewport:{width:largura,height:812}});
  await contexto.addInitScript(() => {
   const amostras = []; Reflect.set(window,'amostrasClima',amostras);
   for(const tipo of [WebGLRenderingContext,WebGL2RenderingContext]) {
    const limpar = tipo.prototype.clear;
    tipo.prototype.clear = function(...argumentos) {
     amostras.push(performance.now()); if(amostras.length>300)amostras.shift();
     return limpar.apply(this,argumentos);
    };
   }
  });
  const pagina = await contexto.newPage();
  pagina.on('pageerror',erro=>erros.push(erro.message));
  pagina.on('console',mensagem=>{if(mensagem.type()==='error'&&/THREE|shader|WebGL/i.test(mensagem.text()))erros.push(mensagem.text());});
  await pagina.clock.setFixedTime(new Date('2026-10-08T15:00:00Z'));
  await pagina.goto('http://127.0.0.1:5174/tests/fixtures/atmosfera.html',{waitUntil:'domcontentloaded'});
  await pagina.waitForFunction(()=>typeof Reflect.get(window,'mostrarCenario')==='function');
  for(const nome of ['limpo','encoberto','chuva-forte','neblina','noite-nublada']) {
   await pagina.clock.setFixedTime(new Date(nome.startsWith('noite')?'2026-10-08T03:00:00Z':'2026-10-08T15:00:00Z'));
   await pagina.evaluate(nome=>Reflect.get(window,'mostrarCenario')(nome),nome);
   await pagina.waitForTimeout(2500);
   await pagina.evaluate(()=>Reflect.get(window,'amostrasClima').length=0);
   await pagina.waitForTimeout(3000);
   const resultado = await pagina.evaluate(() => {
    const amostras = Reflect.get(window,'amostrasClima');
    const intervalos = amostras.slice(1).map((valor,indice)=>valor-amostras[indice]).sort((a,b)=>a-b);
    const estado = document.querySelector('#world').dataset;
    return {amostras:amostras.length,intervaloMedianoMs:intervalos[Math.floor(intervalos.length*.5)]??null,
     intervaloP95Ms:intervalos[Math.floor(intervalos.length*.95)]??null,qualidade:estado.quality,
     chamadasDesenho:estado.drawCalls,geometrias:estado.geometries,massas:estado.massas,chuva:estado.chuva};
   });
   resultados.push({largura,cenario:nome,...resultado});
   console.log(JSON.stringify(resultados.at(-1)));
  }
  await contexto.close();
 }
 await writeFile(new URL('./custo-clima-local.json',import.meta.url),JSON.stringify({contexto:'Edge headless local; viewport emulada; intervalos de submissão, sem comprovar FPS de celular físico',resultados,erros},null,2));
 if(erros.length)throw new Error(JSON.stringify(erros));
} finally {await navegador.close();}
