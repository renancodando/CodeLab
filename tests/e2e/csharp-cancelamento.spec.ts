import {test,expect} from '@playwright/test';

test('C#: cancelamento, vaga e token vinculado retomam offline sem executor externo',async({page,context})=>{
 const externas:string[]=[];
 page.on('request',requisicao=>{if(/\/api\/(execute|run|submissions)/.test(requisicao.url()))externas.push(requisicao.url());});
 await page.goto('/');
 await expect(page.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await context.setOffline(true);
 try {
  await page.goto('/#/aula/cs-assincrono-recursos');
  await expect(page.locator('.lesson-chapter')).toHaveCount(13);
  const prever=page.locator('[data-practice="cs-prever-cancelamento"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('cancelado\n0');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('não é desfeita');
  await expect(prever.locator('[data-help] pre')).toHaveCount(0);
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('cancelado\n1');
  await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const vaga=page.locator('[data-practice="cs-vaga-sem-posse"]');
  await vaga.getByLabel('Adicionar outro Release no catch para compensar o cancelamento.',{exact:true}).check();
  await vaga.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(vaga.locator('.practice-feedback')).toContainText('cancelada antes de adquirir');
  await vaga.getByLabel('Aguardar a aquisição antes do try; envolver somente o trabalho adquirido em try/finally com Release.',{exact:true}).check();
  await vaga.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(vaga.locator('.practice-feedback')).toContainText('não houve execução de csharp');
  const token=page.locator('[data-practice="cs-token-vinculado"]');
  await token.getByLabel('Trecho que falta').fill('vinculada.Token');
  await token.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(token.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await token.getByRole('button',{name:'Consultar solução',exact:true}).click();
  const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['cs-token-vinculado'].assisted).toBe(true);
  expect(salvo.adaptive.skills['csharp.assincrono.vagas'].evidence['cs-vaga-sem-posse'].firstTry).toBe(false);
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(page.locator('[data-practice="cs-prever-cancelamento"] textarea')).toHaveValue('cancelado\n1');
  await expect(page.locator('[data-practice="cs-vaga-sem-posse"] input[value="adquirir"]')).toBeChecked();
  await expect(page.locator('[data-practice="cs-token-vinculado"] input[name="answer"]')).toHaveValue('vinculada.Token');
  expect(externas).toEqual([]);
 } finally {await context.setOffline(false);}
});
