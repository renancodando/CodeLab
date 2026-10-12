import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';
import python from '../../src/content/deep/python';

describe('Python: início, cancelamento e pressão de trabalho',()=>{
 it.each(["['executou']\n4\n['executou']","[]\n4\n[]"])('recusa a previsão %s sem entregar a lista',async resposta=>{
  const falha=await evaluatePractice('py-prever-corrotina',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('não agenda');
  expect(falha.feedback).not.toContain("['executou']");
  const acerto=await evaluatePractice('py-prever-corrotina',"[]\n4\n['executou']");
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['falso','ignorar'])('recusa %s que perde o cancelamento',async resposta=>{
  const falha=await evaluatePractice('py-propagar-cancelamento',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('término normal');
  expect(falha.feedback).not.toContain('raise');
  const acerto=await evaluatePractice('py-propagar-cancelamento','propagar');
  expect(acerto.passed).toBe(true);expect(acerto.evidence).toBe('conceptual');
 });
 it.each(['await fila.put(item)','await fila . put ( item )'])('aceita o envio %s',async resposta=>{
  const acerto=await evaluatePractice('py-esperar-vaga-fila',resposta);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['fila.put(item)','fila.put_nowait(item)','await fila.get()','asyncio.create_task(fila.put(item))','await fila.put(outro)','await fila.put(item); executar()'])('recusa %s que muda o contrato',async resposta=>{
  const falha=await evaluatePractice('py-esperar-vaga-fila',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('esperar a vaga');
 });
 it('mantém exemplo, exercício e projeto da aula',()=>{
  const aula=python.lessons.find(a=>a.id==='py-concorrencia')!;
  const atividades=practicesForLesson(aula.id);
  expect(atividades.map(a=>a.afterBlock)).toEqual([2,3,4]);
  expect(atividades.map(a=>a.capability)).toEqual(['leitura','depuracao','alteracao']);
  expect(atividades.every(a=>a.requiresConcept)).toBe(true);
  expect(aula.sections).toHaveLength(6);expect(aula.code).toContain('asyncio.TaskGroup()');
  expect(aula.solution).toContain('asyncio.Semaphore(limite)');
  expect(aula.exercise).toContain('mapear_limitado');expect(aula.project).toContain('cancelamento');
 });
});
