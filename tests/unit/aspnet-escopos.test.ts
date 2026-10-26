import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';

const ordem=['colecao','recurso','relatorio','provedor','escopo','resolver','usar','fechar'];
const alternativa=['colecao','relatorio','recurso','provedor','escopo','resolver','usar','fechar'];

it.each(['False\n1\n0','True\n0\n0','True\n1\n1','False\n0\n0','True\n1','True\n1\n0\n0'])('rejeita a previsão %s que confunde identidade e duração',async resposta=>{
 const resultado=await evaluatePractice('aspnet-di-prever-instancias',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('escopo');expect(resultado.execution).toBe('not-run');
});
it.each(['True\r\n1\r\n0','true\n1\n0'])('aceita previsão %s sem afirmar execução do aluno',async resposta=>{
 const resultado=await evaluatePractice('aspnet-di-prever-instancias',resposta);expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each(['silenciar','compartilhar','transiente'])('rejeita %s por conservar estado entre pedidos',async resposta=>{
 const resultado=await evaluatePractice('aspnet-di-corrigir-captura',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('singleton');expect(resultado.feedback).not.toContain('AddScoped');
});
it('aceita corrigir a duração de quem conserva a dependência',async()=>{
 const resultado=await evaluatePractice('aspnet-di-corrigir-captura','escopo');expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
});
it.each([ordem,alternativa].flatMap(linhas=>[{resposta:linhas},{resposta:linhas.join('\r\n')}]))('aceita registros independentes nas duas ordens: $resposta',async({resposta})=>{
 const resultado=await evaluatePractice('aspnet-di-montar-escopo',resposta);expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each([
 ['colecao','recurso','provedor','relatorio','escopo','resolver','usar','fechar'],
 ['colecao','relatorio','provedor','recurso','escopo','resolver','usar','fechar'],
 ['recurso','colecao','relatorio','provedor','escopo','resolver','usar','fechar'],
 ['colecao','recurso','relatorio','escopo','provedor','resolver','usar','fechar'],
 ['colecao','recurso','relatorio','provedor','resolver','escopo','usar','fechar'],
 ['colecao','recurso','relatorio','provedor','escopo','usar','resolver','fechar'],
 ['colecao','recurso','relatorio','provedor','escopo','resolver','fechar','usar'],
 ['colecao','recurso','recurso','provedor','escopo','resolver','usar','fechar'],
 ['colecao','recurso','relatorio','provedor','escopo','resolver','usar','inventada'],
 ordem.slice(0,-1),
 [...ordem,'fechar']
].map(resposta=>({resposta})))('recusa registros tardios, uso fora do escopo ou peças alteradas: $resposta',async({resposta})=>{
 const resultado=await evaluatePractice('aspnet-di-montar-escopo',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('provedor');expect(resultado.feedback).not.toContain('GetRequiredService');
});
it('preserva a aula e distribui habilidades diferentes sem criar nova aula',()=>{
 expect(lessons.find(aula=>aula.id==='aspnet-di')?.title).toBe('Injeção de dependência e serviços');
 const pausas=practicesForLesson('aspnet-di');expect(pausas).toHaveLength(3);expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','alteracao']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);
 expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.language==='csharp')).toBe(true);
});
