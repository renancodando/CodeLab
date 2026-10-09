import {describe,it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import html from '../../src/content/deep/html';

describe('imagens e contexto HTML',()=>{
 it.each(['arquivo','decorativa'])('a alternativa %s não nomeia a ação do link',async resposta=>{
  const falha=await evaluatePractice('html-imagem-destino',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('nome do link');
  expect(falha.feedback).not.toContain('alt="Abrir relatório');
  const correta=await evaluatePractice('html-imagem-destino','destino');
  expect(correta.passed).toBe(true);expect(correta.evidence).toBe('conceptual');expect(correta.execution).toBe('not-run');
 });
 it.each(['50vw','720w','600px','100%'])('rejeita %s no tamanho em vw pedido pelo contrato',async resposta=>{
  const falha=await evaluatePractice('html-completar-sizes',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('sizes não cria o layout');
  expect((await evaluatePractice('html-completar-sizes',getPracticeSolution('html-completar-sizes')!)).passed).toBe(true);
 });
 it.each([
  ['abrir','ampla','compacta','fallback','fechar'],
  ['abrir','fallback','compacta','ampla','fechar'],
  ['abrir','compacta','compacta','fallback','fechar']
 ])('rejeita ordem, duplicata ou fallback antecipado: %j',async(...resposta)=>{
  const falha=await evaluatePractice('html-ordenar-picture',resposta);
  expect(falha.passed).toBe(false);expect(falha.feedback).toContain('source aplicável');
  const correta=await evaluatePractice('html-ordenar-picture',['abrir','compacta','ampla','fallback','fechar']);
  expect(correta.passed).toBe(true);expect(correta.execution).toBe('not-run');
 });
 it('leva prática à aula de mídia conservando suas seis seções e exemplos SVG',()=>{
  const aula=html.lessons.find(aula=>aula.id==='html-midia')!;
  const pausas=practicesForLesson(aula.id);
  expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([1,2,5]);
  expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);
  expect(pausas.every(pausa=>pausa.requiresConcept)).toBe(true);
  expect(aula.sections).toHaveLength(6);
  expect(aula.sections[0].text.join(' ')).toContain('apenas uma imagem');
  expect(aula.sections[1].text.join(' ')).toContain('primeira source');
  expect(aula.code).toContain('titulo-grafico descricao-grafico');
  expect(aula.solution).toContain('3 de 5 sessões');
 });
});
