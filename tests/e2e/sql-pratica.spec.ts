import {test,expect,type Page} from '@playwright/test';
import {solucoesSql} from '../../src/content/solucoes-sql';
const idContagem='sql-depurar-clientes-pagos',idTotais='sql-depurar-totais-colecoes';
async function abrir(pagina:Page){await pagina.goto('/#/aula/sql-joins-cardinalidade');await expect(pagina.locator('[data-practice="'+idContagem+'"]')).toBeVisible();}
async function conferir(pagina:Page,id:string,codigo?:string){
 const pausa=pagina.locator('[data-practice="'+id+'"]');if(codigo!==undefined)await pausa.getByLabel('Seu código corrigido').fill(codigo);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();return pausa;
}
test('SQL corrigível: resultados reais, solução alternativa, offline, assistência e persistência',async({page:pagina,context:contexto})=>{
 test.setTimeout(180000);const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await abrir(pagina);
 await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);const contagem=await conferir(pagina,idContagem);await expect(contagem.locator('.practice-feedback')).toContainText('desapareceu');await expect(contagem.locator('[data-help] pre')).toHaveCount(0);
 await conferir(pagina,idContagem,'SELECT FROM;');await expect(contagem.locator('.practice-feedback')).toContainText('syntax error');await expect(contagem.locator('.practice-feedback')).not.toContainText('não carregou');
 await conferir(pagina,idContagem,"DELETE FROM pedidos WHERE status <> 'pago';"+solucoesSql[idContagem].replace(" AND p.status='pago'",''));await expect(contagem.locator('.practice-feedback')).toContainText('uma única consulta');
 await conferir(pagina,idContagem,solucoesSql[idContagem]);await expect(contagem.locator('.practice-feedback')).toContainText('Comportamento avaliado em SQLite local isolado');await expect(contagem.locator('.practice-feedback')).not.toContainText('executor JavaScript');
 await contexto.setOffline(true);
 try{
  const totais=await conferir(pagina,idTotais);await expect(totais.locator('.practice-feedback')).toContainText('multiplicam');await expect(totais.locator('[data-help] pre')).toHaveCount(0);
  const alternativa='SELECT p.id AS pedido_id,coalesce((SELECT sum(i.centavos) FROM itens i WHERE i.pedido_id=p.id),0) AS itens,coalesce((SELECT sum(pg.centavos) FROM pagamentos pg WHERE pg.pedido_id=p.id),0) AS pagamentos FROM pedidos p ORDER BY p.id;';
  await conferir(pagina,idTotais,alternativa);await expect(totais.locator('.practice-feedback')).toContainText('passou nas bases e bordas');await expect(totais.locator('.practice-feedback')).toContainText('não é execução PostgreSQL');
  await totais.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(totais.locator('.practice-feedback')).toContainText('registrada como assistência');await pagina.reload();await expect(totais.locator('textarea')).toHaveValue(alternativa);await expect(contagem.locator('textarea')).toHaveValue(solucoesSql[idContagem]);
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idContagem].passed).toBe(true);expect(salvo.practiceAnswers[idTotais].assisted).toBe(true);expect(salvo.adaptive.skills['sql.joins.preservacao'].evidence[idContagem].firstTry).toBe(false);
  const habilidade=salvo.adaptive.skills['sql.joins.granularidade'];expect(habilidade.evidence[idTotais].assisted).toBe(false);expect(habilidade.evidence[idTotais].assistedDay).toBeTruthy();expect(habilidade.review.lastOutcome).toBe('assisted');
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(contagem).toBeVisible();await expect(totais).toBeVisible();}
  expect(remotas).toEqual([]);
 }finally{await contexto.setOffline(false);}
});

test('SQL corrigível: tempo limite, alteração e saída encerram workers sem registrar tentativas canceladas',async({page:pagina})=>{
 test.setTimeout(150000);await abrir(pagina);const pausa=pagina.locator('[data-practice="'+idContagem+'"]');
 const infinito='WITH RECURSIVE numeros(n) AS(VALUES(1) UNION ALL SELECT n+1 FROM numeros) SELECT sum(n) FROM numeros;';
 await conferir(pagina,idContagem,infinito);await expect(pausa.locator('.practice-feedback')).toContainText('tempo limite',{timeout:30000});await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
 const tentativas=await pagina.evaluate(id=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).practiceAnswers[id].attempts,idContagem);
 const iniciado=pagina.waitForEvent('worker',{predicate:w=>w.url().includes('sql-local.worker')});await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await iniciado;await pausa.getByLabel('Seu código corrigido').fill('SELECT 1;');await expect(pausa.getByRole('button',{name:'Conferir comportamento',exact:true})).toBeEnabled();await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
 expect(await pagina.evaluate(id=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).practiceAnswers[id].attempts,idContagem)).toBe(tentativas);
 await conferir(pagina,idContagem,solucoesSql[idContagem]);await expect(pausa.locator('.practice-feedback')).toContainText('passou nas bases e bordas');
 const outro=pagina.waitForEvent('worker',{predicate:w=>w.url().includes('sql-local.worker')});await conferir(pagina,idContagem,infinito);await outro;await pagina.goto('/#/home');await expect.poll(()=>pagina.workers().filter(w=>w.url().includes('sql-local.worker')).length).toBe(0);
});

test.describe('carregamento da conferência SQL',()=>{
 test.use({serviceWorkers:'block'});
 test('módulo indisponível preserva resposta e nota e permite retomar',async({page:pagina})=>{
  test.setTimeout(120000);await abrir(pagina);await pagina.clock.install();let liberar!:()=>void,chegou!:()=>void;const liberado=new Promise<void>(resolver=>liberar=resolver),recebido=new Promise<void>(resolver=>chegou=resolver);
  await pagina.route(/\/assets\/pratica-sql-[^/]+\.js$/,async rota=>{chegou();await liberado;await rota.continue();});
  const pausa=pagina.locator('[data-practice="'+idContagem+'"]');
  try{
   await conferir(pagina,idContagem,solucoesSql[idContagem]);await recebido;await pagina.clock.fastForward(20001);await expect(pausa.locator('.practice-feedback')).toContainText('não conta como erro de aprendizagem');await expect(pausa.getByRole('button',{name:'Conferir comportamento',exact:true})).toBeEnabled();await expect(pausa.locator('textarea')).toHaveValue(solucoesSql[idContagem]);
   const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[idContagem].attempts).toBe(0);expect(salvo.adaptive.skills['sql.joins.preservacao']?.evidence[idContagem]).toBeUndefined();
   const resposta=pagina.waitForResponse(/\/assets\/pratica-sql-[^/]+\.js$/);liberar();await resposta;await pagina.clock.resume();await conferir(pagina,idContagem);await expect(pausa.locator('.practice-feedback')).toContainText('passou nas bases e bordas');
  }finally{liberar();}
 });
});
