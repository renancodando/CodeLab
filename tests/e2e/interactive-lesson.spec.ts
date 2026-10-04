import {test,expect,type Page} from '@playwright/test';
import {valores} from '../../src/learning/valores';
async function writeCode(page:Page,code:string){const input=page.getByRole('textbox',{name:'É aqui que você escreve seu código'});await input.focus();await page.keyboard.press('Control+a');await input.evaluate((element,text)=>{const transfer=new DataTransfer();transfer.setData('text/plain',text);element.dispatchEvent(new ClipboardEvent('paste',{clipboardData:transfer,bubbles:true,cancelable:true}));},code);}
test('aula prática retoma, exige respostas reais e conclui todos os 25 passos localmente',async({page})=>{
 test.setTimeout(180000);
 const requests:string[]=[];page.on('request',request=>{if(/\/api\/(auth|progress|executions)/.test(request.url()))requests.push(request.url());});
 await page.goto('/#/aula/valores');
 for(let index=0;index<valores.steps.length;index++){
  const step=valores.steps[index];await expect(page.locator('#step-title')).toHaveText(step.title);
  if(step.type!=='explanation'){
   await expect(page.locator('#step-next')).toBeDisabled();
   if(index===1){await page.getByLabel(step.options![0].text,{exact:true}).check();await page.locator('#check-step').click();await expect(page.locator('#step-feedback')).toContainText('nome');await expect(page.locator('#step-next')).toBeDisabled();}
   if(step.type==='choice')await page.getByLabel(step.options![step.correct!].text,{exact:true}).check();
   if(step.type==='fill')await page.locator('#step-answer').fill(step.accepted![0]);
   if(step.type==='code'){await expect(page.locator('.monaco-editor')).toBeVisible();await writeCode(page,step.solution!);}
   if(index===3){await page.reload();await expect(page.locator('#step-title')).toHaveText(step.title);await expect(page.locator('#step-answer')).toHaveValue(step.accepted![0]);}
   await page.locator('#check-step').click();await expect(page.locator('#step-next')).toBeEnabled({timeout:15000});
   if(index===3){await page.locator('#step-answer').fill('999');await expect(page.locator('#step-next')).toBeDisabled();await page.locator('#step-answer').fill(step.accepted![0]);await page.locator('#check-step').click();await expect(page.locator('#step-next')).toBeEnabled();}
  }
  await page.locator('#step-next').click();
 }
 await expect(page.getByRole('heading',{name:'Aula concluída',exact:true})).toBeVisible();
 await expect(page.locator('#lesson-summary .mastery > div')).toHaveCount(6);
 expect(requests).toEqual([]);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(saved.lessons).toContain('valores');expect(saved.lessonSessions.valores.completedAt).toBeTruthy();expect(saved.review['aula-valores']).toBeTruthy();
 await page.goto('/#/home');await expect(page.locator('.monaco-editor')).toHaveCount(0);
 expect(page.workers().filter(worker=>worker.url().includes('runner.worker'))).toHaveLength(0);
 await page.goto('/#/aula/valores');await expect(page.locator('#step-title')).toHaveText(valores.steps.at(-1)!.title);
 await page.locator('#restart-lesson').click();await expect(page.locator('#step-title')).toHaveText(valores.steps[0].title);
});
test('consultar solução não libera avaliação e leitura completa mantém a rota',async({page})=>{
 await page.goto('/#/aula/valores');await page.locator('#step-next').click();await page.locator('#step-solution').click();await expect(page.locator('#step-next')).toBeDisabled();
 await page.getByRole('link',{name:/Entender melhor/}).click();await expect(page.locator('.lesson-chapter')).toHaveCount(12);await page.locator('.lesson-map a').first().click();expect(page.url()).toContain('#/leitura/valores');await expect(page.locator('.lesson-chapter').first()).toBeVisible();
});
