import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
const alternativa='const inserirNota=(notas,entrada)=>{const texto=entrada.trim();return texto?notas.concat(texto):notas.slice();};';
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-formulario.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de formulário</title></head><body><main><h1>Referência de formulário</h1>'+conteudo+'</main></body></html>'}));
 await pagina.goto('/referencia-formulario.html');
}

test('formulário nativo distingue required de espaços e não altera estado inválido',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 const fonte=atividade('html-formulario-prever-validacao').code!;
 await documento(pagina,fonte);
 expect(saidas.join('\n')).toBe(getPracticeSolution('html-formulario-prever-validacao'));
 for(const [entrada,esperado,envios] of [['','true|Revisar|0',0],['   ','false|Revisar|3',1],['  Nova nota  ','false|Revisar|Nova nota|0',1]] as const){
  saidas.length=0;
  await documento(pagina,fonte.replace('campo.value = "   ";','campo.value = '+JSON.stringify(entrada)+';').replace('formulario.addEventListener','let envios = 0;\nformulario.addEventListener').replace('evento.preventDefault();','envios++; evento.preventDefault();'));
  expect(saidas.join('|')).toBe(esperado);expect(await pagina.evaluate('envios')).toBe(envios);
 }
});
test('a projeção nativa reage a remoção, restauração e instâncias sem acumular',async({page:pagina})=>{
 const item=atividade('html-formulario-derivar-contagem');
 for(const opcao of item.options!){
  await documento(pagina,item.code!.replace('saida.textContent = String(quantidade);',opcao.text));
  const resultado=await pagina.evaluate(()=>{
   const renderizar=(window as typeof window & {renderizar:(lista:string[],saida:Element)=>void}).renderizar;
   const saida=document.querySelector('#quantidade')!,outra=document.createElement('output');document.body.append(outra);
   const lista=['A','A','B'],antes=JSON.stringify(lista),valores:string[]=[];
   for(const dados of [lista,lista,[],['Restaurada']]){renderizar(dados,saida);valores.push(saida.textContent!);}
   renderizar(['Outro','painel'],outra);
   return{valores,outra:outra.textContent,primeira:saida.textContent,listaIntacta:JSON.stringify(lista)===antes};
  });
  expect(resultado).toEqual(opcao.id==='derivar'?{valores:['3','3','0','1'],outra:'2',primeira:'1',listaIntacta:true}:opcao.id==='cache'?{valores:['2','2','2','2'],outra:'2',primeira:'2',listaIntacta:true}:{valores:['6','9','9','10'],outra:'12',primeira:'10',listaIntacta:true});
 }
});
test('formulário praticado conserva a aula, decisões, teclado e projeto',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/estado-formulario');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="html-formulario-prever-validacao"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('true\nRevisar\n3');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('Três espaços');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('false\nRevisar\n3');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="html-formulario-derivar-contagem"]');
 await diagnostico.locator('input[value="cache"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('antes da remoção');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
 await diagnostico.locator('input[value="derivar"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await expect(pagina.locator('#aula-projeto')).toContainText('despesas');
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});
test('a regra de estado executa o código do aluno e registra a assistência',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/estado-formulario');
 const pausa=pagina.locator('[data-practice="js-formulario-preservar-estado"]');
 await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('fronteira vazia',{timeout:20000});
 await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
 await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.practiceAnswers['js-formulario-preservar-estado']).toMatchObject({passed:true,assisted:true,value:alternativa});
 expect(salvo.adaptive.skills['javascript.dom.estado'].review.lastOutcome).toBe('assisted');
});
test('a regra de estado funciona offline sem executar DOM ou consultar executor remoto',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/estado-formulario');const pausa=pagina.locator('[data-practice="js-formulario-preservar-estado"]');
  await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
  await pagina.reload();expect(await pausa.getByLabel('Seu código corrigido').inputValue()).toBe(alternativa);expect(remotas).toEqual([]);
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
test('o backup conserva a habilidade executada e a assistência após excluir os dados locais',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/estado-formulario');const pausa=pagina.locator('[data-practice="js-formulario-preservar-estado"]');
 await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);
 await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['js-formulario-preservar-estado']).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.dom.estado'].review.lastOutcome).toBe('assisted');
});
