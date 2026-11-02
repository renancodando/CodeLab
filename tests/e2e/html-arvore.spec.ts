import {test,expect} from '@playwright/test';
import {practicesForLesson} from '../../src/content/practice';
import html from '../../src/content/deep/html';

const atividades=practicesForLesson('html-arvore-semantica');
test('árvore HTML: elemento normal, void e cada política de foco têm efeitos distintos',async({page:pagina})=>{
 const prever=atividades.find(p=>p.id==='html-arvore-prever-barra')!;
 await pagina.setContent(prever.code!);
 expect(await pagina.locator('#nome').evaluate(e=>e.parentElement!.id)).toBe('cartao');await expect(pagina.locator('#cartao > *')).toHaveCount(2);await expect(pagina.locator('#codigo > *')).toHaveCount(0);
 await pagina.setContent(prever.code!.replace('<div id="cartao" />','<div id="cartao"></div>'));
 expect(await pagina.locator('#nome').evaluate(e=>e.parentElement!.id)).toBe('conteudo');await expect(pagina.locator('#cartao > *')).toHaveCount(0);await expect(pagina.locator('#codigo > *')).toHaveCount(0);
 const diagnosticar=atividades.find(p=>p.id==='html-arvore-corrigir-atalho')!;
 for(const opcao of diagnosticar.options!){
  await pagina.goto('about:blank');await pagina.setContent(diagnosticar.code!.replace('<main id="principal">',opcao.text));
  await pagina.locator('#menu').focus();await pagina.keyboard.press('Tab');
  if(opcao.id==='parada')await expect(pagina.locator('main')).toBeFocused();else await expect(pagina.locator('#fim')).toBeFocused();
  await pagina.locator('#atalho').focus();await pagina.keyboard.press('Enter');
  const alvo=pagina.locator('[id="conteudo"]');await expect(alvo).toHaveCount(opcao.id==='nome'?0:1);
  if(['destino','parada'].includes(opcao.id))await expect(pagina.locator('main')).toBeFocused();else await expect(pagina.locator('main')).not.toBeFocused();
  await expect(pagina.locator('main > h1')).toHaveText('Guia acessível');await expect(pagina.locator('script')).toHaveCount(0);
 }
});

test('árvore semântica preserva previsão e diagnóstico offline sem aprovar o projeto',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))execucoes.push(r.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/html-arvore-semantica');await expect(pagina.locator('[data-inline-practice]')).toHaveCount(2);await expect(pagina.getByText('Prática independente',{exact:true})).toHaveCount(2);
  const previsao=pagina.locator('[data-practice="html-arvore-prever-barra"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('cartao\n2\n0');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('não houve execução de html');
  const diagnostico=pagina.locator('[data-practice="html-arvore-corrigir-atalho"]');await diagnostico.locator('input[value="parada"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('parada');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
  await diagnostico.locator('input[value="destino"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await pagina.reload({waitUntil:'domcontentloaded'});const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['html-arvore-corrigir-atalho']).toMatchObject({passed:true,assisted:false,attempts:2,value:'destino'});expect(salvo.practiceAnswers['html-arvore-prever-barra'].passed).toBe(true);
  await expect(pagina.locator('#aula-projeto')).toContainText('três aulas');
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:1000});expect(await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);for(const atividade of atividades)await expect(pagina.locator('[data-practice="'+atividade.id+'"]').getByRole('button',{name:'Conferir comportamento',exact:true})).toBeVisible();}
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});

test('HTML: documentos e tabela produzem relações semânticas verificáveis',async({page})=>{
 const entry=html.lessons.find(l=>l.id==='html-arvore-semantica')!;
 await page.setContent(entry.code);
 await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
 await expect(page).toHaveTitle('Guia de estudos — CodeLab');
 await expect(page.locator('main')).toHaveCount(1);
 expect(await page.locator('h1,h2,h3').evaluateAll(es=>es.map(e=>e.tagName))).toEqual(['H1','H2','H3']);
 await page.getByRole('link',{name:'Ir ao conteúdo',exact:true}).click();
 await expect(page.locator('#conteudo')).toBeFocused();
 await page.setContent(entry.solution);
 await expect(page.locator('main > section')).toHaveCount(2);
 await expect(page.locator('a[href="#pratica"]')).toHaveCount(1);
 await page.setContent(entry.practices[0].solution);
 expect(await page.locator('#intro').evaluate(e=>e.parentElement?.id)).toBe('aula');
 expect(await page.locator('#instrucoes').evaluate(e=>e.parentElement?.id)).toBe('atividade');
 await page.setContent(entry.practices[1].solution);
 await expect(page.locator('caption')).toHaveText('Horas por pessoa nesta semana');
 await expect(page.locator('th[scope="col"]')).toHaveCount(2);
 await expect(page.locator('th[scope="row"]')).toHaveCount(2);
});

test('HTML: recuperação do parser fecha parágrafo antes de um bloco',async({page})=>{
 await page.setContent('<p id="introducao">Antes<div id="bloco">Bloco</div>Depois</p>');
 expect(await page.locator('#bloco').evaluate(e=>e.parentElement?.tagName)).toBe('BODY');
 await expect(page.locator('#introducao')).toHaveText('Antes');
 const entry=html.lessons.find(l=>l.id==='html-arvore-semantica')!;
 await page.setContent(entry.practices[0].solution);
 await expect(page.locator('p section,p div')).toHaveCount(0);
});
