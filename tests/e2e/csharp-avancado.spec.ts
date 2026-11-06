import {test,expect} from '@playwright/test';
import {practicesForLesson} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';
test('contratos C# preservam previsão, snapshot, diagnóstico e assistência offline',async({page:pagina,context:contexto})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});await pagina.emulateMedia({reducedMotion:'reduce'});
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/cs-objetos-contratos');const pausas=practicesForLesson('cs-objetos-contratos');await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'{}').adaptive?.skills??{})).toEqual({});
  for(const pausa of pausas){
   const cartao=pagina.locator('[data-practice="'+pausa.id+'"]'),conferir=()=>cartao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
   if(pausa.kind==='choice')await cartao.locator('input[value="outra-lambda"]').check();else await cartao.getByRole('textbox').fill(pausa.kind==='fill'?'nomes':'Lia\nFalse\nFalse');
   await conferir();await expect(cartao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');await expect(cartao.locator('[data-help] pre')).toHaveCount(0);
   if(pausa.kind==='choice')await cartao.locator('input[value="mesma-instancia"]').check();else await cartao.getByRole('textbox').fill(pausa.kind==='fill'?'[.. nomes]':getPracticeSolution(pausa.id)!);
   await conferir();await expect(cartao.locator('.practice-feedback')).toContainText('Sua resposta está correta');await expect(cartao.locator('.practice-feedback')).toContainText('não houve execução de csharp');
  }
  const ultima=pausas.at(-1)!;await pagina.locator('[data-practice="'+ultima.id+'"]').getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload({waitUntil:'domcontentloaded'});await expect(pagina.locator('#aula-projeto')).toBeVisible();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['cs-contratos-copiar-nomes']).toMatchObject({value:'[.. nomes]',passed:true,assisted:false,attempts:2});expect(salvo.practiceAnswers[ultima.id]).toMatchObject({passed:true,assisted:true,attempts:2});expect(salvo.adaptive.skills[ultima.skillIds[0]].review.lastOutcome).toBe('assisted');expect(remotas).toEqual([]);
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});