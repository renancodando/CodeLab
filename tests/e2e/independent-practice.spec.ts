import {test,expect} from '@playwright/test';
import {resolveLesson} from '../../src/content/curriculum';
import html from '../../src/content/deep/html';
import css from '../../src/content/deep/css';

const aulasAprofundadas=['py-iteracao-recursos','py-numeros-texto','ts-validacao-aninhada','cpp-funcoes-referencias','js-closures-estado','html-dados-formulario','css-cascata-camadas','cs-decimal-limites','sql-joins-cardinalidade','py-funcoes-contratos','ts-genericos-relacoes','cpp-raii-posse-unica','js-promessas-contratos','html-dialogo-foco','css-grid-trilhas','cs-iteradores-descarte','sql-isolamento-sessoes'];
for(const id of aulasAprofundadas){
 test(`aula ${id}: leitura, mapa, referências e abertura das soluções`,async({page})=>{
  await page.goto('/#/aula/'+id);
  await expect(page.locator('.lesson-chapter')).toHaveCount(17);
  await expect(page.locator('.lesson-map a')).toHaveCount(17);
  await expect(page.getByText('Prática independente',{exact:true})).toHaveCount(2);
  const resolucoes=page.locator('[id^="aula-resolucao-"]');
  await expect(resolucoes.locator('pre')).toHaveCount(2);
  for(let i=0;i<2;i++){
   await expect(resolucoes.nth(i).locator('pre')).not.toBeVisible();
   await expect(resolucoes.nth(i).locator('details > p').first()).not.toBeVisible();
   await resolucoes.nth(i).locator('summary').click();
   await expect(resolucoes.nth(i).locator('pre')).toBeVisible();
   await expect(resolucoes.nth(i).locator('details > p').first()).toBeVisible();
  }
 });
}

test('aula aprofundada conserva a conclusão após recarregar',async({page})=>{
 await page.goto('/#/aula/js-closures-estado');
 await page.getByLabel('Ela conserva acesso ao binding, que pode ter sido atualizado antes da leitura.',{exact:true}).check();
 await page.getByRole('button',{name:'Conferir resposta'}).click();
 await expect(page.locator('#lesson-feedback')).toContainText('aula foi concluída');
 await page.reload();await expect(page.locator('#lesson-feedback')).toContainText('já concluída');
});

