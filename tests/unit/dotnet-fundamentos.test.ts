import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

const ordensValidas=new Set(['centavos,preco,quantidade,saida','centavos,quantidade,preco,saida','quantidade,centavos,preco,saida']);
function permutar(linhas:string[]):string[][]{
 return linhas.length?linhas.flatMap((linha,indice)=>permutar(linhas.filter((_,outro)=>outro!==indice)).map(resto=>[linha,...resto])):[[]];
}
it.each(['2\n2.5\n2.5','2.5\n2.5\n2.5','2\n2.0\n2.0','2\n2\n2.5'])('distingue a previsão %s de uma conversão antes da divisão',async resposta=>{
 const resultado=await evaluatePractice('cs-dotnet-prever-divisao',resposta);
 expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('fração');expect(resultado.feedback).toContain('conceitual');expect(resultado.execution).toBe('not-run');
});
it('aceita a previsão com formato determinado e sem declarar execução C#',async()=>{
 const resultado=await evaluatePractice('cs-dotnet-prever-divisao','2\r\n2.0\r\n2.5');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each(['inferir','inteiro','depois'])('o diagnóstico rejeita %s sem entregar a linha correta',async resposta=>{
 const resultado=await evaluatePractice('cs-dotnet-diagnosticar-inferencia',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('resultado');expect(resultado.feedback).not.toContain('7.25m');
});
it('o diagnóstico correto continua sendo decisão conceitual',async()=>{
 const resultado=await evaluatePractice('cs-dotnet-diagnosticar-inferencia','decimal');expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');expect(resultado.evidence).toBe('conceptual');
});
it.each(permutar(['centavos','preco','quantidade','saida']))('confere dependências na ordem %j',async(...ordem)=>{
 const resultado=await evaluatePractice('cs-dotnet-reconstruir-total',ordem);expect(resultado.passed).toBe(ordensValidas.has(ordem.join(',')));expect(resultado.execution).toBe('not-run');
});
it.each([[],['centavos','preco','saida'],['centavos','preco','quantidade','saida','saida'],['centavos','preco','preco','saida'],['centavos','preco','outro','saida']])('não aceita linhas ausentes, repetidas ou injetadas: %j',async(...ordem)=>{
 expect((await evaluatePractice('cs-dotnet-reconstruir-total',ordem)).passed).toBe(false);
});
it('aceita uma ordem alternativa serializada como o histórico e preserva a solução',async()=>{
 const ordem='quantidade\ncentavos\npreco\nsaida';expect((await evaluatePractice('cs-dotnet-reconstruir-total',ordem)).passed).toBe(true);
 expect(getPracticeSolution('cs-dotnet-reconstruir-total')).toContain('centavos / 100m');
});
it('preserva doze capítulos, aplicação própria e três habilidades distintas',()=>{
 const aula=lessons.find(aula=>aula.id==='dotnet')!,pausas=practicesForLesson(aula.id);expect(aula.capitulos).toHaveLength(12);expect(aula.exercise).toContain('7.25');expect(aula.code).toContain('12.50m');
 expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.language==='csharp')).toBe(true);
 expect(aula.capitulos.find(capitulo=>capitulo.id==='projeto')!.paragrafos.join(' ')).toContain('revisão manual');for(const pausa of pausas)expect(getPracticeSolution(pausa.id)).toBeTruthy();
});
