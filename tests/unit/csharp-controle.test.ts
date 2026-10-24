import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

const ordem=['metodo','total','percorrer','filtrar','acumular','fechar-laco','retornar','fechar-metodo'];
const alternativa=['metodo','total','percorrer','filtrar','acumular','fechar-metodo','retornar','fechar-laco'];
it.each(['14\n8\n0','2\n0\n0','14\n7\n0','5\n0','5\n0\n1'])('distingue a previsão %s das interrupções reais',async resposta=>{
 const resultado=await evaluatePractice('cs-controle-prever-interrupcoes',resposta);expect(resultado.passed).toBe(false);expect(resultado.execution).toBe('not-run');expect(resultado.feedback).toContain('laço');
});
it('aceita a previsão com quebras de linha diferentes, sem alegar execução',async()=>{
 const resultado=await evaluatePractice('cs-controle-prever-interrupcoes','5\r\n0\r\n0');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.feedback).toContain('não houve execução');
});
it.each(['excluir','extra','igual'])('rejeita a condição %s que só coincide em parte do domínio',async resposta=>{
 const resultado=await evaluatePractice('cs-controle-corrigir-limite',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('última parcela');expect(resultado.feedback).not.toContain('i <= limite');
});
it('a condição inclusiva comprova somente uma decisão conceitual',async()=>{
 const resultado=await evaluatePractice('cs-controle-corrigir-limite','incluir');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each([ordem,alternativa])('aceita a estrutura com chaves equivalentes: %j',async(...linhas)=>{
 const resultado=await evaluatePractice('cs-controle-reconstruir-retorno',linhas);expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
});
it('aceita a ordem serializada pelo histórico, sem depender da indentação das chaves',async()=>{
 expect((await evaluatePractice('cs-controle-reconstruir-retorno',alternativa.join('\n'))).passed).toBe(true);
});
it.each([
 ['metodo','total','percorrer','acumular','filtrar','fechar-laco','retornar','fechar-metodo'],
 ['metodo','total','percorrer','filtrar','acumular','retornar','fechar-laco','fechar-metodo'],
 ['metodo','percorrer','total','filtrar','acumular','fechar-laco','retornar','fechar-metodo'],
 ['metodo','total','filtrar','percorrer','acumular','fechar-laco','retornar','fechar-metodo'],
 ['metodo','total','retornar','percorrer','filtrar','acumular','fechar-laco','fechar-metodo'],
 ['metodo','total','percorrer','filtrar','acumular','fechar-laco','fechar-metodo','retornar'],
 [...ordem.slice(0,5),'fechar-laco','retornar','fechar-laco'],
 [...ordem.slice(0,5),'fechar-laco','retornar','outra'],
 ordem.slice(0,7),[...ordem,'retornar'],[],[...ordem].reverse()
])('não aceita blocos incorretos, duplicação ou omissão: %j',async(...linhas)=>{
 const resultado=await evaluatePractice('cs-controle-reconstruir-retorno',linhas);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('return');
});
it('preserva o exemplo, EhPar, projeto e preparação das três pausas',()=>{
 const aula=lessons.find(aula=>aula.id==='csharp-controle')!,pausas=practicesForLesson(aula.id);expect(aula.capitulos).toHaveLength(12);expect(aula.code).toContain('SomarAte(4)');expect(aula.exercise).toContain('EhPar');expect(aula.solution).toContain('numero % 2 == 0');
 expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.language==='csharp')).toBe(true);
 const projeto=aula.capitulos.find(capitulo=>capitulo.id==='projeto')!.paragrafos.join(' ');expect(projeto).toContain('frete');expect(projeto).toContain('revisão manual');for(const pausa of pausas)expect(getPracticeSolution(pausa.id)).toBeTruthy();
});
