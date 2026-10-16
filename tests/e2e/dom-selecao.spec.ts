import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-selecao.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de seleção</title></head><body><main><h1>Referência de seleção</h1>'+conteudo+'</main></body></html>'}));
 await pagina.goto('/referencia-selecao.html');
}

test('DOM nativo: a lista conserva os nós, sem congelar seus valores ou ampliar o escopo',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 const fonte=atividade('html-dom-prever-selecao').code!;
 await documento(pagina,fonte);
 expect(saidas.join('\n')).toBe(getPracticeSolution('html-dom-prever-selecao'));
 await pagina.locator('#alvo .nome').first().evaluate(item=>item.textContent='Outra pessoa');
 expect(await pagina.evaluate('nomes[0].textContent')).toBe('Outra pessoa');
 await pagina.locator('#alvo .nome').first().evaluate(item=>item.remove());
 expect(await pagina.evaluate('nomes.length')).toBe(1);
 expect(await pagina.locator('#alvo .nome').count()).toBe(1);
 saidas.length=0;
 await documento(pagina,fonte.replace('>Ana<','>Lia<').replace('alvo.append(novo);','alvo.append(novo, novo.cloneNode(true));'));
 expect(saidas).toEqual(['Lia','1','3']);
});

test('DOM nativo: atualizar texto preserva identidade, foco, classes e instâncias independentes',async({page:pagina})=>{
 const item=atividade('html-dom-atualizar-texto');
 const semChamada=(fonte:string)=>fonte.replace('\natualizar(document.querySelector("#painel"), "<strong>Pronto</strong>");','');
 for(const opcao of item.options!){
  await documento(pagina,semChamada(item.code!.replace(/function atualizar\(painel, texto\) \{[\s\S]*?\n\}/,'function atualizar(painel, texto) {\n'+opcao.text+'\n}')));
  const resultado=await pagina.evaluate(()=>{
   const painel=document.querySelector('#painel')!,botao=painel.querySelector('button')!;
   let cliques=0;botao.addEventListener('click',()=>cliques++);botao.focus();
   const texto='<strong>Pronto</strong>';
   (window as typeof window & {atualizar:(painel:Element|null,texto:string)=>void}).atualizar(painel,texto);
   const resultado={mesmoBotao:painel.querySelector('button')===botao,foco:document.activeElement===botao,classes:painel.classList.contains('compacto'),literal:painel.querySelector('.mensagem')?.textContent===texto};
   painel.querySelector('button')?.click();return{...resultado,cliques};
  });
  expect(resultado).toEqual(opcao.id==='local'?{mesmoBotao:true,foco:true,classes:true,literal:true,cliques:1}:opcao.id==='painel'?{mesmoBotao:false,foco:false,classes:true,literal:false,cliques:0}:opcao.id==='marcacao'?{mesmoBotao:true,foco:true,classes:true,literal:false,cliques:1}:{mesmoBotao:true,foco:true,classes:false,literal:true,cliques:1});
 }
 await documento(pagina,semChamada(getPracticeSolution(item.id)!));
 expect(await pagina.evaluate(()=>{
  const atualizar=(window as typeof window & {atualizar:(painel:Element|null,texto:string)=>void}).atualizar;
  const painel=document.querySelector('#painel')!,outro=painel.cloneNode(true) as HTMLElement;outro.id='outro';painel.after(outro);
  const mensagens=['','0','ação e revisão','<button>Texto, não controle</button>'];
  const valores=mensagens.map(texto=>{atualizar(painel,texto);return painel.querySelector('.mensagem')!.textContent;});
  atualizar(null,'Ausente');
  const vazio=document.createElement('section');vazio.className='compacto';vazio.innerHTML='<button>Continuar</button>';
  const antes=vazio.outerHTML;atualizar(vazio,'Não deve alterar');
  return{valores,outro:outro.querySelector('.mensagem')!.textContent,semMensagem:vazio.outerHTML===antes,filhos:painel.querySelector('.mensagem')!.childElementCount,classes:painel.className};
 })).toEqual({valores:['','0','ação e revisão','<button>Texto, não controle</button>'],outro:'Antes',semMensagem:true,filhos:0,classes:'painel compacto atualizado'});
});

test('seleção praticada conserva tentativas, assistência, revisão e o projeto',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/selecionar');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(2);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="html-dom-prever-selecao"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('Bia\n2\n2');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('primeiro cartão');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('Ana\n1\n2');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="html-dom-atualizar-texto"]');
 await diagnostico.locator('input[value="painel"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('remove também seu botão');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
 await diagnostico.locator('input[value="local"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await diagnostico.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('assistência');
 await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.practiceAnswers['html-dom-atualizar-texto'].assisted).toBe(true);expect(salvo.adaptive.skills['html.dom.atualizacao'].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('#aula-projeto')).toContainText('contador');
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});

test('seleção offline conserva a decisão e seu rascunho sem executar código livre',async({page:pagina,context:contexto})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/selecionar');const pausa=pagina.locator('[data-practice="html-dom-atualizar-texto"]');
  await pausa.locator('input[value="local"]').check();await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(pausa.locator('.practice-feedback')).toContainText('decisão conceitual');await pagina.reload();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['html-dom-atualizar-texto']).toMatchObject({passed:true,assisted:false,value:'local'});
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
