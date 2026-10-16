import {test,expect,type Page,type Locator} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const codigo=(id:string)=>practiceActivities.find(item=>item.id===id)!.code!;
async function documento(pagina:Page,conteudo:string){
 await pagina.route('**/referencia-layout.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de layout</title></head><body><main><h1>Referência de layout</h1>'+conteudo+'</main></body></html>'}));
 await pagina.goto('/referencia-layout.html');
}
async function conferir(pausa:Locator){
 await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();
}

test('Flexbox nativo: trocar o eixo muda as coordenadas e o selo acompanha o cartão',async({page:pagina})=>{
 await documento(pagina,codigo('css-prever-eixos'));
 const posicoes=()=>pagina.locator('.item').evaluateAll(itens=>itens.map(item=>{
  const caixa=item.getBoundingClientRect(),painel=item.parentElement!.getBoundingClientRect();
  return[caixa.left-painel.left,caixa.top-painel.top].join(' ');
 }).join('\n'));
 expect(await posicoes()).toBe(getPracticeSolution('css-prever-eixos'));
 await pagina.locator('.painel').evaluate(item=>(item as HTMLElement).style.flexDirection='row');
 expect(await posicoes()).toBe('30 80\n50 80');
 await pagina.locator('.painel').evaluate(item=>Object.assign((item as HTMLElement).style,{flexDirection:'column',width:'140px',height:'160px'}));
 expect(await posicoes()).toBe('120 60\n120 80');
 const distancia=()=>pagina.locator('.cartao').evaluate(item=>item.getBoundingClientRect().right-item.querySelector('.selo')!.getBoundingClientRect().right);
 const defeito=codigo('css-diagnosticar-selo');
 await documento(pagina,defeito);expect(await distancia()).toBe(-200);
 await documento(pagina,defeito.replace('right:0','right:200px'));expect(await distancia()).toBe(0);
 await pagina.locator('.pagina').evaluate(item=>(item as HTMLElement).style.width='380px');expect(await distancia()).toBe(-80);
 await documento(pagina,getPracticeSolution('css-diagnosticar-selo')!);
 for(const [largura,margem] of [[300,0],[380,40],[240,20]]){
  await pagina.locator('.pagina').evaluate((item,valor)=>(item as HTMLElement).style.width=valor+'px',largura);
  await pagina.locator('.cartao').evaluate((item,valor)=>(item as HTMLElement).style.marginLeft=valor+'px',margem);
  expect(await distancia()).toBe(0);
  expect(await pagina.locator('.cartao').evaluate(item=>item.getBoundingClientRect().height)).toBe(80);
 }
 await documento(pagina,defeito.replace('position:absolute','position:fixed'));
 expect(await distancia()).not.toBe(0);
});

test('Flexbox nativo: a fronteira de quebra conserva tamanho, conteúdo e ordem do teclado',async({page:pagina})=>{
 const molde=codigo('css-flex-quebrar');
 await documento(pagina,molde.replace('____','nowrap'));
 expect(await pagina.locator('.barra').evaluate(item=>item.scrollWidth-item.clientWidth)).toBe(32);
 await documento(pagina,molde.replace('____','wrap-reverse'));
 expect(await pagina.locator('.acao').evaluateAll(itens=>itens[0].getBoundingClientRect().top>itens[1].getBoundingClientRect().top)).toBe(true);
 await documento(pagina,molde.replace('____',getPracticeSolution('css-flex-quebrar')!));
 for(const largura of [120,220,251,252,300]){
  await pagina.locator('.barra').evaluate((item,valor)=>(item as HTMLElement).style.width=valor+'px',largura);
  const caixas=await pagina.locator('.acao').evaluateAll(itens=>itens.map(item=>{const caixa=item.getBoundingClientRect();return{largura:caixa.width,topo:caixa.top,texto:item.textContent};}));
  expect(caixas.map(item=>item.largura)).toEqual([120,120]);
  expect(caixas.map(item=>item.texto)).toEqual(['Salvar','Testar']);
  expect(caixas[1].topo>caixas[0].topo).toBe(largura<252);
  expect(await pagina.locator('.barra').evaluate(item=>item.scrollWidth-item.clientWidth)).toBe(0);
 }
 await pagina.locator('.barra').evaluate(item=>(item as HTMLElement).style.width='220px');
 await pagina.keyboard.press('Tab');await expect(pagina.getByRole('button',{name:'Salvar',exact:true})).toBeFocused();
 await pagina.keyboard.press('Tab');await expect(pagina.getByRole('button',{name:'Testar',exact:true})).toBeFocused();
});

