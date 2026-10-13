import {test,expect,type Locator,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
async function prever(pausa:Locator,errada:string,certa:string){
 await pausa.getByLabel('Saída prevista, uma linha por saída').fill(errada);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Esta atividade comprova uma decisão conceitual');await expect(pausa.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
 await pausa.getByLabel('Saída prevista, uma linha por saída').fill(certa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');
}
async function abrir(pagina:Page,aula:string){await pagina.goto('/#/aula/'+aula);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);}
async function largura(pagina:Page){for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}}

test('primeiras instruções: ordem, texto, teclado e assistência persistem',async({page:pagina})=>{
 await abrir(pagina,'programar');const previsao=pagina.locator('[data-practice="inicio-prever-ordem"]');await prever(previsao,'Preparar\nTestar','Preparar\nTestar\nPreparar');
 const texto=pagina.locator('[data-practice="inicio-diagnosticar-texto"]');await texto.locator('input[value="nome"]').check();await conferir(texto);await expect(texto.locator('.practice-feedback')).toContainText('nome sem definição');await texto.locator('input[value="texto"]').check();await conferir(texto);await expect(texto.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const ordem=pagina.locator('[data-practice="inicio-reconstruir-roteiro"]');await conferir(ordem);await expect(ordem.locator('.practice-feedback')).toContainText('sequência');
 const mover=ordem.getByRole('button',{name:'Mover linha 1 para baixo'});await mover.focus();await pagina.keyboard.press('Enter');await expect(ordem.getByRole('button',{name:'Mover linha 2 para baixo'})).toBeFocused();await pagina.keyboard.press('Enter');await conferir(ordem);await expect(ordem.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await ordem.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(ordem.locator('.practice-feedback')).toContainText('registrada como assistência');await pagina.reload();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['inicio-reconstruir-roteiro'].value).toEqual(['abrir','testar','fechar']);expect(salvo.practiceAnswers['inicio-reconstruir-roteiro'].assisted).toBe(true);expect(salvo.adaptive.skills['javascript.instrucoes.ordem'].evidence['inicio-prever-ordem'].firstTry).toBe(false);
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);await largura(pagina);
});

test('entrada e saída: corrige frete com entradas variadas, offline e retomada',async({page:pagina,context:contexto})=>{
 test.setTimeout(120000);await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await abrir(pagina,'entrada-saida');await prever(pagina.locator('[data-practice="entrada-prever-zero"]'),'0\n0','0\n7');
  const unidade=pagina.locator('[data-practice="entrada-diagnosticar-unidade"]');await unidade.locator('input[value="somar"]').check();await conferir(unidade);await expect(unidade.locator('.practice-feedback')).toContainText('centavos');await unidade.locator('input[value="separar"]').check();await conferir(unidade);await expect(unidade.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const correcao=pagina.locator('[data-practice="entrada-corrigir-total"]');await conferir(correcao);await expect(correcao.locator('.practice-feedback')).toContainText('custo fixo');await expect(correcao.locator('[data-help] pre')).toHaveCount(0);
  const alternativa='const calcularTotal=(unidades,valor,entrega)=>entrega+valor*unidades;';await correcao.getByLabel('Seu código corrigido').fill(alternativa);await conferir(correcao);await expect(correcao.locator('.practice-feedback')).toContainText('A correção passou');await expect(correcao.locator('.practice-feedback')).toContainText('executor JavaScript isolado');await pagina.reload();await expect(correcao.locator('textarea')).toHaveValue(alternativa);
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['entrada-corrigir-total'].passed).toBe(true);expect(salvo.adaptive.skills['javascript.fluxo.transformacao'].evidence['entrada-corrigir-total'].firstTry).toBe(false);await largura(pagina);
 }finally{await contexto.setOffline(false);}
});

test('decomposição: dependências, média equivalente, revisão e conteúdo preservado',async({page:pagina})=>{
 await abrir(pagina,'passos');await prever(pagina.locator('[data-practice="passos-prever-media"]'),'21\n10.5','21\n7');
 const ordem=pagina.locator('[data-practice="passos-ordenar-dependencias"]');await conferir(ordem);await expect(ordem.locator('.practice-feedback')).toContainText('etapas anteriores');
 await ordem.getByRole('button',{name:'Mover linha 3 para cima'}).click();await ordem.getByRole('button',{name:'Mover linha 2 para cima'}).click();await ordem.getByRole('button',{name:'Mover linha 4 para cima'}).click();await ordem.getByRole('button',{name:'Mover linha 3 para cima'}).click();await ordem.getByRole('button',{name:'Mover linha 4 para cima'}).click();await conferir(ordem);await expect(ordem.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const media=pagina.locator('[data-practice="passos-corrigir-media"]');await conferir(media);await expect(media.locator('.practice-feedback')).toContainText('divisor');await media.getByLabel('Seu código corrigido').fill('const mediaTres=(a,b,c)=>a/3+b/3+c/3;');await conferir(media);await expect(media.locator('.practice-feedback')).toContainText('A correção passou');
 await media.getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['passos-corrigir-media'].assisted).toBe(true);expect(salvo.adaptive.skills['javascript.decomposicao.conservacao'].review.lastOutcome).toBe('assisted');await expect(pagina.locator('#aula-projeto')).toContainText('analisador simples de notas');await largura(pagina);
});
