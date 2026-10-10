import {test,expect} from '@playwright/test';

test('Python: descritores conservam decisões, assistência e respostas offline',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))execucoes.push(pedido.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/py-objetos-protocolos');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(13);
  const prever=pagina.locator('[data-practice="py-prever-atributo"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('guardado\n99\nTrue');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('precedência');
  await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('guardado\n10\nTrue');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('não houve execução de python');
  const isolamento=pagina.locator('[data-practice="py-isolar-descritor"]');
  await isolamento.locator('input[value="reatribuir"]').check();
  await isolamento.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(isolamento.locator('.practice-feedback')).toContainText('armazenamento próprio');
  await expect(isolamento.locator('[data-help] pre')).toHaveCount(0);
  await isolamento.locator('input[value="separar"]').check();
  await isolamento.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(isolamento.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const guarda=pagina.locator('[data-practice="py-acessar-classe"]');
  await guarda.getByLabel('Trecho que falta').fill('not instancia');
  await guarda.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(guarda.locator('.practice-feedback')).toContainText('redefinir igualdade');
  await guarda.getByLabel('Trecho que falta').fill('None is instancia');
  await guarda.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(guarda.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await guarda.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(guarda.locator('.practice-feedback')).toContainText('assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(prever.locator('textarea')).toHaveValue('guardado\n10\nTrue');
  await expect(isolamento.locator('input[value="separar"]')).toBeChecked();
  await expect(guarda.locator('input[name="answer"]')).toHaveValue('None is instancia');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['py-acessar-classe'].assisted).toBe(true);
  expect(salvo.adaptive.skills['python.descritores.armazenamento'].evidence['py-isolar-descritor'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(prever).toBeVisible();await expect(isolamento).toBeVisible();await expect(guarda).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
