import {test,expect} from '@playwright/test';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,learningDay} from '../../src/learning/adaptive';
import {planoValoresAnterior} from '../fixtures/plano-valores-anterior';

test('a sessão nova começa pelas instruções e conserva o plano antigo de valores offline',async({page:pagina,context:contexto})=>{
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await pagina.goto('/#/diaria');await expect(pagina.locator('[data-current] h2')).toHaveText('Preparação: Programas, código e instruções');
 const inicial=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive);expect(inicial.skills).toEqual({});await contexto.setOffline(true);
 try{
  await pagina.reload();await expect(pagina.locator('[data-current] h2')).toHaveText('Preparação: Programas, código e instruções');expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive.daily)).toEqual(inicial.daily);
  const conceito=adaptiveCatalog.activities.find(a=>a.lessonId==='programar'&&a.kind==='concept'&&a.preparacaoAteBloco===undefined)!;
  const preparado=freshAdaptive();preparado.seenConcepts=[conceito.id];
  await pagina.evaluate(estado=>{const salvo=JSON.parse(localStorage.getItem('codelab.progress.v2')!);salvo.adaptive=estado;localStorage.setItem('codelab.progress.v2',JSON.stringify(salvo));},preparado);
  await pagina.reload();await expect(pagina.locator('[data-current] h2')).toHaveText('Preparação: Programas, código e instruções');await pagina.getByRole('button',{name:'Concluir leitura e praticar',exact:true}).click();await expect(pagina.locator('[data-practice]')).toHaveCount(1);
  const depois=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive);expect(depois.seenConcepts).toContain(idPreparacao('programar'));expect(depois.skills).toEqual({});
  const relogio=await pagina.evaluate(()=>({now:Date.now(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone}));
  const estado=freshAdaptive();estado.daily=planoValoresAnterior(learningDay(relogio));const primeiro=estado.daily.items.find(i=>i.kind==='concept')!;
  expect(adaptiveCatalog.activities.find(a=>a.id===primeiro.activityId)?.lessonId).toBe('valores');estado.daily.completed=[primeiro.id];estado.seenConcepts=[primeiro.activityId];
  await pagina.evaluate(estado=>{const salvo=JSON.parse(localStorage.getItem('codelab.progress.v2')!);salvo.adaptive=estado;localStorage.setItem('codelab.progress.v2',JSON.stringify(salvo));},estado);
  await pagina.reload();await expect(pagina.locator('[data-current]')).not.toBeEmpty();
  const retomado=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive);expect(retomado.daily).toEqual(estado.daily);expect(retomado.skills).toEqual({});expect(retomado.seenConcepts).toEqual(estado.seenConcepts);
 }finally{await contexto.setOffline(false);}
});

test('a reconstrução na aula conclui a prática de um plano antigo sem substituir sua sequência',async({page:pagina})=>{
 await pagina.goto('/#/diaria');await expect(pagina.locator('[data-seen]')).toBeVisible();
 const relogio=await pagina.evaluate(()=>({now:Date.now(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone})),estado=freshAdaptive();
 const preparacao=adaptiveCatalog.activities.find(a=>a.id===idPreparacao('programar'))!;
 estado.seenConcepts=[preparacao.id,...preparacao.incluiConceitos!];
 estado.daily={day:learningDay(relogio),items:[{id:'inicio-reconstruir-roteiro',activityId:'inicio-reconstruir-roteiro',kind:'practice',minutes:3}],completed:[],totalMinutes:3};
 await pagina.evaluate(estado=>{const salvo=JSON.parse(localStorage.getItem('codelab.progress.v2')!);salvo.adaptive=estado;localStorage.setItem('codelab.progress.v2',JSON.stringify(salvo));},estado);
 await pagina.goto('/?plano-legado=1#/diaria');await expect(pagina.locator('[data-practice="inicio-reconstruir-roteiro"]')).toBeVisible();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive.daily)).toEqual(estado.daily);
 await pagina.goto('/#/aula/programar');const pausa=pagina.locator('[data-practice="inicio-reconstruir-roteiro"]');
 await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
 expect((await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive.daily)).completed).toEqual([]);
 await pausa.getByRole('button',{name:'Mover linha 1 para baixo'}).click();await pausa.getByRole('button',{name:'Mover linha 2 para baixo'}).click();await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await pagina.goto('/#/diaria');await expect(pagina.getByRole('heading',{name:'Sessão concluída',exact:true})).toBeVisible();await pagina.reload();await expect(pagina.getByRole('heading',{name:'Sessão concluída',exact:true})).toBeVisible();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive);expect(salvo.daily.items).toEqual(estado.daily.items);expect(salvo.daily.completed).toEqual(['inicio-reconstruir-roteiro']);
});
