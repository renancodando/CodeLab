import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';

const ordem=['construtor','aplicacao','dobro','validar','retornar','fechar','saude','executar'];
const alternativa=['construtor','aplicacao','saude','dobro','validar','retornar','fechar','executar'];
it.each(['200\n400\n405','200\n404\n404','200\n200\n200','404\n404\n405','200\n404','200\n404\n405\n200'])('rejeita a previsão %s que confunde rota, binding ou método',async resposta=>{
 const resultado=await evaluatePractice('aspnet-projeto-prever-rotas',resposta);expect(resultado.passed).toBe(false);expect(resultado.execution).toBe('not-run');expect(resultado.feedback).toContain('restrição');
});
it('aceita status com CRLF sem alegar execução do servidor',async()=>{
 const resultado=await evaluatePractice('aspnet-projeto-prever-rotas','200\r\n404\r\n405');expect(resultado.passed).toBe(true);expect(resultado.evidence).toBe('conceptual');expect(resultado.execution).toBe('not-run');
});
it.each(['manter','ambos','caminho'])('rejeita %s por não atender aos dois métodos do contrato',async resposta=>{
 const resultado=await evaluatePractice('aspnet-projeto-corrigir-metodo',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('POST');expect(resultado.feedback).not.toContain('MapGet');
});
it('a correção do método é conceitual, sem abrir servidor do aluno',async()=>{
 const resultado=await evaluatePractice('aspnet-projeto-corrigir-metodo','leitura');expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
});
it.each([ordem,alternativa].flatMap(linhas=>[{resposta:linhas},{resposta:linhas.join('\n')}]))('aceita registros independentes nas duas ordens: $resposta',async({resposta})=>{
 const resultado=await evaluatePractice('aspnet-projeto-montar-api',resposta);expect(resultado.passed).toBe(true);expect(resultado.execution).toBe('not-run');
});
it.each([
 ['construtor','aplicacao','dobro','retornar','validar','fechar','saude','executar'],
 ['aplicacao','construtor','dobro','validar','retornar','fechar','saude','executar'],
 ['construtor','saude','aplicacao','dobro','validar','retornar','fechar','executar'],
 ['construtor','aplicacao','dobro','saude','validar','retornar','fechar','executar'],
 ['construtor','aplicacao','dobro','validar','saude','retornar','fechar','executar'],
 ['construtor','aplicacao','dobro','validar','retornar','saude','fechar','executar'],
 ['construtor','aplicacao','dobro','validar','retornar','fechar','executar','saude'],
 ['construtor','aplicacao','executar','dobro','validar','retornar','fechar','saude'],
 ['construtor','aplicacao','dobro','validar','fechar','retornar','saude','executar'],
 ['construtor','aplicacao','dobro','validar','retornar','fechar','saude','saude'],
 ['construtor','aplicacao','dobro','validar','retornar','fechar','saude','outro'],
 ordem.slice(0,7),[...ordem,'saude'],[],[...ordem].reverse()
])('rejeita dependências, escopos e peças incorretas: %j',async(...linhas)=>{
 const resultado=await evaluatePractice('aspnet-projeto-montar-api',linhas);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('validação');expect(resultado.evidence).toBe('conceptual');
});
it('preserva exemplo, exercício original, capítulos e projeto HTTP manual',()=>{
 const aula=lessons.find(aula=>aula.id==='aspnet-projeto')!,pausas=practicesForLesson(aula.id);
 expect(aula.capitulos).toHaveLength(12);expect(aula.code).toContain('MapGet("/saude"');expect(aula.code).toContain('status = "ok"');expect(aula.solution).toContain('/dobro/{numero:int}');expect(aula.exercise).toContain('/dobro/abc');
 expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.language==='csharp')).toBe(true);
 const projeto=aula.capitulos.find(capitulo=>capitulo.id==='projeto')!.paragrafos.join(' ');for(const trecho of ['health check','criação validado em memória','Revisão manual','dotnet build','dotnet'])expect(projeto).toContain(trecho);
 for(const pausa of pausas)expect(getPracticeSolution(pausa.id)).toBeTruthy();
});
