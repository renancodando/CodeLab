import {test,expect} from '@playwright/test';

test('quota real preserva checkpoint, exporta trabalho em memória e volta a salvar',async({page})=>{
 const erros:string[]=[];
 page.on('pageerror',erro=>erros.push(erro.message));
 await page.goto('/#/projeto/html-caderno');
 await page.locator('[data-code]').fill('<h1>Checkpoint antes da quota</h1>');
 await expect(page.locator('[data-save]')).toContainText('salvo');
 const anterior=await page.evaluate(()=>localStorage.getItem('codelab.progress.v2'));
 expect(anterior).not.toBeNull();
 const preenchimento=await page.evaluate(()=>{
  const valor='a'.repeat(8192);let chaves=0;
  try {for(;chaves<2000;chaves++)localStorage.setItem('verificacao-quota-'+chaves,valor);}
  catch(erro){
   if(!(erro instanceof DOMException)||erro.name!=='QuotaExceededError')throw erro;
   return {chaves,erro:erro.name};
  }
  throw new Error('Quota não atingida dentro do limite do cenário.');
 });
 expect(preenchimento.chaves).toBeGreaterThan(0);
 const trabalho='<h1>Trabalho recuperável com quota real</h1>\n'+'a'.repeat(20000);
 try {
  await page.locator('[data-code]').fill(trabalho);
  await expect(page.locator('[data-save]')).toContainText('não conseguiu salvar');
  expect(await page.evaluate(()=>localStorage.getItem('codelab.progress.v2'))).toBe(anterior);
  const arquivoPendente=page.waitForEvent('download');await page.locator('[data-export]').click();
  const arquivo=await arquivoPendente,fluxo=await arquivo.createReadStream(),partes:Buffer[]=[];
  for await(const parte of fluxo!)partes.push(Buffer.from(parte));
  const zip=Buffer.concat(partes);
  expect(zip.readUInt32LE(0)).toBe(0x04034b50);
  expect(zip.includes(Buffer.from(trabalho))).toBe(true);
  await page.goto('/#/perfil');
  const backupPendente=page.waitForEvent('download');await page.locator('#export-progress').click();
  const backup=await backupPendente,fluxoBackup=await backup.createReadStream(),partesBackup:Buffer[]=[];
  for await(const parte of fluxoBackup!)partesBackup.push(Buffer.from(parte));
  expect(JSON.parse(Buffer.concat(partesBackup).toString()).projectWorkspaces['html-caderno'].files['index.html']).toBe(trabalho);
 } finally {
  await page.evaluate(quantidade=>{for(let indice=0;indice<quantidade;indice++)localStorage.removeItem('verificacao-quota-'+indice);},preenchimento.chaves);
 }
 await page.goto('/#/projeto/html-caderno');
 await expect(page.locator('[data-code]')).toHaveValue(trabalho);
 await page.locator('[data-code]').fill(trabalho+'\n');
 await expect(page.locator('[data-save]')).toContainText('salvo');
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('[data-code]')).toHaveValue(trabalho+'\n');
 expect(erros).toEqual([]);
});
