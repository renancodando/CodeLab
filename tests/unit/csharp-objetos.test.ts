import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

const ordem=['metodo','validar','descontar','sucesso','fechar'];
it.each(['0\n0\nFalse','1\n1\nTrue','1\n0\nFalse','0\n0\nTrue','1\n0','1\n0\nTrue\n0'])('distingue a previsão %s das referências compartilhadas',async resposta=>{
 const resultado=await evaluatePractice('cs-objetos-prever-referencias',resposta);expect(resultado.passed).toBe(false);expect(resultado.execution).toBe('not-run');expect(resultado.feedback).toContain('referência');
});
it('aceita a previsão com quebras de linha diferentes, sem afirmar execução',async()=>{
 const resultado=await evaluatePractice('cs-objetos-prever-referencias','1\r\n0\r\nTrue');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');expect(resultado.feedback).toContain('não houve execução');
});
it.each(['publico','inicializacao','somente-leitura'])('rejeita %s por violar acesso ou atualização',async resposta=>{
 const resultado=await evaluatePractice('cs-objetos-proteger-saldo',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('Depositar');expect(resultado.feedback).not.toContain('private set');
});
it('distingue a decisão de encapsulamento da compilação do aluno',async()=>{
 const resultado=await evaluatePractice('cs-objetos-proteger-saldo','privado');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each([ordem,ordem.join('\n')])('aceita a reconstrução que valida antes de mutar: %j',async resposta=>{
 const resultado=await evaluatePractice('cs-objetos-reconstruir-saque',resposta);expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
});
it.each([
 ['metodo','descontar','validar','sucesso','fechar'],
 ['metodo','sucesso','validar','descontar','fechar'],
 ['metodo','validar','sucesso','descontar','fechar'],
 ['validar','metodo','descontar','sucesso','fechar'],
 ['metodo','validar','fechar','descontar','sucesso'],
 ['metodo','validar','descontar','fechar','sucesso'],
 ['metodo','validar','descontar','sucesso','sucesso'],
 ['metodo','validar','descontar','sucesso','outra'],
 ordem.slice(0,4),[...ordem,'fechar'],[],[...ordem].reverse()
])('rejeita mutação cedo, retorno cedo e peças inválidas: %j',async(...linhas)=>{
 const resultado=await evaluatePractice('cs-objetos-reconstruir-saque',linhas);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('mutação');expect(resultado.evidence).toBe('conceptual');
});
it('preserva Produto, IForma, doze capítulos e o projeto de Conta',()=>{
 const aula=lessons.find(aula=>aula.id==='csharp-objetos')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(aula.code).toContain('new Produto("Caderno", 12m)');expect(aula.code).toContain('IDescritivel');expect(aula.exercise).toContain('IForma');expect(aula.solution).toContain('Retangulo');expect(aula.solution).toContain('largura * altura');
 expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.language==='csharp')).toBe(true);
 const projeto=aula.capitulos.find(capitulo=>capitulo.id==='projeto')!.paragrafos.join(' ');for(const trecho of ['Conta','centavos','revisão manual','duas instâncias','dotnet build'])expect(projeto).toContain(trecho);
 for(const pausa of pausas)expect(getPracticeSolution(pausa.id)).toBeTruthy();
});
