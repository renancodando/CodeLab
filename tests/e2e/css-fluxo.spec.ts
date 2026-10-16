import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const codigo=(id:string)=>practiceActivities.find(item=>item.id===id)!.code!;
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-fluxo.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de fluxo</title></head><body><main><h1>Referência de fluxo</h1>'+conteudo+'</main></body></html>'}));
 await pagina.goto('/referencia-fluxo.html');
}

test('margens nativas distinguem colapso e soma, incluindo zero e sobreposição',async({page:pagina})=>{
 await documento(pagina,codigo('css-fluxo-prever-margens'));
 const distancias=()=>pagina.locator('.grupo').evaluateAll(grupos=>grupos.map(grupo=>grupo.children[1].getBoundingClientRect().top-grupo.children[0].getBoundingClientRect().bottom));
 expect((await distancias()).map(valor=>valor+'px').join('\n')).toBe(getPracticeSolution('css-fluxo-prever-margens'));
 expect(await pagina.evaluate(()=>['30.00PX','5e1px'].map(valor=>{const caixa=document.createElement('div');caixa.style.width=valor;document.body.append(caixa);const medida=getComputedStyle(caixa).width;caixa.remove();return medida;}))).toEqual(['30px','50px']);
 for(const [inferior,superior,normal,flex] of [[10,40,40,50],[0,0,0,0],[30,-10,20,20],[-20,-10,-20,-30]]){
  await pagina.locator('.primeiro').evaluateAll((itens,valor)=>itens.forEach(item=>(item as HTMLElement).style.marginBottom=valor+'px'),inferior);
  await pagina.locator('.segundo').evaluateAll((itens,valor)=>itens.forEach(item=>(item as HTMLElement).style.marginTop=valor+'px'),superior);
  expect(await distancias()).toEqual([normal,flex]);
 }
});

test('empilhamento nativo limita o selo ao contexto e reage à alteração do ancestral',async({page:pagina})=>{
 const defeito=codigo('css-fluxo-diagnosticar-camadas');
 const acima=()=>pagina.locator('.palco').evaluateAll(palcos=>palcos.map(palco=>{const caixa=palco.getBoundingClientRect();return document.elementFromPoint(caixa.left+caixa.width/2,caixa.top+caixa.height/2)?.className;}));
 for(const variante of [defeito,defeito.replace('z-index:99','z-index:999999'),defeito.replace('.selo { position:absolute','.selo { position:fixed')]){
  await documento(pagina,variante);expect(await acima()).toEqual(['cobertura']);
 }
 await documento(pagina,getPracticeSolution('css-fluxo-diagnosticar-camadas')!);
 expect(await acima()).toEqual(['selo']);
 await pagina.locator('.palco').evaluate(palco=>{const outro=palco.cloneNode(true) as HTMLElement;outro.style.width='300px';palco.after(outro);});
 expect(await acima()).toEqual(['selo','selo']);
 await pagina.locator('.palco').first().locator('.cobertura').evaluate(item=>(item as HTMLElement).style.zIndex='5');
 expect(await acima()).toEqual(['cobertura','selo']);
 await pagina.locator('.palco').first().locator('.selo').evaluate(item=>(item as HTMLElement).style.zIndex='999999');
 expect(await acima()).toEqual(['cobertura','selo']);
 await pagina.locator('.palco').first().locator('.painel').evaluate(item=>(item as HTMLElement).style.zIndex='6');
 expect(await acima()).toEqual(['selo','selo']);
});

test('caixas praticadas conservam capítulos, projeto, assistência e revisão',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/css-caixas');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(13);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(2);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="css-fluxo-prever-margens"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('50px\n50px');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('margens positivas');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('3e1PX\n50.00px');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="css-fluxo-diagnosticar-camadas"]');
 await diagnostico.locator('input[value="numero"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('contexto do painel');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
 await diagnostico.locator('input[value="painel"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await diagnostico.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('assistência');
 await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.practiceAnswers['css-fluxo-diagnosticar-camadas'].assisted).toBe(true);expect(salvo.adaptive.skills['css.caixas.empilhamento'].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('#aula-projeto')).toContainText('três caixas');
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});

test('caixas offline retomam a previsão conceitual sem execução livre',async({page:pagina,context:contexto})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/css-caixas');const pausa=pagina.locator('[data-practice="css-fluxo-prever-margens"]');
  await pausa.getByLabel('Saída prevista, uma linha por saída').fill('30px\n50px');await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(pausa.locator('.practice-feedback')).toContainText('não houve execução de css');await pagina.reload();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['css-fluxo-prever-margens']).toMatchObject({passed:true,assisted:false,value:'30px\n50px'});
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});

test('backup CSS restaura as novas habilidades e conserva assistência nas duas aulas',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});
 for(const [aula,id,resposta] of [['animacoes','css-diagnosticar-movimento','remover'],['css-caixas','css-fluxo-diagnosticar-camadas','painel']]){
  await pagina.goto('/#/aula/'+aula);const pausa=pagina.locator('[data-practice="'+id+'"]');
  await pausa.locator('input[value="'+resposta+'"]').check();await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 }
 await pagina.goto('/#/perfil');
 const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();
 const arquivo=await readFile((await(await esperar).path())!);
 await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
 const restaurado=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 for(const [id,habilidade] of [['css-diagnosticar-movimento','css.movimento.reducao'],['css-fluxo-diagnosticar-camadas','css.caixas.empilhamento']]){
  expect(restaurado.practiceAnswers[id]).toMatchObject({passed:true,assisted:true});expect(restaurado.adaptive.skills[habilidade].review.lastOutcome).toBe('assisted');
 }
});
