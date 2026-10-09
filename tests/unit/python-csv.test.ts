import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';
import python from '../../src/content/deep/python';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {buildDailySession,freshAdaptive} from '../../src/learning/adaptive';

describe('CSV: sintaxe, contrato e destino preservado',()=>{
 it.each(['3\n2\n2','2\n2\n2','2\n2\n4'])('rejeita a previsão %s sem executar Python',async resposta=>{
  const falha=await evaluatePractice('py-csv-prever-registro',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).not.toContain('2\n2\n3');
  const correta=await evaluatePractice('py-csv-prever-registro','2\n2\n3');
  expect(correta.passed).toBe(true);expect(correta.evidence).toBe('conceptual');expect(correta.execution).toBe('not-run');
 });
 it.each(['conjunto','preencher'])('rejeita %s ao investigar cabeçalho duplicado',async resposta=>{
  expect((await evaluatePractice('py-csv-cabecalho',resposta)).passed).toBe(false);
  expect((await evaluatePractice('py-csv-cabecalho','sequencia')).passed).toBe(true);
 });
 it('rejeita gravação antes da validação completa e conserva a ordem dos blocos',async()=>{
  const ordem=['funcao','lote','percorrer','validar','acumular','gravar','retornar'];
  expect((await evaluatePractice('py-csv-lote',ordem)).passed).toBe(true);
  for(const incorreta of [ordem.slice(0,-1),['funcao','lote','percorrer','gravar','validar','acumular','retornar'],['funcao','lote','percorrer','acumular','validar','gravar','retornar']]){
   const falha=await evaluatePractice('py-csv-lote',incorreta);expect(falha.passed).toBe(false);expect(falha.feedback).toContain('destino');
  }
 });
 it('ensina cada mecanismo antes da pausa e exige preparação na sessão diária',()=>{
  const aula=python.lessons.find(aula=>aula.id==='py-biblioteca-dados')!;
  const pausas=practicesForLesson(aula.id).filter(pausa=>pausa.id.startsWith('py-csv-'));
  expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,4,5]);
  expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','aplicacao']);
  expect(aula.sections[2].text.join(' ')).toContain('line_num');
  expect(aula.sections[3].text.join(' ')).toContain('fieldnames');
  expect(aula.sections[4].text.join(' ')).toContain('destino');
  expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);
  const plano=buildDailySession(freshAdaptive(),{...adaptiveCatalog,preferredLanguage:'python'},{now:Date.parse('2026-10-09T12:00:00Z'),timeZone:'UTC'});
  expect(plano.items.some(item=>pausas.some(pausa=>pausa.id===item.activityId))).toBe(false);
 });
});
