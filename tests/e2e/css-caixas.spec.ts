import {test,expect} from '@playwright/test';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const codigo=(id:string)=>practiceActivities.find(atividade=>atividade.id===id)!.code!;

test('CSS: referências medem bordas, encolhimento e adesão após rolagem real',async({page:pagina})=>{
 await pagina.setContent(codigo('css-prever-bordas'));
 const larguras=await pagina.locator('.caixa').evaluateAll(caixas=>caixas.map(caixa=>caixa.getBoundingClientRect().width));
 expect(larguras).toEqual([150,120,30]);
 expect(larguras.join('\n')).toBe(getPracticeSolution('css-prever-bordas'));
 const texto='A'.repeat(64);
 for(const largura of [200,220,375,4000]){
  await pagina.setViewportSize({width:largura,height:812});
  await pagina.setContent(codigo('css-reduzir-minimo').replace('____','auto'));
  expect(await pagina.locator('.linha').evaluate(linha=>linha.scrollWidth-linha.clientWidth)).toBeGreaterThan(10);
  await pagina.setContent(codigo('css-reduzir-minimo').replace('____',getPracticeSolution('css-reduzir-minimo')!));
  expect(await pagina.locator('.linha').evaluate(linha=>linha.scrollWidth-linha.clientWidth)).toBeLessThanOrEqual(1);
  const item=pagina.locator('.texto');await expect(item).toHaveText(texto);
  expect(await item.evaluate(elemento=>elemento.getBoundingClientRect().height)).toBeGreaterThan(20);
  expect(await item.evaluate(elemento=>getComputedStyle(elemento).overflowX)).toBe('visible');
  expect(await pagina.locator('.rotulo').evaluate(rotulo=>rotulo.getBoundingClientRect().width)).toBe(48);
  expect(await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await item.evaluate(elemento=>{elemento.textContent='';});
  expect(await pagina.locator('.linha').evaluate(linha=>linha.scrollWidth-linha.clientWidth)).toBeLessThanOrEqual(1);
  await pagina.setContent(codigo('css-corrigir-rolagem'));
  expect(await pagina.locator('#cabecalho').evaluate(elemento=>elemento.getBoundingClientRect().top)).toBe(0);
  expect(await pagina.locator('#rolagem').evaluate(elemento=>elemento.getBoundingClientRect().top)).toBe(60);
  await pagina.setContent(codigo('css-corrigir-rolagem').replace('position: fixed;',getPracticeSolution('css-corrigir-rolagem')!));
  const regiao=pagina.locator('#rolagem'),cabecalho=pagina.locator('#cabecalho');
  await expect(cabecalho).toBeInViewport();
  expect(await regiao.evaluate(elemento=>elemento.scrollHeight>elemento.clientHeight)).toBe(true);
  await regiao.evaluate(elemento=>{elemento.scrollTop=80;});
  expect(await regiao.evaluate(elemento=>elemento.scrollTop)).toBe(80);
  const topo=await regiao.evaluate(elemento=>elemento.getBoundingClientRect().top);
  await expect.poll(()=>cabecalho.evaluate(elemento=>elemento.getBoundingClientRect().top)).toBeCloseTo(topo,1);
  expect(await cabecalho.evaluate(elemento=>getComputedStyle(elemento).position)).toBe('sticky');
  await expect(cabecalho).toHaveText('Registros');
  await expect(pagina.locator('.conteudo')).toHaveText('Conteúdo da seção.');
 }
});

test('CSS: caixas retomam offline com respostas, assistência e texto preservados',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))execucoes.push(pedido.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/css-caixas-intrinseco');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(17);
  const prever=pagina.locator('[data-practice="css-prever-bordas"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('150\n120\n20');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('piso zero');
  await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('150\n120\n30');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('não houve execução de css');
  const minimo=pagina.locator('[data-practice="css-reduzir-minimo"]');
  await minimo.getByLabel('Trecho que falta').fill('auto');
  await minimo.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(minimo.locator('.practice-feedback')).toContainText('piso');
  await minimo.getByLabel('Trecho que falta').fill('0px');
  await minimo.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(minimo.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const rolagem=pagina.locator('[data-practice="css-corrigir-rolagem"]');
  await rolagem.locator('input[value="relativo"]').check();
  await rolagem.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(rolagem.locator('.practice-feedback')).toContainText('sai do fluxo');
  await rolagem.locator('input[value="aderir"]').check();
  await rolagem.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(rolagem.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await rolagem.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(rolagem.locator('.practice-feedback')).toContainText('assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(prever.locator('textarea')).toHaveValue('150\n120\n30');
  await expect(minimo.locator('input[name="answer"]')).toHaveValue('0px');
  await expect(rolagem.locator('input[value="aderir"]')).toBeChecked();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['css-corrigir-rolagem'].assisted).toBe(true);
  expect(salvo.adaptive.skills['css.caixas.encolhimento'].evidence['css-reduzir-minimo'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(prever).toBeVisible();await expect(minimo).toBeVisible();await expect(rolagem).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
