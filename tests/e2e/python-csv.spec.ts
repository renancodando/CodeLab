import {test,expect} from '@playwright/test';

test('Python CSV: previsão, cabeçalho e lote retomam offline sem execução remota',async({page:pagina,context:contexto})=>{
 const enviadas:string[]=[];
 pagina.on('request',requisicao=>{if(/\/api\/(executions|execute|run|submissions)/.test(requisicao.url()))enviadas.push(requisicao.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try {
  await pagina.goto('/#/aula/py-biblioteca-dados');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(15);
  const previsao=pagina.locator('[data-practice="py-csv-prever-registro"]');
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill('2\n2\n2');
  await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(previsao.locator('.practice-feedback')).toContainText('Contar campos');
  await expect(previsao.locator('[data-help] pre')).toHaveCount(0);
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill('2\n2\n3');
  await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(previsao.locator('.practice-feedback')).toContainText('não houve execução de python');
  const cabecalho=pagina.locator('[data-practice="py-csv-cabecalho"]');
  await cabecalho.getByLabel('Comparar somente set(leitor.fieldnames) com o conjunto dos nomes esperados.',{exact:true}).check();
  await cabecalho.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(cabecalho.locator('.practice-feedback')).toContainText('repetição nem ordem');
  await cabecalho.getByLabel('Comparar a sequência completa de fieldnames com os dois nomes esperados na ordem exigida.',{exact:true}).check();
  await cabecalho.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(cabecalho.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const lote=pagina.locator('[data-practice="py-csv-lote"]');
  await lote.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(lote.locator('.practice-feedback')).toContainText('destino');
  await lote.getByRole('button',{name:'Mover linha 6 para cima',exact:true}).click();
  await lote.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(lote.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await lote.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(lote.locator('.practice-feedback')).toContainText('registrada como assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(previsao.locator('textarea')).toHaveValue('2\n2\n3');
  await expect(cabecalho.locator('input[value="sequencia"]')).toBeChecked();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['py-csv-lote'].value).toEqual(['funcao','lote','percorrer','validar','acumular','gravar','retornar']);
  expect(salvo.practiceAnswers['py-csv-lote'].assisted).toBe(true);
  expect(salvo.adaptive.skills['python.csv.cabecalho'].evidence['py-csv-cabecalho'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(lote.locator('.practice-order li')).toHaveCount(7);
  }
  expect(enviadas).toEqual([]);
 } finally {await contexto.setOffline(false);}
});
