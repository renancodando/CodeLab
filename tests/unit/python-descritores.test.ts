import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import python from '../../src/content/deep/python';

describe('descritores Python: precedência, armazenamento e acesso',()=>{
 it.each(['calculado\n10\nTrue','guardado\n99\nTrue','guardado\n10\nFalse'])('recusa a previsão %s com uma pista sobre busca de atributos',async resposta=>{
  const falha=await evaluatePractice('py-prever-atributo',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('precedência');
  expect(falha.feedback).not.toContain('guardado\n10');
  const acerto=await evaluatePractice('py-prever-atributo',getPracticeSolution('py-prever-atributo')!);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['compartilhar','reatribuir'])('recusa %s sem entregar o acesso ao dicionário',async resposta=>{
  const falha=await evaluatePractice('py-isolar-descritor',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('armazenamento próprio');
  expect(falha.feedback).not.toContain('__dict__');
  const acerto=await evaluatePractice('py-isolar-descritor','separar');
  expect(acerto.passed).toBe(true);expect(acerto.evidence).toBe('conceptual');
 });
 it.each(['instancia is None','None is instancia'])('aceita identidade equivalente: %s',async resposta=>{
  const acerto=await evaluatePractice('py-acessar-classe',resposta);
  expect(acerto.passed).toBe(true);expect(acerto.execution).toBe('not-run');
 });
 it.each(['not instancia','instancia == None','instancia is False','instancia is not None','instancia is None: executar()'])('recusa a guarda %s',async resposta=>{
  const falha=await evaluatePractice('py-acessar-classe',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('redefinir igualdade');
  expect(falha.execution).toBe('not-run');
 });
 it('preserva exemplos, problemas e preparação da aula de objetos',()=>{
  const aula=python.lessons.find(aula=>aula.id==='py-objetos-protocolos')!;
  const atividades=practicesForLesson(aula.id);
  expect(atividades.map(atividade=>atividade.afterBlock)).toEqual([3,4,5]);
  expect(atividades.map(atividade=>atividade.capability)).toEqual(['leitura','depuracao','alteracao']);
  expect(atividades.every(atividade=>atividade.requiresConcept)).toBe(true);
  expect(new Set(atividades.flatMap(atividade=>atividade.skillIds)).size).toBe(3);
  expect(aula.sections).toHaveLength(6);
  expect(aula.exercise).toContain('Implemente uma classe Retangulo');
  expect(aula.solution).toContain('Quadro(Retangulo(3, 4))');
  expect(aula.code).toContain('field(default_factory=list)');
  expect(aula.sections[2].text.join(' ')).toContain('sem redefinição de __getattribute__');
  expect(aula.sections[3].text.join(' ')).toContain('classes somente com slots');
  expect(aula.sections[4].text.join(' ')).toContain('não é isolamento de segurança');
 });
});
