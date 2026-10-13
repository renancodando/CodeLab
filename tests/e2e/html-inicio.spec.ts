import {test,expect,type Page,type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(a=>a.id===id)!;
const documento=(corpo:string)=>'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência HTML</title></head><body>'+corpo+'</body></html>';
async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
async function prever(pausa:Locator,errada:string,certa:string){
 await pausa.getByLabel('Saída prevista, uma linha por saída').fill(errada);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
 await pausa.getByLabel('Saída prevista, uma linha por saída').fill(certa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');await expect(pausa.locator('.practice-feedback')).toContainText('não houve execução de html');
}
async function escolher(pausa:Locator,errada:string,certa:string){
 await pausa.locator('input[value="'+errada+'"]').check();await conferir(pausa);await expect(pausa.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
 await pausa.locator('input[value="'+certa+'"]').check();await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');
}
async function ordenar(pausa:Locator,id:string,ordem:string[]){
 await conferir(pausa);await expect(pausa.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
 const atuais=atividade(id).lines!.map(l=>l.id);
 for(let destino=0;destino<ordem.length;destino++)for(let indice=atuais.indexOf(ordem[destino]);indice>destino;indice--){
  await pausa.getByRole('button',{name:'Mover linha '+(indice+1)+' para cima'}).click();[atuais[indice-1],atuais[indice]]=[atuais[indice],atuais[indice-1]];
 }
 await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');
}
async function abrir(pagina:Page,aula:string){await pagina.goto('/#/aula/'+aula);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);const habilidades=await pagina.evaluate(()=>{const salvo=localStorage.getItem('codelab.progress.v2');return salvo===null?null:JSON.parse(salvo).adaptive.skills;});expect(habilidades??{}).toEqual({});}
async function larguras(pagina:Page){for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}}

test('documento HTML: títulos, idioma e estrutura com assistência persistida',async({page:pagina})=>{
 await abrir(pagina,'documento');await prever(pagina.locator('[data-practice="html-prever-titulos-documento"]'),'Catálogo\nGuia da biblioteca','Guia da biblioteca\nCatálogo');
 await escolher(pagina.locator('[data-practice="html-diagnosticar-idioma"]'),'codificacao','raiz');
 const id='html-reconstruir-documento',ordem=['tipo','inicio','cabecalho','corpo','fim'],pausa=pagina.locator('[data-practice="'+id+'"]');await ordenar(pausa,id,ordem);await expect(pausa.locator('[data-help] pre')).toHaveCount(0);await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[id].value).toEqual(ordem);expect(salvo.practiceAnswers[id].assisted).toBe(true);expect(salvo.adaptive.skills['html.documento.estrutura'].review.lastOutcome).toBe('assisted');expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);await larguras(pagina);
});

test('semântica HTML: teclado, região principal e árvore sem perder o projeto',async({page:pagina})=>{
 await abrir(pagina,'semantica');await escolher(pagina.locator('[data-practice="html-escolher-acao-teclado"]'),'div','botao');await escolher(pagina.locator('[data-practice="html-diagnosticar-regiao-principal"]'),'nomear','agrupar');
 const id='html-reconstruir-hierarquia',ordem=['principal','artigo','descricao','fechar-artigo','fechar-principal'];await ordenar(pagina.locator('[data-practice="'+id+'"]'),id,ordem);await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[id].value).toEqual(ordem);expect(salvo.practiceAnswers[id].passed).toBe(true);await expect(pagina.locator('#aula-projeto')).toContainText('artigo');await larguras(pagina);
});

test('formulário HTML: validade, associação e reconstrução continuam offline',async({page:pagina,context:contexto})=>{
 test.setTimeout(120000);await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await abrir(pagina,'formularios');await prever(pagina.locator('[data-practice="html-prever-validade-email"]'),'true\ntrue\nfalse','false\ntrue\nfalse');await escolher(pagina.locator('[data-practice="html-corrigir-associacao-label"]'),'nomear','associar');
  const id='html-reconstruir-envio-campo',ordem=['formulario','rotulo','campo','enviar','fim'];await ordenar(pagina.locator('[data-practice="'+id+'"]'),id,ordem);await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[id].value).toEqual(ordem);expect(salvo.practiceAnswers[id].passed).toBe(true);await expect(pagina.locator('#aula-projeto')).toContainText('cadastro de tarefa');await larguras(pagina);
 }finally{await contexto.setOffline(false);}
});

