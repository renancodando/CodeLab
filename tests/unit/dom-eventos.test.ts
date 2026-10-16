import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

it('eventos conserva a aula HTML/DOM, o projeto dinâmico e a preparação específica',()=>{
 const aula=lessons.find(item=>item.id==='eventos')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(pausas.map(item=>item.afterBlock)).toEqual([3,6]);
 expect(pausas.every(item=>item.language==='html'&&item.requiresConcept)).toBe(true);
 expect(aula.capitulos.find(item=>item.id==='projeto')?.paragrafos.join(' ')).toContain('lista dinâmica');
 const estado=freshAdaptive(),preparacao=idPreparacao(aula.id);
 estado.seenConcepts=adaptiveCatalog.activities.filter(item=>item.kind==='concept'&&item.id!==preparacao).map(item=>item.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'html'},{now:Date.parse('2026-10-16T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([preparacao,...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('a previsão distingue alvo, local do listener e cancelamento da ação padrão',async()=>{
 expect(await evaluatePractice('html-eventos-prever-propagacao',' rotulo\r\npainel\r\ntrue ')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['acao\npainel\ntrue','painel\npainel\ntrue','rotulo\npainel\nfalse','rotulo\npainel','rotulo painel true'])expect((await evaluatePractice('html-eventos-prever-propagacao',resposta)).passed).toBe(false);
});
it('a delegação exige conteúdo interno e fronteira antes de registrar uma ação',async()=>{
 for(const resposta of ['direto','ancestral','']){
  const resultado=await evaluatePractice('html-eventos-limitar-delegacao',resposta);
  expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(getPracticeSolution('html-eventos-limitar-delegacao')!);
 }
 expect(await evaluatePractice('html-eventos-limitar-delegacao','fronteira')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run',skillIds:['html.dom.delegacao'],capability:'depuracao'});
});
