import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog,idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive,buildDailySession} from '../../src/learning/adaptive';

it('animações conserva capítulos e projeto, com preparação das duas habilidades',()=>{
 const aula=lessons.find(item=>item.id==='animacoes')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);
 expect(pausas.map(item=>item.afterBlock)).toEqual([3,6]);
 expect(aula.capitulos.find(item=>item.id==='projeto')?.paragrafos.join(' ')).toContain('lista de tarefas');
 const estado=freshAdaptive(),preparacao=idPreparacao(aula.id);
 estado.seenConcepts=adaptiveCatalog.activities.filter(item=>item.kind==='concept'&&item.id!==preparacao).map(item=>item.id);
 expect(buildDailySession(estado,{...adaptiveCatalog,preferredLanguage:'css'},{now:Date.parse('2026-10-16T12:00:00Z'),timeZone:'UTC'}).items.map(item=>item.activityId)).toEqual([preparacao,...pausas.map(item=>item.id)]);
 expect(estado.skills).toEqual({});
 expect(adaptiveCatalog.skills.find(item=>item.id==='css.movimento.reducao')?.path).toEqual(['CSS','Movimento','Redução de movimento']);
});
it('a previsão exige instantes distintos e confere o contrato sem alegar execução',async()=>{
 for(const resposta of ['20px\n80px',' 20px\r\n80px '])expect(await evaluatePractice('css-prever-transicao',resposta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
 for(const resposta of ['80px\n80px','20px','80px\n20px','20px 80px','20px\n80px\n80px'])expect((await evaluatePractice('css-prever-transicao',resposta)).passed).toBe(false);
});
it('o diagnóstico distingue remover a animação de congelar ou ocultar o selo',async()=>{
 for(const resposta of ['pausar','ocultar','', 'remover;visibility:hidden']){
  const resultado=await evaluatePractice('css-diagnosticar-movimento',resposta);
  expect(resultado.passed).toBe(false);
  expect(resultado.feedback).not.toContain(getPracticeSolution('css-diagnosticar-movimento')!);
 }
 expect(await evaluatePractice('css-diagnosticar-movimento','remover')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run',skillIds:['css.movimento.reducao'],capability:'depuracao'});
});
