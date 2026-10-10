import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import csharp from '../../src/content/deep/csharp';

describe('iteradores C#: avanço, descarte e materialização',()=>{
 it.each([
  '3\nTrue\n1|1\nTrue\n2|2\n3',
  '0\nTrue\n1|1\nTrue\n2|2\n3',
  '0\nTrue\n1|1\nTrue\n1|2\n2'
 ])('distingue construção, posição e produção: %s',async resposta=>{
  const falha=await evaluatePractice('cs-prever-percurso',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('MoveNext');
  expect(falha.feedback).not.toContain('0\nTrue\n1|1');
  const acerto=await evaluatePractice('cs-prever-percurso',getPracticeSolution('cs-prever-percurso')!);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['continuar','coletar'])('não aceita %s como liberação determinística e limitada',async resposta=>{
  const falha=await evaluatePractice('cs-descartar-percurso',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('Processar falha');
  expect(falha.feedback).not.toContain('using (');
  const acerto=await evaluatePractice('cs-descartar-percurso','delimitar');
  expect(acerto.passed).toBe(true);expect(acerto.evidence).toBe('conceptual');
 });
 it.each(['ToArray()','ToList()','ToArray ( )','ToList(\n)'])('aceita a materialização equivalente %s',async resposta=>{
  const acerto=await evaluatePractice('cs-materializar-consulta',resposta);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['AsEnumerable()','GetEnumerator()','ToArray','ToArray(1)','toarray()','ToArray(); executar()'])('rejeita %s sem confundir decisão com compilação',async resposta=>{
  const falha=await evaluatePractice('cs-materializar-consulta',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('segunda enumeração');
  expect(falha.evidence).toBe('conceptual');expect(falha.execution).toBe('not-run');
 });
 it('insere pausas preparadas sem remover os dois problemas independentes',()=>{
  const aula=csharp.lessons.find(aula=>aula.id==='cs-iteradores-descarte')!;
  const atividades=practicesForLesson(aula.id).filter(atividade=>atividade.requiresConcept);
  expect(atividades.map(atividade=>atividade.afterBlock)).toEqual([2,3,5]);
  expect(atividades.map(atividade=>atividade.capability)).toEqual(['leitura','depuracao','alteracao']);
  expect(atividades.every(atividade=>atividade.requiresConcept)).toBe(true);
  expect(new Set(atividades.flatMap(atividade=>atividade.skillIds)).size).toBe(3);
  expect(aula.sections).toHaveLength(6);expect(aula.practices).toHaveLength(2);
  expect(aula.sections[2].text.join(' ')).toContain('por exceção');
  expect(aula.sections[4].text.join(' ')).toContain('fonte infinita');
  expect(aula.solution).toContain('ArgumentNullException.ThrowIfNull');
  expect(practicesForLesson(aula.id).some(atividade=>atividade.id==='cs-ordenar-using')).toBe(true);
 });
});
