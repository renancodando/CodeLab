import {test,expect} from '@playwright/test';
import css from '../../src/content/deep/css';
const aula = css.lessons.find(aula => aula.id === 'css-containers-contexto')!;
const colunas = async (pagina:import('@playwright/test').Page, seletor:string) => pagina.locator(seletor).evaluate(elemento => getComputedStyle(elemento).gridTemplateColumns.split(' ').length);

test('CSS: instâncias respondem ao contexto e ao conteúdo da caixa',async({page})=>{
 await page.setViewportSize({width:1000,height:700});await page.setContent(aula.code);
 expect(await colunas(page,'#largo .cartao')).toBe(2);
 expect(await colunas(page,'#estreito .cartao')).toBe(1);
 await expect(page.locator('#largo h2')).toHaveCSS('font-size','24px');
 await expect(page.locator('#estreito h2')).toHaveCSS('font-size','16px');
 await page.locator('#largo').evaluate(elemento => (elemento as HTMLElement).style.inlineSize='480px');
 expect(await colunas(page,'#largo .cartao')).toBe(2);
 await page.locator('#largo').evaluate(elemento => {const estilo=(elemento as HTMLElement).style;estilo.padding='20px';estilo.border='2px solid';});
 expect(await page.locator('#largo').evaluate(elemento=>elemento.getBoundingClientRect().width)).toBe(480);
 expect(await colunas(page,'#largo .cartao')).toBe(1);
});

test('CSS: o bug de autoconsulta falha e o invólucro corrige o limite inclusivo',async({page})=>{
 await page.setViewportSize({width:1000,height:700});await page.setContent(aula.bugCode);
 expect(await colunas(page,'.cartao')).toBe(1);
 await page.setContent(aula.solution);
 for(const [largura,esperadas] of [[479,1],[480,2],[481,2]]) {
  await page.locator('#painel').evaluate((elemento,largura)=>(elemento as HTMLElement).style.inlineSize=largura+'px',largura);
  expect(await colunas(page,'.cartao')).toBe(esperadas);
 }
});

test('CSS: nome da condição e referência cqi usam contextos independentes',async({page})=>{
 await page.setViewportSize({width:1000,height:700});await page.setContent(aula.practices[0].solution);
 const indicador=()=>page.locator('#estado').evaluate(elemento=>getComputedStyle(elemento,'::after').content);
 expect(await indicador()).toBe('"amplo"');await expect(page.locator('#titulo')).toHaveCSS('font-size','22px');
 await page.locator('#painel').evaluate(elemento=>(elemento as HTMLElement).style.inlineSize='480px');
 expect(await indicador()).toBe('"compacto"');await expect(page.locator('#titulo')).toHaveCSS('font-size','16px');
 await page.locator('#painel').evaluate(elemento=>(elemento as HTMLElement).style.inlineSize='600px');
 await page.locator('#coluna').evaluate(elemento=>(elemento as HTMLElement).style.inlineSize='300px');
 expect(await indicador()).toBe('"amplo"');await expect(page.locator('#titulo')).toHaveCSS('font-size','30px');
});

test('CSS: base, conteúdo longo e ordem de foco sobrevivem ao contexto estreito',async({page})=>{
 await page.setViewportSize({width:1000,height:700});await page.setContent(aula.practices[1].solution);
 for(const [largura,esperadas] of [[479,1],[480,2],[481,2]]) {
  await page.locator('#painel').evaluate((elemento,largura)=>(elemento as HTMLElement).style.inlineSize=largura+'px',largura);
  expect(await colunas(page,'.cartao')).toBe(esperadas);
 }
 for(const largura of [220,375,1000,4000]) {
  await page.setViewportSize({width:largura,height:700});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await expect(page.locator('#primeiro')).toBeVisible();await expect(page.locator('#segundo')).toBeVisible();
 }
 await page.locator('#primeiro').focus();await page.keyboard.press('Tab');await expect(page.locator('#segundo')).toBeFocused();
 await page.evaluate(()=>{
  const folha=document.querySelector('style')!.sheet!;
  for(let indice=folha.cssRules.length-1;indice>=0;indice--)if(folha.cssRules[indice] instanceof CSSSupportsRule)folha.deleteRule(indice);
 });
 expect(await colunas(page,'.cartao')).toBe(1);
 await expect(page.locator('#primeiro')).toBeVisible();await expect(page.locator('#segundo')).toBeVisible();
});

test('CSS: pausas conservam correção, assistência e retomada offline',async({page,context})=>{
 await page.goto('/');
 await expect(page.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await context.setOffline(true);
 try {
  await page.goto('/#/aula/css-containers-contexto');
  await expect(page.locator('.lesson-chapter')).toHaveCount(17);await expect(page.locator('[data-inline-practice]')).toHaveCount(3);
  const prever=page.locator('[data-practice="css-prever-contexto"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('amplo\n60');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('Investigue separadamente');
  await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('amplo\n22');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const depurar=page.locator('[data-practice="css-corrigir-ancestral"]');
  await depurar.getByLabel('Criar uma região ancestral com container-type e deixar o cartão como descendente.',{exact:true}).check();
  await depurar.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(depurar.locator('.practice-feedback')).toContainText('não houve execução de css');
  const limite=page.locator('[data-practice="css-completar-limite"]');
  await limite.getByLabel('Trecho que falta').fill('min-width:480px');
  await limite.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(limite.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await limite.getByRole('button',{name:'Consultar solução',exact:true}).click();
  const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.adaptive.skills['css.componentes.contexto'].evidence['css-prever-contexto'].firstTry).toBe(false);
  expect(salvo.practiceAnswers['css-completar-limite'].assisted).toBe(true);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-practice="css-prever-contexto"] textarea')).toHaveValue('amplo\n22');
  await expect(page.locator('[data-practice="css-corrigir-ancestral"] input[value="envolver"]')).toBeChecked();
  await expect(page.locator('[data-practice="css-completar-limite"] input[name="answer"]')).toHaveValue('min-width:480px');
 } finally {await context.setOffline(false);}
});
