import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

const identificador='js-fetch-concluir-busca',solucao=getPracticeSolution(identificador)!;
it('Fetch mantém capítulos, busca de cidades e preparação antes da prática',()=>{
 const aula=lessons.find(item=>item.id==='fetch-estados')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(pausas.map(item=>item.afterBlock)).toEqual([3,6,8]);
 const projeto=aula.capitulos.find(item=>item.id==='projeto')!.paragrafos.join(' ');
 expect(projeto).toContain('busca de cidades');expect(projeto).toContain('fora do sandbox sem rede');expect(projeto).toContain('ambas as ordens');
 const catalogo={...adaptiveCatalog,preferredLanguage:'javascript',activities:adaptiveCatalog.activities.filter(item=>item.lessonId===aula.id)},estado=freshAdaptive();
 expect(buildDailySession(estado,catalogo,{now:Date.parse('2026-10-21T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([idPreparacao(aula.id),...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('prever cancelamento distingue motivo padrão, sinal e quantidade de eventos',async()=>{
 expect(await evaluatePractice('js-fetch-prever-cancelamento','AbortError\r\ntrue\r\n1')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run',capability:'leitura'});
 for(const resposta of ['AbortError\ntrue\n2','respondeu\ntrue\n1','AbortError\nfalse\n1','TypeError\ntrue\n1']){
  const r=await evaluatePractice('js-fetch-prever-cancelamento',resposta);expect(r.passed).toBe(false);expect(r.feedback).not.toContain(getPracticeSolution('js-fetch-prever-cancelamento')!);
 }
});
it('o diagnóstico exige identidade da busca atual e permanece conceitual',async()=>{
 for(const resposta of ['sempre','invertido','']){
  const r=await evaluatePractice('js-fetch-finalizar-atual',resposta);expect(r.passed).toBe(false);expect(r.feedback).toContain('finally antigo');expect(r.feedback).not.toContain(getPracticeSolution('js-fetch-finalizar-atual')!);
 }
 expect(await evaluatePractice('js-fetch-finalizar-atual','atual')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run',capability:'depuracao'});
});
it('a produção começa vazia, executa de verdade e não vaza a solução',async()=>{
 const atividade=practicesForLesson('fetch-estados').find(item=>item.id===identificador)!;
 expect(atividade).toMatchObject({assinaturaVazia:true,capability:'producao'});
 const r=await evaluatePractice(identificador,atividade.code!);expect(r).toMatchObject({passed:false,status:'evaluated',evidence:'executed',execution:'quickjs',capability:'producao'});
 expect(r.feedback).toContain('Lista vazia');expect(r.feedback).not.toContain(solucao);
});
it.each([
 ['referência',solucao],
 ['atribuição em cópia e switch','function concluirBusca(estado,pedido,resultado){if(pedido!==estado.pedidoAtual)return Object.assign({},estado);const proximo=Object.assign({},estado,{carregando:false,erro:null});switch(resultado.tipo){case "sucesso":proximo.dados=resultado.dados.slice();break;case "erro":proximo.erro=resultado.mensagem;}return proximo;}'],
 ['campos em outra ordem e ternário','const concluirBusca=(e,p,r)=>p===e.pedidoAtual?{erro:r.tipo==="erro"?r.mensagem:null,dados:r.tipo==="sucesso"?r.dados:e.dados,carregando:false,pedidoAtual:e.pedidoAtual}:{...e,dados:e.dados.slice()};'],
 ['listas copiadas sem transformação',solucao.replace('dados: resultado.dados','dados: [...resultado.dados]')]
])('executa a regra equivalente: %s',async(_,codigo)=>{
 expect(await evaluatePractice(identificador,codigo)).toMatchObject({passed:true,status:'evaluated',evidence:'executed',execution:'quickjs'});
});
const defeitos:[string,string][]=[
 ['aplica resultado obsoleto',solucao.replace('  if (pedido !== estado.pedidoAtual) return estado;\n','')],
 ['desliga busca atual ao concluir antiga',solucao.replace('return estado;','return {...estado,carregando:false};')],
 ['aceita pedido futuro',solucao.replace('pedido !== estado.pedidoAtual','pedido < estado.pedidoAtual')],
 ['ignora pedido zero',solucao.replace('  if (pedido !==','  if (!pedido) return estado;\n  if (pedido !==')],
 ['mantém dados antigos no sucesso vazio',solucao.replace('dados: resultado.dados','dados: resultado.dados.length ? resultado.dados : estado.dados')],
 ['preserva erro antigo no sucesso',solucao.replace('dados: resultado.dados, erro: null','dados: resultado.dados, erro: estado.erro')],
 ['perde dados no erro',solucao.replace('    carregando: false,\n    erro:','    carregando: false,\n    dados: [],\n    erro:')],
 ['trata cancelamento esperado como falha',solucao.replace('resultado.mensagem : null','resultado.mensagem : "Cancelada"')],
 ['mantém erro antigo no cancelamento',solucao.replace('resultado.mensagem : null','resultado.mensagem : estado.erro')],
 ['muta estado atual','function concluirBusca(estado,pedido,resultado){if(pedido!==estado.pedidoAtual)return estado;estado.carregando=false;estado.erro=resultado.tipo==="erro"?resultado.mensagem:null;if(resultado.tipo==="sucesso")estado.dados=resultado.dados;return estado;}'],
 ['muta antes de copiar',solucao.replace('  if (resultado.tipo','  estado.carregando = false;\n  if (resultado.tipo')],
 ['esvazia a lista de entrada no sucesso',solucao.replace('  if (resultado.tipo','  estado.dados.length = 0;\n  if (resultado.tipo')],
 ['altera o resultado recebido',solucao.replace('  if (resultado.tipo === "sucesso") {','  if (resultado.tipo === "sucesso") {\n    resultado.dados.push("Extra");')],
 ['muta apenas pedido obsoleto',solucao.replace('if (pedido !== estado.pedidoAtual) return estado;','if (pedido !== estado.pedidoAtual) { estado.carregando = false; return estado; }')],
 ['devolve undefined para pedido antigo',solucao.replace('return estado;','return;')],
 ['usa resposta global','let compartilhado={};'+solucao.replace('concluirBusca','prepararBusca')+';function concluirBusca(estado,pedido,resultado){if(pedido!==estado.pedidoAtual)return estado;return Object.assign(compartilhado,prepararBusca(estado,pedido,resultado));}'],
 ['apara dados sem autorização',solucao.replace('dados: resultado.dados','dados: resultado.dados.map(texto=>texto.trim())')],
 ['filtra strings vazias',solucao.replace('dados: resultado.dados','dados: resultado.dados.filter(Boolean)')],
 ['troca pedido atual',solucao.replace('    ...estado,\n    carregando','    ...estado,\n    pedidoAtual: pedido+1,\n    carregando')],
 ['resolve somente o exemplo','function concluirBusca(){return {pedidoAtual:0,carregando:false,dados:[],erro:null};}'],
 ['retém uma lista global entre chamadas','let dadosCompartilhados=[];'+solucao.replace('concluirBusca','prepararBusca')+';function concluirBusca(e,p,r){const proximo=prepararBusca(e,p,r);if(p!==e.pedidoAtual||r.tipo!=="sucesso")return proximo;dadosCompartilhados.splice(0,dadosCompartilhados.length,...proximo.dados);return {...proximo,dados:dadosCompartilhados};}']
];
it.each(defeitos)('o corretor identifica o defeito: %s',async(_,codigo)=>{
 expect(codigo).not.toBe(solucao);const r=await evaluatePractice(identificador,codigo);
 expect(r.passed).toBe(false);expect(r.evidence).toBe('executed');expect(r.feedback).not.toContain(solucao);
});
