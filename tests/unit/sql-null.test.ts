import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import sql from '../../src/content/deep/sql';

describe('ausência, integridade e correspondência SQL',()=>{
 it.each(['1|true\n2|false\n3|true','1|false\n2|false\n3|true','3|true'])('não confunde comparação exibida com filtro: %s',async resposta=>{
  const falha=await evaluatePractice('sql-prever-desconhecido',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('desconhecido');
  const correta=await evaluatePractice('sql-prever-desconhecido',getPracticeSolution('sql-prever-desconhecido')!);
  expect(correta.passed).toBe(true);expect(correta.evidence).toBe('conceptual');expect(correta.execution).toBe('not-run');
 });
 it.each(['somente-presenca','substituir-ausencia'])('a regra %s não cumpre presença e faixa',async resposta=>{
  const falha=await evaluatePractice('sql-corrigir-obrigatoriedade',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('CHECK aceita');
  expect(falha.feedback).not.toContain('CREATE TEMP TABLE');
  expect((await evaluatePractice('sql-corrigir-obrigatoriedade','presenca-faixa')).passed).toBe(true);
 });
 it.each(['=','IS DISTINCT FROM','ISNOTDISTINCTFROM','IS NOT DISTINCT FROM OR true'])('rejeita uma correspondência fora do contrato: %s',async resposta=>{
  const falha=await evaluatePractice('sql-correlacionar-ausentes',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('duas ausências');
 });
 it.each(['IS NOT DISTINCT FROM',' is  not distinct from ','Is\tNot DISTINCT\nFROM'])('aceita as palavras SQL sem exigir capitalização: %s',async resposta=>{
  const correta=await evaluatePractice('sql-correlacionar-ausentes',resposta);
  expect(correta.passed).toBe(true);expect(correta.execution).toBe('not-run');
 });
 it('distribui habilidades distintas depois da preparação e conserva os problemas independentes',()=>{
  const aula=sql.lessons.find(aula=>aula.id==='sql-null-logica')!;
  const todas=practicesForLesson(aula.id);
  expect(todas.map(pausa=>pausa.id)).toContain('sql-null-filtro');
  const pausas=todas.filter(pausa=>pausa.requiresConcept);
  expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([2,4,5]);
  expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);
  expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);
  expect(aula.sections[1].text.join(' ')).toContain('::text');
  expect(aula.sections[3].text.join(' ')).toContain('Capture apenas');
  expect(aula.sections[4].text.join(' ')).toContain('Bloqueios duplicados');
  expect(aula.practices?.map(problema=>problema.id)).toEqual(['exclusao','obrigatorio']);
 });
});