test('referências de documento HTML: navegador confere título, idioma e modo de padrões',async({page:pagina})=>{
 await pagina.setContent(atividade('html-prever-titulos-documento').code!);expect(await pagina.title()).toBe('Guia da biblioteca');await expect(pagina.locator('body h1')).toHaveText('Catálogo');
 await pagina.setContent(atividade('html-diagnosticar-idioma').code!);await expect(pagina.locator('html')).toHaveAttribute('lang','en');await pagina.setContent(getPracticeSolution('html-diagnosticar-idioma')!);await expect(pagina.locator('html')).toHaveAttribute('lang','pt-BR');await expect(pagina.locator('meta[charset]')).toHaveAttribute('charset','UTF-8');
 await pagina.setContent(getPracticeSolution('html-reconstruir-documento')!);expect(await pagina.evaluate(()=>document.compatMode)).toBe('CSS1Compat');expect(await pagina.title()).toBe('Minha biblioteca');await expect(pagina.locator('body > main > h1')).toHaveText('Minha biblioteca');
});

test('referências semânticas: botão nativo e artigos têm comportamentos verificáveis',async({page:pagina})=>{
 for(const [id,esperado] of [['botao',2],['div',0],['link',1]] as const){
  const trecho=atividade('html-escolher-acao-teclado').options!.find(o=>o.id===id)!.text;await pagina.setContent(documento('<main>'+trecho+'</main>'));
  await pagina.locator('main > *').evaluate(elemento=>{elemento.addEventListener('click',()=>{(elemento as HTMLElement).dataset.cliques=String(Number((elemento as HTMLElement).dataset.cliques??0)+1);});});
  await pagina.locator('main > *').focus();await pagina.keyboard.press('Enter');await pagina.keyboard.press('Space');expect(await pagina.locator('main > *').getAttribute('data-cliques')).toBe(esperado?String(esperado):null);
 }
 await pagina.setContent(documento(atividade('html-diagnosticar-regiao-principal').code!));await expect(pagina.locator('main')).toHaveCount(2);await pagina.setContent(documento(getPracticeSolution('html-diagnosticar-regiao-principal')!));await expect(pagina.locator('main')).toHaveCount(1);await expect(pagina.locator('main > article > h2')).toHaveText(['Livro A','Livro B']);expect((await new AxeBuilder({page:pagina}).analyze()).violations).toEqual([]);
 await pagina.setContent(documento(getPracticeSolution('html-reconstruir-hierarquia')!));await expect(pagina.locator('main > h1')).toHaveText('Catálogo');await expect(pagina.locator('main > article > h2')).toHaveText('Livro');
});

test('referências de formulário: validação, foco e chave são conferidos no navegador',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});await pagina.setContent(documento(atividade('html-prever-validade-email').code!));expect(saidas).toEqual(['false','true','false']);
 await pagina.setContent(documento(atividade('html-corrigir-associacao-label').code!));await pagina.locator('label').click();await expect(pagina.locator('input')).not.toBeFocused();await pagina.setContent(documento(getPracticeSolution('html-corrigir-associacao-label')!));await pagina.locator('label').click();await expect(pagina.locator('input')).toBeFocused();
 await pagina.setContent(documento(getPracticeSolution('html-reconstruir-envio-campo')!));await pagina.locator('input').fill('ana@example.com');expect(await pagina.locator('input').evaluate(elemento=>(elemento as HTMLInputElement).checkValidity())).toBe(true);
 expect(await pagina.evaluate(()=>Array.from(new FormData(document.querySelector('form')!)))).toEqual([['email','ana@example.com']]);await pagina.locator('input').evaluate(elemento=>elemento.removeAttribute('name'));expect(await pagina.evaluate(()=>Array.from(new FormData(document.querySelector('form')!)))).toEqual([]);
});
