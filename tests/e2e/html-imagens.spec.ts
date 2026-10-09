import {test,expect} from '@playwright/test';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

test('HTML: referências reais conferem nome, tamanho CSS, fontes e fallback',async({page:pagina,baseURL})=>{
 const base='<base href="'+baseURL+'/">';
 const atividade=(id:string)=>practiceActivities.find(atividade=>atividade.id===id)!;
 await pagina.setContent(base+atividade('html-imagem-destino').code);
 await expect(pagina.getByRole('link')).toHaveAccessibleName('');
 await pagina.setContent(base+getPracticeSolution('html-imagem-destino'));
 const link=pagina.getByRole('link',{name:'Abrir relatório de estudo',exact:true});
 await expect(link).toBeVisible();await pagina.keyboard.press('Tab');await expect(link).toBeFocused();
 const codigoTamanho=atividade('html-completar-sizes').code!.replace('____',getPracticeSolution('html-completar-sizes')!);
 for(const largura of [220,600,601,4000]){
  await pagina.setViewportSize({width:largura,height:812});
  await pagina.setContent(base+codigoTamanho);
  await expect.poll(()=>pagina.locator('img').evaluate(imagem=>imagem.complete&&imagem.naturalWidth>0)).toBe(true);
  expect(await pagina.locator('img').evaluate(imagem=>imagem.getBoundingClientRect().width)).toBeCloseTo(largura<=600?largura:largura/2,1);
  await expect(pagina.locator('img')).toHaveAttribute('sizes','(max-width: 600px) 100vw, 50vw');
  const estilo='<style>body{margin:0}img{display:block;max-width:100%;height:auto}</style>';
  await pagina.setContent(base+estilo+getPracticeSolution('html-ordenar-picture'));
  await expect.poll(()=>pagina.locator('img').evaluate(imagem=>imagem.currentSrc)).toBe(baseURL+'/exemplos/imagens/'+(largura<=600?'fluxo-compacto.svg':'fluxo-amplo.svg'));
  await expect.poll(()=>pagina.locator('img').evaluate(imagem=>imagem.complete&&imagem.naturalWidth>0)).toBe(true);
  const dimensoes=await pagina.locator('img').evaluate(imagem=>({largura:imagem.getBoundingClientRect().width,altura:imagem.getBoundingClientRect().height}));
  expect(dimensoes.largura/dimensoes.altura).toBeCloseTo(largura<=600?2/3:3,2);
  expect(await pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
 }
 await pagina.setViewportSize({width:220,height:812});
 const fonteErrada=atividade('html-ordenar-picture').lines!;
 const inverter=['abrir','ampla','compacta','fallback','fechar'].map(id=>fonteErrada.find(linha=>linha.id===id)!.code).join('\n');
 await pagina.setContent(base+inverter);
 await expect.poll(()=>pagina.locator('img').evaluate(imagem=>imagem.currentSrc)).toBe(baseURL+'/exemplos/imagens/fluxo-amplo.svg');
 await pagina.setContent(base+getPracticeSolution('html-ordenar-picture'));
 await pagina.locator('source').evaluateAll(fontes=>fontes.forEach(fonte=>fonte.remove()));
 await expect.poll(()=>pagina.locator('img').evaluate(imagem=>imagem.currentSrc)).toBe(baseURL+'/exemplos/imagens/fluxo-amplo.svg');
 await expect(pagina.getByRole('img',{name:'Etapas: escrever, executar e revisar'})).toBeVisible();
});

test('HTML: mídia conserva respostas, assistência e arquivos reais offline',async({page:pagina,context:contexto})=>{
 const execucoes:string[]=[];
 pagina.on('request',requisicao=>{if(/\/api\/(executions|execute|run|submissions)/.test(requisicao.url()))execucoes.push(requisicao.url());});
 await pagina.goto('/');
 await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/html-midia');
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(13);
  const alternativa=pagina.locator('[data-practice="html-imagem-destino"]');
  await alternativa.locator('input[value="arquivo"]').check();
  await alternativa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(alternativa.locator('.practice-feedback')).toContainText('nome do link');
  await expect(alternativa.locator('[data-help] pre')).toHaveCount(0);
  await alternativa.locator('input[value="destino"]').check();
  await alternativa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(alternativa.locator('.practice-feedback')).toContainText('não houve execução de html');
  const tamanho=pagina.locator('[data-practice="html-completar-sizes"]');
  await tamanho.getByLabel('Trecho que falta').fill('50vw');
  await tamanho.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(tamanho.locator('.practice-feedback')).toContainText('sizes não cria o layout');
  await tamanho.getByLabel('Trecho que falta').fill('100vw');
  await tamanho.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(tamanho.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const fontes=pagina.locator('[data-practice="html-ordenar-picture"]');
  await fontes.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(fontes.locator('.practice-feedback')).toContainText('source aplicável');
  await fontes.getByRole('button',{name:'Mover linha 3 para cima',exact:true}).click();
  await fontes.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
  await expect(fontes.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await fontes.getByRole('button',{name:'Consultar solução',exact:true}).click();
  await expect(fontes.locator('.practice-feedback')).toContainText('registrada como assistência');
  const recursos=await pagina.evaluate(async()=>Promise.all(['fluxo-360.svg','fluxo-amplo.svg','fluxo-compacto.svg'].map(async arquivo=>{
   const resposta=await fetch('/exemplos/imagens/'+arquivo);
   return {ok:resposta.ok,tipo:resposta.headers.get('content-type'),codigo:await resposta.text()};
  })));
  for(const recurso of recursos){expect(recurso.ok).toBe(true);expect(recurso.tipo).toContain('image/svg+xml');expect(recurso.codigo).toContain('3. Revisar');}
  await pagina.reload({waitUntil:'domcontentloaded'});
  await expect(alternativa.locator('input[value="destino"]')).toBeChecked();
  await expect(tamanho.locator('input[name="answer"]')).toHaveValue('100vw');
  await expect(fontes.locator('.practice-order li').nth(1).locator('code')).toContainText('max-width: 600px');
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['html-ordenar-picture'].assisted).toBe(true);
  expect(salvo.practiceAnswers['html-ordenar-picture'].value).toEqual(['abrir','compacta','ampla','fallback','fechar']);
  expect(salvo.adaptive.skills['html.imagens.alternativas'].evidence['html-imagem-destino'].firstTry).toBe(false);
  for(const largura of [220,4000]){
   await pagina.setViewportSize({width:largura,height:812});
   await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
   await expect(alternativa).toBeVisible();await expect(tamanho).toBeVisible();await expect(fontes).toBeVisible();
  }
  expect(execucoes).toEqual([]);
 }finally{await contexto.setOffline(false);}
});
