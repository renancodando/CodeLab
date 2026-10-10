import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import css from '../../src/content/deep/css';

describe('caixas CSS: fronteiras, mínimo e rolagem',()=>{
 it.each(['120\n120\n20','150\n120\n20','150\n150\n30'])('rejeita a previsão %s sem entregar a conta completa',async resposta=>{
  const falha=await evaluatePractice('css-prever-bordas',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('piso zero');
  expect(falha.feedback).not.toContain('150\n120');
  const acerto=await evaluatePractice('css-prever-bordas',getPracticeSolution('css-prever-bordas')!);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['auto','min-content','100%','1fr','0; overflow:hidden'])('não aceita %s como mínimo zero do item',async resposta=>{
  const falha=await evaluatePractice('css-reduzir-minimo',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('encolher');
 });
 it.each(['0','0px'])('aceita o zero no formato solicitado: %s',async resposta=>{
  const acerto=await evaluatePractice('css-reduzir-minimo',resposta);
  expect(acerto.passed).toBe(true);expect(acerto.evidence).toBe('conceptual');
 });
 it.each(['relativo','absoluto'])('rejeita %s como posição aderente no fluxo',async resposta=>{
  const falha=await evaluatePractice('css-corrigir-rolagem',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).not.toContain('sticky');
  expect((await evaluatePractice('css-corrigir-rolagem','aderir')).passed).toBe(true);
 });
 it('leva três pausas próprias a uma aula preservada com problemas independentes',()=>{
  const aula=css.lessons.find(aula=>aula.id==='css-caixas-intrinseco')!;
  const atividades=practicesForLesson(aula.id);
  expect(atividades.map(atividade=>atividade.afterBlock)).toEqual([1,3,5]);
  expect(atividades.every(atividade=>atividade.requiresConcept)).toBe(true);
  expect(new Set(atividades.flatMap(atividade=>atividade.skillIds)).size).toBe(3);
  expect(aula.sections).toHaveLength(6);expect(aula.practices).toHaveLength(2);
  expect(aula.solution).toContain('overflow-wrap:anywhere');
  expect(aula.sections[2].text.join(' ')).toContain('break-word');
 });
});
