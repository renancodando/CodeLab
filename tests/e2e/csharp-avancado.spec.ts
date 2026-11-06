import {test,expect} from '@playwright/test';
import {practicesForLesson} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';
const escolhas:Record<string,string>={'cs-contratos-desinscrever-evento':'mesma-instancia','cs-runtime-encerrar-lease':'snapshot','cs-engenharia-testar-defeitos':'contrato','cs-engenharia-conferir-artefato':'dll-publicado'};
const preenchimentos:Record<string,string>={'cs-contratos-copiar-nomes':'[.. nomes]','cs-runtime-somar-checked':'checked ( valor + total )'};
for(const aula of ['cs-objetos-contratos','cs-runtime-avancado','cs-engenharia'])test(aula+': pausas preservam resposta, limites da execução e assistência',async({page:pagina,context:contexto})=>{
 const offline=aula==='cs-objetos-contratos',remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});await pagina.emulateMedia({reducedMotion:'reduce'});
 if(offline){await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);}
 try{
  await pagina.goto('/#/aula/'+aula);const pausas=practicesForLesson(aula);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'{}').adaptive?.skills??{})).toEqual({});
  for(const pausa of pausas){
   const cartao=pagina.locator('[data-practice="'+pausa.id+'"]'),conferir=()=>cartao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
   if(pausa.kind==='choice')await cartao.locator('input[value="'+pausa.options!.find(p=>p.id!==escolhas[pausa.id])!.id+'"]').check();else await cartao.getByRole('textbox').fill(pausa.kind==='fill'?'outra expressão':'outra previsão');
   await conferir();await expect(cartao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');await expect(cartao.locator('[data-help] pre')).toHaveCount(0);
   if(pausa.kind==='choice')await cartao.locator('input[value="'+escolhas[pausa.id]+'"]').check();else await cartao.getByRole('textbox').fill(pausa.kind==='fill'?preenchimentos[pausa.id]:getPracticeSolution(pausa.id)!);
   await conferir();await expect(cartao.locator('.practice-feedback')).toContainText('Sua resposta está correta');await expect(cartao.locator('.practice-feedback')).toContainText('não houve execução de csharp');
  }
  const ultima=pausas.at(-1)!;await pagina.locator('[data-practice="'+ultima.id+'"]').getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload({waitUntil:'domcontentloaded'});await expect(pagina.locator('#aula-projeto')).toBeVisible();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  for(const pausa of pausas){const valor=pausa.kind==='choice'?escolhas[pausa.id]:pausa.kind==='fill'?preenchimentos[pausa.id]:getPracticeSolution(pausa.id);expect(salvo.practiceAnswers[pausa.id]).toMatchObject({value:valor,passed:true,assisted:pausa.id===ultima.id,attempts:2});}
  expect(salvo.adaptive.skills[ultima.skillIds[0]].review.lastOutcome).toBe('assisted');expect(remotas).toEqual([]);
 }finally{if(offline&&!pagina.isClosed())await contexto.setOffline(false);}
});