import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';
import cpp from '../../src/content/deep/cpp';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {buildDailySession,freshAdaptive} from '../../src/learning/adaptive';

describe('requisitos e sobrecargas C++20',()=>{
 it.each(['std::integral<T>;','requires true;','requires std::integral<double>;'])('rejeita %s como contrato integral dependente de T',async resposta=>{
  const falha=await evaluatePractice('cpp-requisito-verdadeiro',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('condição dependente de T');
  const correta=await evaluatePractice('cpp-requisito-verdadeiro','requires std::integral<T>;');
  expect(correta.passed).toBe(true);expect(correta.evidence).toBe('conceptual');expect(correta.execution).toBe('not-run');
 });
 it.each(['','consteval','true'])('rejeita %s para descartar o ramo dependente incompatível',async resposta=>{
  expect((await evaluatePractice('cpp-ramo-descartado',resposta)).passed).toBe(false);
  expect((await evaluatePractice('cpp-ramo-descartado','constexpr')).passed).toBe(true);
 });
 it.each(['fixo\nreserva','fixo\nfixo','reserva\nreserva'])('rejeita a escolha %s sem inventar execução C++',async resposta=>{
  expect((await evaluatePractice('cpp-prever-sobrecarga',resposta)).passed).toBe(false);
  const correta=await evaluatePractice('cpp-prever-sobrecarga','reserva\nfixo');
  expect(correta.passed).toBe(true);expect(correta.execution).toBe('not-run');
 });
 it('ensina os requisitos antes das pausas e mantém fundamentos na primeira sessão',()=>{
  const aula=cpp.lessons.find(aula=>aula.id==='cpp-templates')!;
  const pausas=practicesForLesson(aula.id);
  expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,4,5]);
  expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);
  expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);
  expect(aula.sections[2].text.join(' ')).toContain('requisito simples');
  expect(aula.sections[3].text.join(' ')).toContain('quantidade(7)');
  expect(aula.sections[4].text.join(' ')).toContain('ComTamanho<T>');
  const plano=buildDailySession(freshAdaptive(),{...adaptiveCatalog,preferredLanguage:'cpp'},{now:Date.parse('2026-10-09T16:00:00Z'),timeZone:'UTC'});
  expect(plano.items.some(item=>pausas.some(pausa=>pausa.id===item.activityId))).toBe(false);
 });
});
