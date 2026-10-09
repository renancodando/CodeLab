import {test,expect} from '@playwright/test';

test('módulos TypeScript: resolução e efeitos retomam offline sem fingir compilação',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',requisicao=>{if(/\/api\/(executions|execute|run|submissions)/.test(requisicao.url()))execucoes.push(requisicao.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/ts-modulos-configuracao');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(14);
  const extensao=pagina.locator('[data-practice="ts-import-extensao"]');
  await extensao.getByLabel('Trecho que falta').fill('./calculo.ts');
  await extensao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(extensao.locator('.practice-feedback')).toContainText('JavaScript emitido');
  await expect(extensao.locator('[data-help] pre')).toHaveCount(0);
  await extensao.getByLabel('Trecho que falta').fill('./calculo.js');
  await extensao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(extensao.locator('.practice-feedback')).toContainText('não houve execução de typescript');
  const alias=pagina.locator('[data-practice="ts-alias-emitido"]');
  await alias.locator('input[value="declarar"]').check();
  await alias.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(alias.locator('.practice-feedback')).toContainText('não cria a resolução');
  await alias.locator('input[value="relativo"]').check();
  await alias.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(alias.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const efeito=pagina.locator('[data-practice="ts-import-tipo-efeito"]');
  await efeito.getByLabel('Saída prevista, uma linha por saída').fill('contratos\n2');
  await efeito.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(efeito.locator('.practice-feedback')).toContainText('apenas de tipo');
  await efeito.getByLabel('Saída prevista, uma linha por saída').fill('2');
  await efeito.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(efeito.locator('.practice-feedback')).toContainText('sem execução de compilador');
  await efeito.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(efeito.locator('.practice-feedback')).toContainText('registrada como assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(extensao.locator('input[name="answer"]')).toHaveValue('./calculo.js');
  await expect(alias.locator('input[value="relativo"]')).toBeChecked();
  await expect(efeito.locator('textarea')).toHaveValue('2');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['ts-import-tipo-efeito'].assisted).toBe(true);
  expect(salvo.adaptive.skills['typescript.modulos.resolucao-node'].evidence['ts-import-extensao'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(extensao).toBeVisible();await expect(alias).toBeVisible();await expect(efeito).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
