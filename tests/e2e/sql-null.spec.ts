import {test,expect} from '@playwright/test';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {buildDailySession,freshAdaptive} from '../../src/learning/adaptive';

test('SQL: plano antigo mostra os capítulos necessários sem apagar leitura ou fabricar domínio',async({page:pagina})=>{
 await pagina.goto('/#/diaria');
 await expect(pagina.locator('[data-seen]')).toBeVisible();
 const clock=await pagina.evaluate(()=>({now:Date.now(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone}));
 const preparacao=adaptiveCatalog.activities.find(atividade=>atividade.id===idPreparacao('sql-null-logica'))!;
 const antigo=preparacao.requiredConcepts![0];
 const estado=freshAdaptive();estado.seenConcepts=[antigo];
 const ids=['sql-prever-desconhecido','sql-corrigir-obrigatoriedade','sql-correlacionar-ausentes'];
 const catalogoAntigo={...adaptiveCatalog,preferredLanguage:'sql',activities:adaptiveCatalog.activities.filter(atividade=>atividade.id===antigo||ids.includes(atividade.id)).map(atividade=>ids.includes(atividade.id)?{...atividade,requiredConcepts:[antigo]}:atividade)};
 estado.daily=buildDailySession(estado,catalogoAntigo,clock);
 expect(estado.daily.items.map(item=>item.kind)).toEqual(['practice','practice','challenge']);
 await pagina.evaluate(estado=>{
  const salvo=JSON.parse(localStorage.getItem('codelab.progress.v2')!);
  salvo.learningLanguage='sql';salvo.adaptive=estado;
  localStorage.setItem('codelab.progress.v2',JSON.stringify(salvo));
 },estado);
 await pagina.goto('/?retomada-preparacao=1#/diaria');
 const leitura=pagina.locator('[data-current]');
 await expect(leitura.getByRole('heading',{name:'Restrições têm sua própria regra de aceitação',exact:true})).toBeVisible();
 await expect(leitura.getByRole('heading',{name:'Agregações e exclusões exigem atenção à ausência',exact:true})).toBeVisible();
 await expect(leitura).toContainText('IS NOT DISTINCT FROM');
 await expect(leitura.locator('[data-practice]')).toHaveCount(0);
 await expect(leitura.getByRole('heading',{name:'Solução de referência',exact:true})).toHaveCount(0);
 await pagina.getByRole('button',{name:'Concluir leitura e praticar',exact:true}).click();
 await expect(pagina.locator('[data-practice="sql-corrigir-obrigatoriedade"]')).toBeVisible();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.adaptive.daily).toEqual(estado.daily);
 expect(salvo.adaptive.seenConcepts).toEqual([antigo,preparacao.id]);
 expect(salvo.adaptive.skills).toEqual({});
 await pagina.reload();
 await expect(pagina.locator('[data-practice="sql-corrigir-obrigatoriedade"]')).toBeVisible();
 await expect(pagina.locator('[data-seen]')).toHaveCount(0);
});

test('SQL: ausência e contratos retomam offline sem fingir execução de consultas',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',requisicao=>{if(/\/api\/(executions|execute|run|submissions)/.test(requisicao.url()))execucoes.push(requisicao.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/sql-null-logica');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(17);
  const previsao=pagina.locator('[data-practice="sql-prever-desconhecido"]');
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill('1|true\n2|false\n3|true');
  await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(previsao.locator('.practice-feedback')).toContainText('desconhecido');
  await expect(previsao.locator('[data-help] pre')).toHaveCount(0);
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill('1|unknown\n2|false\n3|true');
  await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(previsao.locator('.practice-feedback')).toContainText('não houve execução de sql');
  const restricao=pagina.locator('[data-practice="sql-corrigir-obrigatoriedade"]');
  await restricao.locator('input[value="substituir-ausencia"]').check();
  await restricao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(restricao.locator('.practice-feedback')).toContainText('CHECK aceita');
  await restricao.locator('input[value="presenca-faixa"]').check();
  await restricao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(restricao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const exclusao=pagina.locator('[data-practice="sql-correlacionar-ausentes"]');
  await exclusao.getByLabel('Trecho que falta').fill('=');
  await exclusao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(exclusao.locator('.practice-feedback')).toContainText('duas ausências');
  await exclusao.getByLabel('Trecho que falta').fill('is not distinct from');
  await exclusao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(exclusao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await exclusao.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(exclusao.locator('.practice-feedback')).toContainText('registrada como assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(previsao.locator('textarea')).toHaveValue('1|unknown\n2|false\n3|true');
  await expect(restricao.locator('input[value="presenca-faixa"]')).toBeChecked();
  await expect(exclusao.locator('input[name="answer"]')).toHaveValue('is not distinct from');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['sql-correlacionar-ausentes'].assisted).toBe(true);
  expect(salvo.adaptive.skills['sql.null.comparacoes'].evidence['sql-prever-desconhecido'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(previsao).toBeVisible();await expect(restricao).toBeVisible();await expect(exclusao).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
