import {test,expect,type Page} from '@playwright/test';

async function escrever(pagina:Page,codigo:string){
 const campo=pagina.getByRole('textbox',{name:'É aqui que você escreve seu código'});
 await campo.focus();await pagina.keyboard.press('Control+a');
 await campo.evaluate((elemento,texto)=>{const dados=new DataTransfer();dados.setData('text/plain',texto);elemento.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dados,bubbles:true,cancelable:true}));},codigo);
}
async function abrir(pagina:Page){
 await pagina.goto('/#/laboratorio');await expect(pagina.locator('#lab-run')).toBeEnabled();await pagina.locator('#lab-language').selectOption('sql');
}
async function executar(pagina:Page,codigo:string){await escrever(pagina,codigo);await pagina.locator('#lab-run').click();await expect(pagina.locator('#lab-run')).toBeEnabled();}
async function exportar(pagina:Page,seletor:string){
 const pendente=pagina.waitForEvent('download');await pagina.locator(seletor).click();const arquivo=await pendente,fluxo=await arquivo.createReadStream(),partes:Buffer[]=[];
 for await(const parte of fluxo!)partes.push(Buffer.from(parte));return{nome:arquivo.suggestedFilename(),buffer:Buffer.concat(partes)};
}

test('SQL local: runtime sob demanda, banco descartável, resultados e jornada offline',async({page:pagina,context:contexto})=>{
 test.setTimeout(120000);
 const recursos:string[]=[],remotas:string[]=[];
 pagina.on('request',pedido=>{if(/sql-local|sql-wasm-browser/.test(pedido.url()))recursos.push(pedido.url());if(/\/api\/executions/.test(pedido.url()))remotas.push(pedido.url());});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));expect(recursos).toEqual([]);
 const cacheInicial=await pagina.evaluate(async()=>{const chaves=await caches.keys();return(await Promise.all(chaves.map(async chave=>(await(await caches.open(chave)).keys()).map(pedido=>pedido.url)))).flat();});expect(cacheInicial.some(url=>/sql-local|sql-wasm-browser/.test(url))).toBe(false);
 await abrir(pagina);await expect(pagina.locator('#lab-note')).toContainText('PostgreSQL');expect(recursos).toEqual([]);
 const codigo="CREATE TABLE pedidos(n INTEGER); INSERT INTO pedidos VALUES(3),(5); BEGIN; INSERT INTO pedidos VALUES(100); ROLLBACK; SELECT sum(n) AS total FROM pedidos; SELECT NULL AS nulo, 'NULL' AS texto, 9223372036854775807 AS inteiro, '<img src=x onerror=alert(1)>' AS dado;";
 await executar(pagina,codigo);await expect(pagina.locator('#lab-console')).toContainText('Banco descartado');
 await expect(pagina.locator('.lab-sql-tabela').first().locator('td')).toHaveText('8');
 const tipos=pagina.locator('.lab-sql-tabela').nth(1);await expect(tipos.getByRole('columnheader')).toHaveText(['nulo','texto','inteiro','dado']);
 await expect(tipos.locator('[data-tipo=nulo]')).toHaveText('NULL');await expect(tipos.locator('[data-tipo=string]').first()).toHaveText('NULL');await expect(tipos.locator('td').nth(2)).toHaveText('9223372036854775807');await expect(tipos.locator('img')).toHaveCount(0);
 expect(recursos.some(url=>url.endsWith('.wasm'))).toBe(true);
 await pagina.getByRole('button',{name:'Salvar projeto',exact:true}).click();await expect(pagina).toHaveURL(/#\/laboratorio\/[a-z0-9-]+$/);const projeto=pagina.url();
 expect((await exportar(pagina,'#export')).buffer.toString()).toBe(codigo);
 await pagina.goto('/#/perfil');const jornada=await exportar(pagina,'#export-progress'),backup=JSON.parse(jornada.buffer.toString());expect(backup.projects.at(-1).language).toBe('sql');expect(backup.projects.at(-1).code).toBe(codigo);
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:jornada.buffer});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();
 await contexto.setOffline(true);
 try{
  await pagina.goto(projeto);await pagina.reload();await expect(pagina.locator('#lab-run')).toBeEnabled();await expect(pagina.locator('#lab-language')).toHaveValue('sql');expect((await exportar(pagina,'#export')).buffer.toString()).toBe(codigo);
  await pagina.locator('#lab-run').click();await expect(pagina.locator('.lab-sql-tabela').first().locator('td')).toHaveText('8');
  await executar(pagina,'SELECT * FROM pedidos;');await expect(pagina.locator('#lab-console')).toContainText('no such table');
  await executar(pagina,'SELECT 7 AS numero WHERE 0;');await expect(pagina.getByRole('columnheader',{name:'numero'})).toBeVisible();await expect(pagina.locator('.lab-sql-tabela tbody tr')).toHaveCount(0);
  await executar(pagina,"SELECT '"+'a'.repeat(1800)+"' AS texto;");
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pagina.locator('.lab-sql-tabela')).toBeVisible();}
  await pagina.locator('.lab-sql-tabela').focus();await expect(pagina.locator('.lab-sql-tabela')).toBeFocused();
  expect(remotas).toEqual([]);
 }finally{await contexto.setOffline(false);}
});

