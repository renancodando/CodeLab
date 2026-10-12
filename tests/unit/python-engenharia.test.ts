import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';
import python from '../../src/content/deep/python';

describe('Python: contratos, testes e ordem do relatório',()=>{
 it.each(['6\n6','6\nTypeError','TypeError'])('recusa a previsão %s sem confundir execução e verificação estática',async resposta=>{
  const falha=await evaluatePractice('py-prever-anotacao',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('outra etapa');
  expect(falha.feedback).not.toContain('33');
  const acerto=await evaluatePractice('py-prever-anotacao','6\n33');
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['sem-chamada','confirma-bug'])('recusa %s que deixa o programa quebrado passar',async resposta=>{
  const falha=await evaluatePractice('py-testar-excecao-vazia',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('codifica o erro');
  expect(falha.feedback).not.toContain('with self.assertRaises');
  const acerto=await evaluatePractice('py-testar-excecao-vazia','contexto');
  expect(acerto.passed).toBe(true);expect(acerto.evidence).toBe('conceptual');
 });
 it.each(['valor not in vistos','not (valor in vistos)','not(valor in vistos)'])('aceita a condição equivalente %s',async resposta=>{
  const acerto=await evaluatePractice('py-preservar-primeira-ordem',resposta);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['valor in vistos','valor not in resultado','sorted(vistos)','valor not in vistos: executar()'])('recusa %s que muda a alteração solicitada',async resposta=>{
  const falha=await evaluatePractice('py-preservar-primeira-ordem',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('ordem solicitada');
 });
 it('preserva a aula e faz o gabarito executar seus testes',()=>{
  const aula=python.lessons.find(a=>a.id==='py-engenharia')!;
  const atividades=practicesForLesson(aula.id);
  expect(atividades.map(a=>a.afterBlock)).toEqual([3,4,5]);
  expect(atividades.map(a=>a.capability)).toEqual(['leitura','depuracao','alteracao']);
  expect(atividades.every(a=>a.requiresConcept)).toBe(true);
  expect(python.lessons.every(a=>practicesForLesson(a.id).length>0)).toBe(true);
  expect(aula.sections).toHaveLength(6);expect(aula.code).toContain('unittest.main()');
  expect(aula.solution).toContain('math.fsum(dados)');expect(aula.solution).toContain('unittest.main()');
  expect(aula.solution).toContain('math.nan, math.inf, -math.inf');expect(aula.project).toContain('pyproject.toml');
 });
});
