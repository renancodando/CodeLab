import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practicesForLesson} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';
const respostas:Record<string,string>={'ts-genericos-construir-subtipo':'fabrica','ts-relacoes-preservar-chave':'relacionar','ts-avancados-relacionar-evento':'por-campo'};
for(const aula of ['ts-genericos','ts-genericos-relacoes','ts-tipos-avancados'])test(aula+': tipos conceituais preservam resposta, assistência e projeto',async({page:pagina})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/'+aula);const pausas=practicesForLesson(aula);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(pausas.length);expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'{}').adaptive?.skills??{})).toEqual({});
 for(const pausa of pausas){
  const cartao=pagina.locator('[data-practice="'+pausa.id+'"]'),conferir=()=>cartao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await conferir();await expect(cartao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');await expect(cartao.locator('[data-help] pre')).toHaveCount(0);
  if(pausa.kind==='choice')await cartao.locator('input[value="'+respostas[pausa.id]+'"]').check();
  else if(pausa.kind==='order'){const ordem=['abrir','mapa','percorrer','inserir','fechar','retornar','fim-laco'],atuais=pausa.lines!.map(l=>l.id);for(let destino=0;destino<ordem.length;destino++)for(let indice=atuais.indexOf(ordem[destino]);indice>destino;indice--){await cartao.getByRole('button',{name:'Mover linha '+(indice+1)+' para cima'}).click();[atuais[indice-1],atuais[indice]]=[atuais[indice],atuais[indice-1]];}}
  else await cartao.getByRole('textbox').fill(pausa.kind==='fill'?'Array < U >':getPracticeSolution(pausa.id)!);
  await conferir();await expect(cartao.locator('.practice-feedback')).toContainText('Sua resposta está correta');await expect(cartao.locator('.practice-feedback')).toContainText('não houve execução de typescript');
 }
 const ultima=pausas.at(-1)!;await pagina.locator('[data-practice="'+ultima.id+'"]').getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload({waitUntil:'domcontentloaded'});await expect(pagina.locator('#aula-projeto')).toBeVisible();const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[ultima.id]).toMatchObject({passed:true,assisted:true,attempts:2});expect(salvo.adaptive.skills[ultima.skillIds[0]].review.lastOutcome).toBe('assisted');expect(remotas).toEqual([]);
});
test('tipos avançados mantêm variantes e conteúdo em larguras extremas',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/ts-tipos-avancados');const pausa=pagina.locator('[data-practice="ts-avancados-relacionar-evento"]');await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:1000});await pagina.evaluate(()=>new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r()))));expect(await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);await expect(pausa.locator('input[type=radio]')).toHaveCount(4);await expect(pausa.locator('[data-help] pre')).toContainText('[K in keyof T');await expect(pagina.locator('#aula-projeto')).toBeVisible();}
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
});
