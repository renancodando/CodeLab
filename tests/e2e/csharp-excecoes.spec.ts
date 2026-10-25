import {test,expect,type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';

const idLeitura='cs-async-aguardar-leitura';
const expressao='await leitor.ReadToEndAsync(token).ConfigureAwait(false)';
async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}

test('exceções conserva a aula e distingue retorno e limpeza',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-async');await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 for(const [bloco,id] of [[3,'cs-async-prever-finally'],[6,'cs-async-diagnosticar-teste'],[8,idLeitura]] as const)await expect(pagina.locator('.lesson-chapter').nth(bloco).locator('[data-practice="'+id+'"]')).toBeVisible();
 const prever=pagina.locator('[data-practice="cs-async-prever-finally"]');await prever.getByLabel('Saída prevista, uma linha por saída').fill('4\nfim\nrecusa\nfim\n-1');await conferir(prever);await expect(prever.locator('.practice-feedback')).toContainText('finally');await expect(prever.locator('[data-help] pre')).toHaveCount(0);await prever.getByLabel('Saída prevista, uma linha por saída').fill('fim\n4\nrecusa\nfim\n-1');await conferir(prever);await expect(prever.locator('.practice-feedback')).toContainText('Sua resposta está correta');

 await expect(pagina.locator('.lesson-chapter').filter({has:pagina.getByRole('heading',{name:'Aplicação real pequena',exact:true})})).toContainText('Revisão manual');
});

test('a captura específica distingue o erro esperado da falha do próprio teste',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-async');
 const diagnostico=pagina.locator('[data-practice="cs-async-diagnosticar-teste"]');for(const valor of ['generica','aritmetica','divisao']){await diagnostico.locator('input[value="'+valor+'"]').check();await conferir(diagnostico);await expect(diagnostico.locator('.practice-feedback')).toContainText('próprio teste');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);}
 const escolha=diagnostico.locator('input[value="especifica"]');await escolha.focus();await escolha.press('Space');await conferir(diagnostico);await expect(diagnostico.locator('.practice-feedback')).toContainText('não houve execução');
});

test('aguardar a leitura aceita forma equivalente pelo teclado e registra assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-async');const pausa=pagina.locator('[data-practice="'+idLeitura+'"]');
 await pausa.getByLabel('Trecho que falta').fill('leitor.ReadToEndAsync(token).Result');await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('using');await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
 const campo=pausa.getByLabel('Trecho que falta');await campo.fill(expressao);await campo.focus();await campo.press('Tab');await pagina.keyboard.press('Space');await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idLeitura]).toMatchObject({value:expressao,passed:true,assisted:true});expect(salvo.adaptive.skills['csharp.assincrono.descarte'].review.lastOutcome).toBe('assisted');
});

test('exceções mantém axe e código completo de 220 a 4000 px',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-async');const pausa=pagina.locator('[data-practice="'+idLeitura+'"]');await pausa.getByLabel('Trecho que falta').fill(expressao);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);await expect(pausa.locator(':scope > .example-code')).toContainText('using (leitor)');await expect(pausa.locator(':scope > .example-code')).toBeVisible();await expect(pausa.locator('[data-help] > .example-code')).toContainText('await leitor.ReadToEndAsync(token)');await expect(pausa.locator('[data-help] > .example-code')).toBeVisible();}
});

test('a espera conceitual funciona offline sem executor remoto',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',pedido=>{if(/\/api\/(executions|execute|run|submissions)/.test(pedido.url()))remotas.push(pedido.url());});await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{await pagina.goto('/#/aula/csharp-async');const pausa=pagina.locator('[data-practice="'+idLeitura+'"]');await pausa.getByLabel('Trecho que falta').fill(expressao);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('não houve execução');await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idLeitura]).toMatchObject({value:expressao,passed:true});expect(remotas).toEqual([]);}
 finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});

test('o backup recupera a expressão de leitura e sua assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/csharp-async');const pausa=pagina.locator('[data-practice="'+idLeitura+'"]');await pausa.getByLabel('Trecho que falta').fill(expressao);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idLeitura]).toMatchObject({value:expressao,passed:true,assisted:true});expect(salvo.adaptive.skills['csharp.assincrono.descarte'].review.lastOutcome).toBe('assisted');
});
