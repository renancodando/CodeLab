import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
async function referencia(pagina:Page,codigo:string){
 await pagina.route('**/referencia-fetch.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de Fetch</title></head><body><main><h1>Referência controlada de cancelamento</h1></main><script>'+codigo+'</script></body></html>'}));
 await pagina.goto('/referencia-fetch.html');
}
test('um sinal já abortado rejeita sem iniciar a requisição e emite um único evento',async({page:pagina})=>{
 const saidas:string[]=[];let requisicoes=0;pagina.on('console',m=>{if(m.type()==='log')saidas.push(m.text());});
 await pagina.route('**/referencia-fetch/busca?cidade=rio',rota=>{requisicoes++;return rota.fulfill({contentType:'application/json',body:'[]'});});
 const codigo=atividade('js-fetch-prever-cancelamento').code!;
 await referencia(pagina,codigo);
 await expect.poll(()=>saidas.join('\n')).toBe(getPracticeSolution('js-fetch-prever-cancelamento'));
 expect(requisicoes).toBe(0);
 saidas.length=0;const semCancelamento=codigo.replaceAll('  controle.abort();\n','');expect(semCancelamento).not.toBe(codigo);
 await referencia(pagina,semCancelamento);await expect.poll(()=>saidas.join('\n')).toBe('respondeu\nfalse\n0');expect(requisicoes).toBe(1);
});
test('um motivo personalizado continua sendo o motivo original do sinal',async({page:pagina})=>{
 await referencia(pagina,'');
 const resultado=await pagina.evaluate(async()=>{
  const controle=new AbortController(),motivo={origem:'troca de cidade'};let eventos=0;
  controle.signal.addEventListener('abort',()=>eventos++);controle.abort(motivo);controle.abort('outro');
  try{await fetch('/referencia-fetch/nao-deve-iniciar',{signal:controle.signal});return null;}
  catch(erro){return{mesmo:erro===motivo,preservado:controle.signal.reason===motivo,aborted:controle.signal.aborted,eventos};}
 });
 expect(resultado).toEqual({mesmo:true,preservado:true,aborted:true,eventos:1});
});
test('as alternativas de finally são executadas com sobreposição, sucesso e rejeição',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',m=>{if(m.type()==='log')saidas.push(m.text());});
 const item=atividade('js-fetch-finalizar-atual');
 for(const opcao of item.options!){
  saidas.length=0;const codigo=item.code!.replace('      carregando = false;','      '+opcao.text);
  if(opcao.id!=='sempre')expect(codigo).not.toBe(item.code);
  await referencia(pagina,codigo);await expect.poll(()=>saidas.join('\n')).toBe(opcao.id==='atual'?'true\nfalse':'false\nfalse');
  expect(await pagina.evaluate('buscar(Promise.resolve()).then(() => carregando)')).toBe(opcao.id==='invertido');
  expect(await pagina.evaluate('buscar(Promise.reject(new Error("falha controlada"))).catch(() => carregando)')).toBe(opcao.id==='invertido');
 }
 await referencia(pagina,getPracticeSolution('js-fetch-finalizar-atual')!);
 await expect.poll(()=>saidas.slice(-2).join('\n')).toBe('true\nfalse');
});

const identificador='js-fetch-concluir-busca';
const alternativa='function concluirBusca(estado,pedido,resultado){if(pedido!==estado.pedidoAtual)return {...estado};const proximo=Object.assign({},estado,{carregando:false,erro:null});if(resultado.tipo==="sucesso")proximo.dados=resultado.dados.slice();if(resultado.tipo==="erro")proximo.erro=resultado.mensagem;return proximo;}';
const pausa=(pagina:Page)=>pagina.locator('[data-practice="'+identificador+'"]');
test('a aula conserva capítulos e projeto, com previsão, diagnóstico e teclado',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/fetch-estados');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="js-fetch-prever-cancelamento"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('AbortError\ntrue\n2');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('segundo evento');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('AbortError\ntrue\n1');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const diagnostico=pagina.locator('[data-practice="js-fetch-finalizar-atual"]');
 await diagnostico.locator('input[value="sempre"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('finally antigo');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
 await diagnostico.locator('input[value="atual"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await expect(pagina.locator('#aula-projeto')).toContainText('busca de cidades');await expect(pagina.locator('#aula-projeto')).toContainText('fora do sandbox sem rede');
});
test('a aula respondida mantém axe e largura de 220 a 4000 px',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/fetch-estados');
 const previsao=pagina.locator('[data-practice="js-fetch-prever-cancelamento"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('AbortError\ntrue\n1');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const diagnostico=pagina.locator('[data-practice="js-fetch-finalizar-atual"]');
 await diagnostico.locator('input[value="atual"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});
test('a produção executa uma alternativa e conserva assistência depois de recarregar',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/fetch-estados');const pratica=pausa(pagina);
 await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('Lista vazia',{timeout:20000});await expect(pratica.locator('[data-help] pre')).toHaveCount(0);
 await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pratica.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('assistência');await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[identificador]).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.fetch.estado'].review.lastOutcome).toBe('assisted');
});
test('a função executa offline sem permitir requisição remota do aluno',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{await pagina.goto('/#/aula/fetch-estados');const pratica=pausa(pagina);await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});await pagina.reload();expect(await pausa(pagina).getByRole('textbox',{name:'Seu código',exact:true}).inputValue()).toBe(alternativa);expect(remotas).toEqual([]);}
 finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
test('a execução e a assistência são recuperadas por exportação e importação',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/fetch-estados');const pratica=pausa(pagina);
 await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});await pratica.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[identificador]).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.fetch.estado'].review.lastOutcome).toBe('assisted');
});
