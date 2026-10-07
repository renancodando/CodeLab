import {test,expect} from '@playwright/test';
import html from '../../src/content/deep/html';
import css from '../../src/content/deep/css';

const dialogo=html.lessons.find(l=>l.id==='html-dialogo-foco')!;
const grade=css.lessons.find(l=>l.id==='css-grid-trilhas')!;

test('HTML: modalidade, Escape, resultado e retorno do foco',async({page})=>{
 await page.setContent(dialogo.code);
 const d=page.locator('#confirmacao'),abrir=page.getByRole('button',{name:'Abrir confirmação',exact:true});
 await abrir.click();
 await expect(page.getByRole('dialog',{name:'Confirmar a escolha',exact:true})).toBeVisible();
 expect(await d.evaluate(e=>e.matches(':modal'))).toBe(true);
 await expect(page.getByRole('button',{name:'Cancelar',exact:true})).toBeFocused();
 await page.locator('#fora').evaluate((e:HTMLButtonElement)=>e.focus());
 await expect(page.getByRole('button',{name:'Cancelar',exact:true})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(d).not.toBeVisible();
 await expect(page.locator('#resultado')).toHaveText('cancelado');
 await expect(abrir).toBeFocused();
 await abrir.click();await page.getByRole('button',{name:'Confirmar',exact:true}).click();
 await expect(page.locator('#resultado')).toHaveText('confirmar');
 await expect(abrir).toBeFocused();
 await abrir.click();await page.keyboard.press('Escape');
 await expect(page.locator('#resultado')).toHaveText('cancelado');
});

for(const item of [
 {name:'exercício',code:dialogo.solution,dialog:'#editor',input:'#nome',output:'#resultado',open:'Editar nome'},
 {name:'problema independente',code:dialogo.practices[0].solution,dialog:'#d',input:'#n',output:'#r',open:'Começar edição'}
]){
 test('HTML: '+item.name+' conserva validação e saída com campo vazio',async({page})=>{
  await page.setContent(item.code);
  const abrir=page.getByRole('button',{name:item.open,exact:true});
  await abrir.click();await expect(page.locator(item.input)).toBeFocused();
  await page.getByRole('button',{name:'Guardar',exact:true}).click();
  await expect(page.locator(item.dialog)).toBeVisible();
  expect(await page.locator(item.input).evaluate((e:HTMLInputElement)=>e.validity.valueMissing)).toBe(true);
  await page.getByRole('button',{name:'Cancelar',exact:true}).click();
  await expect(page.locator(item.dialog)).not.toBeVisible();await expect(abrir).toBeFocused();
  await expect(page.locator(item.output)).toHaveText('cancelado');
  await abrir.click();await page.locator(item.input).fill('<b>Lia</b>');
  await page.getByRole('button',{name:'Guardar',exact:true}).click();
  await expect(page.locator(item.output)).toHaveText('guardado: <b>Lia</b>');
  await expect(page.locator(item.output+' b')).toHaveCount(0);
  await expect(abrir).toBeFocused();
 });
}

test('HTML: rascunho bloqueia Escape e conserva descarte explícito',async({page})=>{
 await page.setContent(dialogo.practices[1].solution);
 const abrir=page.getByRole('button',{name:'Escrever rascunho',exact:true}),d=page.locator('#d');
 await abrir.click();await page.keyboard.press('Escape');
 await expect(d).not.toBeVisible();await expect(page.locator('#r')).toHaveText('cancelado');
 await abrir.click();await page.getByLabel('Texto',{exact:true}).fill('Meu rascunho');
 await page.keyboard.press('Escape');await expect(d).toBeVisible();
 await expect(page.locator('#aviso')).toHaveText('Há mudanças. Escolha Guardar ou Descartar.');
 await page.locator('#externo').evaluate((e:HTMLButtonElement)=>e.focus());
 expect(await d.evaluate(e=>e.contains(document.activeElement))).toBe(true);
 await page.getByRole('button',{name:'Descartar',exact:true}).click();
 await expect(d).not.toBeVisible();await expect(page.locator('#r')).toHaveText('descartar');
 await expect(abrir).toBeFocused();
 await abrir.click();await expect(page.locator('#texto')).toHaveValue('');
 await expect(page.locator('#aviso')).toHaveText('');
});

test('CSS: auto-fill e auto-fit conferem sobra e trilha vazia',async({page})=>{
 for(const sample of [
  {code:grade.code,fill:'#preencher',fit:'#ajustar'},
  {code:grade.practices[0].solution,fill:'#fill',fit:'#fit'}
 ]){
  await page.setContent(sample.code);
  for(const [selector,expected] of [[sample.fill,192],[sample.fit,294]] as const){
   expect(await page.locator(selector+' > *').first().evaluate(e=>e.getBoundingClientRect().width)).toBeCloseTo(expected,1);
  }
  await page.locator(sample.fill+','+sample.fit).evaluateAll(es=>es.forEach(e=>(e as HTMLElement).style.width='360px'));
  for(const selector of [sample.fill,sample.fit]){
   const boxes=await page.locator(selector+' > *').evaluateAll(es=>es.map(e=>{
    const r=e.getBoundingClientRect();return {width:r.width,top:r.top};
   }));
   expect(boxes[0].width).toBeCloseTo(360,1);
   expect(boxes[1].width).toBeCloseTo(360,1);
   expect(boxes[1].top).toBeGreaterThan(boxes[0].top);
  }
 }
});

test('CSS: razão de trilhas e texto longo funcionam em contexto estreito',async({page})=>{
 await page.setViewportSize({width:800,height:600});await page.setContent(grade.solution);
 expect(await page.locator('#texto').evaluate(e=>e.getBoundingClientRect().width)).toBeCloseTo(196,1);
 expect(await page.locator('#painel').evaluate(e=>e.getBoundingClientRect().width)).toBeCloseTo(392,1);
 await page.setViewportSize({width:320,height:600});
 const boxes=await page.locator('#grade > article').evaluateAll(es=>es.map(e=>{
  const r=e.getBoundingClientRect();return {left:r.left,top:r.top,width:r.width};
 }));
 expect(boxes[1].left).toBeCloseTo(boxes[0].left,1);
 expect(boxes[1].top).toBeGreaterThan(boxes[0].top);
 expect(await page.locator('#grade').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 await expect(page.locator('#texto')).toHaveText('A'.repeat(80));
});

test('CSS: dense muda a posição sem mudar a ordem dos links e do foco',async({page})=>{
 await page.setContent(grade.practices[1].solution);
 expect(await page.locator('#g a').evaluateAll(es=>es.map(e=>e.id))).toEqual(['a','b','c']);
 const top=async(id:string)=>page.locator('#'+id).evaluate(e=>e.getBoundingClientRect().top);
 expect(await top('c')).toBeCloseTo(await top('a'),1);
 expect(await top('b')).toBeGreaterThan(await top('c'));
 await page.locator('#a').focus();await page.keyboard.press('Tab');await expect(page.locator('#b')).toBeFocused();
 await page.keyboard.press('Tab');await expect(page.locator('#c')).toBeFocused();
});
