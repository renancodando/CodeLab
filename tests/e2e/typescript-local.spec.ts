import {test,expect,type Page} from '@playwright/test';
async function escrever(pagina:Page,codigo:string){const campo=pagina.getByRole('textbox',{name:'É aqui que você escreve seu código'});await campo.focus();await pagina.keyboard.press('Control+a');await campo.evaluate((elemento,texto)=>{const dados=new DataTransfer();dados.setData('text/plain',texto);elemento.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dados,bubbles:true,cancelable:true}));},codigo);}
async function abrir(pagina:Page){await pagina.goto('/#/laboratorio');await expect(pagina.locator('#lab-run')).toBeEnabled({timeout:20000});await pagina.locator('#lab-language').selectOption('typescript');}
async function aguardarExecucao(pagina:Page){await expect(pagina.locator('#lab-run')).toBeEnabled({timeout:36000});}
async function executar(pagina:Page,codigo:string){await escrever(pagina,codigo);await pagina.locator('#lab-run').click();await aguardarExecucao(pagina);}
async function exportar(pagina:Page,seletor:string){const pendente=pagina.waitForEvent('download');await pagina.locator(seletor).click();const arquivo=await pendente,fluxo=await arquivo.createReadStream(),partes:Buffer[]=[];for await(const parte of fluxo!)partes.push(Buffer.from(parte));return{nome:arquivo.suggestedFilename(),buffer:Buffer.concat(partes)};}

const codigo='interface Pedido {centavos:number; valido:boolean}\nfunction somar(pedidos:Pedido[]):number{return pedidos.filter(p=>p.valido).reduce((total,p)=>total+p.centavos,0);}\nconsole.log(somar([]));\nconsole.log(somar([{centavos:2995,valido:true},{centavos:100,valido:false},{centavos:5995,valido:true}]));';

test('TypeScript: diagnósticos reais, JavaScript emitido e isolamento sem carga antecipada',async({page:pagina})=>{
 test.setTimeout(120000);const recursos:string[]=[],remotas:string[]=[],executores:string[]=[];pagina.on('request',pedido=>{if(/typescript-local/.test(pedido.url()))recursos.push(pedido.url());if(/\/api\/executions|example\.com/.test(pedido.url()))remotas.push(pedido.url());});pagina.on('worker',worker=>{if(worker.url().includes('runner.worker'))executores.push(worker.url());});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 const cacheInicial=await pagina.evaluate(async()=>(await Promise.all((await caches.keys()).map(async chave=>(await(await caches.open(chave)).keys()).map(pedido=>pedido.url)))).flat());expect(cacheInicial.some(url=>url.includes('typescript-local'))).toBe(false);expect(recursos).toEqual([]);
 await abrir(pagina);await expect(pagina.locator('#lab-note')).toContainText('strict e ES2022');expect(recursos).toEqual([]);

 await executar(pagina,codigo);await expect(pagina.locator('#lab-console')).toHaveText('0\n8990');expect(recursos.some(url=>url.includes('typescript-local.worker'))).toBe(true);await expect(pagina.locator('#lab-ts-code')).toBeVisible();await pagina.locator('#lab-ts-code summary').click();await expect(pagina.locator('#lab-ts-code pre')).toContainText('function somar(pedidos)');await expect(pagina.locator('#lab-ts-code pre')).not.toContainText('interface Pedido');await expect(pagina.locator('#lab-ts-diagnostics')).toBeHidden();
 const quantidadeExecutores=executores.length;await executar(pagina,'console.log("NÃO EXECUTAR");\nconst total:number="erro";');await expect(pagina.locator('#lab-ts-diagnostics')).toContainText('TS2322 · linha 2, coluna 7');await expect(pagina.locator('#lab-console')).not.toContainText('NÃO EXECUTAR');await expect(pagina.locator('#lab-ts-code')).toBeHidden();expect(executores).toHaveLength(quantidadeExecutores);
 await expect(pagina.locator('#lab-editor .squiggly-error')).not.toHaveCount(0);await pagina.locator('#lab-language').selectOption('javascript');await expect(pagina.locator('#lab-editor .squiggly-error')).toHaveCount(0);await expect(pagina.locator('#lab-ts-diagnostics')).toBeHidden();await pagina.locator('#lab-language').selectOption('typescript');
 await executar(pagina,'const objeto={}; console.log(objeto["<img src=x onerror=alert(1)>"]);');await expect(pagina.locator('#lab-ts-diagnostics')).toContainText('<img src=x');await expect(pagina.locator('#lab-ts-diagnostics img')).toHaveCount(0);expect(executores).toHaveLength(quantidadeExecutores);
 await executar(pagina,'const ambiente:any=globalThis; console.log(ambiente.fetch("https://example.com"));');await expect(pagina.locator('#lab-console')).toContainText('not a function');expect(remotas).toEqual([]);
 expect(remotas).toEqual([]);
});

