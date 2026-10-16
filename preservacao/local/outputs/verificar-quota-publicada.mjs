import {chromium,expect} from '../work/CodeLab/node_modules/@playwright/test/index.mjs';
const origem='https://code-lab-omega.vercel.app';
const navegador=await chromium.launch({channel:'msedge',headless:true});
try {
 const contexto=await navegador.newContext({viewport:{width:375,height:812}});
 const pagina=await contexto.newPage(),erros=[];
 pagina.on('pageerror',erro=>erros.push(erro.message));
 await pagina.goto(origem+'/#/projeto/html-caderno',{waitUntil:'domcontentloaded',timeout:45000});
 await expect(pagina.locator('[data-code]')).toBeVisible();
 await pagina.locator('[data-code]').fill('<h1>Checkpoint antes da quota</h1>');
 await expect(pagina.locator('[data-save]')).toContainText('salvo');
 const anterior=await pagina.evaluate(()=>localStorage.getItem('codelab.progress.v2'));
 const preenchimento=await pagina.evaluate(()=>{
  const valor='a'.repeat(8192);let chaves=0;
  try {for(;chaves<2000;chaves++)localStorage.setItem('verificacao-quota-'+chaves,valor);}
  catch(erro){if(!(erro instanceof DOMException)||erro.name!=='QuotaExceededError')throw erro;return {chaves,erro:erro.name};}
  throw new Error('A quota real não foi atingida dentro do limite do teste.');
 });
 const trabalho='<h1>Trabalho recuperável com quota real</h1>\n'+'a'.repeat(20000);
 await pagina.locator('[data-code]').fill(trabalho);
 await expect(pagina.locator('[data-save]')).toContainText('não conseguiu salvar');
 expect(await pagina.evaluate(()=>localStorage.getItem('codelab.progress.v2'))).toBe(anterior);
 const baixar=async(acao)=>{
  const pendente=pagina.waitForEvent('download');await acao();const arquivo=await pendente,fluxo=await arquivo.createReadStream(),partes=[];
  for await(const parte of fluxo)partes.push(Buffer.from(parte));
  return {nome:arquivo.suggestedFilename(),dados:Buffer.concat(partes)};
 };
 const zip=await baixar(()=>pagina.locator('[data-export]').click());
 expect(zip.dados.includes(Buffer.from(trabalho))).toBe(true);
 await pagina.goto(origem+'/#/perfil');
 const backup=await baixar(()=>pagina.locator('#export-progress').click());
 expect(JSON.parse(backup.dados.toString()).projectWorkspaces['html-caderno'].files['index.html']).toBe(trabalho);
 await pagina.evaluate(quantidade=>{for(let indice=0;indice<quantidade;indice++)localStorage.removeItem('verificacao-quota-'+indice);},preenchimento.chaves);
 await pagina.goto(origem+'/#/projeto/html-caderno');
 await expect(pagina.locator('[data-code]')).toHaveValue(trabalho);
 await pagina.locator('[data-code]').fill(trabalho+'\n');
 await expect(pagina.locator('[data-save]')).toContainText('salvo');
 await pagina.reload({waitUntil:'domcontentloaded'});
 await expect(pagina.locator('[data-code]')).toHaveValue(trabalho+'\n');
 expect(erros).toEqual([]);
 console.log(JSON.stringify({origem,preenchimento,zip:zip.nome,backup:backup.nome,bytesExportados:backup.dados.length,recuperacaoAposLiberarQuota:true,erros}));
} finally {await navegador.close();}
