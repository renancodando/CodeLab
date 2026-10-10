import {test,expect,type Page} from '@playwright/test';

async function exportarTexto(pagina:Page) {
 const pendente=pagina.waitForEvent('download');
 await pagina.getByRole('button',{name:'Exportar',exact:true}).click();
 const arquivo=await pendente,fluxo=await arquivo.createReadStream(),partes:Buffer[]=[];
 for await(const parte of fluxo!)partes.push(Buffer.from(parte));
 return {nome:arquivo.suggestedFilename(),texto:Buffer.concat(partes).toString()};
}
async function escrever(pagina:Page,codigo:string) {
 const campo=pagina.getByRole('textbox',{name:'É aqui que você escreve seu código'});
 await campo.focus();await pagina.keyboard.press('Control+a');
 await campo.evaluate((elemento,texto)=>{const transferencia=new DataTransfer();transferencia.setData('text/plain',texto);elemento.dispatchEvent(new ClipboardEvent('paste',{clipboardData:transferencia,bubbles:true,cancelable:true}));},codigo);
}

for(const anotacao of ['Minhas decisões','']){
test('trocas consecutivas de linguagem conservam os rascunhos '+(anotacao?'com anotações':'com anotações vazias'),async({page:pagina})=>{
 const rascunhos={'lab-html':'<p>Meu HTML</p>','lab-js':'console.log("Meu JavaScript");','lab-text':anotacao,'lab-python':'print("Meu Python")'};
 await pagina.addInitScript(drafts=>{
  if(!localStorage.getItem('codelab.progress.v2'))localStorage.setItem('codelab.progress.v2',JSON.stringify({version:2,drafts}));
 },rascunhos);
 const enviadas:string[]=[];
 pagina.on('request',pedido=>{if(/\/api\/executions/.test(pedido.url()))enviadas.push(pedido.url());});
 await pagina.goto('/#/laboratorio');await expect(pagina.locator('#lab-run')).toBeEnabled();
 await pagina.locator('#lab-language').selectOption('javascript');
 await expect(pagina.locator('#lab-note')).toContainText('JavaScript em worker');
 expect((await exportarTexto(pagina)).texto).toBe(rascunhos['lab-js']);
 await pagina.locator('#lab-language').evaluate(seletor=>{
  for(const linguagem of ['text','python']){
   (seletor as HTMLSelectElement).value=linguagem;
   seletor.dispatchEvent(new Event('change',{bubbles:true}));
  }
 });
 await expect(pagina.locator('#lab-note')).toContainText('Executar envia');
 expect(await exportarTexto(pagina)).toEqual({nome:'projeto.py',texto:rascunhos['lab-python']});
 await expect.poll(()=>pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).drafts['lab-text'])).toBe(rascunhos['lab-text']);
 await pagina.goto('/#/home');await pagina.goto('/#/laboratorio');await pagina.reload();
 await expect(pagina.locator('#lab-run')).toBeEnabled();
 for(const [linguagem,chave] of [['html','lab-html'],['javascript','lab-js'],['text','lab-text'],['python','lab-python']]){
  await pagina.locator('#lab-language').selectOption(linguagem);
  expect((await exportarTexto(pagina)).texto).toBe(rascunhos[chave as keyof typeof rascunhos]);
 }
 expect(enviadas).toEqual([]);
});
}

test('laboratório restaura cada rascunho e conserva HTML e JavaScript vazios',async({page})=>{
 const rascunhos={'lab-html':'','lab-js':'','lab-python':'print("rascunho")','lab-csharp':'System.Console.WriteLine(7);','lab-cpp':'int main(){return 0;}','lab-sql':'SELECT 7;','lab-text':'Decisão anotada'};
 await page.addInitScript(drafts=>localStorage.setItem('codelab.progress.v2',JSON.stringify({version:2,drafts})),rascunhos);
 await page.goto('/#/laboratorio');await expect(page.locator('#lab-run')).toBeEnabled();
 expect((await exportarTexto(page)).texto).toBe('');
 for(const [linguagem,chave,nota] of [
  ['javascript','lab-js','JavaScript em worker'],['python','lab-python','Executar envia'],
  ['csharp','lab-csharp','Executar envia'],['cpp','lab-cpp','Executar envia'],
  ['sql','lab-sql','SQL pode ser escrito'],['text','lab-text','Anotações e roteiros']
 ]) {
  await page.locator('#lab-language').selectOption(linguagem);
  await expect(page.locator('#lab-note')).toContainText(nota);
  expect((await exportarTexto(page)).texto).toBe(rascunhos[chave as keyof typeof rascunhos]);
 }
});

test('laboratório retoma edição Python depois de sair e recarregar sem executar',async({page})=>{
 const enviadas:string[]=[];
 page.on('request',requisicao=>{if(/\/api\/executions/.test(requisicao.url()))enviadas.push(requisicao.url());});
 await page.goto('/#/laboratorio');await expect(page.locator('#lab-run')).toBeEnabled();
 await page.locator('#lab-language').selectOption('python');
 await expect(page.locator('#lab-note')).toContainText('Executar envia');
 const codigo='print("minha investigação")';
 await escrever(page,codigo);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!).drafts['lab-python'])).toBe(codigo);
 await page.goto('/#/home');await page.goto('/#/laboratorio');await page.reload();
 await expect(page.locator('#lab-run')).toBeEnabled();await page.locator('#lab-language').selectOption('python');
 await expect(page.locator('#lab-note')).toContainText('Executar envia');
 expect((await exportarTexto(page)).texto).toBe(codigo);
 expect(enviadas).toEqual([]);
});

test('projeto de anotações sobrevive ao reload e à exportação e importação da jornada',async({page})=>{
 await page.goto('/#/laboratorio');await expect(page.locator('#lab-run')).toBeEnabled();
 await page.locator('#lab-language').selectOption('text');
 await expect(page.locator('#lab-note')).toContainText('Anotações e roteiros');
 await escrever(page,'Minha hipótese e um caso de borda');
 await page.getByRole('button',{name:'Salvar projeto',exact:true}).click();
 await expect(page).toHaveURL(/#\/laboratorio\/[a-z0-9-]+$/);
 await page.reload();await expect(page.locator('#lab-run')).toBeEnabled();
 await expect(page.locator('#lab-language')).toHaveValue('text');
 expect(await exportarTexto(page)).toEqual({nome:'projeto.txt',texto:'Minha hipótese e um caso de borda'});
 await page.goto('/#/perfil');
 const pendente=page.waitForEvent('download');await page.locator('#export-progress').click();
 const arquivo=await pendente,fluxo=await arquivo.createReadStream(),partes:Buffer[]=[];
 for await(const parte of fluxo!)partes.push(Buffer.from(parte));
 const buffer=Buffer.concat(partes),jornada=JSON.parse(buffer.toString());
 expect(jornada.projects[0].language).toBe('text');
 await page.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer});
 await page.getByRole('button',{name:'Restaurar jornada',exact:true}).click();
 await page.goto('/#/laboratorio/'+jornada.projects[0].id);
 await expect(page.locator('#lab-language')).toHaveValue('text');
 expect((await exportarTexto(page)).texto).toBe('Minha hipótese e um caso de borda');
});
