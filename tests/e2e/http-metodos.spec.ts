import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import {practiceActivities} from '../../src/content/practice';
import {getPracticeSolution} from '../../src/learning/practice';

const atividade=(id:string)=>practiceActivities.find(item=>item.id===id)!;
async function referencia(pagina:Page,codigo:string){
 await pagina.route('**/referencia-http-metodos.html',rota=>rota.fulfill({contentType:'text/html',body:'<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Referência de HTTP</title></head><body><main><h1>Referência controlada de HTTP</h1></main><script>'+codigo+'</script></body></html>'}));
 await pagina.goto('/referencia-http-metodos.html');
}
test('Fetch nativo separa 404 legível de transporte rejeitado',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 for(const caso of ['ausente','sucesso','rede'] as const){
  await pagina.route('**/referencia-http/notas/99',rota=>caso==='rede'?rota.abort('failed'):rota.fulfill({status:caso==='ausente'?404:200,contentType:'application/json',body:JSON.stringify(caso==='ausente'?{erro:'Ausente'}:{id:99,titulo:'Revisar'})}));
  saidas.length=0;await referencia(pagina,atividade('js-http-prever-resposta-ausente').code!);
  await expect.poll(()=>saidas.join('\n')).toBe(caso==='ausente'?getPracticeSolution('js-http-prever-resposta-ausente'):caso==='sucesso'?'200\ntrue':'falha de rede');
 }
});
test('o leitor nativo distingue ausência, JSON falsy e outros sucessos',async({page:pagina})=>{
 const item=atividade('js-http-corpo-sem-conteudo');
 for(const opcao of item.options!){
  await referencia(pagina,item.code!.replace('return resposta.json();',opcao.text));
  const resultados=await pagina.evaluate(async()=>{
   const ler=(window as typeof window&{lerCorpo:(resposta:Response)=>Promise<unknown>}).lerCorpo;
   const casos:[number,unknown][]=[[200,false],[200,0],[200,null],[200,[]],[201,{id:7}],[204,null],[400,{erro:'Inválida'}]];
   const saidas=[];
   for(const [status,dado] of casos){
    const resposta=new Response(status===204?null:JSON.stringify(dado),{status,headers:{'Content-Type':'application/json'}});
    let leituras=0;const decodificar=resposta.json.bind(resposta);resposta.json=()=>{leituras++;return decodificar();};
    try{saidas.push({status,valor:await ler(resposta),leituras});}catch(erro){saidas.push({status,erro:String(erro),leituras});}
   }
   return saidas;
  });
  expect(resultados.slice(0,4)).toEqual([{status:200,valor:false,leituras:1},{status:200,valor:0,leituras:1},{status:200,valor:null,leituras:1},{status:200,valor:[],leituras:1}]);
  expect(resultados[4]).toEqual(opcao.id==='somente-200'?{status:201,valor:null,leituras:0}:{status:201,valor:{id:7},leituras:1});
  expect(resultados[5]).toEqual({status:204,valor:opcao.id==='objeto-vazio'?{}:null,leituras:0});
  expect(resultados[6]).toEqual({status:400,erro:'Error: HTTP 400',leituras:0});
 }
 await referencia(pagina,item.code!);
 expect(await pagina.evaluate(async()=>{try{await(window as typeof window&{lerCorpo:(r:Response)=>Promise<unknown>}).lerCorpo(new Response(null,{status:204}));return 'sem erro';}catch(erro){return erro instanceof SyntaxError;}})).toBe(true);
});
test('o descritor de criação produz cabeçalhos e representação nativos coerentes',async({page:pagina})=>{
 await referencia(pagina,getPracticeSolution('js-http-resposta-criacao')!);
 for(const nota of [{id:1,titulo:'Primeira'},{id:7,titulo:'Título com "aspas"'},{id:9007199254740991,titulo:'<b>Texto literal</b>'}]){
  const resultado=await pagina.evaluate(async nota=>{
   const preparar=(window as typeof window&{respostaDeCriacao:(n:typeof nota)=>{status:number;cabecalhos:Record<string,string>;corpo:typeof nota}}).respostaDeCriacao;
   const descritor=preparar(nota),resposta=new Response(JSON.stringify(descritor.corpo),{status:descritor.status,headers:descritor.cabecalhos});
   return{status:resposta.status,ok:resposta.ok,localizacao:resposta.headers.get('location'),tipo:resposta.headers.get('content-type'),corpo:await resposta.json()};
  },nota);
  expect(resultado).toEqual({status:201,ok:true,localizacao:'/notas/'+nota.id,tipo:'application/json',corpo:nota});
 }
});
test('o modelo de exclusão mantém o recurso ausente em tentativas seguintes',async({page:pagina})=>{
 const saidas:string[]=[];pagina.on('console',mensagem=>{if(mensagem.type()==='log')saidas.push(mensagem.text());});
 await referencia(pagina,atividade('js-metodos-prever-exclusao').code!);expect(saidas.join('\n')).toBe(getPracticeSolution('js-metodos-prever-exclusao'));
 expect(await pagina.evaluate('excluir()')).toBe(404);expect(await pagina.evaluate('presente')).toBe(false);
});
test('requisições controladas diferenciam PATCH parcial, PUT incompleto e GET',async({page:pagina})=>{
 for(const opcao of atividade('js-metodos-alteracao-parcial').options!){
  let tarefa={id:12,titulo:'Revisar',concluida:true};
  await pagina.route('**/tarefas/12*',async rota=>{
   const pedido=rota.request(),metodo=pedido.method();
   if(metodo==='PUT'){await rota.fulfill({status:400,contentType:'application/json',body:JSON.stringify({erro:'Representação incompleta'})});return;}
   if(metodo==='PATCH'){const corpo=pedido.postDataJSON() as {concluida:boolean};tarefa={...tarefa,concluida:corpo.concluida};}
   await rota.fulfill({status:200,contentType:'application/json',body:JSON.stringify(tarefa)});
  });
  await referencia(pagina,'');
  const [inicio,corpo]=opcao.text.split('\n\n'),[linha,...campos]=inicio.split('\n'),[metodo,alvo]=linha.split(' '),cabecalhos=Object.fromEntries(campos.map(item=>{const posicao=item.indexOf(':');return[item.slice(0,posicao),item.slice(posicao+1).trim()];}));
  const resposta=await pagina.evaluate(async({metodo,alvo,cabecalhos,corpo})=>{const r=await fetch(alvo,{method:metodo,headers:cabecalhos,...(corpo?{body:corpo}:{})});return{status:r.status,corpo:await r.json()};},{metodo,alvo,cabecalhos,corpo});
  expect(resposta.status).toBe(opcao.id==='substituir'?400:200);expect(tarefa).toEqual({id:12,titulo:'Revisar',concluida:opcao.id!=='parcial'});
  if(opcao.id==='parcial')expect(resposta.corpo).toEqual(tarefa);
 }
});

