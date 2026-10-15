import {it, expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice, getPracticeSolution} from '../../src/learning/practice';
import {adaptiveCatalog, idPreparacao} from '../../src/learning/hub-catalog';
import {freshAdaptive, buildDailySession} from '../../src/learning/adaptive';

it.each(['cascata', 'box-model'])('%s mantém teoria, aplicação e preparação antes das práticas', aula => {
 const original = lessons.find(item => item.id === aula)!;
 const pausas = practicesForLesson(aula);
 expect(original.capitulos).toHaveLength(12);
 expect(pausas.map(item => item.afterBlock)).toEqual(aula === 'cascata' ? [3, 6] : [3, 6, 8]);
 expect(original.capitulos.find(item => item.id === 'projeto')?.paragrafos.join(' '))
  .toContain(aula === 'cascata' ? 'sistema de tokens' : 'cartão editorial');
 const estado = freshAdaptive();
 const preparacao = idPreparacao(aula);
 estado.seenConcepts = adaptiveCatalog.activities.filter(item => item.kind === 'concept' && item.id !== preparacao).map(item => item.id);
 const sessao = buildDailySession(estado, {...adaptiveCatalog, preferredLanguage:'css'}, {now:Date.parse('2026-10-14T12:00:00Z'), timeZone:'UTC'});
 expect(sessao.items.map(item => item.activityId)).toEqual([preparacao, ...pausas.map(item => item.id)]);
 expect(estado.skills).toEqual({});
});
it.each([
 ['css-prever-seletores', '18px\n24px', ['24px\n24px', '18px\n22px', '24px\n18px', '18px']],
 ['css-prever-unidades', '40px\n60px', ['60px\n60px', '40px\n40px', '32px\n60px', '60px\n40px']]
] as const)('%s exige as duas medidas e mantém a natureza conceitual', async (id, correta, erradas) => {
 for (const errada of erradas) expect((await evaluatePractice(id, errada)).passed).toBe(false);
 expect(await evaluatePractice(id, '\n' + correta.replace(/\n/g, '\r\n') + '\n')).toMatchObject({passed:true, evidence:'conceptual', execution:'not-run'});
});
it.each([
 ['css-diagnosticar-token', 'comprimento', ['fallback', 'anterior']],
 ['css-diagnosticar-entrelinha', 'fator', ['percentual', 'fixar']]
] as const)('%s distingue a causa das alterações que conservam o defeito', async (id, correta, erradas) => {
 for (const errada of erradas) {
  const resultado = await evaluatePractice(id, errada);
  expect(resultado.passed).toBe(false);
  expect(resultado.feedback).not.toContain(getPracticeSolution(id)!);
 }
 expect(await evaluatePractice(id, correta)).toMatchObject({passed:true, evidence:'conceptual', execution:'not-run'});
});
it.each(['inherit', 'INHERIT', '  InHeRiT\r\n'])('o valor CSS %j acompanha a escolha local do pai', async resposta => {
 expect(await evaluatePractice('css-herdar-caixa', resposta)).toMatchObject({passed:true, evidence:'conceptual', execution:'not-run'});
});
it.each(['border-box', 'content-box', 'initial', 'unset', 'auto', '', 'inherit inherit', 'inherit; color:red'])('o valor %j não atende ao contrato de herança', async resposta => {
 expect((await evaluatePractice('css-herdar-caixa', resposta)).passed).toBe(false);
});