test('TypeScript: projetos e backup retornam offline sem perder o original',async({page:pagina,context:contexto})=>{
 test.setTimeout(120000);await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await abrir(pagina);await executar(pagina,codigo);await expect(pagina.locator('#lab-console')).toHaveText('0\n8990');await pagina.locator('#save-project').click();await expect(pagina).toHaveURL(/#\/laboratorio\/[a-z0-9-]+$/);const projeto=pagina.url();const arquivo=await exportar(pagina,'#export');expect(arquivo.nome).toBe('projeto.ts');expect(arquivo.buffer.toString()).toBe(codigo);
 await pagina.goto('/#/perfil');const jornada=await exportar(pagina,'#export-progress'),backup=JSON.parse(jornada.buffer.toString());expect(backup.projects.at(-1).language).toBe('typescript');expect(backup.projects.at(-1).code).toBe(codigo);await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:jornada.buffer});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();
 await contexto.setOffline(true);
 try{await pagina.goto(projeto);await pagina.reload();await expect(pagina.locator('#lab-run')).toBeEnabled();await expect(pagina.locator('#lab-language')).toHaveValue('typescript');expect((await exportar(pagina,'#export')).buffer.toString()).toBe(codigo);await pagina.locator('#lab-run').click();await aguardarExecucao(pagina);await expect(pagina.locator('#lab-console')).toHaveText('0\n8990');await pagina.locator('#lab-ts-code summary').click();
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pagina.locator('#lab-ts-code pre')).toBeVisible();}
 }finally{await contexto.setOffline(false);}
});

test('TypeScript: cancelar, limitar execução e invalidar resultado ao editar ou sair',async({page:pagina})=>{
 test.setTimeout(120000);await abrir(pagina);await executar(pagina,'console.log(7);');await expect(pagina.locator('#lab-console')).toHaveText('7');
 const iniciado=pagina.waitForEvent('worker',{predicate:worker=>worker.url().includes('typescript-local.worker')});await pagina.locator('#lab-run').click();await iniciado;await pagina.locator('#lab-stop').click();await expect(pagina.locator('#lab-console')).toContainText('Execução encerrada');await expect.poll(()=>pagina.workers().filter(w=>/typescript-local\.worker|runner\.worker/.test(w.url())).length).toBe(0);
 await executar(pagina,'while(true){}');await expect(pagina.locator('#lab-console')).toContainText('levou tempo demais');await expect.poll(()=>pagina.workers().filter(w=>/typescript-local\.worker|runner\.worker/.test(w.url())).length).toBe(0);
 await executar(pagina,'const dados=Array(10000000).fill(1); console.log(dados.length);');await expect(pagina.locator('#lab-console')).toContainText('limite de memória');
 await escrever(pagina,'console.log(8);');const compilando=pagina.waitForEvent('worker',{predicate:worker=>worker.url().includes('typescript-local.worker')});await pagina.locator('#lab-run').click();await compilando;await escrever(pagina,'console.log(9);');await expect(pagina.locator('#lab-console')).toContainText('Código alterado');await expect.poll(()=>pagina.workers().filter(w=>/typescript-local\.worker|runner\.worker/.test(w.url())).length).toBe(0);
 await pagina.locator('#lab-run').click();await aguardarExecucao(pagina);await expect(pagina.locator('#lab-console')).toHaveText('9');await pagina.locator('#lab-language').selectOption('javascript');await executar(pagina,'console.log("JS preservado");');await expect(pagina.locator('#lab-console')).toHaveText('JS preservado');await pagina.locator('#lab-language').selectOption('typescript');expect((await exportar(pagina,'#export')).buffer.toString()).toBe('console.log(9);');
 const saindo=pagina.waitForEvent('worker',{predicate:worker=>worker.url().includes('typescript-local.worker')});await pagina.locator('#lab-run').click();await saindo;await pagina.goto('/#/perfil');await expect.poll(()=>pagina.workers().filter(w=>/typescript-local\.worker|runner\.worker/.test(w.url())).length).toBe(0);
});

