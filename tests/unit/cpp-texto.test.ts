import {it,expect} from 'vitest';
import {practicesForLesson} from '../../src/content/practice';
import {evaluatePractice,getPracticeSolution} from '../../src/learning/practice';
import cpp from '../../src/content/deep/cpp';

it('aceita a previsão com quatro estados sem alegar compilação da resposta',async()=>{
 const resposta=getPracticeSolution('cpp-texto-prever-conversao')!.replaceAll('\n','\r\n');
 expect(await evaluatePractice('cpp-texto-prever-conversao',resposta)).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it.each([
 'false false 99\ntrue true 12\nfalse false 99\nfalse true 99',
 'true true 12\ntrue true 12\nfalse false 99\nfalse true 99',
 'true false 12\ntrue true 12\nfalse false 99\ntrue true 99'
])('recusa confundir sucesso, consumo e erro: %s',async resposta=>{
 const resultado=await evaluatePractice('cpp-texto-prever-conversao',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('Texto residual');expect(resultado.feedback).not.toContain('true false 12');
});
it.each(['so-erro','so-consumo','conjuncao'])('recusa a condição %s sem entregar a linha correta',async resposta=>{
 const resultado=await evaluatePractice('cpp-texto-corrigir-inteiro',resposta);expect(resultado.passed).toBe(false);expect(resultado.feedback).toContain('separadamente');expect(resultado.feedback).not.toContain('||');
});
it('aprova o diagnóstico como evidência conceitual',async()=>{
 expect(await evaluatePractice('cpp-texto-corrigir-inteiro','ambos')).toMatchObject({passed:true,evidence:'conceptual',execution:'not-run'});
});
it('preserva os programas e os dois problemas abertos e acrescenta contratos próprios',()=>{
 const aula=cpp.lessons.find(aula=>aula.id==='cpp-texto-conversao')!;const pausas=practicesForLesson(aula.id);
 expect(aula.practices?.map(problema=>problema.id)).toEqual(['linhas','inteiro']);expect(aula.sections.length).toBeGreaterThanOrEqual(6);expect(pausas).toHaveLength(2);expect(new Set(pausas.flatMap(pausa=>pausa.skillIds)).size).toBe(2);expect(pausas.every(pausa=>pausa.requiresConcept&&pausa.language==='cpp')).toBe(true);
});
