import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function writeCode(page:Page,code:string){const editor=page.getByRole('textbox',{name:'É aqui que você escreve seu código'});await editor.focus();await page.keyboard.press('Control+a');await page.getByRole('textbox',{name:'É aqui que você escreve seu código'}).evaluate((element,text)=>{const transfer=new DataTransfer();transfer.setData('text/plain',text);element.dispatchEvent(new ClipboardEvent('paste',{clipboardData:transfer,bubbles:true,cancelable:true}));},code);}
test('primeira missão, pistas, execução e persistência',async({page})=>{
 await page.goto('/');await page.getByRole('link',{name:'Acender a primeira luz'}).click();
 const editor=page.getByRole('textbox',{name:'É aqui que você escreve seu código'});
 await expect(editor).toBeVisible({timeout:20000});await page.getByRole('button',{name:/Preciso de uma pista/}).click();
 await expect(page.getByText('O computador precisa receber uma ação.')).toBeVisible();
 await writeCode(page,'acender();');await page.getByRole('button',{name:/Executar/}).click();
 await expect(page.getByText('Você fez o mundo responder.')).toBeVisible({timeout:20000});
 await expect(page.locator('#effect')).toContainText('Uma ideia acaba de acender.');
 await page.reload();await expect(page.locator('.monaco-editor')).toContainText('acender');
 await page.getByRole('link',{name:'Início',exact:true}).click();await expect(page.getByText('1 de 8 missões')).toBeVisible();
});
test('erros e execução infinita não travam a interface',async({page})=>{
 await page.goto('/#/missao/energia');const editor=page.getByRole('textbox',{name:'É aqui que você escreve seu código'});await expect(editor).toBeVisible();
 await writeCode(page,'let energia = ;');await page.getByRole('button',{name:/Executar/}).click();await expect(page.getByText(/Há uma instrução incompleta/)).toBeVisible({timeout:20000});
 await writeCode(page,'while (true) {}');await page.getByRole('button',{name:/Executar/}).click();await expect(page.getByText(/O programa levou tempo demais/)).toBeVisible({timeout:15000});
 await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
});
test('busca encontra erro e abre conteúdo',async({page})=>{
 await page.goto('/');await page.keyboard.press('Control+k');await page.getByPlaceholder('Variáveis, loops, um erro…').fill('undefined');await page.getByRole('button',{name:/Cannot read properties/}).click();await expect(page.getByRole('heading',{name:'Cannot read properties of undefined'})).toBeVisible();
});
test('laboratório HTML renderiza sem acesso ao documento pai',async({page})=>{
 await page.goto('/#/laboratorio');await expect(page.frameLocator('#preview').getByRole('heading',{name:'Uma ideia começa aqui.'})).toBeVisible();
 await page.frameLocator('#preview').getByRole('button',{name:'Experimente'}).click();await expect(page.frameLocator('#preview').getByRole('button',{name:'Você fez acontecer!'})).toBeVisible();
 const erros:string[]=[];
 page.on('pageerror',error=>erros.push(error.message));
 page.on('console',message=>{if(message.type()==='error')erros.push(message.text());});
 await writeCode(page,'<script>try {parent.document.body.innerHTML="invadido"}catch(e){document.body.textContent="isolado"}</script>');
 await expect(page.locator('.monaco-editor .view-lines')).toContainText('parent.document.body.innerHTML');
 await page.getByRole('button',{name:'Executar',exact:true}).click();
 try{
  await expect(page.locator('#preview')).toHaveAttribute('srcdoc',/parent\.document\.body\.innerHTML/);
  await expect(page.frameLocator('#preview').locator('body')).toHaveText('isolado');
 }catch(error){
  console.log('HTML_PREVIEW_DIAGNOSTICO',JSON.stringify({srcdoc:await page.locator('#preview').getAttribute('srcdoc'),erros}));
  throw error;
 }
 await expect(page.getByRole('heading',{name:'Seu laboratório.'})).toBeVisible();
});
test('clima: dados normalizados, falha e geolocalização negada',async({page})=>{
 await page.route('https://api.open-meteo.com/**',route=>route.fulfill({json:{current:{temperature_2m:19,relative_humidity_2m:80,precipitation:2,weather_code:61,cloud_cover:90,wind_speed_10m:24,wind_direction_10m:210,wind_gusts_10m:39}}}));
 await page.goto('/');await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await page.getByRole('button',{name:'Sincronizar com esta cidade'}).click();await expect(page.locator('#weather-message')).toContainText('Ambiente sincronizado');await page.getByRole('button',{name:'Fechar',exact:true}).click();await expect(page.locator('#weather-status')).toContainText('Ambiente sincronizado');
 await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await page.route('https://api.open-meteo.com/**',r=>r.abort());await page.locator('#city').selectOption('Lisboa');await page.getByRole('button',{name:'Sincronizar com esta cidade'}).click();await expect(page.locator('#weather-message')).toContainText('Sem dados recentes');
});
test('larguras contínuas sem overflow da página',async({page})=>{
 await page.goto('/');for(const width of [280,320,375,430,600,760,900,1100,1440,1920,2560,3840]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(100);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`home ${width}`).toBe(true);}
 for(const route of ['aprender','missao/ponte','laboratorio','perfil','biblioteca','projetos','aula/programar','trilha/csharp']){await page.goto('/#/'+route);for(const width of [280,430,800,1440]){await page.setViewportSize({width,height:1000});await page.waitForTimeout(100);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} ${width}`).toBe(true);}}
});
test('acessibilidade da home e dos fluxos principais',async({page})=>{
 for(const route of ['home','aprender','perfil','biblioteca','missao/primeira-luz','aula/programar','laboratorio']){await page.goto('/#/'+route);await page.waitForTimeout(600);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);}
});
test('páginas públicas entregam conteúdo sem JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();await page.goto('http://127.0.0.1:5080/conceitos/variaveis/');await expect(page.getByRole('heading',{name:'O que é uma variável?'})).toBeVisible();await expect(page.locator('pre')).toContainText('let energia');await context.close();
});
