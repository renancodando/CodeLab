import {test,expect,type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';
import {practiceActivities} from '../../src/content/practice';

const idOrdem='cs-colecoes-reconstruir-total';
const ordem=['metodo','validos','valores','retornar','fechar'];
async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
async function ordenar(pausa:Locator){
 const linhas=practiceActivities.find(atividade=>atividade.id===idOrdem)!.lines!;
 const codigos=await pausa.locator('.practice-order code').allTextContents();
 const ids=codigos.map(codigo=>linhas.find(linha=>linha.code===codigo)!.id);
 for(let indice=0;indice<ordem.length;indice++){
  let posicao=ids.indexOf(ordem[indice]);
  while(posicao>indice){const botao=pausa.getByRole('button',{name:'Mover linha '+(posicao+1)+' para cima',exact:true});await botao.focus();await botao.press('Space');[ids[posicao],ids[posicao-1]]=[ids[posicao-1],ids[posicao]];posicao--;}
 }
}

test('coleções conserva a aula e pratica presença e materialização filtrada',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-colecoes');await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 for(const [bloco,id] of [[3,'cs-colecoes-prever-busca'],[6,'cs-colecoes-materializar-filtro'],[8,idOrdem]] as const)await expect(pagina.locator('.lesson-chapter').nth(bloco).locator('[data-practice="'+id+'"]')).toBeVisible();
 const previsao=pagina.locator('[data-practice="cs-colecoes-prever-busca"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('True:0\nFalse:99\n2');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('out');await expect(previsao.locator('[data-help] pre')).toHaveCount(0);await previsao.getByLabel('Saída prevista, uma linha por saída').fill('True:0\nFalse:0\n2');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const filtro=pagina.locator('[data-practice="cs-colecoes-materializar-filtro"]');for(const valor of ['adiar','origem','copiar-tudo']){await filtro.locator('input[value="'+valor+'"]').check();await conferir(filtro);await expect(filtro.locator('.practice-feedback')).toContainText('Add');await expect(filtro.locator('[data-help] pre')).toHaveCount(0);}
 const escolha=filtro.locator('input[value="copiar"]');await escolha.focus();await escolha.press('Space');await conferir(filtro);await expect(filtro.locator('.practice-feedback')).toContainText('não houve execução');
 await expect(pagina.locator('.lesson-chapter').filter({has:pagina.getByRole('heading',{name:'Aplicação real pequena',exact:true})})).toContainText('revisão manual');
});

test('a composição do total funciona pelo teclado e registra assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-colecoes');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');
 await expect(pausa.locator('.example-code')).toContainText('class Pedido');await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('filtrados');await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
 await ordenar(pausa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idOrdem]).toMatchObject({value:ordem,passed:true,assisted:true});expect(salvo.adaptive.skills['csharp.colecoes.composicao'].review.lastOutcome).toBe('assisted');
});

test('coleções mantém axe e conteúdo completo de 220 a 4000 px',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-colecoes');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);await expect(pausa.locator('.example-code')).toContainText('class Pedido');}
});

test('a composição de coleções funciona offline sem executor remoto',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))remotas.push(pedido.url());});await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{await pagina.goto('/#/aula/csharp-colecoes');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('não houve execução');await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idOrdem]).toMatchObject({value:ordem,passed:true});expect(remotas).toEqual([]);}
 finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});

test('o backup recupera o total reconstruído e sua assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-colecoes');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idOrdem]).toMatchObject({value:ordem,passed:true,assisted:true});expect(salvo.adaptive.skills['csharp.colecoes.composicao'].review.lastOutcome).toBe('assisted');
});
