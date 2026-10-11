import {test,expect} from '@playwright/test';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

test('HTML: o navegador confirma presença, multiplicidade e recuperação da validade',async({page:pagina})=>{
 const atividade=practiceActivities.find(a=>a.id==='html-prever-controles')!;await pagina.setContent(atividade.code!);
 expect(await pagina.evaluate(()=>{const dados=new FormData(document.querySelector('form')!);return[String(dados.get('fixo')),String(dados.get('off')),dados.getAll('linguagem').join(',')].join('\n');})).toBe(getPracticeSolution(atividade.id));
 expect(await pagina.evaluate(()=>{const f=document.querySelector('form')!;return{escalar:Object.fromEntries(new FormData(f)).linguagem,primeiro:new FormData(f).get('linguagem')};})).toEqual({escalar:'css',primeiro:'html'});
 const escolhas=pagina.locator('input[type=checkbox]');await escolhas.nth(1).uncheck();expect(await pagina.evaluate(()=>new FormData(document.querySelector('form')!).getAll('linguagem'))).toEqual(['html']);await escolhas.nth(0).uncheck();expect(await pagina.evaluate(()=>new FormData(document.querySelector('form')!).getAll('linguagem'))).toEqual([]);
 expect(await pagina.evaluate(()=>[new FormData(document.querySelector('form')!).get('linguagem')])).toEqual([null]);
 const validade=practiceActivities.find(a=>a.id==='html-limpar-validacao')!;await pagina.setContent(validade.code!.replace('____',getPracticeSolution(validade.id)!));
 const campo=pagina.getByLabel('Apelido');
 for(const [valor,valido] of [['A',false],['Ana',true],['   ',false],[' Bia ',true],['',false]] as const){await campo.fill(valor);expect(await campo.evaluate(elemento=>(elemento as HTMLInputElement).checkValidity())).toBe(valido);}
 await campo.fill('Ana');expect(await campo.evaluate(elemento=>(elemento as HTMLInputElement).validity.customError)).toBe(false);
 await campo.evaluate(elemento=>{const entrada=elemento as HTMLInputElement;entrada.setCustomValidity('erro anterior');entrada.value='Bia';});expect(await campo.evaluate(elemento=>(elemento as HTMLInputElement).checkValidity())).toBe(false);
});

test('HTML: novas pausas conservam tentativas, assistência e revisão offline',async({page:pagina,context:contexto})=>{
 test.setTimeout(120000);await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/html-dados-formulario');
  const prever=pagina.locator('[data-practice="html-prever-controles"]');await prever.getByLabel('Saída prevista, uma linha por saída').fill('A\nB\nhtml,css');await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(prever.locator('.practice-feedback')).toContainText('presença de disabled');await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('A\nnull\nhtml,css');await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(prever.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const colecao=pagina.locator('[data-practice="html-preservar-selecoes"]');await colecao.locator('input[value=primeiro]').check();await colecao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(colecao.locator('.practice-feedback')).toContainText('multiplicidade');await colecao.locator('input[value=colecao]').check();await colecao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(colecao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const limpar=pagina.locator('[data-practice="html-limpar-validacao"]');await limpar.getByLabel('Trecho que falta').fill("' '");await limpar.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(limpar.locator('.practice-feedback')).toContainText('customError');await limpar.getByLabel('Trecho que falta').fill("''");await limpar.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(limpar.locator('.practice-feedback')).toContainText('Sua resposta está correta');await limpar.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(limpar.locator('.practice-feedback')).toContainText('assistência');
  await pagina.reload();await expect(prever.locator('textarea')).toHaveValue('A\nnull\nhtml,css');await expect(colecao.locator('input[value=colecao]')).toBeChecked();await expect(limpar.locator('input[name=answer]')).toHaveValue("''");
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['html-limpar-validacao'].assisted).toBe(true);expect(salvo.adaptive.skills['html.formularios.presenca'].evidence['html-prever-controles'].firstTry).toBe(false);
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(prever).toBeVisible();await expect(colecao).toBeVisible();await expect(limpar).toBeVisible();}
 }finally{await contexto.setOffline(false);}
});
