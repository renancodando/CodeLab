import {test,expect} from '@playwright/test';
import {getPracticeSolution} from '../../src/learning/practice';
test('JavaScript: propriedades e depuração executada retomam offline',async({page,context})=>{
 test.setTimeout(120000);const external:string[]=[];
 page.on('request',r=>{if(/\/api\/(execute|run|submissions)/.test(r.url()))external.push(r.url());});
 await page.goto('/');await expect(page.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await context.setOffline(true);
 try{
  await page.goto('/#/aula/js-propriedades-prototipos');
  await expect(page.locator('.lesson-chapter')).toHaveCount(17);await expect(page.locator('[data-inline-practice]')).toHaveCount(3);
  const prediction=page.locator('#aula-contexto [data-practice="js-prever-propriedade"]');
  await prediction.getByLabel('Saída prevista, uma linha por saída').fill('true true\nbase');
  await prediction.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prediction.locator('.practice-feedback')).toContainText('não possui esse campo');
  await prediction.getByLabel('Saída prevista, uma linha por saída').fill('false true\nbase');
  await prediction.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prediction.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const descriptor=page.locator('#aula-teoria-2 [data-practice="js-descritor-sem-getter"]');
  await descriptor.getByLabel('Object.getOwnPropertyDescriptor(entrada, "nome")',{exact:true}).check();
  await descriptor.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(descriptor.locator('.practice-feedback')).toContainText('não houve execução de javascript');
  const debug=page.locator('#aula-teoria-4 [data-practice="js-debug-numero-proprio"]');
  await debug.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(debug.locator('.practice-feedback')).toContainText('herança',{timeout:20000});
  await expect(debug.locator('[data-help] pre')).toHaveCount(0);
  await debug.getByLabel('Seu código corrigido').fill(getPracticeSolution('js-debug-numero-proprio')!);
  await debug.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(debug.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
  const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(state.practiceAnswers['js-debug-numero-proprio'].passed).toBe(true);
  expect(state.adaptive.skills['javascript.objetos.validacao'].evidence['js-debug-numero-proprio'].firstTry).toBe(false);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-practice="js-debug-numero-proprio"] textarea')).toHaveValue(getPracticeSolution('js-debug-numero-proprio')!);
  await page.getByLabel('Consultar o descritor próprio, exigir value numérico finito e retornar esse valor.',{exact:true}).check();
  await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();await expect(page.locator('#lesson-feedback')).toContainText('aula foi concluída');
  await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('#lesson-feedback')).toContainText('já concluída');expect(external).toEqual([]);
 }finally{await context.setOffline(false);}
});
