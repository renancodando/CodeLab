import {test, expect, type Page, type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const codigo = (id:string) => practiceActivities.find(item => item.id === id)!.code!;
async function documento(pagina:Page, conteudo:string) {
 await pagina.route('**/referencia-css.html', rota => rota.fulfill({contentType:'text/html', body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência CSS</title></head><body><main><h1>Referência de cálculo</h1>' + conteudo + '</main></body></html>'}));
 await pagina.goto('/referencia-css.html');
}
async function conferir(pausa:Locator) {
 await pausa.getByRole('button', {name:'Conferir comportamento', exact:true}).click();
}

test('CSS nativo: especificidade, ordem e token inválido têm efeitos diferentes', async ({page:pagina}) => {
 await documento(pagina, codigo('css-prever-seletores'));
 const tamanhos = () => pagina.locator('p.aviso').evaluateAll(elementos => elementos.map(item => getComputedStyle(item).fontSize));
 expect((await tamanhos()).join('\n')).toBe(getPracticeSolution('css-prever-seletores'));
 await documento(pagina, codigo('css-prever-seletores').replace('.aviso { font-size: 22px; }\n.aviso { font-size: 24px; }', '.aviso { font-size: 24px; }\n.aviso { font-size: 22px; }'));
 expect(await tamanhos()).toEqual(['18px', '22px']);
 const defeito = codigo('css-diagnosticar-token');
 const espacos = () => pagina.locator('.cartao').evaluate(item => {const estilo = getComputedStyle(item); return [estilo.paddingTop, estilo.paddingRight, estilo.paddingBottom, estilo.paddingLeft];});
 for (const tentativa of [defeito, defeito.replace('var(--espaco, 12px)', 'var(--espaco, 20px)'), defeito.replace('padding: var', 'padding: 12px; padding: var')]) {
  await documento(pagina, tentativa);
  expect(await espacos()).toEqual(['0px', '0px', '0px', '0px']);
 }
 await documento(pagina, getPracticeSolution('css-diagnosticar-token')!);
 expect(await espacos()).toEqual(['12px', '12px', '12px', '12px']);
 await documento(pagina, defeito.replace('--espaco: red;', ''));
 expect(await espacos()).toEqual(['12px', '12px', '12px', '12px']);
 await documento(pagina, defeito.replace('--espaco: red;', '--espaco: 0;'));
 expect(await espacos()).toEqual(['0px', '0px', '0px', '0px']);
});

test('CSS nativo: referências de unidade, entrelinha e herança reagem a mudanças independentes', async ({page:pagina}) => {
 await documento(pagina, codigo('css-prever-unidades'));
 const larguras = () => pagina.locator('.caixa').evaluateAll(elementos => elementos.map(item => getComputedStyle(item).width));
 expect((await larguras()).join('\n')).toBe(getPracticeSolution('css-prever-unidades'));
 for (const tamanho of [16, 26, 44]) {
  await pagina.evaluate(valor => document.documentElement.style.fontSize = valor + 'px', tamanho);
  expect(await larguras()).toEqual([tamanho * 2 + 'px', '60px']);
 }
 const defeito = codigo('css-diagnosticar-entrelinha');
 for (const tentativa of [defeito, defeito.replace('1.5em', '150%'), defeito.replace('1.5em', '24px')]) {
  await documento(pagina, tentativa);
  expect(await pagina.locator('.titulo').evaluate(item => getComputedStyle(item).lineHeight)).toBe('24px');
 }
 await documento(pagina, getPracticeSolution('css-diagnosticar-entrelinha')!);
 for (const [pai, filho] of [[16,32], [20,40], [14,28]]) {
  await pagina.locator('.painel').evaluate((item, fonte) => (item as HTMLElement).style.fontSize = fonte + 'px', pai);
  await pagina.locator('.titulo').evaluate((item, fonte) => (item as HTMLElement).style.fontSize = fonte + 'px', filho);
  expect(await pagina.locator('.titulo').evaluate(item => getComputedStyle(item).lineHeight)).toBe(filho * 1.5 + 'px');
 }
 const molde = codigo('css-herdar-caixa');
 await documento(pagina, molde.replace('____', getPracticeSolution('css-herdar-caixa')!));
 await expect(pagina.locator('.caixa')).toHaveCSS('box-sizing', 'content-box');
 expect(await pagina.locator('.caixa').evaluate(item => item.getBoundingClientRect().width)).toBe(124);
 expect(await pagina.locator('.painel').evaluate(item => getComputedStyle(item, '::before').boxSizing)).toBe('content-box');
 await pagina.locator('.painel').evaluate(item => (item as HTMLElement).style.boxSizing = 'border-box');
 expect(await pagina.locator('.caixa').evaluate(item => item.getBoundingClientRect().width)).toBe(100);
 expect(await pagina.locator('.painel').evaluate(item => getComputedStyle(item, '::before').boxSizing)).toBe('border-box');
 await documento(pagina, molde.replace('____', 'border-box'));
 expect(await pagina.locator('.caixa').evaluate(item => item.getBoundingClientRect().width)).toBe(100);
});

for (const caso of [
 {aula:'cascata', quantidade:2, previsao:'css-prever-seletores', errada:'24px\n24px', certa:'18px\n24px', diagnostico:'css-diagnosticar-token', opcaoErrada:'fallback', opcaoCerta:'comprimento', falha:'token red está presente', habilidade:'css.cascata.tokens', projeto:'sistema de tokens'},
 {aula:'box-model', quantidade:3, previsao:'css-prever-unidades', errada:'60px\n60px', certa:'40px\n60px', diagnostico:'css-diagnosticar-entrelinha', opcaoErrada:'percentual', opcaoCerta:'fator', falha:'comprimento calculado', habilidade:'css.tipografia.entrelinha', projeto:'cartão editorial'}
]) test('CSS praticado: ' + caso.aula + ' conserva tentativas, assistência e projeto', async ({page:pagina}) => {
 await pagina.goto('/#/aula/' + caso.aula);
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);
 await expect(pagina.locator('[data-inline-practice]')).toHaveCount(caso.quantidade);
 expect(await pagina.evaluate(() => JSON.parse(localStorage.getItem('codelab.progress.v2') ?? 'null')?.adaptive?.skills ?? {})).toEqual({});
 const previsao = pagina.locator('[data-practice="' + caso.previsao + '"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill(caso.errada);
 await conferir(previsao);
 await expect(previsao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
 await expect(previsao.locator('[data-help] pre')).toHaveCount(0);
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill(caso.certa);
 await conferir(previsao);
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico = pagina.locator('[data-practice="' + caso.diagnostico + '"]');
 await diagnostico.locator('input[value="' + caso.opcaoErrada + '"]').check();
 await conferir(diagnostico);
 await expect(diagnostico.locator('.practice-feedback')).toContainText(caso.falha);
 await diagnostico.locator('input[value="' + caso.opcaoCerta + '"]').check();
 await conferir(diagnostico);
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 if (caso.aula === 'box-model') {
  const heranca = pagina.locator('[data-practice="css-herdar-caixa"]');
  await heranca.getByLabel('Trecho que falta').fill('border-box');
  await conferir(heranca);
  await expect(heranca.locator('.practice-feedback')).toContainText('mudanças do pai');
  await heranca.getByLabel('Trecho que falta').fill('InHeRiT');
  await conferir(heranca);
  await expect(heranca.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 }
 const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.adaptive.skills[caso.habilidade].evidence[caso.diagnostico].firstTry).toBe(false);
 await diagnostico.getByRole('button', {name:'Consultar solução', exact:true}).click();
 await pagina.reload();
 const retomado = await pagina.evaluate(() => JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(retomado.practiceAnswers[caso.diagnostico].assisted).toBe(true);
 expect(retomado.adaptive.skills[caso.habilidade].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('#aula-projeto')).toContainText(caso.projeto);
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for (const largura of [220,4000]) {
  await pagina.setViewportSize({width:largura, height:812});
  await expect.poll(() => pagina.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
 }
});

test('CSS offline conserva uma alteração conceitual sem executar código livre', async ({page:pagina, context:contexto}) => {
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.', {timeout:45000});
 await pagina.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try {
  await pagina.goto('/#/aula/box-model');
  const pausa = pagina.locator('[data-practice="css-herdar-caixa"]');
  await pausa.getByLabel('Trecho que falta').fill('INHERIT');
  await conferir(pausa);
  await expect(pausa.locator('.practice-feedback')).toContainText('não houve execução de css');
  await pagina.reload();
  await expect(pausa.getByLabel('Trecho que falta')).toHaveValue('INHERIT');
  const salvo = await pagina.evaluate(() => JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['css-herdar-caixa']).toMatchObject({passed:true, assisted:false});
 } finally {
  if (!pagina.isClosed()) await contexto.setOffline(false);
 }
});
