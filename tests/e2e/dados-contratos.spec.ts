import {test,expect,type Locator,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {getPracticeSolution} from '../../src/learning/practice';

const casos=[
 {aula:'array-metodos',falhaPrevisao:'A seleção conserva os pares',falhaDiagnostico:'Uma comparação solta',falhaCodigo:'Conserve os valores',previsao:'metodos-prever-transformacao',errada:'2,4\n4,8\n12',certa:'2,4\n4,8\n6',diagnostico:'metodos-devolver-predicado',opcaoErrada:'mapear',opcaoCerta:'devolver',producao:'metodos-somar-pares',habilidade:'javascript.arrays.reduce',projeto:'resumo de compras',alternativa:'function somarPares(v){let soma=0;for(const n of v)if(n%2===0)soma+=n;return soma;}'},
 {aula:'objetos-modulos',falhaPrevisao:'O nome foi substituído',falhaDiagnostico:'O padrão de destructuring não troca null',falhaCodigo:'Mudar a cidade não deve apagar',previsao:'objetos-prever-compartilhamento',errada:'Lia\nRecife\nfalse\nfalse',certa:'Lia\nNatal\nfalse\ntrue',diagnostico:'objetos-diagnosticar-padrao',opcaoErrada:'falso',opcaoCerta:'ausencia',producao:'objetos-atualizar-endereco',habilidade:'javascript.objetos.propriedades',projeto:'módulo de dados',alternativa:'function mudarCidade(p,c){return Object.assign({},p,{endereco:Object.assign({},p.endereco,{cidade:c})});}'},
 {aula:'erros-json',falhaPrevisao:'O parse interrompe o try',falhaDiagnostico:'O parse de null é permitido',falhaCodigo:'O campo string já atende',previsao:'json-prever-falha',errada:'Antes\nDentro\nDepois',certa:'Antes\nSyntaxError\nDepois',diagnostico:'json-identificar-contrato',opcaoErrada:'garantia',opcaoCerta:'estrutura',producao:'json-validar-nome',habilidade:'javascript.objetos.validacao',projeto:'importador de configurações',alternativa:'function lerNome(t){const d=JSON.parse(t);if(d&&typeof d==="object"&&!Array.isArray(d)&&typeof d.nome==="string")return d.nome;throw new TypeError("Nome inválido");}'}
];
async function conferir(pausa:Locator){await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
async function abrir(pagina:Page,aula:string){await pagina.goto('/#/aula/'+aula);await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);}

for(const caso of casos)test('dados e contratos: '+caso.aula+' conserva teoria, projeto e demonstração independente',async({page:pagina})=>{
 await abrir(pagina,caso.aula);expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="'+caso.previsao+'"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill(caso.errada);await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText(caso.falhaPrevisao);await previsao.getByLabel('Saída prevista, uma linha por saída').fill(caso.certa);await conferir(previsao);await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="'+caso.diagnostico+'"]');await diagnostico.locator('input[value="'+caso.opcaoErrada+'"]').check();await conferir(diagnostico);await expect(diagnostico.locator('.practice-feedback')).toContainText(caso.falhaDiagnostico);await diagnostico.locator('input[value="'+caso.opcaoCerta+'"]').check();await conferir(diagnostico);await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const producao=pagina.locator('[data-practice="'+caso.producao+'"]');await conferir(producao);await expect(producao.locator('.practice-feedback')).toContainText(caso.falhaCodigo);await expect(producao.locator('[data-help] pre')).toHaveCount(0);await producao.getByRole('textbox',{name:caso.aula==='objetos-modulos'?'Seu código corrigido':'Seu código',exact:true}).fill(caso.alternativa);await conferir(producao);await expect(producao.locator('.practice-feedback')).toContainText('A correção passou');await expect(producao.locator('.practice-feedback')).toContainText('executor JavaScript isolado');
 const independente=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(independente.practiceAnswers[caso.producao].passed).toBe(true);expect(independente.practiceAnswers[caso.producao].assisted).toBe(false);expect(independente.adaptive.skills[caso.habilidade].evidence[caso.producao].firstTry).toBe(false);
 await producao.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(producao.locator('.practice-feedback')).toContainText('registrada como assistência');await pagina.reload();await expect(producao.locator('textarea')).toHaveValue(caso.alternativa);
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[caso.producao].assisted).toBe(true);expect(salvo.adaptive.skills[caso.habilidade].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('#aula-projeto')).toContainText(caso.projeto);expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});

test('as três produções funcionam offline e preservam tentativas sem execução remota',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.reload();
  for(const caso of casos){await abrir(pagina,caso.aula);const pausa=pagina.locator('[data-practice="'+caso.producao+'"]');await pausa.getByRole('textbox',{name:caso.aula==='objetos-modulos'?'Seu código corrigido':'Seu código',exact:true}).fill(getPracticeSolution(caso.producao)!);await conferir(pausa);await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou');}
  await pagina.reload();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));for(const caso of casos){expect(salvo.practiceAnswers[caso.producao].passed).toBe(true);expect(salvo.practiceAnswers[caso.producao].assisted).toBe(false);}expect(remotas).toEqual([]);
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});

test('a correção de frete mantém o campo antigo mesmo com habilidade de produção',async({page:pagina})=>{
 await abrir(pagina,'entrada-saida');
 const pausa=pagina.locator('[data-practice="entrada-corrigir-total"]');
 await expect(pausa.getByRole('textbox',{name:'Seu código corrigido',exact:true})).toBeVisible();
 await expect(pausa.locator('.eyebrow')).toContainText('Encontrar e corrigir o bug');
});