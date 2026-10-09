import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';
import typescript from '../../src/content/deep/typescript';
import {adaptiveCatalog} from '../../src/learning/hub-catalog';
import {buildDailySession,freshAdaptive} from '../../src/learning/adaptive';

describe('módulos TypeScript no host de destino',()=>{
 it.each(['./calculo','./calculo.ts','@dominio/calculo'])('rejeita %s no contrato ESM direto sem loader',async resposta=>{
  const falha=await evaluatePractice('ts-import-extensao',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('emitido');
  const correta=await evaluatePractice('ts-import-extensao','./calculo.js');
  expect(correta.passed).toBe(true);expect(correta.evidence).toBe('conceptual');expect(correta.execution).toBe('not-run');
 });
 it.each(['paths','declarar'])('rejeita %s sem inventar resolução de pacote no Node',async resposta=>{
  expect((await evaluatePractice('ts-alias-emitido',resposta)).passed).toBe(false);
  expect((await evaluatePractice('ts-alias-emitido','relativo')).passed).toBe(true);
 });
 it.each(['contratos\n2','2\ncontratos'])('não executa efeitos do import apagado: %s',async resposta=>{
  const falha=await evaluatePractice('ts-import-tipo-efeito',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('apenas de tipo');
  expect((await evaluatePractice('ts-import-tipo-efeito','2')).passed).toBe(true);
 });
 it('prepara resolução, alias e efeitos antes das pausas e não os antecipa na sessão inicial',()=>{
  const aula=typescript.lessons.find(aula=>aula.id==='ts-modulos-configuracao')!;
  const pausas=practicesForLesson(aula.id);
  expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([2,3,5]);
  expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);
  expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);
  expect(aula.sections[1].text.join(' ')).toContain('TS2835');
  expect(aula.sections[2].text.join(' ')).toContain('dist/entrada.js');
  expect(aula.sections[3].text.join(' ')).toContain("import './contratos.js'");
  const plano=buildDailySession(freshAdaptive(),{...adaptiveCatalog,preferredLanguage:'typescript'},{now:Date.parse('2026-10-09T16:00:00Z'),timeZone:'UTC'});
  expect(plano.items.some(item=>pausas.some(pausa=>pausa.id===item.activityId))).toBe(false);
 });
});
