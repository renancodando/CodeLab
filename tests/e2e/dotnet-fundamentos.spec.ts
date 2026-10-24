import {test,expect,type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';
import {practiceActivities} from '../../src/content/practice';

const idOrdem='cs-dotnet-reconstruir-total';
const ordemAlternativa=['quantidade','centavos','preco','saida'];
async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
async function ordenar(pausa:Locator,desejada:string[]){
 const codigos=practiceActivities.find(atividade=>atividade.id===idOrdem)!.lines!;
 const atuais=await pausa.locator('.practice-order code').allTextContents();
 const ids=atuais.map(codigo=>codigos.find(linha=>linha.code===codigo)!.id);
 for(let indice=0;indice<desejada.length;indice++){
  let posicao=ids.indexOf(desejada[indice]);
  while(posicao>indice){
   const botao=pausa.getByRole('button',{name:'Mover linha '+(posicao+1)+' para cima',exact:true});await botao.focus();await botao.press('Space');
   [ids[posicao],ids[posicao-1]]=[ids[posicao-1],ids[posicao]];posicao--;
  }
 }
}

test('a aula .NET conserva teoria e trabalha divisão e diagnóstico antes da solução',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/dotnet');await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 for(const [bloco,id] of [[3,'cs-dotnet-prever-divisao'],[6,'cs-dotnet-diagnosticar-inferencia'],[8,idOrdem]] as const)await expect(pagina.locator('.lesson-chapter').nth(bloco).locator('[data-practice="'+id+'"]')).toBeVisible();
 const previsao=pagina.locator('[data-practice="cs-dotnet-prever-divisao"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('2\n2.5\n2.5');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('fração');await expect(previsao.locator('[data-help] pre')).toHaveCount(0);
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('2\n2.0\n2.5');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('não houve execução');
 const diagnostico=pagina.locator('[data-practice="cs-dotnet-diagnosticar-inferencia"]');
 for(const valor of ['inferir','inteiro','depois']){await diagnostico.locator('input[value="'+valor+'"]').check();await conferir(diagnostico);await expect(diagnostico.locator('.practice-feedback')).toContainText('resultado');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);}
 const escolha=diagnostico.locator('input[value="decimal"]');await escolha.focus();await escolha.press('Space');await conferir(diagnostico);await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await expect(pagina.locator('.lesson-chapter').filter({has:pagina.getByRole('heading',{name:'Aplicação real pequena',exact:true})})).toContainText('revisão manual');
});

test('a reconstrução aceita dependências equivalentes pelo teclado e registra assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/dotnet');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');
 await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('declarado');await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
 await ordenar(pausa,ordemAlternativa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idOrdem]).toMatchObject({value:ordemAlternativa,passed:true,assisted:true});expect(salvo.adaptive.skills['csharp.fundamentos.dependencias'].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('[data-practice="'+idOrdem+'"] .practice-order code').first()).toHaveText('int quantidade = 4;');
});

test('as pausas e a solução de .NET mantêm acessibilidade e leitura de 220 a 4000 px',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/dotnet');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa,ordemAlternativa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);}
});

test('a reconstrução .NET funciona offline sem afirmar compilação nem chamar executor remoto',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))remotas.push(pedido.url());});await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{await pagina.goto('/#/aula/dotnet');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa,ordemAlternativa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('não houve execução');await pagina.reload();await expect(pagina.locator('[data-practice="'+idOrdem+'"] .practice-order code').first()).toHaveText('int quantidade = 4;');expect(remotas).toEqual([]);}
 finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});

test('a exportação recupera a ordem alternativa e sua assistência sem fabricar domínio',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/dotnet');const pausa=pagina.locator('[data-practice="'+idOrdem+'"]');await ordenar(pausa,ordemAlternativa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idOrdem]).toMatchObject({value:ordemAlternativa,passed:true,assisted:true});expect(salvo.adaptive.skills['csharp.fundamentos.dependencias'].review.lastOutcome).toBe('assisted');
});
