import {test,expect} from '@playwright/test';

test('C#: iteradores conservam tentativas, assistência e decisões offline',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))execucoes.push(pedido.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/cs-iteradores-descarte');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(17);
  const prever=pagina.locator('[data-practice="cs-prever-percurso"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('0\nTrue\n1|1\nTrue\n2|2\n3');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('terceiro elemento');
  await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('0\nTrue\n1|1\nTrue\n2|2\n2');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('não houve execução de csharp');
  const descarte=pagina.locator('[data-practice="cs-descartar-percurso"]');
  await descarte.locator('input[value="continuar"]').check();
  await descarte.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(descarte.locator('.practice-feedback')).toContainText('Processar falha');
  await expect(descarte.locator('[data-help] pre')).toHaveCount(0);
  await descarte.locator('input[value="delimitar"]').check();
  await descarte.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(descarte.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const guardar=pagina.locator('[data-practice="cs-materializar-consulta"]');
  await guardar.getByLabel('Trecho que falta').fill('AsEnumerable()');
  await guardar.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(guardar.locator('.practice-feedback')).toContainText('segunda enumeração');
  await guardar.getByLabel('Trecho que falta').fill('ToList ( )');
  await guardar.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(guardar.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await guardar.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(guardar.locator('.practice-feedback')).toContainText('assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(prever.locator('textarea')).toHaveValue('0\nTrue\n1|1\nTrue\n2|2\n2');
  await expect(descarte.locator('input[value="delimitar"]')).toBeChecked();
  await expect(guardar.locator('input[name="answer"]')).toHaveValue('ToList ( )');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['cs-materializar-consulta'].assisted).toBe(true);
  expect(salvo.adaptive.skills['csharp.iteradores.descarte'].evidence['cs-descartar-percurso'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(prever).toBeVisible();await expect(descarte).toBeVisible();await expect(guardar).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
