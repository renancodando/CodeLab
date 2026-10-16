import {chromium} from 'file:///C:/Users/perei/Documents/Codex/2026-10-03/nao-m/work/CodeLab/node_modules/playwright/index.mjs';
const base='https://code-lab-omega.vercel.app';
const browser=await chromium.launch({headless:true,channel:'msedge'}),context=await browser.newContext({viewport:{width:1440,height:900}});
const page=await context.newPage(),errors=[],requests=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('requestfailed',r=>requests.push({url:r.url().replace(/[?].*$/,''),error:r.failure()?.errorText}));
let result;
try{
 const response=await page.goto(base,{waitUntil:'networkidle',timeout:60000});
 if(response.status()!==200)throw Error('Home HTTP '+response.status());
 await page.goto(base+'/#/aula/cpp-iteradores-invalidacao',{waitUntil:'networkidle'});
 await page.locator('.lesson-chapter').first().waitFor({timeout:20000});
 const chapters=await page.locator('.lesson-chapter').count(),pauses=await page.locator('[data-inline-practice]').count();
 if(chapters!==17||pauses!==3)throw Error('Aula incompleta: '+JSON.stringify({chapters,pauses,text:(await page.locator('main').innerText()).slice(0,600)}));
 const practice=page.locator('[data-practice="cpp-prever-intervalo"]');
 await practice.getByLabel('Saída prevista, uma linha por saída').fill('6,2');
 await practice.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 const feedback=await practice.locator('.practice-feedback').innerText();
 if(!feedback.includes('Sua resposta está correta'))throw Error('Resposta não aprovada: '+feedback);
 await page.reload({waitUntil:'networkidle'});
 if(await practice.locator('textarea').inputValue()!=='6,2')throw Error('Resposta não persistiu');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')));
 if(!stored.practiceAnswers['cpp-prever-intervalo'].passed)throw Error('Avaliação não persistiu');
 await page.screenshot({path:'C:/Users/perei/Documents/Codex/2026-10-03/nao-m/outputs/verificacao-publica-cpp.png'});
 result={ok:true,url:base,chapters,pauses,feedback,persisted:true,pageErrors:errors,requestFailures:requests};
}catch(error){result={ok:false,error:String(error),pageErrors:errors,requestFailures:requests,url:page.url()};}
finally{await context.close();await browser.close();}
console.log(JSON.stringify(result,null,2));
if(!result.ok)process.exitCode=1;

