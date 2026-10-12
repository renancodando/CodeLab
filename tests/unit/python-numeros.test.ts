import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import python from '../../src/content/deep/python';

describe('Python: números, unidades e entrada restrita',()=>{
 it.each(['-2 -1\nTrue','-3 2\nFalse','-2 2\nTrue'])('recusa o rastreamento %s sem fornecer a saída',async resposta=>{
  const falha=await evaluatePractice('py-prever-piso-resto',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('menos infinito');
  expect(falha.feedback).not.toContain('-3 2');
  const acerto=await evaluatePractice('py-prever-piso-resto',getPracticeSolution('py-prever-piso-resto')!);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['formato','ultima'])('recusa %s que não garante ambas as invariantes',async resposta=>{
  const falha=await evaluatePractice('py-conservar-centavos',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('diferença máxima');
  expect(falha.feedback).not.toContain('divmod');
  const acerto=await evaluatePractice('py-conservar-centavos','resto');
  expect(acerto.passed).toBe(true);expect(acerto.evidence).toBe('conceptual');
  expect(acerto.execution).toBe('not-run');
 });
 it.each(['"0" <= caractere <= "9"',"'0'<=caractere<='9'",'"0"<= caractere <=\'9\''])('aceita a comparação ASCII %s',async resposta=>{
  const acerto=await evaluatePractice('py-validar-digitos-ascii',resposta);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['caractere.isdigit()','int(caractere) >= 0','"0" < caractere <= "9"','"0" <= caractere < "9"','"0" <= outro <= "9"','"0" <= caractere <= "9" or True','"0" <= caractere <= "9"; executar()'])('recusa a fronteira %s',async resposta=>{
  const falha=await evaluatePractice('py-validar-digitos-ascii',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('ASCII');
  expect(falha.execution).toBe('not-run');
 });
 it('preserva a aula, os problemas independentes e a preparação',()=>{
  const aula=python.lessons.find(aula=>aula.id==='py-numeros-texto')!;
  const atividades=practicesForLesson(aula.id);
  expect(atividades.map(atividade=>atividade.afterBlock)).toEqual([2,3,5]);
  expect(atividades.map(atividade=>atividade.capability)).toEqual(['leitura','depuracao','alteracao']);
  expect(atividades.every(atividade=>atividade.requiresConcept)).toBe(true);
  expect(new Set(atividades.flatMap(atividade=>atividade.skillIds)).size).toBe(3);
  expect(aula.sections).toHaveLength(6);
  expect(aula.code).toContain('Decimal("0.10")');
  expect(aula.solution).toContain('divmod(total, pessoas)');
  expect(aula.practices?.map(problema=>problema.id)).toEqual(['quantidade','unicode']);
 });
});
