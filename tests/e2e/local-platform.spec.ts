import {test,expect,type Page} from '@playwright/test';
import {courses} from '../../src/content/curriculum';
async function writeCode(page:Page,code:string){const input=page.getByRole('textbox',{name:'É aqui que você escreve seu código'});await input.focus();await page.keyboard.press('Control+a');await page.getByRole('textbox',{name:'É aqui que você escreve seu código'}).evaluate((element,text)=>{const transfer=new DataTransfer();transfer.setData('text/plain',text);element.dispatchEvent(new ClipboardEvent('paste',{clipboardData:transfer,bubbles:true,cancelable:true}));},code);}
test('Catálogo de aulas acessíveis, resposta correta persiste e resposta errada não conclui',async({page})=>{
 await page.goto('/#/aprender');await expect(page.locator('.trail-grid .trail')).toHaveCount(courses.length);
 await page.getByRole('link',{name:/Começando.*Do primeiro/}).click();await expect(page.locator('.mission-list .mission-row')).toHaveCount(5);
 await page.getByRole('link',{name:/Programas, código e instruções/}).click();
 await expect(page.locator('.lesson-chapter')).toHaveCount(12);await expect(page.locator('.lesson-map a')).toHaveCount(12);await expect(page.getByRole('heading',{name:'Onde esta aula entra na jornada'})).toBeVisible();
 await page.getByLabel('Um algoritmo só existe dentro de um computador.').check();await page.getByRole('button',{name:'Conferir resposta'}).click();await expect(page.locator('#lesson-feedback')).toContainText('Ainda não');
 await page.getByLabel('O algoritmo descreve passos; o código os expressa em uma linguagem.').check();await page.getByRole('button',{name:'Conferir resposta'}).click();await expect(page.locator('#lesson-feedback')).toContainText('aula foi concluída');
 await page.reload();await expect(page.locator('#lesson-feedback')).toContainText('já concluída');
 await page.goto('/#/perfil');await expect(page.getByText('aulas concluídas')).toBeVisible();await expect(page.locator('input[type=password]')).toHaveCount(0);
});
test('projetos separados persistem, podem ser renomeados, exportados e removidos',async({page})=>{
 await page.goto('/#/projetos');await page.locator('[data-project=diario]').click();await expect(page.locator('.monaco-editor')).toBeVisible();const first=page.url();await writeCode(page,'<h1>Meu diário separado</h1>');await page.getByRole('button',{name:'Salvar projeto'}).click();
 await page.goto('/#/projetos');await page.locator('[data-project=tarefas]').click();await expect(page.locator('.monaco-editor')).toBeVisible();expect(page.url()).not.toBe(first);await writeCode(page,'<h1>Minhas tarefas separadas</h1>');await page.getByRole('button',{name:'Salvar projeto'}).click();
 await page.goto(first);await expect(page.locator('.monaco-editor')).toContainText('Meu diário separado');await page.getByRole('button',{name:'Executar',exact:true}).click();await expect(page.frameLocator('#preview').getByRole('heading',{name:'Meu diário separado'})).toBeVisible();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar',exact:true}).click();expect((await download).suggestedFilename()).toBe('projeto.html');
 await page.goto('/#/projetos');await expect(page.locator('.saved-project')).toHaveCount(2);await page.locator('[data-rename]').first().click();await page.locator('#project-name').fill('Meu diário');await page.getByRole('button',{name:'Salvar nome',exact:true}).click();await expect(page.locator('.saved-project h3').first()).toHaveText('Meu diário');
 await page.locator('[data-delete]').first().click();await page.getByRole('button',{name:'Remover projeto',exact:true}).click();await expect(page.locator('.saved-project')).toHaveCount(1);
});
test('exportação e importação preservam jornada local',async({page})=>{
 await page.goto('/#/perfil');await page.locator('#profile-name').fill('Lia');await page.getByRole('button',{name:'Salvar nome',exact:true}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar jornada'}).click();expect((await download).suggestedFilename()).toBe('codelab-jornada.json');
 await page.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,name:'Bia',completed:['primeira-luz'],lessons:['programar'],projects:[]}))});await page.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await page.reload();await expect(page.getByRole('heading',{name:'Sua jornada, Bia.'})).toBeVisible();
});
test('cancelamento, limite de memória e recuperação do executor',async({page})=>{
 await page.goto('/#/missao/primeira-luz');await expect(page.locator('.monaco-editor')).toBeVisible();await writeCode(page,'while(true) {}');// Inicia e cancela no mesmo turno do navegador, antes de o limite do Worker competir com o clique.
 await page.locator('#run').evaluate(button=>{(button as HTMLButtonElement).click();if(!button.textContent?.includes('Cancelar'))throw new Error('O controle não entrou em execução.');(button as HTMLButtonElement).click();});await expect(page.locator('#result')).toContainText('cancelada');
 await writeCode(page,'const lista=[]; while(true) lista.push("x".repeat(10000));');await page.locator('#run').click();await expect(page.locator('#result')).toContainText(/memória|tempo limite|tempo demais/,{timeout:15000});
 await writeCode(page,'acender();');await page.locator('#run').click();await expect(page.locator('#result')).toContainText('Você fez o mundo responder.',{timeout:15000});
});
test('trocas de tela descartam editores visíveis e não acumulam workers ou geometria',async({page,context},testInfo)=>{
 test.setTimeout(120000);await page.goto('/#/missao/primeira-luz');await expect(page.locator('.monaco-editor')).toBeVisible();
 await page.waitForFunction(()=>{const world=document.querySelector('#world');return world?.classList.contains('no-webgl')||Number(world?.getAttribute('data-geometries'))>0;});const geometryCount=await page.locator('#world').getAttribute('data-geometries');
 const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('HeapProfiler.collectGarbage');const before=await cdp.send('Performance.getMetrics');
 for(let i=0;i<20;i++){await page.evaluate(()=>location.hash='/home');await expect(page.locator('.monaco-editor')).toHaveCount(0);await page.evaluate(i=>location.hash=i%2?'/laboratorio':'/missao/primeira-luz',i);await expect(page.locator('.monaco-editor')).toBeVisible();}
 await page.evaluate(()=>location.hash='/home');await expect(page.locator('.monaco-editor')).toHaveCount(0);expect(page.workers().filter(w=>w.url().includes('runner.worker'))).toHaveLength(0);await cdp.send('HeapProfiler.collectGarbage');const after=await cdp.send('Performance.getMetrics');const heap=(r:typeof before)=>r.metrics.find(m=>m.name==='JSHeapUsedSize')!.value;const growth=heap(after)-heap(before);await testInfo.attach('memory.json',{body:JSON.stringify({before:heap(before),after:heap(after),growth,editors:await page.locator('.monaco-editor').count(),graphics:await page.locator('#world').getAttribute('data-geometries')},null,2),contentType:'application/json'});console.log('MEMORY',JSON.stringify({before:heap(before),after:heap(after),growth,editors:await page.locator('.monaco-editor').count(),geometries:geometryCount}));expect(await page.locator('#world').getAttribute('data-geometries')).toBe(geometryCount);expect(growth).toBeLessThan(20*1024*1024);await cdp.detach();
});
test('geolocalização negada e som opt-in respeitam preferências',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(()=>{Object.defineProperty(navigator,'geolocation',{value:{getCurrentPosition:(_ok:unknown,fail:(e:unknown)=>void)=>fail({code:1})}});});await page.goto('/');await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','false');await page.getByRole('button',{name:'Configurar ambiente',exact:true}).click();await expect(page.locator('#flashes')).not.toBeChecked();await page.getByRole('button',{name:'Usar minha localização'}).click();await expect(page.locator('#weather-message')).toContainText('Sem acesso');await page.getByRole('button',{name:'Fechar',exact:true}).click();await page.locator('#sound').click();await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','true');await page.locator('#sound').click();await expect(page.locator('#sound')).toHaveAttribute('aria-pressed','false');
});

