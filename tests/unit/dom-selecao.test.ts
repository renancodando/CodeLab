import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

it('seleção conserva a aula HTML/DOM e prepara suas práticas sem gerar domínio pela leitura',()=>{
 const aula=lessons.find(item=>item.id==='selecionar')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);
 expect(pausas.map(item=>item.afterBlock)).toEqual([3,6]);
 expect(pausas.every(item=>item.language==='html'&&item.requiresConcept)).toBe(true);
 expect(aula.capitulos.find(item=>item.id==='projeto')?.paragrafos.join(' ')).toContain('contador');
 const estado=freshAdaptive(),preparacao=idPreparacao(aula.id);
 estado.seenConcepts=adaptiveCatalog.activities.filter(item=>item.kind==='concept'&&item.id!==preparacao).map(item=>item.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'html'},{now:Date.parse('2026-10-16T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([preparacao,...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('a previsão distingue escopo, lista estática e nova consulta',async()=>{
 expect(await evaluatePractice('html-dom-prever-selecao',' Ana\r\n1\r\n2 ')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['Bia\n1\n2','Ana\n2\n2','Ana\n1\n1','Ana\n1','Ana 1 2'])expect((await evaluatePractice('html-dom-prever-selecao',resposta)).passed).toBe(false);
});
it('a atualização exige texto literal, escopo local e preservação de controles e classes',async()=>{
 for(const resposta of ['painel','marcacao','classes','']){
  const resultado=await evaluatePractice('html-dom-atualizar-texto',resposta);
  expect(resultado.passed).toBe(false);
  expect(resultado.feedback).not.toContain(getPracticeSolution('html-dom-atualizar-texto')!);
 }
 expect(await evaluatePractice('html-dom-atualizar-texto','local')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run',skillIds:['html.dom.atualizacao'],capability:'depuracao'});
});
