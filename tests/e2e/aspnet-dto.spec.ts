import {test,expect} from '@playwright/test';

test('DTO pratica limites, curto-circuito e validação antes da criação',async({page:pagina})=>{
 await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/aspnet-dto');
 await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
 const previsao=pagina.locator('[data-practice="aspnet-dto-prever-limites"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill('400\n400\n201\n400');
 await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 const guarda=pagina.locator('[data-practice="aspnet-dto-diagnosticar-guarda"]');
 await guarda.locator('input[value="ou-bit"]').check();await guarda.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(guarda.locator('.practice-feedback')).toContainText('null');await expect(guarda.locator('[data-help] pre')).toHaveCount(0);
 await guarda.locator('input[value="ou"]').check();await guarda.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
 await expect(guarda.locator('.practice-feedback')).toContainText('não houve execução');
 const montagem=pagina.locator('[data-practice="aspnet-dto-montar-criacao"]');
 await montagem.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(montagem.locator('.practice-feedback')).toContainText('null');
 for(const linha of [3,4]){const botao=montagem.getByRole('button',{name:'Mover linha '+linha+' para cima',exact:true});await botao.focus();await botao.press('Space');}
 await montagem.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(montagem.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 await expect(pagina.locator('.lesson-chapter').filter({has:pagina.getByRole('heading',{name:'Aplicação real pequena',exact:true})})).toContainText('Revisão manual');
});
