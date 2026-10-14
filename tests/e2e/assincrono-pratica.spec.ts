import {test,expect,type Locator,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {freshAdaptive,recordEvidence} from '../../src/learning/adaptive';
import {getPracticeSolution} from '../../src/learning/practice';

const alternativa='function lerResposta(obter){return obter().then(r=>{if(!r.ok)throw new Error("HTTP");return r.json();});}';
async function abrir(pagina:Page){await pagina.goto('/#/aula/async');await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);}
async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}

test('async: espera, diagnóstico HTTP e correção real conservam assistência, revisão e projeto',async({page:pagina})=>{
 await abrir(pagina);expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="async-prever-espera"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('Antes\nInício\n7\nDepois');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('O início do corpo ainda é síncrono');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('Antes\nInício\nDepois\n7');await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="async-diagnosticar-http"]');await diagnostico.locator('input[value="segundo-await"]').check();await conferir(diagnostico);await expect(diagnostico.locator('.practice-feedback')).toContainText('Um 404 pode resolver');await diagnostico.locator('input[value="status"]').check();await conferir(diagnostico);await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const correcao=pagina.locator('[data-practice="async-corrigir-resposta"]');await conferir(correcao);await expect(correcao.locator('.practice-feedback')).toContainText('HTTP');await expect(correcao.locator('[data-help] pre')).toHaveCount(0);
 const campo=correcao.getByRole('textbox',{name:'Seu código corrigido',exact:true});await campo.fill('async function lerResposta(obter){const r=await obter();return r.json();}');await conferir(correcao);await expect(correcao.locator('.practice-feedback')).toContainText('antes de json');await campo.fill(alternativa);await conferir(correcao);await expect(correcao.locator('.practice-feedback')).toContainText('A correção passou');await expect(correcao.locator('.practice-feedback')).toContainText('executor JavaScript isolado');
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['async-corrigir-resposta']).toMatchObject({passed:true,assisted:false});expect(salvo.adaptive.skills['javascript.assincrono.http'].evidence['async-corrigir-resposta'].firstTry).toBe(false);
 await correcao.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(correcao.locator('.practice-feedback')).toContainText('registrada como assistência');await pagina.reload();await expect(campo).toHaveValue(alternativa);
 const retomado=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(retomado.practiceAnswers['async-corrigir-resposta'].assisted).toBe(true);expect(retomado.adaptive.skills['javascript.assincrono.propagacao'].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('#aula-projeto')).toContainText('cancelamento da consulta anterior');expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});

test('Promises reais funcionam offline e uma Promise pendente não impede a tentativa seguinte',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.reload();await abrir(pagina);const pausa=pagina.locator('[data-practice="async-corrigir-resposta"]'),campo=pausa.getByRole('textbox',{name:'Seu código corrigido',exact:true});
  await campo.fill('function lerResposta(obter){return new Promise(()=>{});}');await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('pendente');await campo.fill(getPracticeSolution('async-corrigir-resposta')!);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou');await pagina.reload();await expect(campo).toHaveValue(getPracticeSolution('async-corrigir-resposta')!);
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['async-corrigir-resposta']).toMatchObject({passed:true,assisted:false});expect(remotas).toEqual([]);
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});

test('uma jornada com 128 habilidades conserva novas evidências na exportação e restauração',async({page:pagina})=>{
 await abrir(pagina);const relogio=await pagina.evaluate(()=>({now:Date.now(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone})),estado=freshAdaptive();
 const anteriores=adaptiveCatalog.skills.filter(h=>!h.id.startsWith('javascript.assincrono.')).slice(0,128);expect(anteriores).toHaveLength(128);
 for(const [indice,habilidade] of anteriores.entries())recordEvidence(estado,{id:'tentativa-antiga-'+indice,assessmentId:'problema-antigo-'+indice,activityId:'problema-antigo-'+indice,skillIds:[habilidade.id],revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'practice'},relogio);
 await pagina.evaluate(adaptive=>{const salvo=JSON.parse(localStorage.getItem('codelab.progress.v2')??'{"version":2}');salvo.adaptive=adaptive;localStorage.setItem('codelab.progress.v2',JSON.stringify(salvo));},estado);
 await pagina.reload();const pausa=pagina.locator('[data-practice="async-corrigir-resposta"]');await pausa.getByRole('textbox',{name:'Seu código corrigido',exact:true}).fill(alternativa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou');
 await pagina.goto('/#/perfil');const pendente=pagina.waitForEvent('download');await pagina.locator('#export-progress').click();const fluxo=await(await pendente).createReadStream(),partes:Buffer[]=[];for await(const parte of fluxo!)partes.push(Buffer.from(parte));const backup=Buffer.concat(partes),dados=JSON.parse(backup.toString());
 expect(Object.keys(dados.adaptive.skills)).toHaveLength(131);for(const habilidade of anteriores)expect(dados.adaptive.skills[habilidade.id]).toEqual(estado.skills[habilidade.id]);
 await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:backup});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await abrir(pagina);await pagina.reload();
 const restaurado=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(restaurado.adaptive.skills).toEqual(dados.adaptive.skills);expect(restaurado.practiceAnswers['async-corrigir-resposta']).toMatchObject({passed:true,assisted:false,value:alternativa});
});
