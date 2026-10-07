import {test,expect,type Page} from '@playwright/test';
import {getPracticeSolution} from '../../src/learning/practice';
import {capstoneProjects,learningPaths} from '../../src/content/project-paths';
import {freshAdaptive,recordEvidence,learningDay} from '../../src/learning/adaptive';
test.use({timezoneId:'America/Sao_Paulo'});
const feedback=(page:Page)=>page.locator('.practice-feedback');
async function checkCode(page:Page,id:string,code:string){
 await page.goto('/#/pratica/'+id);await page.getByLabel('Seu código corrigido').fill(code);await page.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(page.getByRole('button',{name:'Conferir comportamento',exact:true})).toBeEnabled();return feedback(page);
}
test('depuração confere bordas, preserva solução oculta e mantém domínio por habilidade',async({page})=>{
 await checkCode(page,'js-debug-soma-vazia','function somaLista(v){return v.reduce((a,b)=>a+b);}');
 await expect(feedback(page)).toContainText('lista vazia ainda falha');await expect(page.locator('[data-help] pre')).toHaveCount(0);
 await page.getByLabel('Seu código corrigido').fill(getPracticeSolution('js-debug-soma-vazia')!);await page.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(feedback(page)).toContainText('A correção passou');const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(saved.adaptive.skills['javascript.arrays.reduce'].evidence['js-debug-soma-vazia'].firstTry).toBe(false);
 await page.goto('/#/perfil');await page.locator('.skill-tree summary').filter({hasText:'JavaScript'}).click();await expect(page.locator('.skill-tree')).toContainText('JavaScript → Arrays → Acumulação');await expect(page.locator('.skill-tree')).toContainText('80%');
 await checkCode(page,'js-debug-carrinho','function totalizar(){return 89.9;}');await expect(feedback(page)).toContainText('vazio');await page.getByLabel('Seu código corrigido').fill(getPracticeSolution('js-debug-carrinho')!);await page.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(feedback(page)).toContainText('A correção passou');
});
test('leitura não pontua domínio, sessão progride e retoma sem duplicar atividades',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'Continuar aprendendo',exact:true}).click();await expect(page.locator('[data-seen]')).toBeVisible();
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(Object.keys(before.adaptive.skills)).toHaveLength(0);expect(before.adaptive.daily.items.map((x:{kind:string})=>x.kind)).toEqual(['concept','practice','practice','challenge']);
 await page.locator('[data-seen]').click();
 for(let n=0;n<3;n++){const card=page.locator('[data-current] [data-practice]');await expect(card).toBeVisible();const id=(await card.getAttribute('data-practice'))!;await card.getByLabel('Seu código corrigido').fill(getPracticeSolution(id)!);await card.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(card.locator('.practice-feedback')).toContainText('A correção passou');await page.locator('[data-next]').click();}
 await expect(page.getByRole('heading',{name:'Sessão concluída',exact:true})).toBeVisible();await page.reload();await expect(page.getByRole('heading',{name:'Sessão concluída',exact:true})).toBeVisible();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(after.adaptive.daily.completed).toHaveLength(4);expect(new Set(after.adaptive.daily.items.map((x:{id:string})=>x.id)).size).toBe(4);expect(after.adaptive.seenConcepts).toHaveLength(1);
});
test('Python, C# e C++ continuam offline após preparação, sem submissões externas',async({page,context})=>{
 test.setTimeout(90000);const submissions:string[]=[];page.on('request',request=>{if(/\/api\/(execute|run|submissions)/.test(request.url()))submissions.push(request.url());});
 await page.goto('/');await expect(page.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await context.setOffline(true);
 try{
  await page.reload({waitUntil:'domcontentloaded'});await page.goto('/#/pratica/py-prever-range');await page.getByLabel('Saída prevista, uma linha por saída').fill('0\n2\n4');await page.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(feedback(page)).toContainText('Sua resposta está correta');await expect(feedback(page)).toContainText('sem execução de compilador');
  await page.goto('/#/pratica/cs-prever-decimal');await page.getByLabel('Saída prevista, uma linha por saída').fill('True');await page.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(feedback(page)).toContainText('Sua resposta está correta');
  await page.goto('/#/pratica/cpp-prever-referencia');await page.getByLabel('Saída prevista, uma linha por saída').fill('7,7');await page.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(feedback(page)).toContainText('Sua resposta está correta');
  await checkCode(page,'js-debug-soma-vazia',getPracticeSolution('js-debug-soma-vazia')!);await expect(feedback(page)).toContainText('A correção passou');expect(submissions).toEqual([]);
 }finally{await context.setOffline(false);}
});
test('assistência não fabrica domínio e pausas aparecem junto à teoria',async({page})=>{
 await page.goto('/#/aula/css-grid-trilhas');await expect(page.locator('[data-inline-practice]')).toHaveCount(2);await expect(page.locator('#aula-contexto [data-practice="css-grid-minimo"]')).toBeVisible();
 const card=page.locator('[data-practice="css-grid-minimo"]');await card.locator('[data-solution]').click();await card.getByLabel('Trecho que falta').fill('minmax(0, 1fr)');await card.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(card.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(saved.adaptive.skills['css.grid'].evidence['css-grid-minimo'].assisted).toBe(true);
 await page.goto('/#/perfil');await page.locator('.skill-tree summary').filter({hasText:'CSS'}).click();await expect(page.locator('.skill-tree details').filter({has:page.locator('summary').filter({hasText:'CSS'})})).toContainText('Ainda sem evidência');
});
test('projeto retoma vários arquivos, exporta ZIP e invalida evidência após editar',async({page})=>{
 const project=capstoneProjects.find(p=>p.id==='html-caderno')!;await page.goto('/#/projeto/'+project.id);await expect(page.locator('[data-code]')).toBeVisible();
 for(const criterion of project.milestones[0].criteria){const form=page.locator('[data-criterion="'+criterion.id+'"]');await form.locator('textarea').fill('Conferi o cenário descrito e registrei o resultado observado.');await form.getByRole('button',{name:'Registrar evidência',exact:true}).click();}
 await expect(page.locator('[data-project-progress]')).toContainText('1 de');
 await page.locator('[data-code]').fill('<h1>Meu projeto original</h1>');await expect(page.locator('[data-project-progress]')).toContainText('0 de');await expect(page.locator('.rubric')).toContainText('Reconferir');
 await page.reload();await expect(page.locator('[data-code]')).toHaveValue('<h1>Meu projeto original</h1>');await expect(page.locator('.rubric')).toContainText('Nota histórica');
 await page.locator('[data-add]').click();await page.locator('[data-new-file] input').fill('src/observacao.txt');await page.getByRole('button',{name:'Criar arquivo',exact:true}).click();await page.locator('[data-code]').fill('Arquivo novo do projeto');
 const download=page.waitForEvent('download');await page.locator('[data-export]').click();const exported=await download;expect(exported.suggestedFilename()).toBe(project.id+'.zip');const stream=await exported.createReadStream();const pieces:Buffer[]=[];for await(const piece of stream!)pieces.push(Buffer.from(piece));const zip=Buffer.concat(pieces);expect(zip.readUInt32LE(0)).toBe(0x04034b50);expect(zip.includes(Buffer.from('src/observacao.txt'))).toBe(true);expect(zip.includes(Buffer.from('README-CODELAB.md'))).toBe(true);
 await page.goto('/#/perfil');const backupEvent=page.waitForEvent('download');await page.locator('#export-progress').click();const backup=await backupEvent,backupStream=await backup.createReadStream();const chunks:Buffer[]=[];for await(const chunk of backupStream!)chunks.push(Buffer.from(chunk));const data=JSON.parse(Buffer.concat(chunks).toString());expect(data.projectWorkspaces[project.id].files['src/observacao.txt']).toBe('Arquivo novo do projeto');
});
test('seis percursos têm prática conceitual corrigida sem aprovar a implementação aberta',async({page})=>{
 await page.goto('/#/aprender');await expect(page.locator('#engineering-paths .trail')).toHaveCount(6);
 const path=learningPaths.find(p=>p.id==='algoritmos')!;await page.goto('/#/percurso/'+path.id);await expect(page.locator('[data-stage]')).toHaveCount(3);const stage=path.stages[0],section=page.locator('[data-stage="'+stage.id+'"]');await section.locator('input[value="'+stage.assessment.correct+'"]').check();await section.getByRole('button',{name:'Conferir decisão',exact:true}).click();await expect(section.locator('[role=status]')).toContainText('Decisão conceitual conferida');await expect(section).toContainText('implementação aberta');
});

test('duas revisões antigas vêm primeiro e um erro agenda retorno mais curto',async({page})=>{
 const clock={now:Date.now()-86400000,timeZone:'America/Sao_Paulo'},adaptive=freshAdaptive();
 for(const [id,skill] of [['py-prever-range','python.controle.range'],['cs-prever-decimal','csharp.tipos.decimal']]){
  recordEvidence(adaptive,{id:'anterior-'+id,assessmentId:id,activityId:id,skillIds:[skill],revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'practice'},clock);
 }
 await page.addInitScript(data=>localStorage.setItem('codelab.progress.v2',JSON.stringify(data)),{version:2,learningLanguage:'javascript',adaptive});await page.goto('/#/diaria');
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(before.adaptive.daily.items.map((x:{kind:string})=>x.kind)).toEqual(['review','review','concept','practice','practice','challenge']);
 const first=before.adaptive.daily.items[0];await page.getByLabel('Saída prevista, uma linha por saída').fill('999');await page.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(page.locator('[data-next]')).toBeVisible();
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(after.adaptive.daily.completed).toContain(first.id);expect(after.adaptive.skills[first.skillId].review.dueDay).toBe(learningDay({now:Date.now()+86400000,timeZone:'America/Sao_Paulo'}));expect(after.adaptive.skills[first.skillId].review.stage).toBe(0);
});
