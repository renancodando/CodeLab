import {test,expect} from '@playwright/test';

test('Python: testes que detectam defeitos conservam evidência offline',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))execucoes.push(pedido.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/py-engenharia');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(13);
  const prever=pagina.locator('[data-practice="py-prever-anotacao"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('6\n6');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('outra etapa');
  await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('6\n33');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('não houve execução de python');
  const verificacao=pagina.locator('[data-practice="py-testar-excecao-vazia"]');
  await verificacao.locator('input[value="sem-chamada"]').check();
  await verificacao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(verificacao.locator('.practice-feedback')).toContainText('codifica o erro');
  await expect(verificacao.locator('[data-help] pre')).toHaveCount(0);
  await verificacao.locator('input[value="contexto"]').check();
  await verificacao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(verificacao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const indice=pagina.locator('[data-practice="py-preservar-primeira-ordem"]');
  await indice.getByLabel('Trecho que falta').fill('valor in vistos');
  await indice.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(indice.locator('.practice-feedback')).toContainText('ordem solicitada');
  await indice.getByLabel('Trecho que falta').fill('not (valor in vistos)');
  await indice.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(indice.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await indice.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(indice.locator('.practice-feedback')).toContainText('assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(prever.locator('textarea')).toHaveValue('6\n33');
  await expect(verificacao.locator('input[value="contexto"]')).toBeChecked();
  await expect(indice.locator('input[name="answer"]')).toHaveValue('not (valor in vistos)');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['py-preservar-primeira-ordem'].assisted).toBe(true);
  expect(salvo.adaptive.skills['python.engenharia.testes'].evidence['py-testar-excecao-vazia'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(prever).toBeVisible();await expect(verificacao).toBeVisible();await expect(indice).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
