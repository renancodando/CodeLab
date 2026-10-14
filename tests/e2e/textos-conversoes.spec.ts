import {test,expect,type Page,type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {buildDailySession,freshAdaptive} from '../../src/learning/adaptive';

test.use({timezoneId:'America/Sao_Paulo'});
const id='textos-corrigir-entrada';
async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
async function abrir(pagina:Page){await pagina.goto('/#/aula/strings-numbers');await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);}
async function larguras(pagina:Page){for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}}

test('textos: previsão, retorno ignorado e correção real mantêm assistência e projeto',async({page:pagina})=>{
 await abrir(pagina);expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="textos-prever-conversoes"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('5\n5\n0\nfalse');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('23\n5\n0\nfalse');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const normalizacao=pagina.locator('[data-practice="textos-guardar-normalizacao"]');await normalizacao.locator('input[value="remover"]').check();await conferir(normalizacao);await expect(normalizacao.locator('.practice-feedback')).toContainText('nome composto');await normalizacao.locator('input[value="guardar"]').check();await conferir(normalizacao);await expect(normalizacao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const correcao=pagina.locator('[data-practice="'+id+'"]');await conferir(correcao);await expect(correcao.locator('.practice-feedback')).toContainText('ausência');await expect(correcao.locator('[data-help] pre')).toHaveCount(0);
 const alternativa='const dobroTexto=texto=>{const limpo=texto.trim(),numero=+limpo;if(limpo===""||!isFinite(numero))throw new RangeError("Entrada inválida");return numero+numero;};';await correcao.getByLabel('Seu código corrigido').fill(alternativa);await conferir(correcao);await expect(correcao.locator('.practice-feedback')).toContainText('A correção passou');await expect(correcao.locator('.practice-feedback')).toContainText('executor JavaScript isolado');
 await correcao.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(correcao.locator('.practice-feedback')).toContainText('registrada como assistência');await pagina.reload();await expect(correcao.locator('textarea')).toHaveValue(alternativa);
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[id].assisted).toBe(true);expect(salvo.adaptive.skills['javascript.conversao'].review.lastOutcome).toBe('assisted');expect(salvo.adaptive.skills['javascript.conversao.operadores'].evidence['textos-prever-conversoes'].firstTry).toBe(false);
 await expect(pagina.locator('#aula-projeto')).toContainText('leitor de preço');expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);await larguras(pagina);
});

test('conversão de texto executa offline, rejeita prefixo e retoma o código sem submissão remota',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.reload();await abrir(pagina);const pausa=pagina.locator('[data-practice="'+id+'"]');
  await pausa.getByLabel('Seu código corrigido').fill('function dobroTexto(texto){const n=parseFloat(texto);if(!Number.isFinite(n))throw new Error();return n*2;}');await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('texto inválido');
  await pausa.getByLabel('Seu código corrigido').fill(getPracticeSolution(id)!);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou');await pagina.reload();await expect(pausa.locator('textarea')).toHaveValue(getPracticeSolution(id)!);
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[id].passed).toBe(true);expect(salvo.practiceAnswers[id].assisted).toBe(false);expect(salvo.adaptive.skills['javascript.conversao'].evidence[id].firstTry).toBe(false);expect(remotas).toEqual([]);
 }finally{await contexto.setOffline(false);}
});

test('a preparação de conversões orienta três atividades sem domínio pela leitura',async({page:pagina})=>{
 const estado=freshAdaptive(),preparacao=idPreparacao('strings-numbers'),relogio={now:Date.now(),timeZone:'America/Sao_Paulo'};
 estado.seenConcepts=adaptiveCatalog.activities.filter(a=>a.kind==='concept'&&a.id!==preparacao).map(a=>a.id);estado.daily=buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'javascript'},relogio);
 expect(estado.daily.items.map(i=>i.activityId)).toEqual([preparacao,'textos-prever-conversoes','textos-guardar-normalizacao',id]);
 await pagina.addInitScript(dados=>{if(!localStorage.getItem('codelab.progress.v2'))localStorage.setItem('codelab.progress.v2',JSON.stringify(dados));},{version:2,learningLanguage:'javascript',adaptive:estado});
 await pagina.goto('/#/diaria');await expect(pagina.locator('[data-current] h2')).toHaveText('Preparação: Strings, números e conversões');await pagina.getByRole('button',{name:'Concluir leitura e praticar',exact:true}).click();await expect(pagina.locator('[data-practice="textos-prever-conversoes"]')).toBeVisible();await expect(pagina.locator('[data-language]')).toBeDisabled();
 const depois=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive);expect(depois.skills).toEqual({});expect(depois.daily.iniciada).toBe(true);expect(depois.daily.completed).toEqual([preparacao]);
 await pagina.reload();await expect(pagina.locator('[data-practice="textos-prever-conversoes"]')).toBeVisible();expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive.daily)).toEqual(depois.daily);
});
