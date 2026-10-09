import {test,expect} from '@playwright/test';
import {getPracticeSolution} from '../../src/learning/practice';

test('closures: depuração executada conserva respostas e assistência offline',async({page:pagina,context:contexto})=>{
 test.setTimeout(120000);
 const execucoes:string[]=[];
 pagina.on('request',requisicao=>{if(/\/api\/(executions|execute|run|submissions)/.test(requisicao.url()))execucoes.push(requisicao.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/js-closures-estado');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(17);
  await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
  const casos=[
   ['js-debug-contadores','binding compartilhado','javascript.closures.instancias'],
   ['js-debug-callbacks','binding terminal','javascript.closures.iteracoes'],
   ['js-debug-snapshot','fronteira da construção','javascript.closures.snapshots']
  ];
  for(const [id,erro] of casos){
   const pausa=pagina.locator('[data-practice="'+id+'"]');
   await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
   await expect(pausa.locator('.practice-feedback')).toContainText(erro,{timeout:20000});
   await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
   await pausa.getByLabel('Seu código corrigido').fill(getPracticeSolution(id)!);
   await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
   await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
  }
  const snapshot=pagina.locator('[data-practice="js-debug-snapshot"]');
  await snapshot.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(snapshot.locator('.practice-feedback')).toContainText('registrada como assistência');
  await pagina.reload({waitUntil:'domcontentloaded'});
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  for(const [id,,habilidade] of casos){
   await expect(pagina.locator('[data-practice="'+id+'"] textarea')).toHaveValue(getPracticeSolution(id)!);
   expect(salvo.practiceAnswers[id].passed).toBe(true);
   expect(salvo.adaptive.skills[habilidade].evidence[id].firstTry).toBe(false);
  }
  expect(salvo.practiceAnswers['js-debug-snapshot'].assisted).toBe(true);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   for(const [id] of casos)await expect(pagina.locator('[data-practice="'+id+'"]')).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
