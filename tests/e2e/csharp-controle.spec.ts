import {test,expect,type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';
import {practiceActivities} from '../../src/content/practice';

const idOrdem='cs-controle-reconstruir-retorno';
const ordem=['metodo','total','percorrer','filtrar','acumular','fechar-laco','retornar','fechar-metodo'];
const alternativa=['metodo','total','percorrer','filtrar','acumular','fechar-metodo','retornar','fechar-laco'];
async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
async function ordenar(pausa:Locator,desejada:string[]){
 const linhas=practiceActivities.find(atividade=>atividade.id===idOrdem)!.lines!;
 const codigos=await pausa.locator('.practice-order code').allTextContents();
 const ids=codigos.map(codigo=>linhas.find(linha=>linha.code===codigo)!.id);
 for(let indice=0;indice<desejada.length;indice++){
  let posicao=ids.indexOf(desejada[indice]);
  while(posicao>indice){const botao=pausa.getByRole('button',{name:'Mover linha '+(posicao+1)+' para cima',exact:true});await botao.focus();await botao.press('Space');[ids[posicao],ids[posicao-1]]=[ids[posicao-1],ids[posicao]];posicao--;}
 }
}

test('controle C# mantém a aula e pratica interrupções e limite inclusivo',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-controle');await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 for(const [bloco,id] of [[3,'cs-controle-prever-interrupcoes'],[6,'cs-controle-corrigir-limite'],[8,idOrdem]] as const)await expect(pagina.locator('.lesson-chapter').nth(bloco).locator('[data-practice="'+id+'"]')).toBeVisible();
 const previsao=pagina.locator('[data-practice="cs-controle-prever-interrupcoes"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('14\n8\n0');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('laço');await expect(previsao.locator('[data-help] pre')).toHaveCount(0);await previsao.getByLabel('Saída prevista, uma linha por saída').fill('5\n0\n0');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const limite=pagina.locator('[data-practice="cs-controle-corrigir-limite"]');for(const valor of ['excluir','extra','igual']){await limite.locator('input[value="'+valor+'"]').check();await conferir(limite);await expect(limite.locator('.practice-feedback')).toContainText('última parcela');await expect(limite.locator('[data-help] pre')).toHaveCount(0);}
 const escolha=limite.locator('input[value="incluir"]');await escolha.focus();await escolha.press('Space');await conferir(limite);await expect(limite.locator('.practice-feedback')).toContainText('não houve execução');
 await expect(pagina.locator('.lesson-chapter').filter({has:pagina.getByRole('heading',{name:'Aplicação real pequena',exact:true})})).toContainText('revisão manual');
});

test('a reconstrução aceita chaves equivalentes e conserva assistência na retomada',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-controle');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');
 await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('return');await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
 await ordenar(pausa,alternativa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idOrdem]).toMatchObject({value:alternativa,passed:true,assisted:true});expect(salvo.adaptive.skills['csharp.controle.retorno'].review.lastOutcome).toBe('assisted');
});

test('controle C# mantém axe, teclado e leitura de 220 a 4000 px',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-controle');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa,ordem);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);}
});

test('a reconstrução de C# funciona offline e não consulta executor remoto',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))remotas.push(pedido.url());});await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{await pagina.goto('/#/aula/csharp-controle');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa,ordem);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('não houve execução');await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idOrdem]).toMatchObject({value:ordem,passed:true});expect(remotas).toEqual([]);}
 finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});

test('a exportação restaura a ordem alternativa e a assistência de controle C#',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-controle');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa,alternativa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idOrdem]).toMatchObject({value:alternativa,passed:true,assisted:true});expect(salvo.adaptive.skills['csharp.controle.retorno'].review.lastOutcome).toBe('assisted');
});
