import {test,expect,type Locator,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
async function prever(pausa:Locator,errada:string,certa:string){
 await pausa.getByLabel('Saída prevista, uma linha por saída').fill(errada);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Esta atividade comprova uma decisão conceitual');await expect(pausa.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
 await pausa.getByLabel('Saída prevista, uma linha por saída').fill(certa);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('Sua resposta está correta');
}
async function abrir(pagina:Page,aula:string){await pagina.goto('/#/aula/'+aula);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);}
async function larguras(pagina:Page){for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}}

test('erros: previsão, interrupção e correção de área com retorno persistido',async({page:pagina})=>{
 await abrir(pagina,'tipos-erros');await prever(pagina.locator('[data-practice="erros-prever-area"]'),'12\n12','7\n12');
 const classe=pagina.locator('[data-practice="erros-localizar-interrupcao"]');await classe.locator('input[value="sintaxe"]').check();await conferir(classe);await expect(classe.locator('.practice-feedback')).toContainText('sintaxe válida');await classe.locator('input[value="execucao"]').check();await conferir(classe);await expect(classe.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const area=pagina.locator('[data-practice="erros-corrigir-area"]');await conferir(area);await expect(area.locator('.practice-feedback')).toContainText('significado');await expect(area.locator('[data-help] pre')).toHaveCount(0);
 const alternativa='const area=(largura,comprimento)=>comprimento*largura;';await area.getByLabel('Seu código corrigido').fill(alternativa);await conferir(area);await expect(area.locator('.practice-feedback')).toContainText('A correção passou');await expect(area.locator('.practice-feedback')).toContainText('executor JavaScript isolado');await pagina.reload();await expect(area.locator('textarea')).toHaveValue(alternativa);
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['erros-corrigir-area'].passed).toBe(true);expect(salvo.adaptive.skills['javascript.erros.correcao'].evidence['erros-corrigir-area'].firstTry).toBe(false);await expect(pagina.locator('#aula-projeto')).toContainText('museu de bugs');await larguras(pagina);
});

test('investigação: caso mínimo, regressão, assistência e revisão funcionam offline',async({page:pagina,context:contexto})=>{
 test.setTimeout(120000);await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await abrir(pagina,'investigar');await prever(pagina.locator('[data-practice="investigar-prever-padrao"]'),'8\n-6\n0','8\n-6\n2');
  const hipotese=pagina.locator('[data-practice="investigar-isolar-fronteira"]');await hipotese.locator('input[value="tipo"]').check();await conferir(hipotese);await expect(hipotese.locator('.practice-feedback')).toContainText('caso mínimo');await hipotese.locator('input[value="isolar"]').check();await conferir(hipotese);await expect(hipotese.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const dobro=pagina.locator('[data-practice="investigar-corrigir-dobro"]');await conferir(dobro);await expect(dobro.locator('.practice-feedback')).toContainText('Zero');await dobro.getByLabel('Seu código corrigido').fill('const dobro=numero=>numero+numero;');await conferir(dobro);await expect(dobro.locator('.practice-feedback')).toContainText('A correção passou');
  await dobro.getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['investigar-corrigir-dobro'].assisted).toBe(true);expect(salvo.adaptive.skills['javascript.investigacao.regressao'].review.lastOutcome).toBe('assisted');await expect(pagina.locator('#aula-projeto')).toContainText('diário de depuração');await larguras(pagina);
 }finally{await contexto.setOffline(false);}
});

test('coleções: quantidade, limite e mutação antes de aceitar solução equivalente',async({page:pagina})=>{
 await abrir(pagina,'colecoes');await prever(pagina.locator('[data-practice="colecoes-prever-unidades"]'),'3\n3','4\n3');
 const limite=pagina.locator('[data-practice="colecoes-diagnosticar-limite"]');await limite.locator('input[value="ultimo-fora"]').check();await conferir(limite);await expect(limite.locator('.practice-feedback')).toContainText('última ficha');const escolha=limite.locator('input[value="menor"]');await escolha.focus();await pagina.keyboard.press('Space');await conferir(limite);await expect(limite.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const estoque=pagina.locator('[data-practice="colecoes-corrigir-acumulacao"]');await conferir(estoque);await expect(estoque.locator('.practice-feedback')).toContainText('contribuições');await estoque.getByLabel('Seu código corrigido').fill('function totalEstoque(itens){const total=itens.reduce((s,i)=>s+i.quantidade,0);itens.reverse();return total;}');await conferir(estoque);await expect(estoque.locator('.practice-feedback')).toContainText('objetos originais');await expect(estoque.locator('[data-help] pre')).toHaveCount(0);
 const alternativa='const totalEstoque=itens=>itens.reduce((soma,{quantidade})=>soma+quantidade,0);';await estoque.getByLabel('Seu código corrigido').fill(alternativa);await conferir(estoque);await expect(estoque.locator('.practice-feedback')).toContainText('A correção passou');await pagina.reload();await expect(estoque.locator('textarea')).toHaveValue(alternativa);const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['colecoes-corrigir-acumulacao'].passed).toBe(true);expect(salvo.adaptive.skills['javascript.colecoes.acumulacao'].evidence['colecoes-corrigir-acumulacao'].firstTry).toBe(false);
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);await expect(pagina.locator('#aula-projeto')).toContainText('estoque');await larguras(pagina);
});
