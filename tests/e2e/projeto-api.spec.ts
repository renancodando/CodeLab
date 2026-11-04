import {test,expect} from '@playwright/test';

test('projeto API pratica transação e parâmetro sem executar C# do aluno',async({page:pagina})=>{
 const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});await pagina.emulateMedia({reducedMotion:'reduce'});
 await pagina.goto('/#/aula/projeto-api');await expect(pagina.locator('[data-inline-practice]')).toHaveCount(2);await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);
 const prever=pagina.locator('[data-practice="api-prever-transacao"]'),conferir=async(id:string)=>{await pagina.locator('[data-practice="'+id+'"]').getByRole('button',{name:'Conferir comportamento',exact:true}).click();};
 await prever.getByLabel('Saída prevista, uma linha por saída').fill('1\n2');await conferir('api-prever-transacao');await expect(prever.locator('.practice-feedback')).toContainText('sem Commit');await expect(prever.locator('[data-help] pre')).toHaveCount(0);
 await prever.getByLabel('Saída prevista, uma linha por saída').fill('0\n1');await conferir('api-prever-transacao');await expect(prever.locator('.practice-feedback')).toContainText('Sua resposta está correta');await expect(prever.locator('.practice-feedback')).toContainText('não houve execução de csharp');
 const parametrizar=pagina.locator('[data-practice="api-vincular-parametro"]');await parametrizar.locator('input[value="interpolar"]').check();await conferir('api-vincular-parametro');await expect(parametrizar.locator('.practice-feedback')).toContainText('muda a própria instrução');await expect(parametrizar.locator('[data-help] pre')).toHaveCount(0);
 await parametrizar.locator('input[value="vincular"]').check();await conferir('api-vincular-parametro');await expect(parametrizar.locator('.practice-feedback')).toContainText('Sua resposta está correta');await expect(parametrizar.locator('.practice-feedback')).toContainText('não houve execução de csharp');
 await parametrizar.getByRole('button',{name:'Consultar solução',exact:true}).click();await pagina.reload();await expect(pagina.locator('#aula-projeto')).toBeVisible();
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers['api-vincular-parametro']).toMatchObject({passed:true,assisted:true,attempts:2});expect(salvo.adaptive.skills['csharp.projetos.parametros'].review.lastOutcome).toBe('assisted');expect(remotas).toEqual([]);
});
