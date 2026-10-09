import {test,expect,type Page} from '@playwright/test';
import {valores} from '../../src/learning/valores';

async function escreverCodigo(pagina:Page,codigo:string){
 const campo=pagina.getByRole('textbox',{name:'É aqui que você escreve seu código'});
 await campo.focus();await pagina.keyboard.press('Control+a');
 await campo.evaluate((elemento,texto)=>{const transferencia=new DataTransfer();transferencia.setData('text/plain',texto);elemento.dispatchEvent(new ClipboardEvent('paste',{clipboardData:transferencia,bubbles:true,cancelable:true}));},codigo);
}
function observarEnvios(pagina:Page){
 const requisicoes:string[]=[];
 pagina.on('request',requisicao=>{if(/\/api\/(auth|progress|executions)/.test(requisicao.url()))requisicoes.push(requisicao.url());});
 return requisicoes;
}
async function conferirPassos(pagina:Page,inicio:number,fim:number){
 for(let indice=inicio;indice<fim;indice++){
  const etapa=valores.steps[indice];await expect(pagina.locator('#step-title')).toHaveText(etapa.title);
  if(etapa.type!=='explanation'){
   await expect(pagina.locator('#step-next')).toBeDisabled();
   if(indice===1){await pagina.getByLabel(etapa.options![0].text,{exact:true}).check();await pagina.locator('#check-step').click();await expect(pagina.locator('#step-feedback')).toContainText('nome');await expect(pagina.locator('#step-next')).toBeDisabled();}
   if(etapa.type==='choice')await pagina.getByLabel(etapa.options![etapa.correct!].text,{exact:true}).check();
   if(etapa.type==='fill')await pagina.locator('#step-answer').fill(etapa.accepted![0]);
   if(etapa.type==='code'){await expect(pagina.locator('.monaco-editor')).toBeVisible();await escreverCodigo(pagina,etapa.solution!);}
   if(indice===3){await pagina.reload();await expect(pagina.locator('#step-title')).toHaveText(etapa.title);await expect(pagina.locator('#step-answer')).toHaveValue(etapa.accepted![0]);}
   await pagina.locator('#check-step').click();await expect(pagina.locator('#step-next')).toBeEnabled({timeout:15000});
   if(indice===3){await pagina.locator('#step-answer').fill('999');await expect(pagina.locator('#step-next')).toBeDisabled();await pagina.locator('#step-answer').fill(etapa.accepted![0]);await pagina.locator('#check-step').click();await expect(pagina.locator('#step-next')).toBeEnabled();}
  }
  await pagina.locator('#step-next').click();
 }
}
async function retomarJornada(pagina:Page,jornada:string){
 expect(jornada).toBeTruthy();
 await pagina.addInitScript(backup=>{if(!localStorage.getItem('codelab.progress.v2'))localStorage.setItem('codelab.progress.v2',backup);},jornada);
 await pagina.goto('/#/aula/valores');
}

test.describe.serial('jornada real dos 25 passos com checkpoints entre contextos',()=>{
 let jornada:string;
 test('resolve os primeiros doze passos e conserva respostas após recarregar',async({page:pagina})=>{
  test.setTimeout(180000);const requisicoes=observarEnvios(pagina);
  await pagina.goto('/#/aula/valores');await conferirPassos(pagina,0,12);
  jornada=await pagina.evaluate(()=>localStorage.getItem('codelab.progress.v2')!);
  const salvo=JSON.parse(jornada);
  expect(salvo.lessonSessions.valores.currentStep).toBe(valores.steps[12].id);
  expect(salvo.lessonSessions.valores.completedAt).toBeUndefined();expect(salvo.lessons).not.toContain('valores');
  expect(requisicoes).toEqual([]);
 });
 test('retoma o checkpoint real e conclui todos os passos restantes com avaliação',async({page:pagina})=>{
  test.setTimeout(180000);const requisicoes=observarEnvios(pagina);
  await retomarJornada(pagina,jornada);await conferirPassos(pagina,12,valores.steps.length);
  await expect(pagina.getByRole('heading',{name:'Aula concluída',exact:true})).toBeVisible();
  await expect(pagina.locator('#lesson-summary .mastery > div')).toHaveCount(6);
  jornada=await pagina.evaluate(()=>localStorage.getItem('codelab.progress.v2')!);
  const salvo=JSON.parse(jornada);
  expect(salvo.lessons).toContain('valores');expect(salvo.lessonSessions.valores.completedAt).toBeTruthy();expect(salvo.review['aula-valores']).toBeTruthy();
  expect(requisicoes).toEqual([]);
 });
 test('alteração invalida conclusão, assistência encurta revisão e recomeço limpa a sessão',async({page:pagina})=>{
  const requisicoes=observarEnvios(pagina);await retomarJornada(pagina,jornada);
  await pagina.locator('#step-next').click();await expect(pagina.getByRole('heading',{name:'Aula concluída',exact:true})).toBeVisible();
  await escreverCodigo(pagina,'function saldoAposCompra(){return 64;}');await expect(pagina.getByRole('heading',{name:'Aula concluída',exact:true})).toHaveCount(0);await expect(pagina.locator('#step-next')).toBeDisabled();
  const alterado=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(alterado.lessonSessions.valores.completedAt).toBeUndefined();expect(alterado.review['aula-valores']).toBeUndefined();
  await escreverCodigo(pagina,valores.steps.at(-1)!.solution!);await pagina.locator('#check-step').click();await expect(pagina.locator('#step-next')).toBeEnabled({timeout:15000});await pagina.locator('#step-next').click();
  await pagina.locator('#step-solution').click();await expect(pagina.getByRole('heading',{name:'Aula concluída',exact:true})).toHaveCount(0);await pagina.locator('#step-next').click();await expect(pagina.getByRole('heading',{name:'Aula concluída',exact:true})).toBeVisible();
  const revisao=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).review['aula-valores']);expect(Date.parse(revisao)-Date.now()).toBeLessThan(86400000+10000);expect(Date.parse(revisao)-Date.now()).toBeGreaterThan(0);
  await pagina.goto('/#/home');await expect(pagina.locator('.monaco-editor')).toHaveCount(0);
  expect(pagina.workers().filter(worker=>worker.url().includes('runner.worker'))).toHaveLength(0);
  await pagina.goto('/#/aula/valores');await expect(pagina.locator('#step-title')).toHaveText(valores.steps.at(-1)!.title);
  await pagina.locator('#restart-lesson').click();await expect(pagina.locator('#step-title')).toHaveText(valores.steps[0].title);
  expect(requisicoes).toEqual([]);
 });
});

test('consultar solução não libera avaliação e leitura completa mantém a rota',async({page})=>{
 await page.goto('/#/aula/valores');await page.locator('#step-next').click();await page.locator('#step-solution').click();await expect(page.locator('#step-next')).toBeDisabled();
 await page.getByRole('link',{name:/Entender melhor/}).click();await expect(page.locator('.lesson-chapter')).toHaveCount(12);await page.locator('.lesson-map a').first().click();expect(page.url()).toContain('#/leitura/valores');await expect(page.locator('.lesson-chapter').first()).toBeVisible();
});