test('Grid nativo: conteúdo ocupa trilhas e cada instância consulta seu ancestral',async({page:pagina})=>{
 const larguras=()=>pagina.locator('.projeto').evaluateAll(itens=>itens.map(item=>getComputedStyle(item).width));
 await documento(pagina,codigo('css-grid-prever-vazias'));
 expect((await larguras()).join('\n')).toBe(getPracticeSolution('css-grid-prever-vazias'));
 await documento(pagina,codigo('css-grid-prever-vazias').replace('auto-fit','auto-fill'));
 expect(await larguras()).toEqual(['110px','110px']);
 await documento(pagina,codigo('css-grid-prever-vazias'));
 for(const [quantidade,esperadas] of [[0,[]],[1,['350px']],[2,['170px','170px']],[3,['110px','110px','110px']]] as const){
  await pagina.locator('.grade').evaluate((grade,total)=>{grade.replaceChildren();for(let indice=0;indice<total;indice++){const item=document.createElement('article');item.className='projeto';item.textContent=String(indice);grade.append(item);}},quantidade);
  expect(await larguras()).toEqual(esperadas);
  if(quantidade===0)expect(await pagina.locator('.grade').evaluate(item=>item.getBoundingClientRect().height)).toBe(0);
 }
 await documento(pagina,codigo('css-grid-prever-vazias'));
 for(const [largura,esperadas] of [[220,['105px','105px']],[190,['190px','190px']]] as const){
  await pagina.locator('.grade').evaluate((item,valor)=>(item as HTMLElement).style.width=valor+'px',largura);
  expect(await larguras()).toEqual(esperadas);
 }
 await pagina.setViewportSize({width:960,height:812});
 const colunas=()=>pagina.locator('.cartao').evaluateAll(itens=>itens.map(item=>getComputedStyle(item).gridTemplateColumns));
 const instancias=async()=>pagina.locator('.espaco').evaluate(item=>{(item as HTMLElement).style.width='220px';const outro=item.cloneNode(true) as HTMLElement;outro.style.width='400px';item.parentElement!.append(outro);});
 const defeito=codigo('css-grid-diagnosticar-conteiner');
 await documento(pagina,defeito);await instancias();expect(await colunas()).toEqual(['220px','400px']);
 await documento(pagina,defeito.replace('@container','@media'));await instancias();expect(await colunas()).toEqual(['110px 110px','200px 200px']);
 await documento(pagina,defeito.replace('display:grid; container-type','display:grid; min-width:300px; container-type'));await instancias();
 expect(await colunas()).toEqual(['300px','400px']);
 expect(await pagina.locator('.espaco').first().evaluate(item=>item.scrollWidth-item.clientWidth)).toBe(80);
 await documento(pagina,getPracticeSolution('css-grid-diagnosticar-conteiner')!);await instancias();
 expect(await colunas()).toEqual(['220px','200px 200px']);
 await pagina.setViewportSize({width:1200,height:812});expect(await colunas()).toEqual(['220px','200px 200px']);
 await pagina.locator('.espaco').first().evaluate(item=>(item as HTMLElement).style.width='300px');
 expect(await colunas()).toEqual(['150px 150px','200px 200px']);
});

