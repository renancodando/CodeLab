import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-eventos.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de eventos</title></head><body><main><h1>Referência de eventos</h1>'+conteudo+'</main></body></html>'}));
 await pagina.goto('/referencia-eventos.html');
}

test('eventos nativos: cancelar navegação não interrompe bubbling, nem muda o alvo para o painel',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 const fonte=atividade('html-eventos-prever-propagacao').code!;
 await documento(pagina,fonte);
 expect(saidas.join('\n')).toBe(getPracticeSolution('html-eventos-prever-propagacao'));
 expect(new URL(pagina.url()).hash).toBe('');
 saidas.length=0;
 await documento(pagina,fonte.replace('\ndocument.querySelector("#rotulo").click();',''));
 await pagina.getByRole('link',{name:'Ir ao destino',exact:true}).focus();await pagina.keyboard.press('Enter');
 expect(saidas).toEqual(['acao','painel','true']);expect(new URL(pagina.url()).hash).toBe('');
 saidas.length=0;
 await documento(pagina,fonte.replace('evento.preventDefault()','evento.stopPropagation()'));
 expect(saidas).toEqual([]);expect(new URL(pagina.url()).hash).toBe('#destino');
});

test('delegação nativa aceita conteúdo interno e novas ações sem capturar o ancestral externo',async({page:pagina})=>{
 const item=atividade('html-eventos-limitar-delegacao');
 for(const opcao of item.options!){
  await documento(pagina,item.code!.replace(/lista\.addEventListener\("click", evento => \{[\s\S]*?\n\}\);/,'lista.addEventListener("click", evento => {\n'+opcao.text+'\n});'));
  await pagina.getByRole('button',{name:'Concluir tarefa',exact:true}).locator('span').click();
  await pagina.locator('#neutro').click();
  await pagina.locator('#lista').evaluate(lista=>{const botao=document.createElement('button');botao.type='button';botao.dataset.acao='editar';const rotulo=document.createElement('span');rotulo.textContent='Editar tarefa';botao.append(rotulo);lista.append(botao);});
  const editar=pagina.getByRole('button',{name:'Editar tarefa',exact:true});
  await editar.locator('span').click();await editar.focus();await pagina.keyboard.press('Enter');await pagina.keyboard.press('Space');
  expect(await pagina.evaluate('acoes')).toEqual(opcao.id==='fronteira'?['concluir','editar','editar','editar']:opcao.id==='direto'?['editar','editar']:['concluir','externa','editar','editar','editar']);
 }
 const erros:string[]=[];pagina.on('pageerror',erro=>erros.push(erro.message));
 await documento(pagina,getPracticeSolution(item.id)!);
 await pagina.locator('#neutro').evaluate(item=>item.firstChild!.dispatchEvent(new MouseEvent('click',{bubbles:true})));
 expect(await pagina.evaluate('acoes')).toEqual([]);expect(erros).toEqual([]);
 await pagina.locator('#lista').evaluate(lista=>{const outro=lista.cloneNode(true) as HTMLElement;outro.id='outra';lista.after(outro);});
 await pagina.locator('#outra button span').click();expect(await pagina.evaluate('acoes')).toEqual([]);
 await pagina.locator('#lista button span').click();expect(await pagina.evaluate('acoes')).toEqual(['concluir']);
});

test('eventos praticados preservam projeto, assistência, revisão e navegação acessível',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/eventos');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(2);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="html-eventos-prever-propagacao"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('acao\npainel\ntrue');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('O alvo é o span');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('rotulo\npainel\ntrue');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="html-eventos-limitar-delegacao"]');
 await diagnostico.locator('input[value="ancestral"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('fora da lista');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
 await diagnostico.locator('input[value="fronteira"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await diagnostico.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('assistência');
 await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.practiceAnswers['html-eventos-limitar-delegacao'].assisted).toBe(true);expect(salvo.adaptive.skills['html.dom.delegacao'].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('#aula-projeto')).toContainText('lista dinâmica');
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});

test('eventos offline retomam previsão e diagnóstico sem executar código livre do aluno',async({page:pagina,context:contexto})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/eventos');const prever=pagina.locator('[data-practice="html-eventos-prever-propagacao"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('rotulo\npainel\ntrue');await prever.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(prever.locator('.practice-feedback')).toContainText('decisão conceitual');
  const pausa=pagina.locator('[data-practice="html-eventos-limitar-delegacao"]');await pausa.locator('input[value="fronteira"]').check();await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await pagina.reload();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['html-eventos-prever-propagacao']).toMatchObject({passed:true,assisted:false,value:'rotulo\npainel\ntrue'});
  expect(salvo.practiceAnswers['html-eventos-limitar-delegacao']).toMatchObject({passed:true,assisted:false,value:'fronteira'});
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
