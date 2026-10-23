import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
async function referencia(pagina:Page,codigo:string){
 await pagina.route('**/referencia-cache',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><title>Modelo de cache em memória</title><script>'+codigo+'</script></html>'}));
 await pagina.goto('/referencia-cache');
}
test('a referência de validade executa o prazo exato e o relógio anterior',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 const codigo=atividade('js-cache-prever-validade').code!;
 await referencia(pagina,codigo);await expect.poll(()=>saidas.join('\n')).toBe(getPracticeSolution('js-cache-prever-validade'));
 saidas.length=0;await referencia(pagina,codigo.replace('idade < entrada.ttl','idade <= entrada.ttl'));await expect.poll(()=>saidas.join('\n')).toBe('true\ntrue\nfalse');
});
test('a chave corrigida distingue pares que colidem no modelo original',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 await referencia(pagina,atividade('js-cache-distinguir-chaves').code!);await expect.poll(()=>saidas.join('\n')).toBe('true');
 saidas.length=0;await referencia(pagina,getPracticeSolution('js-cache-distinguir-chaves')!);await expect.poll(()=>saidas.join('\n')).toBe('false');
 expect(await pagina.evaluate('[chaveBusca("ana","café"),chaveBusca("bia","café"),chaveBusca("ana","chá")]')).toEqual(['["ana","café"]','["bia","café"]','["ana","chá"]']);
});
const identificador='js-cache-selecionar-copia';
const alternativa='const ausente=Object.freeze({estado:"ausente",dados:null});function selecionarCache(e,c,a,f){if(e===null||e.chave!==c||a<e.salvoEm)return ausente;const atual=a-e.salvoEm<e.ttl;if(!atual&&!f)return ausente;return{dados:JSON.parse(JSON.stringify(e.dados)),estado:atual?"atual":"antigo"};}';
const pausa=(pagina:Page)=>pagina.locator('[data-practice="'+identificador+'"]');
test('cache mantém a aula, previsão, diagnóstico, teclado e projeto externo',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/limites-cache');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="js-cache-prever-validade"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('true\ntrue\nfalse');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('idade e TTL');await expect(previsao.locator('[data-help] pre')).toHaveCount(0);
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('true\nfalse\nfalse');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const diagnostico=pagina.locator('[data-practice="js-cache-distinguir-chaves"]');
 await diagnostico.locator('input[value="separador"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('concatenação ambígua');
 await diagnostico.locator('input[value="par"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await expect(pagina.locator('#aula-projeto')).toContainText('rubrica manual');await expect(pagina.locator('#aula-projeto')).toContainText('seleção em memória');
});
test('uma seleção equivalente executa e a solução consultada conserva assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/limites-cache');const pratica=pausa(pagina);
 await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('presença da entrada',{timeout:20000});await expect(pratica.locator('[data-help] pre')).toHaveCount(0);
 await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pratica.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('assistência');await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[identificador]).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.cache.recuperacao'].review.lastOutcome).toBe('assisted');
});
test('a prática de cache respondida conserva axe e a leitura de 220 a 4000 px',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/limites-cache');const pratica=pausa(pagina);
 await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});
test('a seleção executa offline e retoma sem rede ou executor remoto',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))remotas.push(pedido.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{await pagina.goto('/#/aula/limites-cache');const pratica=pausa(pagina);await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});await pagina.reload();expect(await pausa(pagina).getByRole('textbox',{name:'Seu código',exact:true}).inputValue()).toBe(alternativa);expect(remotas).toEqual([]);}
 finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
test('exportação e importação recuperam a seleção escrita e sua assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/limites-cache');const pratica=pausa(pagina);
 await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});await pratica.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[identificador]).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.cache.recuperacao'].review.lastOutcome).toBe('assisted');
});
