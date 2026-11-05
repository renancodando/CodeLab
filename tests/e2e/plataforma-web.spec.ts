import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities,practicesForLesson} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(p=>p.id===id)!;
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-plataforma.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de plataforma</title></head><body>'+conteudo+'</body></html>'}));
 await pagina.goto('/referencia-plataforma.html');
}
const conferir=async(pagina:Page,id:string)=>pagina.locator('[data-practice="'+id+'"]').getByRole('button',{name:'Conferir comportamento',exact:true}).click();
test('DOM real transfere fragmentos, conserva o molde e mantém texto literal em duas listas',async({page:pagina})=>{
 await documento(pagina,atividade('html-plataforma-prever-fragmento').code!);
 expect(await pagina.evaluate(()=>[document.querySelector('#lista')!.children.length,(document.querySelector('#modelo') as HTMLTemplateElement).content.childElementCount].join('\n'))).toBe(getPracticeSolution('html-plataforma-prever-fragmento'));
 const montagem=getPracticeSolution('html-plataforma-montar-nota')!,base='<template id="modelo"><li><span></span></li></template><ul id="a"></ul><ul id="b"></ul>';
 await documento(pagina,base+'<script>'+montagem+'</script>');
 await pagina.evaluate(()=>{const inserir=(window as unknown as {adicionarNota:(lista:Element,texto:string)=>void}).adicionarNota;inserir(document.querySelector('#a')!,'<strong>Texto recebido</strong>');inserir(document.querySelector('#b')!,'Outro');inserir(document.querySelector('#a')!,'');});
 await expect(pagina.locator('#a span')).toHaveText(['<strong>Texto recebido</strong>','']);await expect(pagina.locator('#b span')).toHaveText('Outro');await expect(pagina.locator('strong')).toHaveCount(0);
 expect(await pagina.locator('#modelo').evaluate(e=>(e as HTMLTemplateElement).content.childElementCount)).toBe(1);
 await documento(pagina,base+'<script>'+montagem.replace('textContent = texto','innerHTML = texto')+'</script>');
 await pagina.evaluate("adicionarNota(document.querySelector('#a'), '<strong>Texto recebido</strong>')");await expect(pagina.locator('#a strong')).toHaveCount(1);
 await documento(pagina,base+'<script>'+montagem.replace('modelo.content.cloneNode(true)','modelo.content')+'</script>');
 await pagina.evaluate("adicionarNota(document.querySelector('#a'), 'Primeira')");expect(await pagina.locator('#modelo').evaluate(e=>(e as HTMLTemplateElement).content.childElementCount)).toBe(0);
});
test('custom elements: somente a referência estável atende remoção, reinserção e duas instâncias',async({page:pagina})=>{
 const pausa=atividade('html-plataforma-limpar-listener'),defeito=pausa.options!.find(o=>o.id==='bind-novo')!.text;
 for(const opcao of pausa.options!){
  await documento(pagina,'<script>'+pausa.code!.replace(defeito,opcao.text)+'</script>');
  const contagens=await pagina.evaluate(()=>{const a=document.createElement('contador-local'),b=document.createElement('contador-local');document.body.append(a,b);const enviar=()=>window.dispatchEvent(new Event('marcar')),ler=()=>[Number(a.textContent),Number(b.textContent)];enviar();enviar();const antes=ler();a.remove();enviar();const removido=ler();document.body.append(a);enviar();const reinserido=ler();b.remove();enviar();return[antes,removido,reinserido,ler()];});
  expect(JSON.stringify(contagens)===JSON.stringify([[2,2],[2,3],[3,4],[4,4]])).toBe(opcao.id==='referencia');
 }
});
async function fases(pagina:Page){return pagina.locator('.selo').evaluate(e=>{const animacao=e.getAnimations()[0];animacao.pause();return[0,600,1200].map(tempo=>{animacao.currentTime=tempo;return Number(getComputedStyle(e).opacity);});});}
test('CSS nativo distingue atraso, intervalo ativo e preenchimento antes e depois',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'no-preference'});await documento(pagina,atividade('css-visual-prever-preenchimento').code!);
 const previsto=getPracticeSolution('css-visual-prever-preenchimento')!.split('\n').map(Number);const medidas=await fases(pagina);medidas.forEach((valor,i)=>expect(valor).toBeCloseTo(previsto[i],4));
 const molde=atividade('css-visual-completar-fases').code!;
 for(const [valor,esperado] of [['both',[.2,.5,.8]],['backwards',[.2,.5,1]],['forwards',[1,.5,.8]],['none',[1,.5,1]]] as const){await documento(pagina,molde.replace('____',valor));const medido=await fases(pagina);medido.forEach((numero,i)=>expect(numero).toBeCloseTo(esperado[i],4));}
});
test('CSS nativo aplica alfa só ao fundo e mantém a cor do texto',async({page:pagina})=>{
 const pausa=atividade('css-visual-isolar-transparencia');
 for(const opcao of pausa.options!){await documento(pagina,pausa.code!+'<style>'+opcao.text+'</style>');const correto=await pagina.locator('.aviso').evaluate(e=>{const estilo=getComputedStyle(e),texto=getComputedStyle(e.querySelector('strong')!);return estilo.opacity==='1'&&estilo.visibility==='visible'&&estilo.backgroundColor==='rgba(255, 255, 255, 0.25)'&&texto.color==='rgb(23, 62, 54)';});expect(correto).toBe(opcao.id==='fundo');}
});
test('CSS nativo verifica camadas, condição exata de subgrid e restauração por estado',async({page:pagina})=>{
 const camadas=atividade('css-arquitetura-prever-camadas').code!,ler=()=>pagina.locator('#aviso').evaluate(e=>['--normal','--forte'].map(p=>getComputedStyle(e).getPropertyValue(p).trim()).join('\n'));
 await documento(pagina,camadas);expect(await ler()).toBe(getPracticeSolution('css-arquitetura-prever-camadas'));
 await documento(pagina,camadas.replace('@layer base, componentes;','@layer componentes, base;'));expect(await ler()).toBe('fora\ncomponente');
 const subgrid=atividade('css-arquitetura-consultar-subgrid').code!;await documento(pagina,subgrid);await expect(pagina.locator('.grupo')).toHaveText('NomeDescrição');await expect(pagina.locator('.grupo')).toHaveCSS('display','block');
 expect(await pagina.evaluate(()=>[CSS.supports('display','subgrid'),CSS.supports('grid-template-columns','subgrid')])).toEqual([false,true]);
 await documento(pagina,subgrid.replace('@supports (display:subgrid)',getPracticeSolution('css-arquitetura-consultar-subgrid')!));
 expect(await pagina.locator('.grupo span').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width))).toEqual([90,150]);
 const molde=atividade('css-arquitetura-restaurar-camada').code!,cores=()=>pagina.locator('.aviso').evaluateAll(es=>es.map(e=>getComputedStyle(e).color));
 for(const tentativa of ['initial','inherit','revert']){await documento(pagina,molde.replace('____',tentativa));expect(await cores()).not.toEqual(['rgb(0, 0, 128)','rgb(128, 0, 0)']);}
 await documento(pagina,molde.replace('____',getPracticeSolution('css-arquitetura-restaurar-camada')!));expect(await cores()).toEqual(['rgb(0, 0, 128)','rgb(128, 0, 0)']);await expect(pagina.locator('.aviso').first()).toHaveCSS('padding','12px');
 await documento(pagina,molde.replace('____','revert-layer').replace('color:navy','color:#123456').replace('color:maroon','color:#654321'));expect(await cores()).toEqual(['rgb(18, 52, 86)','rgb(101, 67, 33)']);
});
for(const aula of ['html-plataforma','css-visual-movimento','css-arquitetura'])test(aula+': prática conceitual persiste e não converte leitura em domínio',async({page:pagina,context:contexto})=>{
 const pausas=practicesForLesson(aula),offline=aula==='html-plataforma',remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});await pagina.emulateMedia({reducedMotion:'reduce'});
 if(offline){await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);}
 try{
  await pagina.goto('/#/aula/'+aula);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'{}').adaptive?.skills??{})).toEqual({});
  for(const pausa of pausas){
   const cartao=pagina.locator('[data-practice="'+pausa.id+'"]');await conferir(pagina,pausa.id);await expect(cartao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');await expect(cartao.locator('[data-help] pre')).toHaveCount(0);
   if(pausa.kind==='choice')await cartao.locator('input[value="'+({'html-plataforma-limpar-listener':'referencia','css-visual-isolar-transparencia':'fundo','css-arquitetura-consultar-subgrid':'propriedade'}[pausa.id])+'"]').check();
   else if(pausa.kind==='order'){const ordem=['abrir','modelo','clonar','texto','anexar','fechar'],atuais=pausa.lines!.map(l=>l.id);for(let destino=0;destino<ordem.length;destino++)for(let indice=atuais.indexOf(ordem[destino]);indice>destino;indice--){await cartao.getByRole('button',{name:'Mover linha '+(indice+1)+' para cima'}).click();[atuais[indice-1],atuais[indice]]=[atuais[indice],atuais[indice-1]];}}
   else await cartao.getByRole('textbox').fill(getPracticeSolution(pausa.id)!);
   await conferir(pagina,pausa.id);await expect(cartao.locator('.practice-feedback')).toContainText('Sua resposta está correta');await expect(cartao.locator('.practice-feedback')).toContainText('não houve execução de '+pausa.language);
  }
  const ultima=pausas.at(-1)!;await pagina.locator('[data-practice="'+ultima.id+'"]').getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload({waitUntil:'domcontentloaded'});await expect(pagina.locator('#aula-projeto')).toBeVisible();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[ultima.id]).toMatchObject({passed:true,assisted:true,attempts:2});expect(salvo.adaptive.skills[ultima.skillIds[0]].review.lastOutcome).toBe('assisted');
  if(offline){expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:1000});const excesso=await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(excesso>1)console.log('Caixas fora da viewport',largura,await pagina.evaluate(()=>[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,classe:e.className,id:e.id,direita:Math.round(e.getBoundingClientRect().right),largura:Math.round(e.getBoundingClientRect().width),minimo:getComputedStyle(e).minWidth,overflow:getComputedStyle(e).overflowX,quebra:getComputedStyle(e).overflowWrap,espacos:getComputedStyle(e).whiteSpace,texto:e.textContent?.slice(0,45)})).filter(e=>e.direita>innerWidth+1&&e.largura>innerWidth-50).sort((a,b)=>a.largura-b.largura).slice(0,30)));expect(excesso).toBeLessThanOrEqual(1);for(const pausa of pausas)await expect(pagina.locator('[data-practice="'+pausa.id+'"]').getByRole('button',{name:'Conferir comportamento',exact:true})).toBeVisible();}}
  expect(remotas).toEqual([]);
 }finally{if(offline&&!pagina.isClosed())await contexto.setOffline(false);}
});
