import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
const alternativa='function criarDescarte(limpezas){let feito=false;return()=>{if(feito)return;feito=true;[...limpezas].reverse().forEach(limpar=>limpar());};}';
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-componentes.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de componentes</title></head><body><main><h1>Referência de componentes</h1>'+conteudo+'</main></body></html>'}));
 await pagina.goto('/referencia-componentes.html');
}

test('o botão desconectado ainda tem listener e as montagens mantêm estado independente',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 const fonte=atividade('html-componentes-prever-desconexao').code!;
 await documento(pagina,fonte);expect(saidas.join('\n')).toBe(getPracticeSolution('html-componentes-prever-desconexao'));
 expect(await pagina.evaluate('primeiro.botao.isConnected')).toBe(false);
 await pagina.evaluate('primeiro.botao.click(); segundo.botao.click();');
 expect(await pagina.evaluate('[primeiro.ler(),segundo.ler()]')).toEqual([3,2]);
 await expect(pagina.locator('#raiz button')).toHaveCount(1);
 saidas.length=0;
 await documento(pagina,fonte.replace('function montar() {\n  let valor = 0;','let valor = 0;\nfunction montar() {'));
 expect(saidas).toEqual(['3','3','false']);
});

test('o descarte nativo respeita referência, capture, repetição e outra instância',async({page:pagina})=>{
 const item=atividade('html-componentes-remover-listener');
 for(const opcao of item.options!){
  await documento(pagina,item.code!.replace('window.removeEventListener("resize", () => atualizar(), true);\n    painel.remove();',opcao.text));
  const resultado=await pagina.evaluate(()=>{
   const montar=(window as typeof window&{montar:(painel:HTMLElement)=>(()=>void)}).montar;
   const primeiro=document.querySelector<HTMLElement>('#primeiro')!,segundo=document.querySelector<HTMLElement>('#segundo')!;
   const descartarA=montar(primeiro),descartarB=montar(segundo);
   window.dispatchEvent(new Event('resize'));descartarA();descartarA();
   window.dispatchEvent(new Event('resize'));window.dispatchEvent(new Event('resize'));
   const antes=[primeiro.dataset.reacoes,segundo.dataset.reacoes];descartarB();
   window.dispatchEvent(new Event('resize'));
   return{antes,depois:[primeiro.dataset.reacoes,segundo.dataset.reacoes],conectados:[primeiro.isConnected,segundo.isConnected]};
  });
  expect(resultado).toEqual(opcao.id==='referencia'?{antes:['1','3'],depois:['1','3'],conectados:[false,false]}:{antes:['3','3'],depois:['4','4'],conectados:[false,false]});
 }
});

test('componentes praticados preservam capítulos, projeto, teclado e acessibilidade',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/componentes');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="html-componentes-prever-desconexao"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('1\n1\nfalse');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('objeto do botão');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('2\n1\nfalse');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="html-componentes-remover-listener"]');
 await diagnostico.locator('input[value="nova-funcao"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('função nova');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
 await diagnostico.locator('input[value="referencia"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await expect(pagina.locator('#aula-projeto')).toContainText('painel reutilizável');
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});

test('o descarte executa JavaScript real e conserva a assistência após recarregar',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/componentes');
 const pausa=pagina.locator('[data-practice="js-componentes-descarte-unico"]');
 await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('ordem inversa',{timeout:20000});
 await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
 await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.practiceAnswers['js-componentes-descarte-unico']).toMatchObject({passed:true,assisted:true,value:alternativa});
 expect(salvo.adaptive.skills['javascript.componentes.descarte'].review.lastOutcome).toBe('assisted');
});

test('o descarte funciona offline sem rede arbitrária nem execução de DOM do aluno',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/componentes');const pausa=pagina.locator('[data-practice="js-componentes-descarte-unico"]');
  await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
  await pagina.reload();expect(await pausa.getByLabel('Seu código corrigido').inputValue()).toBe(alternativa);expect(remotas).toEqual([]);
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});

test('o backup restaura a habilidade de descarte depois de excluir os dados locais',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/componentes');const pausa=pagina.locator('[data-practice="js-componentes-descarte-unico"]');
 await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);
 await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['js-componentes-descarte-unico']).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.componentes.descarte'].review.lastOutcome).toBe('assisted');
});
