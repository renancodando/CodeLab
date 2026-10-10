import {test,expect,type Page} from '@playwright/test';
const chave='git-bancada-preparacao-v1';
async function abrir(pagina:Page){await pagina.goto('/#/percurso/git');await pagina.getByRole('button',{name:'Experimentar trabalho, preparação e commit',exact:true}).click();return pagina.getByRole('region',{name:'Bancada Git: três versões'});}
async function exportar(pagina:Page){await pagina.goto('/#/perfil');const pendente=pagina.waitForEvent('download');await pagina.locator('#export-progress').click();const fluxo=await (await pendente).createReadStream(),partes:Buffer[]=[];for await(const parte of fluxo!)partes.push(Buffer.from(parte));return Buffer.concat(partes);}
test('Git conserva os três estados, assistência, backup e retomada offline',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))execucoes.push(pedido.url());});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  const bancada=await abrir(pagina),arquivo=bancada.getByLabel('Arquivo de trabalho: calculo.txt'),mensagem=bancada.getByLabel('Mensagem do commit');
  await bancada.getByRole('button',{name:'git commit',exact:true}).click();await expect(bancada.locator('[data-estado]')).toContainText('Inicialize');
  await bancada.getByRole('button',{name:'git init',exact:true}).click();await bancada.getByRole('button',{name:'git add calculo.txt',exact:true}).click();await mensagem.fill('<img src=x onerror=alert(1)>');await bancada.getByRole('button',{name:'git commit',exact:true}).click();
  await expect(bancada.locator('img')).toHaveCount(0);await expect(bancada.locator('[data-historico]')).toContainText('<img');
  await arquivo.fill('total=10\n');await bancada.getByRole('button',{name:'git add calculo.txt',exact:true}).click();await arquivo.fill('total=20\n');
  await bancada.getByRole('button',{name:'Conferir objetivo',exact:true}).click();await expect(bancada.locator('[data-resultado]')).toContainText('duas versões');await expect(bancada.locator('[data-head]')).toHaveText('total=0');await expect(bancada.locator('[data-preparacao]')).toHaveText('total=10');
  await bancada.getByRole('button',{name:'Uma pista',exact:true}).click();await mensagem.fill('Preparação capturada');await bancada.getByRole('button',{name:'git commit',exact:true}).click();await bancada.getByRole('button',{name:'Conferir objetivo',exact:true}).click();await expect(bancada.locator('[data-resultado]')).toContainText('Objetivo conferido');await expect(bancada.locator('[data-historico]')).toContainText('A──B');
  await pagina.locator('[data-stage="preparacao"] details summary').click();await expect(bancada.locator('[data-resultado]')).toContainText('assistência');
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(arquivo).toBeVisible();}
  await pagina.reload({waitUntil:'domcontentloaded'});await pagina.getByRole('button',{name:'Experimentar trabalho, preparação e commit',exact:true}).click();await expect(arquivo).toHaveValue('total=20\n');await expect(bancada.locator('[data-head]')).toHaveText('total=10');
  const backup=await exportar(pagina),dados=JSON.parse(backup.toString());expect(dados.practiceAnswers[chave]).toMatchObject({assisted:true,passed:true,hints:1,attempts:2});expect(JSON.parse(dados.practiceAnswers[chave].value).historico).toHaveLength(2);
  await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:backup});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await abrir(pagina);await expect(arquivo).toHaveValue('total=20\n');expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
test('Git preserva rascunho incompatível até exportar e reiniciar explicitamente',async({page:pagina})=>{
 await pagina.addInitScript(chave=>{localStorage.setItem('codelab.progress.v2',JSON.stringify({version:2,practiceAnswers:{[chave]:{value:'formato futuro preservado',attempts:0,hints:0,assisted:false,passed:false,revision:2,updatedAt:''}}}));},chave);
 const bancada=await abrir(pagina);await expect(bancada.locator('[data-estado]')).toContainText('incompatível');await expect(bancada.locator('[data-arquivo]')).toBeDisabled();const backup=JSON.parse((await exportar(pagina)).toString());expect(backup.practiceAnswers[chave].value).toBe('formato futuro preservado');await abrir(pagina);await bancada.getByRole('button',{name:'Reiniciar só esta bancada',exact:true}).click();await expect(bancada.locator('[data-arquivo]')).toBeEnabled();
});
test('Git exporta estado em memória depois de uma falha real de quota',async({page:pagina})=>{
 const bancada=await abrir(pagina);await bancada.getByRole('button',{name:'git init',exact:true}).click();
 const anterior=await pagina.evaluate(()=>localStorage.getItem('codelab.progress.v2'));
 const preenchimento=await pagina.evaluate(()=>{const valor='x'.repeat(128);let chaves=0;try{for(;chaves<40000;chaves++)localStorage.setItem('git-quota-'+chaves,valor);}catch(erro){return{chaves,nome:(erro as DOMException).name};}return{chaves,nome:''};});expect(preenchimento.nome).toBe('QuotaExceededError');
 try{await bancada.locator('[data-arquivo]').fill('Minha investigação recuperável\n'+'a'.repeat(500));await expect(bancada.locator('[data-estado]')).toContainText('não conseguiu salvar');expect(await pagina.evaluate(()=>localStorage.getItem('codelab.progress.v2'))).toBe(anterior);const backup=JSON.parse((await exportar(pagina)).toString());expect(JSON.parse(backup.practiceAnswers[chave].value).trabalho).toContain('Minha investigação recuperável');}
 finally{await pagina.evaluate(quantidade=>{for(let i=0;i<quantidade;i++)localStorage.removeItem('git-quota-'+i);},preenchimento.chaves);}
 await abrir(pagina);await expect(bancada.locator('[data-arquivo]')).toContainText('Minha investigação recuperável');await bancada.locator('[data-arquivo]').fill('Recuperado e salvo novamente');await expect(bancada.locator('[data-estado]')).toContainText('Rascunho salvo');await pagina.reload({waitUntil:'domcontentloaded'});await pagina.getByRole('button',{name:'Experimentar trabalho, preparação e commit',exact:true}).click();await expect(bancada.locator('[data-arquivo]')).toHaveValue('Recuperado e salvo novamente');
});