test('renderização 3D sem erros e progresso sem chamadas de conta',async({page})=>{const errors:string[]=[],accounts:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/THREE|WebGL|shader/i.test(m.text()))errors.push(m.text());});page.on('request',r=>{if(/\/api\/(auth|progress)/.test(r.url()))accounts.push(r.url());});await page.goto('/');await expect(page.locator('#world')).toHaveAttribute('data-geometries',/^\d+$/);await page.getByRole('link',{name:'Perfil',exact:true}).click();await page.locator('#profile-name').fill('Teste local');await page.getByRole('button',{name:'Salvar nome'}).click();expect(accounts).toEqual([]);expect(errors).toEqual([]);});

test('build de produção executa a missão com WebAssembly e CSP do servidor',async({page})=>{
 await page.goto('http://127.0.0.1:5080/#/missao/primeira-luz');await expect(page.getByRole('textbox',{name:'É aqui que você escreve seu código'})).toBeVisible({timeout:25000});await writeCode(page,'acender();');await page.locator('#run').click();await expect(page.locator('#result')).toContainText('Você fez o mundo responder.',{timeout:15000});
});

test('a comunidade foi removida da navegação',async({page})=>{await page.goto('/');await expect(page.getByRole('link',{name:'Comunidade'})).toHaveCount(0);await expect(page.locator('a[href="#/comunidade"]')).toHaveCount(0);});