const cenarios=[
 {aula:'http',previsao:'js-http-prever-resposta-ausente',prevista:'404\nfalse',equivocada:'falha de rede',diagnostico:'js-http-corpo-sem-conteudo',correta:'sem-corpo',errada:'somente-200',codigo:'js-http-resposta-criacao',campo:'Seu código',habilidade:'javascript.http.criacao',projeto:'criação/consulta',alternativa:'const respostaDeCriacao=nota=>({status:201,corpo:{titulo:nota.titulo,id:nota.id},cabecalhos:{location:"/notas/"+nota.id,"content-type":"APPLICATION/JSON; charset=utf-8"}});'},
 {aula:'metodos',previsao:'js-metodos-prever-exclusao',prevista:'204\n404\nfalse',equivocada:'204\n204\nfalse',diagnostico:'js-metodos-alteracao-parcial',correta:'parcial',errada:'substituir',codigo:'js-metodos-preservar-campos',campo:'Seu código corrigido',habilidade:'javascript.http.parcial',projeto:'CRUD de notas',alternativa:'function aplicarAlteracao(tarefa,alteracao){const proxima={...tarefa};for(const campo of ["titulo","concluida"])if(Object.hasOwn(alteracao,campo))proxima[campo]=alteracao[campo];return proxima;}'}
];
for(const cenario of cenarios){
 test(cenario.aula+' conserva capítulos, projeto, decisões e teclado',async({page:pagina})=>{
  await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/'+cenario.aula);
  await expect(pagina.locator('.lesson-chapter')).toHaveCount(12);await expect(pagina.locator('[data-inline-practice]')).toHaveCount(3);
  expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});
  const previsao=pagina.locator('[data-practice="'+cenario.previsao+'"]');
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill(cenario.equivocada);await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText(cenario.aula==='http'?'servidor respondeu com 404':'primeira chamada muda presente');await expect(previsao.locator('.practice-feedback')).not.toContainText('Sua resposta está correta');
  await previsao.getByLabel('Saída prevista, uma linha por saída').fill(cenario.prevista);await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const diagnostico=pagina.locator('[data-practice="'+cenario.diagnostico+'"]');
  await diagnostico.locator('input[value="'+cenario.errada+'"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText(cenario.aula==='http'?'204 não tem corpo':'alteração contém somente');await expect(diagnostico.locator('[data-help] pre')).toHaveCount(0);
  await diagnostico.locator('input[value="'+cenario.correta+'"]').focus();await pagina.keyboard.press('Space');await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  await expect(pagina.locator('#aula-projeto')).toContainText(cenario.projeto);
 });
 test(cenario.aula+' respondida conserva axe e largura de 220 a 4000 px',async({page:pagina})=>{
  await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/'+cenario.aula);
  const previsao=pagina.locator('[data-practice="'+cenario.previsao+'"]');await previsao.getByLabel('Saída prevista, uma linha por saída').fill(cenario.prevista);await previsao.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(previsao.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  const diagnostico=pagina.locator('[data-practice="'+cenario.diagnostico+'"]');await diagnostico.locator('input[value="'+cenario.correta+'"]').check();await diagnostico.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(diagnostico.locator('.practice-feedback')).toContainText('Sua resposta está correta');
  expect((await new AxeBuilder({page:pagina}).include('main').analyze()).violations).toEqual([]);
  for(const largura of [220,4000]){await pagina.setViewportSize({width:largura,height:812});await expect.poll(()=>pagina.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);}
 });
 test(cenario.aula+' executa a função e preserva assistência depois de recarregar',async({page:pagina})=>{
  await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/'+cenario.aula);const pausa=pagina.locator('[data-practice="'+cenario.codigo+'"]');
  await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText(cenario.aula==='http'?'três componentes':'false é uma atualização válida',{timeout:20000});await expect(pausa.locator('[data-help] pre')).toHaveCount(0);
  await pausa.getByLabel(cenario.campo,{exact:true}).fill(cenario.alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});
  await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');await pagina.reload();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[cenario.codigo]).toMatchObject({passed:true,assisted:true,value:cenario.alternativa});expect(salvo.adaptive.skills[cenario.habilidade].review.lastOutcome).toBe('assisted');
 });
 test(cenario.aula+' executa offline sem consultas remotas do aluno',async({page:pagina,context:contexto})=>{
  const remotas:string[]=[];pagina.on('request',r=>{if(/\/api\/(executions|execute|run|submissions)/.test(r.url()))remotas.push(r.url());});
  await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/');await expect(pagina.locator('#offline-status')).toHaveText('Conteúdo preparado para estudar offline.',{timeout:45000});await pagina.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
  await contexto.setOffline(true);
  try{await pagina.goto('/#/aula/'+cenario.aula);const pausa=pagina.locator('[data-practice="'+cenario.codigo+'"]');await pausa.getByLabel(cenario.campo,{exact:true}).fill(cenario.alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});await pagina.reload();expect(await pausa.getByLabel(cenario.campo,{exact:true}).inputValue()).toBe(cenario.alternativa);expect(remotas).toEqual([]);}
  finally{if(!pagina.isClosed())await contexto.setOffline(false);}
 });
 test(cenario.aula+' recupera execução e assistência pelo backup',async({page:pagina})=>{
  await pagina.emulateMedia({reducedMotion:'reduce'});await pagina.goto('/#/aula/'+cenario.aula);const pausa=pagina.locator('[data-practice="'+cenario.codigo+'"]');await pausa.getByLabel(cenario.campo,{exact:true}).fill(cenario.alternativa);await pausa.getByRole('button',{name:'Conferir comportamento',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('A correção passou',{timeout:20000});await pausa.getByRole('button',{name:'Consultar solução',exact:true}).click();await expect(pausa.locator('.practice-feedback')).toContainText('assistência');
  await pagina.goto('/#/perfil');const esperar=pagina.waitForEvent('download');await pagina.getByRole('button',{name:'Exportar jornada',exact:true}).click();const arquivo=await readFile((await(await esperar).path())!);await pagina.evaluate(()=>localStorage.removeItem('codelab.progress.v2'));await pagina.reload();
  expect(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')??'null')?.adaptive?.skills??{})).toEqual({});await pagina.locator('#import-progress').setInputFiles({name:'jornada.json',mimeType:'application/json',buffer:arquivo});await pagina.getByRole('button',{name:'Restaurar jornada',exact:true}).click();await pagina.reload();
  const salvo=await pagina.evaluate(()=>JSON.parse(localStorage.getItem('codelab.progress.v2')!));expect(salvo.practiceAnswers[cenario.codigo]).toMatchObject({passed:true,assisted:true,value:cenario.alternativa});expect(salvo.adaptive.skills[cenario.habilidade].review.lastOutcome).toBe('assisted');
 });
}
