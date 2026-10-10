import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import cpp from '../../src/content/deep/cpp';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {buildDailySession,freshAdaptive} from '../../src/learning/adaptive';

describe('C++: vida do objeto e contrato de posse',()=>{
 it.each(['copiar','mover-valor'])('recusa %s como transferência do dono constante',async resposta=>{
  const falha=await evaluatePractice('cpp-mover-constante',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('conserva const');
  expect(falha.feedback).not.toContain('auto origem =');
  const acerto=await evaluatePractice('cpp-mover-constante','mutavel');
  expect(acerto.passed).toBe(true);expect(acerto.evidence).toBe('conceptual');expect(acerto.execution).toBe('not-run');
 });
 it.each(['true 7\ntrue false','false 7\nfalse true','false 7\ntrue true'])('recusa a previsão %s sem inventar execução',async resposta=>{
  const falha=await evaluatePractice('cpp-prever-posse-temporaria',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('outro dono');
  expect(falha.feedback).not.toContain('false 7');
  const acerto=await evaluatePractice('cpp-prever-posse-temporaria',getPracticeSolution('cpp-prever-posse-temporaria')!);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['std::string_view','const std::string&','std::string&&','auto','const char*'])('recusa %s no contrato de retorno explícito com posse',async resposta=>{
  const falha=await evaluatePractice('cpp-devolver-texto-dono',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('válido e mutável');
  const acerto=await evaluatePractice('cpp-devolver-texto-dono','std::string');
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it('liga as pausas aos mecanismos ensinados sem substituir a prática existente',()=>{
  const aula=cpp.lessons.find(aula=>aula.id==='cpp-memoria-posse')!;
  const existentes=practicesForLesson(aula.id);
  expect(existentes.some(pausa=>pausa.id==='cpp-iterador-invalidado'&&pausa.afterBlock===5)).toBe(true);
  const pausas=existentes.filter(pausa=>pausa.id!=='cpp-iterador-invalidado');
  expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([2,3,4]);
  expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);
  expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);
  expect(aula.sections[1].text.join(' ')).toContain('não retira const');
  expect(aula.sections[2].text.join(' ')).toContain('não sincroniza');
  expect(aula.sections[3].text.join(' ')).toContain('vazios, curtos e longos');
  expect(aula.exercise).toContain('optional<size_t>');expect(aula.solution).toContain('std::nullopt');
  expect(aula.bugCode).toContain('std::string_view nome');expect(aula.project).toContain('árvore');
  const plano=buildDailySession(freshAdaptive(),{...adaptiveCatalog,preferredLanguage:'cpp'},{now:Date.parse('2026-10-10T20:00:00Z'),timeZone:'UTC'});
  expect(plano.items.some(item=>pausas.some(pausa=>pausa.id===item.activityId))).toBe(false);
 });
});