test('SQL local: cancelar, limitar CPU e descartar workers nas trocas de tela',async({page:pagina})=>{
 test.setTimeout(120000);await abrir(pagina);
 await executar(pagina,'SELECT 1;');await expect(pagina.locator('.lab-sql-tabela td')).toHaveText('1');
 const infinito='WITH RECURSIVE numeros(n) AS(VALUES(1) UNION ALL SELECT n+1 FROM numeros) SELECT sum(n) FROM numeros;';
 await escrever(pagina,infinito);
 await pagina.locator('#lab-run').evaluate(botao=>{(botao as HTMLButtonElement).click();document.querySelector<HTMLButtonElement>('#lab-stop')!.click();});
 await expect(pagina.locator('#lab-console')).toContainText('Execução encerrada');await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
 const iniciado=pagina.waitForEvent('worker',{predicate:w=>w.url().includes('sql-local.worker')});await pagina.locator('#lab-run').click();await iniciado;await pagina.locator('#lab-stop').click();await expect(pagina.locator('#lab-console')).toContainText('Execução encerrada');await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
 await pagina.locator('#lab-run').click();await expect(pagina.locator('#lab-console')).toContainText('tempo limite',{timeout:20000});await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
 await executar(pagina,'SELECT zeroblob(20000000);');await expect(pagina.locator('#lab-console')).toContainText('memory');
 await executar(pagina,'SELECT 2;');await expect(pagina.locator('.lab-sql-tabela td')).toHaveText('2');
 await escrever(pagina,infinito);const trabalhador=pagina.waitForEvent('worker',{predicate:w=>w.url().includes('sql-local.worker')});await pagina.locator('#lab-run').click();await trabalhador;
 await pagina.locator('#lab-language').selectOption('javascript');await escrever(pagina,'console.log("JavaScript preservado");');await pagina.locator('#lab-run').click();await expect(pagina.locator('#lab-console')).toHaveText('JavaScript preservado');
 await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
 await pagina.locator('#lab-language').selectOption('sql');await pagina.locator('#lab-run').click();await pagina.goto('/#/home');await expect(pagina.locator('.monaco-editor')).toHaveCount(0);await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
});

test('SQL local: primeiro carregamento sem rede preserva código e explica o limite offline',async({page:pagina,context:contexto})=>{
 test.setTimeout(120000);await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await abrir(pagina);
 const codigo='SELECT 47;';await escrever(pagina,codigo);await contexto.setOffline(true);
 try{
  await pagina.locator('#lab-run').click();await expect(pagina.locator('#lab-console')).toContainText('Conecte à internet',{timeout:30000});await expect(pagina.locator('#lab-run')).toBeEnabled();expect((await exportar(pagina,'#export')).buffer.toString()).toBe(codigo);
 }finally{await contexto.setOffline(false);}
});

test.describe('prazo do módulo SQL',()=>{
 test.use({serviceWorkers:'block'});
 test('importação interrompida por prazo conserva código e permite nova execução',async({page:pagina})=>{
  test.setTimeout(120000);await abrir(pagina);const codigo='SELECT 47;';await escrever(pagina,codigo);await pagina.clock.install();
  let liberar!:()=>void,chegou!:()=>void;const liberado=new Promise<void>(resolver=>liberar=resolver),recebido=new Promise<void>(resolver=>chegou=resolver);
  await pagina.route(/\/assets\/sql-local-[^/]+\.js$/,async rota=>{chegou();await liberado;await rota.continue();});
  try{
   await pagina.locator('#lab-run').click();await recebido;await pagina.clock.fastForward(20001);
   await expect(pagina.locator('#lab-console')).toContainText('carregar SQLite no prazo');await expect(pagina.locator('#lab-run')).toBeEnabled();expect((await exportar(pagina,'#export')).buffer.toString()).toBe(codigo);
   await pagina.locator('#lab-run').click();await pagina.locator('#lab-stop').click();await pagina.clock.fastForward(20001);await expect(pagina.locator('#lab-console')).toContainText('Execução encerrada');
   const resposta=pagina.waitForResponse(/\/assets\/sql-local-[^/]+\.js$/);liberar();await resposta;await pagina.clock.resume();
   await pagina.locator('#lab-run').click();await expect(pagina.locator('.lab-sql-tabela td')).toHaveText('47');await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
  }finally{liberar();}
 });
});
