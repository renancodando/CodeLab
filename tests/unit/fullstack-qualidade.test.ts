import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {contratosIntegracao} from '../../src/content/contratos-integracao';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {evaluate} from '../../src/execution/evaluate';
import {lessons} from '../../src/content/curriculum';

const aulas=['fullstack-testes','fullstack-config','fullstack-memoria'];
const atividades=aulas.flatMap(practicesForLesson);
const atividade=(id:string)=>atividades.find(a=>a.id===id)!;
const respostas:Record<string,string>={'fullstack-prever-evidencia':'true\nfalse','fullstack-testar-fronteira':'real','fullstack-prever-configuracao':'true\n""\nfalse','fullstack-conferir-publicacao':'destino','fullstack-prever-descarte':'1\n0','fullstack-liberar-modelo':'ambos'};
it('as seis decisões continuam conceituais e recusam alternativas erradas sem revelar solução',async()=>{
 for(const [id,resposta] of Object.entries(respostas)){
  expect(await evaluatePractice(id,resposta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
  expect((await evaluatePractice(id,'resposta ausente')).passed).toBe(false);
  for(const opcao of atividade(id).options??[])if(opcao.id!==resposta){const erro=await evaluatePractice(id,opcao.id);expect(erro.passed).toBe(false);expect(erro.feedback).not.toContain(getPracticeSolution(id)!);}
 }
});
it('executa as três referências sem confundir amostra local com integração, ambiente ou heap',async()=>{
 for(const id of ['fullstack-prever-evidencia','fullstack-prever-configuracao','fullstack-prever-descarte']){
  const resultado=await evaluate(atividade(id).code!,'laboratorio');expect(resultado.error).toBeUndefined();expect(resultado.logs).toEqual(respostas[id].split('\n'));
 }
});
it('executa todas as alternativas do protocolo de modelo externo e confere a ordem',async()=>{
 const pausa=atividade('fullstack-liberar-modelo');
 for(const opcao of pausa.options!){
  const codigo=pausa.code!.replace('return () => editor.dispose();',opcao.text);
  const resultado=await evaluate(codigo,'aula',[{label:'ordem e propriedade',expression:`(()=>{const chamadas=[],modelo={dispose:()=>chamadas.push('modelo')};let recebido;const fim=montarEditor(()=>modelo,m=>{recebido=m;return {dispose:()=>chamadas.push('editor')};});fim();return recebido===modelo&&JSON.stringify(chamadas)==='["editor","modelo"]';})()`,expected:true}]);
  expect(resultado.error).toBeUndefined();expect(resultado.passed).toBe(opcao.id==='ambos');
 }
});
for(const id of ['fullstack-testar-cadastro','fullstack-configuracao-publica','fullstack-criar-descarte'])it(id+': gabarito executa e o início incompleto falha',async()=>{
 const resultado=await evaluatePractice(id,contratosIntegracao[id].solution);expect(resultado).toMatchObject({passed:true,evidence:'executed',execution:'quickjs'});expect(resultado.tests.length).toBe(5);
 expect((await evaluatePractice(id,atividade(id).code!)).passed).toBe(false);
});
it('aceita uma suíte equivalente que usa outros títulos e estrutura de asserções',async()=>{
 const codigo=`function testarCadastro(fn){
  try{
   for(const [x,t] of [[{titulo:'  Café  ',admin:true},'Café'],[{titulo:'C  D'},'C  D'],[{titulo:' '+ 'Z'.repeat(80)+' '},'Z'.repeat(80)]]){
    const foto=JSON.stringify(x),y=fn(x);if(y===x||!y||Array.isArray(y)||Object.keys(y).length!==1||y.titulo!==t||JSON.stringify(x)!==foto)return false;
   }
   for(const x of [null,[],false,'x',9,{},{titulo:0},{titulo:null},{titulo:[]},{titulo:{}},{titulo:' '},{titulo:' '+ 'Y'.repeat(81)+' '},{titulo:'😀'.repeat(41)}]){
    const foto=JSON.stringify(x);let erro;try{fn(x);}catch(e){erro=e;}if(!(erro instanceof TypeError)||JSON.stringify(x)!==foto)return false;
   }
   const x=fn({titulo:'Um'}),y=fn({titulo:'Dois'});return x!==y&&x.titulo==='Um'&&y.titulo==='Dois';
  }catch{return false;}
 }`;
 expect((await evaluatePractice('fullstack-testar-cadastro',codigo)).passed).toBe(true);
});
it('aceita configuração equivalente com ordem de propriedades distinta',async()=>{
 const codigo=`function montarConfiguracaoPublica(dado){
  if(!dado||typeof dado!=='object'||Array.isArray(dado))throw Error('AMBIENTE');
  const ler=nome=>{const v=dado[nome];if(typeof v!=='string'||!v.trim().length)throw Error(nome);return v.trim();};
  const a=ler('API_BASE'),v=ler('VERSAO');let d=false;
  switch(dado.DEPURACAO){case undefined:case 'false':break;case 'true':d=true;break;default:throw Error('DEPURACAO');}
  return Object.fromEntries([['depuracao',d],['versao',v],['apiBase',a]]);
 }`;
 expect((await evaluatePractice('fullstack-configuracao-publica',codigo)).passed).toBe(true);
});
it('aceita descarte equivalente sem exigir pop ou o texto do gabarito',async()=>{
 const codigo=`function criarDescarte(itens){const lista=itens.slice().reverse();let ativo=true;return()=>{if(!ativo)return[];ativo=false;const erros=[];for(const item of lista){try{item();}catch(e){erros.push(e);}}lista.length=0;return erros;};}`;
 expect((await evaluatePractice('fullstack-criar-descarte',codigo)).passed).toBe(true);
});
const suite=contratosIntegracao['fullstack-testar-cadastro'].solution;
const suitesErradas={
 aceitarTudo:'function testarCadastro(){return true;}',
 recusarTudo:'function testarCadastro(){return false;}',
 soExemplo:`function testarCadastro(fn){try{return fn({titulo:'Estudar'}).titulo==='Estudar';}catch{return false;}}`,
 pontosEmVezDeUnidades:suite.replace("{titulo:'😀'.repeat(41)}","{titulo:''}"),
 qualquerErro:suite.replace('erro instanceof TypeError','true'),
 semLimite:suite.replace("{titulo:'  '+ 'X'.repeat(81)+'  '}","{titulo:''}"),
 mutacaoNaRecusa:suite.replace('!recusou||JSON.stringify(entrada)!==antes','!recusou'),
 saidasCompartilhadas:suite.replace("return a!==b&&a.titulo==='Primeira'&&b.titulo==='Segunda';","return b.titulo==='Segunda';")
};
const config=contratosIntegracao['fullstack-configuracao-publica'].solution;
const configuracoesErradas={
 truthy:config.replace("depuracao:opcao==='true'","depuracao:Boolean(opcao)"),
 privado:config.replace('return {apiBase:','return {...ambiente,apiBase:'),
 padrao:config.replace("if(typeof ambiente[nome]!=='string'||ambiente[nome].trim()==='')throw new Error(nome);","if(!ambiente[nome])return {apiBase:'/api',versao:'padrao',depuracao:false};"),
 mutacaoNaRecusa:config.replace("throw new Error('DEPURACAO');","{ambiente.DEPURACAO='false';throw new Error('DEPURACAO');}"),
 mensagem:config.replace('new Error(nome)',"new Error(nome+':'+ambiente[nome])"),
 mutacao:config.replace('textos[nome]=ambiente[nome].trim();','textos[nome]=ambiente[nome]=ambiente[nome].trim();'),
 espacosNaOpcao:config.replace('const opcao=ambiente.DEPURACAO;','const opcao=ambiente.DEPURACAO?.trim();'),
 log:config.replace('const textos={};','console.log(ambiente);const textos={};'),
 compartilhada:config.replace('function montarConfiguracaoPublica','function configurar')+`\nconst unica={};function montarConfiguracaoPublica(x){return Object.assign(unica,configurar(x));}`
};
const descarte=contratosIntegracao['fullstack-criar-descarte'].solution;
const descartesErrados={
 ordem:descarte.replace('pendentes.pop()','pendentes.shift()'),
 interromper:descarte.replace('falhas.push(erro);','throw erro;'),
 falsy:descarte.replace('falhas.push(erro);','if(erro)falhas.push(erro);'),
 alterarLista:descarte.replace('const pendentes=[...recursos]','const pendentes=recursos'),
 capturaTardia:descarte.replace('const pendentes=[...recursos];let encerrado=false;','let encerrado=false;').replace('const falhas=[];','const pendentes=[...recursos];const falhas=[];'),
 reentrada:descarte.replace('encerrado=true;','').replace('return falhas;','encerrado=true;return falhas;'),
 donosCompartilhados:descarte.replace('function criarDescarte(recursos) {','let encerrado=false;function criarDescarte(recursos) {').replace('const pendentes=[...recursos];let encerrado=false;','const pendentes=[...recursos];')
};
for(const [id,base,variantes] of [['fullstack-testar-cadastro',suite,suitesErradas],['fullstack-configuracao-publica',config,configuracoesErradas],['fullstack-criar-descarte',descarte,descartesErrados]] as const){
 for(const [nome,codigo] of Object.entries(variantes))it(id+' recusa '+nome,async()=>{
  expect(codigo).not.toBe(base);const resultado=await evaluatePractice(id,codigo);expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(base);
 });
}
it('mantém a aplicação original e acrescenta produção nas três aulas existentes',()=>{
 for(const id of aulas){const aula=lessons.find(l=>l.id===id)!;expect(aula.capitulos).toHaveLength(12);expect(aula.exercise.length).toBeGreaterThan(40);const pausas=practicesForLesson(id);expect(pausas.map(p=>p.afterBlock)).toEqual([3,6,8]);expect(pausas[2]).toMatchObject({kind:'debug',capability:'producao',assinaturaVazia:true});}
 expect(lessons.find(l=>l.id==='fullstack-testes')!.code).toContain('banco temporário');expect(lessons.find(l=>l.id==='fullstack-config')!.code).toContain('dotnet build');expect(lessons.find(l=>l.id==='fullstack-memoria')!.code).toContain('ResizeObserver');
});
