import {test,expect} from '@playwright/test';

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
