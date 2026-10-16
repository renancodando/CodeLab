import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const codigo=(id:string)=>practiceActivities.find(item=>item.id===id)!.code!;
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-movimento.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de movimento</title></head><body><main><h1>Referência de movimento</h1>'+conteudo+'</main></body></html>'}));
 await pagina.goto('/referencia-movimento.html');
}

test('transição nativa interpola pelo tempo e não redistribui os vizinhos',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'no-preference'});
 await documento(pagina,codigo('css-prever-transicao'));
 const resultado=await pagina.locator('.indicador').evaluate(item=>{
  const vizinho=item.nextElementSibling!,antes=vizinho.getBoundingClientRect().left;
  getComputedStyle(item).transform;
  item.parentElement!.classList.add('ativa');
  const animacao=item.getAnimations()[0];animacao.pause();
  const valores=[100,400].map(instante=>{animacao.currentTime=instante;return new DOMMatrixReadOnly(getComputedStyle(item).transform).m41+'px';});
  return{valores,vizinhoMoveu:vizinho.getBoundingClientRect().left!==antes};
 });
 expect(resultado.valores.join('\n')).toBe(getPracticeSolution('css-prever-transicao'));
 expect(resultado.vizinhoMoveu).toBe(false);
 await documento(pagina,codigo('css-prever-transicao'));
 await pagina.locator('.faixa').evaluate(item=>{const outra=item.cloneNode(true) as HTMLElement;outra.classList.add('outra');item.after(outra);const estilo=document.createElement('style');estilo.textContent='.outra .indicador{transition-duration:800ms}.outra.ativa .indicador{transform:translateX(120px)}';document.head.append(estilo);});
 expect(await pagina.locator('.indicador').evaluateAll(itens=>itens.map(item=>{
  getComputedStyle(item).transform;item.parentElement!.classList.add('ativa');
  const animacao=item.getAnimations()[0];animacao.pause();
  return[100,800].map(instante=>{animacao.currentTime=instante;return new DOMMatrixReadOnly(getComputedStyle(item).transform).m41;});
 }))).toEqual([[20,80],[15,120]]);
});

test('movimento reduzido remove keyframes, conserva texto e foco e não congela um pulso',async({page:pagina})=>{
 const defeito=codigo('css-diagnosticar-movimento');
 const congelar=()=>pagina.locator('.selo').evaluate(item=>{const animacao=item.getAnimations()[0];animacao.pause();animacao.currentTime=500;return new DOMMatrixReadOnly(getComputedStyle(item).transform).a;});
 const escala=()=>pagina.locator('.selo').evaluate(item=>new DOMMatrixReadOnly(getComputedStyle(item).transform).a);
 await pagina.emulateMedia({reducedMotion:'no-preference'});await documento(pagina,defeito);
 expect(await congelar()).toBeCloseTo(1.1);
 await pagina.emulateMedia({reducedMotion:'reduce'});
 expect(await escala()).toBeCloseTo(1.1);
 expect(await pagina.locator('.selo').evaluate(item=>item.getAnimations().length)).toBe(1);
 await pagina.emulateMedia({reducedMotion:'no-preference'});
 await documento(pagina,defeito.replace('transition:none;','transition:none; animation-play-state:paused;'));
 await congelar();await pagina.emulateMedia({reducedMotion:'reduce'});
 expect(await escala()).toBeCloseTo(1.1);
 await documento(pagina,defeito.replace('transition:none;','transition:none; visibility:hidden;'));
 await expect(pagina.locator('.selo')).toBeHidden();
 await pagina.emulateMedia({reducedMotion:'no-preference'});
 await documento(pagina,getPracticeSolution('css-diagnosticar-movimento')!);
 expect(await congelar()).toBeCloseTo(1.1);
 await pagina.getByRole('button',{name:'Salvar',exact:true}).focus();
 await pagina.emulateMedia({reducedMotion:'reduce'});
 expect(await escala()).toBe(1);
 expect(await pagina.locator('.selo').evaluate(item=>item.getAnimations().length)).toBe(0);
 await expect(pagina.getByRole('status')).toBeVisible();await expect(pagina.getByRole('status')).toHaveText('Salvo');
 await expect(pagina.getByRole('button',{name:'Salvar',exact:true})).toBeFocused();
 await documento(pagina,getPracticeSolution('css-diagnosticar-movimento')!);
 expect(await escala()).toBe(1);
 await pagina.keyboard.press('Tab');await expect(pagina.getByRole('button',{name:'Salvar',exact:true})).toBeFocused();
});

test('animações praticadas preservam assistência, revisão, teclado e projeto',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});
 await pagina.goto('/#/aula/animacoes');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);
 await expect(pagina.locator('[data-inline-practice]')).toHaveCount(2);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="css-prever-transicao"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('80px\n80px');
 await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('fração do tempo');
 await expect(previsao.locator('[data-help] pre')).toHaveCount(0);
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('20px\n80px');
 await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="css-diagnosticar-movimento"]');
 await diagnostico.locator('input[value="pausar"]').check();
 await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('escala intermediária');
 await diagnostico.locator('input[value="remover"]').focus();await pagina.keyboard.press('Space');
 await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await diagnostico.getByRole('button',{name:'Consultar solução',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('assistência');
 await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.practiceAnswers['css-diagnosticar-movimento'].assisted).toBe(true);
 expect(salvo.adaptive.skills['css.movimento.reducao'].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('#aula-projeto')).toContainText('lista de tarefas');
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});

test('animações offline retomam respostas sem inventar execução de CSS',async({page:pagina,context:contexto})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/animacoes');
  const previsao=pagina.locator('[data-practice="css-prever-transicao"]');
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill('20px\n80px');
  await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(previsao.locator('.practice-feedback')).toContainText('não houve execução de css');
  await pagina.reload();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['css-prever-transicao']).toMatchObject({passed:true,assisted:false,value:'20px\n80px'});
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
