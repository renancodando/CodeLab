import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practicesForLesson} from '../../src/content/practice';
import html from '../../src/content/deep/html';

const atividades=practicesForLesson('html-texto-links');
const atividade=(id:string)=>atividades.find(a=>a.id===id)!;

test('texto HTML: referências distinguem texto literal, entidades e elementos reais',async({page:pagina})=>{
 await pagina.setContent(atividade('html-texto-prever-escape').code!);
 await expect(pagina.locator('#amostra')).toHaveText('<button>A & B</button>');await expect(pagina.locator('#amostra button')).toHaveCount(0);
 const aula=html.lessons.find(a=>a.id==='html-texto-links')!;await pagina.setContent(aula.bugCode!);await expect(pagina.locator('pre code button')).toHaveCount(1);
 const casos=['<button>A & B</button>','<em>A &amp; B</em>','&lt;b&gt;','Ação\n  linha com \t tab','texto sem marcação',''];
 for(const opcao of atividade('html-texto-corrigir-insercao').options!){
  await pagina.setContent('<!doctype html><html lang="pt-BR"><head><title>Referência de texto</title></head><body><main><h1>Trecho recebido</h1><pre><code id="amostra"><strong>Anterior</strong></code></pre></main></body></html>');
  const resultados:boolean[]=[];
  for(const trecho of casos){
   const resultado=await pagina.locator('#amostra').evaluate((alvo,{codigo,trecho})=>{
    const anterior=document.createElement('strong');anterior.textContent='Anterior';alvo.replaceChildren(anterior);
    new Function('alvo','trecho',codigo)(alvo,trecho);
    return {texto:alvo.textContent,elementos:alvo.childElementCount,anterior:alvo.contains(anterior)};
   },{codigo:opcao.text,trecho});
   resultados.push(resultado.texto===trecho&&resultado.elementos===0&&!resultado.anterior);
   if(opcao.id==='literal')expect(resultado).toEqual({texto:trecho,elementos:0,anterior:false});
  }
  expect(resultados.every(Boolean)).toBe(opcao.id==='literal');
 }
});

test('links resolvem pela base sem buscar destinos e os documentos originais mantêm relações',async({page:pagina})=>{
 const pedidos:string[]=[];await pagina.route('**/*',rota=>{pedidos.push(rota.request().url());return rota.abort();});
 await pagina.setContent(atividade('html-links-prever-base').code!);
 expect(await pagina.locator('a').evaluateAll(es=>es.map(e=>(e as HTMLAnchorElement).href))).toEqual(['https://exemplo.invalid/guias/css/?nivel=1#grade','https://exemplo.invalid/laboratorio/#editor','https://exemplo.invalid/guias/html/#comparacao']);
 expect(await pagina.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href')))).toEqual(['../css/?nivel=1#grade','/laboratorio/#editor','#comparacao']);
 expect(pedidos).toEqual([]);await pagina.unroute('**/*');
 const aula=html.lessons.find(a=>a.id==='html-texto-links')!;
 await pagina.setContent(aula.code);await expect(pagina.locator('ol > li')).toHaveText(['Ler o conceito','Executar o exemplo','Escrever uma variação']);await expect(pagina.locator('caption')).toHaveText('Minutos de estudo');await expect(pagina.locator('th[scope="row"]')).toHaveText(['Segunda','Terça']);await expect(pagina.locator('td')).toHaveText(['30','45']);await expect(pagina.locator('code')).toHaveText('console.log("Olá")');
 await pagina.setContent(aula.solution);await expect(pagina.locator('caption')).toHaveText('Comparação de percursos');await expect(pagina.locator('th[scope="col"]')).toHaveText(['Linguagem','Uso','Pré-requisito']);await expect(pagina.locator('th[scope="row"]')).toHaveText(['HTML','CSS','JavaScript']);await expect(pagina.locator('a[href="#comparacao"]')).toHaveCount(1);await expect(pagina.locator('[id="comparacao"]')).toHaveCount(1);
 expect((await new AxeBuilder({page:pagina}).analyze()).violations).toEqual([]);
});

test('texto e links preservam respostas, assistência e leitura offline em 220–4000 px',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))execucoes.push(r.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/html-texto-links');await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
  expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'{}').adaptive?.skills??{})).toEqual({});
  const previsao=pagina.locator('[data-practice="html-texto-prever-escape"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('A & B\n1');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('nova tag');
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill('<button>A & B</button>\n0');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('não houve execução de html');
  const diagnostico=pagina.locator('[data-practice="html-texto-corrigir-insercao"]');await diagnostico.locator('input[value="parcial"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('entrada completa');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
  await diagnostico.locator('input[value="literal"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const links=pagina.locator('[data-practice="html-links-prever-base"]');await links.getByLabel('Saída prevista, uma linha por saída').fill('https://exemplo.invalid/guias/css/?nivel=1#grade\nhttps://exemplo.invalid/laboratorio/#editor\nhttps://exemplo.invalid/guias/html/#comparacao');await links.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(links.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await links.getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload({waitUntil:'domcontentloaded'});
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['html-texto-prever-escape']).toMatchObject({passed:true,assisted:false,attempts:2});expect(salvo.practiceAnswers['html-texto-corrigir-insercao']).toMatchObject({value:'literal',passed:true,assisted:false});expect(salvo.practiceAnswers['html-links-prever-base'].assisted).toBe(true);expect(salvo.adaptive.skills['html.links.resolucao-base'].review.lastOutcome).toBe('assisted');
  await expect(pagina.locator('#aula-projeto')).toContainText('manual pequeno');await expect(pagina.getByRole('button',{name:'A & B',exact:true})).toHaveCount(0);
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:1000});await pagina.evaluate(()=>new Promise<void>(resolver=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolver()))));expect(await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);for(const item of atividades)await expect(pagina.locator('[data-practice="'+item.id+'"]').getByRole('button',{name:'Conferir comportamento',exact:true})).toBeVisible();}
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
