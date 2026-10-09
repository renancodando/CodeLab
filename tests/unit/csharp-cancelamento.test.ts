import {describe, expect, it} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice, getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {buildDailySession, freshAdaptive} from '../../src/learning/adaptive';

describe('prática C# de cancelamento e recursos', () => {
 it.each([
  ['cs-prever-cancelamento','cancelado\n0','cancelado\n1'],
  ['cs-vaga-sem-posse','duplicar','adquirir'],
  ['cs-token-vinculado','usuario.Token','vinculada.Token'],
  ['cs-token-vinculado','aplicacao.Token','vinculada.Token'],
  ['cs-token-vinculado','CancellationToken.None','vinculada.Token']
 ])('%s rejeita raciocínio incorreto sem fingir execução .NET', async (id, errada, correta) => {
  const falha = await evaluatePractice(id,errada);
  expect(falha.passed).toBe(false);
  expect(falha.feedback).not.toContain(getPracticeSolution(id)!);
  const resultado = await evaluatePractice(id,correta);
  expect(resultado.passed).toBe(true);
  expect(resultado.evidence).toBe('conceptual');
  expect(resultado.execution).toBe('not-run');
 });
 it('liga as pausas aos conceitos que já foram explicados', () => {
  const novas = practicesForLesson('cs-assincrono-recursos').filter(atividade => atividade.requiresConcept);
  expect(novas.map(atividade => atividade.afterBlock)).toEqual([3,4,5]);
  expect(novas.map(atividade => atividade.capability)).toEqual(['leitura','depuracao','alteracao']);
  const plano = buildDailySession(freshAdaptive(),{...adaptiveCatalog,preferredLanguage:'csharp'},{now:Date.parse('2026-10-08T12:00:00Z'),timeZone:'UTC'});
  expect(plano.items.some(item => novas.some(atividade => atividade.id === item.activityId))).toBe(false);
 });
});
