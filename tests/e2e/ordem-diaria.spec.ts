import {test,expect} from '@playwright/test';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {buildDailySession,freshAdaptive} from '../../src/learning/adaptive';

test('a sessão nova começa pelas instruções e conserva o plano antigo de valores offline',async({page:pagina,context:contexto})=>{
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await pagina.goto('/#/diaria');await expect(pagina.locator('[data-current] h2')).toHaveText('Programas, código e instruções');
 const inicial=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive);expect(inicial.skills).toEqual({});await contexto.setOffline(true);
 try{
  await pagina.reload();await expect(pagina.locator('[data-current] h2')).toHaveText('Programas, código e instruções');expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive.daily)).toEqual(inicial.daily);
  const conceito=adaptiveCatalog.activities.find(a=>a.lessonId==='programar'&&a.kind==='concept'&&a.preparacaoAteBloco===undefined)!;
  const preparado=freshAdaptive();preparado.seenConcepts=[conceito.id];
  await pagina.evaluate(estado=>{const salvo=JSON.parse(localStorage.getItem('codelab.progress.v2')!);salvo.adaptive=estado;localStorage.setItem('codelab.progress.v2',JSON.stringify(salvo));},preparado);
  await pagina.reload();await expect(pagina.locator('[data-current] h2')).toHaveText('Preparação: Programas, código e instruções');await pagina.getByRole('button',{name:'Concluir leitura e praticar',exact:true}).click();await expect(pagina.locator('[data-practice]')).toHaveCount(1);
  const depois=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive);expect(depois.seenConcepts).toContain(idPreparacao('programar'));expect(depois.skills).toEqual({});
  const relogio=await pagina.evaluate(()=>({now:Date.now(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone}));
  const anterior={...adaptiveCatalog,preferredLanguage:'javascript',activities:adaptiveCatalog.activities.filter(a=>!['programar','entrada-saida','passos','tipos-erros','investigar'].includes(a.lessonId??''))},estado=freshAdaptive();
  estado.daily=buildDailySession(estado,anterior,relogio);const primeiro=estado.daily.items.find(i=>i.kind==='concept')!;
  expect(adaptiveCatalog.activities.find(a=>a.id===primeiro.activityId)?.lessonId).toBe('valores');estado.daily.completed=[primeiro.id];estado.seenConcepts=[primeiro.activityId];
  await pagina.evaluate(estado=>{const salvo=JSON.parse(localStorage.getItem('codelab.progress.v2')!);salvo.adaptive=estado;localStorage.setItem('codelab.progress.v2',JSON.stringify(salvo));},estado);
  await pagina.reload();await expect(pagina.locator('[data-current]')).not.toBeEmpty();
  const retomado=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive);expect(retomado.daily).toEqual(estado.daily);expect(retomado.skills).toEqual({});expect(retomado.seenConcepts).toEqual(estado.seenConcepts);
 }finally{await contexto.setOffline(false);}
});
