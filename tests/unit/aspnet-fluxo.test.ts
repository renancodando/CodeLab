import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice} from '../../src/learning/practice';

const ordem=['inicio','padrao','ajuste','limite','modo'];
it('aceita a volta interna antes da externa sem alegar execução do aluno',async()=>{
 expect(await evaluatePractice('aspnet-pipeline-prever-fluxo','entra A\r\nentra B\r\nendpoint\r\nsai B\r\nsai A')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each(['entra A\nentra B\nendpoint\nsai A\nsai B','entra A\nsai A\nentra B\nendpoint\nsai B','entra A\nentra B\nendpoint\nsai B'])('recusa ordem ou quantidade de eventos incorreta: %s',async resposta=>{
 const resultado=await evaluatePractice('aspnet-pipeline-prever-fluxo',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('camada');
});
it.each(['interpolar','renomear','rebaixar'])('recusa %s por quebrar o contrato de dados do log',async resposta=>{
 const resultado=await evaluatePractice('aspnet-pipeline-corrigir-log',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('credencial');expect(resultado.feedback).not.toContain('LogInformation(');
});
it('aceita metadados tipados sem dizer que executou C#',async()=>{
 expect(await evaluatePractice('aspnet-pipeline-corrigir-log','metadados')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('aceita a sequência completa da configuração nos formatos enviados pela interface',async()=>{
 for(const resposta of [ordem,ordem.join('\n')])expect((await evaluatePractice('aspnet-pipeline-montar-configuracao',resposta)).passed).toBe(true);
});
it('recusa a precedência inversa, leituras antecipadas e peças adulteradas',async()=>{
 for(const resposta of [['inicio','ajuste','padrao','limite','modo'],['inicio','padrao','limite','ajuste','modo'],ordem.slice(0,-1),[...ordem,'modo'],ordem.map(id=>id==='ajuste'?'padrao':id),ordem.map(id=>id==='ajuste'?'inventada':id)])expect((await evaluatePractice('aspnet-pipeline-montar-configuracao',resposta)).passed).toBe(false);
});
it('preserva a aula e separa três habilidades ao longo da leitura',()=>{
 const pausas=practicesForLesson('aspnet-pipeline');expect(pausas).toHaveLength(3);expect(pausas.map(pausa=>pausa.afterBlock)).toEqual([3,6,8]);expect(pausas.map(pausa=>pausa.capability)).toEqual(['leitura','depuracao','alteracao']);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(3);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.prompt.includes('conceitual'))).toBe(true);
});
