import {describe, expect, it} from 'vitest';
import {resolveLesson} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';

describe('contexto de componentes CSS', () => {
 it('oferece aula própria e três pausas com preparação conceitual', async () => {
  const aula = await resolveLesson('css-containers-contexto');
  expect(aula?.capitulos).toHaveLength(17);
  const atividades = practicesForLesson('css-containers-contexto');
  expect(atividades.map(atividade => atividade.afterBlock)).toEqual([1,3,5]);
  expect(atividades.every(atividade => atividade.requiresConcept)).toBe(true);
  expect(atividades.map(atividade => atividade.capability)).toEqual(['leitura','depuracao','alteracao']);
 });
 it.each([
  ['css-prever-contexto','amplo\n60','amplo\n22'],
  ['css-corrigir-ancestral','viewport','envolver'],
  ['css-completar-limite','width > 480px','min-width: 480px']
 ])('%s distingue falha real da decisão correta sem afirmar execução', async (id, errada, correta) => {
  const falha = await evaluatePractice(id,errada);
  expect(falha.passed).toBe(false);
  expect(falha.feedback).not.toContain(correta);
  const resultado = await evaluatePractice(id,correta);
  expect(resultado.passed).toBe(true);
  expect(resultado.evidence).toBe('conceptual');
  expect(resultado.execution).toBe('not-run');
 });
});
