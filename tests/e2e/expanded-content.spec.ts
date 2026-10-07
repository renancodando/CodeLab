import {test,expect} from '@playwright/test';
import {resolveLesson} from '../../src/content/curriculum';

test('novas trilhas abrem conteúdo completo e guardam progresso local',async({page})=>{
 await page.goto('/#/aprender');await expect(page.locator('.trail-grid .trail')).toHaveCount(20);
 await page.getByRole('link',{name:/Python · do zero ao avançado/}).click();
 await expect(page.locator('.mission-list .mission-row')).toHaveCount(9);
 await page.getByRole('link',{name:/Python: execução, tipos e controle/}).click();
 await expect(page.locator('.lesson-chapter')).toHaveCount(13);
 await expect(page.locator('#aula-contexto')).toContainText('interpretador executa');
 await page.getByLabel('valor is None', {exact:true}).check();
 await page.getByRole('button',{name:'Conferir resposta'}).click();
 await expect(page.locator('#lesson-feedback')).toContainText('aula foi concluída');
 await page.reload();await expect(page.locator('#lesson-feedback')).toContainText('já concluída');
 await page.goto('/#/aula/ts-fronteiras-qualidade');await expect(page.locator('.lesson-chapter')).toHaveCount(13);
 await expect(page.locator('#aula-contexto')).toContainText('unknown');
 await expect(page.locator('#practice-lesson')).toHaveCount(0);
 await page.goto('/#/aula/sql-transacoes');await expect(page.locator('.lesson-chapter')).toHaveCount(13);
 await expect(page.locator('#aula-codigo')).toContainText('PostgreSQL');await expect(page.locator('#practice-lesson')).toHaveCount(0);
});

test('busca encontra conceitos antes de carregar os capítulos',async({page})=>{
 await page.goto('/');await page.locator('#search').click();
 await page.locator('#search-query').fill('RAII');
 await expect(page.locator('#search-results')).toContainText('C++: classes, RAII');
 await page.locator('#search-results [data-route="aula/cpp-classes-raii"]').click();
 await expect(page.locator('.lesson-chapter')).toHaveCount(13);
 await expect(page.locator('#aula-teoria-1')).toContainText('RAII');
});

test('navegar durante carregamento não mostra uma aula antiga',async({page})=>{
 await page.route('**/assets/python-*.js',async route=>{await new Promise(resolve=>setTimeout(resolve,500));await route.continue();});
 await page.goto('/#/aula/py-fundamentos');await page.goto('/#/aprender');
 await expect(page.locator('.trail-grid .trail')).toHaveCount(20);
 await page.waitForTimeout(800);await expect(page.locator('.trail-grid .trail')).toHaveCount(20);await expect(page.locator('.lesson-chapter')).toHaveCount(0);
 await page.unroute('**/assets/python-*.js');
 await page.goto('/#/aula/py-concorrencia');await expect(page.locator('.lesson-chapter')).toHaveCount(13);
});

test('novas páginas entregam os capítulos sem JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
 for(const [id,title] of [['py-concorrencia','Python: concorrência, async e paralelismo'],['cpp-memoria-posse','C++: memória, posse e segurança de vida'],['sql-agregacoes-janelas','SQL: agregações, janelas e análise']]){
  await page.goto('http://127.0.0.1:5080/aulas/'+id+'/');await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible();await expect(page.locator('main section')).toHaveCount(13);await expect(page.locator('pre')).toHaveCount(3);
 }
 await context.close();
});

test('falha de download comunica o problema e permite tentar novamente',async({page})=>{
 await page.route('**/assets/python-*.js',route=>route.abort());
 await page.goto('/#/aula/py-fundamentos');await expect(page.locator('#retry-lesson')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Não foi possível carregar esta aula'})).toBeVisible();
 await page.unroute('**/assets/python-*.js');await page.locator('#retry-lesson').click();
 await expect(page.locator('.lesson-chapter')).toHaveCount(13);await expect(page.locator('#aula-contexto')).toContainText('interpretador executa');
});

test('exemplos HTML funcionam e inserem entradas como texto',async({page})=>{
 const formulario=(await resolveLesson('html-formularios'))!;await page.setContent(formulario.code);
 await page.getByLabel('Minutos por dia').fill('30');await page.getByRole('button',{name:'Conferir',exact:true}).click();await expect(page.locator('#resultado')).toHaveText('Meta: 30 minutos.');
 await page.getByLabel('Minutos por dia').fill('0');await page.getByRole('button',{name:'Conferir',exact:true}).click();expect(await page.locator('#minutos').evaluate((e:HTMLInputElement)=>e.validity.rangeUnderflow)).toBe(true);
 const notas=(await resolveLesson('html-plataforma'))!;await page.setContent(notas.code);
 await page.getByLabel('Nova nota').fill('<img src=x onerror=alert(1)>');await page.getByRole('button',{name:'Adicionar',exact:true}).click();
 await expect(page.locator('#notas li span')).toHaveText('<img src=x onerror=alert(1)>');await expect(page.locator('#notas img')).toHaveCount(0);
 await page.getByRole('button',{name:'Remover',exact:true}).click();await expect(page.locator('#notas li')).toHaveCount(0);
});

test('exemplos CSS conservam caixas e mudam o layout pelo contêiner',async({page})=>{
 const grade=(await resolveLesson('css-flex-grid'))!;await page.setContent(grade.code);
 for(const width of [280,430,800,1440]){await page.setViewportSize({width,height:800});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
 const responsivo=(await resolveLesson('css-responsivo'))!;await page.setContent(responsivo.code);
 await page.setViewportSize({width:280,height:800});await expect.poll(()=>page.locator('.cartao').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(1);
 await page.setViewportSize({width:900,height:800});await expect.poll(()=>page.locator('.cartao').evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(' ').length)).toBe(2);
});
