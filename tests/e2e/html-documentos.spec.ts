import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practicesForLesson} from '../../src/content/practice';
import html from '../../src/content/deep/html';

const pausas=practicesForLesson('html-documentos');
const atividade=(id:string)=>pausas.find(p=>p.id===id)!;
const montar=(ordem:string[])=>ordem.map(id=>atividade('html-documentos-montar-guia').lines!.find(l=>l.id===id)!.code).join('\n');
async function conferir(pagina:Page,id:string){const pausa=pagina.locator('[data-practice="'+id+'"]');await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();return pausa;}

test('documentos HTML: parser e atributos são conferidos por comportamento nativo',async({page:pagina})=>{
 await pagina.setContent(atividade('html-documentos-prever-arvore').code!);
 expect(await pagina.locator('main').evaluate(e=>Array.from(e.children).map(f=>f.tagName).join('|'))).toBe('P|SECTION|P');
 expect(await pagina.locator('#pratica').evaluate(e=>e.parentElement!.tagName)).toBe('MAIN');
 await expect(pagina.locator('#resumo')).toHaveText('Antes');await expect(pagina.locator('main > p').last()).toBeEmpty();
 await pagina.setContent('<!doctype html><main><p>Antes</p><section><h2>Praticar</h2></section>Depois</main>');
 expect(await pagina.locator('main').evaluate(e=>Array.from(e.children).map(f=>f.tagName))).toEqual(['P','SECTION']);
 const diagnostico=atividade('html-documentos-habilitar-controle');
 for(const opcao of [{id:'original',text:diagnostico.code!},...diagnostico.options!]){
  await pagina.setContent('<!doctype html><html lang="pt-BR"><head><title>Controle</title></head><body><a id="antes" href="#fim">Antes</a>'+opcao.text+'<a id="fim" href="#antes">Depois</a></body></html>');
  const botao=pagina.getByRole('button',{name:'Continuar',exact:true}),habilitado=opcao.id==='ausente';
  expect(await botao.isEnabled()).toBe(habilitado);
  await botao.evaluate(e=>{e.dataset.cliques='0';e.addEventListener('click',()=>{e.dataset.cliques=String(Number(e.dataset.cliques)+1);});(e as HTMLButtonElement).click();});
  await expect(botao).toHaveAttribute('data-cliques',habilitado?'1':'0');
  await pagina.locator('#antes').focus();await pagina.keyboard.press('Tab');
  if(habilitado){await expect(botao).toBeFocused();await pagina.keyboard.press('Enter');await expect(botao).toHaveAttribute('data-cliques','2');}
  else await expect(pagina.locator('#fim')).toBeFocused();
 }
});

test('montagens equivalentes mantêm metadados, destinos únicos e conteúdo sem scripts',async({page:pagina})=>{
 for(const ordem of [['inicio','pratica','revisao','fim'],['inicio','revisao','pratica','fim']]){
  await pagina.setContent(montar(ordem));
  expect(await pagina.evaluate(()=>document.compatMode)).toBe('CSS1Compat');await expect(pagina).toHaveTitle('Guia de prática & revisão');
  await expect(pagina.locator('html')).toHaveAttribute('lang','pt-BR');await expect(pagina.locator('meta[charset]')).toHaveAttribute('charset','utf-8');
  await expect(pagina.locator('main > section > h2')).toHaveText(ordem[1]==='pratica'?['Prática','Revisão']:['Revisão','Prática']);
  await expect(pagina.locator('script')).toHaveCount(0);await expect(pagina.locator('body > footer')).toContainText('Guarde suas dúvidas.');
  for(const id of ['pratica','revisao']){
   await expect(pagina.locator('[id="'+id+'"]').filter({has:pagina.locator('h2')})).toHaveCount(1);
   await pagina.locator('nav a[href="#'+id+'"]').click();expect(await pagina.evaluate(()=>location.hash)).toBe('#'+id);
   expect(await pagina.locator(':target').getAttribute('id')).toBe(id);
  }
  expect((await new AxeBuilder({page:pagina}).analyze()).violations).toEqual([]);
 }
 const aula=html.lessons.find(a=>a.id==='html-documentos')!;
 for(const fonte of [aula.code,aula.solution]){
  await pagina.setContent(fonte);await expect(pagina.locator('main')).toHaveCount(1);
  expect(await pagina.locator('[id]').evaluateAll(es=>new Set(es.map(e=>e.id)).size)).toBe(await pagina.locator('[id]').count());
  expect(await pagina.locator('nav a').evaluateAll(es=>es.every(e=>document.querySelectorAll('[id="'+(e as HTMLAnchorElement).hash.slice(1)+'"]').length===1))).toBe(true);
 }
});

