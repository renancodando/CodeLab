import {test,expect} from '@playwright/test';

test('C++: posse e vida conservam decisões offline sem afirmar compilação',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))execucoes.push(pedido.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/cpp-memoria-posse');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(13);
  const movimento=pagina.locator('[data-practice="cpp-mover-constante"]');
  await movimento.locator('input[value="mover-valor"]').check();
  await movimento.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(movimento.locator('.practice-feedback')).toContainText('conserva const');
  await expect(movimento.locator('[data-help] pre')).toHaveCount(0);
  await movimento.locator('input[value="mutavel"]').check();
  await movimento.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(movimento.locator('.practice-feedback')).toContainText('não houve execução de cpp');
  const prever=pagina.locator('[data-practice="cpp-prever-posse-temporaria"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('true 7\ntrue false');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('outro dono');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('false 7\ntrue false');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const retorno=pagina.locator('[data-practice="cpp-devolver-texto-dono"]');
  await retorno.getByLabel('Trecho que falta').fill('std::string_view');
  await retorno.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(retorno.locator('.practice-feedback')).toContainText('válido e mutável');
  await expect(retorno.locator('[data-help] pre')).toHaveCount(0);
  await retorno.getByLabel('Trecho que falta').fill('std::string');
  await retorno.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(retorno.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await retorno.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(retorno.locator('.practice-feedback')).toContainText('assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(movimento.locator('input[value="mutavel"]')).toBeChecked();
  await expect(prever.locator('textarea')).toHaveValue('false 7\ntrue false');
  await expect(retorno.locator('input[name="answer"]')).toHaveValue('std::string');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['cpp-devolver-texto-dono'].assisted).toBe(true);
  expect(salvo.adaptive.skills['cpp.posse.movimento-const'].evidence['cpp-mover-constante'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(movimento).toBeVisible();await expect(prever).toBeVisible();await expect(retorno).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
