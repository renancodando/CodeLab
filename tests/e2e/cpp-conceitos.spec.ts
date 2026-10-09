import {test,expect} from '@playwright/test';

test('C++20: requisitos, instanciação e sobrecargas retomam offline com assistência',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',requisicao=>{if(/\/api\/(executions|execute|run|submissions)/.test(requisicao.url()))execucoes.push(requisicao.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/cpp-templates');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(14);
  const requisito=pagina.locator('[data-practice="cpp-requisito-verdadeiro"]');
  await requisito.getByLabel('Trecho que falta').fill('std::integral<T>;');
  await requisito.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(requisito.locator('.practice-feedback')).toContainText('condição dependente de T');
  await expect(requisito.locator('[data-help] pre')).toHaveCount(0);
  await requisito.getByLabel('Trecho que falta').fill('requires std::integral<T>;');
  await requisito.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(requisito.locator('.practice-feedback')).toContainText('não houve execução de cpp');
  const ramo=pagina.locator('[data-practice="cpp-ramo-descartado"]');
  await ramo.getByLabel('Trecho que falta').fill('consteval');
  await ramo.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(ramo.locator('.practice-feedback')).toContainText('instanciação');
  await ramo.getByLabel('Trecho que falta').fill('constexpr');
  await ramo.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(ramo.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const sobrecarga=pagina.locator('[data-practice="cpp-prever-sobrecarga"]');
  await sobrecarga.getByLabel('Saída prevista, uma linha por saída').fill('fixo\nfixo');
  await sobrecarga.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(sobrecarga.locator('.practice-feedback')).toContainText('requisitos compartilhados');
  await sobrecarga.getByLabel('Saída prevista, uma linha por saída').fill('reserva\nfixo');
  await sobrecarga.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(sobrecarga.locator('.practice-feedback')).toContainText('sem execução de compilador');
  await sobrecarga.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(sobrecarga.locator('.practice-feedback')).toContainText('registrada como assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(requisito.locator('input[name="answer"]')).toHaveValue('requires std::integral<T>;');
  await expect(ramo.locator('input[name="answer"]')).toHaveValue('constexpr');
  await expect(sobrecarga.locator('textarea')).toHaveValue('reserva\nfixo');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['cpp-prever-sobrecarga'].assisted).toBe(true);
  expect(salvo.adaptive.skills['cpp.templates.requisitos'].evidence['cpp-requisito-verdadeiro'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(requisito).toBeVisible();await expect(ramo).toBeVisible();await expect(sobrecarga).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