test('páginas aprofundadas entregam também os problemas sem JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
 for(const id of ['py-iteracao-recursos','py-numeros-texto','ts-validacao-aninhada','html-dados-formulario','sql-joins-cardinalidade','html-dialogo-foco','css-grid-trilhas','cs-iteradores-descarte','sql-isolamento-sessoes']){
  await page.goto('http://127.0.0.1:5080/aulas/'+id+'/');
  await expect(page.locator('main section')).toHaveCount(17);
  await expect(page.locator('pre')).toHaveCount(id==='sql-isolamento-sessoes'?6:5);
  await expect(page.getByRole('heading',{name:/^Problema 1:/})).toHaveCount(1);
  const resolucoes=page.locator('[id^="aula-resolucao-"]');
  await expect(resolucoes.first().locator('pre')).not.toBeVisible();
  await resolucoes.first().locator('summary').click();
  await expect(resolucoes.first().locator('pre')).toBeVisible();
 }
 await context.close();
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

test('HTML: dados enviados preservam multiplicidade, submitter e texto literal',async({page})=>{
 const entry=html.lessons.find(l=>l.id==='html-dados-formulario')!;
 await page.setContent(entry.code);
 await page.getByRole('button',{name:'Mostrar dados',exact:true}).click();
 expect(await page.locator('#nome').evaluate((e:HTMLInputElement)=>e.validity.valueMissing)).toBe(true);
 await expect(page.locator('#resultado')).toHaveText('');
 await page.getByLabel('Nome',{exact:true}).fill('<img src=x>');
 await page.getByRole('button',{name:'Mostrar dados',exact:true}).click();
 await expect(page.locator('#resultado')).toHaveText(JSON.stringify([['nome','<img src=x>'],['codigo','A1'],['assunto','html'],['acao','salvar']]));
 await expect(page.locator('#resultado img')).toHaveCount(0);
 await page.getByLabel('CSS',{exact:true}).check();
 await page.getByRole('button',{name:'Mostrar dados',exact:true}).click();
 await expect(page.locator('#resultado')).toHaveText(JSON.stringify([['nome','<img src=x>'],['codigo','A1'],['assunto','html'],['assunto','css'],['acao','salvar']]));
 await page.getByRole('button',{name:'Limpar prévia',exact:true}).click();
 await expect(page.locator('#resultado')).toHaveText('');
});

test('HTML: soluções distinguem seleção vazia, ação e presença dos controles',async({page})=>{
 const entry=html.lessons.find(l=>l.id==='html-dados-formulario')!;
 await page.setContent(entry.solution);
 await page.getByRole('button',{name:'Conferir seleções',exact:true}).click();
 await expect(page.locator('#selecionadas')).toHaveText('[]');
 await page.getByLabel('HTML',{exact:true}).check();await page.getByLabel('CSS',{exact:true}).check();
 await page.getByRole('button',{name:'Conferir seleções',exact:true}).click();
 await expect(page.locator('#selecionadas')).toHaveText('["html","css"]');
 await page.setContent(entry.practices[0].solution);
 await page.getByRole('button',{name:'Enviar rascunho',exact:true}).click();await expect(page.locator('#acao')).toHaveText('rascunho');
 await page.getByRole('button',{name:'Enviar final',exact:true}).click();await expect(page.locator('#acao')).toHaveText('final');
 await page.getByRole('button',{name:'Ação local',exact:true}).click();await expect(page.locator('#acao')).toHaveText('local');
 await page.setContent(entry.practices[1].solution);
 await page.getByRole('button',{name:'Conferir presença',exact:true}).click();await expect(page.locator('#dados')).toHaveText('[["fixo","A"]]');
 await page.getByLabel('Aceite',{exact:true}).check();
 await page.getByRole('button',{name:'Conferir presença',exact:true}).click();await expect(page.locator('#dados')).toHaveText('[["fixo","A"],["aceite","sim"]]');
});

test('CSS: estilos computados conferem camadas, important e fallback',async({page})=>{
 const entry=css.lessons.find(l=>l.id==='css-cascata-camadas')!;
 await page.setContent(entry.code);
 expect(await page.locator('#painel').evaluate(e=>getComputedStyle(e).color)).toBe('rgb(0, 0, 180)');
 expect(await page.locator('#painel').evaluate(e=>getComputedStyle(e).borderTopColor)).toBe('rgb(0, 0, 180)');
 await page.setContent(entry.solution);
 expect(await page.locator('#alvo').evaluate(e=>getComputedStyle(e).color)).toBe('rgb(0, 0, 180)');
 await page.setContent(entry.practices[0].solution);
 expect(await page.locator('#alvo').evaluate(e=>getComputedStyle(e).color)).toBe('rgb(180, 0, 0)');
 await page.setContent(entry.practices[1].solution);
 expect(await page.locator('#ausente').evaluate(e=>getComputedStyle(e).color)).toBe('rgb(180, 0, 0)');
 expect(await page.locator('#invalido').evaluate(e=>getComputedStyle(e).color)).toBe('rgb(0, 100, 0)');
});

test('CSS: caixas medidas e textos longos respeitam o espaço disponível',async({page})=>{
 const entry=css.lessons.find(l=>l.id==='css-caixas-intrinseco')!;
 await page.setContent(entry.code);
 expect(await page.locator('#conteudo').evaluate(e=>e.getBoundingClientRect().width)).toBe(224);
 expect(await page.locator('#borda').evaluate(e=>e.getBoundingClientRect().width)).toBe(180);
 await page.setContent(entry.solution);
 for(const width of [200,320,800]){
  await page.setViewportSize({width,height:600});
  expect(await page.locator('#linha').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
  expect(await page.locator('.texto').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
 }
 await page.setContent(entry.practices[0].solution);await page.setViewportSize({width:200,height:600});
 expect(await page.locator('#grupo').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
 expect(await page.locator('#valor').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
 expect(await page.locator('#valor').evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThan(20);
 await expect(page.locator('#valor')).toHaveText('B'.repeat(64));
});

test('CSS: sticky acompanha a rolagem local e conserva o fluxo',async({page})=>{
 const entry=css.lessons.find(l=>l.id==='css-caixas-intrinseco')!;
 await page.setContent(entry.practices[1].solution);
 expect(await page.locator('#rolagem').evaluate(e=>e.scrollHeight>e.clientHeight)).toBe(true);
 await page.locator('#rolagem').evaluate(e=>{e.scrollTop=80;});
 await expect.poll(()=>page.evaluate(()=>{
  const h=document.querySelector('#cabecalho')!.getBoundingClientRect(),r=document.querySelector('#rolagem')!.getBoundingClientRect();
  return Math.abs(h.top-r.top);
 })).toBeLessThan(1);
 expect(await page.locator('#cabecalho').evaluate(e=>getComputedStyle(e).position)).toBe('sticky');
});
