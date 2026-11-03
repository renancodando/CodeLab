import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {contratosIntegracao} from '../../src/content/contratos-integracao';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';
import {lessons} from '../../src/content/curriculum';

const atividades=['fullstack-arquitetura','fullstack-integracao'].flatMap(practicesForLesson);
const atividade=(id:string)=>atividades.find(a=>a.id===id)!;
const respostas:Record<string,string>={'fullstack-prever-autoridade':'99\ntrue','fullstack-limitar-campos':'permitidos','fullstack-prever-rascunho':'Estudar CSS\n42\nfalse','fullstack-preservar-falha':'encerrar'};
it('confere decisões conceituais sem alegar rede ou persistência',async()=>{
 for(const [id,resposta] of Object.entries(respostas)){
  expect(await evaluatePractice(id,resposta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
  expect((await evaluatePractice(id,'outra resposta')).passed).toBe(false);
 }
 for(const id of ['fullstack-limitar-campos','fullstack-preservar-falha'])for(const opcao of atividade(id).options!)if(opcao.id!==respostas[id]){
  const erro=await evaluatePractice(id,opcao.id);expect(erro.passed).toBe(false);expect(erro.feedback).not.toContain(getPracticeSolution(id)!);
 }
});
it('executa as previsões JavaScript, sem servidor ou banco',async()=>{
 for(const id of ['fullstack-prever-autoridade','fullstack-prever-rascunho']){
  const resultado=await evaluate(atividade(id).code!,'laboratorio');expect(resultado.error).toBeUndefined();expect(resultado.logs).toEqual(respostas[id].split('\n'));
 }
});
it('as alternativas de projeção são verificadas por chaves e valores reais',async()=>{
 const casos=[{entrada:{titulo:'  Estudar  ',id:99,concluida:true,administrador:true},gerado:42,titulo:'Estudar'},{entrada:{titulo:'Ler',observacao:'extra'},gerado:7,titulo:'Ler'},{entrada:{titulo:'Ação'},gerado:81,titulo:'Ação'}];
 for(const opcao of atividade('fullstack-limitar-campos').options!){
  const codigo='function montar(entrada,gerado){const tituloValidado=entrada.titulo.trim();'+opcao.text+'return tarefa;}';
  const checks=casos.map(caso=>({label:'entrada '+caso.gerado,expression:'(()=>{const entrada='+JSON.stringify(caso.entrada)+';const antes=JSON.stringify(entrada),tarefa=montar(entrada,'+caso.gerado+');return Object.keys(tarefa).sort().join(",")==="concluida,id,titulo"&&tarefa.id==='+caso.gerado+'&&tarefa.titulo==='+JSON.stringify(caso.titulo)+'&&tarefa.concluida===false&&JSON.stringify(entrada)===antes;})()',expected:true}));
  const resultado=await evaluate(codigo,'aula',checks);expect(resultado.error).toBeUndefined();expect(resultado.passed).toBe(opcao.id==='permitidos');
 }
});
it('finally é verificado depois de resolução e rejeição de Promises locais',async()=>{
 const pausa=atividade('fullstack-preservar-falha');
 for(const opcao of pausa.options!){
  const codigo=pausa.code!.replace('estado.rascunho = "";',opcao.text);
  const checks=[false,true].map(falhar=>({label:falhar?'rejeição':'resolução',aguardar:true,expression:'(async()=>{const estado={rascunho:"  Retomar  ",carregando:false,tarefas:[{id:8}],erro:""};const antes=JSON.stringify(estado.tarefas);await tentarSalvar(estado,async()=>{'+(falhar?'throw new Error("falha simulada");':'return {id:42};')+'});return estado.carregando===false&&estado.rascunho==="  Retomar  "&&JSON.stringify(estado.tarefas)===antes&&'+(falhar?'estado.erro.length>0':'estado.erro===""')+';})()',expected:true}));
  const resultado=await evaluate(codigo,'aula',checks);expect(resultado.error).toBeUndefined();expect(resultado.passed).toBe(opcao.id==='encerrar');
 }
});
for(const id of ['fullstack-preparar-cadastro','fullstack-aplicar-confirmacao'])it(id+': executa a produção de referência em QuickJS',async()=>{
 const resultado=await evaluatePractice(id,contratosIntegracao[id].solution);expect(resultado).toMatchObject({passed:true,evidence:'executed',execution:'quickjs'});expect(resultado.tests.length).toBeGreaterThanOrEqual(4);
 expect((await evaluatePractice(id,atividade(id).code!)).passed).toBe(false);
});
it('aceita uma preparação equivalente sem exigir o texto do gabarito',async()=>{
 const codigo=`function prepararCadastro(dado){
  if(dado===null||typeof dado!=='object'||Array.isArray(dado))throw new TypeError();
  const valor=dado['titulo'];if(typeof valor!=='string')throw new TypeError();
  const texto=String.prototype.trim.call(valor);if(texto.length===0||texto.length>=81)throw new TypeError();
  return Object.fromEntries([['titulo',texto]]);
 }`;
 expect((await evaluatePractice('fullstack-preparar-cadastro',codigo)).passed).toBe(true);
});
it('aceita reconciliação equivalente e outra mensagem de falha',async()=>{
 const codigo=`function aplicarConfirmacao(estado,enviado,criado){
  const saida=Object.assign({},estado,{carregando:false});
  if(criado===null){saida.erro='Tente novamente';return saida;}
  saida.erro='';saida.tarefas=estado.tarefas.slice();const indice=saida.tarefas.findIndex(t=>t.id===criado.id);
  const tarefa={concluida:criado.concluida,titulo:criado.titulo,id:criado.id};
  if(indice<0)saida.tarefas.push(tarefa);else saida.tarefas.splice(indice,1,tarefa);
  saida.rascunho=estado.rascunho===enviado?'':estado.rascunho;return saida;
 }`;
 expect((await evaluatePractice('fullstack-aplicar-confirmacao',codigo)).passed).toBe(true);
});
const cadastro=contratosIntegracao['fullstack-preparar-cadastro'].solution;
const cadastrosErrados={
 fixo:'function prepararCadastro(){return {titulo:"Estudar"};}',
 semTrim:cadastro.replace('entrada.titulo.trim()','entrada.titulo'),
 unidades:cadastro.replace('titulo.length>80','[...titulo].length>80'),
 limite:cadastro.replace('titulo.length>80','titulo.length>81'),
 extras:cadastro.replace('return {titulo};','return {...entrada,titulo};'),
 mutacao:cadastro.replace('return {titulo};','entrada.titulo=titulo;return {titulo};'),
 compartilhado:'const salvo={titulo:""};'+cadastro.replace('return {titulo};','salvo.titulo=titulo;return salvo;')
};
for(const [nome,codigo] of Object.entries(cadastrosErrados))it('cadastro recusa '+nome,async()=>{
 expect(codigo).not.toBe(cadastro);const resultado=await evaluatePractice('fullstack-preparar-cadastro',codigo);expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(cadastro);
});
const confirmar=contratosIntegracao['fullstack-aplicar-confirmacao'].solution;
const confirmacoesErradas={
 sempreFalha:'function aplicarConfirmacao(estado){return {...estado,carregando:false,erro:"Falha"};}',
 apagarEdicao:confirmar.replace("rascunho:estado.rascunho===tituloEnviado?'':estado.rascunho","rascunho:''"),
 duplicar:confirmar.replace('const tarefas=existe?estado.tarefas.map(tarefa=>tarefa.id===criado.id?criado:tarefa):[...estado.tarefas,criado];','const tarefas=[...estado.tarefas,criado];'),
 perderCampos:confirmar.replace('...estado,',''),
 mutacao:confirmar.replace('function aplicarConfirmacao(estado, tituloEnviado, criado) {','function aplicarConfirmacao(estado, tituloEnviado, criado) { estado.carregando=false;'),
 erroAntigo:confirmar.replace("erro:'',rascunho:","erro:estado.erro,rascunho:"),
 compartilhado:confirmar.replace('function aplicarConfirmacao','function baseConfirmacao')+'\nconst salvo={};function aplicarConfirmacao(e,t,c){for(const chave of Object.keys(salvo))delete salvo[chave];return Object.assign(salvo,baseConfirmacao(e,t,c));}'
};
for(const [nome,codigo] of Object.entries(confirmacoesErradas))it('confirmação recusa '+nome,async()=>{
 expect(codigo).not.toBe(confirmar);const resultado=await evaluatePractice('fullstack-aplicar-confirmacao',codigo);expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(confirmar);
});
it('preserva as aulas originais e exige produção além das decisões',()=>{
 for(const id of ['fullstack-arquitetura','fullstack-integracao']){
  const pausas=practicesForLesson(id);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);expect(new Set(pausas.flatMap(p=>p.skillIds)).size).toBe(3);expect(pausas[2]).toMatchObject({kind:'debug',capability:'producao',assinaturaVazia:true});
  const aula=lessons.find(l=>l.id===id)!;expect(aula.capitulos).toHaveLength(12);expect(aula.exercise.length).toBeGreaterThan(40);
 }
 expect(lessons.find(l=>l.id==='fullstack-arquitetura')!.code).toContain('Banco');expect(lessons.find(l=>l.id==='fullstack-integracao')!.code).toContain('fetch');
});
