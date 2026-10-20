import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

it.each(['http','metodos'])('preserva capítulos, projeto e preparação da aula %s',identificador=>{
 const aula=lessons.find(item=>item.id===identificador)!,pausas=practicesForLesson(identificador);
 expect(aula.capitulos).toHaveLength(12);expect(pausas.map(item=>item.afterBlock)).toEqual([3,6,8]);
 expect(aula.capitulos.find(item=>item.id==='projeto')?.paragrafos.join(' ')).toContain(identificador==='http'?'criação/consulta':'CRUD de notas');
 const catalogo={...adaptiveCatalog,preferredLanguage:'javascript',activities:adaptiveCatalog.activities.filter(item=>item.lessonId===identificador)};
 const estado=freshAdaptive();
 expect(buildDailySession(estado,catalogo,{now:Date.parse('2026-10-20T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([idPreparacao(identificador),...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('Fetch distingue um status HTTP legível de falha de rede',async()=>{
 expect(await evaluatePractice('js-http-prever-resposta-ausente','404\r\nfalse')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['falha de rede','404\ntrue','500\nfalse','404 false'])expect((await evaluatePractice('js-http-prever-resposta-ausente',resposta)).passed).toBe(false);
});
it('repetição da exclusão compara o efeito no recurso, não a igualdade do status',async()=>{
 expect(await evaluatePractice('js-metodos-prever-exclusao','204\n404\nfalse')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['204\n204\nfalse','204\n404\ntrue','404\n404\nfalse'])expect((await evaluatePractice('js-metodos-prever-exclusao',resposta)).passed).toBe(false);
});
it.each([
 ['js-http-corpo-sem-conteudo','sem-corpo',['somente-200','objeto-vazio']],
 ['js-metodos-alteracao-parcial','parcial',['substituir','consulta']]
] as const)('o diagnóstico conceitual %s conserva sua fronteira',async(id,correta,erradas)=>{
 for(const resposta of [...erradas,'']){
  const r=await evaluatePractice(id,resposta);expect(r.passed).toBe(false);expect(r.feedback).not.toContain(getPracticeSolution(id)!);
 }
 expect(await evaluatePractice(id,correta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('a produção tem assinatura vazia, enquanto o diagnóstico fornece um defeito real',async()=>{
 const producao=practicesForLesson('http').find(item=>item.id==='js-http-resposta-criacao')!;
 expect(producao).toMatchObject({assinaturaVazia:true,capability:'producao'});
 for(const atividade of [producao,practicesForLesson('metodos').find(item=>item.id==='js-metodos-preservar-campos')!]){
  const resultado=await evaluatePractice(atividade.id,atividade.code!);
  expect(resultado).toMatchObject({passed:false,status:'evaluated',evidence:'executed',execution:'quickjs'});
  expect(resultado.feedback).not.toContain(getPracticeSolution(atividade.id)!);
 }
});
const criacao=getPracticeSolution('js-http-resposta-criacao')!;
it.each([
 ['referência',criacao],
 ['cabeçalhos minúsculos e campos em outra ordem','const respostaDeCriacao=nota=>({corpo:{titulo:nota.titulo,id:nota.id},cabecalhos:{"content-type":"APPLICATION/JSON; charset=utf-8",location:`/notas/${nota.id}`},status:201});'],
 ['cabeçalho adicional válido',criacao.replace('Location:', '"Cache-Control": "no-store", Location:')],
 ['corpo compartilhado com a nota sem mutação','function respostaDeCriacao(nota){return {status:201,corpo:nota,cabecalhos:{"Location":"/notas/"+nota.id,"Content-Type":"application/json"}};}']
])('executa a criação equivalente: %s',async(_,codigo)=>{
 expect(await evaluatePractice('js-http-resposta-criacao',codigo)).toMatchObject({passed:true,evidence:'executed',execution:'quickjs'});
});
it.each([
 ['status de consulta',criacao.replace('status: 201','status: 200')],
 ['localização fixa',criacao.replace('"/notas/" + nota.id','"/notas/7"')],
 ['nome de cabeçalho inválido',criacao.replace('Location:', '"Nome Ruim": "valor", Location:')],
 ['valor de cabeçalho com quebra de linha',criacao.replace('application/json','application/json;\\r\\nquebra')],
 ['cabeçalho extra sem string',criacao.replace('Location:', '"X-Contagem": 3, Location:')],
 ['controle no valor do cabeçalho',criacao.replace('application/json','application/json;\\u0000')],
 ['valor não representável por Headers',criacao.replace('Location:', '"X-Extra": "😀", Location:')],
 ['tipo de conteúdo errado',criacao.replace('application/json','text/plain')],
 ['corpo serializado cedo',criacao.replace('corpo: { id: nota.id, titulo: nota.titulo }','corpo: JSON.stringify(nota)')],
 ['corpo incompleto',criacao.replace('corpo: { id: nota.id, titulo: nota.titulo }','corpo: { id: nota.id }')],
 ['normalização não solicitada',criacao.replace('titulo: nota.titulo','titulo: nota.titulo.trim()')],
 ['nota modificada',criacao.replace('  return {','  nota.id++; return {')],
 ['resposta compartilhada','let resposta={};'+criacao.replace('respostaDeCriacao','construirResposta')+';function respostaDeCriacao(nota){return Object.assign(resposta,construirResposta(nota));}'],
 ['cabeçalhos compartilhados','const cabecalhos={};'+criacao.replace('respostaDeCriacao','construirResposta')+';function respostaDeCriacao(nota){const r=construirResposta(nota);Object.assign(cabecalhos,r.cabecalhos);return {...r,cabecalhos};}']
])('a correção de criação detecta o defeito: %s',async(defeito,codigo)=>{
 expect(codigo).not.toBe(criacao);const r=await evaluatePractice('js-http-resposta-criacao',codigo);
 expect(r.passed).toBe(false);expect(r.evidence).toBe('executed');expect(r.feedback).not.toContain(criacao);if(defeito==='cabeçalhos compartilhados')expect(r.feedback).toContain('Não reutilize um descritor');else if(defeito.includes('cabeçalho')||defeito.includes('Headers'))expect(r.feedback).toContain('três componentes');
});
const parcial=getPracticeSolution('js-metodos-preservar-campos')!;
it.each([
 ['referência',parcial],
 ['seleção de propriedades permitidas','function aplicarAlteracao(tarefa,alteracao){const proxima={...tarefa};for(const campo of ["titulo","concluida"])if(Object.hasOwn(alteracao,campo))proxima[campo]=alteracao[campo];return proxima;}'],
 ['teste de presença equivalente para objeto JSON','const aplicarAlteracao=(tarefa,alteracao)=>({concluida:"concluida" in alteracao?alteracao.concluida:tarefa.concluida,titulo:"titulo" in alteracao?alteracao.titulo:tarefa.titulo,id:tarefa.id});']
])('executa a alteração equivalente: %s',async(_,codigo)=>{
 expect(await evaluatePractice('js-metodos-preservar-campos',codigo)).toMatchObject({passed:true,evidence:'executed',execution:'quickjs'});
});
it.each([
 ['troca false pelo valor anterior',practicesForLesson('metodos').find(item=>item.id==='js-metodos-preservar-campos')!.code!],
 ['apaga campos ausentes','function aplicarAlteracao(tarefa,alteracao){return {id:tarefa.id,titulo:alteracao.titulo,concluida:alteracao.concluida};}'],
 ['aceita id e campos extras','function aplicarAlteracao(tarefa,alteracao){return {...tarefa,...alteracao};}'],
 ['muta a tarefa','function aplicarAlteracao(tarefa,alteracao){if(Object.hasOwn(alteracao,"titulo"))tarefa.titulo=alteracao.titulo;if(Object.hasOwn(alteracao,"concluida"))tarefa.concluida=alteracao.concluida;return tarefa;}'],
 ['reutiliza tarefa em patch vazio',parcial.replace('  return {','  if(!Object.keys(alteracao).length)return tarefa; return {')],
 ['presume false para campo ausente',parcial.replace('alteracao.concluida : tarefa.concluida','alteracao.concluida : false')],
 ['resultado global','let resultado={};'+parcial.replace('aplicarAlteracao','construirAlteracao')+';function aplicarAlteracao(tarefa,alteracao){return Object.assign(resultado,construirAlteracao(tarefa,alteracao));}'],
 ['resposta do exemplo','function aplicarAlteracao(){return {id:12,titulo:"Revisar",concluida:false};}']
])('a correção parcial detecta o defeito: %s',async(_,codigo)=>{
 expect(codigo).not.toBe(parcial);const r=await evaluatePractice('js-metodos-preservar-campos',codigo);
 expect(r.passed).toBe(false);expect(r.evidence).toBe('executed');expect(r.feedback).not.toContain(parcial);
});
