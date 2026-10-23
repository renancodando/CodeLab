import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
async function referencia(pagina:Page,codigo:string){
 await pagina.route('**/referencia-identidade',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><title>Modelo de autorização em memória</title><script>'+codigo+'</script></html>'}));
 await pagina.goto('/referencia-identidade');
}
test('a referência da previsão executa a falha sem mudar a identidade recebida',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 await referencia(pagina,atividade('js-identidade-prever-corpo').code!);
 await expect.poll(()=>saidas.join('\n')).toBe(getPracticeSolution('js-identidade-prever-corpo'));
 saidas.length=0;
 await referencia(pagina,atividade('js-identidade-prever-corpo').code!.replace('corpo.usuarioId === nota.donoId','identidade.id === nota.donoId'));
 await expect.poll(()=>saidas.join('\n')).toBe('Negado\nbia');
});
test('o diagnóstico compara dono leitor, editor externo e editor dono em JavaScript real',async({page:pagina})=>{
 const chamada='[null,{id:"ana",papeis:[]},{id:"bia",papeis:["editor"]},{id:"ana",papeis:["editor"]}].map(pessoa=>podeEditar(pessoa,{donoId:"ana"}))';
 await referencia(pagina,atividade('js-identidade-combinar-permissoes').code!);
 expect(await pagina.evaluate(chamada)).toEqual([false,true,true,true]);
 await referencia(pagina,getPracticeSolution('js-identidade-combinar-permissoes')!);
 expect(await pagina.evaluate(chamada)).toEqual([false,false,false,true]);
});
const identificador='js-identidade-autorizar-nota';
const alternativa='function autorizarNota(p,n,a){if(p===null||p.id!==n.donoId)return false;switch(a){case "ler":return true;case "alterar":return n.arquivada===false&&new Set(p.papeis).has("editor");default:return false;}}';
const pausa=(pagina:Page)=>pagina.locator('[data-practice="'+identificador+'"]');
test('identidade mantém a aula, previsão, diagnóstico, teclado e projeto externo',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/identidade-api');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="js-identidade-prever-corpo"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('Negado\nbia');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('corpo enviado');await expect(previsao.locator('[data-help] pre')).toHaveCount(0);
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('Nota de Ana\nbia');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const diagnostico=pagina.locator('[data-practice="js-identidade-combinar-permissoes"]');
 await diagnostico.locator('input[value="papel"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('contraexemplos');
 await diagnostico.locator('input[value="conjuncao"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await expect(pagina.locator('#aula-projeto')).toContainText('revisão manual');await expect(pagina.locator('#aula-projeto')).toContainText('não comprova autenticação');
});
test('uma política equivalente executa e a solução consultada conserva assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/identidade-api');const pratica=pausa(pagina);
 await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('ausência de identidade',{timeout:20000});await expect(pratica.locator('[data-help] pre')).toHaveCount(0);
 await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pratica.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('assistência');await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[identificador]).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.api.politica'].review.lastOutcome).toBe('assisted');
});
test('a política respondida conserva axe e a leitura de 220 a 4000 px',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/identidade-api');const pratica=pausa(pagina);
 await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});
test('a política executa offline e retoma sem autenticação ou executor remoto',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))remotas.push(pedido.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{await pagina.goto('/#/aula/identidade-api');const pratica=pausa(pagina);await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});await pagina.reload();expect(await pausa(pagina).getByRole('textbox',{name:'Seu código',exact:true}).inputValue()).toBe(alternativa);expect(remotas).toEqual([]);}
 finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
test('exportação e importação recuperam a política escrita e sua assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/identidade-api');const pratica=pausa(pagina);
 await pratica.getByRole('textbox',{name:'Seu código',exact:true}).fill(alternativa);await pratica.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});await pratica.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pratica.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[identificador]).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.api.politica'].review.lastOutcome).toBe('assisted');
});
