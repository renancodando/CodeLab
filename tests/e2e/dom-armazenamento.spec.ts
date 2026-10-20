import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
const alternativa="const recuperarPreferencias=texto=>{try{const d=JSON.parse(texto);if(!d||typeof d!==\"object\"||Array.isArray(d)||![\"claro\",\"escuro\"].includes(d.tema))return null;if(d.versao===1)return {tema:d.tema,compacto:false,versao:2};if(d.versao===2&&typeof d.compacto===\"boolean\")return {tema:d.tema,compacto:d.compacto,versao:2};return null;}catch{return null;}};";
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-armazenamento.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de armazenamento</title></head><body><main><h1>Referência de armazenamento</h1>'+conteudo+'</main></body></html>'}));
 await pagina.goto('/referencia-armazenamento.html');
}
test('o armazenamento nativo conserva o snapshot até outra gravação explícita',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 await documento(pagina,atividade('html-armazenamento-prever-snapshot').code!);
 expect(saidas.join('\n')).toBe(getPracticeSolution('html-armazenamento-prever-snapshot'));
 const resultado=await pagina.evaluate(()=>{
  const chave='aula.preferencias.snapshot';
  const antes=localStorage.getItem(chave)!;
  const outra=JSON.parse(antes);outra.tema='escuro';
  const semGravar=localStorage.getItem(chave);
  localStorage.setItem(chave,JSON.stringify(outra));
  return{antes:JSON.parse(antes),semGravar:semGravar===antes,depois:JSON.parse(localStorage.getItem(chave)!)};
 });
 expect(resultado).toEqual({antes:{versao:2,tema:'claro',compacto:false},semGravar:true,depois:{versao:2,tema:'escuro',compacto:false}});
});
test('falha injetada de setItem diferencia preservação, reversão e perda do checkpoint',async({page:pagina})=>{
 const item=atividade('html-armazenamento-falha-gravacao');
 for(const opcao of item.options!){
  await documento(pagina,item.code!.replace('pendente = false;\n    aviso.textContent = "Salvo.";\n  }\n}',opcao.text+'\n  }\n}'));
  const resultado=await pagina.evaluate(()=>{
   const chave='aula.preferencias.falha',anterior={versao:2,tema:'claro',compacto:false};
   localStorage.setItem(chave,JSON.stringify(anterior));
   const original=Storage.prototype.setItem;let chamadas=0;
   Storage.prototype.setItem=function(){chamadas++;throw new DOMException('Falha injetada pelo teste','QuotaExceededError');};
   try{
    (window as typeof window&{salvar:()=>void}).salvar();
    return{chamadas,memoria:JSON.parse(JSON.stringify((0,eval)('preferencias'))),pendente:(0,eval)('pendente'),salvo:JSON.parse(localStorage.getItem(chave)??'null'),aviso:document.querySelector('#aviso')!.textContent};
   }finally{Storage.prototype.setItem=original;}
  });
  expect(resultado.chamadas).toBe(1);
  if(opcao.id==='preservar')expect(resultado).toMatchObject({memoria:{versao:2,tema:'escuro',compacto:true},pendente:true,salvo:{versao:2,tema:'claro',compacto:false},aviso:'Não foi possível salvar. Exporte as preferências.'});
  else if(opcao.id==='reverter')expect(resultado).toMatchObject({memoria:{versao:2,tema:'claro',compacto:false},pendente:false,salvo:{versao:2,tema:'claro',compacto:false}});
  else expect(resultado).toMatchObject({memoria:{versao:2,tema:'escuro',compacto:true},pendente:false,salvo:null});
 }
});
test('armazenamento praticado conserva capítulos, projeto, decisões e teclado',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/armazenamento');
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="html-armazenamento-prever-snapshot"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('escuro\nescuro\ntrue');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('instante da gravação');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('escuro\nclaro\nfalse');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="html-armazenamento-falha-gravacao"]');
 await diagnostico.locator('input[value="reverter"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('checkpoint anterior');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
 await diagnostico.locator('input[value="preservar"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await expect(pagina.locator('#aula-projeto')).toContainText('preferências locais versionadas');
});
test('as respostas de armazenamento mantêm acessibilidade e largura de 220 a 4000 px',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/armazenamento');
 const previsao=pagina.locator('[data-practice="html-armazenamento-prever-snapshot"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('escuro\nclaro\nfalse');await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="html-armazenamento-falha-gravacao"]');
 await diagnostico.locator('input[value="preservar"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});
test('o validador executa JavaScript real e conserva assistência depois do reload',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/armazenamento');
 const pausa=pagina.locator('[data-practice="js-armazenamento-migrar-preferencias"]');
 await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('false',{timeout:20000});
 await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
 await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.practiceAnswers['js-armazenamento-migrar-preferencias']).toMatchObject({passed:true,assisted:true,value:alternativa});
 expect(salvo.adaptive.skills['javascript.persistencia.migracao'].review.lastOutcome).toBe('assisted');
});
test('a recuperação funciona offline sem acesso ao armazenamento pelo código do aluno',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/armazenamento');const pausa=pagina.locator('[data-practice="js-armazenamento-migrar-preferencias"]');
  await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
  await pagina.reload();expect(await pausa.getByLabel('Seu código corrigido').inputValue()).toBe(alternativa);expect(remotas).toEqual([]);
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
test('o backup recupera o validador praticado e a assistência depois da exclusão local',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/armazenamento');const pausa=pagina.locator('[data-practice="js-armazenamento-migrar-preferencias"]');
 await pausa.getByLabel('Seu código corrigido').fill(alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
 await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
 await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);
 await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['js-armazenamento-migrar-preferencias']).toMatchObject({passed:true,assisted:true,value:alternativa});expect(salvo.adaptive.skills['javascript.persistencia.migracao'].review.lastOutcome).toBe('assisted');
});