test('TypeScript: primeiro uso offline mantém fonte exportável e erro recuperável',async({page:pagina,context:contexto})=>{
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await abrir(pagina);const codigo='const total:number=17; console.log(total);';await escrever(pagina,codigo);await contexto.setOffline(true);
 try{await pagina.locator('#lab-run').click();await expect(pagina.locator('#lab-console')).toContainText('primeiro carregamento');await expect(pagina.locator('#lab-run')).toBeEnabled();expect((await exportar(pagina,'#export')).buffer.toString()).toBe(codigo);await expect(pagina.locator('#lab-ts-code')).toBeHidden();}finally{await contexto.setOffline(false);}
});

test.describe('prazo do módulo TypeScript',()=>{
 test.use({serviceWorkers:'block'});
 test('expira a importação, cancela espera e ignora resposta atrasada',async({page:pagina})=>{
  test.setTimeout(120000);let liberar!:()=>void;const retida=new Promise<void>(resolve=>liberar=resolve);let interceptada=false;
  await pagina.route(/\/assets\/typescript-local-[^/]+\.js$/,async rota=>{interceptada=true;await retida;await rota.continue().catch(()=>{});});
  try{await abrir(pagina);await escrever(pagina,'console.log(47);');await pagina.clock.install();await pagina.locator('#lab-run').click();await expect.poll(()=>interceptada).toBe(true);await pagina.clock.fastForward(20001);await expect(pagina.locator('#lab-console')).toContainText('compilador TypeScript no prazo');await expect(pagina.locator('#lab-run')).toBeEnabled();expect((await exportar(pagina,'#export')).buffer.toString()).toBe('console.log(47);');
   await pagina.locator('#lab-run').evaluate(botao=>{(botao as HTMLButtonElement).click();document.querySelector<HTMLButtonElement>('#lab-stop')!.click();});await pagina.clock.fastForward(20001);await expect(pagina.locator('#lab-console')).toContainText('Execução encerrada');liberar();await pagina.clock.resume();await pagina.locator('#lab-run').click();await aguardarExecucao(pagina);await expect(pagina.locator('#lab-console')).toHaveText('47');await expect.poll(()=>pagina.workers().filter(w=>/typescript-local\.worker|runner\.worker/.test(w.url())).length).toBe(0);
  }finally{liberar();}
 });
});


test.describe('prazo de abertura do editor',()=>{
 test.use({serviceWorkers:'block'});
 test('conserva exportação sem editor, encerra espera e recupera após recarregar',async({page:pagina})=>{
  test.setTimeout(120000);let liberar!:()=>void;const retida=new Promise<void>(resolve=>liberar=resolve),padrao=/\/assets\/editor-[^/]+\.js$/;let interceptada=false;
  await pagina.addInitScript(()=>localStorage.setItem('codelab.progress.v2',JSON.stringify({version:2,drafts:{'lab-typescript':'const total:number=17; console.log(total);'}})));
  await pagina.route(padrao,async rota=>{interceptada=true;await retida;await rota.continue().catch(()=>{});});await pagina.clock.install();
  try{await pagina.goto('/#/laboratorio');await expect.poll(()=>interceptada).toBe(true);await pagina.locator('#lab-language').selectOption('typescript');await pagina.clock.fastForward(20001);await expect(pagina.locator('#lab-console')).toContainText('carregar o editor no prazo');await expect(pagina.locator('#lab-run')).toBeDisabled();const arquivo=await exportar(pagina,'#export');expect(arquivo.nome).toBe('projeto.ts');expect(arquivo.buffer.toString()).toBe('const total:number=17; console.log(total);');
   const carregada=pagina.waitForResponse(padrao);liberar();await(await carregada).finished();await pagina.clock.runFor(1000);await expect(pagina.locator('#lab-console')).toContainText('carregar o editor no prazo');await expect(pagina.locator('#lab-run')).toBeDisabled();await pagina.unroute(padrao);await pagina.clock.resume();await pagina.reload();await expect(pagina.locator('#lab-run')).toBeEnabled({timeout:20000});await pagina.locator('#lab-language').selectOption('typescript');expect((await exportar(pagina,'#export')).buffer.toString()).toBe('const total:number=17; console.log(total);');await pagina.locator('#lab-run').click();await aguardarExecucao(pagina);await expect(pagina.locator('#lab-console')).toHaveText('17');
  }finally{liberar();}
 });
});
