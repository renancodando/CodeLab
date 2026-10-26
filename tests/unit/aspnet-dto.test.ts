import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';

const ordem=['inicio','validar','recusar','criar','responder','fechar','executar','dto'];
it('aceita a previsão com CRLF sem atribuir execução à resposta',async()=>{
 const resultado=await evaluatePractice('aspnet-dto-prever-limites','400\r\n400\r\n201\r\n400');
 expect(resultado).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each(['201\n400\n201\n400','400\n201\n201\n400','400\n400\n400\n400','400\n400\n201\n201'])('recusa a previsão que ignora uma fronteira: %s',async resposta=>{
 const resultado=await evaluatePractice('aspnet-dto-prever-limites',resposta);
 expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('limite');
});
it.each(['e','ou-bit','exclusivo'])('recusa %s sem revelar a correção antes da consulta',async resposta=>{
 const resultado=await evaluatePractice('aspnet-dto-diagnosticar-guarda',resposta);
 expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('null');expect(resultado.feedback).not.toContain('||');
});
it('aceita a decisão de curto-circuito sem alegar compilação do aluno',async()=>{
 expect(await evaluatePractice('aspnet-dto-diagnosticar-guarda','ou')).toMatchObject({passed:true,execution:'not-run'});
});
it('aceita a reconstrução integral nas duas formas enviadas pela interface',async()=>{
 for(const resposta of [ordem,ordem.join('\n')])expect(await evaluatePractice('aspnet-dto-montar-criacao',resposta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('recusa acesso antes da guarda, peças ausentes, duplicadas ou inventadas',async()=>{
 for(const resposta of [
  ['inicio','criar','validar','recusar','responder','fechar','executar','dto'],
  ordem.slice(0,-1),[...ordem,'dto'],ordem.map(id=>id==='criar'?'validar':id),ordem.map(id=>id==='dto'?'inventada':id)
 ])expect((await evaluatePractice('aspnet-dto-montar-criacao',resposta)).passed).toBe(false);
});
it('distribui três habilidades pela aula existente e explicita a atividade conceitual',()=>{
 const pausas=practicesForLesson('aspnet-dto');expect(pausas).toHaveLength(3);
 expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);
 expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','alteracao']);
 expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);
 expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.prompt.includes('conceitual'))).toBe(true);
});
