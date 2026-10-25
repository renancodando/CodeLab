import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

it.each(['4\nfim\nrecusa\nfim\n-1','fim\n4\nrecusa\n-1\nfim','4\nrecusa\n-1','fim\n4\nfim\n-1','fim\n4\nrecusa\nfim','fim\n4\nrecusa\nfim\n-1\nfim'])('rejeita a previsão %s que perde a passagem por finally',async resposta=>{
 const resultado=await evaluatePractice('cs-async-prever-finally',resposta);expect(resultado.passed).toBe(false);expect(resultado.execution).toBe('not-run');expect(resultado.feedback).toContain('finally');
});
it('aceita a previsão com CRLF sem alegar execução C#',async()=>{
 const resultado=await evaluatePractice('cs-async-prever-finally','fim\r\n4\r\nrecusa\r\nfim\r\n-1');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each(['generica','aritmetica','divisao'])('rejeita o catch %s que não distingue o erro esperado',async resposta=>{
 const resultado=await evaluatePractice('cs-async-diagnosticar-teste',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('próprio teste');expect(resultado.feedback).not.toContain('catch (ArgumentException)');
});
it('reconhece a captura específica como decisão conceitual',async()=>{
 const resultado=await evaluatePractice('cs-async-diagnosticar-teste','especifica');expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
});
it.each([
 'await leitor.ReadToEndAsync(token)',
 'await leitor . ReadToEndAsync ( token )',
 'await\nleitor.ReadToEndAsync(\ntoken\n)',
 'await leitor.ReadToEndAsync(token).ConfigureAwait(false)',
 'await leitor . ReadToEndAsync ( token ) . ConfigureAwait ( true )'
])('aceita a expressão de espera %s dentro do contrato explícito',async resposta=>{
 const resultado=await evaluatePractice('cs-async-aguardar-leitura',resposta);expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');expect(resultado.evidence).toBe('conceptual');
});
it.each([
 'leitor.ReadToEndAsync(token)','leitor.ReadToEndAsync(token).Result','leitor.ReadToEnd()',
 'await leitor.ReadToEndAsync()','await leitor.ReadToEndAsync(CancellationToken.None)',
 'await outro.ReadToEndAsync(token)','await leitor.ReadToEndAsync(out token)',
 'await leitor.ReadToEndAsync(token).ConfigureAwait(0)',
 'await leitor.ReadToEndAsync(token); leitor.Dispose()',
 'await leitor.ReadToEndAsync(token) + ""','await leitor.readToEndAsync(token)',
 'Task.Run(() => leitor.ReadToEnd())','await leitor.ReadToEndAsync(token);',
 'await leitor.ReadToEndAsync(token).GetAwaiter().GetResult()',''
])('rejeita %s sem prometer compilar uma expressão livre',async resposta=>{
 const resultado=await evaluatePractice('cs-async-aguardar-leitura',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('using');expect(resultado.feedback).not.toContain(getPracticeSolution('cs-async-aguardar-leitura')!);expect(resultado.execution).toBe('not-run');
});
it('preserva divisão, exercício original, capítulos, leitor e projeto JSON',()=>{
 const aula=lessons.find(aula=>aula.id==='csharp-async')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(aula.code).toContain('Dividir(8,2)');expect(aula.code).toContain('ArgumentException');expect(aula.exercise).toContain('divisor negativo');expect(aula.solution).toContain('Dividir(8,-2)==-4');
 expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(pausas.map(pausa=>pausa.kind)).toEqual(['predict','choice','fill']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.language==='csharp')).toBe(true);
 expect(pausas[2].code).toContain('using (leitor)');expect(pausas[2].prompt).toContain('exclusivamente');
 const projeto=aula.capitulos.find(capitulo=>capitulo.id==='projeto')!.paragrafos.join(' ');for(const trecho of ['JSON','ausente','inválido','cancelamento','revisão manual','dotnet test'])expect(projeto.toLowerCase()).toContain(trecho.toLowerCase());
 for(const pausa of pausas)expect(getPracticeSolution(pausa.id)).toBeTruthy();
});
