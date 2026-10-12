import {test,expect} from '@playwright/test';

test('Python: cancelamento e filas conservam progresso offline',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))execucoes.push(pedido.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/py-concorrencia');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(13);
  const prever=pagina.locator('[data-practice="py-prever-corrotina"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill("['executou']\n4\n['executou']");
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('não agenda');
  await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill("[]\n4\n['executou']");
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('não houve execução de python');
  const cancelamento=pagina.locator('[data-practice="py-propagar-cancelamento"]');
  await cancelamento.locator('input[value="ignorar"]').check();
  await cancelamento.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(cancelamento.locator('.practice-feedback')).toContainText('término normal');
  await expect(cancelamento.locator('[data-help] pre')).toHaveCount(0);
  await cancelamento.locator('input[value="propagar"]').check();
  await cancelamento.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(cancelamento.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const envio=pagina.locator('[data-practice="py-esperar-vaga-fila"]');
  await envio.getByLabel('Trecho que falta').fill('fila.put_nowait(item)');
  await envio.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(envio.locator('.practice-feedback')).toContainText('esperar a vaga');
  await envio.getByLabel('Trecho que falta').fill('await fila.put(item)');
  await envio.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(envio.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await envio.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(envio.locator('.practice-feedback')).toContainText('assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(prever.locator('textarea')).toHaveValue("[]\n4\n['executou']");
  await expect(cancelamento.locator('input[value="propagar"]')).toBeChecked();
  await expect(envio.locator('input[name="answer"]')).toHaveValue('await fila.put(item)');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['py-esperar-vaga-fila'].assisted).toBe(true);
  expect(salvo.adaptive.skills['python.concorrencia.cancelamento'].evidence['py-propagar-cancelamento'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(prever).toBeVisible();await expect(cancelamento).toBeVisible();await expect(envio).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
