import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {contratosIntegracao} from '../../src/content/contratos-integracao';

const aulas=[
 {id:'fullstack-arquitetura',previsao:'fullstack-prever-autoridade',saida:'99\ntrue',decisao:'fullstack-limitar-campos',errada:'extras',certa:'permitidos',producao:'fullstack-preparar-cadastro',falha:'Confira o título inteiro',offline:true},
 {id:'fullstack-integracao',previsao:'fullstack-prever-rascunho',saida:'Estudar CSS\n42\nfalse',decisao:'fullstack-preservar-falha',errada:'limpar-texto',certa:'encerrar',producao:'fullstack-aplicar-confirmacao',falha:'Use os dados confirmados',offline:false},
 {id:'fullstack-testes',previsao:'fullstack-prever-evidencia',saida:'true\nfalse',decisao:'fullstack-testar-fronteira',errada:'mock',certa:'real',producao:'fullstack-testar-cadastro',falha:'Use títulos diferentes',offline:false},
 {id:'fullstack-config',previsao:'fullstack-prever-configuracao',saida:'true\n""\nfalse',decisao:'fullstack-conferir-publicacao',errada:'preview',certa:'destino',producao:'fullstack-configuracao-publica',falha:'Valide os textos',offline:false},
 {id:'fullstack-memoria',previsao:'fullstack-prever-descarte',saida:'1\n0',decisao:'fullstack-liberar-modelo',errada:'editor',certa:'ambos',producao:'fullstack-criar-descarte',falha:'A última aquisição',offline:false}
];
async function conferir(pagina:Page,id:string){await pagina.locator('[data-practice="'+id+'"]').getByRole('button',{name:'Conferir comportamento',exact:true}).click();}
for(const aula of aulas)test(aula.id+': previsão, diagnóstico e produção passam pelo executor local',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))execucoes.push(r.url());});await pagina.emulateMedia({reducedMotion:'reduce'});
 if(aula.offline){await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);}
 try{
  await pagina.goto('/#/aula/'+aula.id);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);
  const prever=pagina.locator('[data-practice="'+aula.previsao+'"]');await prever.getByLabel('Saída prevista, uma linha por saída').fill('Outra previsão');await conferir(pagina,aula.previsao);await expect(prever.locator('.practice-feedback')).toContainText('não houve execução de javascript');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill(aula.saida);await conferir(pagina,aula.previsao);await expect(prever.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const decisao=pagina.locator('[data-practice="'+aula.decisao+'"]');await decisao.locator('input[value="'+aula.errada+'"]').check();await conferir(pagina,aula.decisao);await expect(decisao.locator('.practice-feedback')).toContainText('não houve execução de javascript');await expect(decisao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');await expect(decisao.locator('[data-help] pre')).toHaveCount(0);
  await decisao.locator('input[value="'+aula.certa+'"]').check();await conferir(pagina,aula.decisao);await expect(decisao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const produzir=pagina.locator('[data-practice="'+aula.producao+'"]');await conferir(pagina,aula.producao);await expect(produzir.locator('.practice-feedback')).toContainText(aula.falha);await expect(produzir.locator('[data-help] pre')).toHaveCount(0);
  await produzir.getByLabel('Seu código',{exact:true}).fill(contratosIntegracao[aula.producao].solution);await conferir(pagina,aula.producao);await expect(produzir.locator('.practice-feedback')).toContainText('A correção passou');
  if(aula.offline)await produzir.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await pagina.reload({waitUntil:'domcontentloaded'});await expect(pagina.locator('#aula-projeto')).toBeVisible();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[aula.producao]).toMatchObject({passed:true,assisted:aula.offline,attempts:2});expect(salvo.practiceAnswers[aula.decisao].value).toBe(aula.certa);
  if(aula.offline){expect(salvo.adaptive.skills['fullstack.validacao.entrada'].review.lastOutcome).toBe('assisted');expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
   for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:1000});await pagina.evaluate(()=>new Promise<void>(resolver=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolver()))));expect(await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pagina.locator('[data-practice="'+aula.producao+'"]').getByLabel('Seu código',{exact:true})).toBeVisible();}
  }
  expect(execucoes).toEqual([]);
 }finally{if(aula.offline)await contexto.setOffline(false);}
});
