import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {contratosProjetos} from '../../src/content/contratos-projetos';

const aulas=[
 {id:'projeto-diario',previsao:'diario-prever-indice-filtrado',saida:'n2,n3',decisao:'diario-preservar-importacao',errada:'limpar-antes',certa:'validar-antes',producao:'diario-mesclar-backup',falha:'O ID substitui',offline:true},
 {id:'projeto-tarefas',previsao:'tarefas-prever-contador',saida:'1\n0',decisao:'tarefas-contar-fonte-completa',errada:'visiveis',certa:'colecao',producao:'tarefas-reduzir-acao',falha:'Identifique o item',offline:false},
 {id:'projeto-clima',previsao:'clima-prever-resposta-atrasada',saida:'B\n28',decisao:'clima-conferir-consulta',errada:'cidade',certa:'completa',producao:'clima-concluir-consulta',falha:'Zero é uma temperatura',offline:false}
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
  await produzir.getByRole('textbox',{name:'Seu código',exact:true}).fill(contratosProjetos[aula.producao].solution);await conferir(pagina,aula.producao);await expect(produzir.locator('.practice-feedback')).toContainText('A correção passou');
  if(aula.offline)await produzir.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await pagina.reload({waitUntil:'domcontentloaded'});await expect(pagina.locator('#aula-projeto')).toBeVisible();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[aula.producao]).toMatchObject({passed:true,assisted:aula.offline,attempts:2});expect(salvo.practiceAnswers[aula.decisao].value).toBe(aula.certa);
  if(aula.offline){expect(salvo.adaptive.skills['projetos.diario.backup-versionado'].review.lastOutcome).toBe('assisted');expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
   for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:1000});await pagina.evaluate(()=>new Promise<void>(resolver=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolver()))));expect(await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pagina.locator('[data-practice="'+aula.producao+'"]').getByRole('textbox',{name:'Seu código',exact:true})).toBeVisible();}
   await pagina.goto('/#/perfil');
   const grupo=pagina.locator('.skill-tree details').filter({has:pagina.locator('summary',{hasText:/^JavaScript$/})});await grupo.locator('summary').click();
   await expect(grupo).toContainText('JavaScript → Projetos → Diário → Backup versionado');
   await expect(grupo.locator('a[href="#/pratica/diario-mesclar-backup"]')).toBeVisible();
   await expect(grupo.locator('a[href="#/pratica/fullstack-preparar-cadastro"]')).toBeVisible();
   const habilidades=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).adaptive.skills);expect(habilidades['projetos.diario.backup-versionado']).toEqual(salvo.adaptive.skills['projetos.diario.backup-versionado']);
  }
  expect(execucoes).toEqual([]);
 }finally{if(aula.offline&&!pagina.isClosed())await contexto.setOffline(false);}
});
