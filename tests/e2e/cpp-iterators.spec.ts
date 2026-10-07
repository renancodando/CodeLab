import {test,expect} from '@playwright/test';
test('C++: previsão, reconstrução e depuração retomam offline sem compilador',async({page,context})=>{
 test.setTimeout(90000);const external:string[]=[];
 page.on('request',request=>{if(/\/api\/(execute|run|submissions)/.test(request.url()))external.push(request.url());});
 await page.goto('/');await expect(page.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await context.setOffline(true);
 try{
  await page.goto('/#/aula/cpp-iteradores-invalidacao');
  await expect(page.locator('.lesson-chapter')).toHaveCount(17);await expect(page.locator('[data-inline-practice]')).toHaveCount(3);
  const prediction=page.locator('#aula-contexto [data-practice="cpp-prever-intervalo"]');
  await prediction.getByLabel('Saída prevista, uma linha por saída').fill('4,2');
  await prediction.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prediction.locator('.practice-feedback')).toContainText('segunda posição');
  await expect(prediction.locator('[data-help] pre')).toHaveCount(0);
  await prediction.getByLabel('Saída prevista, uma linha por saída').fill('6,2');
  await prediction.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prediction.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const order=page.locator('#aula-teoria-2 [data-practice="cpp-ordenar-erase"]');
  const expected=["for (auto it = dados.begin(); it != dados.end();) {","if (*it == 0) {","it = dados.erase(it);","} else {","++it;","} // fim do if","} // fim do for"];
  for(let target=0;target<expected.length;target++){
   let current=(await order.locator('li code').allTextContents()).map(s=>s.trim()).indexOf(expected[target]);
   expect(current).toBeGreaterThanOrEqual(target);
   while(current>target){
    await order.getByRole('button',{name:'Mover linha '+(current+1)+' para cima',exact:true}).click();
    current--;
   }
  }
  await order.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(order.locator('.practice-feedback')).toContainText('não houve execução de cpp');
  const reserve=page.locator('#aula-teoria-4 [data-practice="cpp-reobter-reserva"]');
  await reserve.getByLabel('Obter o valor novamente com dados.at(indice) depois de reserve.',{exact:true}).check();
  await reserve.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(reserve.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(saved.adaptive.skills['cpp.vector.iteracao'].evidence['cpp-prever-intervalo'].firstTry).toBe(false);
  expect(saved.practiceAnswers['cpp-ordenar-erase'].value).toEqual(['for','testar','apagar','senao','avancar','fimif','fimfor']);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-practice="cpp-prever-intervalo"] textarea')).toHaveValue('6,2');
  await expect(page.locator('[data-practice="cpp-reobter-reserva"] input[value="reobter"]')).toBeChecked();
  expect((await page.locator('[data-practice="cpp-ordenar-erase"] li code').allTextContents()).map(s=>s.trim())).toEqual(expected);
  await page.getByLabel('Atribuir o iterador devolvido por erase e só incrementar na etapa que preserva o elemento.',{exact:true}).check();
  await page.getByRole('button',{name:'Conferir resposta',exact:true}).click();
  await expect(page.locator('#lesson-feedback')).toContainText('aula foi concluída');
  await page.reload({waitUntil:'domcontentloaded'});await expect(page.locator('#lesson-feedback')).toContainText('já concluída');
  expect(external).toEqual([]);
 }finally{await context.setOffline(false);}
});
