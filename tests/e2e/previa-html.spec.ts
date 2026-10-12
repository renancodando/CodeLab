import {test,expect,type Page} from '@playwright/test';

async function escrever(pagina:Page,codigo:string){
 const editor=pagina.getByRole('textbox',{name:'É aqui que você escreve seu código'});await editor.focus();await pagina.keyboard.press('Control+a');
 await editor.evaluate((elemento,texto)=>{const dados=new DataTransfer();dados.setData('text/plain',texto);elemento.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dados,bubbles:true,cancelable:true}));},codigo);
}
async function prepararSinal(pagina:Page,sinal:string){
 await pagina.locator('#preview').evaluate((elemento,sinal)=>{const previa=elemento as HTMLIFrameElement;previa.dataset.sinalTeste='';const receber=(evento:MessageEvent)=>{if(evento.source===previa.contentWindow&&evento.data===sinal){previa.dataset.sinalTeste=sinal;window.removeEventListener('message',receber);}};window.addEventListener('message',receber);},sinal);
}
async function executarHtml(pagina:Page){
 await prepararSinal(pagina,'rodada-2');await pagina.locator('#lab-run').click();await expect(pagina.locator('#preview')).toHaveAttribute('data-sinal-teste','rodada-2');
}
test('prévia substitui documentos HTML e conserva limpeza ao parar e trocar linguagem',async({page:pagina})=>{
 test.setTimeout(120000);await pagina.goto('/#/laboratorio');await expect(pagina.frameLocator('#preview').getByRole('heading',{name:'Uma ideia começa aqui.'})).toBeVisible();
 await expect(pagina.locator('#preview')).toHaveAttribute('sandbox','allow-scripts');await expect(pagina.locator('#preview')).toHaveAttribute('referrerpolicy','no-referrer');
 for(const rodada of [1,2]){
  await escrever(pagina,`<h1>Rodada ${rodada}</h1><script>document.body.dataset.rodada='${rodada}';parent.postMessage('rodada-${rodada}','*');</script>`);
  await prepararSinal(pagina,'rodada-'+rodada);
  const redefinicoes=await pagina.locator('#preview').evaluate(async(elemento)=>{
   const nomes:string[]=[];const observar=new MutationObserver(registros=>nomes.push(...registros.map(registro=>registro.attributeName!)));
   observar.observe(elemento,{attributes:true,attributeFilter:['src']});document.querySelector<HTMLButtonElement>('#lab-run')!.click();
   await new Promise<void>(concluir=>setTimeout(concluir,0));observar.disconnect();return nomes;
  });
  await expect(pagina.locator('#preview')).toHaveAttribute('data-sinal-teste','rodada-'+rodada);
  expect(redefinicoes,'trocar HTML não precisa navegar primeiro para about:blank').toEqual([]);
  await expect(pagina.frameLocator('#preview').getByRole('heading',{name:`Rodada ${rodada}`})).toBeVisible();
  await expect(pagina.frameLocator('#preview').locator('body')).toHaveAttribute('data-rodada',String(rodada));
 }
 await pagina.locator('#lab-stop').click();await expect(pagina.locator('#lab-console')).toContainText('Execução encerrada');await expect(pagina.locator('#preview')).not.toHaveAttribute('srcdoc');await expect(pagina.locator('#preview')).toHaveAttribute('src','about:blank');
 await executarHtml(pagina);await expect(pagina.frameLocator('#preview').getByRole('heading',{name:'Rodada 2'})).toBeVisible();
 await pagina.locator('#lab-language').selectOption('javascript');await expect(pagina.locator('#preview')).not.toHaveAttribute('srcdoc');await expect(pagina.locator('#preview')).toBeHidden();
 await escrever(pagina,'console.log("troca preservada");');await pagina.locator('#lab-run').click();await expect(pagina.locator('#lab-console')).toHaveText('troca preservada');
 await pagina.locator('#lab-language').selectOption('html');await expect(pagina.locator('.monaco-editor')).toContainText('Rodada 2');await executarHtml(pagina);await expect(pagina.frameLocator('#preview').getByRole('heading',{name:'Rodada 2'})).toBeVisible();
 await pagina.goto('/#/home');await expect(pagina.locator('#preview')).toHaveCount(0);await expect(pagina.locator('.monaco-editor')).toHaveCount(0);expect(pagina.workers().filter(trabalhador=>trabalhador.url().includes('runner.worker'))).toHaveLength(0);
});
test('HTML acima do limite interrompe a prévia anterior antes de mostrar o aviso',async({page:pagina})=>{
 await pagina.goto('/#/laboratorio');await expect(pagina.frameLocator('#preview').getByRole('heading',{name:'Uma ideia começa aqui.'})).toBeVisible();await escrever(pagina,'a'.repeat(30001));await pagina.locator('#lab-run').click();
 await expect(pagina.locator('#lab-console')).toContainText('Limite de 30.000 caracteres');await expect(pagina.locator('#preview')).not.toHaveAttribute('srcdoc');await expect(pagina.locator('#preview')).toHaveAttribute('src','about:blank');await expect(pagina.locator('#preview')).toBeHidden();
});