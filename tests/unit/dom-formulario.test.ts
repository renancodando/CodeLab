import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession,ensureDailySession,markConceptSeen,recordEvidence} from '../../src/learning/adaptive';

it('a preparação da aula reúne decisões DOM e execução JavaScript sem premiar leitura',()=>{
 const aula=lessons.find(item=>item.id==='estado-formulario')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(pausas.map(item=>item.afterBlock)).toEqual([3,6,8]);
 expect(pausas.map(item=>item.language)).toEqual(['html','html','javascript']);
 expect(aula.capitulos.find(item=>item.id==='projeto')?.paragrafos.join(' ')).toContain('despesas');
 const estado=freshAdaptive(),preparacao=idPreparacao(aula.id);
 estado.seenConcepts=adaptiveCatalog.activities.filter(item=>item.kind==='concept'&&item.id!==preparacao).map(item=>item.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'html'},{now:Date.parse('2026-10-19T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([preparacao,...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('a mudança de dia conserva o desafio JavaScript ainda não tentado depois da preparação HTML',()=>{
 const catalogo={...adaptiveCatalog,preferredLanguage:'html',activities:adaptiveCatalog.activities.filter(atividade=>atividade.lessonId==='estado-formulario')};
 const estado=freshAdaptive(),primeiroDia={now:Date.parse('2026-10-19T12:00:00Z'),timeZone:'UTC'};
 estado.daily=buildDailySession(estado,catalogo,primeiroDia);
 estado.seenConcepts=catalogo.activities.filter(atividade=>atividade.kind==='concept').map(atividade=>atividade.id);
 estado.daily.completed=[idPreparacao('estado-formulario')];
 const retomada=ensureDailySession(estado,catalogo,{...primeiroDia,now:Date.parse('2026-10-20T12:00:00Z')});
 expect(retomada.day).toBe('2026-10-20');
 expect(retomada.items.map(item=>item.activityId)).toEqual(practicesForLesson('estado-formulario').map(item=>item.id));
 expect(estado.skills).toEqual({});
});
it('o catálogo completo retoma a prática anterior junto do próximo conceito',()=>{
 const catalogo={...adaptiveCatalog,preferredLanguage:'html'};
 const estado=freshAdaptive(),relogio={now:Date.parse('2026-10-19T12:00:00Z'),timeZone:'UTC'};
 const preparacao=catalogo.activities.find(atividade=>atividade.id===idPreparacao('estado-formulario'))!;
 estado.seenConcepts=catalogo.activities.filter(atividade=>atividade.kind==='concept'&&(atividade.ordem??10001)<preparacao.ordem!).map(atividade=>atividade.id);
 const primeiro=ensureDailySession(estado,catalogo,relogio);
 expect(primeiro.items[0].activityId).toBe(preparacao.id);
 markConceptSeen(estado,preparacao.id,relogio,preparacao.incluiConceitos);
 const segundo=ensureDailySession(estado,catalogo,{...relogio,now:Date.parse('2026-10-20T12:00:00Z')});
 const conceitoSeguinte=segundo.items.find(item=>item.kind==='concept')!;
 expect(conceitoSeguinte).toBeDefined();expect(conceitoSeguinte.activityId).not.toBe(preparacao.id);
 expect(segundo.items.filter(item=>item.kind!=='concept').map(item=>item.activityId)).toEqual(practicesForLesson('estado-formulario').map(item=>item.id));
 expect(estado.skills).toEqual({});
});
it('uma preparação nova lida durante a retomada conserva suas práticas para o terceiro dia',()=>{
 const catalogo={...adaptiveCatalog,preferredLanguage:'html',activities:adaptiveCatalog.activities.filter(atividade=>['estado-formulario','html-dados-formulario'].includes(atividade.lessonId??''))};
 const estado=freshAdaptive(),relogio={now:Date.parse('2026-10-19T12:00:00Z'),timeZone:'UTC'};
 estado.seenConcepts=catalogo.activities.filter(atividade=>atividade.kind==='concept'&&atividade.preparacaoAteBloco===undefined).map(atividade=>atividade.id);
 ensureDailySession(estado,catalogo,relogio);markConceptSeen(estado,idPreparacao('estado-formulario'),relogio);
 const segundoDia={...relogio,now:Date.parse('2026-10-20T12:00:00Z')};
 const segundo=ensureDailySession(estado,catalogo,segundoDia);
 expect(segundo.items.find(item=>item.kind==='concept')?.activityId).toBe(idPreparacao('html-dados-formulario'));
 markConceptSeen(estado,idPreparacao('html-dados-formulario'),segundoDia);
 expect(estado.skills).toEqual({});
 for(const pausa of practicesForLesson('estado-formulario'))expect(recordEvidence(estado,{id:'acerto-'+pausa.id,activityId:pausa.id,assessmentId:pausa.id,skillIds:pausa.skillIds,revision:1,passed:true,assisted:false,attempts:1,hints:0,kind:'practice'},segundoDia).accepted).toBe(true);
 const terceiro=ensureDailySession(estado,catalogo,{...relogio,now:Date.parse('2026-10-21T12:00:00Z')});
 const novas=catalogo.activities.filter(atividade=>atividade.requiredConcepts?.includes(idPreparacao('html-dados-formulario'))).map(atividade=>atividade.id);
 expect(terceiro.items.some(item=>novas.includes(item.activityId))).toBe(true);
 expect(terceiro.items.filter(item=>item.kind==='practice'||item.kind==='challenge').every(item=>novas.includes(item.activityId))).toBe(true);
 expect(new Set(terceiro.items.map(item=>item.activityId)).size).toBe(terceiro.items.length);
});
it('a preparação vista não contorna requisitos ausentes nem libera outro idioma escolhido',()=>{
 const atividades=adaptiveCatalog.activities.filter(atividade=>atividade.lessonId==='estado-formulario');
 const desafio=atividades.find(atividade=>atividade.id==='js-formulario-preservar-estado')!;
 const catalogo={...adaptiveCatalog,preferredLanguage:'html',activities:[...atividades,{...desafio,id:'js-sem-outro-requisito',requiredConcepts:[idPreparacao('estado-formulario'),'preparacao-ausente']},{...desafio,id:'conceito-js-alheio',kind:'concept' as const,requiredConcepts:[idPreparacao('estado-formulario')]}]};
 const estado=freshAdaptive();estado.seenConcepts=atividades.filter(atividade=>atividade.kind==='concept').map(atividade=>atividade.id);
 const relogio={now:Date.parse('2026-10-20T12:00:00Z'),timeZone:'UTC'};
 expect(buildDailySession(estado,catalogo,relogio).items.map(item=>item.activityId)).toContain('js-formulario-preservar-estado');
 expect(buildDailySession(estado,catalogo,relogio).items.map(item=>item.activityId)).not.toContain('js-sem-outro-requisito');
 expect(buildDailySession(estado,catalogo,relogio).items.map(item=>item.activityId)).not.toContain('conceito-js-alheio');
 expect(buildDailySession(estado,{...catalogo,preferredLanguage:'css'},relogio).items).toEqual([]);
});
it('required não equivale à validação da nota normalizada',async()=>{
 expect(await evaluatePractice('html-formulario-prever-validacao',' false\r\nRevisar\r\n3 ')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['true\nRevisar\n3','false\nRevisar|\n0','false\nRevisar\n0','false Revisar 3'])expect((await evaluatePractice('html-formulario-prever-validacao',resposta)).passed).toBe(false);
});
it('o diagnóstico deriva a quantidade do estado sem somar durante renderizações',async()=>{
 for(const resposta of ['cache','acumular','']){
  const resultado=await evaluatePractice('html-formulario-derivar-contagem',resposta);
  expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(getPracticeSolution('html-formulario-derivar-contagem')!);
 }
 expect(await evaluatePractice('html-formulario-derivar-contagem','derivar')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each([
 ['referência',getPracticeSolution('js-formulario-preservar-estado')!],
 ['concat','const inserirNota=(notas,entrada)=>{const texto=entrada.trim();return texto.length>0?notas.concat(texto):notas.slice();};'],
 ['cópia antes de push','function inserirNota(notas,entrada){const proxima=Array.from(notas);const texto=entrada.trim();if(texto)proxima.push(texto);return proxima;}']
])('executa uma solução equivalente: %s',async(_,codigo)=>{
 expect(await evaluatePractice('js-formulario-preservar-estado',codigo)).toMatchObject({passed:true,evidence:'executed',execution:'quickjs',skillIds:['javascript.dom.estado']});
});
it.each([
 ['muta o histórico','function inserirNota(notas,entrada){const texto=entrada.trim();if(texto)notas.push(texto);return notas;}'],
 ['não valida o vazio','function inserirNota(notas,entrada){return [...notas,entrada.trim()];}'],
 ['não normaliza','function inserirNota(notas,entrada){return entrada?[...notas,entrada]:notas;}'],
 ['deduplica sem contrato','function inserirNota(notas,entrada){return [...new Set([...notas,entrada.trim()].filter(Boolean))];}'],
 ['altera notas antigas','function inserirNota(notas,entrada){return [...notas,entrada].map(texto=>texto.trim()).filter(Boolean);}'],
 ['ignora a entrada','function inserirNota(notas){return notas.slice();}'],
 ['resposta fixa','function inserirNota(){return ["Revisar","Ler"];}']
])('o corretor rejeita a implementação defeituosa: %s',async(_,codigo)=>{
 const resultado=await evaluatePractice('js-formulario-preservar-estado',codigo);
 expect(resultado.passed).toBe(false);expect(resultado.evidence).toBe('executed');
 expect(resultado.feedback).not.toContain(getPracticeSolution('js-formulario-preservar-estado')!);
});
