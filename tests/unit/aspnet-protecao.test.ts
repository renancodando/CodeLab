import {it,expect} from 'vitest';
import {lessons} from '../../src/content/curriculum';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';

const ordem=['servicos','aplicacao','middleware','rota','executar'];
const alternativa=['servicos','aplicacao','rota','middleware','executar'];
it('separa challenge, forbid e resposta permitida sem alegar execução do aluno',async()=>{
 expect(await evaluatePractice('aspnet-protecao-prever-politica','401\r\n403\r\n204')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each(['403\n403\n204','401\n401\n204','401\n403\n200'])('recusa confusão entre identidade, permissão ou handler: %s',async resposta=>{
 const resultado=await evaluatePractice('aspnet-protecao-prever-politica',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('política');
});
it.each(['papel','qualquer','cliente'])('recusa %s sem revelar a implementação correta',async resposta=>{
 const resultado=await evaluatePractice('aspnet-protecao-corrigir-recurso',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('JSON');expect(resultado.feedback).not.toContain('FindFirst(');
});
it('aceita a decisão conjunta de autenticação, papel e autoria confiável',async()=>{
 expect(await evaluatePractice('aspnet-protecao-corrigir-recurso','titular')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('aceita as duas ordens válidas de rota e middleware nos dois formatos da interface',async()=>{
 for(const linhas of [ordem,alternativa])for(const resposta of [linhas,linhas.join('\n')])expect((await evaluatePractice('aspnet-protecao-montar-limite',resposta)).passed).toBe(true);
});
it('recusa construir antes dos registros, host antecipado e peças ausentes ou adulteradas',async()=>{
 for(const resposta of [['aplicacao','servicos','middleware','rota','executar'],['servicos','aplicacao','executar','middleware','rota'],ordem.slice(0,-1),[...ordem,'rota'],ordem.map(id=>id==='middleware'?'rota':id),ordem.map(id=>id==='rota'?'inventada':id)])expect((await evaluatePractice('aspnet-protecao-montar-limite',resposta)).passed).toBe(false);
});
it('preserva a aula e distribui três habilidades sem criar autenticação no produto',()=>{
 expect(lessons.find(aula=>aula.id==='aspnet-protecao')?.body).toContain('armazenamento local');const pausas=practicesForLesson('aspnet-protecao');expect(pausas).toHaveLength(3);expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','alteracao']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.prompt.includes('conceitual'))).toBe(true);
});
