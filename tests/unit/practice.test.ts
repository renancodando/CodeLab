import {describe,expect,it} from 'vitest';
import {practiceActivities,practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

describe('prática distribuída e verificação de comportamento',()=>{
 it('distribui atividades próprias nas oito linguagens sem expor verificações ou solução nos cartões',()=>{
  expect(new Set(practiceActivities.map(item=>item.id)).size).toBe(practiceActivities.length);
  for(const language of ['html','css','javascript','typescript','python','csharp','cpp','sql']){
   const activities=practiceActivities.filter(item=>item.language===language);
   expect(activities.length).toBeGreaterThanOrEqual(3);
   expect(activities.some(item=>item.afterBlock===1)).toBe(true);
   expect(activities.some(item=>item.afterBlock===3)).toBe(true);
   expect(activities.some(item=>item.afterBlock===5)).toBe(true);
   for(const item of activities){
    expect(item.lessonIds.length).toBeGreaterThan(0);expect(item.skillIds.length).toBeGreaterThan(0);
    expect('solution' in item).toBe(false);expect('checks' in item).toBe(false);
    expect(getPracticeSolution(item.id)).toBeTruthy();
   }
  }
  expect(practicesForLesson('js-colecoes-iteracao').length).toBeGreaterThanOrEqual(3);
  expect(practicesForLesson('aula-inexistente')).toEqual([]);
 });

 for(const activity of practiceActivities.filter(item=>item.kind==='debug')){
  it(activity.id+': a implementação de referência passa todos os contratos',async()=>{
   const result=await evaluatePractice(activity.id,getPracticeSolution(activity.id)!);
   expect(result.status).toBe('evaluated');expect(result.passed).toBe(true);
   expect(result.evidence).toBe('executed');expect(result.execution).toBe('quickjs');
   expect(result.tests.length).toBeGreaterThanOrEqual(4);
  });
  it(activity.id+': o programa quebrado não passa',async()=>{
   const result=await evaluatePractice(activity.id,activity.code!);
   expect(result.passed).toBe(false);expect(result.tests.some(test=>!test.passed)).toBe(true);
  });
 }
 it('rejeita total fixo e relata a fronteira sem entregar o gabarito',async()=>{
  const result=await evaluatePractice('js-debug-carrinho','function totalizar(){return 89.9;}');
  expect(result.passed).toBe(false);expect(result.tests[0].passed).toBe(true);
  expect(result.feedback).toContain('vazio');expect(result.feedback).not.toContain('Math.round');
 });
 it('lista vazia falha como comportamento avaliado mesmo quando reduce lança exceção',async()=>{
  const result=await evaluatePractice('js-debug-soma-vazia','function somaLista(v){return v.reduce((a,b)=>a+b);}');
  expect(result.status).toBe('evaluated');expect(result.tests[0].passed).toBe(true);
  expect(result.tests[1].passed).toBe(false);expect(result.feedback).toContain('lista vazia');
 });
 it('um filtro com saída correta ainda é rejeitado se alterar registros',async()=>{
  const result=await evaluatePractice('js-debug-filtro-mutacao','function selecionarAtivos(pessoas){const selecionadas=pessoas.filter(p=>p.ativo===true);for(const p of pessoas)p.nome="mudou";return selecionadas;}');
  expect(result.tests.slice(0,3).every(test=>test.passed)).toBe(true);
  expect(result.tests[3].passed).toBe(false);expect(result.passed).toBe(false);
  expect(result.feedback).toContain('alterando');
 });
 it('um algoritmo que inventa zero para negativos recebe feedback próprio',async()=>{
  const result=await evaluatePractice('js-debug-maior-negativo','function maior(v){return v.length?Math.max(0,...v):null;}');
  expect(result.tests[0].passed).toBe(true);expect(result.tests[1].passed).toBe(false);
  expect(result.feedback).toContain('negativos');
 });
 const conceptualAnswers:Record<string,string|string[]>={
'js-prever-propriedade':'false true\nbase','js-descritor-sem-getter':'descriptor',
'cpp-prever-intervalo':'6,2','cpp-ordenar-erase':['for','testar','apagar','senao','avancar','fimif','fimfor'],'cpp-reobter-reserva':'reobter',
  'html-label-vinculo':'email-contato','html-dialogo-foco':'cancelar','html-ordenar-formulario':['inicio','rotulo','campo','botao','fim'],
  'css-grid-minimo':'minmax(0,1fr)','css-grade-estreita':'adaptar','css-prever-cascata':'green',
  'ts-fonte-covariancia':'detalhada','ts-callback-entrada':'geral','ts-propriedade-funcao':'propriedade',
  'ts-unknown-validacao':'validar','ts-zero-ausencia':'??','ts-tipo-apagado':'texto',
  'py-prever-esgotamento':'0\n[1, 2]\n[]','py-ordenar-lote':['declarar','cursor','consumir','retornar'],'py-fechar-consumo':'closing',
  'py-prever-range':'0\n2\n4','py-ordenar-default':['declarar','testar','alocar','anexar','retornar'],'py-keyword-contrato':'nomeado',
  'cs-prever-decimal':'True','cs-ordenar-using':['abrir','bloco','usar','fechar','fim'],'cs-nullable-guard':'padrao',
  'cpp-prever-referencia':'7,7','cpp-ordenar-raii':['abrir','criar','usar','fechar','fim'],'cpp-iterador-invalidado':'invalidado',
  'sql-null-filtro':'isnull','sql-prever-fanout':'6','sql-ordenar-transacao':['iniciar','debito','credito','confirmar']
 };
 for(const [id,answer] of Object.entries(conceptualAnswers)){
  it(id+': corrige offline sem simular execução externa',async()=>{
   const result=await evaluatePractice(id,answer);
   expect(result.passed).toBe(true);expect(result.execution).toBe('not-run');
   expect(result.evidence).toBe('conceptual');expect(result.feedback).toContain('não houve execução');
   expect((await evaluatePractice(id,'resposta incorreta')).passed).toBe(false);
  });
 }
 it('reconstrução exige todas as linhas, sem duplicações nem prefixos',async()=>{
  expect((await evaluatePractice('py-ordenar-default',['declarar','testar','alocar','anexar'])).passed).toBe(false);
  expect((await evaluatePractice('py-ordenar-default',['declarar','testar','alocar','anexar','anexar','retornar'])).passed).toBe(false);
  expect((await evaluatePractice('py-ordenar-default','declarar\ntestar\nalocar\nanexar\nretornar')).passed).toBe(true);
 });
 it('mantém erro de compilação conceitual distinto de uma previsão numérica',async()=>{
  expect((await evaluatePractice('cpp-iterador-invalidado','um')).passed).toBe(false);
  expect((await evaluatePractice('cs-prever-decimal','true')).passed).toBe(false);
  expect((await evaluatePractice('ts-zero-ausencia','||')).passed).toBe(false);
 });
 it('cancelamento e atividade ausente não geram evidência de erro do aluno',async()=>{
  const controller=new AbortController();controller.abort();
  const cancelled=await evaluatePractice('js-debug-carrinho','while(true){}',controller.signal);
  expect(cancelled.status).toBe('cancelled');expect(cancelled.tests).toEqual([]);
  expect((await evaluatePractice('inexistente','x')).status).toBe('unavailable');
 });
 it('rejeita transbordamento, centavos inseguros e quantidade que perdeu precisão',async()=>{
  const result=await evaluatePractice('js-debug-carrinho','function totalizar(itens){if(!Array.isArray(itens))throw new TypeError();let total=0;for(const item of itens){if(!item||typeof item.preco!=="number"||!Number.isFinite(item.preco)||item.preco<0||!Number.isInteger(item.quantidade)||item.quantidade<0)throw new TypeError();total+=item.preco*item.quantidade;}return Math.round(total*100)/100;}');
  expect(result.tests.slice(0,4).every(test=>test.passed)).toBe(true);
  expect(result.tests[4].passed).toBe(false);expect(result.feedback).toContain('precisão');
 });
 it('exceções escritas pelo aluno continuam evidência avaliada, mesmo com texto de infraestrutura',async()=>{
  const result=await evaluatePractice('js-debug-carrinho','throw new Error("O executor não carregou. Verifique sua conexão e tente novamente." + "x".repeat(10000));');
  expect(result.status).toBe('evaluated');expect(result.evidence).toBe('executed');expect(result.passed).toBe(false);
 });
 it('limita respostas e não aceita IDs de linhas como programa JS',async()=>{
  expect((await evaluatePractice('py-prever-range','x'.repeat(30001))).passed).toBe(false);
  expect((await evaluatePractice('js-debug-carrinho',['linha'])).passed).toBe(false);
 });
});

it('leitura numérica própria relata herança após o caso comum sem entregar a solução',async()=>{
 const result=await evaluatePractice('js-debug-numero-proprio','function lerNumeroProprio(obj,chave){return Number(obj[chave]??0);}');
 expect(result.tests[0].passed).toBe(true);expect(result.tests[1].passed).toBe(false);
 expect(result.feedback).toContain('herança');expect(result.feedback).not.toContain('getOwnPropertyDescriptor');
});
it('retornar um número fixo não passa pelos contratos de leitura própria',async()=>{
 const result=await evaluatePractice('js-debug-numero-proprio','function lerNumeroProprio(){return 0;}');
 expect(result.passed).toBe(false);expect(result.tests[0].passed).toBe(false);
});

it('previsão e escolha de descritor JavaScript correspondem aos trechos publicados',async()=>{
 const prediction=practiceActivities.find(a=>a.id==='js-prever-propriedade')!;
 const source=practiceActivities.find(a=>a.id==='js-descritor-sem-getter')!.options!.find(o=>o.id==='descriptor')!.text;
 const {evaluate}=await import('../../src/execution/evaluate');
 let result=await evaluate(prediction.code!,'laboratorio');expect(result.error).toBeUndefined();expect(result.logs).toEqual(['false true','base']);
 result=await evaluate('let leituras=0;const entrada={get nome(){leituras++;return "Lia";}};const d='+source+';console.log(typeof d.get,leituras,Object.hasOwn(d,"value"));','laboratorio');
 expect(result.error).toBeUndefined();expect(result.logs).toEqual(['function 0 false']);
});
