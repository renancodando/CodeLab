import {test,expect} from '@playwright/test';

test('Python: unidades e entrada ASCII funcionam offline sem fingir execução',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))execucoes.push(pedido.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/py-numeros-texto');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(17);
  const prever=pagina.locator('[data-practice="py-prever-piso-resto"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('-2 -1\nTrue');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('menos infinito');
  await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('-3 2\nTrue');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('não houve execução de python');
  const rateio=pagina.locator('[data-practice="py-conservar-centavos"]');
  await rateio.locator('input[value="ultima"]').check();
  await rateio.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(rateio.locator('.practice-feedback')).toContainText('diferença máxima');
  await expect(rateio.locator('[data-help] pre')).toHaveCount(0);
  await rateio.locator('input[value="resto"]').check();
  await rateio.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(rateio.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const entrada=pagina.locator('[data-practice="py-validar-digitos-ascii"]');
  await entrada.getByLabel('Trecho que falta').fill('caractere.isdigit()');
  await entrada.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(entrada.locator('.practice-feedback')).toContainText('ASCII');
  await entrada.getByLabel('Trecho que falta').fill("'0'<=caractere<='9'");
  await entrada.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(entrada.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await entrada.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(entrada.locator('.practice-feedback')).toContainText('assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(prever.locator('textarea')).toHaveValue('-3 2\nTrue');
  await expect(rateio.locator('input[value="resto"]')).toBeChecked();
  await expect(entrada.locator('input[name="answer"]')).toHaveValue("'0'<=caractere<='9'");
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['py-validar-digitos-ascii'].assisted).toBe(true);
  expect(salvo.adaptive.skills['python.numeros.conservacao'].evidence['py-conservar-centavos'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(prever).toBeVisible();await expect(rateio).toBeVisible();await expect(entrada).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
