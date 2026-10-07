import {test,expect} from '@playwright/test';
test('Python: três pausas offline conferem consumo, ordem e posse sem executar o aluno',async({page,context})=>{
 test.setTimeout(90000);
 const external:string[]=[];
 page.on('request',request=>{if(/\/api\/(execute|run|submissions)/.test(request.url()))external.push(request.url());});
 await page.goto('/');
 await expect(page.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await context.setOffline(true);
 try{
  await page.goto('/#/aula/py-iteracao-recursos');
  await expect(page.locator('.lesson-chapter')).toHaveCount(17);
  await expect(page.locator('[data-inline-practice]')).toHaveCount(3);
  const prediction=page.locator('#aula-contexto [data-practice="py-prever-esgotamento"]');
  await prediction.getByLabel('Saída prevista, uma linha por saída').fill('0\n[0, 1, 2]\n[]');
  await prediction.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prediction.locator('.practice-feedback')).toContainText('cursor não reinicia');
  await expect(prediction.locator('[data-help] pre')).toHaveCount(0);
  await prediction.getByLabel('Saída prevista, uma linha por saída').fill('0\n[1, 2]\n[]');
  await prediction.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prediction.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await expect(prediction.locator('.practice-feedback')).toContainText('não houve execução de python');
  const order=page.locator('#aula-teoria-2 [data-practice="py-ordenar-lote"]');
  await expect(order).toBeVisible();
  for(const [line,moves] of [[3,2],[4,2],[4,1]]){
   for(let n=0;n<moves;n++)await order.getByRole('button',{name:'Mover linha '+(line-n)+' para cima',exact:true}).click();
  }
  await order.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(order.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const closing=page.locator('#aula-teoria-4 [data-practice="py-fechar-consumo"]');
  await closing.getByLabel('for item in fonte: processar(item); break',{exact:true}).check();
  await closing.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(closing.locator('.practice-feedback')).toContainText('break não chama close');
  await closing.getByLabel('with closing(fonte) as origem: processar(next(origem))',{exact:true}).check();
  await closing.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(closing.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const prior=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(prior.adaptive.skills['python.iteradores.consumo'].evidence['py-prever-esgotamento'].firstTry).toBe(false);
  expect(prior.practiceAnswers['py-ordenar-lote'].value).toEqual(['declarar','cursor','consumir','retornar']);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-practice="py-prever-esgotamento"] textarea')).toHaveValue('0\n[1, 2]\n[]');
  await expect(page.locator('[data-practice="py-fechar-consumo"] input[value="closing"]')).toBeChecked();
  await page.getByLabel('Somente os elementos restantes; o cursor não reinicia para recuperar o item já consumido.',{exact:true}).check();
  await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
  await expect(page.locator('#lesson-feedback')).toContainText('aula foi concluída');
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('#lesson-feedback')).toContainText('já concluída');
  expect(external).toEqual([]);
 }finally{await context.setOffline(false);}
});