test('documentos mantém tentativas, assistência e reconstrução alternativa offline',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))execucoes.push(r.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/html-documentos');await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
  expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'{}').adaptive?.skills??{})).toEqual({});
  const prever='html-documentos-prever-arvore',diagnosticar='html-documentos-habilitar-controle',reconstruir='html-documentos-montar-guia';
  const previsao=pagina.locator('[data-practice="'+prever+'"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill('P|SECTION\nMAIN\nAntes');await conferir(pagina,prever);await expect(previsao.locator('.practice-feedback')).toContainText('fechamento');
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill('P|SECTION|P\nMAIN\nAntes');await conferir(pagina,prever);await expect(previsao.locator('.practice-feedback')).toContainText('não houve execução de html');
  const diagnostico=pagina.locator('[data-practice="'+diagnosticar+'"]');await diagnostico.locator('input[value="aria"]').check();await conferir(pagina,diagnosticar);await expect(diagnostico.locator('.practice-feedback')).toContainText('comportamento nativo');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
  await diagnostico.locator('input[value="ausente"]').check();await conferir(pagina,diagnosticar);await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const reconstrucao=pagina.locator('[data-practice="'+reconstruir+'"]'),ordem=['inicio','revisao','pratica','fim'],atuais=atividade(reconstruir).lines!.map(l=>l.id);
  await conferir(pagina,reconstruir);await expect(reconstrucao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
  for(let destino=0;destino<ordem.length;destino++)for(let indice=atuais.indexOf(ordem[destino]);indice>destino;indice--){await reconstrucao.getByRole('button',{name:'Mover linha '+(indice+1)+' para cima'}).click();[atuais[indice-1],atuais[indice]]=[atuais[indice],atuais[indice-1]];}
  await conferir(pagina,reconstruir);await expect(reconstrucao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await reconstrucao.getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload({waitUntil:'domcontentloaded'});
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers[reconstruir]).toMatchObject({value:ordem,passed:true,assisted:true});expect(salvo.adaptive.skills['html.documentos.fragmentos-unicos'].review.lastOutcome).toBe('assisted');expect(salvo.practiceAnswers[prever].attempts).toBe(2);expect(salvo.practiceAnswers[diagnosticar].assisted).toBe(false);
  await expect(pagina.locator('#aula-projeto')).toContainText('três artigos');
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:1000});const antes=await pagina.evaluate(()=>({viewport:innerWidth,largura:document.documentElement.scrollWidth}));await pagina.evaluate(()=>new Promise<void>(resolver=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolver()))));const depois=await pagina.evaluate(()=>({viewport:innerWidth,largura:document.documentElement.scrollWidth,excedentes:[...document.querySelectorAll('body *')].map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,classe:String(e.className),direita:r.right,largura:r.width};}).filter(e=>e.direita>innerWidth+1).slice(0,12)}));await test.info().attach('layout-'+largura,{body:JSON.stringify({antes,depois}),contentType:'application/json'});console.log('LAYOUT',JSON.stringify({antes,depois}));expect(depois.largura-depois.viewport).toBeLessThanOrEqual(1);for(const pausa of pausas)await expect(pagina.locator('[data-practice="'+pausa.id+'"]').getByRole('button',{name:'Conferir comportamento',exact:true})).toBeVisible();}
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