const casos=[
 {aula:'flex-position',quantidade:3,previsao:'css-prever-eixos',errada:'30 80\n50 80',certa:'80 30\n80 50',falha:'Com column',diagnostico:'css-diagnosticar-selo',opcaoErrada:'distancia',opcaoCerta:'cartao',falhaEscolha:'ancestral posicionado',habilidade:'css.posicionamento.referencia',projeto:'barra de ferramentas'},
 {aula:'grid-responsivo',quantidade:2,previsao:'css-grid-prever-vazias',errada:'110px\n110px',certa:'170px\n170px',falha:'terceira trilha',diagnostico:'css-grid-diagnosticar-conteiner',opcaoErrada:'viewport',opcaoCerta:'ancestral',falhaEscolha:'ancestral elegível',habilidade:'css.responsividade.conteineres',projeto:'área de projetos'}
];
for(const caso of casos)test('Layout praticado: '+caso.aula+' preserva projeto, assistência e revisão',async({page:pagina})=>{
 await pagina.goto('/#/aula/'+caso.aula);
 await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);
 await expect(pagina.locator('[data-inline-practice]')).toHaveCount(caso.quantidade);
 expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
 const previsao=pagina.locator('[data-practice="'+caso.previsao+'"]');
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill(caso.errada);await conferir(previsao);
 await expect(previsao.locator('.practice-feedback')).toContainText(caso.falha);
 await expect(previsao.locator('[data-help] pre')).toHaveCount(0);
 await previsao.getByLabel('Saída prevista, uma linha por saída').fill(caso.certa);await conferir(previsao);
 await expect(previsao.locator('.practice-feedback')).toContainText('decisão conceitual');
 const diagnostico=pagina.locator('[data-practice="'+caso.diagnostico+'"]');
 await diagnostico.locator('input[value="'+caso.opcaoErrada+'"]').check();await conferir(diagnostico);
 await expect(diagnostico.locator('.practice-feedback')).toContainText(caso.falhaEscolha);
 await diagnostico.locator('input[value="'+caso.opcaoCerta+'"]').check();await conferir(diagnostico);
 await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 if(caso.aula==='flex-position'){
  const quebra=pagina.locator('[data-practice="css-flex-quebrar"]');
  await quebra.getByLabel('Trecho que falta').fill('wrap-reverse');await conferir(quebra);
  await expect(quebra.locator('.practice-feedback')).toContainText('inverte');
  await quebra.getByLabel('Trecho que falta').fill('WRAP');await conferir(quebra);
  await expect(quebra.locator('.practice-feedback')).toContainText('Sua resposta está correta');
 }
 const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(salvo.adaptive.skills[caso.habilidade].evidence[caso.diagnostico].firstTry).toBe(false);
 await diagnostico.getByRole('button',{name:'Consultar solução',exact:true}).click();
 await expect(diagnostico.locator('.practice-feedback')).toContainText('assistência');
 await pagina.reload();
 const retomado=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
 expect(retomado.practiceAnswers[caso.diagnostico].assisted).toBe(true);
 expect(retomado.adaptive.skills[caso.habilidade].review.lastOutcome).toBe('assisted');
 await expect(pagina.locator('#aula-projeto')).toContainText(caso.projeto);
 expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
 for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
});

test('Layouts offline conservam previsão e alteração sem executar folhas CSS livres',async({page:pagina,context:contexto})=>{
 await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});
 await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await contexto.setOffline(true);
 try{
  await pagina.goto('/#/aula/flex-position');
  const quebra=pagina.locator('[data-practice="css-flex-quebrar"]');
  await quebra.getByLabel('Trecho que falta').fill('WrAp');await conferir(quebra);await expect(quebra.locator('.practice-feedback')).toContainText('não houve execução de css');
  await pagina.goto('/#/aula/grid-responsivo');
  const prever=pagina.locator('[data-practice="css-grid-prever-vazias"]');
  await prever.getByLabel('Saída prevista, uma linha por saída').fill('170px\n170px');await conferir(prever);await expect(prever.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await pagina.reload();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));
  expect(salvo.practiceAnswers['css-flex-quebrar']).toMatchObject({passed:true,assisted:false,value:'WrAp'});
  expect(salvo.practiceAnswers['css-grid-prever-vazias']).toMatchObject({passed:true,assisted:false});
 }finally{if(!pagina.isClosed())await contexto.setOffline(false);}
});
