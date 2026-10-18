import {it,expect} from 'vitest';
import css from '../../src/content/deep/css';
import {materialize} from '../../src/content/deep/types';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

it('caixas conserva teoria, exercício e projeto, com preparação própria de fluxo e camadas',()=>{
 const entrada=css.lessons.find(item=>item.id==='css-caixas')!,aula=materialize(css,entrada),pausas=practicesForLesson(aula.id);
 expect(entrada.sections).toHaveLength(6);expect(aula.capitulos).toHaveLength(13);
 expect(entrada.exercise).toContain('aviso');expect(entrada.project).toContain('três caixas');
 expect(pausas.map(item=>item.afterBlock)).toEqual([4,6]);expect(pausas.every(item=>item.requiresConcept&&item.language==='css')).toBe(true);
 expect(entrada.sections[3].text.join(' ')).toContain('não impede esse colapso entre os irmãos');
 expect(entrada.sections[5].text.join(' ')).toContain('contexto de empilhamento');
 const estado=freshAdaptive(),preparacao=idPreparacao(aula.id);
 estado.seenConcepts=adaptiveCatalog.activities.filter(item=>item.kind==='concept'&&item.id!==preparacao).map(item=>item.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'css'},{now:Date.parse('2026-10-16T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([preparacao,...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
});
it('a previsão distingue colapso entre irmãos e margens de itens flex',async()=>{
 for(const resposta of [' 30px\r\n50px ','30.00PX\n5e1px'])expect(await evaluatePractice('css-fluxo-prever-margens',resposta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['50px\n50px','30px\n30px','50px\n30px','30px','30px 50px','30.px\n50px','30px\n50px;display:none','30px\nInfinitypx'])expect((await evaluatePractice('css-fluxo-prever-margens',resposta)).passed).toBe(false);
});
it('a ordem dos contextos não é substituída por um número no descendente',async()=>{
 for(const resposta of ['numero','fixo','']){
  const resultado=await evaluatePractice('css-fluxo-diagnosticar-camadas',resposta);
  expect(resultado.passed).toBe(false);expect(resultado.feedback).not.toContain(getPracticeSolution('css-fluxo-diagnosticar-camadas')!);
 }
 expect(await evaluatePractice('css-fluxo-diagnosticar-camadas','painel')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run',skillIds:['css.caixas.empilhamento'],capability:'depuracao'});
});
